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

# Map for the bomb if in a future we manage more than one bomb
current_bomb = {
    "bombId": None,
    "saleId": None
}


# Serial Port (adjust the value according to the configuration in Arduino IDE)
serial_port = os.getenv("SERIAL_PORT", "COM4")
api_url = os.getenv("API_URL", "http://localhost:3002")
ws_url = os.getenv("W_URL", "ws://localhost:3002")
bomb_id = None

ser = serial.Serial(serial_port, 9600, timeout=1)
sio = socketio.Client()

@sio.event
def connect():
    print("[WS] Connected to WebSocket")
    print(f"[INFO] Escuchando en puerto serial: {serial_port}")

@sio.event
def disconnect():
    print("[WS] Offline from WebSocket")

#Listen the evento from backend
@sio.on("bombReleasedFromWeb")
def on_bomb_released(data):
    print(f"[WS] Received event: bombReleasedFromWeb -> {data}")
    
    current_bomb["bombId"] = data.get("bombId")
    current_bomb["saleId"] = data.get("saleId")
    max_time = data.get("maxTime", None)

    if max_time is None:
        print("[PY] Modo manual (sin maxTime) activado. Esperando pulsador...")
        command = f"RELEASED,NONE,{current_bomb['saleId']}\n"
    else:
        print(f"[PY] Releasing bomb {current_bomb['bombId']} for {max_time} ms")
        command = f"RELEASED,{max_time},{current_bomb['saleId']}\n"

    ser.write(command.encode())

def update_bomb_status(bombId, HW_Status):
    if not bombId:
        print("[ERROR] No bombId to update")
    
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
    if not current_bomb["bombId"]:
        print("[WARN] Cannot emit status without bombId")
        return

    sio.emit("bombInUse", {
        "bombId": current_bomb["bombId"],
        "status": status
    })
    print(f"[WS] Emitted bombInUse with status: {status}")

# Function to send total time to the server
# This function is called when the Arduino sends the total time
def send_total_time(sale_id, total_time):
    url = f"{api_url}/sale/update/{sale_id}"
    payload = {
        "type": 2,
        "totalTime": total_time
    }

    try:
        response = requests.patch(url, json=payload)
        print(f"[HTTP] Sent totalTime. Response: {response.status_code} - {response.text}")

        if response.status_code in [200, 204]:
            # Emit websocket event if the request was successful
            sio.emit("totalTimeUpdated", {
                "saleId": sale_id,
                "totalTime": total_time
            })
            print(f"[WS] Emitted totalTimeUpdated -> saleId: {sale_id}, totalTime: {total_time}")

    except Exception as e:
        print(f"[ERROR] Sending total time: {e}")




def read_arduino():
    while True:
        if ser.in_waiting > 0:
            arduino_data = ser.readline().decode('utf-8').strip()
            if arduino_data:
                print(f"Arduino data: {arduino_data}")

                bomb_id_local = current_bomb.get("bombId")
                if "POWER ON" in arduino_data.upper():
                    update_bomb_status(bomb_id_local, "POWER ON")
                    emit_bomb_status(3)  # Bomb in use

                elif "POWER OFF" in arduino_data.upper():
                    update_bomb_status(bomb_id_local, "POWER OFF")
                    emit_bomb_status(2)  # Bomb released

                elif "BLOCKED" in arduino_data.upper():
                    update_bomb_status(bomb_id_local, "BLOCKED")
                    emit_bomb_status(1)  # Bomb blocked

                elif "TOTALTIME" in arduino_data.upper():
                    try:
                        _, sale_id, total_time = arduino_data.split(',')
                        sale_id = sale_id.strip()
                        total_time = int(total_time.strip())
                        print(f"[ARDUINO] Total time detected: SaleID={sale_id}, Time={total_time}ms")
                        send_total_time(sale_id, total_time)
                    except Exception as e:
                        print(f"[ERROR] Parsing TOTALTIME: {e}")


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
