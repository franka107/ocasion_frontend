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
  [OfferStatus.Rejected]: {
    name: 'Rechazado',
    color: 'red',
    flowPosition: 8,
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
    color: 'red',
    flowPosition: 14,
  },
  [OfferStatus.Delivered]: {
    name: 'Entregado',
    color: 'green',
    flowPosition: 15,
  },
  [OfferStatus.Concreted]: {
    name: 'Contretado',
    color: 'green',
    flowPosition: 16,
  },
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
    sortable: true,
  },
  {
    key: 'title',
    label: 'Bien',
    sortable: true,
  },
  {
    key: 'brandName',
    sortable: true,
    label: 'Marca',
  },
  {
    key: 'modelName',
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
    sortable: true,
  },
  {
    key: 'addressCity',
    label: 'Ubicación',
    sortable: true,
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
