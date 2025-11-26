module.exports = {
  icon: true,
  typescript: true,
  prettier: true,
  expandProps: "end",
  ref: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: "removeViewBox",
        active: false,
      },
    ],
  },
};
