import { setPlanFromSocket, markPlanGenerationComplete } from "./PlanSlice";

let socket = null;

export function connectToPlanWebSocket(dispatch, prompt, token) {
  // Close existing connection if any
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }

  const url = `ws://localhost:8000/ai/generate?token=${token}`;
  
  socket = new WebSocket(url);
  
  socket.onopen = () => {
    console.log("[WS] Connected to plan generation");
    // Send prompt in the required format
    const message = { prompt: prompt };
    console.log("[WS] Sending prompt:", message);
    socket.send(JSON.stringify(message));
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("[WS] Received message:", data);
      
      // Handle different message types
      switch (data.type) {
        case "plan_created":
        case "day_added":
        case "step_added":
          if (data.response) {
            console.log("[WS] Updating plan data");
            dispatch(setPlanFromSocket(data.response));
          }
          break;
        
        case "completed":
          console.log("[WS] Generation completed");
          dispatch(markPlanGenerationComplete());

          if (socket) {
            socket.close();
            socket = null;
          }
          break;
        
        case "error":
          console.error("[WS] Server error:", data.message || data.response);
          // Handle error appropriately
          break;
        
        case "status":
        case "progress":
          // These are status updates, we can log them but don't need to update state
          console.log("[WS] Status update:", data.message || data.response);
          break;
        
        default:
          console.log("[WS] Unknown message type:", data.type);
          break;
      }
    } catch (err) {
      console.error("[WS] Error parsing message:", err);
      console.log("[WS] Raw message:", event.data);
    }
  };
  
  socket.onerror = (err) => {
    console.error("[WS] WebSocket error:", err);
  };
  
  socket.onclose = (event) => {
    console.log("[WS] Connection closed:", event.code, event.reason);
    socket = null;
  };
  
  // Return cleanup function
  return () => {
    console.log("[WS] Cleaning up connection");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    socket = null;
  };
}

// Function to disconnect the socket manually if needed
export function disconnectPlanWebSocket() {
  console.log("[WS] Manually disconnecting");
  if (socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    socket = null;
  }
}

// Function to get current socket state
export function getWebSocketState() {
  if (!socket) return 'CLOSED';
  
  switch (socket.readyState) {
    case WebSocket.CONNECTING: return 'CONNECTING';
    case WebSocket.OPEN: return 'OPEN';
    case WebSocket.CLOSING: return 'CLOSING';
    case WebSocket.CLOSED: return 'CLOSED';
    default: return 'UNKNOWN';
  }
}

// Function to send additional messages if needed
export function sendWebSocketMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("[WS] Sending message:", message);
    socket.send(JSON.stringify(message));
    return true;
  } else {
    console.warn("[WS] Cannot send message, socket not ready");
    return false;
  }
}