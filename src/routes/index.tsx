import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link2, Copy, Check, RefreshCw, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { SiteLayout } from "@/components/site-layout";
import { db } from "@/lib/firebase";

function randomCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linkode — Open Your Links Outside Facebook App" },
      { name: "description", content: "Linkode helps creators redirect URLs out of restrictive in-app browsers and into native browsers like Chrome and Safari for a faster, smoother experience." },
      { property: "og:title", content: "Linkode — Premium Link Optimization" },
      { property: "og:description", content: "Force your shared links to open in native system browsers instead of in-app webviews." },
    ],
  }),
  component: Home,
});

const RESERVED = new Set(["about", "how-it-works", "blog", "contact", "privacy", "terms"]);

function getInitialSlug(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.pathname.replace(/^\/+/, "").split("/")[0] || "";
  // Strip any query-style residue and keep only alphanumerics.
  const clean = raw.split("?")[0].replace(/[^a-zA-Z0-9]/g, "");
  if (!clean || RESERVED.has(clean)) return null;
  return clean;
}

function Home() {
  // Compute slug synchronously so we never flash the wrong UI.
  const [slug] = useState<string | null>(() => getInitialSlug());

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slug present → silently fetch target and redirect.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "links", slug));
        if (cancelled) return;
        if (!snap.exists()) return;
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

  // Slug present → render nothing while redirecting.
  if (slug) {
    return null;
  }






  const handleGenerate = async () => {
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    const destinationUrl = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    try {
      new URL(destinationUrl);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const slug = randomCode(5);
      await setDoc(doc(db, "links", slug), {
        slug,
        target: destinationUrl,
        createdAt: serverTimestamp(),
      });
      setResult(`https://linkode.co/${slug}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create link. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError(null);
    setCopied(false);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.62 0.17 250 / 0.25), transparent 40%), radial-gradient(circle at 80% 60%, oklch(0.58 0.18 258 / 0.2), transparent 50%)" }} />
        <div className="relative mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted link breakout for creators
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Open Your Links{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">outside Facebook app</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Redirect your URLs to an external browser instead of the Facebook in-app browser.
            </p>

            {/* Tool Card */}
            <div className="mt-10 w-full max-w-2xl rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant sm:p-8">
              <label htmlFor="url" className="flex items-center gap-2 text-left text-sm font-semibold text-foreground">
                <Link2 className="h-4 w-4 text-primary" />
                Your destination URL
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your website link here"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                  disabled={loading}
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-glow disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate Link
                    </>
                  )}
                </button>
              </div>
              {error && <p className="mt-2 text-left text-xs text-destructive">{error}</p>}

              {result && (
                <div className="mt-5 rounded-xl border border-border bg-background p-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Your optimized link
                  </p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <code className="flex-1 truncate rounded-md bg-secondary px-3 py-2 text-sm font-mono text-foreground">
                      {result}
                    </code>
                    <div className="relative">
                      <button
                        onClick={handleCopy}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Link"}
                      </button>
                      {copied && (
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Generate Another Link
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> No signup required</span>
              <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Works on all platforms</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Instant generation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for creators who care about conversion
          </h2>
          <p className="mt-4 text-muted-foreground">
            In-app browsers cost you click-throughs, logins, and trust. Linkode hands users back to their native browser — where everything just works.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Zap, title: "Lightning fast", body: "Optimized redirects with no perceptible latency for your audience." },
            { icon: Shield, title: "Safe & private", body: "We never store the contents of your URLs or track your visitors." },
            { icon: Globe, title: "Universal compatibility", body: "Works across Facebook, Instagram, TikTok, LinkedIn, and more." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-primary">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
