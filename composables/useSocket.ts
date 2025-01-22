import { ref, onMounted, onUnmounted } from 'vue'
import {
  io,
  Socket,
  type ManagerOptions,
  type SocketOptions,
} from 'socket.io-client'

export function useSocket(
  namespace: string,
  options: Partial<ManagerOptions & SocketOptions> = {},
) {
  const { socketApiUrl } = useRuntimeConfig().public
  const socket: Socket = io(`${socketApiUrl}/${namespace}`, {
    transports: ['websocket'], // Usa WebSocket como transporte principal
    ...options,
  })

  const isConnected = ref(false)

  // Eventos básicos
  onMounted(() => {
    socket.on('connect', () => {
      isConnected.value = true
      console.info(`Connected to namespace: ${namespace}`)
    })

    socket.on('disconnect', () => {
      isConnected.value = false
      console.info('Disconnected from WebSocket')
    })
  })

  onUnmounted(() => {
    socket.disconnect()
  })

  // Método para escuchar eventos
  function onEvent(event: string, callback: (payload: any) => void) {
    socket.on(event, callback)
  }

  // Método para emitir eventos
  function emitEvent(event: string, payload: any) {
    socket.emit(event, payload)
  }

  return {
    isConnected,
    onEvent,
    emitEvent,
    socket,
  }
}
