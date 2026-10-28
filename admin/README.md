# 本地博客管理

需要 Node.js 22、Git 和已安装的 Hugo。首次使用先在博客根目录初始化主题：

```bash
git submodule update --init --recursive
cd admin
npm install
npm start
```

也可在博客根目录执行 `npm --prefix admin start`。打开终端打印的 `http://127.0.0.1:4321`。`npm start` 的 prestart 每次先执行 TypeScript 检查与 Vite 生产构建，确保从干净检出启动、修改源码后重启都使用最新前端。构建产物在 `admin/dist/`，不提交到 Git。

前端源码在 `admin/web/src/`：React + TypeScript、MUI / Emotion、Monaco Editor 和 markdown-it。Monaco 使用 npm 包直接创建编辑器，worker 通过 Vite `?worker` 导入；没有使用 CDN loader。图标、字体资源和 worker 随构建本地提供，使用系统字体，不请求 Google Fonts 或任何外部主机。Monaco 依赖的 DOMPurify 通过 npm override 固定在已修复版本范围。

开发时执行：

```bash
npm run dev
```

该命令同时启动 Node API（`127.0.0.1:4321`）和 Vite（`127.0.0.1:5173`）；在 Vite 地址访问，`/api` 和 `/images` 自动代理到 Node。`PORT` 可修改 API 端口，`ADMIN_DEV_PORT` 可修改 Vite 端口（端口占用时明确报错）。仅此开发启动方式设置 `ADMIN_DEV=1`，允许配置的 Vite 端口上 localhost / 127.0.0.1 Origin；保留 Origin 转发与校验，不移除请求的 Origin。关闭开发命令会停止两个服务。

仅构建前端可执行 `npm run build`；构建后可直接 `node server.js` 启动，不重复构建。前端构建含 Monaco，Vite 会提示较大的 bundle；所有资源均从本机加载。

环境变量：`PORT` 设置管理端口，`BLOG_ROOT` 设置另一个博客目录（默认为 admin 的父目录），`HUGO_PORT` 设置预览端口（默认 1313）。管理服务与 Hugo 预览均绑定 127.0.0.1。关闭管理服务会停止其启动的 Hugo 子进程。

## 操作

- 列表包含 content 下所有 Markdown，可搜索标题和标签，按栏目 / 分类、语言、草稿过滤，按日期排序。无语言后缀按本站默认英文处理。
- 编辑标题、日期、草稿、目录、标签、分类、摘要、描述、URL、布局和封面。标准 ISO 日期使用日期时间控件，原时区单独只读展示并原样保留；非标准日期可直接编辑原字符串。标签与分类支持已有值建议、自由输入、Enter 添加和删除。摘要等次要字段位于「更多设置」。简单封面对象拆成 image / alt / caption / relative / hidden 等子字段，复杂嵌套结构用 JSON 编辑；无效 JSON 阻止保存。其他字段只读保留。
- YAML 按文档节点的源范围替换实际变更的字段，其余字段保持原始字节；保留 flow 列表与标量引号风格。清空字段会移除该字段，无变化不写文件。外部编辑导致版本冲突时需重新打开文章。
- 新文章写入 `content/post/<分类>/<slug>.en.md` / `.zh.md`，可同时生成双语草稿。默认值沿用 archetypes/default.md 的 title、date、draft、ShowToc 约定，并填写分类和空标签。标题使用双引号，列表使用 flow 风格（现有 99 个 tags 字段全部采用此风格）。日期使用服务器本地时区偏移，不含毫秒。
- 重命名 / 移动仅操作 Markdown 文件，不搬移页面包图片。现有页面包内 Markdown 也会列出。
- 删除前需确认。原文件移到 `content/.admin-trash/<随机编号>/原路径.deleted`，此目录被 Git 忽略，后缀避免 Hugo 发布。可在终端手动移回原路径恢复；回收站不自动清理。
- Monaco 使用 Markdown 模式、自动折行、无 minimap；提供编辑 / 分栏 / 预览视图。保存按钮和 Ctrl/Cmd+S 在表单与编辑器内均有效，未保存状态有标记；切换文章、手机返回与关闭页面会提示未保存修改。
- 图片上传到 `static/images`，随机文件名避免覆盖。按钮选择、拖入编辑区域、粘贴图片到 Monaco 均在光标处插入 `/images/...` Markdown 链接（纯预览视图下追加到正文）。支持 PNG/JPEG/GIF/WebP/AVIF，界面限制 10 MB。不提供页面包上传。预览支持站内 `/images/...` 和 `images/...` 图片；外部图片显示占位以保证零外部请求。静态文件仅允许 GET，拒绝越界路径与符号链接。markdown-it 渲染标题、列表、代码、表格等，禁止执行原始 HTML，Hugo shortcode 显示占位；完整效果使用 Hugo 预览。
- 手机上列表与编辑器分别显示，通过顶栏返回箭头切换；Git、统计、构建和预览日志位于列表底部工具栏。文章移动和删除位于保存旁的更多菜单。
- Hugo 预览按钮显示运行状态，可启动 / 停止，并提供预览链接和日志 Drawer。构建按钮执行 `hugo --minify`，输出位于博客 public/。Git、构建、新建和标签分类统计使用 MUI Dialog；点击统计项可筛选文章。
- 明暗主题默认跟随系统偏好，顶栏可手动切换并保存到 localStorage；界面支持键盘焦点和减少动画的系统偏好。
- Git 面板展示 content、static 的状态与已跟踪文件差异，新文件见状态列表。确认后提交这两个目录的全部变更；如暂存区已有文件则拒绝提交。提交不运行 Git hooks，不推送；请先检查面板与终端中的变更。没有提供推送接口。

## 安全与限制

这是单用户本地工具，无登录。使用 127.0.0.1 或 localhost 访问，Host 必须匹配本机监听端口；有 Origin 时必须与请求的 Host 同源（开发模式额外允许配置的 Vite 本机端口）。写接口只接受 JSON。请勿代理到公网或在不可信共享主机运行。

Node 从 `dist/` 提供带哈希资源，并对无扩展名路由回退到 index.html；JS、CSS 与字体提供正确 MIME。CSP 保持 default-src / script-src self，额外仅允许 Emotion 内联样式、本站 / blob worker 和本站 / data 字体与图片，不允许外部来源、iframe 或 object。

文件操作限制在 content 与 static，拒绝绝对路径、上级路径、反斜线和符号链接；前端不能指定命令，仅允许固定 Hugo / Git 操作。预览转义原始 HTML，不执行文章脚本与 Hugo shortcode。Git/Hugo 仍会读取博客自身配置；只应打开可信博客。检查输出最多保留约 200 KB，预览日志约 100 KB。

发生变更的 YAML 字段可能重新排版，其余字段保持原文。没有多用户锁、图片库或完整 Hugo 渲染；Monaco 撤销栈仅在当前编辑器会话有效，重新打开文章或切到纯预览会重建编辑器。双语创建预检重名，但不提供跨文件事务。文件保存采用版本校验，仍应使用 Git 备份。

## 验证

```bash
npm test
npm run build
npm run test:e2e
```

测试使用独立临时博客目录（作为 BLOG_ROOT 传入应用），覆盖 YAML round-trip、无变化不写入、版本冲突、路径与符号链接拒绝、Host/Origin、防重复创建、双语创建、移动、回收删除和上传，不修改真实 content。

`npm test` 仅运行快速单元/API 测试，并将全部真实文章复制到临时 Git 仓库验证无变化保存与仅标题修改。浏览器测试单独运行，通过 npm start 自动构建；需要 Playwright Chromium（首次可执行 `npx playwright install chromium`）。它将真实 content / static 复制到临时 BLOG_ROOT，添加测试文章后验证 Autocomplete 添加标签、Monaco 输入、内外快捷键保存及逐字节文件差异、新建、Git 与统计筛选、主题持久化、按钮 / 拖放 / 粘贴上传、未保存提醒、手机列表→编辑→返回、生产资源 MIME/CSP/路径限制和 Vite 代理的正常 / 恶意 Origin。断言没有页面 / console 错误，并通过 page.on('request') 断言没有访问非 localhost / 127.0.0.1 主机。开发测试使用 5175 端口，API 使用 4321。

六张截图写入 `/tmp/admin-shots-v3/`：`desktop-light.png`、`desktop-dark.png`（1440×900，分栏）、`new-post.png`、`git.png`、`mobile-list.png` 和 `mobile-editor.png`（390×844）。测试清理临时目录，不修改真实 content/。
