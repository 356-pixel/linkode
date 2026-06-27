import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Mail, MapPin, MessageSquare, Send, Check } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Linkode" },
      { name: "description", content: "Get in touch with the Linkode team. We're happy to help with partnerships, support, and feedback." },
      { property: "og:title", content: "Contact Linkode" },
      { property: "og:description", content: "Reach out — we typically respond within one business day." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { if (i.path[0]) errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const field = (name: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              { icon: Mail, label: "Email", value: "hello@linkode.app" },
              { icon: MessageSquare, label: "Support", value: "support@linkode.app" },
              { icon: MapPin, label: "Office", value: "Remote-first, worldwide" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-primary">
                  <c.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="truncate text-sm font-medium text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elegant sm:p-8 lg:col-span-2">
            <div className="grid gap-5 sm:grid-cols-2">
              {field("name", "Name", "text", "Jane Doe")}
              {field("email", "Email", "email", "jane@example.com")}
            </div>
            <div className="mt-5">
              {field("subject", "Subject", "text", "How can we help?")}
            </div>
            <div className="mt-5">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                placeholder="Tell us a bit about what you need..."
                className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-glow sm:w-auto"
            >
              {sent ? <><Check className="h-4 w-4" /> Message sent</> : <><Send className="h-4 w-4" /> Send Message</>}
            </button>
            {sent && <p className="mt-3 text-sm text-success">Thanks — we'll be in touch shortly.</p>}
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
