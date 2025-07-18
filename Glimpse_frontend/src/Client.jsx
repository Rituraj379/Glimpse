import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2025-05-24",
  useCdn: true, // Enable CDN for better performance and caching
  token: import.meta.env.VITE_SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
  perspective: 'published', // Only fetch published documents
});

const builder = imageUrlBuilder(sanityClient);
// Enhanced urlFor function with memory optimization
export const urlFor = (source) => {
  if (!source) return '';
  return builder
    .image(source)
    .auto('format') // Automatically select optimal format
    .fit('max') // Preserve aspect ratio
    .sharpen(10); // Slightly sharpen to maintain quality at lower sizes
};