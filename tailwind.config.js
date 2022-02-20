module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        ['gray-custom']: '#18171B',
        ['dark-white']: '#EDEDEF',
        ['light-gray']: '#ABABB6',
        ['purple-custom']: '#9047FF',
        ['black-box']: '#1F1F23',
        ['black-main']: '#18181B',
        input: '#464649',
        // purple:
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
