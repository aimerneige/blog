import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parsePost, updatePost, localDate } from '../server.js';

test('edits preserve flow lists, quoted scalars, nested indentation and unrelated bytes', () => {
  const raw = '---\ntitle: "Before"\ncategories: [Web]\ntags: [hugo,spotify,music]\ncover:\n    image: "images/test.png"\n    relative: false\n---\nBody';
  assert.equal(updatePost(raw, {tags:['hugo','spotify','music','新标签']}, 'Body'), raw.replace('[hugo,spotify,music]', '[hugo,spotify,music,新标签]'));
  assert.equal(updatePost(raw, {title:'After'}, 'Body'), raw.replace('"Before"', '"After"'));
  assert.equal(updatePost(raw, {summary:'Added'}, 'Body'), raw.replace('\n---\nBody', '\nsummary: Added\n---\nBody'));
  assert.equal(updatePost(raw, {cover:null}, 'Body'), raw.replace('cover:\n    image: "images/test.png"\n    relative: false\n', ''));
  assert.equal(updatePost(raw, {title:''}, 'Body'), raw.replace('title: "Before"\n', ''));
  assert.deepEqual(parsePost(updatePost(raw,{tags:['a,b','x]','true']},'Body')).data.tags,['a,b','x]','true']);
  assert.deepEqual(parsePost(updatePost(raw,{cover:{image:'new.png',relative:true}},'Body')).data.cover,{image:'new.png',relative:true});
  assert.deepEqual(parsePost(updatePost(sampleWithoutTags(),{tags:['new']},'Body')).data.tags,['new']);
});
function sampleWithoutTags() { return '---\ntitle: "Before"\n---\nBody'; }

test('local timestamps use the server offset without milliseconds', () => {
  const date = new Date('2026-10-28T03:07:19.899Z');
  const result = localDate(date);
  assert.match(result, /^2026-10-\d{2}T\d{2}:\d{2}:19[+-]\d{2}:\d{2}$/);
  assert.equal(new Date(result).getTime(), date.getTime() - 899);
});

test('all real posts round trip in a temporary git repository; title edits touch only title lines', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'admin-roundtrip-'));
  t.after(() => fs.rm(root, {recursive:true, force:true}));
  await fs.cp(new URL('../../content/post', import.meta.url), path.join(root,'content/post'), {recursive:true});
  const git = (...args) => execFileSync('git', args, {cwd:root, encoding:'utf8'});
  git('init','-q'); git('add','content'); git('-c','user.name=Test','-c','user.email=test@example.test','commit','-qm','fixture');
  const files = (await fs.readdir(path.join(root,'content/post'), {recursive:true})).filter(name => name.endsWith('.md'));
  for (const name of files) {
    const file = path.join(root,'content/post', name), raw = await fs.readFile(file,'utf8');
    const {data,body} = parsePost(raw);
    await fs.writeFile(file, updatePost(raw, Object.fromEntries(Object.entries(data).filter(([key]) => ['title','date','draft','ShowToc','tags','categories','summary','description','url','layout','cover'].includes(key))), body));
  }
  assert.equal(git('diff'), '');
  for (const name of files) {
    const file = path.join(root,'content/post', name), raw = await fs.readFile(file,'utf8');
    const {data,body} = parsePost(raw);
    await fs.writeFile(file, updatePost(raw, {title:`${data.title} edited`}, body));
  }
  const lines = git('diff','--unified=0').split('\n').filter(line => /^[+-]/.test(line) && !/^(---|\+\+\+)/.test(line));
  assert.equal(lines.length, files.length * 2);
  assert.ok(lines.every(line => /^[+-]title:/.test(line)));
});
