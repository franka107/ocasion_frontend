import type { HeaderItem, SearchItem } from '@/components/ui/custom-table/CustomTable.vue';
import { TransactionHistoryMotive, transactionHistoryMotiveMap } from '~/types/TransactionHistory';

export const transactionsStatus = new Map<string, { name: string; color: string }>([
    ["AUTHORIZED", { name:  "Autorizada", color: "blue" }],
    ["EJECTED", { name: "Rechazada", color: "brown" }],
    ["ABANDONED", { name: "Abonada", color: "green" }],
]);
export const disbursementStatus = new Map<string,{ name: string; color: string }>([
    ['PENDING', { name: 'Pendiente', color: 'orange' }],
    ['CONFIRMED_DEPOSIT', { name: 'Deposito confirmado', color: 'blue' }],
    ['ANNULED_DEPOSIT', { name: 'Deposito anulado', color: 'red' }],
  ])
export const validationStatus = new Map<string, { name: string; color: string }>([
    ['PENDING', { name: 'Pendiente', color: 'orange' }],
    ['REJECTED', { name: 'Rechazado', color: 'red' }],
    ['APPROVED', { name: 'Aprobado', color: 'blue' }],
]);
export const bankType = new Map<string, string>([
    ['BBVA', 'BBVA'],
    ['BCP', 'Bcp'],
    ['SCOTIABANK', 'Scotiabank'],
  ])
export const transactionsSearch: SearchItem[] = [
    {
        key: 'quickSearch',
        type: 'text',
        placeholder: 'Buscar participante, n° transacción o  n° DNI',
        width: 'max-w-sm w-full',
        elementClass: 'w-full',
    },{
        key: 'createdAt',
        type: 'date-range',
        placeholder: 'Fecha de operación',
        width: 'w-auto',
    },{
        key: 'status',
        type: 'select',
        items: [
            ...Array.from(transactionsStatus).map(([key, value]) => ({
              text: value.name,
              value: key,
            })),
            { text: 'Todos', value: ' ' },
        ],
        placeholder: 'Estado',
    },{
        key: 'motive',
        type: 'select',
        items: [
            ...Object.keys(transactionHistoryMotiveMap).map((key) => ({
              text: transactionHistoryMotiveMap[key as TransactionHistoryMotive].label,
              value: key,
            })),
            { text: 'Todos', value: ' ' },
        ],
        isHidden: true,
        placeholder: 'Tipo de operación',
    },
]

export const disbursementSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar participante, n° transacción o  n° DOI',
        position: 1,
    },
    {
        key: 'typeOfOperation',
        type: 'text',
        placeholder: 'Fecha de registro',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
    {
        key: 'bank',
        type: 'select',
        placeholder: 'Banco',
        items: [
            ...Array.from(bankType).map(([key, value]) => ({
              text: value,
              value: key,
            })),
            { text: 'Todos', value: ' ' },
          ],
        elementClass: 'min-w-[400px]',
        position: 3,
      },
]
export const validationSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar participante, n° transacción o  n° DOI',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },
    {
        key: 'typeOfOperation',
        type: 'text',
        placeholder: 'Fecha de solicitud',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
]
export const balanceSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar participane, documento',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },
    {
        key: 'typeOfOperation',
        type: 'text',
        placeholder: 'Periodo',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
]

export const transactionsHeader: HeaderItem[] = [
    {
        key: 'id',
        label: 'N° Transación',       
    }, 
    {
        key: 'fullName',
        label: 'Nombres y apellidos',
    },
    {
        key: 'document',
        label: 'Documento',
    }, 
    {
        key: 'typeOfOperation',
        label: 'Tipo de operación',
        sortable: true,
    }, 
    {
        key: 'dateOfOperation',
        label: 'Fecha de operación',
    },
    {
        key: 'amount',
        label: 'Monto',
    },
    {
        key: 'livelihood',
        label: 'Sustento',
        align: 'center'
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
        align: 'center'
    }]  
export const disbursementHeader: HeaderItem[] = [
    {
        key: 'id',
        label: 'Cod lote',       
    }, 
    {
        key: 'withdrawalRequestCount',
        label: 'Cant. solicitud retiro',
    },
    {
        key: 'createdAt',
        label: 'Fec. Registro',
    }, 
    {
        key: 'totalAmount',
        label: 'Monto a  desembolsar',
        sortable: true,
    },
    {
        key: 'bank',
        label: 'Banco',
        sortable: true,
    },
    {
        key: 'archive',
        label: 'Archivo',
        align: 'center',
    }, 
    {
        key: 'proofOfDisbursement',
        label: 'Comprobante desembolso',
        align: 'center',
    }, 
    {
        key: 'status',
        label: 'Estado',
        sortable: true,
    }]  
export const validationHeader: HeaderItem[] = [
    {
        key: 'id',
        label: 'N° Transación',       
    }, 
    {
        key: 'createdAt',
        label: 'Fec. Solicitud',
    }, 
    {
        key: 'fullName',
        label: 'Nombres y apellidos',
    },
    {
        key: 'document',
        label: 'Documento',
    },
    {
        key: 'bank',
        label: 'Banco',
        sortable: true,
    },
    {
        key: 'currency',
        label: 'Moneda',
    },
    {
        key: 'transactionNumber',
        label: 'N° de cueta',
    },
    {
        key: 'status',
        label: 'Estado',
        sortable: true,
    }] 

export const balanceHeader: HeaderItem[] = [
    {
        key: 'fullName',
        label: 'Nombres y apellidos',
    },
    {
        key: 'chargeBalance',
        label: 'Ingresos',
    }, 
    {
        key: 'dischargeBalance',
        label: 'Egresos',
    }, 
    {
        key: 'penaltyBalance',
        label: 'Penalidades',
    }, 
    {
        key: 'guaranteedBalance',
        label: 'Garantizada',
    },
    {
        key: 'availableBalance',
        label: 'Saldo',
    },  
    {
        key: 'pendingWithdrawalBalance',
        label: 'Retiro pendiente',
    },  
    {
        key: 'pendingRechargeBalance',
        label: 'Recarga pendiente',
    }]  
