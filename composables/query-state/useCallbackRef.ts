import { ref, watchEffect, computed } from 'vue'

/**
 * A custom composable that converts a callback to a ref to avoid triggering re-renders
 * when passed as a prop or avoid re-executing effects when passed as a dependency
 */
export function useCallbackRef<T extends (...args: any[]) => unknown>(
  callback: T | undefined,
): T {
  const callbackRef = ref(callback)

  watchEffect(() => {
    callbackRef.value = callback
  })

  // Use computed to memoize the function
  const memoizedCallback = computed(() => {
    return ((...args) => callbackRef.value?.(...args)) as T
  })

  return memoizedCallback.value
}
