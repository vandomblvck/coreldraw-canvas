const SMARTSUPP_KEY = "4565c00085cae6172377c10a3b9b5e28e2ebbe01";
const HIDE_STYLE_ID = "smartsupp-home-only-hide";
const HIDE_CSS =
  'div[id^="smartsupp"], iframe[src*="smartsuppchat"], .smartsupp-widget { display: none !important; }';

function widgetApi(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { smartsupp?: (...args: unknown[]) => void };
  return typeof w.smartsupp === "function" ? w.smartsupp : null;
}

/** Loads the Smartsupp chat script once. Only call from the homepage. */
export function loadSmartsupp() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { _smartsupp?: { key?: string } };
  w._smartsupp = w._smartsupp || {};
  w._smartsupp.key = SMARTSUPP_KEY;
  if (widgetApi()) {
    showSmartsupp();
    return;
  }
  if (document.querySelector('script[src*="smartsuppchat.com/loader.js"]')) return;
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.charset = "utf-8";
  s.async = true;
  s.src = "https://www.smartsuppchat.com/loader.js?";
  document.body.appendChild(s);
}

export function showSmartsupp() {
  document.getElementById(HIDE_STYLE_ID)?.remove();
  widgetApi()?.("widget:show");
}

/** Hides the chat widget (used when leaving the homepage). */
export function hideSmartsupp() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(HIDE_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = HIDE_STYLE_ID;
    style.textContent = HIDE_CSS;
    document.head.appendChild(style);
  }
  widgetApi()?.("widget:hide");
}
