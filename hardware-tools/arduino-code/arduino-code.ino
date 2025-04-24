#include <SoftwareSerial.h>

// Pin where the serial port is connected (if the princial port serial is not used)
SoftwareSerial mySerial(10, 11); // RX, TX

const int bomb1PinInUse = 2;  // Pin to control bomb1
const int bomb1PinReleased = 3;
const int buttonPin = 7;

bool bombReleased = false;    // Status of the bomb (released or not)
bool isPressed = false;       // State of the button

unsigned long releasedTimestamp = 0;
bool releasedLedOn = false;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);          // Comunication with the PC
  mySerial.begin(9600);        // Comunication with the python script

  // Configuration of pins for bomb1 like output
  pinMode(bomb1PinInUse, OUTPUT);
  pinMode(bomb1PinReleased, OUTPUT);

  pinMode(buttonPin, INPUT_PULLUP); // Button in pin 7 of arduino

  // Initialize the status of bombs in LOW for default
  digitalWrite(bomb1PinInUse, LOW);
  digitalWrite(bomb1PinReleased, LOW);

}

void loop() {
  //Listen if the input from python is "RELEASED"
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "RELEASED") {
      digitalWrite(bomb1PinReleased, HIGH);
      bombReleased = true;
      releasedTimestamp = millis();
      releasedLedOn = true;
      Serial.println("READY"); // Only to know if the order is recieved
      delay(100);
    }
  }
  if (bombReleased) {
    if (digitalRead(buttonPin) == LOW) {
      if (!isPressed) {
        isPressed = true;
        digitalWrite(bomb1PinInUse, LOW);
        Serial.println("POWER OFF");
      }
    } else {
      if (isPressed) {
        isPressed = false;
        digitalWrite(bomb1PinInUse, HIGH);
        Serial.println("POWER ON");
      }
    }

    // Verificate if the 30 seconds was already passed
    if (releasedLedOn && millis() - releasedTimestamp >= 30000) {
      digitalWrite(bomb1PinReleased, LOW);
      releasedLedOn = false;
      bombReleased = false;
      Serial.println("BLOCKED");
    }
  }
  delay(100);
}
