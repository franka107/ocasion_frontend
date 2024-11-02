import { io } from "socket.io-client";
import Auth from "~/pages/auth.vue";
// import { socket } from "./socket";
export const useSocketIo = () => {
    const {  user } = useUserSession();
    const socket = io("https://pango.dev",{
        extraHeaders: {
            Authorization: `Bearer ${user.value?.token}`
        }
    });
    const isConnected = ref(false);
    const transport = ref("N/A");

    if (socket.connected) {
    onConnect();
    }

    function onConnect() {
    isConnected.value = true;
    transport.value = socket.io.engine.transport.name;
    console.log("connected", socket.io.engine.transport.name);
    
    socket.io.engine.on("upgrade", (rawTransport) => {
        transport.value = rawTransport.name;
    });
    }

    function onDisconnect() {
    isConnected.value = false;
    transport.value = "N/A";
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    onBeforeUnmount(() => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    });
    return { socket };
}
