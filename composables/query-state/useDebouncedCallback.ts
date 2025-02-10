import { ref, onUnmounted, computed } from 'vue'
import { useCallbackRef } from '@/composables/query-state/useCallbackRef'

/**
 * Vue composable for debouncing function calls
 */
export function useDebouncedCallback<T extends (...args: any[]) => unknown>(
  callback: T,
  delay: number,
) {
  const handleCallback = useCallbackRef(callback)
  const debounceTimerRef = ref<number>(0)

  // Cleanup on component unmount
  onUnmounted(() => {
    window.clearTimeout(debounceTimerRef.value)
  })

  const debouncedFn = computed(() => {
    return (...args: Parameters<T>) => {
      window.clearTimeout(debounceTimerRef.value)
      debounceTimerRef.value = window.setTimeout(
        () => handleCallback(...args),
        delay,
      )
    }
  })

  return debouncedFn.value
}
