/**
 * Public image records: real file dimensions and alt text that describes the photograph.
 * Alt text is not a keyword list. Filenames already in /media/fabrics are kept.
 */
export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const ASSETS = {
  "/media/fabrics/knit-fabric.jpg": {
    width: 1024,
    height: 684,
    alt: "Knit fabric laid flat, showing a looped construction",
  },
  "/images.jpeg": { width: 554, height: 554, alt: "Folded textile sample" },
  "/media/fabrics/acoustic-rated-drape-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dense charcoal acoustic drape fabric with substantial folds",
  },
  "/media/fabrics/alpaca-blend-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Alpaca blend with a soft lofty nap and warm natural fiber halo",
  },
  "/media/fabrics/batiste-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale blue cotton batiste lawn with a fine lightweight weave",
  },
  "/media/fabrics/birdseye-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale blue birdseye cotton piqué with fine dimensional pattern",
  },
  "/media/fabrics/bleach-cleanable-vinyl-alternative-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pebble grey bleach-cleanable vinyl alternative with a matte coated surface",
  },
  "/media/fabrics/boiled-wool-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Boiled wool with a dense felted fiber surface and stable body",
  },
  "/media/fabrics/brushed-flannel-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Brushed flannel with raised nap and a muted burgundy plaid",
  },
  "/media/fabrics/calf-hair-finish-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Calf-hair finish leather with a short natural directional hair coat",
  },
  "/media/fabrics/canvas.jpg": {
    width: 736,
    height: 736,
    alt: "Heavy canvas fabric with a tight plain weave",
  },
  "/media/fabrics/casentino-wool-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Casentino wool with a dense characteristic curly felted nap",
  },
  "/media/fabrics/check-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Woven check fabric with intersecting cobalt, cream and rust bands",
  },
  "/media/fabrics/classic-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "White classic cotton piqué with clear raised geometric texture",
  },
  "/media/fabrics/classic-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "White and blue classic Oxford cotton with a basketweave grain",
  },
  "/media/fabrics/cooling-performance-construction-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cooling performance fabric with breathable micro-mesh channels",
  },
  "/media/fabrics/cotton-boucle-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cotton bouclé knit with a matte looped staple-fiber surface",
  },
  "/media/fabrics/cotton-boucle-yarn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Textured cotton bouclé yarn fabric with looped surface",
  },
  "/media/fabrics/cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "White cotton lawn with a fine close plain weave and crisp hand",
  },
  "/media/fabrics/cotton-moleskin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cotton moleskin with a dense short brushed nap and firm body",
  },
  "/media/fabrics/cotton-organdy-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Stiff sheer cotton organdy holding sculptural volume",
  },
  "/media/fabrics/cotton-poplin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Crisp fine-count cotton poplin fabric in soft folds",
  },
  "/media/fabrics/cotton-rich-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Charcoal cotton-rich piqué with a dimensional geometric knit",
  },
  "/media/fabrics/cotton-seersucker-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Puckered cotton seersucker fabric in pale blue stripes",
  },
  "/media/fabrics/cotton-velveteen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cotton velveteen with dense short directional pile",
  },
  "/media/fabrics/cotton-voile-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Lightweight translucent cotton voile fabric",
  },
  "/media/fabrics/cotton.jpg": {
    width: 736,
    height: 736,
    alt: "Folded cotton fabric with a plain woven surface",
  },
  "/media/fabrics/crepe-de-chine-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cobalt blue silk crepe de chine with a fine matte texture",
  },
  "/media/fabrics/crinkle-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Burgundy crinkle chiffon with a permanent puckered texture",
  },
  "/media/fabrics/crinkle-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dusty rose crinkle cotton with an irregular puckered surface",
  },
  "/media/fabrics/crochet-effect-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Crochet-effect knit with chunky interlocking cotton loops",
  },
  "/media/fabrics/crossover-swimwear-fabric-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Compact resilient swimwear fabric with a fine technical knit surface",
  },
  "/media/fabrics/crushed-velvet-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Crushed velvet with irregular directional pile and burgundy highlights",
  },
  "/media/fabrics/deconstructed-damask-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Deconstructed damask with contrasting raised woven motifs",
  },
  "/media/fabrics/deconstructed-jacquard-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Deconstructed jacquard with raised abstract woven motif relief",
  },
  "/media/fabrics/denim.jpg": {
    width: 736,
    height: 736,
    alt: "Indigo denim fabric showing a twill face",
  },
  "/media/fabrics/donegal-tweed-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Donegal tweed with irregular colored wool nep flecks",
  },
  "/media/fabrics/double-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Forest double cotton piqué with dense geometric texture",
  },
  "/media/fabrics/double-face-wool-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Double-face wool with contrasting charcoal and rust reversible faces",
  },
  "/media/fabrics/double-layer-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Plum double-layer chiffon with increased semi-sheer opacity",
  },
  "/media/fabrics/down-alternative-fill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Down-alternative fill showing soft lofted synthetic staple fibers",
  },
  "/media/fabrics/egyptian-cotton-broadcloth-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Lavender Egyptian cotton broadcloth with an even fine weave",
  },
  "/media/fabrics/egyptian-cotton-flannel-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Checked Egyptian cotton flannel with a softly brushed nap",
  },
  "/media/fabrics/egyptian-cotton-percale-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Icy blue Egyptian cotton percale with a crisp matte surface",
  },
  "/media/fabrics/egyptian-cotton-poplin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "White Egyptian cotton poplin with a fine smooth plain weave",
  },
  "/media/fabrics/egyptian-cotton-sateen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Sage Egyptian cotton sateen with a restrained cotton lustre",
  },
  "/media/fabrics/egyptian-cotton-seersucker-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Blue-and-white Egyptian cotton seersucker with a puckered stripe",
  },
  "/media/fabrics/egyptian-cotton-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Rust Egyptian cotton twill with a fine diagonal grain",
  },
  "/media/fabrics/egyptian-cotton-voile-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Blush Egyptian cotton voile with airy translucent folds",
  },
  "/media/fabrics/embroidered-cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Sage cotton lawn with raised white floral embroidery",
  },
  "/media/fabrics/european-flax-linen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "European flax linen with a natural irregular plain weave",
  },
  "/media/fabrics/fine-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dusty rose fine cotton piqué with small raised texture",
  },
  "/media/fabrics/fine-gauge-semi-sheer-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Fine-gauge semi-sheer knit with delicate close-loop construction",
  },
  "/media/fabrics/fine-wale-corduroy-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Fine-wale corduroy with many narrow raised cotton pile ribs",
  },
  "/media/fabrics/fleece.jpg": {
    width: 736,
    height: 736,
    alt: "Fleece fabric with a soft brushed pile",
  },
  "/media/fabrics/french-terry-classic-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry classic fabric",
  },
  "/media/fabrics/french-terry-heavyweight-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry heavyweight fabric",
  },
  "/media/fabrics/french-terry-lightweight-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry lightweight fabric",
  },
  "/media/fabrics/french-terry-loopback-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry loopback fabric",
  },
  "/media/fabrics/french-terry-modal-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry modal fabric",
  },
  "/media/fabrics/french-terry-organic-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry organic fabric",
  },
  "/media/fabrics/french-terry-peached-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry peached fabric",
  },
  "/media/fabrics/french-terry-recycled-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry recycled cotton fabric",
  },
  "/media/fabrics/french-terry-slub-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry slub fabric",
  },
  "/media/fabrics/french-terry-stretch-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "french terry stretch fabric",
  },
  "/media/fabrics/heavy-linen-upholstery-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Heavy oat linen upholstery with a dense irregular plain weave",
  },
  "/media/fabrics/heavy-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Charcoal heavy Oxford cotton with a substantial textured weave",
  },
  "/media/fabrics/hemp-cotton-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Indigo hemp-cotton denim with dry natural slubs",
  },
  "/media/fabrics/herringbone-tweed-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Herringbone tweed with raised wool V-shaped twill and mixed yarns",
  },
  "/media/fabrics/honeycomb-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Mustard honeycomb cotton piqué with open geometric relief",
  },
  "/media/fabrics/inherently-fr-polyester-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Graphite inherently flame-resistant polyester contract fabric",
  },
  "/media/fabrics/jersey.jpg": {
    width: 735,
    height: 736,
    alt: "Jersey knit fabric with a looped surface",
  },
  "/media/fabrics/jumbo-corduroy-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Jumbo corduroy with very wide raised cotton pile wales",
  },
  "/media/fabrics/jute-rug-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Natural tan jute rug with coarse dry woven bast fibers",
  },
  "/media/fabrics/khadi-effect-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Indigo khadi-effect cotton with handwoven irregular texture",
  },
  "/media/fabrics/laser-and-ozone-finished-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Laser- and ozone-finished denim with controlled tonal fading",
  },
  "/media/fabrics/lightweight-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Lightweight blue cotton denim with a fine diagonal twill",
  },
  "/media/fabrics/lightweight-merino-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Lightweight merino knit with fine loops and a soft natural wool halo",
  },
  "/media/fabrics/linen-boucle-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Linen bouclé knit with nubby flax loops and a breathable matte surface",
  },
  "/media/fabrics/linen-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Linen-cotton blend fabric with a balanced plain weave",
  },
  "/media/fabrics/linen-lyocell-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Soft lavender linen-lyocell blend with fluid drape",
  },
  "/media/fabrics/linen-silk-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Linen-silk blend with a soft sheen and fine natural texture",
  },
  "/media/fabrics/linen-viscose-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Drapey linen-viscose blend fabric in soft natural folds",
  },
  "/media/fabrics/linen.jpg": {
    width: 736,
    height: 981,
    alt: "Natural linen fabric with a visible woven texture",
  },
  "/media/fabrics/long-staple-cotton-percale-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "White long-staple cotton percale with a crisp matte weave",
  },
  "/media/fabrics/long-staple-cotton-sateen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Ivory long-staple cotton sateen with a restrained surface sheen",
  },
  "/media/fabrics/lyocell-blend-bedding-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Eucalyptus lyocell-blend bedding with a smooth fluid weave",
  },
  "/media/fabrics/matte-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dusty lavender matte chiffon with a soft semi-sheer surface",
  },
  "/media/fabrics/melton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dense fulled melton wool with a short compact nap and firm body",
  },
  "/media/fabrics/membrane-backed-covert-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Membrane-backed covert with a compact technical twill and layered edge",
  },
  "/media/fabrics/membrane-backed-gabardine-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Membrane-backed gabardine with dense diagonal technical twill",
  },
  "/media/fabrics/mercerised-cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Coral mercerised cotton lawn with a clean fine plain weave",
  },
  "/media/fabrics/mercerized-cotton-broadcloth-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Coral mercerized cotton broadcloth with clean fine yarns",
  },
  "/media/fabrics/mercerized-cotton-jersey-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Emerald mercerized cotton jersey with a subtle smooth lustre",
  },
  "/media/fabrics/mercerized-cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Violet mercerized cotton lawn with a crisp fine weave",
  },
  "/media/fabrics/mercerized-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cobalt mercerized cotton piqué with raised geometric texture",
  },
  "/media/fabrics/mercerized-cotton-poplin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "White mercerized cotton poplin with a clean refined surface",
  },
  "/media/fabrics/mercerized-cotton-sateen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Navy mercerized cotton sateen with controlled surface lustre",
  },
  "/media/fabrics/mercerized-cotton-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Olive mercerized cotton twill with a refined diagonal grain",
  },
  "/media/fabrics/mercerized-cotton-voile-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Mint mercerized cotton voile with fine translucent folds",
  },
  "/media/fabrics/merino-roica-stretch-tailoring-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Fine merino tailoring cloth with a compact structured stretch weave",
  },
  "/media/fabrics/mohair-blend-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Mohair blend with an airy woven surface and visible long fiber halo",
  },
  "/media/fabrics/open-stitch-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Open-stitch knit with visible looped yarns and airy ladder-like gaps",
  },
  "/media/fabrics/open-weave-linen-curtain-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Open-weave ecru linen curtain fabric with airy yarn spacing",
  },
  "/media/fabrics/organic-cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Undyed organic cotton lawn with a breathable matte weave",
  },
  "/media/fabrics/organic-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Ecru organic cotton piqué with natural raised texture",
  },
  "/media/fabrics/organic-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Ecru organic Oxford cotton with natural basketweave character",
  },
  "/media/fabrics/oxford-chambray-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Blue Oxford chambray cotton with coloured-yarn basketweave contrast",
  },
  "/media/fabrics/panne-velvet-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Panné velvet with a flattened reflective teal pile",
  },
  "/media/fabrics/peach-skin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Peach-skin woven fabric with a fine short sueded nap",
  },
  "/media/fabrics/performance-upholstery-weave-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Slate performance upholstery with a compact basketweave grid",
  },
  "/media/fabrics/pima-cotton-broadcloth-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Terracotta Pima cotton broadcloth with an even fine weave",
  },
  "/media/fabrics/pima-cotton-fleece-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Teal Pima cotton fleece with a smooth face and brushed reverse",
  },
  "/media/fabrics/pima-cotton-interlock-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cream Pima cotton interlock with a smooth stable double face",
  },
  "/media/fabrics/pima-cotton-jersey-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Coral Pima cotton jersey with a smooth fine knit face",
  },
  "/media/fabrics/pima-cotton-poplin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Sky blue Pima cotton poplin with a fine crisp plain weave",
  },
  "/media/fabrics/pima-cotton-rib-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Olive Pima cotton rib with fine raised vertical ribs",
  },
  "/media/fabrics/pima-cotton-sateen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Plum Pima cotton sateen with restrained natural lustre",
  },
  "/media/fabrics/pima-cotton-voile-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale yellow Pima cotton voile with airy fine transparency",
  },
  "/media/fabrics/pinpoint-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale blue pinpoint Oxford cotton with a fine compact texture",
  },
  "/media/fabrics/pointelle-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pointelle knit with fine loops and repeated decorative eyelets",
  },
  "/media/fabrics/polyester-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Marigold polyester chiffon with lightweight transparent folds",
  },
  "/media/fabrics/polyester.jpg": {
    width: 736,
    height: 736,
    alt: "Polyester fabric with a smooth technical face",
  },
  "/media/fabrics/ponte-brushed-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte brushed fabric",
  },
  "/media/fabrics/ponte-compact-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte compact fabric",
  },
  "/media/fabrics/ponte-cotton-rayon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte cotton rayon fabric",
  },
  "/media/fabrics/ponte-double-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte double knit fabric",
  },
  "/media/fabrics/ponte-lightweight-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte lightweight fabric",
  },
  "/media/fabrics/ponte-matte-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte matte fabric",
  },
  "/media/fabrics/ponte-rayon-nylon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte rayon nylon fabric",
  },
  "/media/fabrics/ponte-ribbed-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte ribbed fabric",
  },
  "/media/fabrics/ponte-structured-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte structured fabric",
  },
  "/media/fabrics/ponte-travel-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "ponte travel fabric",
  },
  "/media/fabrics/poplin.jpg": {
    width: 736,
    height: 552,
    alt: "Cotton poplin fabric with a smooth, crisp face",
  },
  "/media/fabrics/premium-weight-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dense dark indigo premium-weight denim with pronounced twill",
  },
  "/media/fabrics/printed-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Printed chiffon with a small navy abstract pattern and sheer drape",
  },
  "/media/fabrics/printed-cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Printed cotton lawn with a fine terracotta botanical pattern",
  },
  "/media/fabrics/real-leather-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Full-grain real leather with natural pores and a supple hide surface",
  },
  "/media/fabrics/real-suede-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Real suede hide with a soft natural nap and supple weighty folds",
  },
  "/media/fabrics/recycled-cotton-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Washed blue recycled-cotton denim with authentic diagonal twill",
  },
  "/media/fabrics/recycled-nylon-ripstop-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Recycled nylon ripstop with a reinforced square grid",
  },
  "/media/fabrics/recycled-pet-acoustic-felt-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Teal recycled PET acoustic felt with visible fiber flecks",
  },
  "/media/fabrics/recycled-pet-pile-rug-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Grey recycled PET rug with a dense synthetic cut pile",
  },
  "/media/fabrics/recycled-polyester-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Sage recycled polyester chiffon with soft translucent drape",
  },
  "/media/fabrics/recycled-polyester-wadding-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Recycled polyester wadding with an airy nonwoven staple-fiber web",
  },
  "/media/fabrics/retro-sportif-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Retro sportif knit with compact jersey stitches and coordinated stripes",
  },
  "/media/fabrics/royal-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Lilac Royal Oxford cotton with pronounced geometric relief",
  },
  "/media/fabrics/selvedge-rigid-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Raw indigo selvedge rigid denim with a red-and-white edge",
  },
  "/media/fabrics/silk-boucle-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Silk bouclé with dense irregular looped yarns and a subtle tonal sheen",
  },
  "/media/fabrics/silk-broadcloth-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale blue silk broadcloth with a fine close plain weave",
  },
  "/media/fabrics/silk-charmeuse-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Emerald silk charmeuse with liquid drape and natural satin sheen",
  },
  "/media/fabrics/silk-chiffon-crepe-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Blush silk chiffon crepe with sheer pebbled surface and floating drape",
  },
  "/media/fabrics/silk-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Deep burgundy transparent silk chiffon in fluid folds",
  },
  "/media/fabrics/silk-crepe-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dusty lilac silk crepe with a fine pebbled surface",
  },
  "/media/fabrics/silk-dupion-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Deep navy silk dupion with pronounced slubbed texture",
  },
  "/media/fabrics/silk-faille-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Forest green silk faille with a firm crosswise rib",
  },
  "/media/fabrics/silk-georgette-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Muted teal silk georgette with a fine crepe surface",
  },
  "/media/fabrics/silk-habotai-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Forest green smooth silk habotai in fluid folds",
  },
  "/media/fabrics/silk-noil-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Undyed matte silk noil with visible short-fiber texture",
  },
  "/media/fabrics/silk-organza-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Champagne silk organza with crisp transparent volume",
  },
  "/media/fabrics/silk-satin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Ruby silk satin with smooth high sheen and fluid folds",
  },
  "/media/fabrics/silk-taffeta-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Deep plum silk taffeta with structured reflective folds",
  },
  "/media/fabrics/silk-tussar-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Copper silk tussar with irregular slubbed plain weave",
  },
  "/media/fabrics/silk-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Cobalt silk twill with a fine diagonal grain and soft sheen",
  },
  "/media/fabrics/silk-viscose-velvet-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Silk-viscose velvet with a dense luminous directional pile",
  },
  "/media/fabrics/slub-cotton-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Indigo slub cotton lawn with subtle irregular yarn texture",
  },
  "/media/fabrics/slub-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Olive slub cotton with irregular thick yarn texture",
  },
  "/media/fabrics/soft-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Sage soft Oxford cotton with a softened visible basketweave",
  },
  "/media/fabrics/stretch-chiffon-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Muted teal stretch chiffon with lightweight semi-sheer folds",
  },
  "/media/fabrics/stretch-cotton-pique-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Violet stretch cotton piqué with a raised breathable surface",
  },
  "/media/fabrics/stretch-oxford-cotton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Rust stretch Oxford cotton with a visible basketweave texture",
  },
  "/media/fabrics/stretch-woven-compression-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dense stretch-woven compression fabric with a fine technical grid",
  },
  "/media/fabrics/suede-effect-woven-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Suede-effect woven fabric with a uniform short brushed textile nap",
  },
  "/media/fabrics/tartan-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Woven wool tartan with burgundy, green, navy and cream bands",
  },
  "/media/fabrics/technical-voile-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale grey technical voile with a stable translucent weave",
  },
  "/media/fabrics/tencel-brushed-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel brushed fabric",
  },
  "/media/fabrics/tencel-cotton-poplin-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel cotton poplin fabric",
  },
  "/media/fabrics/tencel-denim-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel denim fabric",
  },
  "/media/fabrics/tencel-heavy-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel heavy twill fabric",
  },
  "/media/fabrics/tencel-jersey-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel jersey fabric",
  },
  "/media/fabrics/tencel-linen-blend-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel linen blend fabric",
  },
  "/media/fabrics/tencel-plain-weave-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel plain weave fabric",
  },
  "/media/fabrics/tencel-sateen-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel sateen fabric",
  },
  "/media/fabrics/tencel-shirting-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel shirting fabric",
  },
  "/media/fabrics/tencel-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "tencel twill fabric",
  },
  "/media/fabrics/three-layer-membrane-laminate-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Three-layer membrane laminate with face, membrane and protective backer",
  },
  "/media/fabrics/tropical-wool-super-110s-130s-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Fine tropical worsted wool with a crisp breathable tailoring weave",
  },
  "/media/fabrics/twill.jpg": {
    width: 736,
    height: 736,
    alt: "Twill fabric with a diagonal rib",
  },
  "/media/fabrics/two-layer-membrane-laminate-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Two-layer membrane laminate with a face fabric and continuous membrane",
  },
  "/media/fabrics/two-point-five-layer-membrane-laminate-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Two-and-a-half-layer membrane laminate with technical face and protective layer",
  },
  "/media/fabrics/ultra-light-semi-sheer-lounge-knit-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Ultra-light semi-sheer lounge knit with airy open loops",
  },
  "/media/fabrics/undyed-wool-rug-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Undyed cream wool rug with a dense soft looped surface",
  },
  "/media/fabrics/upholstery-boucle-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Dense ivory upholstery bouclé with irregular looped yarns",
  },
  "/media/fabrics/voile-lawn-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Pale yellow cotton voile lawn with a slightly sheer open weave",
  },
  "/media/fabrics/washed-linen-bedding-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Stone washed linen bedding with softened natural slubs",
  },
  "/media/fabrics/wool-alpaca-brushed-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool alpaca brushed fabric",
  },
  "/media/fabrics/wool-cashmere-melton-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool cashmere melton fabric",
  },
  "/media/fabrics/wool-cotton-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool cotton twill fabric",
  },
  "/media/fabrics/wool-felt-upholstery-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Charcoal wool felt upholstery with a dense compact fiber surface",
  },
  "/media/fabrics/wool-hemp-canvas-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Wool and hemp canvas with a firm woven surface",
  },
  "/media/fabrics/wool-linen-open-weave-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Wool-linen open weave with coarse breathable yarn spacing",
  },
  "/media/fabrics/wool-linen-tailoring-open-weave-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool linen tailoring open weave fabric",
  },
  "/media/fabrics/wool-mohair-fresco-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool mohair fresco fabric",
  },
  "/media/fabrics/wool-mohair-open-weave-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Wool-mohair open weave with airy gaps and a fine fiber halo",
  },
  "/media/fabrics/wool-polyamide-crepe-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool polyamide crepe fabric",
  },
  "/media/fabrics/wool-polyester-suiting-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool polyester suiting fabric",
  },
  "/media/fabrics/wool-silk-bi-stretch-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Wool-silk bi-stretch tailoring cloth with a fine resilient weave",
  },
  "/media/fabrics/wool-silk-suiting-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool silk suiting fabric",
  },
  "/media/fabrics/wool-technical-hybrid-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "Wool-technical hybrid combining a natural wool face and performance backing",
  },
  "/media/fabrics/wool-viscose-twill-primary.webp": {
    width: 1600,
    height: 1200,
    alt: "wool viscose twill fabric",
  },
  "/media/fabstitch-mark.png": {
    width: 600,
    height: 603,
    alt: "Fabstitch mark fabric",
  },
  "/media/hero-navy-jersey.jpg": {
    width: 1536,
    height: 1024,
    alt: "Navy jersey knit fabric with a close, even surface",
  },
} as const satisfies Record<
  string,
  { width: number; height: number; alt: string }
>;

export function imageAsset(
  src: string | undefined | null,
): ImageAsset | undefined {
  if (!src) return undefined;
  const path = src.split("?")[0];
  const record = ASSETS[path as keyof typeof ASSETS];
  if (!record) return undefined;
  return { src: path, ...record };
}

export function imageAlt(
  src: string | undefined | null,
  fallback = "Fabric photograph",
): string {
  return imageAsset(src)?.alt ?? fallback;
}

export const IMAGE_ASSETS: readonly ImageAsset[] = Object.entries(ASSETS).map(
  ([src, record]) => ({ src, ...record }),
);
