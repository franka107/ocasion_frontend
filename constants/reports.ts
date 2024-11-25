import type { HeaderItem, SearchItem } from '@/components/ui/custom-table/CustomTable.vue';

export const transactionsStatus = new Map<string, { name: string; color: string }>([
    ["AUTHORIZED", { name:  "Autorizada", color: "blue" }],
    ["EJECTED", { name: "Rechazada", color: "brown" }],
    ["ABANDONED", { name: "Abonada", color: "green" }],
]);
export const disbursementStatus = new Map<string, { name: string; color: string }>([
    ["PAYMENT CONFIRMED", { name:  "Abono confirmado", color: "blue" }],
    ["CANCELED", { name: "Anulada", color: "brown" }],
]);
export const validationStatus = new Map<string, { name: string; color: string }>([
    ["APPROVED", { name:  "Aprovada", color: "blue" }],
    ["REJECTED", { name: "Rechazada", color: "brown" }],
]);

export const transactionsSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar participante, n° transacción o  n° DOI',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },{
        key: 'typeOfOperation',
        type: 'text',
        placeholder: 'Fecha de operación',
        elementClass: 'min-w-[400px]',
        position: 2,
    },{
        key: 'status',
        type: 'text',
        placeholder: 'Estado',
        elementClass: 'min-w-[400px]',
        position: 3,
    },
]

export const disbursementSearch: SearchItem[] = [
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
        placeholder: 'Fecha de registro',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
    {
        key: 'status',
        type: 'select',
        placeholder: 'Banco',
        items: [{ text: 'Todos', value: " " }],
        elementClass: 'min-w-[400px]',
        position: 3,
    }
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
        key: 'lotCode',
        label: 'Cod lote',       
    }, 
    {
        key: 'requestAmount',
        label: 'Cant. solicitud retiro',
    },
    {
        key: 'dateOfRegistration',
        label: 'Fec. Registro',
    }, 
    {
        key: 'amount',
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
        key: 'dateOfRequest',
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
        key: 'coin',
        label: 'Moneda',
    },
    {
        key: 'account',
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
        key: 'income',
        label: 'Ingresos',
    }, 
    {
        key: 'expenses',
        label: 'Egresos',
    }, 
    {
        key: 'penalties',
        label: 'Penalidades',
    }, 
    {
        key: 'guaranteed',
        label: 'Garantizada',
    },
    {
        key: 'balance',
        label: 'Saldo',
    },  
    {
        key: 'pendingWithdrawal',
        label: 'Retiro pendiente',
    },  
    {
        key: 'pendingRecharge',
        label: 'Recarga pendiente',
        sortable: true,
    }]  