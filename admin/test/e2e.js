import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { parsePost } from '../server.js';

const root = await fs.mkdtemp(path.join(os.tmpdir(), 'admin-browser-'));
let browser, child;
try {
  await fs.mkdir(path.join(root,'content/post/Test'), {recursive:true});
  await fs.mkdir(path.join(root,'static/images'), {recursive:true});
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9XkAAAAASUVORK5CYII=', 'base64');
  await fs.writeFile(path.join(root,'static/images/pixel.png'), image);
  const fixture = '---\ntitle: "Browser fixture"\ndate: 2023-03-01T20:57:21+08:00\ntags: [hugo]\ncategories: [Test]\ncover:\n    image: "images/pixel.png"\n---\n# Hello browser\n![local](/images/pixel.png)\n![relative](images/pixel.png)\n';
  for (let i=0; i<120; i++) await fs.writeFile(path.join(root,`content/post/Test/post-${i}.zh.md`), fixture.replace('Browser fixture', `Browser fixture ${i}`));
  execFileSync('git',['init','-q'], {cwd:root});
  child = spawn(process.execPath, ['server.js'], {cwd:new URL('..',import.meta.url), env:{...process.env, BLOG_ROOT:root, PORT:'0'}, stdio:['ignore','pipe','pipe']});
  const base = await new Promise((resolve,reject) => {
    child.stdout.on('data', data => { const match = /http:\/\/127\.0\.0\.1:\d+/.exec(String(data)); if(match) resolve(match[0]); });
    child.on('error',reject); child.on('exit', code => reject(Error(`Server exited: ${code}`)));
  });
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1400,height:900}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if(message.type() === 'error') errors.push(message.text()); });
  await page.goto(base.replace('127.0.0.1','localhost'));
  await page.locator('#posts button').first().click();
  await page.locator('#body').waitFor({state:'visible'});
  assert.match(await page.locator('#body').inputValue(), /Hello browser/);
  assert.equal(await page.locator('#render h1').textContent(), 'Hello browser');
  await page.waitForFunction(() => [...document.querySelectorAll('#render img')].length === 2 && [...document.querySelectorAll('#render img')].every(img => img.complete && img.naturalWidth > 0));
  const filename = await page.locator('#filepath').textContent();
  await page.locator('#field-title').fill('Edited browser title');
  const tags = page.locator('#fields label').filter({hasText:'标签'}).locator('input');
  await tags.fill('新标签'); await tags.press('Enter');
  await page.locator('#body').fill('# Edited body\n![local](/images/pixel.png)');
  await page.locator('#save').click();
  await page.waitForFunction(() => document.querySelector('#message').textContent === '已保存');
  const saved = parsePost(await fs.readFile(path.join(root,'content',filename),'utf8'));
  assert.equal(saved.data.title,'Edited browser title'); assert.deepEqual(saved.data.tags,['hugo','新标签']); assert.match(saved.body,/Edited body/);
  await fs.mkdir('/tmp/admin-shots',{recursive:true});
  await page.screenshot({path:'/tmp/admin-shots/desktop.png'});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.locator('aside').isVisible(),false);
  assert.equal(await page.locator('#field-title').isVisible(),true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
  await page.screenshot({path:'/tmp/admin-shots/mobile.png'});
  await page.locator('#back').click();
  assert.equal(await page.locator('aside').isVisible(),true);
  await page.locator('#posts button').first().click();
  await page.setViewportSize({width:1400,height:900});
  await page.locator('#new').click();
  await page.locator('[name=title]').fill('New browser post');
  await page.locator('[name=category]').fill('Test');
  await page.locator('[name=slug]').fill('browser-created');
  await page.getByRole('button',{name:'创建草稿'}).click();
  await page.waitForFunction(() => document.querySelector('#filepath').textContent.includes('browser-created'));
  const created = await fs.readFile(path.join(root,'content/post/Test/browser-created.zh.md'),'utf8');
  assert.match(created,/title: "New browser post"/); assert.match(created,/date: .*T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\n/);
  for (const id of ['overview','git']) {
    await page.locator(`#${id}`).click(); await page.locator('#panel').waitFor({state:'visible'});
    assert.ok(await page.locator('#panelBody').textContent()); await page.locator('#close').click();
  }
  assert.deepEqual(errors,[]);
  console.log('Browser e2e passed; screenshots: /tmp/admin-shots/{desktop,mobile}.png');
} finally {
  await browser?.close();
  if (child && child.exitCode === null) { const exited = new Promise(resolve => child.once('exit',resolve)); child.kill(); await exited; }
  await fs.rm(root,{recursive:true,force:true});
}
