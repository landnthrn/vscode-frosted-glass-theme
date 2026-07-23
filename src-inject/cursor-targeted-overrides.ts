import { css } from "./utils/utils";
import fgtSheet from "./vscode-frosted-glass-theme.css" with { type: "css" };

const COMPOSER_UI_MENU_ROW_HOVER = css`
  .ui-menu.ui-slash-menu__content[role="menu"] .ui-menu__row[data-focused="true"],
  [data-testid="model-picker-menu"] .ui-menu__row[data-focused="true"],
  [data-testid="model-picker-menu"] .ui-menu__toggle-row[data-focused="true"] {
    background-color: var(--vscode-list-hoverBackground) !important;
  }
`;

const COMPOSER_UNIFIED_MENU_ROW_HOVER = css`
  div[tabindex="0"]:has(.composer-unified-context-menu-item)
    .composer-unified-context-menu-item[data-is-selected="true"],
  .typeahead-popover.mentions-menu
    .composer-unified-context-menu-item[data-is-selected="true"] {
    background-color: var(--vscode-list-hoverBackground) !important;
  }
`;

const COMPOSER_MENU_REVEAL_ROWS = css`
  .ui-menu.ui-slash-menu__content[role="menu"] .ui-menu__row[data-focused="true"],
  [data-testid="model-picker-menu"] .ui-menu__row[data-focused="true"],
  [data-testid="model-picker-menu"] .ui-menu__toggle-row[data-focused="true"],
  div[tabindex="0"]:has(.composer-unified-context-menu-item)
    .composer-unified-context-menu-item[data-is-selected="true"],
  .typeahead-popover.mentions-menu
    .composer-unified-context-menu-item[data-is-selected="true"]
`;

/** Slash menu + flyout (portaled; link CSS may load late). */
export function applySlashMenuBlur() {
  fgtSheet.insertRule(css`
    .ui-menu.ui-slash-menu__content[role="menu"],
    .ui-menu__tooltip[role="tooltip"] {
      backdrop-filter: blur(var(--fgt-cursor-slash-menu-blur, 12px));
      -webkit-backdrop-filter: blur(var(--fgt-cursor-slash-menu-blur, 12px));
    }
  `);
  fgtSheet.insertRule(COMPOSER_UI_MENU_ROW_HOVER);
  fgtSheet.insertRule(COMPOSER_UNIFIED_MENU_ROW_HOVER);
  fgtSheet.insertRule(css`
    ${COMPOSER_MENU_REVEAL_ROWS} {
      animation: fgt-revealEffect, fgt-flipEffect;
    }
  `);
}

/**
 * Shared blur for extra Cursor menus / cards (`extraCursorMenusBlur`):
 * - chatRC (Transcript / File actions ui-menu)
 * - agentSidePanelRC (Monaco context-view in shadow root; Pin / Fork Chat)
 * - sidebarIconBarDropDown
 * - codeChangesChatPreviewBoxes
 */
const EXTRA_MENUS_BLUR_VAR = "--fgt-cursor-extra-menus-blur";

const CHAT_RC_MENU_SELECTOR = css`
  .ui-menu[role="menu"]:has([aria-label="Transcript actions"]),
  .ui-menu[role="menu"]:has([aria-label="File actions"])
`;

const CHAT_RC_INNER_CLEAR_SELECTOR = css`
  ${CHAT_RC_MENU_SELECTOR} .ui-scroll-area__content,
  ${CHAT_RC_MENU_SELECTOR} .ui-menu__content,
  ${CHAT_RC_MENU_SELECTOR} .ui-menu__layout
`;

/** agentSidePanelRC — unique labels Pin + Fork Chat */
const AGENT_SIDE_PANEL_RC_SELECTOR = css`
  .context-view.monaco-menu-container:has(
      .action-label[aria-label="Fork Chat"]
    ),
  .monaco-menu-container:has(.action-label[aria-label="Fork Chat"])
`;

const SIDEBAR_ICON_BAR_DROPDOWN_SELECTOR = css`
  .monaco-workbench
    .part.sidebar
    div[style*="position: absolute"]:has(.sidebar-list-item)
`;

const CODE_CHANGES_PREVIEW_SELECTOR = css`
  .ui-tool-call-card.ui-edit-tool-call[data-tool-call-card-marker="root"]
`;

/** Insert adoptedStyleSheet rules for portaled / late extra menus. */
export function applyExtraCursorMenusBlur() {
  fgtSheet.insertRule(css`
    ${CHAT_RC_MENU_SELECTOR} {
      contain: none !important;
      isolation: auto !important;
      backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      -webkit-backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      background-color: var(--vscode-menu-background) !important;
    }
  `);
  fgtSheet.insertRule(css`
    ${CHAT_RC_INNER_CLEAR_SELECTOR} {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      background-color: transparent !important;
    }
  `);
  fgtSheet.insertRule(css`
    ${AGENT_SIDE_PANEL_RC_SELECTOR} {
      contain: none !important;
      isolation: auto !important;
    }
  `);
  fgtSheet.insertRule(css`
    ${AGENT_SIDE_PANEL_RC_SELECTOR} .monaco-scrollable-element {
      contain: none !important;
      isolation: auto !important;
      backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      -webkit-backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      background-color: var(--vscode-menu-background) !important;
    }
  `);
  fgtSheet.insertRule(css`
    ${SIDEBAR_ICON_BAR_DROPDOWN_SELECTOR} {
      contain: none !important;
      isolation: auto !important;
      backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      -webkit-backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      background-color: var(--vscode-menu-background) !important;
    }
  `);
  fgtSheet.insertRule(css`
    ${CODE_CHANGES_PREVIEW_SELECTOR} {
      contain: none !important;
      isolation: auto !important;
      --ui-tool-call-card-bg: transparent;
      backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      -webkit-backdrop-filter: blur(var(${EXTRA_MENUS_BLUR_VAR}, 12px)) !important;
      background-color: color-mix(
        in srgb,
        var(--vscode-menu-background) 15%,
        transparent
      ) !important;
    }
  `);
}

const CHAT_RC_QUERY =
  '.ui-menu[role="menu"]:has([aria-label="Transcript actions"]), .ui-menu[role="menu"]:has([aria-label="File actions"])';
const AGENT_SIDE_PANEL_RC_QUERY =
  '.context-view.monaco-menu-container:has(.action-label[aria-label="Fork Chat"]), .monaco-menu-container:has(.action-label[aria-label="Fork Chat"])';
const SIDEBAR_DROPDOWN_QUERY =
  '.monaco-workbench .part.sidebar div[style*="position: absolute"]:has(.sidebar-list-item)';

const extraMenusWatched = new WeakSet<HTMLElement>();
let extraMenusPollId: ReturnType<typeof setInterval> | undefined;

function applyExtraMenuGlass(
  el: HTMLElement,
  opts: {
    clearInners?: string;
    /** When set, blur paints on this child (re-queried each pass). */
    blurChildSelector?: string;
    /** Override background (default: menu.background). */
    background?: string;
  } = {}
) {
  const blur = readCssVar(EXTRA_MENUS_BLUR_VAR, "12px");
  const bg =
    opts.background ??
    readCssVar(
      "--vscode-menu-background",
      "var(--vscode-menu-background)"
    );
  const child = opts.blurChildSelector
    ? el.querySelector(opts.blurChildSelector)
    : null;
  const target =
    child instanceof HTMLElement ? child : el;

  el.style.setProperty("contain", "none", "important");
  el.style.setProperty("isolation", "auto", "important");
  target.style.setProperty("contain", "none", "important");
  target.style.setProperty("isolation", "auto", "important");
  target.style.setProperty("backdrop-filter", `blur(${blur})`, "important");
  target.style.setProperty(
    "-webkit-backdrop-filter",
    `blur(${blur})`,
    "important"
  );
  target.style.setProperty("background-color", bg, "important");

  if (opts.clearInners) {
    el.querySelectorAll(opts.clearInners).forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      node.style.setProperty("backdrop-filter", "none", "important");
      node.style.setProperty("-webkit-backdrop-filter", "none", "important");
      node.style.setProperty("background-color", "transparent", "important");
    });
  }

  if (!extraMenusWatched.has(el)) {
    extraMenusWatched.add(el);
    new MutationObserver(() => applyExtraMenuGlass(el, opts)).observe(el, {
      attributes: true,
      attributeFilter: ["style", "class"],
      subtree: true,
    });
  }
}

function scanExtraMenus(root: ParentNode) {
  root.querySelectorAll(CHAT_RC_QUERY).forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    applyExtraMenuGlass(node, {
      clearInners: ".ui-scroll-area__content, .ui-menu__content, .ui-menu__layout",
    });
  });
  root.querySelectorAll(AGENT_SIDE_PANEL_RC_QUERY).forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    applyExtraMenuGlass(node, {
      blurChildSelector: ".monaco-scrollable-element",
    });
  });
  root.querySelectorAll(SIDEBAR_DROPDOWN_QUERY).forEach(node => {
    if (node instanceof HTMLElement) applyExtraMenuGlass(node);
  });
  root
    .querySelectorAll(
      ".ui-tool-call-card.ui-edit-tool-call[data-tool-call-card-marker='root']"
    )
    .forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      applyExtraMenuGlass(node, {
        background:
          "color-mix(in srgb, var(--vscode-menu-background) 15%, transparent)",
      });
    });
}

function scanAllExtraMenus() {
  scanExtraMenus(document);
  document.querySelectorAll("*").forEach(el => {
    if (el.shadowRoot) scanExtraMenus(el.shadowRoot);
  });

  const open =
    document.querySelector(CHAT_RC_QUERY) ||
    document.querySelector(SIDEBAR_DROPDOWN_QUERY) ||
    [...document.querySelectorAll("*")].some(el =>
      el.shadowRoot?.querySelector(AGENT_SIDE_PANEL_RC_QUERY)
    );
  if (open && extraMenusPollId === undefined) {
    extraMenusPollId = setInterval(scanAllExtraMenus, 150);
  } else if (!open && extraMenusPollId !== undefined) {
    clearInterval(extraMenusPollId);
    extraMenusPollId = undefined;
  }
}

export function startExtraCursorMenusBlur() {
  scanAllExtraMenus();
  new MutationObserver(scanAllExtraMenus).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

/** @deprecated Use applyExtraCursorMenusBlur */
export const applyChatRightClickMenuBlur = applyExtraCursorMenusBlur;
/** @deprecated Use startExtraCursorMenusBlur */
export const startChatRightClickMenuBlur = startExtraCursorMenusBlur;

function readCssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

/** Model picker — inline re-apply when Cursor strips backdrop-filter. */
const watched = new WeakSet<HTMLElement>();
let pollId: ReturnType<typeof setInterval> | undefined;

function applyToModelPickerMenu(menu: HTMLElement) {
  const blur = readCssVar("--fgt-cursor-model-picker-menu-blur", "12px");
  const bg = readCssVar(
    "--vscode-dropdown-background",
    "var(--vscode-dropdown-background)"
  );

  menu.style.setProperty("contain", "none", "important");
  menu.style.setProperty("isolation", "auto", "important");
  menu.style.setProperty("backdrop-filter", `blur(${blur})`, "important");
  menu.style.setProperty("-webkit-backdrop-filter", `blur(${blur})`, "important");
  menu.style.setProperty("background-color", bg, "important");

  menu.querySelectorAll(".ui-scroll-area__content").forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    node.style.removeProperty("backdrop-filter");
    node.style.removeProperty("-webkit-backdrop-filter");
    node.style.setProperty("background-color", "transparent", "important");
  });

  if (!watched.has(menu)) {
    watched.add(menu);
    new MutationObserver(() => applyToModelPickerMenu(menu)).observe(menu, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }
}

function scanModelPicker(root: ParentNode) {
  root.querySelectorAll('[data-testid="model-picker-menu"]').forEach(node => {
    if (node instanceof HTMLElement) applyToModelPickerMenu(node);
  });
}

function scanAllModelPickerRoots() {
  scanModelPicker(document);
  document.querySelectorAll("*").forEach(el => {
    if (el.shadowRoot) scanModelPicker(el.shadowRoot);
  });

  const open = document.querySelector('[data-testid="model-picker-menu"]');
  if (open && pollId === undefined) {
    pollId = setInterval(scanAllModelPickerRoots, 150);
  } else if (!open && pollId !== undefined) {
    clearInterval(pollId);
    pollId = undefined;
  }
}

export function startModelPickerBlur() {
  scanAllModelPickerRoots();
  new MutationObserver(scanAllModelPickerRoots).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

/** Hide Cursor "installation appears to be corrupt" toast (DOM removal; CSS alone is not enough). */
const CORRUPT_NEEDLE = "appears to be corrupt";

function mentionsCorrupt(el: Element): boolean {
  const label = el.getAttribute("aria-label") ?? "";
  if (label.includes(CORRUPT_NEEDLE)) return true;
  const message = el.querySelector(
    ".notification-list-item-message span"
  )?.textContent;
  if (message?.includes(CORRUPT_NEEDLE)) return true;
  return (el.textContent ?? "").includes(CORRUPT_NEEDLE);
}

function isCorruptToastContainer(container: Element): boolean {
  if (mentionsCorrupt(container)) return true;

  const list = container.querySelector(".monaco-list");
  if (list && mentionsCorrupt(list)) return true;

  const rows = container.querySelectorAll(".monaco-list-row");
  if (!rows.length) return false;

  return [...rows].every(row => mentionsCorrupt(row));
}

function hasOtherNotifications(container: Element): boolean {
  for (const row of container.querySelectorAll(".monaco-list-row")) {
    if (!mentionsCorrupt(row)) {
      const message = row
        .querySelector(".notification-list-item-message span")
        ?.textContent?.trim();
      if (message) return true;
    }
  }
  return false;
}

function removeCorruptToasts(root: ParentNode = document): void {
  for (const container of root.querySelectorAll(
    ".notifications-toasts .notification-toast-container, .notification-toast-container"
  )) {
    if (!isCorruptToastContainer(container)) continue;
    if (hasOtherNotifications(container)) continue;
    container.remove();
  }
}

let sweepScheduled = false;

function scheduleCorruptSweep(): void {
  if (sweepScheduled) return;
  sweepScheduled = true;
  requestAnimationFrame(() => {
    sweepScheduled = false;
    removeCorruptToasts();
  });
}

export function hideCorruptNotifications(): void {
  removeCorruptToasts();

  new MutationObserver(scheduleCorruptSweep).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-label", "class", "style"],
  });

  for (const ms of [0, 50, 200, 500, 1000, 2000, 5000, 10000]) {
    setTimeout(removeCorruptToasts, ms);
  }
}
