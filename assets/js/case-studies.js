// ─────────────────────────────────────────────────────────────────────────────
// RICREATIONS — CASE STUDY DATA
// To add a new case study: duplicate a block below and fill in the details.
// To add creatives: place files in /projects/<client-id>/creatives/ and add entries
// to the "creatives" array. Types: "image", "gif", "video", "youtube", "vimeo"
// ─────────────────────────────────────────────────────────────────────────────

const CASE_STUDIES = {

  // ── AZZAR STEEL & FENCING ──────────────────────────────────────────────────
  "azzar-steel": {
    id: "azzar-steel",
    client: "Azzar Steel & Fencing",
    shortName: "Azzar Steel",
    tagline: "B2B Lead Generation · Zimbabwe",
    heroWord: "AZZAR",
    coverColor: "linear-gradient(135deg, #0d0870 0%, #1a10b0 100%)",
    number: "01",
    next: "kredibility-finance",
    nextLabel: "Kredibility Finance",

    meta: [
      { label: "Industry",   value: "Steel / B2B" },
      { label: "Platform",   value: "Meta (FB + IG)" },
      { label: "Objective",  value: "Lead Generation" },
      { label: "Market",     value: "Zimbabwe" }
    ],

    keyMetrics: [
      { label: "Total Leads",   value: "250+",   color: null,      desc: "Qualified inbound leads from targeted Meta campaigns across Zimbabwe." },
      { label: "Cost Per Lead", value: "$0.11",  color: null,      desc: "Exceptionally low CPL for B2B on Meta — well below industry benchmarks." },
      { label: "Total Spend",   value: "$18.57", color: null,      desc: "Entire campaign budget to date — maximum efficiency at minimal cost." },
      { label: "Status",        value: "Active", color: "#22c55e", desc: "Campaign continues to run and generate new leads without interruption." }
    ],

    tags: ["B2B Lead Generation", "Meta Ads", "Facebook", "Instagram", "Zimbabwe", "Zero to Launch", "Full Campaign Build", "Audience Strategy"],

    brief: {
      heading: "From zero digital presence to an active lead pipeline",
      body: [
        "Azzar Steel & Fencing had no existing digital advertising infrastructure — no Meta Pixel, no Business Manager, no audiences, no campaign history. The objective was to build everything from scratch and generate qualified inbound leads from businesses and homeowners across Zimbabwe looking for steel and fencing solutions.",
        "The challenge was achieving meaningful lead volume at a cost that made business sense, in a B2B category where Meta advertising is typically expensive and audiences are harder to define precisely."
      ]
    },

    strategy: {
      heading: "Audience precision over broad reach",
      intro: "Rather than running broad awareness campaigns, the strategy focused on reaching high-intent audiences — people actively involved in construction, property development, and home improvement across multiple Zimbabwean provinces.",
      steps: [
        { num: "01", title: "Infrastructure Setup",     body: "Configured Meta Business Manager, installed and verified the Meta Pixel, set up Events Manager to track Lead events, and built the full campaign account structure from scratch." },
        { num: "02", title: "Audience Architecture",    body: "Built the Field Fence Audience — geographically targeting multiple Zimbabwe locations with an estimated reach of 2.2–2.6 million. Layered interest and behaviour targeting to isolate construction, property and home improvement segments." },
        { num: "03", title: "Creative Direction",       body: "Developed campaign creatives that spoke directly to the practical concerns of the target audience: durability, security, and value. Assets were built to stop the scroll in a feed dominated by consumer brands." },
        { num: "04", title: "Optimisation & Scaling",  body: "Monitored the learning phase closely — allowing the campaign to exit before making adjustments. Budget decisions were made based on CPL data, not reach or impressions. Creative was refreshed when frequency data indicated fatigue." }
      ]
    },

    execution: {
      heading: "Built to last, not just to launch",
      body: [
        "The campaign was structured with Campaign Budget Optimisation (CBO) to let Meta allocate spend to the highest-performing ad sets automatically. A single creative variation carried the early campaign — proving the concept before additional assets were introduced.",
        "Custom Audiences were built progressively from Pixel data as it accumulated: website visitors, lead event filers, and engagement audiences — creating the foundation for future retargeting as the customer list grows.",
        "Reporting was delivered to the client covering cost per lead, frequency, reach, audience saturation signals, and all optimisation decisions made during the period."
      ],
      isActive: true
    },

    results: [
      { label: "Leads Generated", value: "250+",        color: null,      note: "Qualified inbound enquiries from across Zimbabwe, still growing." },
      { label: "Cost Per Lead",   value: "$0.11",       color: null,      note: "B2B CPL well below the Meta industry average of $1.50–$5.00." },
      { label: "Total Spend",     value: "$18.57",      color: null,      note: "Full budget to date — maximum ROI at minimum investment." },
      { label: "Audience Reach",  value: "2.2M+",       color: null,      note: "Estimated reach across Zimbabwe provinces in campaign targeting." },
      { label: "Learning Phase",  value: "Exited",      color: null,      note: "Campaign exited Meta's learning phase — delivering stable, predictable results." },
      { label: "Campaign",        value: "Live",        color: "#22c55e", note: "No pause, no reset — running continuously and generating new leads." }
    ],

    // ── CREATIVES ─────────────────────────────────────────────────────────────
    // Place files in: /projects/azzar-steel/creatives/
    // Types: "image" | "gif" | "video" (MP4) | "youtube" | "vimeo"
    // Featured items span 2 columns: featured: true
    creatives: [
      // Example entries — replace src values with your actual filenames:
      // { type: "image",   src: "projects/azzar-steel/creatives/field-fence-static.jpg", caption: "Field Fence Ad — Primary Creative", featured: true },
      // { type: "gif",     src: "projects/azzar-steel/creatives/animated-banner.gif",     caption: "Animated Banner — Feed Version" },
      // { type: "video",   src: "projects/azzar-steel/creatives/campaign-video.mp4",      caption: "Campaign Video — 15s Cut" },
      // { type: "youtube", src: "VIDEO_ID_HERE",                                   caption: "Campaign Ad — YouTube Version" },
      // { type: "image",   src: "projects/azzar-steel/creatives/carousel-1.jpg", caption: "Carousel Slide 1" },
      // { type: "image",   src: "projects/azzar-steel/creatives/carousel-2.jpg", caption: "Carousel Slide 2" },
    ]
  },


  // ── KREDIBILITY FINANCE ────────────────────────────────────────────────────
  "kredibility-finance": {
    id: "kredibility-finance",
    client: "Kredibility Finance",
    shortName: "Kredibility",
    tagline: "Social Media Growth · Financial Services · Zimbabwe",
    heroWord: "KRED",
    coverColor: "linear-gradient(135deg, #11111a 0%, #1e1e2e 100%)",
    number: "02",
    next: "zibuko-capital",
    nextLabel: "Zibuko Capital",

    meta: [
      { label: "Industry",   value: "Financial Services" },
      { label: "Platform",   value: "Meta (FB + IG)" },
      { label: "Objective",  value: "Social Growth + Leads" },
      { label: "Market",     value: "Zimbabwe" }
    ],

    keyMetrics: [
      { label: "Page Views",   value: "277",   color: null,      desc: "Website page views tracked via Meta Pixel from campaign traffic." },
      { label: "Lead Events",  value: "11",    color: null,      desc: "Lead conversion events recorded in Events Manager." },
      { label: "Cost Per Lead", value: "$0.06", color: null,     desc: "Early stage CPL — highly efficient for a financial services brand." },
      { label: "Status",       value: "Active", color: "#22c55e", desc: "Campaigns running across social growth and lead generation phases." }
    ],

    tags: ["Financial Services", "Social Media Management", "Meta Ads", "Lead Generation", "Brand Building", "Phased Strategy"],

    brief: {
      heading: "Building trust before asking for business",
      body: [
        "Kredibility Finance needed a phased digital strategy — not a brand that immediately pushes financial products at cold audiences, but one that earns trust first through consistent content and social proof, then converts through targeted lead generation.",
        "The challenge unique to financial services: Meta restricts data collection on financial websites under its Financial Service Pixel category, which required careful technical configuration to ensure tracking still functioned correctly."
      ]
    },

    strategy: {
      heading: "Phase 1 social proof, Phase 2 conversion",
      intro: "A two-phase approach: establish credibility and grow the audience first, then layer in lead generation campaigns once social proof is in place.",
      steps: [
        { num: "01", title: "Technical Setup",         body: "Configured Meta Pixel under the Financial Service category, set up Events Manager, verified PageView and Lead events, and configured Conversions API (CAPI) for server-side data reliability." },
        { num: "02", title: "Phase 1 — Social Proof", body: "Daily content publishing across Facebook and Instagram with small engagement budgets ($1–2/day) to build follower base, post reach, and social proof signals before running lead campaigns." },
        { num: "03", title: "Phase 2 — Lead Gen",     body: "Rebuilding campaigns with Leads objective once sufficient social proof is established — targeting qualified financial audiences with trust already built through content." },
        { num: "04", title: "Audience Building",      body: "Customer list uploaded to Meta as a Custom Audience foundation for future Lookalike campaigns. Pixel data accumulating to enable Website Custom Audiences as traffic grows." }
      ]
    },

    execution: {
      heading: "Long game strategy for a trust-dependent brand",
      body: [
        "Financial services brands cannot rely on impulse decisions. The execution focused on building a visible, consistent presence that made Kredibility Finance feel legitimate and trustworthy before asking audiences to engage commercially.",
        "Pixel configuration under Meta's Financial Service category meant core tracking events — PageView and Lead — still fired correctly despite the restricted environment, ensuring all campaign data was captured accurately.",
        "Campaign reporting tracked follower growth, engagement rate, cost per follower, CPL across phases, and Pixel event volume — giving the client a clear picture of where the brand was in its growth trajectory."
      ],
      isActive: true
    },

    results: [
      { label: "Page Views",    value: "277",   color: null,      note: "Website visits tracked via Pixel from Meta campaign traffic." },
      { label: "Lead Events",   value: "11",    color: null,      note: "Lead conversion events recorded in Events Manager." },
      { label: "Cost Per Lead", value: "$0.06", color: null,      note: "Early-stage CPL for financial services — highly efficient." },
      { label: "Platform",      value: "Meta",  color: null,      note: "Facebook and Instagram managed as unified campaign ecosystem." },
      { label: "Tracking",      value: "Live",  color: null,      note: "Pixel + CAPI dual-layer tracking configured and verified." },
      { label: "Status",        value: "Active", color: "#22c55e", note: "Campaigns running — transitioning from Phase 1 to Phase 2." }
    ],

    creatives: [
      // Add Kredibility Finance creatives here when ready:
      // { type: "image", src: "creatives/kredibility-finance/social-post-1.jpg", caption: "Social Post — Brand Awareness", featured: true },
      // { type: "image", src: "creatives/kredibility-finance/social-post-2.jpg", caption: "Social Post — Product Feature" },
      // { type: "video", src: "creatives/kredibility-finance/brand-reel.mp4",    caption: "Brand Reel — Instagram" },
    ]
  },


  // ── ZIBUKO CAPITAL ─────────────────────────────────────────────────────────
  "zibuko-capital": {
    id: "zibuko-capital",
    client: "Zibuko Capital",
    shortName: "Zibuko",
    tagline: "Brand Identity · Paid Media · Meta Ads",
    heroWord: "ZIBUKO",
    coverColor: "linear-gradient(135deg, #1a10b0 0%, #0d0870 70%, #f5c518 200%)",
    number: "03",
    next: "azzar-steel",
    nextLabel: "Azzar Steel & Fencing",

    meta: [
      { label: "Industry",   value: "Capital / Investment" },
      { label: "Platform",   value: "Meta Ads" },
      { label: "Objective",  value: "Brand + Paid Media" },
      { label: "Market",     value: "Zimbabwe" }
    ],

    keyMetrics: [
      { label: "Services",  value: "Brand",  color: null,      desc: "Art direction and creative strategy for the Zibuko Capital brand." },
      { label: "Platform",  value: "Meta",   color: null,      desc: "Paid media campaigns managed across Meta platforms." },
      { label: "Creative",  value: "Done",   color: null,      desc: "Ad-ready creative assets produced for campaign deployment." },
      { label: "Status",    value: "Active", color: "#22c55e", desc: "Campaigns live and running." }
    ],

    tags: ["Art Direction", "Meta Ads", "Brand Identity", "Creative Strategy", "Capital & Investment"],

    brief: {
      heading: "A capital brand built for credibility and reach",
      body: [
        "Zibuko Capital required brand positioning and paid media execution that communicated authority and trustworthiness to a discerning investment audience. The brief covered creative direction from concept through to ad-ready assets, with campaign management on Meta targeting relevant investor and entrepreneur audiences.",
        "Feed Ricardo the full brief details here when ready."
      ]
    },

    strategy: {
      heading: "Brand first, performance second",
      intro: "Creative and campaign strategy built around establishing Zibuko Capital as a credible brand before driving direct response.",
      steps: [
        { num: "01", title: "Brand Positioning",    body: "Add strategy details here." },
        { num: "02", title: "Creative Development", body: "Add creative approach details here." },
        { num: "03", title: "Campaign Setup",       body: "Add campaign setup details here." },
        { num: "04", title: "Execution & Results",  body: "Add execution details here." }
      ]
    },

    execution: {
      heading: "Add execution details here",
      body: ["Feed Ricardo the execution details and I'll fill this section in."],
      isActive: true
    },

    results: [
      { label: "Platform",  value: "Meta",   color: null,      note: "Campaigns running on Facebook and Instagram." },
      { label: "Creative",  value: "Live",   color: null,      note: "Ad creative produced and deployed." },
      { label: "Status",    value: "Active", color: "#22c55e", note: "Campaign live." }
    ],

    creatives: [
      // Add Zibuko Capital creatives here when ready:
      // { type: "image", src: "creatives/zibuko-capital/brand-ad.jpg", caption: "Brand Ad — Primary", featured: true },
    ]
  }

};
