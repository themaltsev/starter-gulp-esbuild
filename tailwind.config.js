// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // 👇 Добавьте это
  safelist: [
    {
      pattern: /bg-\[#[0-9a-fA-F]+\]/,
      variants: ['hover', 'lg', 'dark'],
    },
    {
      pattern: /text-\[#[0-9a-fA-F]+\]/,
    },
    // Можно добавить другие arbitrary значения
  ],
}