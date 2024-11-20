import type { HeaderItem, SearchItem } from '@/components/ui/custom-table/CustomTable.vue';
export const rechargeStatus = new Map<string, { name: string; color: string }>([
    ["EARRING", { name: "Pendiente", color: "orange" }],
    ["CONCRETED", { name: "Concretada", color: "blue" }],
  ]);
export const rechargeSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar cliente, operación o transacción',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },{
        key: 'name',
        type: 'text',
        placeholder: 'Fecha de transferencia',
        elementClass: 'min-w-[400px]',
        position: 2,
    },{
        key: 'name',
        type: 'text',
        placeholder: 'Fecha de solicitud',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
]
export const accountSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar n° de transacción o participante',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },
    {
        key: 'name',
        type: 'text',
        placeholder: 'Fecha de solicitud',
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
export const withdrawalRequestsSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar cliente, operación o transacción',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },
    {
        key: 'name',
        type: 'text',
        placeholder: 'Fecha de transferencia',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
    {
        key: 'name',
        type: 'text',
        placeholder: 'Fecha de solicitud',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
]
export const disbursementSearch: SearchItem[] = [
    {
        key: 'id',
        type: 'text',
        placeholder: 'Buscar banco',
        elementClass: 'max-w-[700px] w-full',
        position: 1,
    },
    {
        key: 'name',
        type: 'text',
        placeholder: 'Fecha de transferencia',
        elementClass: 'min-w-[400px]',
        position: 2,
    },
    {
        key: 'status',
        type: 'select',
        placeholder: 'Banco',
        items: [{ text: 'Todos', value: " " }],
        elementClass: 'min-w-[400px]',
        position: 2,
    }
]
export const rechargeHeader: HeaderItem[] = [
    {
        key: 'id',
        label: 'N° Transación',       
    }, 
    {
        key: 'dateOfRequest',
        label: 'Fec. Solicitud',
    }, 
    {
        key: 'contractStartDate',
        label: 'Fecha de inicio del contrato',
    },
    {
        key: 'operation',
        label: 'N° Operación',
    },
    {
        key: 'transfer',
        label: 'Fec. Transferencia',
    },
    {
        key: 'amount',
        label: 'Importe',
    },
    {
        key: 'livelihood',
        label: 'Sustento',
        align: 'center'
    },
    {
        key: 'status',
        label: 'Estado',
      },
    {
        key: 'actions',
        label: 'Acciones',
        sortable: false,
        align: 'center'
    }]
 export const accountHeader: HeaderItem[] = [
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
        key: 'bank',
        label: 'Banco',
        sortable: true,
    },
    {
        key: 'coin',
        label: 'Moneda',
    },
    {
        key: 'destinationAccount',
        label: 'N° de cueta destino',
    },
    {
        key: 'status',
        label: 'Estado',
    },
    {
        key: 'actions',
        label: 'Acciones',
        sortable: false,
        align: 'center'
    }]    
export const withdrawalRequeststHeader: HeaderItem[] = [
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
        key: 'transfer',
        label: 'Fec. Transferencia',
    },
    {
        key: 'amount',
        label: 'Importe',
    },
    {
        key: 'livelihood',
        label: 'Sustento',
        align: 'center'
    },
    {
        key: 'status',
        label: 'Estado',
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
        key: 'fullName',
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
        key: 'status',
        label: 'Estado',
    },
    {
        key: 'actions',
        label: 'Acciones',
        sortable: false,
        align: 'center'
    }]  
    