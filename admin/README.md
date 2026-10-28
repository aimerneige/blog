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
- YAML 使用文档节点更新，尽量保留顺序、注释和未知字段；仅修改正文时 front matter 保持原始字节。无变化不写文件。外部编辑导致版本冲突时需重新打开文章。
- 新文章写入 `content/post/<分类>/<slug>.en.md` / `.zh.md`，可同时生成双语草稿。默认值沿用 archetypes/default.md 的 title、date、draft、ShowToc 约定，并填写分类和空标签。日期使用 UTC `+00:00`。
- 重命名 / 移动仅操作 Markdown 文件，不搬移页面包图片。现有页面包内 Markdown 也会列出。
- 删除前需确认。原文件移到 `content/.admin-trash/<随机编号>/原路径.deleted`，此目录被 Git 忽略，后缀避免 Hugo 发布。可在终端手动移回原路径恢复；回收站不自动清理。
- 图片上传到 `static/images`，随机文件名避免覆盖，并插入 `/images/...` Markdown 链接。支持 PNG/JPEG/GIF/WebP/AVIF，界面限制 10 MB。不提供页面包上传。预览仅展示近似 Markdown，站内图片链接以文本显示，完整效果使用 Hugo 预览。
- Hugo 面板提供启动 / 停止、预览链接及手动刷新日志。构建按钮执行 `hugo --minify`，输出位于博客 public/。
- Git 面板展示 content、static 的状态与已跟踪文件差异，新文件见状态列表。确认后提交这两个目录的全部变更；如暂存区已有文件则拒绝提交。提交不运行 Git hooks，不推送；请先检查面板与终端中的变更。没有提供推送接口。

## 安全与限制

这是单用户本地工具，无登录。必须用打印的 127.0.0.1 地址访问，Host 必须匹配本机监听端口；有 Origin 时必须与管理地址一致。写接口只接受 JSON。请勿代理到公网或在不可信共享主机运行。

文件操作限制在 content 与 static，拒绝绝对路径、上级路径、反斜线和符号链接；前端不能指定命令，仅允许固定 Hugo / Git 操作。预览转义原始 HTML，不执行文章脚本与 Hugo shortcode。Git/Hugo 仍会读取博客自身配置；只应打开可信博客。检查输出最多保留约 200 KB，预览日志约 100 KB。

YAML 修改可能规范化已修改 front matter 的空白格式；未知字段值和顺序尽量保留。没有多用户锁、完整 Markdown 渲染、图片库或撤销栈。双语创建预检重名，但不提供跨文件事务。文件保存采用版本校验，仍应使用 Git 备份。

## 验证

```bash
npm test
```

测试使用独立临时博客目录（作为 BLOG_ROOT 传入应用），覆盖 YAML round-trip、无变化不写入、版本冲突、路径与符号链接拒绝、Host/Origin、防重复创建、双语创建、移动、回收删除和上传，不修改真实 content。
