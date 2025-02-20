export const getBackendError = (error: any) => {
  const eMsg =
    error.data?.errors?.[0].message ||
    error.data.message ||
    'Ocurrio un error en la operación, intentalo más tarde'
  return eMsg
}
