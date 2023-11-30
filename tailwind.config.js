import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        layout: '#11141E',
        btnBlack: '#15171D',
        btnRed: '#AE3838',
      },
      backgroundImage: {
        'radial-gradient-layout':
          'radial-gradient(165.81% 165.81% at -13.5% -44.62%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
        'radial-gradient-box':
          'radial-gradient(662.26% 779.39% at -27.79% -422.58%, #000000 0%, rgba(255, 255, 255, 0) 100%)',
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.layout': {
          '@apply flex flex-col items-center justify-center min-h-full p-10':
            {},
        },
        '.auth-container': {
          '@apply bg-radial-gradient-layout w-4/5 flex flex-col gap-6 justify-center items-center self-center flex-nowrap':
            {},
        },
        '.btn': {
          '@apply rounded-lg': {},
        },
        '.btn-black': {
          '@apply btn bg-btnBlack': {},
        },
        '.btn-red': {
          '@apply btn bg-btnRed': {},
        },
      });
    }),
  ],
};
