import type {
  HeaderItem,
  SearchItem,
} from '@/components/ui/custom-table/CustomTable.vue'
import { OfferStatus } from '~/types/Offer'

export const offerStatusRecord: Record<
  OfferStatus,
  { name: string; color: string; flowPosition: number }
> = {
  [OfferStatus.Created]: {
    name: 'Nuevo',
    color: 'purple',
    flowPosition: 1,
  },
  [OfferStatus.Debated]: {
    name: 'Debatido',
    color: 'orange',
    flowPosition: 2,
  },
  [OfferStatus.Confirmed]: {
    name: 'Confirmado',
    color: 'green',
    flowPosition: 3,
  },
  [OfferStatus.Retired]: {
    name: 'Retirado',
    color: 'red',
    flowPosition: 4,
  },
  [OfferStatus.InProgress]: {
    name: 'En curso',
    color: 'purple',
    flowPosition: 4,
  },
  [OfferStatus.Cancelled]: {
    name: 'Cancelado',
    color: 'brown',
    flowPosition: 6,
  },
  [OfferStatus.InReview]: {
    name: 'En revisión',
    color: 'orange',
    flowPosition: 7,
  },

  [OfferStatus.InDepositReview]: {
    name: 'En revisión de depósito',
    color: 'red',
    flowPosition: 9,
  },
  [OfferStatus.PendingDeposit]: {
    name: 'Abono pendiente',
    color: 'blue',
    flowPosition: 10,
  },
  [OfferStatus.ObservedDeposit]: {
    name: 'Abono observado',
    color: 'orange',
    flowPosition: 11,
  },
  [OfferStatus.ConfirmedDeposit]: {
    name: 'Abono confirmado',
    color: 'green',
    flowPosition: 12,
  },
  [OfferStatus.InTransferOfGood]: {
    name: 'En transferencia de bienes',
    color: 'purple',
    flowPosition: 13,
  },
  [OfferStatus.PendingOfDelivery]: {
    name: 'Pendiente de entrega',
    color: 'green',
    flowPosition: 14,
  },
  [OfferStatus.Delivered]: {
    name: 'Entregado',
    color: 'green',
    flowPosition: 15,
  },
  [OfferStatus.Concreted]: {
    name: 'Concretado',
    color: 'green',
    flowPosition: 16,
  },
  [OfferStatus.DebatedBid]: {
    name: 'Puja debatida',
    color: 'green',
    flowPosition: 17,
  },
  [OfferStatus.Rejected]: {
    name: 'Rechazado',
    color: 'red',
    flowPosition: 18,
  },
}
export enum ComparisonOperator {
  Greater = 'greater',
  Less = 'less',
  Equal = 'equal',
  GreaterOrEqual = 'greaterOrEqual',
  LessOrEqual = 'lessOrEqual',
}

const getSortedOfferStatus = (): OfferStatus[] => {
  return Object.entries(offerStatusRecord)
    .sort(([, a], [, b]) => a.flowPosition - b.flowPosition) // Ordenar por flowPosition
    .map(([status]) => status as OfferStatus) // Obtener solo las claves como OfferStatus
}

export const offerStatusCheckPosition = (
  offerStatus: OfferStatus,
  comparedOfferStatus: OfferStatus,
  operator: ComparisonOperator,
): boolean => {
  const offerStatusFlowPositions = getSortedOfferStatus()
  const position1 = offerStatusFlowPositions.indexOf(offerStatus)
  const position2 = offerStatusFlowPositions.indexOf(comparedOfferStatus)

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

export const offerSearch: SearchItem[] = [
  {
    key: 'title',
    type: 'text',
    placeholder: 'Buscar oferta',
    elementClass: 'min-w-[400px]',
    position: 2,
  },
]
export const offerHeader: HeaderItem[] = [
  {
    key: 'id',
    label: 'N°',
    sortable: false,
    align: 'center',
  },
  {
    key: 'title',
    label: 'Bien',
    sortable: true,
  },
  {
    key: 'brandName',
    realKey: 'carBrand.name',
    sortable: true,
    label: 'Marca',
  },
  {
    key: 'modelName',
    realKey: 'carModel.name',
    label: 'Modelo',
    sortable: true,
  },
  {
    key: 'year',
    label: 'Año',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
  },
  {
    key: 'attachedFiles',
    label: 'Fotos',
    sortable: false,
  },
  {
    key: 'addressCity',
    label: 'Ubicación',
    sortable: false,
  },
  {
    key: 'appraisal',
    label: 'Tasación',
    align: 'right',
    sortable: true,
  },
  {
    key: 'initialValue',
    label: 'Valor inicial',
    align: 'right',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center',
  },
]
