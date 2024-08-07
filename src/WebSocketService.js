// src/WebSocketService.js

class WebSocketService {
  static instance = null;
  callbacks = {};
  messageQueue = [];

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    this.connect();
  }

  connect() {
    if (this.socketRef && this.socketRef.readyState !== WebSocket.CLOSED) {
      console.log('WebSocket already open or connecting.');
      return;
    }

    const url = 'ws://localhost:8000';
    this.socketRef = new WebSocket(url);

    this.socketRef.onopen = () => {
      console.log('WebSocket connection opened');
      this.flushMessageQueue();
    };

    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    this.socketRef.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(() => this.connect(), 5000); // Attempt to reconnect after 5 seconds
    };
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
      this.socketRef.send(JSON.stringify(this.messageQueue.shift()));
    }
  }

  sendMessage(data) {
    if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
      this.socketRef.send(JSON.stringify(data));
    } else {
      console.log('Queueing message:', data);
      this.messageQueue.push(data); // Queue the message if the connection is not open
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const { type } = parsedData;
    if (this.callbacks[type]) {
      this.callbacks[type](parsedData);
    } else {
      console.error(`No callback registered for message type: ${type}`);
    }
  }

  addCallback(type, callback) {
    this.callbacks[type] = callback;
  }

  state() {
    return this.socketRef ? this.socketRef.readyState : WebSocket.CLOSED;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;

