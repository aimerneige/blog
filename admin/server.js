import http from 'node:http';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import YAML from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const editable = new Set(['title', 'date', 'draft', 'ShowToc', 'tags', 'categories', 'summary', 'description', 'url', 'layout', 'cover']);
const fail = (message, status = 400) => Object.assign(new Error(message), { status });
export function parsePost(raw) {
  const match = /^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/.exec(raw);
  if (!match) throw fail('需要 YAML front matter');
  const doc = YAML.parseDocument(match[2]);
  if (doc.errors.length || !YAML.isMap(doc.contents)) throw fail('无效的 YAML front matter');
  return { doc, data: doc.toJS(), body: raw.slice(match[0].length), match };
}
export function updatePost(raw, fields, body) {
  const { doc, data, match } = parsePost(raw);
  let changed = false;
  for (const [key, value] of Object.entries(fields)) {
    if (!editable.has(key)) throw fail(`不可编辑字段：${key}`);
    if (JSON.stringify(data[key]) !== JSON.stringify(value)) { doc.set(key, value); changed = true; }
  }
  return (changed ? `${match[1]}${String(doc).trimEnd()}${match[3]}` : match[0]) + body;
}
const revision = raw => createHash('sha256').update(raw).digest('hex');
export async function safePath(root, relative, area = 'content') {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes('\0') || path.isAbsolute(relative) || relative.split('/').includes('..')) throw fail('路径无效');
  const base = path.resolve(root, area);
  const target = path.resolve(base, relative);
  if (!target.startsWith(base + path.sep)) throw fail('路径越界');
  // 逐级拒绝符号链接，包括尚不存在的文件的父目录。
  let current = root;
  for (const part of path.relative(root, target).split(path.sep)) {
    current = path.join(current, part);
    try { if ((await fs.lstat(current)).isSymbolicLink()) throw fail('不允许符号链接'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return target;
}
async function walk(dir, prefix = '') {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path.join(dir, entry.name), relative));
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(relative);
  }
  return result;
}
function command(root, executable, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { cwd: root, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    let output = '';
    const capture = chunk => { output = (output + chunk).slice(-200000); };
    child.stdout.on('data', capture); child.stderr.on('data', capture);
    child.on('error', reject); child.on('close', code => resolve({ code, output }));
  });
}
export function createApp(root) {
  root = path.resolve(root);
  let preview, busy = false, logs = '';
  const previewPort = Number(process.env.HUGO_PORT || 1313);
  const server = http.createServer(async (req, res) => {
    const send = (data, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    try {
      const expected = `127.0.0.1:${server.address().port}`;
      if (req.headers.host !== expected || (req.headers.origin && req.headers.origin !== `http://${expected}`)) throw fail('仅允许本地同源请求', 403);
      const url = new URL(req.url, `http://${expected}`);
      if (!url.pathname.startsWith('/api/')) {
        if (req.method !== 'GET') throw fail('方法不允许', 405);
        const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
        const item = files[url.pathname]; if (!item) throw fail('不存在', 404);
        res.writeHead(200, { 'Content-Type': `${item[1]}; charset=utf-8`, 'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self'; script-src 'self'; frame-src 'none'; object-src 'none'" });
        res.end(await fs.readFile(path.join(here, 'web', item[0]))); return;
      }
      let input = {};
      if (req.method === 'POST') {
        if (!req.headers['content-type']?.startsWith('application/json')) throw fail('需要 JSON', 415);
        let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 16000000) throw fail('请求过大', 413); }
        input = JSON.parse(raw);
      } else if (req.method !== 'GET') throw fail('方法不允许', 405);
      const route = `${req.method} ${url.pathname}`;
      const postPath = async name => { if (!name?.endsWith('.md')) throw fail('需要 Markdown 路径'); return safePath(root, name); };
      if (route === 'GET /api/posts') {
        const posts = [];
        for (const name of await walk(path.join(root, 'content'))) {
          try {
            const { data } = parsePost(await fs.readFile(await postPath(name), 'utf8'));
            posts.push({ ...data, path: name, language: /\.(en|zh)\.md$/.exec(name)?.[1] || 'en', section: name.startsWith('post/') ? name.split('/').slice(1, -1).join('/') || 'post' : name.split('/')[0] });
          } catch (error) { posts.push({ path: name, title: name, error: error.message }); }
        }
        const folders = (await fs.readdir(path.join(root, 'content/post'), { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name);
        send({ posts, folders });
      } else if (route === 'GET /api/post') {
        const raw = await fs.readFile(await postPath(url.searchParams.get('path')), 'utf8');
        const { data, body } = parsePost(raw); send({ fields: data, body, revision: revision(raw) });
      } else if (route === 'POST /api/save') {
        const target = await postPath(input.path), raw = await fs.readFile(target, 'utf8');
        if (revision(raw) !== input.revision) throw fail('文件已被其他编辑器修改，请重新打开', 409);
        if (typeof input.body !== 'string') throw fail('正文无效');
        const next = updatePost(raw, input.fields, input.body);
        if (next !== raw) await fs.writeFile(target, next);
        send({ revision: revision(next) });
      } else if (route === 'POST /api/create') {
        if (!/^[\p{L}\p{N}_-]+$/u.test(input.slug) || !/^[\p{L}\p{N}_ -]+$/u.test(input.category)) throw fail('分类或 slug 无效');
        if (!['en', 'zh', 'both'].includes(input.language)) throw fail('语言无效');
        const names = (input.language === 'both' ? ['en', 'zh'] : [input.language]).map(lang => `post/${input.category}/${input.slug}.${lang}.md`);
        for (const name of names) { try { await fs.access(await postPath(name)); throw fail('文件已存在', 409); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
        for (const name of names) {
          const target = await postPath(name); await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, `---\n${YAML.stringify({ title: input.title || input.slug.replaceAll('-', ' '), date: new Date().toISOString().replace('Z', '+00:00'), draft: true, ShowToc: true, categories: [input.category], tags: [] })}---\n\n`, { flag: 'wx' });
        }
        send({ paths: names });
      } else if (route === 'POST /api/move') {
        const source = await postPath(input.path), target = await postPath(input.target);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.link(source, target); await fs.unlink(source); send({ ok: true });
      } else if (route === 'POST /api/delete') {
        const source = await postPath(input.path);
        const target = await safePath(root, `.admin-trash/${randomUUID()}/${input.path}`);
        // 使用非 md 后缀，避免 Hugo 将回收站中的文章发布。
        await fs.mkdir(path.dirname(target), { recursive: true }); await fs.rename(source, `${target}.deleted`); send({ trash: `${path.relative(root, target)}.deleted` });
      } else if (route === 'POST /api/upload') {
        if (!/\.(png|jpe?g|gif|webp|avif)$/i.test(input.name)) throw fail('仅支持 PNG/JPEG/GIF/WebP/AVIF');
        const name = `${randomUUID()}${path.extname(input.name).toLowerCase()}`;
        const target = await safePath(root, `images/${name}`, 'static');
        await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, Buffer.from(input.data, 'base64'), { flag: 'wx' }); send({ url: `/images/${name}` });
      } else if (route === 'GET /api/git') {
        const status = await command(root, 'git', ['status', '--short', '--', 'content', 'static']);
        const diff = await command(root, 'git', ['diff', 'HEAD', '--', 'content', 'static']); send({ status, diff });
      } else if (route === 'POST /api/commit') {
        if (busy) throw fail('操作进行中', 409);
        if (typeof input.message !== 'string' || !input.message.trim()) throw fail('请输入提交信息');
        busy = true;
        try {
          const staged = await command(root, 'git', ['diff', '--cached', '--name-only']);
          if (staged.code || staged.output.trim()) throw fail('暂存区已有文件，请先在终端处理');
          const add = await command(root, 'git', ['add', '--', 'content', 'static']);
          send(add.code ? add : await command(root, 'git', ['-c', 'core.hooksPath=/dev/null', 'commit', '-m', input.message, '--', 'content', 'static']));
        } finally { busy = false; }
      } else if (route === 'POST /api/build') {
        if (busy) throw fail('操作进行中', 409); busy = true;
        try { send(await command(root, 'hugo', ['--minify'])); } finally { busy = false; }
      } else if (route === 'GET /api/preview') send({ running: Boolean(preview), url: `http://127.0.0.1:${previewPort}/`, logs });
      else if (route === 'POST /api/preview') {
        if (input.action === 'stop') { preview?.kill(); send({ ok: true }); }
        else if (input.action === 'start') {
          if (!preview) {
            logs = ''; const child = spawn('hugo', ['server', '-D', '--bind', '127.0.0.1', '--port', String(previewPort), '--baseURL', `http://127.0.0.1:${previewPort}/`], { cwd: root }); preview = child;
            const capture = chunk => { logs = (logs + chunk).slice(-100000); }; child.stdout.on('data', capture); child.stderr.on('data', capture);
            child.on('error', error => { capture(error.message); if (preview === child) preview = undefined; }); child.on('close', code => { capture(`\n退出：${code}`); if (preview === child) preview = undefined; });
          } send({ ok: true });
        } else throw fail('操作无效');
      } else throw fail('不存在', 404);
    } catch (error) { send({ error: error.message }, error.status || (error.code === 'ENOENT' ? 404 : 400)); }
  });
  server.on('close', () => preview?.kill());
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createApp(process.env.BLOG_ROOT || path.join(here, '..'));
  server.listen(Number(process.env.PORT || 4321), '127.0.0.1', () => console.log(`博客管理：http://127.0.0.1:${server.address().port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
