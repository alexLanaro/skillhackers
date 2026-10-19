// Configurazione Eleventy del sito Skill Hackers
export default function (eleventyConfig) {
  // File copiati così come sono, senza elaborazione
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // Data di oggi (usata nella sitemap)
  eleventyConfig.addFilter("today", () => new Date().toISOString().slice(0, 10));

  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
