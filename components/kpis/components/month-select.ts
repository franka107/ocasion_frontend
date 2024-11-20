import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns'
import type { FilterFormSchema } from './filter-form-schema'

export enum MonthSelect {
  ThisMonth = 'THIS_MONTH',
  Last5Months = 'LAST_5_MONTHS',
  RangeOfMonths = 'RANGE_OF_MONTHS',
}

export const monthSelectMap: Record<MonthSelect, { label: string }> = {
  [MonthSelect.ThisMonth]: {
    label: 'Este mes',
  },
  [MonthSelect.Last5Months]: {
    label: 'Ultimos 5 meses',
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

    case MonthSelect.Last5Months:
      return {
        monthSelect,
        rangeStart: formatDate(startOfMonth(subMonths(today, 5))),
        rangeEnd: formatDate(endOfMonth(today)),
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
        // startDate: startOfMonth(rangeStart),
        // endDate: endOfMonth(rangeEnd),
      }

    default:
      throw new Error('Opción de MonthSelect no válida')
  }
}
