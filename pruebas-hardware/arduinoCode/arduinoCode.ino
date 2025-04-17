#include <SoftwareSerial.h>

// Pin where the serial port is connected (if the princial port serial is not used)
SoftwareSerial mySerial(10, 11); // RX, TX

const int bomb1Pin = 2;  // Pin to control bomb1

void setup() {
  // Initialize serial communication
  Serial.begin(9600);          // Comunication with the PC
  mySerial.begin(9600);        // Comunication with the python script

  // Configuration of pins for bomb1 like output
  pinMode(bomb1Pin, OUTPUT);

  pinMode(7, INPUT); // Button in pin 7 of arduino

  // Initialize the status of bombs in LOW for default
  digitalWrite(bomb1Pin, LOW);
}

void loop() {
  int HW_Status = digitalRead(7);

  if (HW_Status == HIGH) {
    Serial.println("POWER ON");
    digitalWrite(bomb1Pin, HIGH);
  } else {
    Serial.println("POWER OFF");
    digitalWrite(bomb1Pin, LOW);
  }

  delay(2000);
}
