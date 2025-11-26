import { logger } from "../utils";
import { addRuntimeMessageListener } from "../core/runtime/runtime";
import { routeRuntimeMessage } from "./router";
import type { RuntimeMessage } from "../core/runtime/messageTypes";

logger.info("Background script loaded");

const handleMessage = (
  message: RuntimeMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): boolean | void => {
  logger.debug("Background received message", message);
  return routeRuntimeMessage(message, sendResponse);
};

addRuntimeMessageListener(handleMessage);
