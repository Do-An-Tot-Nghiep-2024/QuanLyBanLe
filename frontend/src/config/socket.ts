import Stomp, { Client } from "stompjs";
import SockJS from "sockjs-client";
const SOCKET = import.meta.env.VITE_SOCKET;
const connectToSocket = ({setMessages}: any) => {
    const socket = new SockJS(SOCKET);
    const client: Client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(
        "/topic/messages",
        (message: any) => {
          const chatMessage = JSON.parse(message.body);
          setMessages((prevMessages: any) => {
            if (
              !prevMessages.find(
                (msg: { id: any }) => msg.id === chatMessage.id
              )
            ) {
              return [...prevMessages, chatMessage];
            }
            return prevMessages;
          });
        },
        (err: string) => {
          console.log("Connection error: " + err);
        }
      );
    });
  };

export { connectToSocket };