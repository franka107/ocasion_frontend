import { optional, z } from 'zod'
import { MonthSelect } from './month-select'

export const filterFormSchema = z
  .object({
    monthSelect: z.enum(Object.values(MonthSelect) as [string, ...string[]]),
    rangeStart: z.string().optional(),
    rangeEnd: z.string().optional(),
    organizations: z
      .array(z.string())
      .min(1, 'Mínimo una organización es requerida')
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Si el mes seleccionado es "RangeOfMonths", los campos rangeStart y rangeEnd son requeridos
    if (data.monthSelect === MonthSelect.RangeOfMonths) {
      if (!data.rangeStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rangeStart'],
          message: 'El inicio del rango es obligatorio.',
        })
      }

      if (!data.rangeEnd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rangeEnd'],
          message: 'El fin del rango es obligatorio.',
        })
      }
    }
  })

export type FilterFormSchema = z.infer<typeof filterFormSchema>
