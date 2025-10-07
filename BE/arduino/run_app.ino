#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Arduino_JSON.h>

// --- CẤU HÌNH MẠNG WIFI ---
const char *ssid = "Phan Nguyen";
const char *password = "-p(x)log(p(x))";

// --- CẤU HÌNH CHÂN KẾT NỐI ---
#define SS_PIN 5
#define RST_PIN 15
#define SERVO_PIN 12
#define TRIG_PIN 13
#define ECHO_PIN 4

// --- CẤU HÌNH THIẾT BỊ ---
LiquidCrystal_I2C lcd(0x27, 16, 2);
MFRC522 rfid(SS_PIN, RST_PIN);
Servo myServo;
AsyncWebServer server(80);

// --- CẤU HÌNH LOGIC ---
int distanceThreshold = 10;
bool doorIsOpen = false;
unsigned long doorOpenTime;
const long timeoutDuration = 5000;
String doorStatusString = "dang_dong";

// --- DANH SÁCH NGƯỜI DÙNG ---
struct User
{
    String uid;
    String name;
};
const int NUM_USERS = 3;
User authorizedUsers[NUM_USERS] = {
    {"F6 4E 93 05", "Nguyen"},
    {"F7 58 2D C2", "Quan"},
    {"C7 D3 40 C2", "Linh"}};

// --- CÁC HÀM XỬ LÝ ĐẦY ĐỦ ---

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

String findUserNameByUID(String uid)
{
    for (int i = 0; i < NUM_USERS; i++)
    {
        if (uid == authorizedUsers[i].uid) return authorizedUsers[i].name;
    }
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

void closeTheDoor()
{
    myServo.write(90);
    doorIsOpen = false;
    doorStatusString = "dang_dong";
    delay(500);
    displayInitialMessage();
}

void handleCorrectCard(String name)
{
    Serial.println("Xac thuc thanh cong cho: " + name);
    doorIsOpen = true;
    doorStatusString = "dang_mo";
    doorOpenTime = millis();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Xin chao");
    lcd.setCursor(0, 1);
    lcd.print(name);
    myServo.write(0);
}

void handleIncorrectCard()
{
    Serial.println("Xac thuc that bai!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Thong tin khong");
    lcd.setCursor(0, 1);
    lcd.print("hop le");
    delay(2000);
    displayInitialMessage();
}

void setup()
{
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();
    myServo.attach(SERVO_PIN);
    myServo.write(90);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    lcd.init();
    lcd.backlight();
    displayInitialMessage();

    // --- KHỞI TẠO WIFI & WEB SERVER API ---
    WiFi.begin(ssid, password);
    Serial.print("Dang ket noi Wi-Fi...");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nDa ket noi!");
    Serial.print("Dia chi IP: ");
    Serial.println(WiFi.localIP());

    // --- ĐỊNH NGHĨA CÁC API ENDPOINTS ---
    server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        JSONVar responseObject;
        responseObject["status"] = doorStatusString;
        String jsonString = JSON.stringify(responseObject);
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", jsonString);
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    server.on("/api/door/open", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        if (!doorIsOpen) {
            handleCorrectCard("Remote User");
        }
        AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", "OK");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    // --- BỔ SUNG API ĐÓNG CỬA ---
    server.on("/api/door/close", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        if (doorIsOpen) {
            closeTheDoor();
        }
        AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", "OK");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });
    // --- KẾT THÚC BỔ SUNG ---

    server.onNotFound([](AsyncWebServerRequest *request)
    {
        if (request->method() == HTTP_OPTIONS) {
            AsyncWebServerResponse *response = request->beginResponse(204);
            response->addHeader("Access-Control-Allow-Origin", "*");
            response->addHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
            response->addHeader("Access-Control-Allow-Headers", "*");
            request->send(response);
        } else {
            request->send(404);
        }
    });

    server.begin();
}

// ==========================================================
// == SỬ DỤNG LẠI HÀM LOOP() CHÍNH XÁC VÀ THÔNG MINH NHẤT ===
// ==========================================================
void loop()
{
    if (doorIsOpen)
    {
        long distance = getDistance();
        Serial.print("Dang kiem tra khoang cach: ");
        Serial.println(distance);

        // 1. Kiểm tra xem có người đang ở gần cửa không
        if (distance < distanceThreshold) {
            Serial.println("Nguoi da di qua. Dong cua.");
            closeTheDoor();
        }
    }
    else
    {
        // ... (phần code quét thẻ giữ nguyên)
        if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
        {
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
                handleCorrectCard(userName);
            }
            else
            {
                handleIncorrectCard();
            }
            rfid.PICC_HaltA();
            rfid.PCD_StopCrypto1();
        }
    }
    delay(100);
}