const $ = id => document.getElementById(id);
let posts = [], folders = [], current, original, dirty = false;
const known = ['title','date','draft','ShowToc','tags','categories','summary','description','url','layout','cover'];
const say = text => { $('message').textContent = text; };
async function api(route, data) {
  const response = await fetch(`/api/${route}`, data === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const value = await response.json(); if (!response.ok) throw Error(value.error); return value;
}
function button(text, action) { const el = document.createElement('button'); el.textContent = text; el.onclick = action; return el; }
function panel(title) { $('panelTitle').textContent = title; $('panelBody').replaceChildren(); if (!$('panel').open) $('panel').showModal(); return $('panelBody'); }
function pre(parent, text) { const el = document.createElement('pre'); el.textContent = text; parent.append(el); }
function guard() { return !dirty || confirm('尚有未保存的修改，确定离开？'); }
async function refresh() {
  ({ posts, folders } = await api('posts'));
  const selected = $('category').value; $('category').replaceChildren(new Option('全部分类 / 栏目',''));
  [...new Set(posts.flatMap(p => [p.section, ...(Array.isArray(p.categories) ? p.categories : [])]).filter(Boolean))].sort().forEach(c => $('category').add(new Option(c,c)));
  $('category').value = selected; list();
}
function list() {
  const query = $('search').value.toLowerCase();
  const filtered = posts.filter(p => `${p.title} ${JSON.stringify(p.tags)}`.toLowerCase().includes(query) && (!$('category').value || p.section === $('category').value || p.categories?.includes($('category').value)) && (!$('language').value || p.language === $('language').value) && (!$('draft').value || String(Boolean(p.draft)) === $('draft').value)).sort((a,b) => ((Date.parse(b.date)||0)-(Date.parse(a.date)||0))*($('sort').value === 'asc' ? -1 : 1));
  $('count').textContent = `${filtered.length} 篇 / 共 ${posts.length} 篇`; $('posts').replaceChildren();
  filtered.forEach(p => { const el = button(p.title || p.path, () => run(() => open(p.path))); const meta = document.createElement('small'); meta.textContent = `${p.language || '?'} · ${p.section || ''} · ${p.draft ? '草稿' : '已发布'} · ${String(p.date || '').slice(0,10)}\n${(p.tags || []).join?.(' / ') || ''}`; el.append(meta); $('posts').append(el); });
}
function chips(label, values) {
  const box = document.createElement('div'); box.className = 'chipbox'; let items = [...values];
  const input = document.createElement('input'); input.placeholder = '输入后按 Enter';
  const draw = () => { box.replaceChildren(); items.forEach((item,index) => { const chip = button(`${item} ×`, () => { items.splice(index,1); dirty = true; draw(); }); chip.type = 'button'; chip.className = 'chip'; box.append(chip); }); box.append(input); };
  const add = () => { if (input.value.trim()) { items.push(input.value.trim()); input.value = ''; dirty = true; draw(); } };
  input.onkeydown = e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }; input.onblur = add; draw(); label.append(box); return () => { add(); return items; };
}
let getters = {};
async function open(name) {
  if (!guard()) return;
  original = await api(`post?path=${encodeURIComponent(name)}`); current = name; dirty = false;
  $('welcome').hidden = true; $('editor').hidden = false; $('filepath').textContent = name; $('fields').replaceChildren(); getters = {};
  known.forEach(key => {
    const label = document.createElement('label'); label.textContent = ({title:'标题',date:'日期（含时区）',draft:'草稿',ShowToc:'显示目录',tags:'标签',categories:'分类',summary:'摘要',description:'描述',url:'固定链接',layout:'布局',cover:'封面（JSON）'})[key];
    const value = original.fields[key];
    if (key === 'tags' || key === 'categories') getters[key] = chips(label, Array.isArray(value) ? value : []);
    else {
      const input = document.createElement(key === 'cover' ? 'textarea' : 'input'); input.id = `field-${key}`;
      input.type = ['draft','ShowToc'].includes(key) ? 'checkbox' : 'text';
      if (input.type === 'checkbox') input.checked = Boolean(value); else input.value = key === 'cover' ? (value === undefined ? '' : JSON.stringify(value,null,2)) : (value ?? '');
      input.oninput = () => { dirty = true; }; label.append(input);
      getters[key] = () => input.type === 'checkbox' ? input.checked : key === 'cover' ? (input.value.trim() ? JSON.parse(input.value) : undefined) : input.value;
    }
    $('fields').append(label);
  });
  $('unknown').textContent = JSON.stringify(Object.fromEntries(Object.entries(original.fields).filter(([k]) => !known.includes(k))),null,2);
  $('body').value = original.body; render(); say('已打开');
}
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function render() {
  // 所有原始 HTML 都转义，预览不执行文章内脚本或 Hugo 短代码。
  let code = false;
  $('render').innerHTML = $('body').value.split('\n').map(line => {
    if (line.startsWith('```')) { code = !code; return code ? '<pre><code>' : '</code></pre>'; }
    if (code) return escape(line)+'\n';
    let text = escape(line).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
    text = text.replace(/!\[([^\]]*)\]\(([^\s)]+)\)/g, (_,alt,url) => /^(https:\/\/|data:image\/(png|jpeg|gif|webp);base64,)/.test(url) ? `<img alt="${alt}" src="${url}">` : `[图片：${alt}] ${url}`);
    const heading = /^(#{1,6}) (.*)/.exec(text); return heading ? `<h${heading[1].length}>${heading[2]}</h${heading[1].length}>` : `<div>${text || '<br>'}</div>`;
  }).join('');
}
async function run(fn) { try { await fn(); } catch (error) { say(`错误：${error.message}`); } }
for (const id of ['search','category','language','draft','sort']) $(id).oninput = list;
$('body').oninput = () => { dirty = true; render(); };
$('fields').onsubmit = e => e.preventDefault();
$('save').onclick = () => run(async () => {
  const fields = {};
  for (const [key,get] of Object.entries(getters)) { const value = get(); if (value !== undefined && (key in original.fields || !['',false].includes(value) && !(Array.isArray(value) && !value.length))) fields[key] = value; }
  const result = await api('save',{ path:current, fields, body:$('body').value, revision:original.revision }); original.revision = result.revision; dirty = false; say('已保存'); await refresh();
});
$('new').onclick = () => {
  if (!guard()) return; const container = panel('新建文章'), form = document.createElement('form');
  for (const [key,title] of [['title','标题'],['category','分类目录'],['slug','Slug（不含语言后缀）']]) { const label = document.createElement('label'); label.textContent = title; const input = document.createElement('input'); input.name = key; input.required = true; if (key === 'category') { input.setAttribute('list','folders'); const list = document.createElement('datalist'); list.id = 'folders'; folders.forEach(f => list.append(new Option(f))); label.append(list); } label.append(input); form.append(label); }
  const language = document.createElement('select'); language.name = 'language'; ['zh','en','both'].forEach((v,i) => language.add(new Option(['中文','英文','中英双语'][i],v))); form.append(language); const submit = button('创建草稿',null); form.append(submit); form.onsubmit = e => { e.preventDefault(); run(async () => { const result = await api('create',Object.fromEntries(new FormData(form))); $('panel').close(); dirty = false; await refresh(); await open(result.paths[0]); }); }; container.append(form);
};
$('move').onclick = () => run(async () => { if (!guard()) return; const target = prompt('输入 content/ 下的新路径；页面包的图片不会随 Markdown 移动',current); if (!target || target === current) return; await api('move',{path:current,target}); dirty = false; await refresh(); await open(target); });
$('delete').onclick = () => run(async () => { if (!confirm(`将 ${current} 移入回收目录？未保存的编辑将丢失。`)) return; const result = await api('delete',{path:current}); dirty = false; current = undefined; $('editor').hidden = true; $('welcome').hidden = false; await refresh(); say(`已移入 ${result.trash}`); });
$('upload').onchange = () => run(async () => { const file = $('upload').files[0]; if (!file) return; if (file.size > 10000000) throw Error('图片须小于 10 MB'); const data = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); }); const result = await api('upload',{name:file.name,data}); const body = $('body'); body.setRangeText(`![图片](${result.url})`,body.selectionStart,body.selectionEnd,'end'); dirty = true; render(); say('图片已上传，保存文章以保留链接'); });
$('overview').onclick = () => { const container = panel('标签 / 分类统计'); for (const key of ['tags','categories']) { const counts = new Map(); posts.forEach(p => (Array.isArray(p[key]) ? p[key] : []).forEach(v => counts.set(v,(counts.get(v)||0)+1))); pre(container,`${key === 'tags' ? '标签' : '分类'}\n`+[...counts].sort((a,b)=>b[1]-a[1]).map(([name,count])=>`${name}  ·  ${count}`).join('\n')); } };
$('git').onclick = () => run(async () => { const data = await api('git'), container = panel('Git · content / static'); pre(container,data.status.output || '工作区干净'); pre(container,data.diff.output || '暂无已跟踪文件差异（新文件见状态列表）'); const input = document.createElement('input'); input.placeholder = '提交信息，例如 feat: add new post'; container.append(input,button('提交全部 content / static 变更',()=>run(async()=>{ if (!confirm('确认提交面板范围内全部内容与图片变更？')) return; const result = await api('commit',{message:input.value}); pre(container,result.output); say(result.code === 0 ? '提交完成' : '提交失败，请查看输出'); }))); });
$('build').onclick = () => run(async () => { say('正在构建…'); const result = await api('build',{}); pre(panel(`构建${result.code === 0 ? '成功' : '失败'}`),result.output); say(`构建退出码：${result.code}`); });
async function previewPanel() { const data = await api('preview'); const container = panel(data.running ? 'Hugo 预览运行中' : 'Hugo 预览已停止'); const link = document.createElement('a'); link.href = data.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = data.url; container.append(link,button('刷新日志',()=>run(previewPanel))); pre(container,data.logs); }
$('previewStart').onclick = () => run(async()=>{ await api('preview',{action:'start'}); await previewPanel(); });
$('previewStop').onclick = () => run(async()=>{ await api('preview',{action:'stop'}); say('已发送停止预览请求'); });
$('theme').onclick = () => { document.documentElement.classList.toggle('dark'); localStorage.setItem('theme',document.documentElement.classList.contains('dark')?'dark':'light'); };
if (localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme') && matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
$('close').onclick = () => $('panel').close();
window.addEventListener('beforeunload',e=>{ if (dirty) { e.preventDefault(); e.returnValue=''; } });
run(refresh);
