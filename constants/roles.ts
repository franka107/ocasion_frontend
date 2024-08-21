import type { HeaderItem } from '@/components/ui/custom-table/CustomTable.vue';

export const roleHeader: HeaderItem[] = [
  {
    key: 'roleName',
    label: 'Nombre del rol',
    sortable: true,
    search: {
      type: 'text',
      placeholder: 'Buscar rol',
      position: 1,
    }
  },
  {
    key: 'quantity',
    label: 'Cant.',
    sortable: true,
    
  },
  {
    key: 'description',
    label: 'Descripción',
    sortable: true,
   
  },
  {
    key: 'creationDate',
    label: 'Fecha de creación',
    sortable: true,
    
  },
  {
    key: 'lastModifiedDate',
    label: 'Última modificación',
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
  }
];