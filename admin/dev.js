import { spawn } from "node:child_process";
import { createServer } from "vite";
if (!process.env.ADMIN_TOKEN) {
  console.error('错误：请设置 ADMIN_TOKEN，例如：ADMIN_TOKEN=$(openssl rand -hex 24) npm --prefix admin start');
  process.exit(1);
}
const backend = spawn(process.execPath, ["server.js"], {
  stdio: ["inherit", "pipe", "inherit"],
  env: { ...process.env, PORT: process.env.PORT || "4321", ADMIN_DEV: "1" },
});
backend.stdout.pipe(process.stdout);
let vite;
async function close() {
  backend.kill();
  await vite?.close();
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
backend.on("exit", () => {
  void vite?.close();
});
try {
  await new Promise((resolve, reject) => {
    backend.stdout.on("data", (data) => {
      if (String(data).includes("http://127.0.0.1:")) resolve();
    });
    backend.once("error", reject);
    backend.once("exit", (code) => reject(Error(`API server exited: ${code}`)));
  });
  vite = await createServer();
  await vite.listen();
  vite.printUrls();
} catch (error) {
  await close();
  throw error;
}
