// External LED: D8 -> 330 ohm resistor -> anode; cathode -> GND.
const int LED_PIN = 8;
void setup() { pinMode(LED_PIN, OUTPUT); }
void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}
