import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { getAccessToken } from '../services/api';

const WS_BASE = "ws://192.168.100.25:8000/ws/notifications/";

export default function useRealtimeNotifications() {
  useEffect(() => {
    let socket;
    let reconnectTimeout;

    const connect = async () => {
      const token = await getAccessToken();

      if (!token) {
        console.log("No token, skip websocket");
        return;
      }

      socket = new WebSocket(`${WS_BASE}?token=${token}`);

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "notification") {
          Toast.show({
            type: "info",
            text1: "Skillvine",
            text2: data.message,
          });
        }
      };

      socket.onerror = (error) => {
        console.log("WebSocket error");
      };

      socket.onclose = () => {
        console.log("WebSocket closed, reconnecting...");
        reconnectTimeout = setTimeout(connect, 3000); // auto reconnect
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);
}