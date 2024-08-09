
// by convention, composable function names start with "use"
export function useOrganization() {
    // state encapsulated and managed by the composable
    const page = ref(1)
    const filterOptions = ref('[]')
    const sortOptions = ref('[]')
    const onSort = (sortObject: { [key: string]: string }[]) => {
        sortOptions.value = JSON.stringify(sortObject)
    }
      
    const onSearch = (item: {[key: string]: string }) => {
        const filters = [
          { field: 'rucNumber', type: 'like', value: item.rucNumber || '' },
          { field: 'name', type: 'like', value: item.name || '' },
        ]
        if(item.status) {
          filters.push({ field: 'status', type: 'equal', value: item.status })
        }
        filterOptions.value = JSON.stringify(filters)
    }
  return { page, filterOptions, sortOptions, onSort, onSearch }
}