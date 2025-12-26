import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | undefined;

type PaddleEventHandler = (data: any) => void;

export const initPaddle = async (onEvent?: PaddleEventHandler) => {
  const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

  if (!token || token.includes('placeholder')) {
    console.warn("Paddle Client Token is missing or invalid.");
    return null;
  }

  try {
    paddleInstance = await initializePaddle({ 
      token: token,
      eventCallback: (data) => {
        if (onEvent) onEvent(data);
      }
    });
    return paddleInstance;
  } catch (error) {
    console.error("Failed to initialize Paddle:", error);
    return null;
  }
};

export const getPaddle = () => paddleInstance;
