"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
    message: ""
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // REPLACE: hook this up to your endpoint (Resend, Formspree, /api/contact, etc.)
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <Field
        label="Your name"
        name="name"
        value={form.name}
        onChange={onChange}
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={onChange}
        required
      />

      <div>
        <label
          htmlFor="project"
          className="block text-[10px] uppercase tracking-[0.3em] text-accent-muted"
        >
          Project type
        </label>
        <select
          id="project"
          name="project"
          value={form.project}
          onChange={onChange}
          className="mt-3 w-full appearance-none border-b border-white/15 bg-transparent py-4 text-lg text-accent outline-none transition-colors focus:border-accent"
        >
          <option value="" className="bg-ink-900">
            Select…
          </option>
          <option value="commercial" className="bg-ink-900">
            Commercial / Brand
          </option>
          <option value="music-video" className="bg-ink-900">
            Music Video
          </option>
          <option value="documentary" className="bg-ink-900">
            Documentary
          </option>
          <option value="short-film" className="bg-ink-900">
            Short Film
          </option>
          <option value="other" className="bg-ink-900">
            Something else
          </option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-[10px] uppercase tracking-[0.3em] text-accent-muted"
        >
          Brief
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={onChange}
          placeholder="Tell me about the project, timeline, and any references."
          className="mt-3 w-full resize-none border-b border-white/15 bg-transparent py-4 text-lg text-accent outline-none placeholder:text-accent-muted/60 transition-colors focus:border-accent"
        />
      </div>

      <div className="flex flex-col items-start gap-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting" || status === "sent"}
          className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm uppercase tracking-[0.25em] text-ink-950 transition-all duration-500 hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "submitting"
            ? "Sending…"
            : status === "sent"
            ? "Sent — Thank you"
            : "Send message"}
          <span className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>

        {status === "sent" && (
          <p className="animate-fade-in text-sm text-accent-muted">
            I&apos;ll be in touch within two working days.
          </p>
        )}
        {status === "error" && (
          <p className="animate-fade-in text-sm text-red-400">
            Something went wrong. Try again or email directly.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] uppercase tracking-[0.3em] text-accent-muted"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-3 w-full border-b border-white/15 bg-transparent py-4 text-lg text-accent outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
