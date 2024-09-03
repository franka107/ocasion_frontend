import { type VariantProps, cva } from 'class-variance-authority'
export const inputVariant = cva(
    'flex h-10 w-full rounded-md border border-[#0B3859] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-default disabled:border-[#0B385950] disabled:text-[#0A0A0A50]',
    {
      variants: {
        size: {
          base: 'h-10 text-sm',
          lg: 'h-[52px] text-base',
        }
      },
    },
  )
export const labelVariant = cva(
    'absolute text-sm px-1 mx-2 bg-white transition-all pointer-events-none whitespace-nowrap text-ellipsis overflow-hidden max-w-[calc(100%_-_12px)]',
    {
      variants: {
        size: {
          base: 'text-sm',
          lg: 'text-base',
        }
      },
    },
)
  
export type InputVariants = VariantProps<typeof inputVariant>
  


export { default as CustomInput } from './CustomInput.vue'
