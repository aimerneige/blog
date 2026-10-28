import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor/editor/editor.api";
import "monaco-editor/languages/definitions/markdown/register";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";

(
  self as typeof self & { MonacoEnvironment: monaco.Environment }
).MonacoEnvironment = { getWorker: () => new EditorWorker() };
export type Editor = monaco.editor.IStandaloneCodeEditor;
export default function MarkdownEditor({
  value,
  dark,
  onChange,
  onReady,
  onSave,
  onUpload,
}: {
  value: string;
  dark: boolean;
  onChange: (value: string) => void;
  onReady: (editor: Editor | null) => void;
  onSave: () => void;
  onUpload: (file: File) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<Editor | null>(null);
  const callbacks = useRef({ onChange, onReady, onSave, onUpload });
  callbacks.current = { onChange, onReady, onSave, onUpload };
  // 正文由 Monaco 模型持有，避免 React 延迟回写覆盖快速输入；切换文章通过 key 重建。
  useEffect(() => {
    const instance = monaco.editor.create(host.current!, {
      value,
      language: "markdown",
      theme: dark ? "vs-dark" : "vs",
      automaticLayout: true,
      wordWrap: "on",
      minimap: { enabled: false },
      fontSize: 15,
      lineHeight: 26,
      fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      padding: { top: 22, bottom: 22 },
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 3,
      renderLineHighlight: "none",
      overviewRulerLanes: 0,
      accessibilitySupport: "on",
      ariaLabel: "Markdown 正文",
      tabSize: 2,
    });
    editor.current = instance;
    callbacks.current.onReady(instance);
    const change = instance.onDidChangeModelContent(() =>
      callbacks.current.onChange(instance.getValue()),
    );
    instance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
      callbacks.current.onSave(),
    );
    const paste = (event: ClipboardEvent) => {
      const file = [...(event.clipboardData?.files || [])].find((file) =>
        file.type.startsWith("image/"),
      );
      if (file) {
        event.preventDefault();
        event.stopPropagation();
        callbacks.current.onUpload(file);
      }
    };
    host.current!.addEventListener("paste", paste, true);
    const element = host.current!;
    return () => {
      element.removeEventListener("paste", paste, true);
      change.dispose();
      instance.getModel()?.dispose();
      instance.dispose();
      callbacks.current.onReady(null);
    };
  }, []);
  useEffect(() => {
    monaco.editor.setTheme(dark ? "vs-dark" : "vs");
  }, [dark]);
  return <div ref={host} className="monaco-host" data-testid="monaco" />;
}
