import { setPlanFromSocket, markPlanGenerationComplete, markPlanGenerationError } from "./PlanSlice";
import axiosInstance from "../../services/axiosInstances";

let socket = null;

export async function connectToPlanWebSocket(dispatch, prompt) {
  // Ensure token is valid via auth/me call
  try {
    await axiosInstance.get("/auth/me"); // token auto-refresh happens here
  } catch (err) {
    console.error("[WS] Cannot get user info, aborting WS connection:", err);
    dispatch(markPlanGenerationError("Failed to get user info"));
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("[WS] No valid token found, aborting WS connection");
    dispatch(markPlanGenerationError("No valid token found"));
    return;
  }

  // Close existing connection if any
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }

  const url = `ws://localhost:8000/ai/generate?token=${token}`;
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("[WS] Connected to plan generation");
    socket.send(JSON.stringify({ prompt }));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "plan_created":
        case "day_added":
        case "step_added":
          if (data.response) dispatch(setPlanFromSocket(data.response));
          break;

        case "completed":
          dispatch(markPlanGenerationComplete());
          if (socket) {
            socket.close();
            socket = null;
          }
          break;

        case "error":
          console.error("[WS] Server error:", data.message || data.response);
          let errorMessage = "Failed to generate plan";
          if (data.response?.error?.message) {
            errorMessage = data.response.error.message;
          } else if (data.message) {
            errorMessage = data.message;
          }
          console.error("[WS] Server error:", errorMessage);
          dispatch(markPlanGenerationError(errorMessage));
          break;

        case "status":
        case "progress":
          console.log("[WS] Status update:", data.message || data.response);
          break;

        default:
          console.log("[WS] Unknown message type:", data.type);
      }
    } catch (err) {
      console.error("[WS] Error parsing message:", err, "Raw message:", event.data);
    }
  };

  socket.onerror = (err) => console.error("[WS] WebSocket error:", err);

  socket.onclose = (event) => {
    dispatch(markPlanGenerationComplete());
    console.log("[WS] Connection closed:", event.code, event.reason);
    socket = null;
  };

  return () => {
    console.log("[WS] Cleaning up connection");
    if (socket && socket.readyState === WebSocket.OPEN) socket.close();
    socket = null;
  };
}

export function disconnectPlanWebSocket() {
  if (socket) {
    if (socket.readyState === WebSocket.OPEN) socket.close();
    socket = null;
    console.log("[WS] Manually disconnected");
  }
}

export function getWebSocketState() {
  if (!socket) return "CLOSED";
  return ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][socket.readyState] || "UNKNOWN";
}

export function sendWebSocketMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    console.log("[WS] Message sent:", message);
    return true;
  }
  console.warn("[WS] Cannot send message, socket not ready");
  return false;
}
