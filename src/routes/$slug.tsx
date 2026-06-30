import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

// Reserved paths that should not be treated as slugs (have their own routes).
const RESERVED = new Set([
  "about",
  "how-it-works",
  "blog",
  "contact",
  "privacy",
  "terms",
]);

function SlugRedirect() {
  const { slug } = Route.useParams();
  const [status, setStatus] = useState<"loading" | "notfound" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    async function go() {
      try {
        // 1. Try the query parameter first, then fall back to the pathname.
        const querySlug = new URLSearchParams(window.location.search).get("slug");
        const pathSlug = window.location.pathname.replace(/^\/+/, "").split("/")[0] || slug;
        const resolvedSlug = querySlug || pathSlug;

        if (!resolvedSlug || RESERVED.has(resolvedSlug)) {
          // No slug present → treat as home dashboard.
          window.location.href = "/";
          return;
        }
        const snap = await getDoc(doc(db, "links", resolvedSlug));
        if (cancelled) return;
        if (!snap.exists()) {
          setStatus("notfound");
          return;
        }
        const target = snap.get("target") as string | undefined;
        if (!target) {
          setStatus("notfound");
          return;
        }
        window.location.href = target;
      } catch (e) {
        console.error(e);
        if (!cancelled) setStatus("error");
      }
    }
    go();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Redirecting…</p>
          </>
        )}
        {status === "notfound" && (
          <>
            <h1 className="text-2xl font-semibold text-foreground">Link not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">This Linkode link doesn't exist or has expired.</p>
            <a href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">Go home</a>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
          </>
        )}
      </div>
    </div>
  );
}
