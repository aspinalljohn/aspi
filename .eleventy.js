module.exports = function(eleventyConfig) {
  // Passthrough copy static assets to root of output
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  // Reading time filter (words / 200, minimum 1 min)
  eleventyConfig.addFilter("readingTime", function(content) {
    if (!content) return "1 min read";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  });

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // ISO date filter for structured data
  eleventyConfig.addFilter("isoDate", function(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  });

  // Collection: blog posts sorted by date descending
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
