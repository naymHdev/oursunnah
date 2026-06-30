/**
 * Journal Post Seed Data — Islamic Tradition & History
 *
 * 5 premium, storytelling-style blog posts. Demo featured images use
 * Unsplash placeholder URLs — replace with real Cloudinary uploads later
 * via the dashboard or PATCH /journal/:id.
 */

export interface JournalPostSeed {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imagePublicId: string | null;
  category:
    | "STYLE_GUIDE"
    | "HOME_LIVING"
    | "HERITAGE"
    | "WELLNESS"
    | "CULTURE"
    | "COMMUNITY"
    | "PRODUCT_STORY"
    | "CRAFTMANSHIP";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  readTimeMinutes: number;
  hijriMonth?: string;
  hijriYear?: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

const JOURNAL_POST_SEED_DATA: JournalPostSeed[] = [
  {
    id: "journal_miswak_sunnah",
    title: "The Miswak: A Fourteen-Century Habit That Modern Dentistry Is Still Catching Up To",
    slug: "miswak-fourteen-century-habit",
    excerpt:
      "Long before the toothbrush existed, the Prophet ﷺ reached for a twig from the Arak tree. The story of the miswak is a story of how a small, daily act became one of the most enduring sunan in Islamic life.",
    content: `<p>In a quiet corner of seventh-century Madinah, a small ritual repeated itself before nearly every prayer. The Prophet Muhammad ﷺ would reach for a thin, fibrous twig — soft at one end, freshly chewed into a brush — and clean his teeth. He did this so often, and spoke of it so highly, that his companions began to wonder whether it would be made obligatory before every prayer, were it not for the hardship it might place on the wider community.</p>

<p>This twig was the miswak, cut from the roots or branches of the Arak tree (Salvadora persica), a hardy shrub native to the dry soils of Arabia and parts of Africa and Asia. To the untrained eye, it looks unremarkable. But within its fibers lies a chemistry that nineteenth and twentieth-century dentistry would spend over a hundred years rediscovering.</p>

<h2>A Habit Older Than the Toothbrush</h2>

<p>The history of dental hygiene in Arabia predates Islam itself. Pre-Islamic Arabs already used chewing sticks from various trees, understanding instinctively that the bitter, slightly astringent taste of these woods left the mouth feeling cleaner. But it was the Prophet ﷺ who elevated the practice from cultural habit to spiritual discipline, weaving it into the rhythm of worship itself.</p>

<p>He is reported to have used the miswak upon waking, before prayer, before entering his home, and before reciting Qur'an. It was not treated as a chore but as an act of refinement — a way of presenting oneself, in cleanliness and dignity, before standing in prayer.</p>

<h2>What the Twig Actually Does</h2>

<p>Modern phytochemical studies on Salvadora persica have identified a striking list of active compounds: trimethylamine, salvadorine, tannins, saponins, flavonoids, and naturally occurring fluoride and silica. Together, these give the miswak antibacterial, anti-plaque, and mild whitening properties — without a drop of synthetic chemical involved.</p>

<p>The fibrous bristles, formed simply by chewing the tip until it splays, work mechanically much like a toothbrush, while the wood itself releases compounds shown in clinical studies to inhibit the bacteria most responsible for cavities and gum disease. In 2003, the World Health Organization formally recommended the miswak as an effective oral hygiene tool, a quiet but significant endorsement of a fourteen-century-old practice.</p>

<h2>A Practice That Still Travels With Us</h2>

<p>Today, the miswak sits in an unusual position: simultaneously ancient and strikingly relevant. As more people search for natural, plastic-free alternatives to conventional dental products, this small stick — requiring no packaging, no synthetic bristles, no chemical paste — offers something genuinely sustainable.</p>

<p>For many Muslims, though, its value goes beyond hygiene or environmental conscience. To carry a miswak is to carry forward a habit the Prophet ﷺ himself never let go of — a small, repeated act of care that connects the most ordinary moment of a daily routine to the example of a man who lived fourteen hundred years ago, and whose smallest habits still shape lives today.</p>

<p>It is, in the end, a reminder that the Sunnah is not only found in grand acts of worship. Sometimes it is found in a twig, chewed soft, and the discipline of returning to it five times a day.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&q=80",
    imagePublicId: null,
    category: "HERITAGE",
    status: "PUBLISHED",
    readTimeMinutes: 6,
    tags: ["sunnah", "miswak", "prophetic-medicine", "oral-care"],
    seoTitle: "The Miswak: A Fourteen-Century Sunnah of Oral Care | OurSunnah Journal",
    seoDescription:
      "The story of the miswak — a Prophetic sunnah that modern dentistry is only now beginning to scientifically validate.",
  },

  {
    id: "journal_attar_history",
    title: "Attar: How the Islamic World Perfected the Art of Scent Without a Drop of Alcohol",
    slug: "attar-art-of-scent-islamic-world",
    excerpt:
      "From the distillation labs of Abbasid Baghdad to the rose fields of Ta'if, attar is more than fragrance — it is one of the Islamic world's quietest, most enduring contributions to global craft.",
    content: `<p>Somewhere in ninth-century Baghdad, in a city that had become the intellectual capital of the known world, a physician and polymath named Al-Kindi sat over glass apparatus, distilling rose petals into something new. He was not simply making perfume. He was, in effect, laying the scientific foundation for an entire industry — one that would travel from Persia to Damascus, from Ta'if to Lucknow, and remain, over a thousand years later, deeply woven into Islamic tradition.</p>

<p>The result of that distillation process is what we now call attar: a concentrated, alcohol-free fragrance oil, traditionally extracted through steam distillation and aged in sandalwood barrels for months or even years.</p>

<h2>Why Alcohol-Free Mattered</h2>

<p>In a religious tradition that discourages the consumption and, according to many scholars, the use of alcohol on the body before prayer, attar solved a practical problem with elegant precision. Long before "alcohol-free" became a marketing term in the modern fragrance industry, Muslim chemists had already built an entire perfumery tradition around oil-based extraction — a method that, as it turns out, produces a richer, longer-lasting scent than alcohol-based sprays ever could.</p>

<p>The Prophet ﷺ himself is widely reported to have loved fragrance, reportedly saying that among the things made beloved to him in this world were women, and the comfort of his eye was made in prayer — but before that, in many narrations, scent is mentioned as something he treasured and encouraged others to use, especially before Friday prayers and gatherings.</p>

<h2>The Geography of a Scent</h2>

<p>Attar production became deeply tied to place. The damask roses of Ta'if, grown in the cool highlands of the Hijaz, produced a rose attar so prized that it remains, even today, one of the most expensive natural fragrances in the world — it can take thousands of hand-picked petals to produce a single gram of oil. Oud, distilled from the resin-infused heartwood of the agarwood tree across South and Southeast Asia, became the signature scent of the wider Islamic world, prized in royal courts from Damascus to Delhi.</p>

<p>Each region developed its own signature: musk from Tibet and Central Asia, traded along the Silk Road; ambergris collected from the shores of the Arabian Sea; saffron-infused oils from Persia. Trade routes that carried silk and spices carried scent with equal value, and Muslim merchants became the primary conduit through which these fragrances reached Europe, where the word "attar" itself entered language via Persian and Arabic roots related to fragrance and perfume.</p>

<h2>A Living Tradition</h2>

<p>What makes attar remarkable is not just its chemistry or its history, but its persistence. Unlike many ancient crafts that faded with industrialization, attar production survives largely unchanged in places like Kannauj, India — sometimes called the perfume capital of India — where families have practiced the same deg-bhapka distillation method for generations, the same slow extraction process that would have been recognizable to a perfumer in Abbasid Baghdad.</p>

<p>To wear attar today is to participate in a craft that predates the modern perfume industry by over a thousand years — one built not around chemical synthesis, but around patience: petals pressed slowly into oil, oil aged slowly in wood, and a fragrance that, true to its origins, lasts on the skin not for hours, but for the better part of a day.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80",
    imagePublicId: null,
    category: "CRAFTMANSHIP",
    status: "PUBLISHED",
    readTimeMinutes: 7,
    tags: ["attar", "perfume", "oud", "islamic-history", "craftsmanship"],
    seoTitle: "Attar: The Islamic World's Alcohol-Free Art of Perfume | OurSunnah Journal",
    seoDescription:
      "How attar — alcohol-free, oil-based fragrance — became one of the Islamic world's most enduring crafts, from Abbasid Baghdad to today.",
  },

  {
    id: "journal_house_of_wisdom",
    title: "Bayt al-Hikmah: Inside the House of Wisdom That Lit the Dark Ages",
    slug: "bayt-al-hikmah-house-of-wisdom",
    excerpt:
      "While much of Europe slept through what historians once called the Dark Ages, a library in Baghdad was busy translating, preserving, and advancing the entire intellectual inheritance of the ancient world.",
    content: `<p>In the early ninth century, the Abbasid Caliph Harun al-Rashid, and later his son Al-Ma'mun, presided over a city that had become something unprecedented: a magnet for the world's knowledge. At its heart stood an institution whose name still echoes through the history of science — Bayt al-Hikmah, the House of Wisdom.</p>

<p>It is tempting, in hindsight, to imagine it as a single grand building, a kind of medieval university campus. The reality was both more modest and more remarkable: a library, a translation academy, and an observatory, staffed by scholars of every background the empire touched — Muslim, Christian, Jewish, and Sabian, writing in Arabic, Greek, Persian, and Syriac, working side by side on a single shared project: the recovery and advancement of human knowledge.</p>

<h2>The Great Translation Movement</h2>

<p>Al-Ma'mun is said to have sent emissaries to Constantinople specifically to acquire Greek manuscripts — the works of Aristotle, Ptolemy, Euclid, and Galen — for translation into Arabic. Scholars like Hunayn ibn Ishaq, a Christian physician fluent in Greek, Syriac, and Arabic, became central figures in this effort, reportedly paid in gold equal to the weight of the books he translated.</p>

<p>This was not passive preservation. Translators corrected errors in the original Greek texts, cross-referenced multiple manuscript traditions, and in many cases extended the original work with new findings. Mathematics absorbed Indian numerals and the concept of zero, which Muslim scholars refined into the decimal system the entire world now uses. Al-Khwarizmi, working in this environment, wrote the treatise that gave us the word "algebra" — itself derived from the Arabic al-jabr.</p>

<h2>Science as Worship</h2>

<p>For many of these scholars, the pursuit of knowledge was inseparable from faith. The Qur'an's repeated invitations to observe, reflect, and reason about the natural world were taken, quite literally, as a mandate for inquiry. Astronomers calculated prayer times and the direction of the Qibla with increasing precision, driving advances in trigonometry and spherical geometry. Physicians like Al-Razi and Ibn Sina (known in the West as Avicenna) built on Greek medical traditions while pioneering clinical observation methods that would influence European medicine for the next six hundred years.</p>

<h2>A Light That Reached Europe</h2>

<p>When the House of Wisdom's manuscripts eventually made their way — through Muslim Spain, through Sicily, through the Crusades — into European hands, they did not arrive as forgotten ancient texts. They arrived enriched: annotated, corrected, expanded, and accompanied by entirely new fields of mathematics and science that the Islamic world had developed independently. The translation of Arabic scientific texts into Latin, beginning in earnest in the twelfth century, became one of the direct catalysts for what historians now call the European Renaissance.</p>

<p>The House of Wisdom itself was destroyed in 1258, when Mongol forces sacked Baghdad — so thoroughly that, according to later chroniclers, the Tigris ran black with ink from the manuscripts thrown into its waters. But the knowledge it had spent four centuries gathering, translating, and advancing had already spread far beyond any single building's walls, into the universities of Europe and, eventually, into the foundations of the modern world.</p>

<p>It remains, to this day, one of history's clearest reminders that the pursuit of knowledge was never separate from the Islamic tradition — it was, for centuries, one of its defining expressions.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
    imagePublicId: null,
    category: "HERITAGE",
    status: "PUBLISHED",
    readTimeMinutes: 8,
    tags: ["islamic-golden-age", "history", "bayt-al-hikmah", "knowledge"],
    seoTitle: "Bayt al-Hikmah: The House of Wisdom That Shaped the Modern World | OurSunnah Journal",
    seoDescription:
      "Inside Baghdad's House of Wisdom — the Abbasid institution that preserved, translated, and advanced the world's knowledge during Europe's so-called Dark Ages.",
  },

  {
    id: "journal_geometry_of_faith",
    title: "The Geometry of Faith: Why Islamic Art Never Drew a Face",
    slug: "geometry-of-faith-islamic-art",
    excerpt:
      "Walk into any great mosque and you will find no portraits, no statues — only pattern, repeated infinitely. This is not a limitation. It is one of the most sophisticated visual languages humanity has ever built.",
    content: `<p>Step beneath the dome of the Alhambra, or trace the tilework lining the walls of Isfahan's Shah Mosque, and a single observation will eventually surface: there are no faces here. No painted prophets, no carved figures, no portraits of rulers gazing down from the walls. Instead, there is pattern — interlocking stars, endless geometric lattices, calligraphy curling through arabesque vines — repeating, expanding, and folding into infinity.</p>

<p>This was never an accident of taste. It was a deliberate, theological choice, and understanding why reveals one of the most intellectually rich visual traditions in human history.</p>

<h2>The Question of Representation</h2>

<p>Islamic tradition holds a strong caution against the depiction of living beings, particularly in religious or sacred contexts, rooted in concern over idolatry — the same concern that runs through earlier Abrahamic traditions. Early Muslim scholars, interpreting hadith warnings against image-makers who would be asked on the Day of Judgment to breathe life into their creations, largely steered religious art away from figurative representation entirely.</p>

<p>But rather than treating this as a creative restriction, Muslim artists, architects, and mathematicians turned it into an opportunity. If the human form could not anchor sacred art, then perhaps something more universal could: pattern itself, drawn directly from the underlying mathematical order Muslims understood the entire created universe to reflect.</p>

<h2>Pattern as Theology</h2>

<p>The geometric patterns that fill mosques across the Islamic world — from Córdoba to Samarkand — are not merely decorative. They are constructed using compass and straightedge from a small set of base shapes: the circle, the square, and the polygons that can be drawn within them. From these simple beginnings, artisans built breathtakingly complex tessellations that, mathematically, can extend infinitely in every direction.</p>

<p>This was the point. A pattern with no beginning and no end, repeating outward indefinitely, became a visual meditation on tawhid — the oneness and infinite nature of God. Unlike a portrait, which fixes the eye on a single, finite human form, geometric pattern draws the eye continuously outward, refusing to let attention settle anywhere but in contemplation of the whole.</p>

<h2>The Mathematics Behind the Beauty</h2>

<p>The sophistication here was not merely artistic. Islamic geometric design anticipated mathematical concepts that Western mathematics would not formally articulate for centuries. Research published in Science in 2007 revealed that medieval Islamic architects, including those who designed the Darb-i Imam shrine in Isfahan in 1453, were using a tiling method mathematically equivalent to Penrose tiles — a form of quasi-crystalline, never-repeating pattern that Western mathematicians only discovered in the 1970s.</p>

<p>Alongside geometry, calligraphy flourished as the other great pillar of Islamic visual art — Qur'anic verses transformed into flowing, architectural script, turning the words of revelation themselves into the central visual feature of sacred spaces. Arabesque, the third pillar, wove plant-like vines and tendrils into rhythmic, repeating motifs, completing a visual language built entirely on pattern, line, and word.</p>

<h2>A Tradition Still Unfolding</h2>

<p>Today, this geometric language extends far beyond mosque walls — into textiles, ceramics, architecture, and increasingly, contemporary design. What began as a theological response to a religious caution became, over centuries, one of the most mathematically rigorous and visually distinctive art traditions in the world — proof that a constraint, approached with enough depth and devotion, can produce not less beauty, but an entirely new register of it.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1200&q=80",
    imagePublicId: null,
    category: "CULTURE",
    status: "PUBLISHED",
    readTimeMinutes: 7,
    tags: ["islamic-art", "geometry", "calligraphy", "architecture"],
    seoTitle: "The Geometry of Faith: Why Islamic Art Never Drew a Face | OurSunnah Journal",
    seoDescription:
      "Why Islamic art turned to infinite geometric pattern instead of figurative representation — and how it anticipated mathematics the West wouldn't discover for centuries.",
  },

  {
    id: "journal_ramadan_lantern",
    title: "The Fanous: How a Tenth-Century Welcome Lantern Became the Symbol of Ramadan",
    slug: "fanous-ramadan-lantern-history",
    excerpt:
      "Before electric lights lined city streets, a single brass lantern carried by children through the streets of Cairo announced the arrival of a Caliph — and, by accident, lit the way to one of Ramadan's most beloved traditions.",
    content: `<p>On a night in the year 969 CE, the streets of Fustat — old Cairo — filled with people carrying lit lanterns, walking out to greet the arrival of the Fatimid Caliph Al-Mu'izz li-Din Allah, who entered the city during the holy month of Ramadan. Historical accounts describe thousands of these lanterns lighting the night, transforming the Caliph's procession into a river of flickering light.</p>

<p>That lantern — the fanous, from a Greek word meaning "torch" or "light" — would go on to outlive the dynasty that introduced it, becoming one of the most recognizable and beloved symbols of Ramadan across the Muslim world, particularly in Egypt and the broader Levant.</p>

<h2>From Royal Welcome to Children's Tradition</h2>

<p>Several stories attempt to explain exactly how the fanous transitioned from a ceremonial welcome into a Ramadan custom. One widely repeated account holds that the same Fatimid Caliph later ordered mosque attendants and street officials to carry lanterns to light the way for worshippers walking to taraweeh prayers in the dark — a practical solution that became a beloved nightly ritual.</p>

<p>Another tradition describes Cairo's children carrying lanterns through the streets to greet the start of the new lunar month, singing simple songs as they searched the sky for the Ramadan crescent. Over generations, this evolved into a beloved custom of its own: children carrying lanterns from house to house, singing traditional Ramadan songs in exchange for sweets — a tradition still alive in Egypt today, echoing customs found in many cultures around shared seasonal celebration.</p>

<h2>A Craft Passed Through Generations</h2>

<p>For centuries, fanous lanterns were handcrafted from tin and colored glass by artisans concentrated in specific quarters of old Cairo, particularly around the historic Sayyida Zeinab district. Craftsmen would solder thin sheets of metal into intricate geometric frames, fitting them with colored glass panels that scattered warm, fractured light onto the streets below — a tradition of metalwork that drew on the same geometric sensibilities found throughout Islamic architecture and design.</p>

<p>Each region developed its own stylistic signature. Egyptian fanous tended toward tall, narrow silhouettes with elaborate cut-metal patterns; lanterns from the Levant often favored more compact, dome-topped designs. By the early twentieth century, the fanous had become so deeply associated with Ramadan that its absence from a household's preparation for the month would have seemed almost unthinkable.</p>

<h2>Light as Meaning</h2>

<p>The fanous endures not simply as decoration, but as something closer to a small, physical expression of what Ramadan itself represents: light entering a period otherwise marked by restraint, hunger, and quiet reflection. The soft glow of a fanous hanging in a window or carried through a darkened street mirrors the spiritual idea at the heart of the month — that discipline and light are not opposites, but companions.</p>

<p>Today, the fanous has adapted to modern materials — plastic, battery-powered LED versions now sit alongside traditional handcrafted tin lanterns in markets from Cairo to Kuala Lumpur — but the symbolism has remained remarkably stable across more than a thousand years. A small light, carried through darkness, announcing that something sacred has arrived.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=1200&q=80",
    imagePublicId: null,
    category: "CULTURE",
    status: "PUBLISHED",
    readTimeMinutes: 6,
    hijriMonth: "Ramadan",
    tags: ["ramadan", "fanous", "tradition", "egypt", "history"],
    seoTitle: "The Fanous: The Thousand-Year History of the Ramadan Lantern | OurSunnah Journal",
    seoDescription:
      "From a tenth-century Caliph's welcome procession to a beloved Ramadan tradition — the story of the fanous, Islam's iconic lantern.",
  },
];

export default JOURNAL_POST_SEED_DATA;
