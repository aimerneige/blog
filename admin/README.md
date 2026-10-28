# 本地博客管理

需要 Node.js 22、Git 和已安装的 Hugo。首次使用先在博客根目录初始化主题：

```bash
git submodule update --init --recursive
cd admin
npm install
npm start
```

也可在博客根目录执行 `npm --prefix admin start`。打开终端打印的 `http://127.0.0.1:4321`。无需前端构建；唯一运行依赖是 YAML 文档解析库 `yaml`。

环境变量：`PORT` 设置管理端口，`BLOG_ROOT` 设置另一个博客目录（默认为 admin 的父目录），`HUGO_PORT` 设置预览端口（默认 1313）。管理服务与 Hugo 预览均绑定 127.0.0.1。关闭管理服务会停止其启动的 Hugo 子进程。

## 操作

- 列表包含 content 下所有 Markdown，可搜索标题和标签，按栏目 / 分类、语言、草稿过滤，按日期排序。无语言后缀按本站默认英文处理。
- 编辑标题、日期、草稿、目录、标签、分类、摘要、描述、URL、布局和封面。封面使用 JSON 编辑嵌套对象；标签与分类按 Enter 添加，点击标签删除。其他字段只读保留。
- YAML 按文档节点的源范围替换实际变更的字段，其余字段保持原始字节；保留 flow 列表与标量引号风格。清空字段会移除该字段，无变化不写文件。外部编辑导致版本冲突时需重新打开文章。
- 新文章写入 `content/post/<分类>/<slug>.en.md` / `.zh.md`，可同时生成双语草稿。默认值沿用 archetypes/default.md 的 title、date、draft、ShowToc 约定，并填写分类和空标签。标题使用双引号，列表使用 flow 风格（现有 99 个 tags 字段全部采用此风格）。日期使用服务器本地时区偏移，不含毫秒。
- 重命名 / 移动仅操作 Markdown 文件，不搬移页面包图片。现有页面包内 Markdown 也会列出。
- 删除前需确认。原文件移到 `content/.admin-trash/<随机编号>/原路径.deleted`，此目录被 Git 忽略，后缀避免 Hugo 发布。可在终端手动移回原路径恢复；回收站不自动清理。
- 图片上传到 `static/images`，随机文件名避免覆盖，并插入 `/images/...` Markdown 链接。支持 PNG/JPEG/GIF/WebP/AVIF，界面限制 10 MB。不提供页面包上传。预览支持 HTTPS、站内 `/images/...` 和 `images/...` 图片；static 文件仅允许 GET，拒绝越界路径与符号链接。预览仅展示近似 Markdown，完整效果使用 Hugo 预览。
- 手机上列表与编辑器分别显示，打开文章后通过底部「返回文章列表」切换。
- Hugo 面板提供启动 / 停止、预览链接及手动刷新日志。构建按钮执行 `hugo --minify`，输出位于博客 public/。
- Git 面板展示 content、static 的状态与已跟踪文件差异，新文件见状态列表。确认后提交这两个目录的全部变更；如暂存区已有文件则拒绝提交。提交不运行 Git hooks，不推送；请先检查面板与终端中的变更。没有提供推送接口。

## 安全与限制

这是单用户本地工具，无登录。使用 127.0.0.1 或 localhost 访问，Host 必须匹配本机监听端口；有 Origin 时必须与请求的 Host 同源。写接口只接受 JSON。请勿代理到公网或在不可信共享主机运行。

文件操作限制在 content 与 static，拒绝绝对路径、上级路径、反斜线和符号链接；前端不能指定命令，仅允许固定 Hugo / Git 操作。预览转义原始 HTML，不执行文章脚本与 Hugo shortcode。Git/Hugo 仍会读取博客自身配置；只应打开可信博客。检查输出最多保留约 200 KB，预览日志约 100 KB。

发生变更的 YAML 字段可能重新排版，其余字段保持原文。没有多用户锁、完整 Markdown 渲染、图片库或撤销栈。双语创建预检重名，但不提供跨文件事务。文件保存采用版本校验，仍应使用 Git 备份。

## 验证

```bash
npm test
npm run test:e2e
```

测试使用独立临时博客目录（作为 BLOG_ROOT 传入应用），覆盖 YAML round-trip、无变化不写入、版本冲突、路径与符号链接拒绝、Host/Origin、防重复创建、双语创建、移动、回收删除和上传，不修改真实 content。

`npm test` 仅运行快速单元/API 测试，并将全部真实文章复制到临时 Git 仓库验证无变化保存与仅标题修改。浏览器测试单独运行；需要 Playwright Chromium（首次可执行 `npx playwright install chromium`）。它通过 BLOG_ROOT 启动临时博客，验证打开、正文与图片预览、编辑保存及磁盘内容、新建、统计与 Git 面板、120 篇列表的手机切换，并断言没有页面或 console 错误。桌面 1400×900 与手机 390×844 截图写入 `/tmp/admin-shots/`。
