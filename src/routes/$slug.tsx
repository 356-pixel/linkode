import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

const RESERVED = new Set(["about", "how-it-works", "blog", "contact", "privacy", "terms"]);

function shouldBlockAndShowInstructions(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();

  // Desktop users are never blocked, no matter what.
  const isDesktop = !/mobile|android|iphone|ipad|ipod|phone/i.test(uaLower);
  if (isDesktop) return false;

  // Blacklist: Facebook family + Android WebView (covers FB / FB Lite webviews).
  const isFacebookFamily = /FBAN|FBAV|FBIOS|FB_IAB|FB4A|FBLC|EMA/i.test(ua);
  const isAndroidWebView = /;\s*wv\)/i.test(ua) || /\bwv\b/i.test(ua);
  if (isFacebookFamily || isAndroidWebView) return true;

  // Whitelist mobile: Chrome, Safari, Firefox.
  const isAndroid = uaLower.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(uaLower);
  const isMobileChrome = isAndroid && uaLower.includes("chrome/") && uaLower.includes("mobile");
  const isMobileSafari = isIOS && uaLower.includes("safari") && uaLower.includes("version/") && !uaLower.includes("crios") && !uaLower.includes("fxios");
  const isMobileFirefox = uaLower.includes("firefox/") || uaLower.includes("fxios");

  return !(isMobileChrome || isMobileSafari || isMobileFirefox);
}


function SlugRedirect() {
  const { slug: rawSlug } = Route.useParams();
  const slug = (rawSlug || "").split("?")[0].replace(/[^a-zA-Z0-9]/g, "");

  const [shouldBlock] = useState<boolean>(() => shouldBlockAndShowInstructions());

  useEffect(() => {
    if (shouldBlock || !slug || RESERVED.has(slug)) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "links", slug));
        if (cancelled || !snap.exists()) return;
        const target = snap.get("target") as string | undefined;
        if (!target) return;
        const meta = document.createElement("meta");
        meta.name = "referrer";
        meta.content = "no-referrer";
        document.getElementsByTagName("head")[0].appendChild(meta);
        const a = document.createElement("a");
        a.href = target;
        a.rel = "noreferrer";
        document.body.appendChild(a);
        a.click();
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, shouldBlock]);

  if (shouldBlock) {
    const linkText = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", padding: "24px", maxWidth: "640px", margin: "0 auto", color: "#111" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 16px" }}>Open in External Browser</h1>
        <p style={{ fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" }}>
          This website link: <strong>{linkText}</strong> doesn't support the Facebook in-app browser.
        </p>
        <p style={{ fontSize: "16px", lineHeight: 1.5, margin: 0 }}>
          Please tap ⋮ (top-right) and choose: Open in External Browser
        </p>
      </div>
    );
  }

  return null;
}
