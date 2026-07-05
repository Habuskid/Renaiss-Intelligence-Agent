export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F7F5F0',
        stone: {
          border: '#E5E0D8',
        }
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}
