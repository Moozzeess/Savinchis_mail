/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // postcss-preset-env: https://cssdb.org/
    // Adds vendor prefixes and other PostCSS features based on your browserslist config.
    // tailwindcss: https://tailwindcss.com/docs/using-with-postcss
    // PostCSS plugin to process your CSS with Tailwind.
    tailwindcss: {},
  },
};

export default config;
