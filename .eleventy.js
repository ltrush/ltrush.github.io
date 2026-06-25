const MONTH_LABELS = {
  1: "Jan.",
  2: "Feb.",
  3: "Mar.",
  4: "Apr.",
  5: "May.",
  6: "Jun.",
  7: "Jul.",
  8: "Aug.",
  9: "Sept.",
  10: "Oct.",
  11: "Nov.",
  12: "Dec.",
};

function normalizeMonthYear(value) {
  if (!value || typeof value !== "object") return null;
  const year = Number(value.year);
  if (Number.isNaN(year)) return null;

  if (value.month === undefined || value.month === null) {
    return { year, month: null };
  }

  const month = Number(value.month);
  if (Number.isNaN(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function structuredDateToSortKey(dateValue) {
  if (!dateValue || typeof dateValue !== "object") return null;
  const start = normalizeMonthYear(dateValue.start);
  const end = normalizeMonthYear(dateValue.end);
  if (end) {
    return end.year * 100 + (end.month || 12);
  }
  if (start) {
    return start.year * 100 + (start.month || 1);
  }
  return null;
}

function formatMonthYear(value) {
  const normalized = normalizeMonthYear(value);
  if (!normalized) return "";
  if (!normalized.month) return String(normalized.year);
  return `${MONTH_LABELS[normalized.month]} ${normalized.year}`;
}

function formatStructuredDate(dateValue) {
  if (!dateValue || typeof dateValue !== "object") return "";
  const startText = formatMonthYear(dateValue.start);
  const endText = formatMonthYear(dateValue.end);

  if (!startText && !endText && !dateValue.present) return "";
  if (dateValue.present && startText) return `${startText} - Present`;
  if (startText && endText) {
    if (startText === endText) return startText;
    return `${startText} - ${endText}`;
  }
  return startText || endText;
}

function projectSortKey(project) {
  if (!project || typeof project !== "object") return -1;
  const structuredSortKey = structuredDateToSortKey(project.date);
  return structuredSortKey === null ? -1 : structuredSortKey;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addFilter("sortProjectsByDateDesc", (projects) => {
    if (!Array.isArray(projects)) return [];
    return [...projects].sort((a, b) => {
      const keyDiff = projectSortKey(b) - projectSortKey(a);
      if (keyDiff !== 0) return keyDiff;
      return (a.title || "").localeCompare(b.title || "");
    });
  });
  eleventyConfig.addFilter("formatProjectDate", (project) => {
    if (!project || typeof project !== "object") return "";
    return formatStructuredDate(project.date);
  });

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
