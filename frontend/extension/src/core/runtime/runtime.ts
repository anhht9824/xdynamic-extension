import type { RuntimeMessage, RuntimeResponse } from "./messageTypes";

type MessageHandler = (
  message: RuntimeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: RuntimeResponse) => void
) => boolean | void;

export const sendRuntimeMessage = async <T = RuntimeResponse>(
  message: RuntimeMessage
): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    if (!chrome?.runtime?.sendMessage) {
      resolve(undefined);
      return;
    }

    chrome.runtime.sendMessage(message, (response) => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(response as T);
    });
  });

export const addRuntimeMessageListener = (
  handler: MessageHandler
): (() => void) => {
  if (!chrome?.runtime?.onMessage) {
    return () => undefined;
  }

  const wrapped: Parameters<typeof chrome.runtime.onMessage.addListener>[0] = (
    message,
    sender,
    sendResponse
  ) => handler(message as RuntimeMessage, sender, sendResponse);

  chrome.runtime.onMessage.addListener(wrapped);
  return () => chrome.runtime.onMessage.removeListener(wrapped);
};
