import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Linkode" },
      { name: "description", content: "The terms and conditions for using Linkode." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 27, 2026</p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-2">By accessing or using Linkode, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Acceptable Use</h2>
            <p className="mt-2">You agree not to use Linkode for any unlawful purpose, including but not limited to phishing, malware distribution, harassment, or fraud.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Service Availability</h2>
            <p className="mt-2">We work hard to keep Linkode available 24/7, but we do not guarantee uninterrupted service and are not liable for downtime.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Limitation of Liability</h2>
            <p className="mt-2">Linkode is provided "as is" without warranties of any kind. We are not liable for any indirect or consequential damages arising from use of the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Modifications</h2>
            <p className="mt-2">We may update these terms from time to time. Continued use of Linkode after changes constitutes acceptance of the new terms.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
            <p className="mt-2">Questions about these terms? Email us at legal@linkode.app.</p>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
