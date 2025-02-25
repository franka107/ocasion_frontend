import { ref, onMounted, onUnmounted } from 'vue'
import {
  io,
  Socket,
  type ManagerOptions,
  type SocketOptions,
} from 'socket.io-client'
import { socket } from '~/components/socket'

export function useSocket(
  namespace: string,
  options: Partial<ManagerOptions & SocketOptions> = {},
) {
  const { socketApiUrl, socketUri, socketPath, apiUrl } =
    useRuntimeConfig().public
  const socketOptions = {
    ...options,
  }
  if (socketPath && socketPath !== '') {
    socketOptions.path = socketPath
  }
  // Old implementation
  // const socket: Socket = io(`https://api.dev.deocasion.pe/place-bid`, {
  //  path: '/auction_central/socket.io',
  //  transports: ['websocket'],
  //  ...socketOptions,
  // })
  const socket: Socket = io(`https://api.dev.deocasion.pe`, {
    path: '/websocket-place-bid',
    upgrade: false,
    forceNew: true,
    transports: ['websocket'],
    ...socketOptions,
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
