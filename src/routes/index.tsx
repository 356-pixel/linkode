import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { Link2, Copy, Check, Loader2, Sparkles, Zap, Shield, RotateCcw } from "lucide-react";
import { db } from "@/lib/firebase";
import { SiteLayout } from "@/components/site-layout";

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
  component: IndexRoute,
});

const FIRESTORE_COLLECTION = "links";
const URL_FIELD_NAME = "target";

function getIncomingSlug(): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const q = url.searchParams.get("slug");
  if (q) return q.replace(/[^a-zA-Z0-9]/g, "");
  const path = url.pathname.replace(/^\/+|\/+$/g, "");
  if (!path) return null;
  // Path exists — treat as slug candidate.
  return path.replace(/[^a-zA-Z0-9]/g, "") || null;
}

function IndexRoute() {
  // Decide synchronously on first render so no landing flash for slug hits.
  const incomingSlug = useMemo(getIncomingSlug, []);
  if (incomingSlug) return <LinkResolver slug={incomingSlug} />;
  return <Home />;
}

function LinkResolver({ slug }: { slug: string }) {
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTION, slug);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return setStatus("error");
        const target = snap.get(URL_FIELD_NAME) as string | undefined;
        if (!target) return setStatus("error");
        updateDoc(docRef, { counter: increment(1) }).catch(() => {});
        window.location.replace(target);
      } catch (err) {
        console.error("Link resolution failure:", err);
        setStatus("error");
      }
    })();
  }, [slug]);

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
        <h1 className="text-xl font-semibold text-foreground">Link Expired or Invalid</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please check your short URL tag and try again.
        </p>
      </div>
    </div>
  );
}

function randomCode(len: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult("");

    let target = urlInput.trim();
    if (!target) return setError("Please paste a website link.");
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return setError("That doesn't look like a valid URL.");
    }
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "xcessly.com") {
      return setError("Only xcessly.com/ links are allowed");
    }

    setLoading(true);
    try {
      const slug = randomCode(5);
      await setDoc(doc(db, FIRESTORE_COLLECTION, slug), {
        slug,
        target,
        counter: 0,
        createdAt: serverTimestamp(),
      });
      setResult(`https://linkode.co/${slug}`);
    } catch (err) {
      console.error(err);
      setError("Could not generate link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setUrlInput("");
    setResult("");
    setError("");
    setCopied(false);
  }


  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden pt-4 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Trusted link breakout for creators
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Redirect links outside the{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Facebook app
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Turn any link into a Linkode short URL that breaks out of in-app browsers
              and opens in the user's native browser — Chrome, Safari, and more.
            </p>
          </div>

          <form
            onSubmit={handleGenerate}
            className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6"
          >
            <label className="text-sm font-medium text-foreground">Your destination URL</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (!e.target.value) setResult("");
                  }}
                  placeholder="Enter the link here"
                  className={`w-full rounded-lg border border-input bg-background py-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${result ? "pr-10" : "pr-3"}`}
                />
                {result && (
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset"
                    className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {loading ? "Generating…" : "Optimize Link"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            {result && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                <span className="truncate text-sm font-medium text-foreground">{result}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </form>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: Zap, title: "Instant breakout", desc: "Users leave the in-app browser in one tap." },
              { icon: Shield, title: "Privacy-first", desc: "No-referrer redirects protect your traffic." },
              { icon: Sparkles, title: "Creator-ready", desc: "Higher conversions on every shared link." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
