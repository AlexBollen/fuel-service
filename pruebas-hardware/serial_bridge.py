import serial
import time
import websocket
import requests
import threading

# Serial Port (adjust the value according to the configuration in Arduino IDE)
serial_port = "COM4"
ser = serial.Serial(serial_port, 9600, timeout=1)

# ID of the bomb (adjust according the value of the DB)
bomb_id = "94eeb030-d802-4846-95b2-c5602f36733e"  # <- Change with the value created with uuidv4()

# Function to manage the WebSocket messages
def on_message(ws, message):
    print(f"Receibed message: {message}")

def on_error(ws, error):
    print(f"Error in WebSocket: {error}")

def on_close(ws, close_status_code, close_msg):
    print("WebSocket connection closed")

def on_open(ws):
    print("WebSocket connection opened")

def update_bomb_status(bombId, HW_Status):
    url = f"http://localhost:3002/bomb/{bombId}/status"
    payload = {"status": 1 if HW_Status == "POWER ON" else 0}
    try:
        response = requests.patch(url, json=payload)
        print(f"[HTTP] Server response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"[HTTP] Error updating HW_Status: {e}")

def read_arduino():
    while True:
        if ser.in_waiting > 0:
            arduino_data = ser.readline().decode('utf-8').strip()
            if arduino_data:
                print(f"Arduino data: {arduino_data}")
                ws.send(arduino_data)

                # Detect POWER ON/POWER OFF comands
                if "POWER ON" in arduino_data.upper():
                    update_bomb_status(bomb_id, "POWER ON")
                elif "POWER OFF" in arduino_data.upper():
                    update_bomb_status(bomb_id, "POWER OFF")

# WebSocket Configuration
ws = websocket.WebSocketApp("ws://localhost:8080",
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)
ws.on_open = on_open

# Thread to read from the serial port
serial_thread = threading.Thread(target=read_arduino)
serial_thread.daemon = True
serial_thread.start()

# Execute WebSocket
try:
    ws.run_forever()
except KeyboardInterrupt:
    print("Process interrupted proces by the user.")
except Exception as e:
    print(f"Error: {e}")
