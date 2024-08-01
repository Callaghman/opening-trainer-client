// src/WebSocket.js

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect() {
    const url = 'ws://localhost:8000';
    this.socketRef = new WebSocket(url);

    this.socketRef.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    this.socketRef.onclose = () => {
      console.log('WebSocket connection closed');
      this.connect(); // Reconnect on close
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const { type } = parsedData;
    console.log(type);
    if (this.callbacks[type]) {
      this.callbacks[type](parsedData);
    } else {
      console.error(`No callback registered for message type: ${type}`);
    }
  }

  addCallbacks(moveCallback) {
    this.callbacks['bestMove'] = moveCallback;
  }

  sendMessage(data) {
    this.socketRef.send(JSON.stringify(data)); // Convert to JSON string before sending
  }

  state() {
    return this.socketRef.readyState;
  }

  waitForSocketConnection(callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (socket.readyState === 1) {
        console.log('Connection is made');
        if (callback != null) {
          callback();
        }
      } else {
        console.log('Waiting for connection...');
        recursion(callback);
      }
    }, 1); // wait 1 millisecond for the connection...
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
