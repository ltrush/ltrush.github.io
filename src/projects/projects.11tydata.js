module.exports = {
  eleventyComputed: {
    title: (data) => (data.project ? data.project.title : data.title),
    description: (data) =>
      data.project ? data.project.description : data.description,
    ogImage: (data) => (data.project ? data.project.image : data.ogImage),
  },
};
