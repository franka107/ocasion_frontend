import { ref, onMounted, watch } from "vue";

export function useClient<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) {
  const result = store(callback) as F;
  const data = ref<F | undefined>();

  onMounted(() => {
    data.value = result;
  });

  watch(
    () => result,
    (newResult) => {
      data.value = newResult;
    }
  );

  return data;
}
