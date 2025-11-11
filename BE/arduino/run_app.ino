#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "Phan Nguyen 5G";
const char *password = "-p(x2)log(p(x2))";

const char *backendApiUrl = "http://192.168.1.199:8027/v1/esp/get-card-esp";
const char *backendApiCheckInUrl = "http://192.168.1.199:8027/v1/esp/check-in-esp";
const char *backendApiCheckOutUrl = "http://192.168.1.199:8027/v1/esp/check-out-esp";
const char *backendApiCheckInInvalidUrl = "http://192.168.1.199:8027/v1/esp/check-in-invalid-esp";
const char *backendApiCheckOutInvalidUrl = "http://192.168.1.199:8027/v1/esp/check-out-invalid-esp";
const char *backendApiGoOutUrl = "http://192.168.1.199:8027/v1/esp/go-out-door-esp";
const char *backendApiDoorClosedUrl = "http://192.168.1.199:8027/v1/esp/door-closed-esp";

#define SS_PIN 5
#define RST_PIN 15
#define SERVO_PIN 12
#define TRIG_PIN 13
#define ECHO_PIN 4

LiquidCrystal_I2C lcd(0x27, 16, 2);
MFRC522 rfid(SS_PIN, RST_PIN);
Servo myServo;
AsyncWebServer server(80);

int distanceThreshold = 6;
bool doorIsOpen = false;
String doorStatusString = "CLOSED";
const char* doorCode = "DOOR_MAIN";

unsigned long lastPersonDetectedTime = 0;
const long autoCloseDelay = 5000;
bool openedFromInside = false;
bool personHasPassed = false;
bool goOutApiSent = false;
unsigned long doorOpenTime = 0;
const long autoCloseOutsideDelay = 5000;

String authorizedUsersString;

long getDistance()
{
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    long duration = pulseIn(ECHO_PIN, HIGH);
    if (duration == 0) return 999;
    return duration / 29.4 / 2;
}

String normalizeUID(String s) {
    s.toUpperCase();
    s.trim();
    return s;
}

void sendApiRequest(const char* url, String uid) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<200> doc;
        doc["uid"] = uid;
        doc["door_code"] = doorCode;

        String requestBody;
        serializeJson(doc, requestBody);

        Serial.println("Sending POST request to: " + String(url));
        Serial.println("Request body: " + requestBody);

        int httpCode = http.POST(requestBody);

        if (httpCode > 0) {
            String payload = http.getString();
            Serial.println("HTTP Response code: " + String(httpCode));
            Serial.println("Response payload: " + payload);
        } else {
            Serial.printf("POST request failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    } else {
        Serial.println("WiFi Disconnected. Cannot send API request.");
    }
}

void sendGoOutRequest(const char* url) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<100> doc;
        doc["door_code"] = doorCode;

        String requestBody;
        serializeJson(doc, requestBody);

        Serial.println("Sending POST request to: " + String(url));
        Serial.println("Request body: " + requestBody);

        int httpCode = http.POST(requestBody);

        if (httpCode > 0) {
            String payload = http.getString();
            Serial.println("HTTP Response code: " + String(httpCode));
            Serial.println("Response payload: " + payload);
        } else {
            Serial.printf("POST request failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    } else {
        Serial.println("WiFi Disconnected. Cannot send API request.");
    }
}

void sendDoorClosedRequest(const char* url) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        StaticJsonDocument<100> doc;
        doc["door_code"] = doorCode;

        String requestBody;
        serializeJson(doc, requestBody);

        Serial.println("Sending POST request to: " + String(url));
        Serial.println("Request body: " + requestBody);

        int httpCode = http.POST(requestBody);

        if (httpCode > 0) {
            String payload = http.getString();
            Serial.println("HTTP Response code: " + String(httpCode));
            Serial.println("Response payload: " + payload);
        } else {
            Serial.printf("POST request failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    } else {
        Serial.println("WiFi Disconnected. Cannot send API request.");
    }
}

String findUserNameByUID(String uid)
{
    String normalizedUid = normalizeUID(uid);
    
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, authorizedUsersString);

    if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return "";
    }

    JsonArray data = doc["data"].as<JsonArray>();

    for (JsonObject user : data) {
        String userUid = user["uid"].as<String>();
        if (normalizeUID(userUid) == normalizedUid) {
            String name = user["name"];
            Serial.println("Matched with user: " + name);
            return name;
        }
    }
    
    Serial.println("No match found for UID in authorizedUsersString.");
    return "";
}

void displayInitialMessage()
{
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Vui long quet");
    lcd.setCursor(0, 1);
    lcd.print("the cua ban!");
}

void closeTheDoor(bool sendClosedEvent = false)
{
    myServo.write(0);
    doorIsOpen = false;
    doorStatusString = "CLOSED";
    Serial.println("CUA DA DONG");

    if (sendClosedEvent) {
        Serial.println("Gui API door-closed do tu dong dong.");
        sendDoorClosedRequest(backendApiDoorClosedUrl);
    }
    
    delay(500);
    displayInitialMessage();
}

void handleCorrectCard(String name, String uid)
{
    Serial.println("Xac thuc thanh cong cho: " + name);
    doorIsOpen = true;
    doorStatusString = "OPENED";

    if (name == "Inside User") {
        openedFromInside = true;
        lastPersonDetectedTime = millis();
        personHasPassed = false;
        goOutApiSent = false;
    } else {
        openedFromInside = false;
        personHasPassed = false;
        doorOpenTime = millis(); 
        
        if (name != "Remote User") {
            sendApiRequest(backendApiCheckInUrl, uid);
        }
    }

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Xin chao");
    lcd.setCursor(0, 1);
    lcd.print(name);
    myServo.write(80);
}

void handleIncorrectCard(String uid)
{
    Serial.println("Xac thuc that bai!");
    sendApiRequest(backendApiCheckInInvalidUrl, uid);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Thong tin khong");
    lcd.setCursor(0, 1);
    lcd.print("hop le");
    delay(2000);
    displayInitialMessage();
}

bool fetchAuthorizedUsers() {
    HTTPClient http;
    http.begin(backendApiUrl);
    int httpCode = http.GET();
    Serial.printf("HTTP code: %d\n", httpCode);

    if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.print("Payload size: "); Serial.println(payload.length());
        
        if (payload.length() > 0) {
            authorizedUsersString = payload;
            http.end();
            return true;
        } else {
            Serial.println("Payload empty!");
        }
    } else {
        Serial.printf("HTTP request failed: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
    return false;
}

void setup()
{
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();
    myServo.attach(SERVO_PIN);
    myServo.write(0);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    lcd.init();
    lcd.backlight();
    
    WiFi.begin(ssid, password);
    Serial.print("Dang ket noi Wi-Fi...");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Dang ket noi");
    lcd.setCursor(0, 1);
    lcd.print("Wi-Fi...");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nDa ket noi!");
    Serial.print("Dia chi IP: ");
    Serial.println(WiFi.localIP());
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Da ket noi!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
    delay(2000);
    
    displayInitialMessage();

    server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        String jsonString = "{\"status\":\"" + doorStatusString + "\",\"message\":\"Trang thai cua hien tai.\",\"door_code\":\"" + String(doorCode) + "\"}";
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", jsonString);
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    server.on("/api/door/open", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        if (!doorIsOpen) {
            handleCorrectCard("Remote User", "");
        }
        String jsonString = "{\"status\":\"" + doorStatusString + "\",\"message\":\"Da gui lenh mo cua thanh cong.\",\"door_code\":\"" + String(doorCode) + "\"}";
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", jsonString);
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    server.on("/api/door/close", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        if (doorIsOpen) {
            closeTheDoor();
        }
        String jsonString = "{\"status\":\"" + doorStatusString + "\",\"message\":\"Da gui lenh dong cua thanh cong.\",\"door_code\":\"" + String(doorCode) + "\"}";
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", jsonString);
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    server.on("/api/get-card-uid", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        Serial.println("API: Bat dau che do quet the de lay UID...");
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Moi quet the");
        lcd.setCursor(0, 1);
        lcd.print("de lay UID");

        String scannedUID = "";
        unsigned long startTime = millis();
        const long scanTimeout = 5000;

        while (millis() - startTime < scanTimeout) {
            if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
                for (byte i = 0; i < rfid.uid.size; i++) {
                    scannedUID += (rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
                    scannedUID += String(rfid.uid.uidByte[i], HEX);
                }
                scannedUID.toUpperCase();
                scannedUID.trim();

                rfid.PICC_HaltA();
                rfid.PCD_StopCrypto1();

                String jsonString = "{\"status\":\"success\",\"message\":\"Da quet UID thanh cong.\",\"uid\":\"" + scannedUID + "\",\"door_code\":\"" + String(doorCode) + "\"}";
                request->send(200, "application/json", jsonString);
                
                displayInitialMessage();
                return;
            }
            delay(50);
        }

        Serial.println("API: Het thoi gian quet the.");
        String jsonString = "{\"status\":\"error\",\"message\":\"Het thoi gian cho quet the.\",\"door_code\":\"" + String(doorCode) + "\"}";
        request->send(408, "application/json", jsonString);

        displayInitialMessage();
    });

    server.onNotFound([](AsyncWebServerRequest *request)
    {
        if (request->method() == HTTP_OPTIONS) {
            AsyncWebServerResponse *response = request->beginResponse(204);
            response->addHeader("Access-Control-Allow-Origin", "*");
            response->addHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
            response->addHeader("Access-Control-Allow-Headers", "*");
            request->send(response);
        } else {
            String jsonString = "{\"status\":\"error\",\"message\":\"API endpoint not found.\",\"door_code\":\"" + String(doorCode) + "\"}";
            AsyncWebServerResponse *response = request->beginResponse(404, "application/json", jsonString);
            response->addHeader("Access-Control-Allow-Origin", "*");
            request->send(response);
        }
    });

    server.begin();
}

void loop()
{
    long distance = getDistance();

    if (doorIsOpen)
    {
        if (openedFromInside)
        {
            if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
            {
                if (fetchAuthorizedUsers()) {
                    String scannedUID = "";
                    for (byte i = 0; i < rfid.uid.size; i++)
                    {
                        scannedUID += (rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
                        scannedUID += String(rfid.uid.uidByte[i], HEX);
                    }
                    scannedUID.toUpperCase();
                    scannedUID.trim();
                    
                    String userName = findUserNameByUID(scannedUID);
                    if (userName != "")
                    {
                        Serial.println("Da quet the hop le de dong cua tu ben trong.");
                        sendApiRequest(backendApiCheckOutUrl, scannedUID);

                        lcd.clear();
                        lcd.setCursor(0, 0);
                        lcd.print("Tam biet");
                        lcd.setCursor(0, 1);
                        lcd.print(userName);
                        delay(2000);

                        closeTheDoor();
                    }
                    else 
                    {
                        Serial.println("Da quet the KHONG hop le khi di tu trong ra.");
                        sendApiRequest(backendApiCheckOutInvalidUrl, scannedUID);
                        
                        lcd.clear();
                        lcd.setCursor(0, 0);
                        lcd.print("The khong hop le");
                        delay(2000);
                        lcd.clear();
                        lcd.setCursor(0, 0);
                        lcd.print("Xin chao");
                        lcd.setCursor(0, 1);
                        lcd.print("Inside User");
                    }
                } else {
                    Serial.println("Loi: Khong the tai danh sach nguoi dung tu API.");
                    lcd.clear();
                    lcd.setCursor(0, 0);
                    lcd.print("Loi ket noi API");
                    lcd.setCursor(0, 1);
                    lcd.print("Vui long thu lai!");
                    delay(2000);
                    lcd.clear();
                    lcd.setCursor(0, 0);
                    lcd.print("Xin chao");
                    lcd.setCursor(0, 1);
                    lcd.print("Inside User");
                }
                
                rfid.PICC_HaltA();
                rfid.PCD_StopCrypto1();
            }

            if (distance < distanceThreshold) {
                personHasPassed = true;
                lastPersonDetectedTime = millis();
                Serial.println("Phat hien nguoi (di ra), reset thoi gian dong cua.");
            }

            if (personHasPassed && !goOutApiSent && distance >= distanceThreshold) {
                Serial.println("Nguoi (di ra) da di qua. Gui API go-out.");
                sendGoOutRequest(backendApiGoOutUrl);
                goOutApiSent = true;
            }

            if (millis() - lastPersonDetectedTime > autoCloseDelay) {
                Serial.println("Khong con ai (di ra), tu dong dong cua.");
                closeTheDoor(true);
            }
        }
        else
        {
            if (distance < distanceThreshold) {
                personHasPassed = true;
                Serial.println("Phat hien nguoi (di vao) dang di qua...");
            }

            if (personHasPassed && distance >= distanceThreshold) {
                Serial.println("Nguoi (di vao) da di qua, dong cua ngay lap tuc.");
                closeTheDoor(true);
            } 
            else if (!personHasPassed && (millis() - doorOpenTime > autoCloseOutsideDelay)) {
                Serial.println("Nguoi dung khong di vao, tu dong dong cua sau 5 giay.");
                closeTheDoor(true);
            }
        }
    }
    else
    {
        if (distance < distanceThreshold) {
            Serial.println("Phat hien nguoi tu ben trong, tu dong mo cua.");
            handleCorrectCard("Inside User", "");
        }
        else if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
        {
            if (fetchAuthorizedUsers()) {
                String scannedUID = "";
                for (byte i = 0; i < rfid.uid.size; i++)
                {
                    scannedUID += (rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
                    scannedUID += String(rfid.uid.uidByte[i], HEX);
                }
                scannedUID.toUpperCase();
                scannedUID.trim();
                
                String userName = findUserNameByUID(scannedUID);
                if (userName != "")
                {
                    handleCorrectCard(userName, scannedUID);
                }
                else
                {
                    handleIncorrectCard(scannedUID);
                }
            } else {
                Serial.println("Loi: Khong the tai danh sach nguoi dung tu API.");
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Loi ket noi API");
                lcd.setCursor(0, 1);
                lcd.print("Vui long thu lai!");
                delay(2000);
                displayInitialMessage();
            }

            rfid.PICC_HaltA();
            rfid.PCD_StopCrypto1();
        }
    }
    delay(200);
}