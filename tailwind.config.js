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
          '@apply flex flex-col items-center justify-start min-h-screen': {},
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
          '@apply absolute justify-center bottom-0 left-0 right-0 top-0 bg-btnBlack flex items-center flex-col text-[26px] -translate-y-full transition gap-[20px] duration-500 ease-in-out z-[2] pb-14':
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
          '@apply fixed z-50 flex h-fit max-h-[calc(100vh_-_2_*_0.75rem)] flex-col justify-center gap-4 overflow-auto bg-white text-black shadow-2xl m-auto p-4 rounded-xl inset-3':
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
          '@apply btn w-[140px] h-[43px] bg-[#2B2E38] border-[#2B2E38] mt-3': {},
        },
        '.btn-black-filter': {
          '@apply btn w-[110px] bg-[#2B2E38] border-[#2B2E38] my-0 ml-6': {},
        },
        '.btn-black-less-margin': {
          '@apply btn bg-[#2B2E38] border-[#2B2E38] mt-5': {},
        },
        '.btn-red-less-margin': {
          '@apply btn bg-[#AE3838] border-[#AE3838] mt-5': {},
        },
        //--Input--
        '.form-group': {
          '@apply relative mt-8': {},
        },
        '.form-label': {
          '@apply absolute text-[white] transition-[0.2s] left-[0.2em] top-0 z-[1]': {},
        },
        '.form-input': {
          '@apply w-[220px] bg-transparent transition-[0.2s] text-[white] pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid focus:border-b-[gray] focus:border-b focus:border-solid disabled:text-[gray] disabled:border-[gray]':
            {},
          outline: 'none',
        },
        '.form-input-wider': {
          '@apply form-input w-[340px] bg-transparent transition-[0.2s] text-[white] pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid focus:border-b-[gray] focus:border-b focus:border-solid disabled:text-[gray] disabled:border-[gray]':
            {},
          outline: 'none',
        },
        '.form-input-narrow': {
          '@apply form-input w-[100px] bg-transparent transition-[0.2s] text-[white] pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid focus:border-b-[gray] focus:border-b focus:border-solid disabled:text-[gray] disabled:border-[gray]':
            {},
          outline: 'none',
        },
        '.form-label-modal': {
          '@apply absolute text-[white] transition-[0.2s] left-[0.2em] top-0 z-[1]': {},
        },
        '.form-input-modal': {
          '@apply form-input w-[334px] bg-transparent transition-[0.2s] text-[gray] pt-0 pb-2.5 px-0 border-b-[gray] border-[none] border-b border-solid focus:border-b-[gray] focus:border-b focus:border-solid disabled:text-[gray] disabled:border-[gray] items-center justify-center':
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
          '@apply flex justify-center relative w-[220px] h-[33px] overflow-hidden cursor-pointer mt-8': {},
        },
        '.select-box': {
          '@apply w-[220px] bg-transparent text-[white] text-base transition-[left] duration-[0.2s] ease-linear pt-0 pb-2.5 px-0 border-b-[white] border-[none] border-b border-solid':
            {},
        },
        '.select-box-narrow': {
          '@apply select-box w-[200px] bg-transparent text-[white] text-base transition-[left] duration-[0.2s] ease-linear pt-0 pb-2.5 px-0 mb-[0px] border-b-[white] border-[none] border-b border-solid':
            {},
        },
        '.select-container-wider': {
          '@apply flex justify-center relative w-[340px] h-[33px] overflow-hidden cursor-pointer mt-8': {},
        },
        '.select-box-wider': {
          '@apply w-[340px] bg-transparent text-[white] text-[16px] transition-[left] duration-[0.2s] ease-linear pt-0 pb-2.5 px-0 mb-[0px] border-b-[white] border-[none] border-b border-solid':
            {},
        },
      });
    }),
  ],
};
