import { io } from 'socket.io-client'

const { socketApiUrl } = useRuntimeConfig().public
export const socket = io(socketApiUrl)
