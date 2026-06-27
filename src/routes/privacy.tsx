import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Linkode" },
      { name: "description", content: "How Linkode handles your data, your links, and your privacy." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 27, 2026</p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-2">Linkode collects only the minimum information necessary to operate the service. This includes the URLs you submit and basic, anonymized analytics about link performance.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Information</h2>
            <p className="mt-2">We use the data to generate, maintain, and improve your shortened links. We do not sell or rent your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Cookies</h2>
            <p className="mt-2">We use functional cookies to keep the application working and remember preferences. You may disable cookies in your browser settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data Security</h2>
            <p className="mt-2">We use industry-standard security measures to protect your data, including encryption in transit and at rest.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
            <p className="mt-2">You can request access, correction, or deletion of your data at any time by contacting hello@linkode.app.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
            <p className="mt-2">Questions about this policy? Email us at privacy@linkode.app.</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
