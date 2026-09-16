from fastapi import WebSocket
from typing import Dict
import json


class ConnectionManager:
    """Manages active WebSocket connections, mapping user_id -> WebSocket."""

    def __init__(self):
        # Maps user_id (str) -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"[WS] User connected: {user_id}  (total: {len(self.active_connections)})")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"[WS] User disconnected: {user_id}  (total: {len(self.active_connections)})")

    def is_online(self, user_id: str) -> bool:
        return user_id in self.active_connections

    async def send_to_user(self, user_id: str, data: dict):
        """Send a JSON payload to a specific user if they are connected."""
        ws = self.active_connections.get(user_id)
        if ws:
            try:
                await ws.send_json(data)
            except Exception as e:
                print(f"[WS] Failed to send to {user_id}: {e}")
                self.disconnect(user_id)

    async def broadcast(self, data: dict):
        """Send a JSON payload to all connected users."""
        disconnected = []
        for user_id, ws in self.active_connections.items():
            try:
                await ws.send_json(data)
            except Exception:
                disconnected.append(user_id)
        for uid in disconnected:
            self.disconnect(uid)


# Singleton instance shared across the whole app
manager = ConnectionManager()
