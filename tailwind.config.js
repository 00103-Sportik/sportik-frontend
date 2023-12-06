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
    plugin(({ addComponents, addVariant, e }) => {
      addComponents({
        '.layout': {
          '@apply flex flex-col items-center justify-center min-h-full text-orange-500': {},
        },
        '.auth-container': {
          '@apply bg-radial-gradient-layout flex flex-col gap-6 justify-center items-center self-center flex-nowrap w-[min(80%,60rem)]':
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
        '.nav': {
          '@apply flex justify-between items-center w-full p-5': {},
        },
        '.span': {
          '@apply absolute w-full bg-white h-0.5 transition duration-500 ease-in-out left-0': {},
        },
        '.menu-btn': {
          '@apply inline-block w-3.5 h-5 bg-transparent order-1 cursor-pointer relative z-20 border-none mx-2': {},
        },
        '.menu': {
          '@apply absolute bottom-0 left-0 right-0 top-0 bg-btnBlack flex justify-center items-center flex-col -translate-y-full transition duration-500 ease-in-out':
            {},
        },
        '.menu-btn-open': {
          '@apply [&>*:nth-child(1)]:scale-x-0 [&>*:nth-child(4)]:scale-x-0 [&>*:nth-child(2)]:rotate-45 [&>*:nth-child(3)]:-rotate-45 [&>*:nth-child(3)]:inline-block [&>*:nth-child(2)]:inline-block':
            {},
        },
        '.menu-ul-open': {
          '@apply translate-y-0': {},
        },
        '.dialog': {
          '@apply fixed z-50 flex h-fit max-h-[calc(100vh_-_2_*_0.75rem)] flex-col gap-4 overflow-auto bg-white text-black shadow-2xl m-auto p-4 rounded-xl inset-3':
            {},
        },
        '.combobox': {
          '@apply cursor-pointer': {},
        },
      });
    }),
  ],
};
