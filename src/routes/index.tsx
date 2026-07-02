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

function LinkResolver() {
  const [status, setStatus] = useState<"loading" | "trapped" | "error">("loading");
  const [osType, setOsType] = useState("");
  const [shortLink, setShortLink] = useState("");

  useEffect(() => {
    const resolveLink = async () => {
      try {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const slug = url.pathname.replace(/^\/+|\/+$/g, "");
        const userAgent = navigator.userAgent || "";

        const displayShortLink = `https://${url.hostname}${url.pathname}`;
        setShortLink(displayShortLink);

        const FIRESTORE_COLLECTION = "links";
        const URL_FIELD_NAME = "target";

        // 1. Escape hatch: redirect Chrome/Safari out of the loop
        if (searchParams.has("dest")) {
          try {
            const urlSafeTicket = searchParams.get("dest") || "";
            let base64Str = urlSafeTicket.replace(/-/g, "+").replace(/_/g, "/");
            while (base64Str.length % 4 !== 0) base64Str += "=";

            const decodedPathAndQuery = atob(base64Str);
            const cleanTargetUrl = new URL(decodedPathAndQuery, url.origin);
            const externalSlug = cleanTargetUrl.pathname.replace(/^\/+|\/+$/g, "");

            if (externalSlug) {
              const docRef = doc(db, FIRESTORE_COLLECTION, externalSlug);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                await updateDoc(docRef, { counter: increment(1) });
                window.location.replace(data[URL_FIELD_NAME]);
                return;
              }
            }
          } catch (e) {
            console.error("Escape hatch failure:", e);
          }
        }

        const hasAndroidFbSignatures = [
          "FB4A",
          "FB_IAB/FB4A",
          "FBAN/FB4A",
          "facebookexternalhit",
          "Facebot",
        ].some((token) => userAgent.includes(token));

        const isGeneralFbWebView =
          userAgent.includes("FB_IAB") || userAgent.includes("FBAN");
        const hasFbclid = searchParams.has("fbclid");
        const isIOS = /iPhone|iPad|iPod|Macintosh/.test(userAgent);

        // 2. iOS ruleset
        if (isIOS) {
          const iosFbAppTokens = ["FBIOS", "MessengerForiOS", "Instagram", "WhatsApp"];
          const isTrappedIos =
            iosFbAppTokens.some((token) => userAgent.includes(token)) ||
            (isGeneralFbWebView && !hasAndroidFbSignatures);

          if (isTrappedIos) {
            setOsType("iOS");
            setStatus("trapped");
            return;
          }
        }

        // 3. Android + FB Lite interaction layer
        if (
          hasAndroidFbSignatures ||
          (hasFbclid && isGeneralFbWebView) ||
          (hasFbclid && !isIOS)
        ) {
          if (searchParams.has("fbclid")) {
            const originalPathAndQuery = url.pathname + url.search;
            const urlSafeTicket = btoa(originalPathAndQuery)
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=/g, "");

            searchParams.delete("fbclid");
            searchParams.set("dest", urlSafeTicket);
            const cleanSearch = searchParams.toString();
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + "?" + cleanSearch + window.location.hash,
            );
          }
          setOsType("Android");
          setStatus("trapped");
          return;
        }

        // 4. Global clean pass
        if (slug && slug !== "fb-fallback") {
          const docRef = doc(db, FIRESTORE_COLLECTION, slug);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            await updateDoc(docRef, { counter: increment(1) });
            window.location.replace(data[URL_FIELD_NAME]);
            return;
          }
        }

        setStatus("error");
      } catch (err) {
        console.error("Link translation failure:", err);
        setStatus("error");
      }
    };

    resolveLink();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Redirecting you safely...</p>
      </div>
    );
  }

  if (status === "error") {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground">Open in Browser</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This website link:{" "}
          <span className="font-mono text-foreground">{shortLink}</span> doesn't
          support the in-app browser.
        </p>
        <p className="mt-6 text-sm font-semibold text-foreground">
          Follow these quick steps to continue:
        </p>
        <ol className="mt-4 space-y-3 text-left text-sm text-muted-foreground">
          {osType === "iOS" ? (
            <>
              <li>
                Tap the <strong>Three Dots (•••)</strong> or the{" "}
                <strong>Share</strong> menu icon at the top/bottom panel.
              </li>
              <li>
                Select <strong>"Open in Safari"</strong>.
              </li>
            </>
          ) : (
            <>
              <li>
                Tap the <strong>Three Vertical Dots (⋮)</strong> in the upper
                right header corner.
              </li>
              <li>
                Select <strong>"Open in Browser"</strong> or{" "}
                <strong>"Open in Chrome"</strong>.
              </li>
              <li>Refresh the link for FB Lite</li>
            </>
          )}
        </ol>
      </div>
    </div>
  );
}
