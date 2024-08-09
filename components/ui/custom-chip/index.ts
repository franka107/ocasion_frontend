import { type VariantProps, cva } from 'class-variance-authority'

export { default as CustomChip } from './CustomChip.vue'

export const customChipVariants = cva(
  'p-[7px] rounded-[10px] h-[21px] w-fit text-sm leading-[14px] flex justify-center items-center',
  {
    variants: {
      variant: {
        default: 'text-blue bg-blue/10',
        blue: 'text-blue bg-blue/10',
        purple: 'text-purple bg-purple/10',
        red: 'text-[#DB2777] bg-[#DB2777]/10',
        green: 'text-green bg-green/10',
        orange: 'text-orange bg-orange/10',
        brown: 'text-brown bg-brown/10',
        destructive:
          'text-destructive bg-destructive/10',
      }
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export const iconVariants = cva(
    'rounded-full w-[6px] h-[6px] flex items-center justify-center',
    {
      variants: {
        variant: {
          default: 'bg-blue',
          blue: 'bg-blue',
          purple: 'bg-purple',
          red: 'bg-[#DB2777]',
          green: 'bg-green',
          orange: 'bg-orange',
          brown: 'bg-brown',
          destructive:
            'bg-destructive',
        }
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  )
export type CustomChipVariants = VariantProps<typeof customChipVariants>
export type IconVariants = VariantProps<typeof iconVariants>
