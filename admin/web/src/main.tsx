import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TableContainer,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  ArrowDownward,
  ArrowUpward,
  ArticleOutlined,
  Check,
  Close,
  Code,
  DarkModeOutlined,
  DeleteOutlined as DeleteOutline,
  ExpandMore,
  FolderOutlined,
  ImageOutlined,
  LightModeOutlined,
  MoreHoriz,
  PlayArrowRounded,
  SaveOutlined,
  Search,
  StopRounded,
  TerminalRounded,
  TuneRounded,
  ViewSidebarOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  AutoStoriesOutlined,
  AccountTreeOutlined,
  OpenInNew,
  DriveFileMoveOutlined,
  Refresh,
} from "@mui/icons-material";
import MarkdownIt from "markdown-it";
import MarkdownEditor, { type Editor } from "./MarkdownEditor";
import "./style.css";

type Fields = Record<string, any>;
type Post = Fields & {
  path: string;
  title: string;
  language: string;
  section: string;
};
type Document = { fields: Fields; body: string; revision: string };
const known = [
  "title",
  "date",
  "draft",
  "ShowToc",
  "tags",
  "categories",
  "summary",
  "description",
  "url",
  "layout",
  "cover",
];
async function api(route: string, data?: unknown) {
  const response = await fetch(
    `/api/${route}`,
    data === undefined
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
  );
  const result = await response.json();
  if (response.status === 401) window.dispatchEvent(new Event("admin-unauthorized"));
  if (!response.ok) throw Error(result.error);
  return result;
}
const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});
markdown.inline.ruler.before("text", "hugo_shortcode", (state, silent) => {
  const match = /^{{[<%][\s\S]*?[>%]}}/.exec(state.src.slice(state.pos));
  if (!match) return false;
  if (!silent) {
    const token = state.push("hugo_shortcode", "", 0);
    token.content = match[0];
  }
  state.pos += match[0].length;
  return true;
});
markdown.renderer.rules.hugo_shortcode = (tokens, index) =>
  `<span class="shortcode">Hugo · ${markdown.utils.escapeHtml(tokens[index].content)}</span>`;
const imageRule = markdown.renderer.rules.image!;
markdown.renderer.rules.image = (tokens, index, options, env, renderer) => {
  const token = tokens[index];
  let src = String(token.attrGet("src") || "");
  if (src.startsWith("images/")) src = "/" + src;
  // 本地预览不请求外部图片，避免文章内容触发第三方网络请求。
  if (!/^\/images\//.test(src) || src.includes("\\"))
    return `<span class="shortcode">图片：${markdown.utils.escapeHtml(token.content)}</span>`;
  token.attrSet("src", src);
  return imageRule(tokens, index, options, env, renderer);
};
function renderMarkdown(body: string) {
  return markdown.render(body);
}
function Log({ text }: { text: string }) {
  return (
    <Box component="pre" className="log">
      {text.split("\n").map((line, i) => (
        <Box
          component="span"
          key={i}
          sx={{
            display: "block",
            color: line.startsWith("+")
              ? "success.main"
              : line.startsWith("-")
                ? "error.main"
                : "inherit",
          }}
        >
          {line || " "}
        </Box>
      ))}
    </Box>
  );
}
function AuthGate() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const preference = localStorage.getItem("admin-theme");
  const dark = preference ? preference === "dark" : systemDark;
  const theme = createTheme({ palette: { mode: dark ? "dark" : "light", primary: { main: dark ? "#9fbdac" : "#365e4a" }, background: { default: dark ? "#171c1a" : "#f5f6f3", paper: dark ? "#202724" : "#ffffff" } }, shape: { borderRadius: 10 } });
  useEffect(() => {
    const unauthorized = () => setAuthenticated(false);
    window.addEventListener("admin-unauthorized", unauthorized);
    void api("session").then(result => {
      setAuthenticated(result.authenticated);
      if (result.authenticated) setMounted(true);
    }).catch(() => { setAuthenticated(false); setError("无法连接服务，请稍后重试"); });
    return () => window.removeEventListener("admin-unauthorized", unauthorized);
  }, []);
  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      if (!response.ok) { setError(response.status === 429 ? "尝试过多，请稍后再试" : "Token 错误"); return; }
      setToken(""); setMounted(true); setAuthenticated(true);
    } catch { setError("无法连接服务，请稍后重试"); }
    finally { setBusy(false); }
  }
  return <>
    <Box sx={{ display: authenticated ? "contents" : "none" }}>{mounted && <App />}</Box>
    {authenticated !== true && <ThemeProvider theme={theme}><CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", inset: 0, zIndex: 2000, bgcolor: "background.default", display: "grid", placeItems: "center", p: 3 }}>
        {authenticated === null ? <CircularProgress /> : <Box component="form" onSubmit={login} sx={{ width: "100%", maxWidth: 400, p: 4, bgcolor: "background.paper", borderRadius: 3, boxShadow: 3 }}>
          <Stack spacing={3}>
            <AutoStoriesOutlined color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" fontWeight={700}>博客管理</Typography>
            <Typography color="text.secondary">输入管理 Token 继续。当前页面与未保存的编辑会保留。</Typography>
            <TextField autoFocus label="Token" type={visible ? "text" : "password"} value={token} onChange={event => setToken(event.target.value)} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={visible ? "隐藏 Token" : "显示 Token"} onClick={() => setVisible(!visible)}>{visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</IconButton></InputAdornment> } }} />
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" type="submit" disabled={busy || !token}>{busy ? "登录中…" : "登录"}</Button>
          </Stack>
        </Box>}
      </Box>
    </ThemeProvider>}
  </>;
}
function App() {
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const mobile = useMediaQuery("(max-width: 760px)");
  const [preference, setPreference] = useState(() =>
    localStorage.getItem("admin-theme"),
  );
  const dark = preference ? preference === "dark" : systemDark;
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
          primary: { main: dark ? "#9fbdac" : "#365e4a" },
          secondary: { main: dark ? "#dabd94" : "#88633a" },
          background: {
            default: dark ? "#171c1a" : "#f5f6f3",
            paper: dark ? "#202724" : "#ffffff",
          },
          text: {
            primary: dark ? "#e5eae6" : "#25342b",
            secondary: dark ? "#acb9b0" : "#657168",
          },
          divider: dark ? "#354139" : "#e0e6df",
        },
        shape: { borderRadius: 10 },
        typography: {
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif',
          button: { textTransform: "none", fontWeight: 600 },
          h5: { fontWeight: 650 },
        },
        components: {
          MuiButton: { defaultProps: { disableElevation: true } },
          MuiTextField: { defaultProps: { size: "small" } },
          MuiIconButton: { defaultProps: { size: "small" } },
          MuiDialog: { styleOverrides: { paper: { backgroundImage: "none" } } },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                boxShadow: "none",
                "&:before": { display: "none" },
              },
            },
          },
        },
      }),
    [dark],
  );
  const [posts, setPosts] = useState<Post[]>([]),
    [folders, setFolders] = useState<string[]>([]);
  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState(params.get("q") || ""),
    [category, setCategory] = useState(params.get("category") || ""),
    [language, setLanguage] = useState(params.get("language") || ""),
    [draft, setDraft] = useState(params.get("draft") || ""),
    [tag, setTag] = useState(params.get("tag") || ""),
    [sort, setSort] = useState(params.get("sort") || "date"),
    [ascending, setAscending] = useState(params.get("order") === "asc");
  const [collapsed, setCollapsed] = useState(false);
  const [gitCount, setGitCount] = useState<number | null>(null);
  const dashboardUrl = useRef(location.pathname === "/" ? location.pathname + location.search : sessionStorage.getItem("admin-dashboard") || "/");
  const dashboardScroll = useRef(Number(sessionStorage.getItem("admin-scroll") || 0));
  const dashboard = useRef<HTMLElement | null>(null);
  const tableScroll = useRef(Number(sessionStorage.getItem("admin-table-scroll") || 0));
  const historyIndex = useRef(history.state?.adminIndex || 0);
  const routeLoad = useRef(0);
  const [actionPath, setActionPath] = useState("");
  const [path, setPath] = useState(""),
    [original, setOriginal] = useState<Document | null>(null);
  const [fields, setFields] = useState<Fields>({}),
    [body, setBody] = useState("");
  const [editing, setEditing] = useState(false),
    [view, setView] = useState("split");
  const [saving, setSaving] = useState(false),
    [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [dialog, setDialog] = useState(""),
    [output, setOutput] = useState(""),
    [gitMessage, setGitMessage] = useState("");
  const [menu, setMenu] = useState<HTMLElement | null>(null),
    [deleteOpen, setDeleteOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    category: "",
    slug: "",
    language: "zh",
  });
  const [preview, setPreview] = useState({ running: false, url: "", logs: "" }),
    [logsOpen, setLogsOpen] = useState(false);
  const editor = useRef<Editor | null>(null);
  const dirty =
    !!original &&
    (JSON.stringify(fields) !== JSON.stringify(original.fields) ||
      body !== original.body);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const notify = (text: string, error = false) => setMessage({ text, error });
  async function run(fn: () => Promise<void>) {
    try {
      await fn();
    } catch (error) {
      notify((error as Error).message, true);
    }
  }
  async function refresh() {
    const data = await api("posts");
    setPosts(data.posts);
    setFolders(data.folders);
    const git = await api("git");
    setGitCount(git.status.output.trim().split("\n").filter(Boolean).length);
  }
  async function logout() {
    await api("logout", {});
    window.dispatchEvent(new Event("admin-unauthorized"));
  }
  useEffect(() => {
    void run(async () => {
      await refresh();
      setPreview(await api("preview"));
    });
  }, []);
  useEffect(() => {
    if (!preview.running && !logsOpen) return;
    const timer = window.setInterval(() => {
      void api("preview")
        .then(setPreview)
        .catch((error) => {
          window.clearInterval(timer);
          notify(error.message, true);
        });
    }, 2000);
    return () => window.clearInterval(timer);
  }, [preview.running, logsOpen]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, []);
  function guard() {
    return !dirtyRef.current || window.confirm("尚有未保存的修改，确定离开？");
  }
  async function loadRoute() {
    const request = ++routeLoad.current;
    if (!location.pathname.startsWith("/edit/")) {
      setEditing(false);
      setOriginal(null);
      dirtyRef.current = false;
      const p = new URLSearchParams(location.search);
      setQuery(p.get("q") || "");
      setCategory(p.get("category") || "");
      setLanguage(p.get("language") || "");
      setDraft(p.get("draft") || "");
      setTag(p.get("tag") || "");
      setSort(p.get("sort") || "date");
      setAscending(p.get("order") === "asc");
      requestAnimationFrame(() => {
        if (dashboard.current) dashboard.current.scrollTop = dashboardScroll.current;
      });
      return;
    }
    const name = decodeURIComponent(location.pathname.slice(6));
    setEditing(true);
    setOriginal(null);
    const data = await api(`post?path=${encodeURIComponent(name)}`);
    if (request !== routeLoad.current) return;
    setOriginal(data);
    setFields(structuredClone(data.fields));
    setBody(data.body);
    setPath(name);
    dirtyRef.current = false;
  }
  function navigate(url: string) {
    if (dashboard.current) {
      dashboardScroll.current = dashboard.current.scrollTop;
      sessionStorage.setItem("admin-scroll", String(dashboardScroll.current));
    }
    historyIndex.current += 1;
    history.pushState({ adminIndex: historyIndex.current }, "", url);
    void run(loadRoute);
  }
  useEffect(() => {
    history.replaceState({ adminIndex: historyIndex.current }, "");
    history.scrollRestoration = "manual";
    void run(loadRoute);
    let reverting = false;
    const pop = (event: PopStateEvent) => {
      if (reverting) { reverting = false; return; }
      const next = event.state?.adminIndex || 0;
      if (!guard()) {
        reverting = true;
        history.go(historyIndex.current - next);
        return;
      }
      historyIndex.current = next;
      void run(loadRoute);
    };
    const links = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || event.ctrlKey || event.metaKey || event.button !== 0) return;
      if (!guard()) { event.preventDefault(); return; }
      if (link.origin === location.origin) { event.preventDefault(); navigate(link.pathname + link.search); }
    };
    window.addEventListener("popstate", pop);
    document.addEventListener("click", links);
    return () => { window.removeEventListener("popstate", pop); document.removeEventListener("click", links); };
  }, []);
  useEffect(() => {
    if (location.pathname !== "/") return;
    const p = new URLSearchParams();
    Object.entries({ q: query, category, language, draft, tag, sort: sort === "date" ? "" : sort, order: ascending ? "asc" : "" }).forEach(([key, value]) => { if (value) p.set(key, value); });
    dashboardUrl.current = "/" + (p.size ? `?${p}` : "");
    sessionStorage.setItem("admin-dashboard", dashboardUrl.current);
    history.replaceState(history.state, "", dashboardUrl.current);
  }, [query, category, language, draft, tag, sort, ascending, editing]);
  async function open(name: string, discard = false) {
    if (!discard && !guard()) return;
    navigate(`/edit/${name.split("/").map(encodeURIComponent).join("/")}`);
  }
  async function save() {
    if (!original || saving) return;
    if (coverError) {
      notify("请先修正封面 JSON", true);
      return;
    }
    setSaving(true);
    try {
      const savedBody = editor.current?.getValue() ?? body;
      const changed = Object.fromEntries(
        Object.entries(fields)
          .filter(
            ([key, value]) =>
              known.includes(key) &&
              JSON.stringify(value) !== JSON.stringify(original.fields[key]),
          )
          .map(([key, value]) => [key, value === "" ? null : value]),
      );
      const result = await api("save", {
        path,
        fields: changed,
        body: savedBody,
        revision: original.revision,
      });
      setOriginal({
        fields: structuredClone(fields),
        body: savedBody,
        revision: result.revision,
      });
      notify("已保存");
      await refresh();
    } catch (error) {
      notify((error as Error).message, true);
    } finally {
      setSaving(false);
    }
  }
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const set = (key: string, value: unknown) =>
    setFields((current) => ({ ...current, [key]: value }));
  const counts = (key: string) => {
    const result = new Map<string, number>();
    posts.forEach((post) =>
      (Array.isArray(post[key]) ? post[key] : []).forEach((value: string) =>
        result.set(value, (result.get(value) || 0) + 1),
      ),
    );
    return [...result].sort((a, b) => b[1] - a[1]);
  };
  const categories = [
    ...new Set(
      posts
        .flatMap((post) => [
          post.section,
          ...(Array.isArray(post.categories) ? post.categories : []),
        ])
        .filter(Boolean),
    ),
  ].sort();
  const filtered = useMemo(
    () =>
      posts
        .filter(
          (post) =>
            `${post.title} ${JSON.stringify(post.tags)}`
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (!category ||
              post.section === category ||
              post.categories?.includes(category)) &&
            (!language || post.language === language) &&
            (!draft || String(!!post.draft) === draft) &&
            (!tag || post.tags?.includes(tag)),
        )
        .sort(
          (a, b) =>
            (sort === "date" ? ((Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)) : String(b[sort] ?? "").localeCompare(String(a[sort] ?? ""))) *
            (ascending ? -1 : 1),
        ),
    [posts, query, category, language, draft, tag, sort, ascending],
  );
  async function upload(file: File) {
    if (file.size > 10000000) throw Error("图片须小于 10 MB");
    if (!file.type.startsWith("image/")) throw Error("请选择图片文件");
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(Error("读取图片失败"));
      reader.readAsDataURL(file);
    });
    const result = await api("upload", { name: file.name, data });
    const text = `![图片](${result.url})`;
    if (editor.current) {
      editor.current.executeEdits("image-upload", [
        { range: editor.current.getSelection()!, text, forceMoveMarkers: true },
      ]);
      editor.current.focus();
    } else setBody((current) => current + "\n" + text);
    notify("图片已上传，保存文章以保留链接");
  }
  async function showGit() {
    setDialog("git");
    setOutput("正在读取 Git…");
    const data = await api("git");
    setOutput(
      (data.status.output || "工作区干净") +
        "\n\n" +
        (data.diff.output || "暂无已跟踪文件差异"),
    );
  }
  const coverSimple =
    fields.cover === undefined ||
    (fields.cover &&
      typeof fields.cover === "object" &&
      !Array.isArray(fields.cover) &&
      Object.values(fields.cover).every(
        (value) =>
          ["string", "boolean", "number"].includes(typeof value) ||
          value === null,
      ));
  const dateParts =
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}:\d{2})$/.exec(
      String(fields.date ?? ""),
    );
  const [coverRaw, setCoverRaw] = useState(""),
    [coverError, setCoverError] = useState(false);
  useEffect(() => {
    setCoverRaw(
      fields.cover === undefined ? "" : JSON.stringify(fields.cover, null, 2),
    );
    setCoverError(false);
  }, [path]);
  const icon = (title: string, child: React.ReactNode, action: () => void) => (
    <Tooltip title={title}>
      <IconButton aria-label={title} onClick={action}>
        {child}
      </IconButton>
    </Tooltip>
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {!editing && <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar className="app-toolbar" sx={{ gap: 1.5 }}>
          <Button sx={{ whiteSpace: "nowrap" }} onClick={() => void run(logout)}>退出登录</Button>
          {mobile && editing ? (
            icon("返回文章列表", <ArrowBack />, () => {
              if (guard()) setEditing(false);
            })
          ) : (
            <Box className="brand-mark">
              <AutoStoriesOutlined />
            </Box>
          )}
          <Box sx={{ flexShrink: 0 }}>
            <Typography fontWeight={750} fontSize={19}>
              墨笺<span className="brand-sub"> / 博客工作台</span>
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="desktop-only"
            >
              AIMERNEIGE · LOCAL STUDIO
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box className="desktop-only">
            <Button
              size="small"
              color={preview.running ? "primary" : "inherit"}
              startIcon={
                preview.running ? <StopRounded /> : <PlayArrowRounded />
              }
              onClick={() =>
                void run(async () => {
                  await api("preview", {
                    action: preview.running ? "stop" : "start",
                  });
                  setPreview(await api("preview"));
                })
              }
            >
              {preview.running ? "预览运行中" : "Hugo 预览"}
            </Button>
            {preview.running && (
              <Button
                href={preview.url}
                target="_blank"
                rel="noopener"
                aria-label="打开 Hugo 预览"
              >
                <OpenInNew fontSize="small" />
              </Button>
            )}
            {icon("预览日志", <TerminalRounded />, () => {
              setLogsOpen(true);
              void run(async () => setPreview(await api("preview")));
            })}
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: 1,
                height: 24,
                display: "inline-block",
                verticalAlign: "middle",
              }}
            />
            {icon(
              "构建检查",
              <Check />,
              () =>
                void run(async () => {
                  setDialog("build");
                  setOutput("正在运行 hugo --minify…");
                  const data = await api("build", {});
                  setOutput(`退出码：${data.code}\n${data.output}`);
                }),
            )}
            {icon("Git", <AccountTreeOutlined />, () => void run(showGit))}
            {icon("标签 / 分类", <TuneRounded />, () => setDialog("overview"))}
          </Box>
          {icon(
            dark ? "切换浅色模式" : "切换深色模式",
            dark ? <LightModeOutlined /> : <DarkModeOutlined />,
            () => {
              const next = dark ? "light" : "dark";
              setPreference(next);
              localStorage.setItem("admin-theme", next);
            },
          )}
          <Button
            aria-label="新建文章"
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              if (guard()) setDialog("new");
            }}
            sx={{ whiteSpace: "nowrap" }}
          >
            新建<span className="desktop-only">文章</span>
          </Button>
        </Toolbar>
      </AppBar>}
      <Box className={`workspace ${editing ? "is-editing" : ""}`}>
        {!editing && <Box
          ref={dashboard}
          component="main"
          className="sidebar"
          sx={{
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <Box className="dashboard-heading">
            <Typography variant="overline" color="text.secondary">CONTENT STUDIO</Typography>
            <Typography variant="h4" fontWeight={700}>管理面板</Typography>
            <Typography color="text.secondary" mt={1}>整理文章，留住每一个值得记录的想法。</Typography>
          </Box>
          <Box className="summary-grid">
            {[["文章总数", posts.length], ["草稿", posts.filter(p => p.draft).length], ["中文 / English", `${posts.filter(p => p.language === "zh").length} / ${posts.filter(p => p.language === "en").length}`], ["Git 未提交变更", gitCount ?? "—"]].map(([label, value]) => <Box key={label} className="summary-card" sx={{bgcolor:"background.paper", border:1, borderColor:"divider"}}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={650} mt={1}>{value}</Typography></Box>)}
          </Box>
          <Accordion className="taxonomy" disableGutters>
            <AccordionSummary expandIcon={<ExpandMore/>}>标签与分类 · 点击筛选</AccordionSummary>
            <AccordionDetails>{["categories", "tags"].map(key => <Box key={key} mb={2}><Typography variant="body2" mb={1}>{key === "tags" ? "标签" : "分类"}</Typography><Stack direction="row" flexWrap="wrap" gap={1}>{counts(key).map(([name,count]) => <Chip key={name} size="small" variant="outlined" label={`${name} · ${count}`} onClick={() => key === "tags" ? setTag(name) : setCategory(name)}/>)}</Stack></Box>)}</AccordionDetails>
          </Accordion>
          <Box className="dashboard-filters" sx={{ p: 2.5, pb: 1.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography fontWeight={700}>
                文章库{" "}
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  ml={1}
                >
                  {posts.length}
                </Typography>
              </Typography>
              <ArticleOutlined color="disabled" fontSize="small" />
            </Stack>
            <TextField
              fullWidth
              placeholder="搜索标题、标签…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { "aria-label": "搜索文章" },
              }}
            />
            <Stack direction="row" gap={1} mt={1.5}>
              <TextField
                select
                label="分类 / 栏目"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                fullWidth
              >
                <MenuItem value="">全部分类</MenuItem>
                {categories.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="状态"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="">全部</MenuItem>
                <MenuItem value="true">草稿</MenuItem>
                <MenuItem value="false">已发布</MenuItem>
              </TextField>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mt={1.5}
            >
              <ToggleButtonGroup
                size="small"
                exclusive
                value={language}
                onChange={(_, value) => value !== null && setLanguage(value)}
                aria-label="文章语言"
              >
                <ToggleButton value="">全部</ToggleButton>
                <ToggleButton value="zh">中文</ToggleButton>
                <ToggleButton value="en">EN</ToggleButton>
              </ToggleButtonGroup>
              {icon(
                ascending ? "按日期降序" : "按日期升序",
                ascending ? (
                  <ArrowUpward fontSize="small" />
                ) : (
                  <ArrowDownward fontSize="small" />
                ),
                () => setAscending(!ascending),
              )}
            </Stack>
          </Box>
          <Stack direction="row" px={2.5} py={1} justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {filtered.length} 篇文章
            </Typography>
            <Typography variant="caption" color="text.secondary">
              按日期{ascending ? "升序" : "降序"}
            </Typography>
          </Stack>
          <TableContainer ref={element => { if (element) element.scrollTop = tableScroll.current; }} onScroll={event => { tableScroll.current = event.currentTarget.scrollTop; sessionStorage.setItem("admin-table-scroll", String(tableScroll.current)); }} className="post-table" sx={{bgcolor:"background.paper", border:1, borderColor:"divider", borderRadius:2}}>
            <Table stickyHeader aria-label="文章列表">
              <TableHead><TableRow>{[["title","标题"],["language","语言"],["categories","分类"],["tags","标签"],["date","日期"],["draft","状态"]].map(([key,label]) => <TableCell key={key}><TableSortLabel active={sort === key} direction={ascending ? "asc" : "desc"} onClick={() => {setSort(key); setAscending(sort === key ? !ascending : true);}}>{label}</TableSortLabel></TableCell>)}<TableCell>操作</TableCell></TableRow></TableHead>
              <TableBody>{filtered.map(post => <TableRow hover key={post.path} onClick={() => void run(() => open(post.path))} sx={{cursor:"pointer"}}>
                <TableCell sx={{maxWidth:360}}><Typography fontSize={14} fontWeight={600}>{post.title || post.path}</Typography><Typography variant="caption" color="text.secondary" sx={{overflowWrap:"anywhere"}}>{post.path}</Typography></TableCell>
                <TableCell>{post.language.toUpperCase()}</TableCell><TableCell>{(post.categories || []).join("、") || post.section}</TableCell><TableCell sx={{maxWidth:220}}>{(post.tags || []).slice(0,3).join(" · ")}</TableCell><TableCell sx={{whiteSpace:"nowrap"}}>{String(post.date || "").slice(0,10)}</TableCell><TableCell><Chip size="small" variant="outlined" color={post.draft ? "secondary" : "default"} label={post.draft ? "草稿" : "已发布"}/></TableCell>
                <TableCell sx={{whiteSpace:"nowrap"}} onClick={e => e.stopPropagation()}><Button size="small" onClick={() => void run(() => open(post.path))}>编辑</Button><IconButton aria-label={`重命名 ${post.title}`} onClick={() => {setActionPath(post.path);setMoveTarget(post.path);setDialog("move");}}><DriveFileMoveOutlined fontSize="small"/></IconButton><IconButton aria-label={`删除 ${post.title}`} onClick={() => {setActionPath(post.path);setDeleteOpen(true);}}><DeleteOutline fontSize="small"/></IconButton></TableCell>
              </TableRow>)}</TableBody>
            </Table>
          </TableContainer>
          <List className="mobile-posts" aria-label="文章卡片列表">{filtered.map(post => <Box key={post.path} sx={{bgcolor:"background.paper", border:1, borderColor:"divider", borderRadius:2, mb:1.5, p:2}}><ListItemButton onClick={() => void run(() => open(post.path))}><Box><Typography fontWeight={650}>{post.title || post.path}</Typography><Typography variant="caption" color="text.secondary">{post.language.toUpperCase()} · {String(post.date || "").slice(0,10)} · {post.section}</Typography></Box></ListItemButton><Stack direction="row" justifyContent="space-between"><Chip size="small" variant="outlined" label={post.draft ? "草稿" : "已发布"}/><Button size="small" onClick={() => void run(() => open(post.path))}>编辑</Button><IconButton aria-label={`重命名 ${post.title}`} onClick={() => {setActionPath(post.path);setMoveTarget(post.path);setDialog("move");}}><DriveFileMoveOutlined fontSize="small"/></IconButton><IconButton aria-label={`删除 ${post.title}`} onClick={() => {setActionPath(post.path);setDeleteOpen(true);}}><DeleteOutline fontSize="small"/></IconButton></Stack></Box>)}</List>
          {!filtered.length && <Typography textAlign="center" p={5} color="text.secondary">没有匹配的文章</Typography>}
          {(tag || category || query || language || draft) && <Button onClick={() => {setTag("");setCategory("");setQuery("");setLanguage("");setDraft("");}}>清除筛选 {tag}</Button>}
          {mobile && (
            <Stack
              direction="row"
              justifyContent="space-around"
              p={1}
              borderTop={1}
              borderColor="divider"
            >
              {icon("Git", <AccountTreeOutlined />, () => void run(showGit))}
              {icon("标签 / 分类", <TuneRounded />, () =>
                setDialog("overview"),
              )}
              {icon("Hugo 预览与日志", <TerminalRounded />, () =>
                setLogsOpen(true),
              )}
              {icon(
                "构建检查",
                <Check />,
                () =>
                  void run(async () => {
                    setDialog("build");
                    setOutput("构建中…");
                    setOutput((await api("build", {})).output);
                  }),
              )}
            </Stack>
          )}
        </Box>}
        {editing && <Box component="main" className="main-pane">
          {!original ? (
            <Box className="welcome"><Typography>正在打开文章…</Typography><Button onClick={() => navigate(dashboardUrl.current)}>返回管理面板</Button></Box>
          ) : (
            <>
              <Stack
                className="document-toolbar"
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                {icon("返回管理面板", <ArrowBack />, () => { if (guard()) navigate(dashboardUrl.current); })}
                {icon(dark ? "切换浅色模式" : "切换深色模式", dark ? <LightModeOutlined/> : <DarkModeOutlined/>, () => { const next = dark ? "light" : "dark"; setPreference(next);localStorage.setItem("admin-theme",next); })}
                <FolderOutlined
                  fontSize="small"
                  color="disabled"
                  sx={{ flexShrink: 0 }}
                />
                <Tooltip title={`content/${path}`}>
                  <Typography
                    data-testid="filepath"
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ flex: 1, minWidth: 0, fontFamily: "monospace" }}
                  >
                    {path}
                  </Typography>
                </Tooltip>
                <Chip
                  className="save-state"
                  size="small"
                  variant="outlined"
                  color={dirty ? "secondary" : "default"}
                  label={dirty ? "未保存" : "已同步"}
                  icon={dirty ? undefined : <Check />}
                />
                <Button
                  variant="contained"
                  startIcon={
                    saving ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SaveOutlined />
                    )
                  }
                  disabled={saving || coverError}
                  onClick={() => void save()}
                >
                  保存
                </Button>
                <IconButton
                  aria-label="文章操作"
                  onClick={(event) => setMenu(event.currentTarget)}
                >
                  <MoreHoriz />
                </IconButton>
              </Stack>
              <Box className={`document-scroll ${collapsed ? "is-collapsed" : ""}`}>
                <Button className="metadata-toggle" startIcon={<TuneRounded/>} onClick={() => setCollapsed(!collapsed)}>{collapsed ? "展开文章信息" : "收起文章信息"}</Button>
                <Box className="metadata" sx={{ bgcolor: "background.paper" }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    letterSpacing={2}
                  >
                    文章信息
                  </Typography>
                  <TextField
                    label="标题"
                    fullWidth
                    value={fields.title ?? ""}
                    onChange={(event) => set("title", event.target.value)}
                    sx={{
                      mt: 1,
                      mb: 2,
                      "& input": {
                        fontSize: { xs: 22, md: 27 },
                        fontWeight: 650,
                        py: 1.7,
                      },
                    }}
                  />
                  <Box className="field-grid">
                    {dateParts ? (
                      <Box sx={{ display: "flex", gap: 1, minWidth: 0 }}>
                        <TextField
                          type="datetime-local"
                          label="日期"
                          value={dateParts[1]}
                          onChange={(event) =>
                            set("date", event.target.value + dateParts[2])
                          }
                          slotProps={{
                            htmlInput: { step: 1 },
                            inputLabel: { shrink: true },
                          }}
                          sx={{ flex: 1, minWidth: 0 }}
                        />
                        <TextField
                          label="原时区"
                          value={dateParts[2]}
                          slotProps={{ input: { readOnly: true } }}
                          sx={{ width: 94, flexShrink: 0 }}
                        />
                      </Box>
                    ) : (
                      <TextField
                        label="日期（含时区）"
                        value={fields.date ?? ""}
                        onChange={(event) => set("date", event.target.value)}
                        placeholder="2026-10-28T12:00:00+08:00"
                        slotProps={{ htmlInput: { spellCheck: false } }}
                      />
                    )}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={!!fields.draft}
                            onChange={(event) =>
                              set("draft", event.target.checked)
                            }
                          />
                        }
                        label={<Typography fontSize={13}>草稿</Typography>}
                      />
                      <FormControlLabel
                        sx={{ mr: 0 }}
                        control={
                          <Switch
                            size="small"
                            checked={!!fields.ShowToc}
                            onChange={(event) =>
                              set("ShowToc", event.target.checked)
                            }
                          />
                        }
                        label={<Typography fontSize={13}>显示目录</Typography>}
                      />
                    </Stack>
                    {(["tags", "categories"] as const).map((key) => (
                      <Autocomplete
                        key={key}
                        multiple
                        freeSolo
                        options={counts(key).map(([name]) => name)}
                        value={Array.isArray(fields[key]) ? fields[key] : []}
                        onChange={(_, value) => set(key, value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={key === "tags" ? "标签" : "分类"}
                            placeholder="输入后按 Enter"
                          />
                        )}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Accordion
                    disableGutters
                    sx={{ mt: 1, bgcolor: "transparent" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{ px: 0, minHeight: 40 }}
                    >
                      <Typography fontSize={12} color="text.secondary">
                        更多设置 · 摘要、链接与封面
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <Box className="field-grid">
                        {["summary", "description", "url", "layout"].map(
                          (key) => (
                            <TextField
                              key={key}
                              label={
                                {
                                  summary: "摘要",
                                  description: "描述",
                                  url: "固定链接",
                                  layout: "布局",
                                }[key]
                              }
                              value={fields[key] ?? ""}
                              onChange={(event) => set(key, event.target.value)}
                              multiline={["summary", "description"].includes(
                                key,
                              )}
                            />
                          ),
                        )}
                      </Box>
                      <Typography fontSize={13} fontWeight={600} my={2}>
                        封面
                      </Typography>
                      {coverSimple ? (
                        <Box className="field-grid">
                          {[
                            ...new Set([
                              "image",
                              "alt",
                              "caption",
                              "relative",
                              "hidden",
                              "hiddenInList",
                              "hiddenInSingle",
                              ...Object.keys(fields.cover || {}),
                            ]),
                          ].map((key) =>
                            typeof fields.cover?.[key] === "boolean" ||
                            [
                              "relative",
                              "hidden",
                              "hiddenInList",
                              "hiddenInSingle",
                            ].includes(key) ? (
                              <FormControlLabel
                                key={key}
                                control={
                                  <Switch
                                    checked={!!fields.cover?.[key]}
                                    onChange={(event) =>
                                      set("cover", {
                                        ...fields.cover,
                                        [key]: event.target.checked,
                                      })
                                    }
                                  />
                                }
                                label={key}
                              />
                            ) : (
                              <TextField
                                key={key}
                                label={key}
                                value={fields.cover?.[key] ?? ""}
                                onChange={(event) =>
                                  set("cover", {
                                    ...fields.cover,
                                    [key]: event.target.value,
                                  })
                                }
                              />
                            ),
                          )}
                        </Box>
                      ) : (
                        <TextField
                          label="封面 JSON"
                          fullWidth
                          multiline
                          minRows={4}
                          value={coverRaw}
                          error={coverError}
                          helperText={
                            coverError
                              ? "JSON 格式无效，修正后可保存"
                              : "复杂封面结构保持原样"
                          }
                          onChange={(event) => {
                            setCoverRaw(event.target.value);
                            try {
                              set(
                                "cover",
                                event.target.value.trim()
                                  ? JSON.parse(event.target.value)
                                  : null,
                              );
                              setCoverError(false);
                            } catch {
                              setCoverError(true);
                            }
                          }}
                        />
                      )}
                      {Object.keys(fields).some(
                        (key) => !known.includes(key),
                      ) && (
                        <>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            mt={2}
                          >
                            其他字段 · 只读保留
                          </Typography>
                          <Log
                            text={JSON.stringify(
                              Object.fromEntries(
                                Object.entries(fields).filter(
                                  ([key]) => !known.includes(key),
                                ),
                              ),
                              null,
                              2,
                            )}
                          />
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
                <Box
                  className="editor-shell"
                  onDragOver={(event) => {
                    if (event.dataTransfer.types.includes("Files"))
                      event.preventDefault();
                  }}
                  onDrop={(event) => {
                    if (event.dataTransfer.files.length) {
                      event.preventDefault();
                      void run(() => upload(event.dataTransfer.files[0]));
                    }
                  }}
                >
                  <Stack
                    className="editor-toolbar"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                  >
                    <ToggleButtonGroup
                      exclusive
                      value={mobile && view === "split" ? "edit" : view}
                      size="small"
                      onChange={(_, value) => value && setView(value)}
                      aria-label="编辑视图"
                    >
                      <ToggleButton value="edit">
                        <Code fontSize="small" />
                        编辑
                      </ToggleButton>
                      {!mobile && (
                        <ToggleButton value="split">
                          <ViewSidebarOutlined fontSize="small" />
                          分栏
                        </ToggleButton>
                      )}
                      <ToggleButton value="preview">
                        <VisibilityOutlined fontSize="small" />
                        预览
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                      component="label"
                      size="small"
                      color="inherit"
                      startIcon={<ImageOutlined />}
                    >
                      插入图片
                      <input
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void run(() => upload(file));
                          event.target.value = "";
                        }}
                      />
                    </Button>
                  </Stack>
                  <Box
                    className={`writing view-${mobile && view === "split" ? "edit" : view}`}
                    sx={{
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    {view !== "preview" && (
                      <MarkdownEditor
                        key={path}
                        value={body}
                        dark={dark}
                        onChange={setBody}
                        onReady={(value) => {
                          editor.current = value;
                        }}
                        onSave={() => void saveRef.current()}
                        onUpload={(file) => void run(() => upload(file))}
                      />
                    )}
                    {view !== "edit" && !(mobile && view === "split") && (
                      <Box
                        className="article-wrap"
                        sx={{
                          borderLeft: view === "split" ? 1 : 0,
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          className="preview-label"
                          variant="overline"
                          color="text.secondary"
                        >
                          文章预览
                        </Typography>
                        <article
                          className="markdown"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(body),
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    px={0.5}
                    py={1}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Markdown · {body.length.toLocaleString()} 字符
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {mobile
                        ? "支持粘贴与拖入图片"
                        : "拖入 / 粘贴图片 · Ctrl / ⌘ S 保存"}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </>
          )}
        </Box>}
      </Box>
      <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)}>
        <MenuItem onClick={() => { setMenu(null); void run(logout); }}>退出登录</MenuItem>
        <MenuItem
          onClick={() => {
            setMenu(null);
            if (guard()) {
              setActionPath(path);
              setMoveTarget(path);
              setDialog("move");
            }
          }}
        >
          <DriveFileMoveOutlined sx={{ mr: 1 }} />
          重命名 / 移动
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenu(null);
            setActionPath(path);
            setDeleteOpen(true);
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteOutline sx={{ mr: 1 }} />
          删除文章
        </MenuItem>
        {mobile && (
          <MenuItem
            onClick={() => {
              setMenu(null);
              void run(showGit);
            }}
          >
            Git
          </MenuItem>
        )}
      </Menu>
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>删除这篇文章？</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
            {actionPath}
          </Typography>
          <Typography mt={2}>
            文章将移入回收目录。未保存的修改会丢失。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>取消</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() =>
              void run(async () => {
                await api("delete", { path: actionPath });
                dirtyRef.current = false;
                if (editing) navigate(dashboardUrl.current);
                setOriginal(null);
                setPath("");
                setEditing(false);
                setDeleteOpen(false);
                await refresh();
                notify("已移入回收目录");
              })
            }
          >
            移入回收目录
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!dialog}
        onClose={() => !busy && setDialog("")}
        fullWidth
        maxWidth={["git", "build"].includes(dialog) ? "md" : "sm"}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {
            {
              new: "新建文章",
              git: "Git · 内容与图片",
              overview: "标签 / 分类",
              build: "构建检查",
              commit: "确认 Git 提交",
              move: "重命名 / 移动",
            }[dialog]
          }
          <IconButton
            aria-label="关闭对话框"
            onClick={() => setDialog("")}
            disabled={busy}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {dialog === "new" ? (
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              void run(async () => {
                try {
                  const result = await api("create", newPost);
                  setDialog("");
                  await refresh();
                  await open(result.paths[0], true);
                  notify("草稿已创建");
                } finally {
                  setBusy(false);
                }
              });
            }}
          >
            <DialogContent sx={{ pt: 1 }}>
              <Typography color="text.secondary" fontSize={14} mb={3}>
                给新的想法一个标题，其余的慢慢写。
              </Typography>
              <Stack gap={2.5}>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  label="文章标题"
                  value={newPost.title}
                  onChange={(event) =>
                    setNewPost({ ...newPost, title: event.target.value })
                  }
                />
                <Autocomplete
                  freeSolo
                  options={folders}
                  inputValue={newPost.category}
                  onInputChange={(_, value) =>
                    setNewPost((current) => ({ ...current, category: value }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} required label="分类目录" />
                  )}
                />
                <TextField
                  required
                  label="Slug"
                  helperText="用作文件名，例如 hello-world"
                  value={newPost.slug}
                  onChange={(event) =>
                    setNewPost({ ...newPost, slug: event.target.value })
                  }
                />
                <TextField
                  select
                  label="语言"
                  value={newPost.language}
                  onChange={(event) =>
                    setNewPost({ ...newPost, language: event.target.value })
                  }
                >
                  <MenuItem value="zh">中文</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="both">中英双语</MenuItem>
                </TextField>
                <Alert severity="info" icon={<ArticleOutlined />}>
                  以草稿创建，准备好后再发布。
                </Alert>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDialog("")}>取消</Button>
              <Button
                type="submit"
                disabled={busy}
                variant="contained"
                startIcon={<Add />}
              >
                创建草稿
              </Button>
            </DialogActions>
          </Box>
        ) : dialog === "overview" ? (
          <DialogContent>
            {["tags", "categories"].map((key) => (
              <Box key={key} mb={3}>
                <Typography fontWeight={650} mb={2}>
                  {key === "tags" ? "标签" : "分类"}
                  <Typography
                    variant="caption"
                    component="span"
                    color="text.secondary"
                    ml={1}
                  >
                    {counts(key).length} 项 · 点击筛选文章
                  </Typography>
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {counts(key).map(([name, count]) => (
                    <Chip
                      key={name}
                      label={`${name} · ${count}`}
                      variant="outlined"
                      onClick={() => {
                        if (key === "tags") {
                          setQuery(name);
                          setCategory("");
                        } else {
                          setCategory(name);
                          setQuery("");
                        }
                        setLanguage("");
                        setDraft("");
                        setEditing(false);
                        setDialog("");
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </DialogContent>
        ) : dialog === "move" ? (
          <>
            <DialogContent>
              <Typography color="text.secondary" mb={2}>
                输入 content/ 下的新路径。页面包图片不会随文件移动。
              </Typography>
              <TextField
                fullWidth
                label="新路径"
                value={moveTarget}
                onChange={(event) => setMoveTarget(event.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialog("")}>取消</Button>
              <Button
                variant="contained"
                onClick={() =>
                  void run(async () => {
                    await api("move", { path: actionPath, target: moveTarget });
                    setDialog("");
                    await refresh();
                    if (editing) { dirtyRef.current = false; await open(moveTarget, true); }
                  })
                }
              >
                移动
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <Log text={output} />
            {dialog === "git" && (
              <Stack gap={2} mt={3}>
                <TextField
                  label="提交信息"
                  placeholder="feat: add new post"
                  value={gitMessage}
                  onChange={(event) => setGitMessage(event.target.value)}
                />
                <Button variant="outlined" onClick={() => setDialog("commit")}>
                  提交全部 content / static 变更
                </Button>
              </Stack>
            )}
          </DialogContent>
        )}
        {dialog === "commit" && (
          <DialogActions>
            <Button onClick={() => setDialog("git")}>取消</Button>
            <Button
              disabled={busy}
              variant="contained"
              onClick={() => {
                setBusy(true);
                void run(async () => {
                  try {
                    const result = await api("commit", { message: gitMessage });
                    setOutput(result.output);
                    setDialog("git");
                    notify(
                      result.code === 0 ? "提交完成" : "提交失败，请查看输出",
                      result.code !== 0,
                    );
                  } finally {
                    setBusy(false);
                  }
                });
              }}
            >
              确认提交全部变更
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Drawer
        anchor="right"
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: "100%", sm: 560 }, p: 3 } } }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">Hugo 预览日志</Typography>
          <IconButton aria-label="关闭日志" onClick={() => setLogsOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
        <Stack direction="row" gap={1} my={2}>
          <Button
            startIcon={preview.running ? <StopRounded /> : <PlayArrowRounded />}
            onClick={() =>
              void run(async () => {
                await api("preview", {
                  action: preview.running ? "stop" : "start",
                });
                setPreview(await api("preview"));
              })
            }
          >
            {preview.running ? "停止预览" : "启动预览"}
          </Button>
          <Button
            startIcon={<Refresh />}
            onClick={() =>
              void run(async () => setPreview(await api("preview")))
            }
          >
            刷新日志
          </Button>
        </Stack>
        {preview.running && (
          <Button href={preview.url} target="_blank" endIcon={<OpenInNew />}>
            {preview.url}
          </Button>
        )}
        <Log
          text={preview.logs || "暂无日志。启动 Hugo 预览后可在此查看输出。"}
        />
      </Drawer>
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={message?.error ? "error" : "success"}
          variant="filled"
          onClose={() => setMessage(null)}
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
createRoot(document.getElementById("root")!).render(<AuthGate />);
