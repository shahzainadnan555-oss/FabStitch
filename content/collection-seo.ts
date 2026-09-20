/**
 * Long-form SEO enrichment for existing collection routes.
 * Keeps /collections/{slug}/ as the canonical fibre destination.
 */

export type CollectionSeoSection = {
  heading: string;
  body: string;
};

export type CollectionSeoEnrichment = {
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  sections: readonly CollectionSeoSection[];
  relatedPaths: readonly { href: string; label: string }[];
  faqs?: readonly { question: string; answer: string }[];
};

export const COLLECTION_SEO_BY_SLUG: Partial<
  Record<string, CollectionSeoEnrichment>
> = {
  cotton: {
    seoTitle: "Cotton Fabric for Clothing & Apparel",
    seoDescription:
      "Explore cotton fabric for shirts, dresses and apparel. Compare woven cotton constructions, composition and documented uses, then inquire on FabStitch.",
    primaryKeyword: "cotton fabric",
    sections: [
      {
        heading: "What cotton fabric means for buyers",
        body: "Cotton fabric is cloth made from cotton fibre — woven as poplin, voile, seersucker and other constructions, or knitted when the product record says so. Softness, thickness and drape come from yarn and structure, not from the fibre name alone.",
      },
      {
        heading: "Cotton for shirts, dresses and apparel",
        body: "Cotton shirt fabric and cotton dress fabric briefs need different hands. Crisp plains suit structured shirts; softer or more open cottons may suit dresses. Browse shirts and dresses Best For edits when the garment is fixed, and use this collection when cotton is the starting point.",
      },
      {
        heading: "Woven cotton, prints and by-the-yard inquiry",
        body: "FabStitch cotton entries keep published composition and construction visible. Inquire with metres and garment context. A printed or embroidered cotton only counts as printed when that named fabric says so. A photograph of a colour is not a print claim.",
      },
      {
        heading: "Plain cotton weaves are not interchangeable",
        body: "Poplin, lawn, voile, organdy, broadcloth, oxford, and seersucker can all be cotton and still make different shirts. Poplin and broadcloth hold a collar. Lawn and batiste are finer. Voile and organdy are more open, so a dress in those cloths usually needs a lining decision. Oxford and chambray show a coloured warp or a basket surface. Seersucker and crinkle cotton put puckering in the yarn or the finish. Read the construction cell before you treat two cottons as the same cloth.",
      },
      {
        heading: "Knitted cotton is a separate brief",
        body: "Jersey, interlock, rib, piqué, and fleece in this collection are knits. Jersey stretches across the course and can curl at a cut edge. Interlock is usually more stable and more opaque at a similar fibre. Piqué has a raised surface associated with polo-weight cloth. None of those behaviours belong on a woven poplin. If the page says woven, do not assume recovery. If it says knit, do not assume a crisp collar without interlining.",
      },
      {
        heading: "What a cotton inquiry should name",
        body: "Name the fabric URL, the construction you actually read, the garment, and the metres. Leave GSM blank when the page does not publish it. Do not write organic, combed, Pima, or Egyptian onto a different cotton. Those words appear only on the fabrics that use them, such as organic cotton lawn, Pima cotton jersey, or Egyptian cotton poplin. A certificate such as GOTS is not implied by the word cotton, and this collection does not publish one.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/shirt-fabric/", label: "Shirt fabric guide" },
      { href: "/fabrics/dress-fabric/", label: "Dress fabric guide" },
      {
        href: "/guides/what-is-cotton-fabric/",
        label: "What is cotton fabric?",
      },
      { href: "/guides/fabric-weight-and-gsm/", label: "Fabric weight & GSM" },
      { href: "/wholesale-fabric/", label: "Wholesale fabric" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
    faqs: [
      {
        question: "Where can I buy cotton fabric on FabStitch?",
        answer:
          "Browse this cotton collection, open a named fabric page for specs, then inquire with quantity. You can also search the marketplace filtered toward cotton constructions.",
      },
    ],
  },
  "linen-lightweight": {
    seoTitle: "Linen Fabric for Clothing & Apparel",
    seoDescription:
      "Explore linen fabric and linen blends for clothing and dresses. Compare composition, weight and character, then inquire on FabStitch.",
    primaryKeyword: "linen fabric",
    sections: [
      {
        heading: "Linen fabric for apparel",
        body: "Linen fabric is valued for breathability and a distinctive hand in warm-weather clothing. Pure linen and linen blends (cotton, silk, viscose, lyocell) behave differently — read the published composition on each FabStitch record.",
      },
      {
        heading: "Lightweight linen and dress or shirt programmes",
        body: "Lightweight linen fabric suits shirts, dresses and relaxed apparel when crease behaviour fits the brief. Linen dress fabric and linen shirt directions should still be confirmed against Best For documentation on product pages.",
      },
      {
        heading: "Natural linen and blends by the metre",
        body: "Inquire with the fabric name and the metres. A linen–cotton, linen–silk, linen–viscose, or linen–lyocell page is a blend. Do not rewrite it as 100% linen in the brief. Lyocell and Tencel plains in this same collection are a different fibre family. They can sit beside linen in a lightweight programme, but they are not flax.",
      },
      {
        heading: "Why linen creases and feels dry",
        body: "Flax yarns are less even than most cotton yarns, so linen often shows slub and takes a crease where poplin stays smooth. That crease is the fibre unless the page describes a washed or blended cloth. Breathability here means an open, irregular surface, not a test report. A heavy linen canvas can feel warmer than a cotton voile even though both are plant fibres.",
      },
      {
        heading: "Shirt, dress, and trouser choices",
        body: "A clean shirt brief usually compares European flax linen with cotton poplin or oxford, using the cotton-versus-linen guide when the hand is the open question. A dress that needs movement is closer to linen–silk than to a dry plain linen. Trousers in linen will mark at the knee. Say whether that crease is acceptable. Heavier linen for upholstery is in the home collection, not in this lightweight edit.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/dress-fabric/", label: "Dress fabric guide" },
      { href: "/fabrics/shirt-fabric/", label: "Shirt fabric guide" },
      { href: "/guides/linen-fabrics-2027/", label: "Linen fabrics 2027" },
      { href: "/guides/cotton-vs-linen/", label: "Cotton vs linen" },
      {
        href: "/guides/lightweight-fabric/",
        label: "Lightweight fabric guide",
      },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "silk-sheer": {
    seoTitle: "Silk Fabric for Apparel & Occasionwear",
    seoDescription:
      "Explore silk fabric types — chiffon, georgette, organza and crepe. Compare composition and character for apparel, then inquire on FabStitch.",
    primaryKeyword: "silk fabric",
    sections: [
      {
        heading: "What silk fabric is",
        body: "Silk fabric is cloth made with silk fibre as documented on the product page. Sheer chiffon, crinkled georgette, crisp organza and fluid crepe are different tools — not interchangeable “silk.”",
      },
      {
        heading: "Silk apparel and dress or shirt uses",
        body: "Silk clothing fabric suits layered dresses, occasion looks and some fluid shirts when opacity and drape match the silhouette. Satin-like behaviour only applies when the named construction supports it; satin is not automatically silk.",
      },
      {
        heading: "Buying silk by the yard on FabStitch",
        body: "Open one named silk fabric, read composition and construction together, then inquire with metres and the garment. Sheer chiffon and a silk satin are not substitutes. Polyester chiffon in this collection uses the chiffon construction without the silk fibre. Read the composition line before you write “silk” on the inquiry.",
      },
      {
        heading: "Chiffon, georgette, organza, and crepe",
        body: "Silk chiffon is a light, floating plain weave and is usually translucent. Georgette is crisper and more crepe-like, so it hangs with more movement and less cling. Organza is crisp and holds a shape. Crepe de chine hangs closer to the body and is generally more opaque than chiffon. Taffeta rustles and holds volume. Habotai and silk twill are smoother, tighter cloths. Pick the construction for the silhouette, then check whether a lining is required.",
      },
      {
        heading: "Satin is a weave, not a proof of silk",
        body: "Silk satin and silk charmeuse are silk fibres in a float weave, which is why the surface looks lustrous. A lustrous polyester is not silk. The silk-versus-satin guide separates those words. Opacity, weight, and slip still come from the named fabric, not from the word satin.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/dress-fabric/", label: "Dress fabric guide" },
      { href: "/guides/chiffon-vs-georgette/", label: "Chiffon vs georgette" },
      { href: "/guides/silk-vs-satin/", label: "Silk vs satin" },
      { href: "/fabrics/clothing/", label: "Clothing fabric hub" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
    faqs: [
      {
        question: "Is satin a type of silk?",
        answer:
          "Satin describes a weave/structure family; silk describes a fibre. Some satins use silk, others do not. Check composition on the fabric page.",
      },
    ],
  },
  denim: {
    seoTitle: "Denim Fabric for Jeans & Apparel",
    seoDescription:
      "Explore denim fabric for jeans and apparel. Compare weight units, composition and constructions, then inquire on FabStitch.",
    primaryKeyword: "denim fabric",
    sections: [
      {
        heading: "What denim fabric is",
        body: "Denim is a woven fabric traditionally associated with jeans and workwear. Composition is stated per product — often cotton or cotton blends — and weight may use ounces per square yard rather than GSM.",
      },
      {
        heading: "Denim for jeans and clothing",
        body: "Denim fabric for jeans and broader apparel spans lightweight to heavier documented ranges. Recycled, hemp-cotton and selvedge directions appear as separate named fabrics when published — not as invented grades.",
      },
      {
        heading: "Where to buy denim fabric on FabStitch",
        body: "Browse the named denims, open the page that matches the weight language you need, and inquire with metres and the garment. This collection does not publish a mill, a country of weaving, or a price per kilogram. Wholesale language belongs on the wholesale page. The cloth still has to be one of these denim URLs.",
      },
      {
        heading: "Twill, ounces, and why denim is not just heavy cotton",
        body: "Denim is a twill, usually with a coloured warp and a lighter weft, which is why the face and the back can look different. That structure is not the same as cotton poplin or cotton canvas. Weight on these pages may be stated in ounces per square yard rather than GSM. Do not convert ounces into grams on the brief unless you and the supplier have agreed the conversion. Lightweight denim and selvedge rigid denim answer different jeans. Recycled-cotton denim and hemp–cotton denim are separate compositions. Read the page. Do not apply one fibre claim to the whole collection.",
      },
      {
        heading: "What a denim buyer should confirm",
        body: "Confirm composition, the published weight unit, and whether the cloth is rigid or has stretch if the page says so. Shrinkage, shade, and finish are not filled in here when the fabric page is silent. Laser- and ozone-finished denim is one named cloth, not a finish available on every denim in the edit. Workwear and trouser uses are documented per fabric, not guaranteed by the word denim.",
      },
    ],
    relatedPaths: [
      { href: "/guides/denim-2027/", label: "Denim 2027 guide" },
      { href: "/guides/fabric-weight-and-gsm/", label: "Fabric weight & GSM" },
      { href: "/guides/woven-vs-knit-fabrics/", label: "Woven vs knit" },
      { href: "/wholesale-fabric/", label: "Wholesale fabric" },
      { href: "/fabrics/clothing/", label: "Clothing fabric hub" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
    faqs: [
      {
        question: "What is denim made of?",
        answer:
          "Denim composition is listed on each fabric page. Many denims use cotton or cotton blends; FabStitch does not invent fibre content from the word denim alone.",
      },
    ],
  },
  tailoring: {
    seoTitle: "Suiting and Tailoring Fabric Notes",
    seoDescription:
      "Compare wool, wool-silk, and open wool-linen cloth for jackets and suiting. Read construction and published weight, then inquire on one fabric.",
    primaryKeyword: "tailoring fabric",
    sections: [
      {
        heading: "What changes a suiting cloth",
        body: "A tailoring fabric has to hold a shoulder, a lapel, or a trouser crease for the silhouette you want. Wool is common in this collection, but wool–silk, wool–linen, wool–mohair, tropical wool, and wool-cotton twill are not the same hand. An open weave drapes and breathes more than a dense flannel or a boiled wool. Bi-stretch and Roica-containing cloths add recovery. Read the composition. Do not write “wool suit” on a wool-polyester page.",
      },
      {
        heading: "Unstructured jackets versus a harder shoulder",
        body: "Open wool-linen and fresco-like mohair blends suit a softer jacket. Tropical wool in a lighter construction suits a warm-weather suit. Melton blends and brushed alpaca sit toward coating and cooler tailoring. The Best For tailoring edit groups documented uses. It does not mean every cloth in this collection will tailor a structured suit without canvas.",
      },
      {
        heading: "What to ask before a tailoring order",
        body: "Confirm fibre, weave, and any published weight. Width, shrinkage, and fusing behaviour are not invented here. Super 110s–130s on the tropical wool page is that cloth’s yarn language, not a grade for the whole collection. Price per metre and minimums stay in the inquiry.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/best-for/tailoring/", label: "Fabrics for tailoring" },
      { href: "/fabrics/wool-fabric/", label: "Wool fabric" },
      {
        href: "/guides/fabric-weight-and-gsm/",
        label: "Fabric weight and GSM",
      },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  knitwear: {
    seoTitle: "Knitwear, Jersey and French Terry",
    seoDescription:
      "Compare pointelle, French terry, ponte, and merino knits. Read gauge and fibre on the fabric page before you treat two knits as the same cloth.",
    primaryKeyword: "knitted fabric",
    sections: [
      {
        heading: "A knit is a loop structure, not a fibre",
        body: "Jersey, interlock, rib, French terry, ponte, pointelle, and bouclé can be cotton, merino, modal, or a blend. The loop is what stretches, curls, or shows an open stitch. French terry has loops on the back and a smoother face, which is why it is used for sweatshirts when the weight supports it. Ponte is a double knit and usually more stable than a single jersey. Pointelle and crochet-effect knits are open on purpose. Do not line a sweatshirt brief with a pointelle.",
      },
      {
        heading: "Gauge, hand, and what “lightweight knit” leaves out",
        body: "Fine-gauge and lightweight merino pages describe that cloth. They do not set a GSM for every knit in the collection. A heavyweight French terry and an ultra-open pointelle can both be knits and fail each other’s garments. If gauge or micron is published, copy that figure. If it is blank, leave it blank.",
      },
      {
        heading: "How to shortlist a knit",
        body: "Start from the garment on the knitwear or activewear Best For page when the end use is fixed. Start here when you already want a knitted construction. Name one fabric URL in the inquiry. Related woven collections do not describe recovery or curl.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/best-for/knitwear/", label: "Fabrics for knitwear" },
      { href: "/guides/woven-vs-knit-fabrics/", label: "Woven versus knit" },
      { href: "/collections/cotton/", label: "Cotton fabrics" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  performance: {
    seoTitle: "Activewear Performance Cloth Notes",
    seoDescription:
      "Read stretch-woven, swim, and cooling cloths for activewear. Published construction is the spec. This page does not promise moisture-wicking tests.",
    primaryKeyword: "performance fabric",
    sections: [
      {
        heading: "Performance is a construction claim, not a medal",
        body: "This collection holds stretch-woven compression, crossover swimwear cloth, a cooling construction, an ultra-light lounge knit, and retro sportif knits. Those are different tools. Compression cloth is for next-to-skin layers when the page says so. Swim cloth has to survive water and chlorine or salt only to the extent the fabric page states. A cooling construction is not the same sentence as “breathable cotton.”",
      },
      {
        heading: "Stretch, recovery, and what to verify",
        body: "Four-way stretch, wicking, UV, or water resistance belong in the brief only when the fabric page states them. This collection does not publish a test method, an OEKO-TEX number, or a moisture-management score. Ask for the test you need in the inquiry, and do not copy a performance word from one cloth onto the next.",
      },
      {
        heading: "Where activewear briefs should start",
        body: "Use the activewear Best For page when the garment is a baselayer, a swim piece, or city-active wear. Use this collection when the performance construction is the starting point. Then open one named fabric. Mesh, piqué, and rib in the retro sportif direction are surface and structure choices, not proof of a waterproof finish.",
      },
    ],
    relatedPaths: [
      {
        href: "/fabrics/best-for/activewear/",
        label: "Fabrics for activewear",
      },
      { href: "/guides/woven-vs-knit-fabrics/", label: "Woven versus knit" },
      { href: "/fabric-sourcing/", label: "Fabric sourcing" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "aw-textures": {
    seoTitle: "Heavy Wool and Brushed Cloth Notes",
    seoDescription:
      "Compare melton, boiled wool, flannel, moleskin, and coating cloth. Weight and surface differ by fabric. No universal coat GSM is published here.",
    primaryKeyword: "coating fabric",
    sections: [
      {
        heading: "Coating cloth is about cover and surface",
        body: "Melton, boiled wool, double-face wool, and Casentino are dense, fulled, or faced wools used when a coat needs cover. Brushed flannel is softer and usually lighter in hand. Mohair and alpaca blends add hair and lustre. Moleskin and peach-skin are cotton or woven surfaces with a dry or sueded hand. They are not wool coatings. Real suede and leather in this collection are skins, not woven wool. Read the composition before you specify interlining or care.",
      },
      {
        heading: "Do not borrow one cloth’s weight",
        body: "A boiled wool and a brushed flannel can sit in the same seasonal edit and still be wrong for each other’s pattern. Use the published weight unit on that fabric page. If GSM is absent, do not invent a coat weight from the collection title.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/best-for/outerwear/", label: "Fabrics for outerwear" },
      { href: "/collections/tailoring/", label: "Tailoring fabrics" },
      {
        href: "/guides/fabric-weight-and-gsm/",
        label: "Fabric weight and GSM",
      },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "velvet-pile": {
    seoTitle: "Velvet, Corduroy and Pile Fabrics",
    seoDescription:
      "Compare corduroy wale, velveteen, and silk-viscose velvet. Pile direction and fibre are on the fabric page, not in the collection title.",
    primaryKeyword: "velvet fabric",
    sections: [
      {
        heading: "Pile has a direction",
        body: "Velvet, velveteen, and corduroy stand off the ground weave. Light catches the pile, so garments can look lighter or darker depending on how the pieces are cut. Fine-wale and jumbo corduroy differ in rib width. Cotton velveteen is cotton. Silk–viscose velvet is a blend. Crushed velvet and panné velvet are surface treatments of pile, not a second fibre. Do not specify “silk velvet” unless the composition says silk.",
      },
      {
        heading: "Where pile cloth is used",
        body: "Corduroy is often a trouser or jacket cloth. Silk-viscose velvet is more often occasionwear. Upholstery pile, if you need it, belongs with home textiles unless this fabric’s uses say otherwise. Nap, crush, and care are confirmed from the fabric page or the inquiry, not from the word velvet.",
      },
    ],
    relatedPaths: [
      {
        href: "/fabrics/best-for/occasionwear/",
        label: "Occasionwear fabrics",
      },
      { href: "/collections/silk-sheer/", label: "Silk fabrics" },
      { href: "/fabrics/best-for/trousers/", label: "Fabrics for trousers" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "structured-classics": {
    seoTitle: "Tweed, Gabardine and Classic Cloth",
    seoDescription:
      "Read tweed, tartan, gabardine, and jacquard as separate cloths. A classic look is not one weave, and membrane-backed pages say so.",
    primaryKeyword: "tweed fabric",
    sections: [
      {
        heading: "Classic does not mean one weave",
        body: "Herringbone and Donegal tweed show colour and texture in the yarn. Tartan and check are patterns. Gabardine and covert are tighter twills. A membrane-backed gabardine or covert adds a layer the plain weave does not have. Jacquard and damask in this edit are described as deconstructed, so read that fabric before you expect a formal interior cloth. Pattern scale and backing change the garment more than the collection name.",
      },
      {
        heading: "What to check on a patterned cloth",
        body: "Confirm fibre and whether a membrane is part of that product. Repeat size, shrinkage, and waterproof claims are not filled in by this page. A tartan and a herringbone can share a wool story and still be the wrong match for the same jacket.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/best-for/tailoring/", label: "Fabrics for tailoring" },
      {
        href: "/collections/technical-outerwear/",
        label: "Technical outerwear",
      },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "technical-outerwear": {
    seoTitle: "Reading Technical Outerwear Cloth",
    seoDescription:
      "Compare ripstop, membrane laminates, and wool-technical hybrids. Layer counts are per fabric. This page does not claim a waterproof rating.",
    primaryKeyword: "technical outerwear fabric",
    sections: [
      {
        heading: "Layer language has to match the fabric page",
        body: "Recycled nylon ripstop is a face cloth. A 2-layer, 2.5-layer, or 3-layer membrane laminate is a different build: more layers usually mean a face, a membrane, and sometimes a backer, but only the named page tells you which. Wool–technical hybrid cloth mixes a wool face with a technical element. Down-alternative fill and recycled polyester wadding are insulation, not shell fabrics. Do not specify a jacket shell with a wadding page.",
      },
      {
        heading: "What this collection does not certify",
        body: "Waterproofness, breathability numbers, and taped-seam claims are not published as a collection fact. If a fabric page is silent, the inquiry has to ask. Recycled content applies only where the composition says recycled. There is no mill country and no hydrostatic-head figure on this index.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/best-for/outerwear/", label: "Fabrics for outerwear" },
      { href: "/collections/aw-textures/", label: "Coating and brushed cloth" },
      {
        href: "/guides/fabric-weight-and-gsm/",
        label: "Fabric weight and GSM",
      },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "home-contract": {
    seoTitle: "Home Textile and Upholstery Cloth",
    seoDescription:
      "Compare upholstery, curtain, bedding, and rug cloths. Martindale, FR, or width counts only when that fabric page states it.",
    primaryKeyword: "upholstery fabric",
    sections: [
      {
        heading: "Home textiles are specified by job",
        body: "Upholstery bouclé, heavy linen, wool felt, and performance weaves cover furniture and need abrasion resistance that a curtain rarely needs. Open-weave linen and technical voile are for light. Acoustic drape is for sound, when the page says so. Percale and sateen bedding are cotton constructions with different surfaces: percale is usually matte, sateen has more lustre from the weave. Washed linen bedding and lyocell-blend bedding are separate. Rugs in wool, jute, or recycled PET pile are floor textiles, not sofa cloth.",
      },
      {
        heading: "Contract language without invented tests",
        body: "Inherently FR polyester and bleach-cleanable vinyl alternative are named products. They do not certify the bouclé or the percale. Martindale, flame standards, and roll width belong on the fabric page or in the inquiry. Do not copy a hotel-linen claim onto a fashion cotton, and do not copy a shirting poplin into a bedding brief just because both say cotton.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/best-for/upholstery/", label: "Upholstery fabrics" },
      { href: "/fabrics/best-for/bedding/", label: "Bedding fabrics" },
      { href: "/fabrics/best-for/home-textiles/", label: "Home textiles" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
};
