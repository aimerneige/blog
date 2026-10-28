import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { parsePost } from "../server.js";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "admin-mui-"));
const shots = "/tmp/admin-shots-v4";
let browser, child, devChild;
try {
  await fs.cp(
    new URL("../../content", import.meta.url),
    path.join(root, "content"),
    { recursive: true },
  );
  await fs.cp(
    new URL("../../static", import.meta.url),
    path.join(root, "static"),
    { recursive: true },
  );
  await fs.mkdir(path.join(root, "content/post/Studio"), { recursive: true });
  const fixture =
    '---\ntitle: "让写作回归思考" # keep comment\ndate: 2026-10-28T20:57:21+08:00\ndraft: true\nShowToc: true\ntags: [写作,设计]\ncategories: [Studio]\ncover:\n    image: "images/pixel.png"\n    relative: false\ncustom:\n  nested: [one, two]\n---\n# 给想法，留一点空间\n\n好的工具让人专注于内容。这是一个关于写作、设计与日常观察的小小工作台。\n\n## 从一份草稿开始\n\n- 记录今天值得留下的想法\n- 用 Markdown 组织文字\n- 在预览中检查阅读的节奏\n\n> 写作是把模糊的想法，慢慢变得清晰。\n\n```javascript\nconst idea = "Keep creating";\nconsole.log(idea);\n```\n\n| 关注 | 状态 |\n| --- | --- |\n| 阅读体验 | 持续打磨 |\n\n{{< note >}}\n\n![local](/images/pixel.png)\n![relative](images/pixel.png)\n![remote](https://example.com/image.png)\n<script>throw Error("unsafe")</script>\n';
  const filename = "post/Studio/中文 空格.zh.md";
  await fs.writeFile(path.join(root, "content", filename), fixture);
  await fs.writeFile(
    path.join(root, "static/images/pixel.png"),
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9XkAAAAASUVORK5CYII=",
      "base64",
    ),
  );
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" });
  git("init", "-q");
  git("add", "content", "static");
  git(
    "-c",
    "user.name=Test",
    "-c",
    "user.email=test@example.test",
    "commit",
    "-qm",
    "fixture",
  );
  child = spawn("npm", ["start"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, BLOG_ROOT: root, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  const base = await new Promise((resolve, reject) => {
    child.stdout.on("data", (data) => {
      const match = /http:\/\/127\.0\.0\.1:\d+/.exec(String(data));
      if (match) resolve(match[0]);
    });
    child.on("error", reject);
    child.on("exit", (code) => reject(Error(`Server exited: ${code}`)));
  });
  const index = await fetch(base);
  assert.match(
    index.headers.get("content-security-policy"),
    /script-src 'self'; worker-src 'self' blob:/,
  );
  const html = await index.text();
  const asset = /src="([^"]+\.js)"/.exec(html)[1];
  assert.equal(
    (await fetch(base + asset)).headers.get("content-type"),
    "text/javascript",
  );
  assert.equal((await fetch(base + asset, { method: "POST" })).status, 405);
  assert.equal(await (await fetch(base + "/editor/nested")).text(), html);
  assert.equal(
    (await fetch(base + "/assets/%2e%2e%2f%2e%2e%2fserver.js")).status,
    400,
  );
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const errors = [],
    external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      ["http:", "https:"].includes(url.protocol) &&
      !["127.0.0.1", "localhost"].includes(url.hostname)
    )
      external.push(request.url());
  });
  await page.goto(base.replace("127.0.0.1", "localhost"));
  await page.getByRole("heading", {name:"管理面板"}).waitFor();
  await page.waitForFunction(() => !document.querySelector(".summary-grid")?.textContent.includes("—"));
  assert.equal(await page.getByTestId("monaco").count(), 0);
  await fs.mkdir(shots, {recursive:true});
  await page.screenshot({path:`${shots}/dashboard-light.png`});
  await page.getByRole("button", {name:"切换深色模式"}).click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[aria-label="搜索文章"]')).color === "rgb(229, 234, 230)");
  await page.screenshot({path:`${shots}/dashboard-dark.png`});
  await page.getByRole("button", {name:"切换浅色模式"}).click();
  await page.getByRole("textbox", {name:"搜索文章"}).fill("让写作");
  await page.getByRole("button", {name:"中文",exact:true}).click();
  await page.waitForURL(/q=.*language=zh/);
  const dashboardURL = page.url();
  await page.getByRole("button", {name:"编辑",exact:true}).first().click();
  await page.waitForURL(/\/edit\//);
  assert.equal(await page.getByRole("table").count(),0);
  await page.reload();
  await page.getByTestId("filepath").waitFor();
  assert.equal(decodeURIComponent(new URL(page.url()).pathname), `/edit/${filename}`);
  await page.goBack();
  await page.getByRole("textbox", {name:"搜索文章"}).waitFor();
  assert.equal(page.url(),dashboardURL);
  assert.equal(await page.getByRole("textbox", {name:"搜索文章"}).inputValue(),"让写作");
  await page.goForward();
  await page.getByTestId("filepath").waitFor();
  await page.getByRole("textbox", {name:"标题",exact:true}).fill("browser back unsaved");
  const blockedBack = new Promise(resolve => page.once("dialog", async dialog => {assert.match(dialog.message(),/未保存/);await dialog.dismiss();resolve();}));
  await page.evaluate(() => history.back());
  await blockedBack;
  await page.waitForURL(/\/edit\//);
  await page.getByRole("textbox", {name:"标题",exact:true}).fill("让写作回归思考");
  await page.getByRole("button", {name:"返回管理面板"}).click();

  await page.getByText(/让写作回归思考/, {exact:false}).filter({visible:true}).first().click();
  await page
    .getByTestId("monaco")
    .locator("textarea")
    .waitFor({ state: "attached" });
  await page.locator(".markdown h1").waitFor();
  assert.equal(await page.getByTestId("filepath").textContent(), filename);
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".markdown img")].length === 2 &&
      [...document.querySelectorAll(".markdown img")].every(
        (img) => img.complete && img.naturalWidth,
      ),
  );
  assert.equal(await page.locator(".shortcode").count(), 2);
  await page
    .getByRole("textbox", { name: "标题", exact: true })
    .fill("让写作回归思考 · 修订");
  await page.getByRole("combobox", { name: "标签", exact: true }).fill("灵感");
  await page
    .getByRole("combobox", { name: "标签", exact: true })
    .press("Enter");
  await page.getByTestId("monaco").click();
  await page.keyboard.press("Control+End");
  await page.keyboard.type("\nE2E saved from Monaco.");
  await page.keyboard.press("Control+s");
  await page.getByText("已保存", { exact: true }).waitFor();
  const saved = await fs.readFile(path.join(root, "content", filename), "utf8");
  assert.equal(
    saved,
    fixture
      .replace('"让写作回归思考"', '"让写作回归思考 · 修订"')
      .replace("[写作,设计]", "[写作,设计,灵感]") + "\nE2E saved from Monaco.",
  );
  assert.equal(parsePost(saved).data.date, "2026-10-28T20:57:21+08:00");
  const diff = git("diff", "--unified=0")
    .split("\n")
    .filter((line) => /^[+-]/.test(line) && !/^(---|\+\+\+)/.test(line));
  assert.ok(
    diff.every((line) => /^[+-](title:|tags:|E2E|$)/.test(line)),
    diff.join("\n"),
  );
  await fs.mkdir(shots, { recursive: true });
  await page.keyboard.press("Control+Home");
  await page.getByRole("textbox", { name: "标题", exact: true }).focus();
  await page.locator(".document-scroll").evaluate((element) => {
    element.scrollTop = 0;
  });
  await page.getByRole("alert").getByRole("button", { name: "Close" }).click();
  await page.locator(".MuiSnackbar-root").waitFor({ state: "hidden" });
  await page.screenshot({ path: `${shots}/editor-light.png` });
  await page.getByRole("button", { name: "切换深色模式" }).click();
  await page.mouse.move(950, 100);
  await page.getByRole("button", { name: "切换浅色模式" }).waitFor();
  const titleId = await page
    .getByRole("textbox", { name: "标题", exact: true })
    .getAttribute("id");
  await page.waitForFunction(
    (id) =>
      getComputedStyle(document.getElementById(id)).color ===
      "rgb(229, 234, 230)",
    titleId,
  );
  const contrast = await page
    .getByRole("textbox", { name: "标题", exact: true })
    .evaluate((element) => {
      const luminance = (color) => {
        const values = color
          .match(/\d+/g)
          .slice(0, 3)
          .map((value) => {
            const channel = Number(value) / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      };
      const foreground = luminance(getComputedStyle(element).color);
      const background = luminance(
        getComputedStyle(element.closest(".metadata")).backgroundColor,
      );
      return (
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05)
      );
    });
  assert.ok(contrast >= 4.5, `Dark input contrast: ${contrast}`);
  await page.screenshot({ path: `${shots}/editor-dark.png` });
  await page.reload();
  await page.getByRole("button", { name: "切换浅色模式" }).waitFor();
  await page.getByRole("button", { name: "切换浅色模式" }).click();
  await page.getByRole("button", {name:"收起文章信息"}).click();
  await page.waitForFunction(() => document.querySelector(".monaco-editor")?.clientHeight > 600);
  await page.screenshot({path:`${shots}/editor-collapsed.png`});
  await page.getByRole("button", {name:"展开文章信息"}).click();
  await page.getByRole("button", {name:"返回管理面板"}).click();
  await page.getByRole("button", { name: "新建文章", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "文章标题" })
    .fill("新的旅程");
  await page
    .getByRole("dialog")
    .getByRole("combobox", { name: "分类目录" })
    .fill("Studio");
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Slug" })
    .fill("new-journey");
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Slug" })
    .press("Tab");
  await page.screenshot({ path: `${shots}/new-post.png` });
  await page.getByRole("button", { name: "创建草稿" }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("[data-testid=filepath]")
      ?.textContent.includes("new-journey"),
  );
  assert.match(
    await fs.readFile(
      path.join(root, "content/post/Studio/new-journey.zh.md"),
      "utf8",
    ),
    /title: "新的旅程"/,
  );
  await page.getByRole("button", {name:"返回管理面板"}).click();
  await page.getByRole("button", { name: "Git", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByText(/diff --git/)
    .waitFor();
  await page.screenshot({ path: `${shots}/git.png` });
  await page.getByRole("button", { name: "关闭对话框" }).click();
  await page.getByRole("button", { name: "标签 / 分类", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "灵感 · 1" })
    .click();
  assert.equal(
    await page.getByRole("textbox", { name: "搜索文章" }).inputValue(),
    "灵感",
  );
  await page.getByRole("button", {name:/清除筛选/}).click();
  await page.getByText(/让写作回归思考/, {exact:false}).filter({visible:true}).first().click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".document-scroll").evaluate((element) => {
    element.scrollTop = 0;
  });
  assert.equal(await page.locator(".sidebar").count(), 0);
  assert.equal(
    await page.getByRole("textbox", { name: "标题", exact: true }).isVisible(),
    true,
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({ path: `${shots}/mobile-editor.png` });
  await page.getByTestId("monaco").scrollIntoViewIfNeeded();
  await page.getByTestId("monaco").click();
  await page.keyboard.press("Control+End");
  await page.keyboard.type("\nMobile edit.");
  await page.keyboard.press("Control+s");
  await page.getByText("已保存", { exact: true }).waitFor();
  await page.getByRole("button", { name: "返回管理面板" }).click();
  assert.equal(await page.locator(".sidebar").count(), 1);
  await page.screenshot({ path: `${shots}/mobile-dashboard.png` });
  await page.getByText(/让写作回归思考/, {exact:false}).filter({visible:true}).first().click();
  await page
    .getByRole("textbox", { name: "标题", exact: true })
    .fill("outside shortcut");
  await page.keyboard.press("Control+s");
  await page.getByText("已保存", { exact: true }).waitFor();
  assert.match(
    await fs.readFile(path.join(root, "content", filename), "utf8"),
    /title: "outside shortcut"/,
  );
  await page
    .getByRole("textbox", { name: "标题", exact: true })
    .fill("unsaved title");
  const dismissed = new Promise((resolve) =>
    page.once("dialog", async (dialog) => {
      assert.match(dialog.message(), /未保存/);
      await dialog.dismiss();
      resolve();
    }),
  );
  await page.getByRole("button", { name: "返回管理面板" }).click();
  await dismissed;
  assert.equal(await page.locator(".sidebar").count(), 0);
  await page.keyboard.press("Control+s");
  await page.getByText("已保存", { exact: true }).waitFor();
  await page
    .getByRole("button", { name: "插入图片" })
    .locator("input")
    .setInputFiles({
      name: "pasted.png",
      mimeType: "image/png",
      buffer: await fs.readFile(path.join(root, "static/images/pixel.png")),
    });
  await page.getByText("图片已上传，保存文章以保留链接").waitFor();
  await page.keyboard.press("Control+s");
  await page.getByText("已保存", { exact: true }).waitFor();
  assert.match(
    await fs.readFile(path.join(root, "content", filename), "utf8"),
    /!\[图片\]\(\/images\/[a-f0-9-]+\.png\)/,
  );
  const png = await fs.readFile(
    path.join(root, "static/images/pixel.png"),
    "base64",
  );
  for (const type of ["paste", "drop"]) {
    const uploaded = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/upload") && response.status() === 200,
    );
    await page.getByTestId("monaco").evaluate(
      (element, { png, type }) => {
        const file = new File(
          [Uint8Array.from(atob(png), (char) => char.charCodeAt(0))],
          `${type}.png`,
          { type: "image/png" },
        );
        const data = new DataTransfer();
        data.items.add(file);
        const event =
          type === "paste"
            ? new ClipboardEvent("paste", {
                clipboardData: data,
                bubbles: true,
                cancelable: true,
              })
            : new DragEvent("drop", {
                dataTransfer: data,
                bubbles: true,
                cancelable: true,
              });
        element.dispatchEvent(event);
      },
      { png, type },
    );
    await uploaded;
    await page.getByText("图片已上传，保存文章以保留链接").waitFor();
    await page.keyboard.press("Control+s");
    await page.getByText("已保存", { exact: true }).waitFor();
  }
  const withImages = await fs.readFile(
    path.join(root, "content", filename),
    "utf8",
  );
  assert.equal(
    [...withImages.matchAll(/!\[图片\]\(\/images\/[a-f0-9-]+\.png\)/g)].length,
    3,
  );
  await page.getByRole("button", {name:"返回管理面板"}).click();
  await page.getByRole("button", {name:"删除 新的旅程",exact:true}).last().click();
  await page.getByRole("button", {name:"移入回收目录"}).click();
  await page.getByText("已移入回收目录",{exact:true}).waitFor();
  await assert.rejects(fs.stat(path.join(root,"content/post/Studio/new-journey.zh.md")));
  devChild = spawn(process.execPath, ["dev.js"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, BLOG_ROOT: root, ADMIN_DEV_PORT: "5175" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise((resolve, reject) => {
    devChild.stdout.on("data", (data) => {
      if (String(data).includes("127.0.0.1:5175")) resolve();
    });
    devChild.on("error", reject);
    devChild.on("exit", (code) => reject(Error(`Dev server exited: ${code}`)));
  });
  const devBase = "http://127.0.0.1:5175";
  assert.equal(
    (await fetch(devBase + "/api/posts", { headers: { Origin: devBase } }))
      .status,
    200,
  );
  assert.equal(
    (
      await fetch(devBase + "/api/posts", {
        headers: { Origin: "https://evil.test" },
      })
    ).status,
    403,
  );
  await page.goto(devBase);
  await page.getByText("unsaved title", {exact:true}).filter({visible:true}).first().click();
  await page.getByTestId("monaco").waitFor();
  await page
    .getByRole("textbox", { name: "标题", exact: true })
    .fill("Dev proxy saved");
  await page.keyboard.press("Control+s");
  await page.getByText("已保存", { exact: true }).waitFor();
  assert.equal(
    parsePost(await fs.readFile(path.join(root, "content", filename), "utf8"))
      .data.title,
    "Dev proxy saved",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  console.log(
    `MUI + Monaco e2e passed; real-content temp copy; zero browser errors/external requests; screenshots: ${shots}`,
  );
} finally {
  await browser?.close();
  for (const serverProcess of [child, devChild])
    if (serverProcess && serverProcess.exitCode === null) {
      const exited = new Promise((resolve) =>
        serverProcess.once("exit", resolve),
      );
      if (serverProcess === child) process.kill(-serverProcess.pid, "SIGTERM");
      else serverProcess.kill();
      await exited;
    }
  await fs.rm(root, { recursive: true, force: true });
}
