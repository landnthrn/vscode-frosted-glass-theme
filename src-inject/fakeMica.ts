import config from "../config/config.json" with { type: "json" };
import {
  getMicaBackgroundPosition,
  getMicaCoverSize,
  isMicaGeometry,
  isValidMicaGeometry,
  type MicaGeometry,
} from "../common/fakeMicaGeometry";
import { resolveFakeMicaBackgroundUrl } from "./utils/fakeMicaUrl";
import { css } from "./utils/utils";
import fgtSheet from "./vscode-frosted-glass-theme.css" with { type: "css" };

const { fakeMica } = config;
const MICA_LAYER_CLASS = "fgt-mica-layer";

let pendingMicaGeometry: MicaGeometry | undefined;
let micaImageSize: { width: number; height: number } | undefined;
let micaLayer: HTMLElement | undefined;

function onMicaGeometryIpc(_e: unknown, geo?: unknown) {
  if (!isMicaGeometry(geo) || !isValidMicaGeometry(geo)) return;
  pendingMicaGeometry = geo;
  if (!micaLayer) return;
  if (fakeMica.moveWithWindow) applyMicaGeometry(micaLayer, geo);
  else applyStaticMicaGeometry(micaLayer, geo);
}

if (
  fakeMica.enabled &&
  typeof window !== "undefined" &&
  window.vscode?.ipcRenderer
) {
  window.vscode.ipcRenderer.on("vscode:update-mica", onMicaGeometryIpc);
}

if (fakeMica.enabled) {
  fgtSheet.insertRule(css`
    .fgt-mica-svg-loaded {
      position: relative;
      --fgt-mica-x: center;
      --fgt-mica-y: center;
    }
  `);

  fgtSheet.insertRule(css`
    .${MICA_LAYER_CLASS} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
  `);

  // Fix list background
  fgtSheet.insertRule(css`
    .monaco-list-rows {
      background-color: transparent !important;
    }
  `);

  // Fix settings row background
  fgtSheet.insertRule(css`
    .settings-body .monaco-list-row {
      background-color: transparent !important;
    }
  `);

  if (fakeMica.titlebarFix) {
    fgtSheet.insertRule(css`
      .part.titlebar {
        background-color: color-mix(
          in srgb,
          var(--vscode-titleBar-activeBackground) ${fakeMica.titlebarFix * 100}%,
          transparent
        ) !important;
      }
    `);
  }

  if (fakeMica.editorBackgroundFix) {
    fgtSheet.insertRule(css`
      .content,
      .monaco-editor,
      .monaco-editor-background,
      .view-overlays .selected-text:has(+ .monaco-editor-background) {
        background-color: transparent !important;
      }
    `);
    fgtSheet.insertRule(css`
      .editor-group-container.empty {
        background-color: var(--vscode-editor-background);
      }
    `);
    // VSCode puts a top margin so that there will be a gap on the top.
    // Fix it by replacing with padding.
    fgtSheet.insertRule(css`
      .profiles-editor {
        margin: 0 auto 0 !important;
        padding-top: 20px;
      }
    `);
  }
}

function applyMicaGeometry(layer: HTMLElement, geo: MicaGeometry) {
  if (!isValidMicaGeometry(geo)) return;

  const imageWidth = micaImageSize?.width ?? geo.displayWidth;
  const imageHeight = micaImageSize?.height ?? geo.displayHeight;
  const { size, position } = getMicaBackgroundPosition(
    geo,
    imageWidth,
    imageHeight
  );
  layer.style.backgroundSize = size;
  layer.style.backgroundPosition = position;
}

function applyStaticMicaGeometry(layer: HTMLElement, geo: MicaGeometry) {
  if (!isValidMicaGeometry(geo)) return;

  const imageWidth = micaImageSize?.width ?? geo.displayWidth;
  const imageHeight = micaImageSize?.height ?? geo.displayHeight;
  layer.style.backgroundSize = getMicaCoverSize(
    geo.displayWidth,
    geo.displayHeight,
    imageWidth,
    imageHeight
  );
  layer.style.backgroundPosition = "center center";
}

function tryApplyPendingMicaGeometry(layer: HTMLElement) {
  if (!pendingMicaGeometry) return;
  applyMicaGeometry(layer, pendingMicaGeometry);
}

async function loadMicaBackgroundUrl(url: string): Promise<string> {
  const resolved = resolveFakeMicaBackgroundUrl(url);
  if (resolved.startsWith("data:")) return resolved;
  try {
    const response = await fetch(resolved);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return URL.createObjectURL(await response.blob());
  } catch {
    return resolved;
  }
}

function loadMicaImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to read fake mica image size"));
    img.src = url;
  });
}

export async function applyFakeMica(
  element: HTMLElement,
  svgMounted: Promise<void>
) {
  if (!fakeMica.enabled) return;

  await svgMounted;

  let layer = element.querySelector<HTMLElement>(`.${MICA_LAYER_CLASS}`);
  if (!layer) {
    layer = document.createElement("div");
    layer.className = MICA_LAYER_CLASS;
    element.prepend(layer);
  }
  micaLayer = layer;

  const backgroundUrl = await loadMicaBackgroundUrl(fakeMica.url);
  try {
    micaImageSize = await loadMicaImageSize(backgroundUrl);
  } catch {
    micaImageSize = undefined;
  }

  layer.style.filter = fakeMica.filter;
  layer.style.backgroundImage = `url("${backgroundUrl}")`;
  layer.style.backgroundRepeat = "no-repeat";

  element.classList.add("fgt-mica-svg-loaded");

  if (fakeMica.moveWithWindow) tryApplyPendingMicaGeometry(layer);
  else if (pendingMicaGeometry) applyStaticMicaGeometry(layer, pendingMicaGeometry);
}
