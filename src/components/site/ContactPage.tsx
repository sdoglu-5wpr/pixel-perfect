import { useState } from "react";
import { Mail, Newspaper, MessageSquare, AlertTriangle } from "lucide-react";

export function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-foreground to-foreground/95 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-5">
            <span className="w-8 h-px bg-white/40" /> Contact
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            Contact Everything-PR
          </h1>
          <p className="mt-5 text-lg text-white/75 max-w-2xl leading-relaxed">
            Everything-PR is the independent trade publication covering AI
            communications and the public relations industry, published daily
            since 2009 by Everything-PR News LLC.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-5">
          <ContactBlock
            icon={<MessageSquare className="w-5 h-5" />}
            title="Editorial submissions and op-eds"
            body="We welcome original op-eds, contributed articles, and expert commentary from PR professionals, agency leaders, communications executives, and marketing practitioners. If you have something substantive to say about communications, crisis management, AI visibility, or the business of marketing, send pitches and submissions to info@everything-pr.com."
          />
          <ContactBlock
            icon={<Newspaper className="w-5 h-5" />}
            title="Press releases and industry news"
            body="We cover agency news, account wins, personnel moves, campaign results, industry research, and product launches relevant to the communications industry. Send press releases to info@everything-pr.com."
          />
          <ContactBlock
            icon={<Mail className="w-5 h-5" />}
            title="General inquiries"
            body="For partnership or general questions, email info@everything-pr.com."
          />
          <ContactBlock
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Corrections"
            body={
              <>
                To report a factual error, see our{" "}
                <a
                  href="/corrections-policy"
                  className="text-brand-blue underline font-semibold"
                >
                  Corrections Policy
                </a>
                .
              </>
            }
          />
        </div>
      </section>

      <section className="bg-surface-soft border-t border-black/5">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
            Send us a message
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            We aim to respond to all messages within 24–48 hours.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function ContactBlock({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-background p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-brand-blue/10 text-brand-blue">
          {icon}
        </span>
        <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      <a
        href="mailto:info@everything-pr.com"
        className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline"
      >
        info@everything-pr.com →
      </a>
    </div>
  );
}

function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("Please agree to the privacy policy.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(j.error ?? "Failed to send message");
      }
      setState("success");
      (e.target as HTMLFormElement).reset();
      setAgree(false);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border bg-background p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h3 className="mt-5 font-serif text-2xl font-bold">Thank you</h3>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Your message has been received. A member of our editorial team will
          get back to you within 24–48 hours.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      method="post"
      action="#"
      className="rounded-lg border bg-background p-8 space-y-5"
      noValidate
    >
      <Field label="Name" name="name" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Message <span className="text-ticker">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          className="w-full rounded-md border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ticker/40 focus:border-ticker"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1"
        />
        <span>
          By reaching out to us, you agree to our{" "}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-md bg-brand-blue text-white font-semibold py-3 hover:opacity-90 disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required ? <span className="text-ticker">*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        maxLength={255}
        className="w-full rounded-md border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ticker/40 focus:border-ticker"
      />
    </div>
  );
}
