import { ref, onMounted, onUnmounted } from 'vue'
import {
  io,
  Socket,
  type ManagerOptions,
  type SocketOptions,
} from 'socket.io-client'
import { consola, createConsola } from 'consola'
import type { OfferDto } from '~/types/Offer'

export function useSocketPlaceBidService() {
  const { user } = useUserSession()
  const config = useRuntimeConfig()
  const socketOptions: Partial<ManagerOptions & SocketOptions> = {}
  if (user.value) {
    socketOptions.extraHeaders = {
      Authorization: `Bearer ${user.value.token}`,
    }
  }
  const socketService = useSocket(
    config.public.socketPathPlaceBid,
    socketOptions,
  )

  const onNewBidPlaced = (callback: (payload: OfferDto) => void) => {
    socketService.onEvent('new-bid-placed', (offer: OfferDto) => {
      consola.info('New bid placed:', offer)
      callback(offer)
    })
  }

  function joinOfferRoom(roomId: string) {
    socketService.socket.emit('place-bid-join', roomId)
    consola.info(`Joined room: ${roomId}`)
  }

  function leaveOfferRoom(roomId: string) {
    socketService.socket.emit('place-bid-leave', roomId)
    consola.info(`Left room: ${roomId}`)
  }

  return {
    ...socketService,
    joinOfferRoom,
    leaveOfferRoom,
    onNewBidPlaced,
  }
}
