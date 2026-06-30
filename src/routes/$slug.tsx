import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

const RESERVED = new Set(["about", "how-it-works", "blog", "contact", "privacy", "terms"]);

function shouldBlock(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const isDesktop = !/mobile|android|iphone|ipad|phone/i.test(ua);
  const isMobileSafari = ua.includes("safari") && ua.includes("version") && !ua.includes("fban") && !ua.includes("fbios") && !ua.includes("chrome") && !ua.includes("android");
  const isMobileChrome = ua.includes("chrome") && ua.includes("mobile") && !ua.includes("; wv") && !ua.includes("lite/") && !ua.includes("com.facebook.lite") && !ua.includes("samsungbrowser");
  const isMobileFirefox = ua.includes("firefox") || ua.includes("fenix");
  const isMobileSamsung = ua.includes("samsungbrowser");
  const isWhitelisted = isDesktop || isMobileSafari || isMobileChrome || isMobileFirefox || isMobileSamsung;
  return !isWhitelisted;
}

function SlugRedirect() {
  const { slug: rawSlug } = Route.useParams();
  const slug = (rawSlug || "").split("?")[0].replace(/[^a-zA-Z0-9]/g, "");

  const [isFacebook] = useState<boolean>(() => shouldBlock());

  useEffect(() => {
    if (isFacebook || !slug || RESERVED.has(slug)) return;
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
  }, [slug, isFacebook]);

  if (isFacebook) {
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
