export type Project = {
  slug: string;
  title: string;
  client: string;
  category: "Commercial" | "Music Video" | "Documentary" | "Short Film" | "Brand";
  year: number;
  thumbnail: string;
  preview: string;
  // Use a YouTube or Vimeo embed URL.
  embed: string;
  description: string;
  role: string[];
  tools: string[];
  credits: { label: string; value: string }[];
};

/**
 * REPLACE: swap the videos, posters, and copy with your own.
 *  - thumbnail: 4:5 or 16:9 still frame (Unsplash/Picsum work as placeholders).
 *  - preview:   short, muted MP4 used on hover (5–8 sec is ideal).
 *  - embed:     full case-study player (YouTube `embed/<id>` or Vimeo `video/<id>`).
 */
export const projects: Project[] = [
  {
    slug: "midnight-bloom",
    title: "Midnight Bloom",
    client: "Aether Perfumes",
    category: "Commercial",
    year: 2025,
    thumbnail:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=80",
    preview:
      "https://cdn.coverr.co/videos/coverr-a-woman-walking-through-a-forest-9851/1080p.mp4",
    embed: "https://www.youtube.com/embed/aqz-KE-bpKQ",
    description:
      "A 60-second campaign film blending macro botanicals with low-key portraiture. Cut to breathe between movement and stillness, finished with a warm, filmic grade pulled from the brand's amber palette.",
    role: ["Editor", "Colorist"],
    tools: ["Premiere Pro", "DaVinci Resolve", "After Effects"],
    credits: [
      { label: "Director", value: "L. Marchetti" },
      { label: "DP", value: "S. Okafor" },
      { label: "Agency", value: "Studio Maison" }
    ]
  },
  {
    slug: "north-of-silence",
    title: "North of Silence",
    client: "Patagonia Films",
    category: "Documentary",
    year: 2024,
    thumbnail:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80",
    preview:
      "https://cdn.coverr.co/videos/coverr-snow-mountains-from-above-2231/1080p.mp4",
    embed: "https://player.vimeo.com/video/76979871",
    description:
      "An eight-minute portrait of a solo climber and the silence she chases. Built from 14 hours of footage, paced like a slow exhale, with a sound design that lets the wind carry the story.",
    role: ["Lead Editor", "Sound Design"],
    tools: ["DaVinci Resolve", "Pro Tools"],
    credits: [
      { label: "Director", value: "K. Aaland" },
      { label: "Composer", value: "T. Renault" }
    ]
  },
  {
    slug: "low-tide",
    title: "Low Tide",
    client: "Halsey Vogel",
    category: "Music Video",
    year: 2024,
    thumbnail:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80",
    preview:
      "https://cdn.coverr.co/videos/coverr-ocean-waves-on-the-beach-7059/1080p.mp4",
    embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
    description:
      "A coastal, sun-bleached music video assembled around a single take. Match-cuts mirror the lyrics; subtle speed ramps and a teal-amber grade give the piece a memory-like texture.",
    role: ["Editor", "Motion"],
    tools: ["Premiere Pro", "After Effects"],
    credits: [
      { label: "Artist", value: "Halsey Vogel" },
      { label: "Director", value: "M. Iwasaki" }
    ]
  },
  {
    slug: "atlas-running",
    title: "Atlas, Running",
    client: "Onyx Athletic",
    category: "Brand",
    year: 2025,
    thumbnail:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
    preview:
      "https://cdn.coverr.co/videos/coverr-running-in-the-sunset-5253/1080p.mp4",
    embed: "https://www.youtube.com/embed/ysz5S6PUM-U",
    description:
      "A kinetic 30-second hero spot for a flagship running shoe. Edited to a heartbeat-driven track with frame-perfect typography and motion graphic transitions.",
    role: ["Editor", "Motion Designer"],
    tools: ["After Effects", "Premiere Pro", "Cinema 4D"],
    credits: [
      { label: "Agency", value: "North&Co" },
      { label: "DP", value: "R. Singh" }
    ]
  },
  {
    slug: "the-glasshouse",
    title: "The Glasshouse",
    client: "Independent",
    category: "Short Film",
    year: 2023,
    thumbnail:
      "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&w=1600&q=80",
    preview:
      "https://cdn.coverr.co/videos/coverr-rain-falling-on-a-window-7561/1080p.mp4",
    embed: "https://player.vimeo.com/video/22439234",
    description:
      "A twelve-minute psychological short, cut to feel like memory: long holds, intentional negative space, and a grade pulled toward the cool side of bone.",
    role: ["Editor"],
    tools: ["DaVinci Resolve", "Pro Tools"],
    credits: [
      { label: "Director", value: "E. Bauer" },
      { label: "DP", value: "J. Park" }
    ]
  },
  {
    slug: "ember-and-iron",
    title: "Ember & Iron",
    client: "Forge Whisky",
    category: "Commercial",
    year: 2024,
    thumbnail:
      "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=1600&q=80",
    preview:
      "https://cdn.coverr.co/videos/coverr-fire-in-slow-motion-2647/1080p.mp4",
    embed: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    description:
      "A craft-driven brand film for a small-batch distillery. Edited with patience: long dissolves, breath in the cuts, and an analog-warm finish.",
    role: ["Editor", "Colorist"],
    tools: ["Premiere Pro", "DaVinci Resolve"],
    credits: [
      { label: "Director", value: "C. Holloway" },
      { label: "Agency", value: "Foreground" }
    ]
  }
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
