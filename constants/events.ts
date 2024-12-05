import { ComparisonOperator } from './offer'
import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
import { EventStatus, EventType } from '~/types/Event'
import type { ViewType } from '~/utils/view-types'

export const eventType = new Map<string, string>([
  ['HAND_OVER', 'Puesta en mano'],
  ['AUCTION', 'Subasta'],
])
export const eventStatusRecord: Record<
  EventStatus,
  { name: string; color: string; flowPosition: number }
> = {
  [EventStatus.Created]: {
    name: 'Creado',
    color: 'purple',
    flowPosition: 0,
  },
  [EventStatus.InDebate]: {
    name: 'En debate',
    color: 'orange',
    flowPosition: 1,
  },
  [EventStatus.ReadyToPublish]: {
    name: 'Listo para publicar',
    color: 'green',
    flowPosition: 2,
  },
  [EventStatus.Published]: {
    name: 'Publicado',
    color: 'blue',
    flowPosition: 3,
  },
  [EventStatus.InProgress]: {
    name: 'En progreso',
    color: 'orange',
    flowPosition: 4,
  },
  [EventStatus.Cancelled]: {
    name: 'Cancelado',
    color: 'red',
    flowPosition: 5,
  },

  [EventStatus.Finished]: {
    name: 'Finalizado',
    color: 'brown',
    flowPosition: 6,
  },
  [EventStatus.Completed]: {
    name: 'Completado',
    color: 'blue',
    flowPosition: 7,
  },
}

const getSortedEventStatus = (): EventStatus[] => {
  return Object.entries(eventStatusRecord)
    .sort(([, a], [, b]) => a.flowPosition - b.flowPosition) // Ordenar por flowPosition
    .map(([status]) => status as EventStatus) // Obtener solo las claves como OfferStatus
}

export const eventStatusCheckPosition = (
  eventStatus: EventStatus,
  comparedEventStatus: EventStatus,
  operator: ComparisonOperator,
): boolean => {
  const eventStatusFlowPositions = getSortedEventStatus()
  const position1 = eventStatusFlowPositions.indexOf(eventStatus)
  const position2 = eventStatusFlowPositions.indexOf(comparedEventStatus)

  switch (operator) {
    case ComparisonOperator.Greater:
      return position1 > position2
    case ComparisonOperator.Less:
      return position1 < position2
    case ComparisonOperator.Equal:
      return position1 === position2
    case ComparisonOperator.GreaterOrEqual:
      return position1 >= position2
    case ComparisonOperator.LessOrEqual:
      return position1 <= position2
    default:
      throw new Error(`Unsupported operator: ${operator}`)
  }
}

export const eventTimes = new Map<string, string>([
  // Temporal
  ['1', '1:00'],
  ['2', '2:00'],
  ['3', '3:00'],
  ['4', '4:00'],
  ['5', '5:00'],
  ['6', '6:00'],
  ['7', '7:00'],
  // ----
  ['8', '8:00'],
  ['9', '9:00'],
  ['10', '10:00'],
  ['11', '11:00'],
  ['12', '12:00'],
  ['13', '13:00'],
  ['14', '14:00'],
  ['15', '15:00'],
  ['16', '16:00'],
  ['17', '17:00'],
  // Temporal
  ['18', '18:00'],
  ['19', '19:00'],
  ['20', '20:00'],
  ['21', '21:00'],
  ['22', '22:00'],
  ['23', '23:00'],
  ['24', '24:00'],
  // ----
])
export const goodType = new Map<string, string>([
  ['REAL_ESTATE', 'Inmuebles'],
  ['CARS_AND_MOTORCYCLES', 'Autos y motos'],
  ['TRUCKS_AND_BUSES', 'Camiones y buses'],
  [
    'CONSTRUCTION_AGRICULTURAL_MACHINERY',
    'Maquinaria de Construcción y/o Agrícola',
  ],
  ['SCRAP_MATERIAL', 'Chatarra, materiales y residuos'],
  ['INDUSTRIAL_MACHINERY_AND_EQUIPMENT', 'Industrial, maquinaria y equipo'],
])

export const eventSearch = (viewType: ViewType): SearchItem[] => {
  return [
    {
      key: 'name',
      type: 'text',
      placeholder: 'Buscar por nombre',
      position: 1,
    },
    {
      key: 'id',
      type: 'text',
      placeholder: 'Buscar por codigo',
      position: 1,
    },

    ...(viewType === 'organization'
      ? []
      : [
          {
            key: 'organizationName',
            type: 'text' as any,
            placeholder: 'Buscar por organización',
            position: 1,
          },
        ]),
    {
      key: 'goodType',
      type: 'select',
      placeholder: 'Filtrar por tipo de bien',
      items: [
        ...Array.from(goodType).map(([key, value]) => ({
          text: value,
          value: key,
        })),
        { text: 'Todos', value: ' ' },
      ],
      elementClass: 'min-w-[400px]',
      position: 2,
    },
    {
      key: 'type',
      type: 'select',
      placeholder: 'Filtrar por tipo de subasta',
      items: [
        ...Array.from(eventType).map(([key, value]) => ({
          text: value,
          value: key,
        })),
        { text: 'Todos', value: ' ' },
      ],
      elementClass: 'min-w-[400px]',
      position: 2,
    },
    {
      key: 'status',
      type: 'select',
      placeholder: 'Filtrar por estado',
      items: [
        ...Array.from(eventStatusRecord).map(([key, value]) => ({
          text: value.name,
          value: key,
        })),
        { text: 'Todos', value: ' ' },
      ],
      elementClass: 'min-w-[400px]',
      position: 3,
    },
  ]
}
export const eventListHeaders = (viewType: ViewType): HeaderItem[] => {
  return [
    ...(viewType === 'organization'
      ? []
      : [
          {
            key: 'organization.name',
            label: 'Organización',
            sortable: true,
          },
        ]),
    {
      key: 'id',
      label: 'Código',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Evento',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Tipo de evento',
    },
    {
      key: 'goodType',
      label: 'Tipo de bien',
    },
    {
      key: 'createdAt',
      label: 'Creación',
      sortable: true,
    },
    {
      key: 'startDate',
      label: 'Fecha de inicio',
      sortable: true,
    },

    {
      key: 'endDate',
      label: 'Fecha de cierre',
      sortable: true,
    },
    {
      key: 'closingTime',
      label: 'Hora de cierre',
      sortable: true,
    },
    {
      key: 'expectedAmount',
      label: 'Monto Esperado',
      sortable: true,
    },
    {
      key: 'offerCount',
      label: 'Cantidad de ofertas',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'center',
    },
  ]
}

export const years = [
  {
    id: 1960,
    name: '1960',
  },
  {
    id: 1961,
    name: '1961',
  },
  {
    id: 1962,
    name: '1962',
  },
  {
    id: 1963,
    name: '1963',
  },
  {
    id: 1964,
    name: '1964',
  },
  {
    id: 1965,
    name: '1965',
  },
  {
    id: 1966,
    name: '1966',
  },
  {
    id: 1967,
    name: '1967',
  },
  {
    id: 1968,
    name: '1968',
  },
  {
    id: 1969,
    name: '1969',
  },
  {
    id: 1970,
    name: '1970',
  },
  {
    id: 1971,
    name: '1971',
  },
  {
    id: 1972,
    name: '1972',
  },
  {
    id: 1973,
    name: '1973',
  },
  {
    id: 1974,
    name: '1974',
  },
  {
    id: 1975,
    name: '1975',
  },
  {
    id: 1976,
    name: '1976',
  },
  {
    id: 1977,
    name: '1977',
  },
  {
    id: 1978,
    name: '1978',
  },
  {
    id: 1979,
    name: '1979',
  },
  {
    id: 1980,
    name: '1980',
  },
  {
    id: 1981,
    name: '1981',
  },
  {
    id: 1982,
    name: '1982',
  },
  {
    id: 1983,
    name: '1983',
  },
  {
    id: 1984,
    name: '1984',
  },
  {
    id: 1985,
    name: '1985',
  },
  {
    id: 1986,
    name: '1986',
  },
  {
    id: 1987,
    name: '1987',
  },
  {
    id: 1988,
    name: '1988',
  },
  {
    id: 1989,
    name: '1989',
  },
  {
    id: 1990,
    name: '1990',
  },
  {
    id: 1991,
    name: '1991',
  },
  {
    id: 1992,
    name: '1992',
  },
  {
    id: 1993,
    name: '1993',
  },
  {
    id: 1994,
    name: '1994',
  },
  {
    id: 1995,
    name: '1995',
  },
  {
    id: 1996,
    name: '1996',
  },
  {
    id: 1997,
    name: '1997',
  },
  {
    id: 1998,
    name: '1998',
  },
  {
    id: 1999,
    name: '1999',
  },
  {
    id: 2000,
    name: '2000',
  },
  {
    id: 2001,
    name: '2001',
  },
  {
    id: 2002,
    name: '2002',
  },
  {
    id: 2003,
    name: '2003',
  },
  {
    id: 2004,
    name: '2004',
  },
  {
    id: 2005,
    name: '2005',
  },
  {
    id: 2006,
    name: '2006',
  },
  {
    id: 2007,
    name: '2007',
  },
  {
    id: 2008,
    name: '2008',
  },
  {
    id: 2009,
    name: '2009',
  },
  {
    id: 2010,
    name: '2010',
  },
  {
    id: 2011,
    name: '2011',
  },
  {
    id: 2012,
    name: '2012',
  },
  {
    id: 2013,
    name: '2013',
  },
  {
    id: 2014,
    name: '2014',
  },
  {
    id: 2015,
    name: '2015',
  },
  {
    id: 2016,
    name: '2016',
  },
  {
    id: 2017,
    name: '2017',
  },
  {
    id: 2018,
    name: '2018',
  },
  {
    id: 2019,
    name: '2019',
  },
  {
    id: 2020,
    name: '2020',
  },
  {
    id: 2021,
    name: '2021',
  },
  {
    id: 2022,
    name: '2022',
  },
  {
    id: 2023,
    name: '2023',
  },
  {
    id: 2024,
    name: '2024',
  },
]
