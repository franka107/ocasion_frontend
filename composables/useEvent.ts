
// by convention, composable function names start with "use"
export function useEvent() {
    // state encapsulated and managed by the composable
    const page = ref(1)
    const sortOptions = ref('[]')
    const onSort = (sortObject: { [key: string]: string }[]) => {
        sortOptions.value = JSON.stringify(sortObject)
    }
      
    
  return { page,  sortOptions, onSort }
}