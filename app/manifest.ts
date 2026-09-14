import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FabStitch",
    short_name: "FabStitch",
    description:
      "Fabric discovery and purchasing, built around the material and quantity you need.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f0e8",
    theme_color: "#141f38",
    icons: [
      {
        src: "/media/fabstitch-mark.png",
        sizes: "600x600",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
