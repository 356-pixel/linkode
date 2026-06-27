import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { ClipboardPaste, Wand2, Share2, Smartphone, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Linkode" },
      { name: "description", content: "Learn how Linkode breaks links out of in-app browsers and hands them off cleanly to native system browsers." },
      { property: "og:title", content: "How Linkode Works" },
      { property: "og:description", content: "A clean handoff from in-app webviews to native browsers — explained step by step." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  { icon: ClipboardPaste, title: "Paste your link", body: "Drop any URL into Linkode — a product page, article, signup form, or landing page." },
  { icon: Wand2, title: "We optimize the redirect", body: "Linkode wraps your link in a lightweight breakout layer designed to escape restricted webviews." },
  { icon: Share2, title: "Share anywhere", body: "Post your new Linkode URL on Facebook, Instagram, TikTok, LinkedIn — anywhere your audience lives." },
  { icon: Smartphone, title: "Opens in native browser", body: "When tapped, the link bypasses the in-app browser and opens in Chrome, Safari, or the user's default." },
];

function HowItWorks() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">How Linkode Works</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            In-app browsers render slowly, break logins, and lose conversions. Linkode forces a clean handoff to the user's native browser in four simple steps.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-gradient-card p-7 shadow-soft transition-all hover:shadow-elegant">
              <span className="absolute -top-3 -left-3 grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
                {i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
                <s.icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 shadow-soft sm:p-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Why in-app browsers hurt your business</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { stat: "63%", label: "of mobile users abandon slow-loading in-app pages" },
              { stat: "2.5x", label: "longer page render times inside webviews vs native browsers" },
              { stat: "41%", label: "drop in conversion when payment flows open in-app" },
            ].map((m) => (
              <div key={m.stat} className="rounded-xl bg-secondary/60 p-5">
                <p className="text-3xl font-bold text-primary">{m.stat}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
          <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-glow">
            Try Linkode Now <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
