/**
 * Builds a sized/sharpenable URL for a stable `static.wixstatic.com` media id,
 * e.g. "84283f_abc…~mv2.jpg". Width-scaled, queue-sharpened, avif-encoded.
 */
export function wix(id: string, width: number, height?: number): string {
  const h = height ?? Math.round(width * 0.76);
  const file = id.startsWith("http") ? id.split("/").pop() : id;
  return `https://static.wixstatic.com/media/${file}/v1/fit/w_${width},h_${h},al_c,q_85,enc_avif,quality_auto/${file}`;
}

/**
 * Turns a YouTube share/watch URL into the embeddable form an iframe needs.
 * Accepts `youtu.be/<id>`, `watch?v=<id>` and already-embedded URLs, and
 * returns the input untouched for anything else (Vimeo, a direct file).
 */
export function youtubeEmbed(href: string): string {
  const youtu = href.match(/^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)/);
  if (youtu) return `https://www.youtube.com/embed/${youtu[1]}`;
  const watch = href.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const embed = href.match(/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([\w-]+)/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
  return href;
}
