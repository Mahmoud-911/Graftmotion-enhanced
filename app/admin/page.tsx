"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ── Types ──────────────────────────────────────────────── */
type Client = { id: string; name: string; logo: string };
type WorkItem = { id: string; title: string; thumbnail: string; videoUrl: string };
type TestimonialItem = {
  id: string;
  clientName: string;
  role: string;
  image: string;
  quote: string;
};
type Content = {
  site: {
    title: string;
    subtitle: string;
    email: string;
    ctaText: string;
    ctaUrl: string;
  };
  hero: { videoUrl: string };
  clients: Client[];
  featuredWork: WorkItem[];
  testimonials: { featuredImage: string; items: TestimonialItem[] };
  moreWork: WorkItem[];
};

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "graftmotion";

/* ── Ensure an array always has at least `count` slots ─────────── */
function ensureArraySlots<T>(arr: unknown, count: number, factory: () => T): T[] {
  if (!Array.isArray(arr) || arr.length === 0) {
    return Array.from({ length: count }, factory);
  }
  return arr as T[];
}

/* ── Normalise raw Supabase blob into a fully-typed Content object ── */
function normalizeContent(raw: unknown): Content {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const site = (c.site && typeof c.site === "object" ? c.site : {}) as Record<string, unknown>;
  const hero = (c.hero && typeof c.hero === "object" ? c.hero : {}) as Record<string, unknown>;
  const tRaw = (c.testimonials && typeof c.testimonials === "object" ? c.testimonials : {}) as Record<string, unknown>;

  return {
    site: {
      title:    (site.title    as string) || "",
      subtitle: (site.subtitle as string) || "",
      email:    (site.email    as string) || "",
      ctaText:  (site.ctaText  as string) || "",
      ctaUrl:   (site.ctaUrl   as string) || "",
    },
    hero: {
      videoUrl: (hero.videoUrl as string) || "",
    },
    clients:      Array.isArray(c.clients)      ? (c.clients      as Client[])          : [],
    featuredWork: Array.isArray(c.featuredWork) ? (c.featuredWork as WorkItem[])        : [],
    moreWork:     Array.isArray(c.moreWork)     ? (c.moreWork     as WorkItem[])        : [],
    testimonials: {
      featuredImage: (tRaw.featuredImage as string) || "",
      items:          Array.isArray(tRaw.items) ? (tRaw.items as TestimonialItem[]) : [],
    },
  };
}

const TABS = [
  { id: "hero", label: "Showreel" },
  { id: "clients", label: "Clients" },
  { id: "featured", label: "Featured Work" },
  { id: "testimonials", label: "Testimonials" },
  { id: "more", label: "More Work" },
  { id: "settings", label: "Site Settings" }
] as const;

type Tab = (typeof TABS)[number]["id"];

/* ── Apply normalizeContent then guarantee UI slots ────────────── */
function normalizeAdminContent(raw: unknown): Content {
  const c = normalizeContent(raw);
  return {
    ...c,
    hero: c.hero || { videoUrl: "" },
    clients: ensureArraySlots(
      c.clients, 4,
      () => ({ id: uuid(), name: "", logo: "" })
    ),
    featuredWork: ensureArraySlots(
      c.featuredWork, 4,
      () => ({ id: uuid(), title: "", thumbnail: "", videoUrl: "" })
    ),
    testimonials: {
      featuredImage: c.testimonials?.featuredImage || "",
      items: ensureArraySlots(
        c.testimonials?.items, 3,
        () => ({ id: uuid(), clientName: "", role: "", image: "", quote: "" })
      ),
    },
    moreWork: ensureArraySlots(
      c.moreWork, 6,
      () => ({ id: uuid(), title: "", thumbnail: "", videoUrl: "" })
    ),
  };
}

/* ── Helpers ─────────────────────────────────────────────── */

// Direct unsigned upload to Cloudinary — no backend involved.
// Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
// to be set in your environment (Netlify environment variables + .env.local).
async function uploadFile(file: File): Promise<string> {
  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: fd }
  );

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

/* ── Sub-components ──────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="mb-1 block text-xs font-semibold uppercase tracking-widest"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text"
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text)"
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = "var(--accent)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    />
  );
}

function FileUploadBtn({
  label,
  accept,
  currentUrl,
  onUploaded,
  uploading,
  setUploading
}: {
  label: string;
  accept: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUploaded(url);
    } catch {
      alert("Upload failed. Check file type and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isVideo = accept.includes("video");

  return (
    <div className="flex flex-col gap-2">
      {currentUrl && (
        <div
          className="relative overflow-hidden rounded-lg"
          style={{ background: "var(--surface-2)" }}
        >
          {isVideo ? (
            <video
              src={currentUrl}
              className="max-h-36 w-full object-cover"
              muted
              playsInline
            />
          ) : (
            <img
              src={currentUrl}
              alt="Current"
              className="max-h-36 w-full object-cover"
            />
          )}
          <div
            className="absolute inset-x-0 bottom-0 px-2 py-1 text-xs"
            style={{ background: "rgba(0,0,0,0.7)", color: "#aaa" }}
          >
            {currentUrl.split("/").pop()}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {uploading ? "Uploading…" : currentUrl ? `Replace ${label}` : `Upload ${label}`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  color,
  children
}: {
  onClick: () => void;
  title: string;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-opacity hover:opacity-80"
      style={{ background: color || "var(--surface-2)", color: "var(--text)" }}
    >
      {children}
    </button>
  );
}

/* ── Tabs ────────────────────────────────────────────────── */
function HeroTab({
  content,
  setContent
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
        Showreel Video
      </h2>
      <Card>
        <Label>Hero Showreel (MP4, WebM)</Label>
        <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          This video plays automatically on the homepage, muted and looping.
          Recommended: 1080p MP4, under 50 MB.
        </p>
        <FileUploadBtn
          label="Showreel"
          accept="video/mp4,video/webm,video/quicktime"
          currentUrl={content.hero.videoUrl}
          onUploaded={(url) =>
            setContent({ ...content, hero: { ...(content?.hero || {}), videoUrl: url } })
          }
          uploading={uploading}
          setUploading={setUploading}
        />
        {content?.hero?.videoUrl && (
          <button
            className="mt-3 text-xs hover:underline"
            style={{ color: "var(--text-muted)" }}
            onClick={() =>
              setContent({ ...content, hero: { ...(content?.hero || {}), videoUrl: "" } })
            }
          >
            Remove video
          </button>
        )}
      </Card>
    </div>
  );
}

function ClientsTab({
  content,
  setContent
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Client>) =>
    setContent({
      ...content,
      clients: content.clients.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      )
    });

  const remove = (id: string) =>
    setContent({
      ...content,
      clients: content.clients.filter((c) => c.id !== id)
    });

  const add = () =>
    setContent({
      ...content,
      clients: [
        ...content.clients,
        { id: uuid(), name: "New Client", logo: "" }
      ]
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
          Clients
        </h2>
        <button
          onClick={add}
          className="rounded-full px-5 py-2 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg,#FF6600,#FF8800)",
            color: "#fff"
          }}
        >
          + Add Client
        </button>
      </div>

      {content.clients.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No clients yet. Click &quot;+ Add Client&quot; to get started.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {content.clients.map((cl) => (
          <Card key={cl.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {cl.id.slice(0, 8)}
              </span>
              <IconBtn onClick={() => remove(cl.id)} title="Remove" color="#3a1111">
                ✕
              </IconBtn>
            </div>
            <div className="mt-3 space-y-3">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={cl.name}
                  onChange={(v) => update(cl.id, { name: v })}
                  placeholder="e.g. Nike"
                />
              </div>
              <div>
                <Label>Logo (image)</Label>
                <FileUploadBtn
                  label="Logo"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  currentUrl={cl.logo}
                  onUploaded={(url) => update(cl.id, { logo: url })}
                  uploading={uploading === cl.id}
                  setUploading={(v) => setUploading(v ? cl.id : null)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WorkItemEditor({
  item,
  index,
  onUpdate,
  onRemove,
  fixed,
  uploadingId,
  setUploadingId
}: {
  item: WorkItem;
  index: number;
  onUpdate: (patch: Partial<WorkItem>) => void;
  onRemove?: () => void;
  fixed?: boolean;
  uploadingId: string | null;
  setUploadingId: (id: string | null) => void;
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          Slot {index + 1}
        </span>
        {!fixed && onRemove && (
          <IconBtn onClick={onRemove} title="Remove" color="#3a1111">
            ✕
          </IconBtn>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input
            value={item.title}
            onChange={(v) => onUpdate({ title: v })}
            placeholder="Project title"
          />
        </div>
        <div>
          <Label>Thumbnail (image)</Label>
          <FileUploadBtn
            label="Thumbnail"
            accept="image/jpeg,image/png,image/webp"
            currentUrl={item.thumbnail}
            onUploaded={(url) => onUpdate({ thumbnail: url })}
            uploading={uploadingId === item.id + "-thumb"}
            setUploading={(v) =>
              setUploadingId(v ? item.id + "-thumb" : null)
            }
          />
        </div>
        <div>
          <Label>Video (upload or paste URL)</Label>
          <Input
            value={item.videoUrl}
            onChange={(v) => onUpdate({ videoUrl: v })}
            placeholder="https://youtube.com/watch?v=… or leave blank to upload"
          />
          <div className="mt-2">
            <FileUploadBtn
              label="Video File"
              accept="video/mp4,video/webm,video/quicktime"
              currentUrl={""}
              onUploaded={(url) => onUpdate({ videoUrl: url })}
              uploading={uploadingId === item.id + "-vid"}
              setUploading={(v) =>
                setUploadingId(v ? item.id + "-vid" : null)
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function FeaturedTab({
  content,
  setContent
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<WorkItem>) =>
    setContent({
      ...content,
      featuredWork: content.featuredWork.map((w) =>
        w.id === id ? { ...w, ...patch } : w
      )
    });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
        Featured Work (4 Slots)
      </h2>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        These appear in the 2×2 &quot;My Work&quot; grid on the homepage.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {content.featuredWork.map((item, i) => (
          <WorkItemEditor
            key={item.id}
            item={item}
            index={i}
            onUpdate={(patch) => update(item.id, patch)}
            fixed
            uploadingId={uploadingId}
            setUploadingId={setUploadingId}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialsTab({
  content,
  setContent
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);

  const updateItem = (id: string, patch: Partial<TestimonialItem>) =>
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        items: content.testimonials.items.map((t) =>
          t.id === id ? { ...t, ...patch } : t
        )
      }
    });

  const removeItem = (id: string) =>
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        items: content.testimonials.items.filter((t) => t.id !== id)
      }
    });

  const addItem = () =>
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        items: [
          ...content.testimonials.items,
          {
            id: uuid(),
            clientName: "Client Name",
            role: "Role, Company",
            image: "",
            quote: ""
          }
        ]
      }
    });

  return (
    <div className="space-y-8">
      <h2 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
        Testimonials
      </h2>

      {/* Featured image */}
      <Card>
        <Label>Featured Testimonials Image</Label>
        <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Upload a screenshot of client reviews, a collage, or any image that
          shows social proof. Displays as a large banner on the homepage.
        </p>
        <FileUploadBtn
          label="Testimonials Image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          currentUrl={content.testimonials.featuredImage}
          onUploaded={(url) =>
            setContent({
              ...content,
              testimonials: { ...content.testimonials, featuredImage: url }
            })
          }
          uploading={uploading === "featured"}
          setUploading={(v) => setUploading(v ? "featured" : null)}
        />
        {content.testimonials.featuredImage && (
          <button
            className="mt-2 text-xs hover:underline"
            style={{ color: "var(--text-muted)" }}
            onClick={() =>
              setContent({
                ...content,
                testimonials: { ...content.testimonials, featuredImage: "" }
              })
            }
          >
            Remove image
          </button>
        )}
      </Card>

      {/* Individual testimonials */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Individual Testimonials</h3>
        <button
          onClick={addItem}
          className="rounded-full px-5 py-2 text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#FF6600,#FF8800)", color: "#fff" }}
        >
          + Add
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {content.testimonials.items.map((t) => (
          <Card key={t.id}>
            <div className="mb-3 flex justify-end">
              <IconBtn onClick={() => removeItem(t.id)} title="Remove" color="#3a1111">
                ✕
              </IconBtn>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Client Photo</Label>
                <FileUploadBtn
                  label="Photo"
                  accept="image/jpeg,image/png,image/webp"
                  currentUrl={t.image}
                  onUploaded={(url) => updateItem(t.id, { image: url })}
                  uploading={uploading === t.id}
                  setUploading={(v) => setUploading(v ? t.id : null)}
                />
              </div>
              <div>
                <Label>Client Name</Label>
                <Input
                  value={t.clientName}
                  onChange={(v) => updateItem(t.id, { clientName: v })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label>Role / Company</Label>
                <Input
                  value={t.role}
                  onChange={(v) => updateItem(t.id, { role: v })}
                  placeholder="CEO, Nike"
                />
              </div>
              <div>
                <Label>Quote</Label>
                <textarea
                  value={t.quote}
                  onChange={(e) => updateItem(t.id, { quote: e.target.value })}
                  placeholder="What they said about your work…"
                  rows={3}
                  className="w-full resize-none rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)"
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MoreWorkTab({
  content,
  setContent
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<WorkItem>) =>
    setContent({
      ...content,
      moreWork: content.moreWork.map((w) =>
        w.id === id ? { ...w, ...patch } : w
      )
    });

  const remove = (id: string) =>
    setContent({
      ...content,
      moreWork: content.moreWork.filter((w) => w.id !== id)
    });

  const add = () =>
    setContent({
      ...content,
      moreWork: [
        ...content.moreWork,
        { id: uuid(), title: "New Work", thumbnail: "", videoUrl: "" }
      ]
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
          More Work
        </h2>
        <button
          onClick={add}
          className="rounded-full px-5 py-2 text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,#FF6600,#FF8800)", color: "#fff" }}
        >
          + Add
        </button>
      </div>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        These appear in the 3-column &quot;See More Work&quot; grid. Add as many as you like.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {content.moreWork.map((item, i) => (
          <WorkItemEditor
            key={item.id}
            item={item}
            index={i}
            onUpdate={(patch) => update(item.id, patch)}
            onRemove={() => remove(item.id)}
            uploadingId={uploadingId}
            setUploadingId={setUploadingId}
          />
        ))}
      </div>
    </div>
  );
}

function SettingsTab({
  content,
  setContent
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  const update = (patch: Partial<Content["site"]>) =>
    setContent({ ...content, site: { ...content.site, ...patch } });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
        Site Settings
      </h2>
      <Card>
        <div className="space-y-4">
          <div>
            <Label>Brand Name (shown on homepage)</Label>
            <Input
              value={content.site.title}
              onChange={(v) => update({ title: v })}
              placeholder="GRAFTMOTION"
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={content.site.subtitle}
              onChange={(v) => update({ subtitle: v })}
              placeholder="Reliable Direction-aligned Videos. Guaranteed."
            />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input
              value={content.site.email}
              onChange={(v) => update({ email: v })}
              placeholder="graftmotionfx@gmail.com"
              type="email"
            />
          </div>
          <div>
            <Label>CTA Button Text</Label>
            <Input
              value={content.site.ctaText}
              onChange={(v) => update({ ctaText: v })}
              placeholder="Work With ME"
            />
          </div>
          <div>
            <Label>CTA Button URL (Instagram, booking page, etc.)</Label>
            <Input
              value={content.site.ctaUrl}
              onChange={(v) => update({ ctaUrl: v })}
              placeholder="https://instagram.com/graftmotionfx"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold">Admin Password</h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Change the admin password by setting the{" "}
          <code
            className="rounded px-1 py-0.5 text-xs"
            style={{ background: "var(--surface-2)", color: "var(--accent)" }}
          >
            NEXT_PUBLIC_ADMIN_PASSWORD
          </code>{" "}
          environment variable in a{" "}
          <code
            className="rounded px-1 py-0.5 text-xs"
            style={{ background: "var(--surface-2)", color: "var(--accent)" }}
          >
            .env.local
          </code>{" "}
          file at the root of this project. Default is{" "}
          <code
            className="rounded px-1 py-0.5 text-xs"
            style={{ background: "var(--surface-2)", color: "var(--accent)" }}
          >
            graftmotion
          </code>
          .
        </p>
      </Card>
    </div>
  );
}

/* ── Main Admin Page ─────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Admin always uses dark theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
      loadContent();
    } else {
      setPwError(true);
      setPw("");
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "content", "main"));
      const raw = snap.exists() ? JSON.parse(snap.data()?.json || "{}") : {};
      setContent(normalizeAdminContent(raw));
    } catch (err) {
      console.error("Failed to load content:", err);
      showToast("Failed to load content", false);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "content", "main"), {
        json: JSON.stringify(content),
        updatedAt: new Date().toISOString(),
      });
      showToast("Changes saved!");
    } catch (err) {
      console.error("Save error:", err);
      showToast("Save failed — try again", false);
    } finally {
      setSaving(false);
    }
  };

  /* ── Password gate ──────────────────────────────────────── */
  if (!authed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <p
              className="font-display text-5xl"
              style={{ color: "var(--accent)" }}
            >
              GM
            </p>
            <h1
              className="mt-2 text-xl font-bold"
              style={{ color: "var(--text)" }}
            >
              Admin Access
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Enter your password to continue.
            </p>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)"
            }}
          >
            <Label>Password</Label>
            <input
              type="password"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setPwError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && login()}
              autoFocus
              className="mt-1 w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${pwError ? "#ef4444" : "var(--border)"}`,
                color: "var(--text)"
              }}
              placeholder="••••••••"
            />
            {pwError && (
              <p className="mt-1.5 text-xs text-red-400">
                Incorrect password.
              </p>
            )}
            <button
              onClick={login}
              className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#FF6600,#FF8800)" }}
            >
              Enter Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Loading ────────────────────────────────────────────── */
  if (loading || !content) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Loading content…</p>
      </div>
    );
  }

  /* ── Dashboard ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Toast */}
      {toast && (
        <div
          className="fixed right-6 top-6 z-[200] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl"
          style={{
            background: toast.ok ? "#1a3a1a" : "#3a1111",
            color: toast.ok ? "#4ade80" : "#f87171",
            border: `1px solid ${toast.ok ? "#166534" : "#7f1d1d"}`
          }}
        >
          {toast.ok ? "✓ " : "✕ "}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "color-mix(in srgb, var(--surface) 95%, transparent)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl" style={{ color: "var(--accent)" }}>
              GM
            </span>
            <span
              className="hidden text-xs font-semibold uppercase tracking-widest md:block"
              style={{ color: "var(--text-muted)" }}
            >
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 md:px-4 md:py-2"
              style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <span className="hidden sm:inline">View Site</span>
              <span className="sm:hidden">↗</span>
            </a>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:px-5 md:py-2 md:text-sm"
              style={{ background: "linear-gradient(135deg,#FF6600,#FF8800)" }}
            >
              {saving ? "Saving…" : <><span className="hidden sm:inline">Save All Changes</span><span className="sm:hidden">Save</span></>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tab bar — full width above content */}
      <div className="sticky top-[57px] z-40 md:hidden" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div
          className="flex gap-2 overflow-x-auto px-4 py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg,#FF6600,#FF8800)" : "var(--surface)",
                color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                border: "1px solid var(--border)"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 md:px-6 md:py-8">
        {/* Sidebar nav — desktop only */}
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? "var(--accent)" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "var(--text-muted)"
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="min-w-0 flex-1">
          {activeTab === "hero" && (
            <HeroTab content={content} setContent={setContent} />
          )}
          {activeTab === "clients" && (
            <ClientsTab content={content} setContent={setContent} />
          )}
          {activeTab === "featured" && (
            <FeaturedTab content={content} setContent={setContent} />
          )}
          {activeTab === "testimonials" && (
            <TestimonialsTab content={content} setContent={setContent} />
          )}
          {activeTab === "more" && (
            <MoreWorkTab content={content} setContent={setContent} />
          )}
          {activeTab === "settings" && (
            <SettingsTab content={content} setContent={setContent} />
          )}
        </main>
      </div>
    </div>
  );
}
