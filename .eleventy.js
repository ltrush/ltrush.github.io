const fs = require("fs");
const path = require("path");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

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

function collectProjectAssetPaths(projects) {
  const paths = [];
  // Only site-local paths are checkable; external URLs (YouTube embeds etc.) are skipped
  const add = (p) => {
    if (typeof p === "string" && p.startsWith("/")) paths.push(p);
  };
  const mediaSrc = (m) =>
    typeof m === "string" ? m : m && (m.src || m.url || m.image || m.video);
  for (const project of projects || []) {
    add(project.image);
    add(project.cardVideo);
    const pp = project.projectPage || {};
    for (const m of pp.images || []) add(mediaSrc(m));
    for (const m of pp.videos || []) {
      add(mediaSrc(m));
      if (m && typeof m === "object") add(m.poster);
    }
    for (const s of pp.sections || []) {
      for (const m of s.images || []) add(mediaSrc(m));
      for (const m of s.videos || []) {
        add(mediaSrc(m));
        if (m && typeof m === "object") add(m.poster);
      }
      add(s.src || s.video || s.url);
      add(s.poster);
    }
  }
  return paths;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  // Fail the build if projects.json references an asset that doesn't exist,
  // instead of silently deploying broken images
  eleventyConfig.on("eleventy.before", () => {
    const projects = JSON.parse(
      fs.readFileSync("src/_data/projects.json", "utf8"),
    );
    const missing = collectProjectAssetPaths(projects).filter(
      (p) => !fs.existsSync(path.join("src", decodeURI(p))),
    );
    if (missing.length) {
      throw new Error(
        `projects.json references missing asset(s): ${missing.join(", ")}`,
      );
    }
  });

  // Optimize every <img> in the output HTML at build time: converts to WebP,
  // caps width, and adds width/height attributes. Source images can be
  // committed at any size/format. SVGs pass through untouched.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp"],
    widths: [1600],
    svgShortCircuit: true,
    defaultAttributes: {
      decoding: "async",
    },
  });
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
  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    if (!path || !base) return path || "";
    try {
      return new URL(path, base).href;
    } catch {
      return path;
    }
  });

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
