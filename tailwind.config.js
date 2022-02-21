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
        ['name-red']: '#F94801',
        ['name-blue']: '#1C91FF',
        ['name-pink']: '#FF68B3',
        ['name-green']: '#027F02',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
