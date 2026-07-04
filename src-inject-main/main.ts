import { app, BrowserWindow, screen } from "electron/main";
import { proxy } from "../common/proxy";
import { getMicaGeometry } from "../common/fakeMicaGeometry";
import config from "../config/config.json" with { type: "json" };

function sendMicaUpdate(win: BrowserWindow) {
  if (win.webContents.isDestroyed()) return;

  const content = win.getContentBounds();
  const display = screen.getDisplayMatching(content);
  win.webContents.send(
    "vscode:update-mica",
    getMicaGeometry(content.x, content.y, display.bounds)
  );
}

function scheduleMicaUpdate(win: BrowserWindow) {
  sendMicaUpdate(win);
  setTimeout(() => sendMicaUpdate(win), 0);
  setTimeout(() => sendMicaUpdate(win), 100);
}

function attachMicaWindowHooks(win: BrowserWindow) {
  const updateMica = () => scheduleMicaUpdate(win);

  win.on("ready-to-show", updateMica);
  win.on("show", updateMica);
  win.on("restore", updateMica);
  win.on("move", updateMica);
  win.on("moved", updateMica);
  win.on("resize", updateMica);
  win.on("maximize", updateMica);
  win.on("unmaximize", updateMica);
  win.on("enter-full-screen", updateMica);
  win.on("leave-full-screen", updateMica);
  win.webContents.on("did-finish-load", updateMica);
}

if (config.fakeMica.enabled) {
  app.on("browser-window-created", (_, win) => {
    attachMicaWindowHooks(win);
  });

  app.once("ready", () => {
    screen.on("display-metrics-changed", () => {
      for (const win of BrowserWindow.getAllWindows()) {
        scheduleMicaUpdate(win);
      }
    });
  });

  // Allow auxiliary window listening to channel
  app.on("web-contents-created", (_, contents) => {
    proxy(contents, "setWindowOpenHandler", (oldFunc, handler, ...args) => {
      oldFunc(
        (...args) => {
          const res = handler(...args);
          const webPreferences =
            res.overrideBrowserWindowOptions?.webPreferences;
          if (webPreferences)
            webPreferences.preload = webPreferences.preload?.replace(
              /preload-aux.js$/,
              "preload.js"
            );
          return res;
        },
        ...args
      );
    });
  });
}
