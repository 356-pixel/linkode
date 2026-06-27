import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Target, Users, Heart, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Linkode" },
      { name: "description", content: "Linkode's mission is to improve the mobile web experience by helping creators escape restrictive in-app browsers." },
      { property: "og:title", content: "About Linkode" },
      { property: "og:description", content: "Our mission is to make every link feel native, fast, and trustworthy." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">About Linkode</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            We're on a mission to make the mobile web feel as fast, native, and trustworthy as it was meant to be — one link at a time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg leading-relaxed text-foreground">
            Linkode was founded by a small team of creators, marketers, and engineers who were tired of watching audiences bounce off broken in-app browsers. We saw login flows fail. We saw checkouts crash. We saw beautiful sites rendered into glitchy webviews — and conversions disappear with them.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            So we built a tool that gives every creator the power to take control. Linkode quietly redirects your audience out of restricted in-app browsers and into the system browser they already trust — Chrome, Safari, Edge, or Firefox. The result is a faster page, a familiar interface, and a far greater chance that your visitor stays.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our Mission", body: "Make every link a first-class web experience, regardless of where it's shared." },
            { icon: Heart, title: "Our Values", body: "Privacy, performance, and respect for the end user always come first." },
            { icon: Users, title: "Who We Serve", body: "Creators, brands, agencies, and marketers who need their links to convert." },
            { icon: Globe, title: "Our Reach", body: "Trusted by teams worldwide to optimize millions of shared links every month." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-primary">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
