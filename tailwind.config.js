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
        gray: '#3F4249',
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
          '@apply flex flex-col items-center justify-center min-h-full': {},
        },
        '.auth-container': {
          '@apply min-h-[446px] min-w-[300px] flex w-[min(80%,60rem)] flex-col flex-nowrap items-center justify-center gap-6 self-center bg-[radial-gradient(165.81%_165.81%_at_-13.5%_-44.62%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)] rounded-[20px]':
            {},
        },
        '.title-container': {
          '@apply block justify-center items-center mb-5':
            {},
        },
        '.title-layout': {
          '@apply flex justify-center items-center mb-6':
            {},
        },
        '.field-password': {
          '@apply flex justify-center items-center pl-4':
            {},
        },
        '.nav': {
          '@apply flex justify-between items-center w-[350px] p-5': {},
        },
        '.span': {
          '@apply absolute w-full bg-white h-0.5 transition duration-500 ease-in-out left-0': {},
        },
        '.menu-btn': {
          '@apply inline-block w-3.5 h-5 bg-transparent order-1 cursor-pointer relative z-20 border-none mx-2': {},
        },
        '.menu': {
          '@apply absolute bottom-0 left-0 right-0 top-0 bg-btnBlack flex justify-center items-center flex-col -translate-y-full transition duration-500 ease-in-out z-[2]':
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
        '.text-err': {
          '@apply fixed': {},
        },
        //--Button--
        '.btn': {
          '@apply relative w-[97px] h-[43px] flex items-center justify-center no-underline font-normal text-[15px] text-[white] mt-14 mb-4 mx-auto rounded-[25px] border-solid':
            {},
        },
        '.btn-black': {
          '@apply btn bg-[#2B2E38] border-[#2B2E38]': {},
        },
        '.btn-red': {
          '@apply btn bg-[#AE3838] border-[#AE3838]': {},
        },
        '.btn-white': {
          '@apply btn bg-[white] border-[white]': {},
        },
        '.btn:active': {
          '@apply transition-[0.2s] border-2 scale-110': {},
        },
        '.btn-black-calc': {
          '@apply btn w-[180px] h-[43px] bg-[#2B2E38] border-[#2B2E38]': {},
        },
        //--Input--
        '.form-group': {
          '@apply relative mt-8': {},
        },
        '.form-label': {
          '@apply absolute text-[white] transition-[0.2s] left-[0.2em] top-0 z-[1]': {},
        },
        '.form-input': {
          '@apply w-[200px] bg-transparent transition-[0.2s] text-[white] pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid focus:border-b-[gray] focus:border-b focus:border-solid disabled:text-[gray] disabled:border-[gray]':
            {},
          outline: 'none',
        },
        '.form-input-wider': {
          '@apply form-input w-[300px] bg-transparent transition-[0.2s] text-[white] pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid focus:border-b-[gray] focus:border-b focus:border-solid disabled:text-[gray] disabled:border-[gray]':
              {},
          outline: 'none',
        },
        '.form-input-err': {
          '@apply border-[#AE3838]': {},
        },
        '.form-label-disabled': {
          '@apply text-[gray]': {},
        },
        '.form-input-disabled': {
          '@apply text-[gray] border-[gray]': {},
        },
        '.text-error': {
          '@apply text-btnRed': {},
        },
        //--Combobox--
        '.select-container': {
          '@apply flex justify-center relative w-full h-[33px] overflow-hidden cursor-pointer mt-8': {},
        },
        '.select-box': {
          '@apply w-full bg-transparent text-[white] text-base transition-[left] duration-[0.2s] ease-linear pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid':
            {},
        },
      });
    }),
  ],
};
