import { type VariantProps, cva } from 'class-variance-authority'

export { default as CustomChip } from './CustomChip.vue'

export const customChipVariants = cva(
  'p-[7px] rounded-[10px] h-[21px] w-fit text-sm leading-[14px] flex justify-center items-center',
  {
    variants: {
      variant: {
        default: 'text-blue bg-blue/10',
        destructive:
          'text-destructive bg-destructive/10',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'text-destructive bg-destructive/10',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
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
          destructive:
            'bg-destructive',
          outline:
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          secondary:
            'bg-destructive',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
        }
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  )
export type CustomChipVariants = VariantProps<typeof customChipVariants>
export type IconVariants = VariantProps<typeof iconVariants>
