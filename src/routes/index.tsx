import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linkode — Open Your Links Outside Facebook App" },
      {
        name: "description",
        content:
          "Linkode helps creators redirect URLs out of restrictive in-app browsers and into native browsers like Chrome and Safari for a faster, smoother experience.",
      },
      { property: "og:title", content: "Linkode — Premium Link Optimization" },
      {
        property: "og:description",
        content:
          "Force your shared links to open in native system browsers instead of in-app webviews.",
      },
    ],
  }),
  component: LinkResolver,
});

const FIRESTORE_COLLECTION = "links";
const URL_FIELD_NAME = "target";

function LinkResolver() {
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const slug =
          url.searchParams.get("slug") ||
          url.pathname.replace(/^\/+|\/+$/g, "");

        if (!slug) {
          setStatus("error");
          return;
        }

        const docRef = doc(db, FIRESTORE_COLLECTION, slug);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          setStatus("error");
          return;
        }

        const target = snap.get(URL_FIELD_NAME) as string | undefined;
        if (!target) {
          setStatus("error");
          return;
        }

        updateDoc(docRef, { counter: increment(1) }).catch(() => {});
        window.location.replace(target);
      } catch (err) {
        console.error("Link resolution failure:", err);
        setStatus("error");
      }
    })();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Redirecting you safely…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Link Expired or Invalid
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please check your short URL tag and try again.
        </p>
      </div>
    </div>
  );
}
