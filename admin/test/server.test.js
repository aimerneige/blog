import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import { createApp, parsePost, updatePost, safePath } from '../server.js';

const sample = '---\ntitle: "Original" # keep comment\ndate: 2023-01-01T10:00:00+08:00\ncustom:\n  nested: [one, two]\n# tail\ndraft: false\n---\n\nHello\n';
test('front matter preserves unchanged bytes, unknown nodes, comments and ordering', () => {
  const parsed = parsePost(sample);
  assert.equal(updatePost(sample, { title: 'Original' }, parsed.body), sample);
  const updated = updatePost(sample, { title: 'Changed' }, parsed.body);
  assert.deepEqual(parsePost(updated).data.custom, parsed.data.custom);
  assert.ok(updated.includes('# keep comment'));
  assert.ok(updated.includes('# tail'));
  assert.ok(updated.indexOf('title:') < updated.indexOf('custom:'));
  assert.ok(updated.indexOf('custom:') < updated.indexOf('draft:'));
  assert.throws(() => updatePost(sample, { custom: null }, ''), /不可编辑/);
});
test('API CRUD and security use an isolated BLOG_ROOT fixture', async t => {
  const token = 'test-admin-token-at-least-16';
  const previousToken = process.env.ADMIN_TOKEN;
  process.env.ADMIN_TOKEN = token;
  t.after(() => { if (previousToken === undefined) delete process.env.ADMIN_TOKEN; else process.env.ADMIN_TOKEN = previousToken; });
  const authorization = { Authorization: `Bearer ${token}` };
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-admin-'));
  await fs.mkdir(path.join(root,'content/post/Test'),{recursive:true});
  await fs.mkdir(path.join(root,'static'),{recursive:true});
  await fs.writeFile(path.join(root,'content/post/Test/example.zh.md'),sample);
  const server = createApp(root);
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{ await new Promise(resolve=>server.close(resolve)); await fs.rm(root,{recursive:true,force:true}); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (route,data,headers={}) => fetch(`${base}/api/${route}`,data === undefined ? {headers:{...authorization,...headers}} : {method:'POST',headers:{'Content-Type':'application/json',...authorization,...headers},body:JSON.stringify(data)});
  assert.deepEqual(await (await fetch(base + '/api/posts')).json(), {error:'未授权'});
  assert.equal((await fetch(base + '/api/posts')).status,401);
  assert.equal((await request('posts',undefined,{Authorization:'Bearer wrong'})).status,401);
  assert.deepEqual(await (await fetch(base + '/api/session')).json(),{authenticated:false});
  const login = value => fetch(base + '/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:value})});
  assert.equal((await login('wrong')).status,401);
  const loggedIn = await login(token);
  assert.equal(loggedIn.status,200);
  const setCookie = loggedIn.headers.get('set-cookie');
  assert.match(setCookie,/HttpOnly; SameSite=Strict; Path=\//);
  assert.ok(!setCookie.includes(token));
  const cookie = setCookie.split(';')[0];
  assert.equal(cookie,`admin_session=${createHmac('sha256',token).update('blog-admin-session-v1').digest('hex')}`);
  for (const nextToken of [token, token + '-changed']) {
    process.env.ADMIN_TOKEN = nextToken;
    const restarted = createApp(root);
    process.env.ADMIN_TOKEN = token;
    await new Promise(resolve => restarted.listen(0,'127.0.0.1',resolve));
    try {
      const response = await fetch(`http://127.0.0.1:${restarted.address().port}/api/posts`,{headers:{Cookie:cookie}});
      assert.equal(response.status,nextToken === token ? 200 : 401);
    } finally { await new Promise(resolve => restarted.close(resolve)); }
  }
  assert.equal((await fetch(base + '/api/posts',{headers:{Cookie:cookie}})).status,200);
  assert.deepEqual(await (await fetch(base + '/api/session',{headers:{Cookie:cookie}})).json(),{authenticated:true});
  const logout = await fetch(base + '/api/logout',{method:'POST'});
  assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
  assert.equal((await fetch(base + '/api/posts',{headers:{Cookie:logout.headers.get('set-cookie').split(';')[0]}})).status,401);
  for (let i=0;i<9;i++) assert.equal((await login('wrong')).status,401);
  assert.equal((await login('wrong')).status,429);
  const index = await fetch(base);
  assert.equal(index.status,200);
  const asset = /src="([^"]+\.js)"/.exec(await index.text())[1];
  assert.equal((await fetch(base + asset)).status,200);
  assert.equal((await request('posts',undefined,{Origin:'https://evil.test'})).status,403);
  const badHost = await new Promise((resolve,reject) => {
    const req = http.get(`${base}/api/posts`,{headers:{Host:'evil.test'}},res=>{ res.resume(); resolve(res.statusCode); }); req.on('error',reject);
  });
  assert.equal(badHost,403);
  const localHeaders = {Host:`localhost:${server.address().port}`, Origin:`http://localhost:${server.address().port}`};
  const hostRequest = headers => new Promise((resolve,reject) => {
    const req = http.get(`${base}/api/posts`,{headers:{...authorization,...headers}},res => { res.resume(); resolve(res.statusCode); }); req.on('error',reject);
  });
  assert.equal(await hostRequest(localHeaders),200);
  assert.equal(await hostRequest({...localHeaders,Origin:base}),403);
  assert.equal(await hostRequest({Origin:'http://127.0.0.1:5173'}),403);
  const previousDev = process.env.ADMIN_DEV;
  process.env.ADMIN_DEV = '1';
  try {
    assert.equal(await hostRequest({Origin:'http://127.0.0.1:5173'}),200);
    assert.equal(await hostRequest({Origin:'http://localhost:5173'}),200);
    assert.equal(await hostRequest({Origin:'http://127.0.0.1:5174'}),403);
    assert.equal(await hostRequest({Origin:'https://evil.test'}),403);
  } finally {
    if (previousDev === undefined) delete process.env.ADMIN_DEV;
    else process.env.ADMIN_DEV = previousDev;
  }
  for (const relative of ['../config.yml','/etc/passwd','post/../../config.yml','post\\x.md']) await assert.rejects(safePath(root,relative));
  await fs.symlink(os.tmpdir(),path.join(root,'content','escape'));
  await assert.rejects(safePath(root,'escape/out.md'),/符号链接/);
  assert.equal((await request('post?path=..%2Fconfig.md')).status,400);
  const list = await (await request('posts')).json(); assert.equal(list.posts.length,1); assert.equal(list.posts[0].language,'zh');
  const name='post/Test/example.zh.md';
  const post = await (await request(`post?path=${name}`)).json();
  const before = await fs.stat(path.join(root,'content',name));
  assert.equal((await request('save',{path:name,fields:{title:'Original'},body:post.body,revision:post.revision})).status,200);
  assert.equal((await fs.stat(path.join(root,'content',name))).mtimeMs,before.mtimeMs);
  assert.equal((await request('save',{path:name,fields:{title:'Updated'},body:'New body',revision:post.revision})).status,200);
  assert.equal((await request('save',{path:name,fields:{},body:'stale',revision:post.revision})).status,409);
  const created = await (await request('create',{category:'New',slug:'new-post',language:'both'})).json(); assert.equal(created.paths.length,2);
  assert.equal((await request('create',{category:'New',slug:'new-post',language:'both'})).status,409);
  assert.equal((await request('move',{path:name,target:'post/New/moved.zh.md'})).status,200);
  assert.equal((await request('post?path='+name)).status,404);
  const deleted = await (await request('delete',{path:'post/New/moved.zh.md'})).json();
  assert.equal(await fs.readFile(path.join(root,deleted.trash),'utf8').then(v=>parsePost(v).body),'New body');
  const upload = await (await request('upload',{name:'a.png',data:Buffer.from('fixture').toString('base64')})).json();
  assert.equal(await fs.readFile(path.join(root,'static',upload.url),'utf8'),'fixture');
  assert.equal((await fetch(base + upload.url)).status,401);
  const image = await fetch(base + upload.url,{headers:{Cookie:cookie}});
  assert.equal(image.status,200); assert.equal(image.headers.get('content-type'),'image/png');
  assert.equal(await image.text(),'fixture');
  assert.equal((await fetch(base + upload.url,{method:'POST',headers:authorization})).status,405);
  await fs.symlink(os.tmpdir(),path.join(root,'static','escape'));
  assert.equal((await fetch(base + '/escape/file.png')).status,400);
  assert.equal((await fetch(base + '/images/%2e%2e%2f%2e%2e%2fsecret.png',{headers:authorization})).status,400);
  assert.equal((await fetch(base + '/missing.png')).status,404);
  assert.equal((await request('upload',{name:'x.html',data:''})).status,400);
  assert.equal((await request('move',{path:created.paths[0],target:'../escape.md'})).status,400);
});
test('server and dev refuse missing or empty ADMIN_TOKEN', () => {
  for (const script of ['server.js','dev.js']) for (const value of [undefined,'']) {
    const env = {...process.env};
    if (value === undefined) delete env.ADMIN_TOKEN; else env.ADMIN_TOKEN = value;
    const result = spawnSync(process.execPath,[script],{cwd:new URL('..',import.meta.url),env,encoding:'utf8',timeout:10000});
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/ADMIN_TOKEN=xxx npm --prefix admin start/);
  }
});
