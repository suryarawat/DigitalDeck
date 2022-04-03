import io from 'socket.io-client';
import { api_url } from './App.vue';

const socket = io(api_url, {
  transports: ["websocket"]
});
export default socket
