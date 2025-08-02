import { setPlanFromSocket, markPlanGenerationComplete } from "./AiplanSlice";
import { addChatMessage } from "./chatSlice"; // make sure this exists

let editSocket = null;

export function connectToEditPlanWebSocket(dispatch, planId, prompt, token) {
  // Close existing connection if any
  if (editSocket && editSocket.readyState === WebSocket.OPEN) {
    editSocket.close();
  }

  const url = `ws://localhost:8000/ai/${planId}?token=${token}`;
  editSocket = new WebSocket(url);

  editSocket.onopen = () => {
    console.log("[EditWS] Connected to edit WebSocket");
    const message = { prompt: prompt };
    console.log("Socket: ", editSocket);
    console.log("[WS] Sending prompt:", message);
    editSocket.send(JSON.stringify(message));
  };

  editSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("[EditWS] Received message:", data);

      switch (data.type) {
        case "plan_created":
        case "step_added":
        case "step_removed":
        case "step_reordered":
        case "day_added":
        case "days_removed":
          if (data.response) {
            dispatch(setPlanFromSocket(data.response));
          }
          break;

        case "completed":
        case "complete":
          dispatch(markPlanGenerationComplete());
          if (data.response) {
            dispatch(
              addChatMessage({sender:"ai", message: data.response})
            );
          }
          // Optionally close socket here if edit is one-time
          editSocket.close();
          editSocket = null;
          break;

        case "status":
        case "progress":
          console.log("[EditWS] Status update:", data.message || data.response);
          break;

        // case "error":
        //   console.error("[EditWS] Server error:", data.message || data.response);
        //   break;

        default:
          console.log("[EditWS] Unknown message type:", data.type);
          break;
      }
    } catch (err) {
      console.error("[EditWS] Failed to parse:", err);
      console.log("[EditWS] Raw:", event.data);
    }
  };

  editSocket.onerror = (err) => {
    console.error("[EditWS] WebSocket error:", err);
  };

  editSocket.onclose = (event) => {
    console.log("[EditWS] Connection closed:", event.code, event.reason);
    editSocket = null;
  };

  return () => {
    console.log("[EditWS] Cleaning up connection");
    if (editSocket && editSocket.readyState === WebSocket.OPEN) {
      editSocket.close();
    }
    editSocket = null;
  };
}

export function disconnectEditWebSocket() {
  if (editSocket) {
    if (editSocket.readyState === WebSocket.OPEN) {
      editSocket.close();
    }
    if (editSocket === socket) {
      editSocket = null;
    }
  }
}

export function getEditWebSocketState() {
  if (!editSocket) return "CLOSED";
  switch (editSocket.readyState) {
    case WebSocket.CONNECTING:
      return "CONNECTING";
    case WebSocket.OPEN:
      return "OPEN";
    case WebSocket.CLOSING:
      return "CLOSING";
    case WebSocket.CLOSED:
      return "CLOSED";
    default:
      return "UNKNOWN";
  }
}

export function sendEditWebSocketMessage(message) {
  if (editSocket && editSocket.readyState === WebSocket.OPEN) {
    console.log("[EditWS] Sending message:", message);
    editSocket.send(JSON.stringify(message));
    return true;
  } else {
    console.warn("[EditWS] Cannot send message, socket not ready");
    return false;
  }
}
