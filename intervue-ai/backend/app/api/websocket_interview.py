import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.services.interview_service import InterviewService
from app.services.code_executor import CodeExecutionEngine

router = APIRouter(prefix="/ws", tags=["Live WebSockets"])

# Connection Manager for WebSocket clients
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)
        print(f"WebSocket connected for session: {session_id}")

    def disconnect(self, session_id: str, websocket: WebSocket):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/interview/{session_id}")
async def websocket_interview_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        # Send initial connected handshake
        await websocket.send_json({
            "type": "CONNECTION_ESTABLISHED",
            "session_id": session_id,
            "message": "Connected to Bit-Interview Real-time Stream"
        })

        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            action = data.get("action")

            if action == "EXECUTE_CODE":
                code = data.get("code", "")
                language = data.get("language", "python")
                result = await CodeExecutionEngine.execute_code(code, language)
                
                await websocket.send_json({
                    "type": "CODE_EXECUTION_RESULT",
                    "result": result
                })

            elif action == "PING":
                await websocket.send_json({"type": "PONG"})

    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
        print(f"WebSocket client disconnected: {session_id}")
    except Exception as e:
        print(f"WebSocket error ({session_id}): {e}")
        manager.disconnect(session_id, websocket)
