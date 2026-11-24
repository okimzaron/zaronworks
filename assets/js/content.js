/* =========================================================
   content.js: THE ONE PLACE TO EDIT PORTFOLIO CONTENT.
   No HTML needed. Change the lists below and refresh.
   ========================================================= */

/* ---------- 1. COLLAGE (the first screen) ----------
   The image marked featured: true sits in the exact center (2×2 tiles);
   the rest fill in around it, then continue below.
   size:  "wide"   – 2 tiles across  (landscape photos)
          "tall"   – 2 tiles down    (portrait photos)
          "square" – 1 tile          (logos, square crops)
   Order matters: the first seven fill the ring around the center photo.
   The current order fills it with no gaps. If you add photos, put them at
   the end so they flow below the first screen.
   invert: true flips black-on-white line art so it suits the dark page */
window.GALLERY = [
  { src: 'assets/img/gallery/headphones.jpg',      alt: 'Za\'Ron Lee, low-light portrait with headphones', featured: true },
  { src: 'assets/img/gallery/referees.jpg',        alt: 'Referees at a VEX competition',                size: 'wide' },
  { src: 'assets/img/reaper-logo.webp',            alt: 'Reaper crest, pixel art logo',                 size: 'square' },
  { src: 'assets/img/gallery/skate.jpg',           alt: 'Portrait with a skateboard among bamboo',      size: 'tall' },
  { src: 'assets/img/gallery/white-suit.jpg',      alt: 'Portrait in a white suit at sunset',           size: 'tall' },
  { src: 'assets/img/gallery/studio-portrait.jpg', alt: 'Warm studio portrait on black',                size: 'wide' },
  { src: 'assets/img/gambit-4588g.webp',           alt: 'Gambit 4588G team logo',                       size: 'square' },
  { src: 'assets/img/gallery/blue-dress.jpg',      alt: 'Night portrait in a blue dress by a wagon',    size: 'wide' }
];

/* ---------- 2. PROJECTS (the expandable overview) ----------
   theme: "reaper" | "gambit" (each has its own look in portfolio.css).
   href:  the page the "open" button goes to. */
window.PROJECTS = [
  {
    theme: 'reaper',
    title: 'Reaper',
    summary: 'A VEX V5 template with MCL, odometry, autonomous selection and custom driver controls, with full docs.',
    tags: ['C++', 'PROS', 'MCL', 'Odometry'],
    href: 'https://reaperlib.online/',
    cta: 'Enter Reaper'
  },
  {
    theme: 'gambit',
    title: '4588G Gambit',
    summary: 'My VEX Robotics Competition team, where I\'m the lead coder and driver.',
    tags: ['VEX V5', 'Lead coder', 'Driver'],
    href: 'projects/4588g/',
    cta: 'Meet the team'
  }
];

/* ---------- 3. LICENSES & CERTIFICATIONS ----------
   icon: "drone" | "hardhat" | "chef" | "glass"
   code: the short badge in the corner.  tone: "purple" (default) or "brown". */
window.LICENSES = [
  { icon: 'drone',   code: 'FAA 107', name: 'Part 107 Remote Pilot',   issuer: 'Federal Aviation Administration',
    detail: 'Licensed to fly drones commercially for photo and video work.', year: 'Summer 2026' },
  { icon: 'hardhat', code: 'OSHA',    name: 'OSHA Certified',          issuer: 'Occupational Safety & Health Administration',
    detail: 'Trained in workplace safety and hazard awareness.', tone: 'brown' },
  { icon: 'chef',    code: 'FOOD',    name: 'Food Handler License',    issuer: 'Food safety certification',
    detail: 'Certified in safe food preparation, storage and handling.' },
  { icon: 'glass',   code: 'TABC',    name: 'TABC Certified',          issuer: 'Texas Alcoholic Beverage Commission',
    detail: 'Certified seller-server for responsible alcohol service.', tone: 'brown' }
];
