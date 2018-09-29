/*
  LiquidCrystal Library - display() and noDisplay()
 Demonstrates the use a 16x2 LCD display.  The LiquidCrystal
 library works with all LCD displays that are compatible with the
 Hitachi HD44780 driver. There are many of them out there, and you
 can usually tell them by the 16-pin interface.
 This sketch prints "Hello World!" to the LCD and uses the
 display() and noDisplay() functions to turn on and off
 the display.
 The circuit:
 * LCD RS pin to digital pin 12
 * LCD Enable pin to digital pin 11
 * LCD D4 pin to digital pin 5
 * LCD D5 pin to digital pin 4
 * LCD D6 pin to digital pin 3
 * LCD D7 pin to digital pin 2
 * LCD R/W pin to ground
 * 10K resistor:
 * ends to +5V and ground
 * wiper to LCD VO pin (pin 3)
 Library originally added 18 Apr 2008
 by David A. Mellis
 library modified 5 Jul 2009
 by Limor Fried (http://www.ladyada.net)
 example added 9 Jul 2009
 by Tom Igoe
 modified 22 Nov 2010
 by Tom Igoe
 modified 7 Nov 2016
 by Arturo Guadalupi
 This example code is in the public domain.
 http://www.arduino.cc/en/Tutorial/LiquidCrystalDisplay
*/
/*
  // Turn off the display:
  lcd.noDisplay();
  delay(500);
  // Turn on the display:
  lcd.display();
  delay(500);
  */
/*************************************************** 
  This is an example sketch for our optical Fingerprint sensor
  Designed specifically to work with the Adafruit BMP085 Breakout 
  ----> http://www.adafruit.com/products/751
  These displays use TTL Serial to communicate, 2 pins are required to 
  interface
  Adafruit invests time and resources providing this open source code, 
  please support Adafruit and open-source hardware by purchasing 
  products from Adafruit!
  Written by Limor Fried/Ladyada for Adafruit Industries.  
  BSD license, all text above must be included in any redistribution
 ****************************************************/
//modified by DPV technology for testing//
#include <SoftwareSerial.h> 
SoftwareSerial esp8266(0,1);//RX,TX 
    #include <ESP8266WiFi.h>
    #include <ArduinoJson.h>
    const char* ssid = "Hashim";
    const char* password = "hashcash";
    const char* host = "www.bipulgupta.com"; // Your domain
    String path = "/IoT/light.json"; // Path to light.json on website
    const int pin = 13;
    
#include <Adafruit_Fingerprint.h>
// include the library code:
#include <LiquidCrystal.h>
// initialize the library by associating any needed LCD interface pin
// with the arduino pin number it is connected to
//const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(7, 8, 11, 10, 9, 12);
// On Leonardo/Micro or others with hardware serial, use those! #0 is green wire, #1 is white
// uncomment this line:
// #define mySerial Serial1
// For UNO and others without hardware serial, we must use software serial...
// pin #2 is IN from sensor (GREEN wire)
// pin #3 is OUT from arduino  (WHITE wire)
// comment these two lines if using hardware serial
//#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
void setup()  
{
    // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  pinMode(4,OUTPUT);
  pinMode(5,OUTPUT);
  Serial.begin(9600);
  while (!Serial);  // For Yun/Leo/Micro/Zero/...
  delay(100);
  //lcd.print("\n\nAdafruit finger detect test");
  // set the data rate for the sensor serial port
  finger.begin(115200);
  
  if (finger.verifyPassword()) {
    lcd.print("Found fingerprint sensor!");
  } else {
    lcd.print("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }
  finger.getTemplateCount();
  lcd.print("Sensor contains "); 
  lcd.print(finger.templateCount); 
  lcd.print(" templates");
  lcd.print("Waiting for valid finger...");
      pinMode(pin, OUTPUT);
    pinMode(pin, HIGH);
    Serial.begin(115200);
    delay(10);
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    int wifi_ctr = 0;
    while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
}
    Serial.println("WiFi connected");
    Serial.println("IP address: " + WiFi.localIP());
    }
void loop()                     // run over and over again
{
  getFingerprintIDez();
  delay(50);            //don't ned to run this at full speed.
 digitalWrite(5,HIGH);
}
uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      lcd.print("Image taken");
      delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);F
      break;
    case FINGERPRINT_NOFINGER:
      lcd.print("No finger detected");
      delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      lcd.print("Communication error");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    case FINGERPRINT_IMAGEFAIL:
      lcd.print("Imaging error");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    default:
      lcd.print("Unknown error");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
  }
  // OK success!
  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      // Turn off the display:
      lcd.print("Image converted");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      break;
    case FINGERPRINT_IMAGEMESS:
      // Turn off the display:
      lcd.print("Image too messy");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      // Turn off the display:
      lcd.print("Communication error");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    case FINGERPRINT_FEATUREFAIL:
      lcd.print("Could not find fingerprint features");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      lcd.print("Could not find fingerprint features");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
    default:
      lcd.print("Unknown error");
            delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
      return p;
  }
  
  // OK converted!
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    lcd.print("Found a print match!");
          delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    lcd.print("Communication error");
          delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    lcd.print("Did not find a match");
          delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
    return p;
  } else {
    lcd.print("Unknown error");
          delay(1500);
      lcd.clear();
      lcd.setCursor(0,0);
    return p;
  }   
  
  // found a match!
  lcd.print("Found ID #"); 
  lcd.setCursor(0,1);
  lcd.print(finger.fingerID); 
  delay(2600);
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(" with confidence of ");
  lcd.setCursor(0,1); 
  lcd.print(finger.confidence); 
  delay(2560);
  return finger.fingerID;
}
// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;
  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  return -1;
  
  // found a match!
  digitalWrite(5,LOW);
  digitalWrite(4,HIGH);
  delay(1000);
  digitalWrite(4,LOW);
  
  lcd.print("Found ID #"); 
  lcd.print(finger.fingerID); 
    delay(2600);
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print(" with confidence of ");
  lcd.setCursor(0,1);
  lcd.print(finger.confidence);
   delay(2560);
   
  wifi();
  return finger.fingerID; 
}     
void wifi()
{
    Serial.print("connecting to ");
    Serial.println(host);
    WiFiClient client;
    const int httpPort = 80;
    if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
    }
   client.print(String("GET ") + path + " HTTP/1.1\r\n" +
    "Host: " + host + "\r\n" +
    "Connection: keep-alive\r\n\r\n");
    delay(500); // wait for server to respond
    // read response
    String section="header";
    while(client.available()){
    String line = client.readStringUntil('\r');
    // Serial.print(line);
    // we'll parse the HTML body here
    if (section=="header") { // headers..
    Serial.print(".");
    if (line=="\n") { // skips the empty space at the beginning
    section="json";
    }
    }
    else if (section=="json") { // print the good stuff
    section="ignore";
    String result = line.substring(1);
    // Parse JSON
    int size = result.length() + 1;
    char json[size];
    result.toCharArray(json, size);
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& json_parsed = jsonBuffer.parseObject(json);
    if (!json_parsed.success())
    {
    Serial.println("parseObject() failed");
    return;
    }
    // Make the decision to turn off or on the LED
    if (strcmp(json_parsed["light"], "on") == 0) {
    digitalWrite(pin, HIGH);
    Serial.println("LED ON");
    }
    else {
    digitalWrite(pin, LOW);
    Serial.println("led off");
    }
    }
    }
    Serial.print("closing connection. ");
    
}