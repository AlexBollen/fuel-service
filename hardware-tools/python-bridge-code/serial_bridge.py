import serial
import time
import websocket
import requests
import threading
import socketio
import os
from dotenv import load_dotenv
import json

load_dotenv()  # Load .env file



# Serial Port (adjust the value according to the configuration in Arduino IDE)
serial_port = os.getenv("SERIAL_PORT", "COM4")
api_url = os.getenv("API_URL", "http://localhost:3002")
ws_url = os.getenv("W_URL", "ws://localhost:3002")
bomb_id = os.getenv("BOMB_ID","").strip()  # <- Use your actual UUID here
print(f"[CONFIG] bomb_id = {bomb_id}")

ser = serial.Serial(serial_port, 9600, timeout=1)
sio = socketio.Client()

@sio.event
def connect():
    print("[WS] Connected to WebSocket")

@sio.event
def disconnect():
    print("[WS] Offline from WebSocket")

#Listen the evento from backend
@sio.on("bombReleasedFromWeb")
def on_bomb_released(data):
    print(f"[WS] Received event: bombReleasedFromWeb -> {data}")
    if data.get("bombId") == bomb_id:
        print("[WS] Bomb Released From Web")
        ser.write(b"RELEASED\n")  # Notify Arduino

def update_bomb_status(bombId, HW_Status):
    url = f"{api_url}/bomb/{bombId}/status"
    status_map = {
        "POWER ON": 3,  # Bomb in use
        "POWER OFF": 2,  # Released but not in use
        "BLOCKED": 1,
    }

    payload = {"status": status_map.get(HW_Status, 1)}  # Default to 1, if the bomb is not released

    try:
        response = requests.patch(url, json=payload)
        print(f"[HTTP] Server response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"[HTTP] Error updating HW_Status: {e}")

def emit_bomb_status(status):
    sio.emit("bombInUse", {
        "bombId": bomb_id,
        "status": status
    })
    print(f"[WS] Emited bombInUse with status: {status}")

def read_arduino():
    while True:
        if ser.in_waiting > 0:
            arduino_data = ser.readline().decode('utf-8').strip()
            if arduino_data:
                print(f"Arduino data: {arduino_data}")

                # Detect POWER ON/POWER OFF commands
                if "POWER ON" in arduino_data.upper():
                    update_bomb_status(bomb_id, "POWER ON")
                    emit_bomb_status(3)  # Bomb in use
                elif "POWER OFF" in arduino_data.upper():
                    update_bomb_status(bomb_id, "POWER OFF")
                    emit_bomb_status(2)  # Bomb released but not in use
                elif "BLOCKED" in arduino_data.upper():
                    update_bomb_status(bomb_id, "BLOCKED")  # Bomb return to blocked status
                    emit_bomb_status(1)

# Thread to read from the serial port
serial_thread = threading.Thread(target=read_arduino)
serial_thread.daemon = True
serial_thread.start()

# Start WebSocket listener in main thread
try:
    sio.connect(ws_url)
    sio.wait()
except KeyboardInterrupt:
    print("Process interrupted by the user.")
except Exception as e:
    print(f"Error: {e}")
