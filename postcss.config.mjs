/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Certifique-se que está assim
    autoprefixer: {},
  },
}

export default config