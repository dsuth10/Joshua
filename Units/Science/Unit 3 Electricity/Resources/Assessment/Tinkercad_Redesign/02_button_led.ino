// Keep the external LED circuit. Button switched contacts connect D2 to GND.
const int LED_PIN = 8;
const int BUTTON_PIN = 2;
void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}
void loop() {
  const bool pressed = digitalRead(BUTTON_PIN) == LOW;
  digitalWrite(LED_PIN, pressed ? HIGH : LOW);
}
