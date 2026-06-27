import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Linkode" },
      { name: "description", content: "Insights on digital marketing, social algorithms, and link optimization from the Linkode team." },
      { property: "og:title", content: "Linkode Blog" },
      { property: "og:description", content: "Strategies for creators and marketers who want their links to convert." },
    ],
  }),
  component: Blog,
});

const posts = [
  { title: "Why Facebook's In-App Browser Is Killing Your Conversions", category: "Conversion", date: "Jun 18, 2026", gradient: "from-blue-500/30 to-indigo-500/30" },
  { title: "The Hidden Cost of Webview Rendering on Mobile", category: "Performance", date: "Jun 12, 2026", gradient: "from-purple-500/30 to-pink-500/30" },
  { title: "Link Optimization in 2026: A Creator's Playbook", category: "Strategy", date: "Jun 04, 2026", gradient: "from-cyan-500/30 to-blue-500/30" },
  { title: "How Algorithm Updates Affect Outbound Link Reach", category: "Algorithms", date: "May 28, 2026", gradient: "from-emerald-500/30 to-teal-500/30" },
  { title: "Building Trust With Your Audience Through Better URLs", category: "Branding", date: "May 19, 2026", gradient: "from-orange-500/30 to-rose-500/30" },
  { title: "TikTok, Instagram, Facebook: Comparing In-App Browser Behavior", category: "Research", date: "May 11, 2026", gradient: "from-violet-500/30 to-fuchsia-500/30" },
];

function Blog() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">The Linkode Blog</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Insights on digital marketing, social media algorithms, and link optimization strategies — straight from the team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className={`relative h-44 bg-gradient-to-br ${p.gradient}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {p.date}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A practical look at what the data says, and how to act on it this quarter.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
