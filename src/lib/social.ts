export const SITE_ORIGIN = "https://pershindmitrii.com";
export const SOCIAL_IMAGE = `${SITE_ORIGIN}/assets/og-image.png`;

export function socialMetadata(language: "en" | "ru", cv = false) {
  const russian = language === "ru";
  return {
    title: `${russian ? "Дмитрий Першин" : "Dmitrii Pershin"} — ${cv ? "CV | " : ""}Senior Product Designer`,
    description: russian
      ? `${cv ? "CV: " : ""}AI-процессы, дизайн-системы и сложные fintech-интерфейсы. Около 20 лет опыта в дизайне.`
      : `${cv ? "CV: " : ""}AI-assisted design, design systems and complex fintech interfaces. Around 20 years of experience in design.`,
    url: `${SITE_ORIGIN}${cv ? "/cv" : "/"}?lang=${language}`,
    locale: russian ? "ru_RU" : "en_US",
    alternateLocale: russian ? "en_US" : "ru_RU",
    imageAlt: "Dmitrii Pershin — Senior Product Designer",
  };
}

/** Keep in-place language changes consistent with the server's share metadata. */
export function updateSocialMetadata(language: "en" | "ru", cv = false) {
  const data = socialMetadata(language, cv);
  document.title = data.title;
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", data.url);
  for (const [selector, value] of Object.entries({
    'meta[name="description"]': data.description,
    'meta[property="og:title"]': data.title,
    'meta[property="og:description"]': data.description,
    'meta[property="og:url"]': data.url,
    'meta[property="og:locale"]': data.locale,
    'meta[property="og:locale:alternate"]': data.alternateLocale,
    'meta[name="twitter:title"]': data.title,
    'meta[name="twitter:description"]': data.description,
  })) document.querySelector(selector)?.setAttribute("content", value);
}
