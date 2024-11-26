import { endOfMonth, format, startOfMonth, subMonths, addMonths } from 'date-fns'  // Añadido addMonths
import type { FilterFormSchema } from './filter-form-schema'

export enum MonthSelect {
  ThisMonth = 'THIS_MONTH',
  NextTwoMonths = 'NEXT_2_MONTHS',  
  RangeOfMonths = 'RANGE_OF_MONTHS',
}

export const monthSelectMap: Record<MonthSelect, { label: string }> = {
  [MonthSelect.ThisMonth]: {
    label: 'Este mes',
  },
  [MonthSelect.NextTwoMonths]: {
    label: 'Próximos 2 meses',
  },
  [MonthSelect.RangeOfMonths]: {
    label: 'Rango de meses',
  },
}

export function getCalculatedFilterFormSchema(
  monthSelect: MonthSelect,
  rangeStart?: string,
  rangeEnd?: string,
): FilterFormSchema {
  const today = new Date()

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')

  switch (monthSelect) {
    case MonthSelect.ThisMonth:
      return {
        monthSelect,
        rangeStart: formatDate(startOfMonth(today)),
        rangeEnd: formatDate(endOfMonth(today)),
      }

    case MonthSelect.NextTwoMonths:
      return {
        monthSelect,
        rangeStart: formatDate(startOfMonth(today)),
        rangeEnd: formatDate(endOfMonth(addMonths(today, 2))),
      }

    case MonthSelect.RangeOfMonths:
      if (!rangeStart || !rangeEnd) {
        throw new Error(
          'rangeStart y rangeEnd son obligatorios para RangeOfMonths',
        )
      }
      return {
        monthSelect,
        rangeStart,
        rangeEnd,
      }

    default:
      throw new Error('Opción de MonthSelect no válida')
  }
}
