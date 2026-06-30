import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

const RESERVED = new Set(["about", "how-it-works", "blog", "contact", "privacy", "terms"]);

function isFacebookUA(): boolean {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBIOS|FacebookExternalHit|FB_xd_fragment|FB_IAB|FB4A|FBLC/i.test(navigator.userAgent);
}

function SlugRedirect() {
  const { slug: rawSlug } = Route.useParams();
  const slug = (rawSlug || "").split("?")[0].replace(/[^a-zA-Z0-9]/g, "");

  const [isFacebook] = useState<boolean>(() => isFacebookUA());

  useEffect(() => {
    if (isFacebook || !slug || RESERVED.has(slug)) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "links", slug));
        if (cancelled || !snap.exists()) return;
        const target = snap.get("target") as string | undefined;
        if (target) window.location.href = target;
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
