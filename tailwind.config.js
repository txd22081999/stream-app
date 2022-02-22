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
        user: {
          red: '#f93a01',
          blue: '#1C91FF',
          pink: '#fb59aa',
          green: '#00d100',
          yellow: '#eded00',
          orange: '#ffa500',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
