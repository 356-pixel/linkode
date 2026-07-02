import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

const RESERVED = new Set(["about", "how-it-works", "blog", "contact", "privacy", "terms"]);

function SlugRedirect() {
  const { slug: rawSlug } = Route.useParams();
  const slug = (rawSlug || "").split("?")[0].replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (!slug || RESERVED.has(slug)) return;
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
  }, [slug]);

  return null;
}
