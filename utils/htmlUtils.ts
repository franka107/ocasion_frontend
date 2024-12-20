export const htmlToText = (html: string | undefined): string => {
  if (!html) return ''

  // Crear un elemento temporal
  const temp = document.createElement('div')
  temp.innerHTML = html
  // Retornar solo el texto
  return temp.textContent || temp.innerText || ''
}
