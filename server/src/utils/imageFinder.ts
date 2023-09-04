import WebSocket from 'ws';
import { randomUUID } from 'crypto';

interface Config {
  apiKey: string;
}

interface NewConnectionMessage {
  newConnection: Config;
}

interface NewTaskMessage {
  newTask: {
    taskUUID: string;
    promptText: string;
    numberResults: number;
    sizeId: number;
    taskType: number;
    promptLanguageId: number | null;
    offset: number;
  };
}

const wsUrl: string = 'wss://ws-api.diffusionmaster.com/v1/';

// Create a WebSocket connection
async function createWebSocketConnection(): Promise<WebSocket> {
  const ws = new WebSocket(wsUrl);

  ws.on('error', console.error);

  ws.on('open', () => {
    console.log('Connected to WebSocket server');
    sendNewConnectionMessage(ws);
  });

  ws.on('close', function close() {
    console.log('Disconnected');
  });

  return ws;
}

// Send a newConnection message
function sendNewConnectionMessage(ws: WebSocket) {
  const config: Config = {
    apiKey:
      'Cxhfyc4fRfj4CJbRxWz93Yb5fMbyAdqg8fQAHdJBTpFymEYKXPz48mQwz6DKbcEgzaJQg3RRrejceWZJ6xKh7yLhXAUSRAKJdwSY'
  };

  const newConnectionMessage: NewConnectionMessage = {
    newConnection: config
  };

  console.log('Sending newConnection message');
  ws.send(JSON.stringify(newConnectionMessage));
}

// Send a newTask message with a user-provided prompt
function sendNewTaskMessage(ws: WebSocket, prompt: string) {
  const newTaskMessage: NewTaskMessage = {
    newTask: {
      taskUUID: randomUUID(),
      promptText: prompt,
      numberResults: 6,
      sizeId: 1,
      taskType: 1,
      promptLanguageId: null,
      offset: 0
    }
  };
  console.log('Sending newTask message');
  ws.send(JSON.stringify(newTaskMessage));
}

export { createWebSocketConnection, sendNewTaskMessage, sendNewConnectionMessage };
