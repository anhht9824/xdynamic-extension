import type {
  RuntimeMessage,
  RuntimeResponse,
} from "../core/runtime/messageTypes";
import { logger } from "../utils";
import { detectionService } from "../services";

type MessageHandler = (
  message: RuntimeMessage,
  sendResponse: (response?: RuntimeResponse) => void
) => boolean | void;

const buildSuccessResponse = (): RuntimeResponse => ({ success: true });

const handlers: Partial<Record<RuntimeMessage["type"], MessageHandler>> = {
  UPDATE_STATE: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  DETECTION_RESULT: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  SCAN_PAGE: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  TOGGLE_EXTENSION: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  UPDATE_CONFIG: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  STATE_UPDATED: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  STATS_UPDATED: (_message, sendResponse) => {
    sendResponse(buildSuccessResponse());
    return false;
  },
  ANALYZE_IMAGE: (message, sendResponse) => {
    if (message.type !== "ANALYZE_IMAGE") return false;
    detectionService
      .analyzeImage(message.url, message.context)
      .then((result) =>
        sendResponse(result as unknown as RuntimeResponse)
      )
      .catch((error: Error) =>
        sendResponse({
          success: false,
          error: error.message,
        })
      );
    return true;
  },
  ANALYZE_IMAGE_DATA: (message, sendResponse) => {
    if (message.type !== "ANALYZE_IMAGE_DATA") return false;
    detectionService
      .analyzeImageWithData(message.imageData, message.url, message.context)
      .then((result) =>
        sendResponse(result as unknown as RuntimeResponse)
      )
      .catch((error: Error) =>
        sendResponse({
          success: false,
          error: error.message,
        })
      );
    return true;
  },
};

export const routeRuntimeMessage = (
  message: RuntimeMessage,
  sendResponse: (response?: RuntimeResponse) => void
): boolean | void => {
  const handler = handlers[message.type];

  if (!handler) {
    logger.debug("Unhandled runtime message", message);
    return false;
  }

  return handler(message, sendResponse);
};
