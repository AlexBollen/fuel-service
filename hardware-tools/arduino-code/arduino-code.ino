#include <SoftwareSerial.h>

// Leds and button
const int bomb1PinInUse     = 2;
const int bomb1PinReleased  = 3;
const int buttonPin         = 7;
const int finishButtonPin   = 8;

// Logic status
int status = 1;

// Flags
bool bombReleased      = false;
bool isPressed         = false;
bool manualMode        = false;
bool automaticMode     = false;
bool fueUsada          = false;

// Times
unsigned long releasedTimestamp = 0;
unsigned long maxTime           = 30000;
unsigned long currentCapacityTime = 0;
String saleId                   = "";

unsigned long initialManualTime   = 0;
unsigned long totalManualTime     = 0;
unsigned long lastManualPressed   = 0;

void setup() {
  Serial.begin(9600);
  pinMode(bomb1PinInUse,    OUTPUT);
  pinMode(bomb1PinReleased, OUTPUT);
  pinMode(buttonPin,        INPUT_PULLUP);
  pinMode(finishButtonPin,  INPUT_PULLUP);

  setEstado(1); // Initial status: blocked
}

void loop() {
  // 1) Receive serial command
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command.startsWith("RELEASED")) {
      int firstComma  = command.indexOf(',');
      int secondComma = command.indexOf(',', firstComma + 1);
      int thirdComma  = command.indexOf(',', secondComma + 1);

      if (firstComma > 0 && secondComma > firstComma) {
        String tiempo = command.substring(firstComma + 1, secondComma);

        if (tiempo == "NONE" && thirdComma > secondComma) {
          saleId = command.substring(secondComma + 1, thirdComma);
          currentCapacityTime = command.substring(thirdComma + 1).toInt();
          manualMode = true;
          maxTime = 0;
          Serial.println("Modo manual activado");
        } else {
          saleId = command.substring(secondComma + 1);
          manualMode = false;
          maxTime = tiempo.toInt();
          Serial.print("Modo automático, maxTime: ");
          Serial.println(maxTime);
        }

        bombReleased = true;
        releasedTimestamp = millis();
        initialManualTime = millis();
        totalManualTime = 0;
        lastManualPressed = millis();
        isPressed = false;
        automaticMode = false;
        fueUsada = false;

        setEstado(2); // Released
        Serial.println("READY");
      }
    }
  }

  // 2) Released bomb logic
  if (bombReleased) {
    bool pressedButton = (digitalRead(buttonPin) == LOW);

    if (manualMode) {
      unsigned long tiempoActual = millis();
      // POWER ON When is pressed
      if (pressedButton && !isPressed) {
        if (totalManualTime < currentCapacityTime) {
          isPressed = true;
          initialManualTime = tiempoActual;
          setEstado(3); // In use
          Serial.println("POWER ON");
          fueUsada = true; // The bomb was used
        }
      }

      // POWER OFF when released
      if (!pressedButton && isPressed) {
        isPressed = false;
        totalManualTime += tiempoActual - initialManualTime;
        lastManualPressed = tiempoActual;
        setEstado(2); // Released
        Serial.println("POWER OFF");
      }

      // FORCE STOP if exceeded capacity
      if (isPressed && (totalManualTime + (tiempoActual - initialManualTime)) >= currentCapacityTime) {
        isPressed = false;
        totalManualTime = currentCapacityTime;
        bombReleased = false;
        setEstado(1); // Blocked

        Serial.println("TIEMPO MÁXIMO ALCANZADO EN MODO MANUAL");
        Serial.print("TOTALTIME,");
        Serial.print(saleId);
        Serial.print(",");
        Serial.println(totalManualTime);
      }

      // Finish when pressed the other button
      if (digitalRead(finishButtonPin) == LOW) {
        bombReleased = false;
        setEstado(1); // Blocked

        if (!fueUsada && totalManualTime == 0 && !isPressed) {
          Serial.println("TOTALTIME IGUAL A 0 - NO SE UTILIZÓ LA BOMBA");
        } else {
          Serial.print("TOTALTIME,");
          Serial.print(saleId);
          Serial.print(",");
          Serial.println(totalManualTime);
        }
      }

    } else {
      // Automatic Mode
      if (!automaticMode) {
        setEstado(3); // IN USE
        automaticMode = true;
      }

      if (millis() - releasedTimestamp >= maxTime) {
        bombReleased = false;
        setEstado(1); // Blocked

        Serial.println("Tiempo agotado: BLOQUEADA");
        Serial.print("TOTALTIME,");
        Serial.print(saleId);
        Serial.print(",");
        Serial.println(maxTime);
        automaticMode = false;
      }
    }
  }

  delay(50);
}

// ==========================
// Change physic and logic status
void setEstado(int nuevoEstado) {
  status = nuevoEstado;
  switch (status) {
    case 1: // Blocked
      digitalWrite(bomb1PinInUse,    LOW);
      digitalWrite(bomb1PinReleased, LOW);
      Serial.println("BLOCKED");
      break;
    case 2: // Released
      digitalWrite(bomb1PinInUse,    LOW);
      digitalWrite(bomb1PinReleased, HIGH);
      Serial.println("POWER OFF");
      break;
    case 3: // In Use
      digitalWrite(bomb1PinInUse,    HIGH);
      digitalWrite(bomb1PinReleased, HIGH);
      Serial.println("POWER ON");
      break;
  }
}
