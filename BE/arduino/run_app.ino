#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- CẤU HÌNH MẠNG WIFI ---
const char *ssid = "Phan Nguyen 5G";
const char *password = "-p(x2)log(p(x2))";

// --- CẤU HÌNH API BACKEND ---
const char *backendApiUrl = "http://192.168.1.199:8027/v1/esp/get-card-esp";
const char *backendApiCheckInUrl = "http://192.168.1.199:8027/v1/esp/check-in-esp";
const char *backendApiCheckOutUrl = "http://192.168.1.199:8027/v1/esp/check-out-esp";
// Bổ sung API cho trường hợp không hợp lệ
const char *backendApiCheckInInvalidUrl = "http://192.168.1.199:8027/v1/esp/check-in-invalid-esp";
const char *backendApiCheckOutInvalidUrl = "http://192.168.1.199:8027/v1/esp/check-out-invalid-esp";
// Bổ sung API cho trường hợp đi ra ngoài không quẹt thẻ
const char *backendApiGoOutUrl = "http://192.168.1.199:8027/v1/esp/go-out-door-esp";
// *** BỔ SUNG MỚI: API cho các trường hợp đóng cửa chung ***
const char *backendApiDoorClosedUrl = "http://192.168.1.199:8027/v1/esp/door-closed-esp";


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
int distanceThreshold = 6;
bool doorIsOpen = false;
String doorStatusString = "CLOSED";
const char* doorCode = "DOOR_MAIN";

// --- CÁC BIẾน LOGIC ---
unsigned long lastPersonDetectedTime = 0;
const long autoCloseDelay = 5000; // Dùng cho người đi từ trong ra
bool openedFromInside = false;
bool personHasPassed = false;
// *** BỔ SUNG LOGIC MỚI ***
bool goOutApiSent = false; // Cờ để đảm bảo API go-out chỉ được gửi một lần
// --- BỔ SUNG ---: Biến cho logic tự động đóng cửa khi mở từ bên ngoài
unsigned long doorOpenTime = 0;
const long autoCloseOutsideDelay = 5000; // 5 giây


// --- DANH SÁCH NGƯỜI DÙNG TỪ API ---
String authorizedUsersString;

// --- CÁC HÀM XỬ LÝ ---

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

// Hàm gửi yêu cầu Check-in/Check-out
void sendApiRequest(const char* url, String uid) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        // Tạo JSON payload
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

// Hàm gửi yêu cầu đi ra ngoài không quẹt thẻ
void sendGoOutRequest(const char* url) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        // Tạo JSON payload chỉ với door_code
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

// *** HÀM MỚI: Gửi yêu cầu khi cửa đóng (trường hợp chung) ***
void sendDoorClosedRequest(const char* url) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        // Tạo JSON payload chỉ với door_code
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


// Hàm tìm kiếm trả về tên người dùng
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

// *** CẬP NHẬT HÀM NÀY ***
void closeTheDoor(bool sendClosedEvent = false) // Thêm tham số để kiểm soát việc gửi sự kiện
{
    // --- THAY ĐỔI: Góc đóng cửa là 0 ---
    myServo.write(0);
    doorIsOpen = false;
    doorStatusString = "CLOSED";
    Serial.println("CUA DA DONG");

    // Nếu cờ sendClosedEvent là true, gửi yêu cầu tới backend
    if (sendClosedEvent) {
        Serial.println("Gui API door-closed do tu dong dong.");
        sendDoorClosedRequest(backendApiDoorClosedUrl);
    }
    
    delay(500);
    displayInitialMessage();
}

// Chấp nhận thêm UID để gửi request
// *** CẬP NHẬT HÀM NÀY ***
void handleCorrectCard(String name, String uid)
{
    Serial.println("Xac thuc thanh cong cho: " + name);
    doorIsOpen = true;
    doorStatusString = "OPENED";

    if (name == "Inside User") {
        openedFromInside = true;
        lastPersonDetectedTime = millis();
        personHasPassed = false; // Reset trạng thái "đã đi qua"
        goOutApiSent = false;    // Reset cờ đã gửi API
    } else {
        openedFromInside = false;
        personHasPassed = false;
        // --- BỔ SUNG ---: Bắt đầu đếm thời gian khi cửa mở từ bên ngoài
        doorOpenTime = millis(); 
        
        // Gửi request check-in nếu người dùng mở từ bên ngoài (không phải Remote)
        if (name != "Remote User") {
            sendApiRequest(backendApiCheckInUrl, uid);
        }
    }

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Xin chao");
    lcd.setCursor(0, 1);
    lcd.print(name);
    // --- THAY ĐỔI: Góc mở cửa là 80 ---
    myServo.write(80);
}

// Sửa đổi hàm để chấp nhận UID và gọi API check-in-invalid
void handleIncorrectCard(String uid)
{
    Serial.println("Xac thuc that bai!");
    // Gọi API check-in không hợp lệ
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
    // --- THAY ĐỔI: Vị trí ban đầu là đóng (0 độ) ---
    myServo.write(0);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    lcd.init();
    lcd.backlight();
    
    // --- KHỞI TẠO WIFI ---
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

    // --- ĐỊNH NGHĨA CÁC API ENDPOINTS ---
    
    // API lấy trạng thái cửa
    server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        String jsonString = "{\"status\":\"" + doorStatusString + "\",\"message\":\"Trang thai cua hien tai.\",\"door_code\":\"" + String(doorCode) + "\"}";
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", jsonString);
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    // API mở cửa
    server.on("/api/door/open", HTTP_GET, [](AsyncWebServerRequest *request)
    {
        if (!doorIsOpen) {
            handleCorrectCard("Remote User", ""); // Không có UID cho remote
        }
        String jsonString = "{\"status\":\"" + doorStatusString + "\",\"message\":\"Da gui lenh mo cua thanh cong.\",\"door_code\":\"" + String(doorCode) + "\"}";
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", jsonString);
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    });

    // API đóng cửa
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

    // API lấy UID thẻ mới
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
        const long scanTimeout = 10000;

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
            AsyncWebServerResponse *response = request->beginResponse(44, "application/json", jsonString);
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
            // Logic xử lý quẹt thẻ để check-out (đi ra)
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

                        // Hiển thị thông báo tạm biệt
                        lcd.clear();
                        lcd.setCursor(0, 0);
                        lcd.print("Tam biet");
                        lcd.setCursor(0, 1);
                        lcd.print(userName);
                        delay(2000); // Chờ 2 giây

                        closeTheDoor(); // Đóng cửa sau khi hiển thị thông báo
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

            // *** LOGIC MỚI: XỬ LÝ NGƯỜI ĐI RA KHÔNG QUẸT THẺ ***
            
            // 1. Nếu phát hiện có người ở gần cửa, đánh dấu là đã thấy và reset thời gian tự động đóng
            if (distance < distanceThreshold) {
                personHasPassed = true; // Đánh dấu đã phát hiện người
                lastPersonDetectedTime = millis(); // Reset bộ đếm thời gian
                Serial.println("Phat hien nguoi (di ra), reset thoi gian dong cua.");
            }

            // 2. Nếu trước đó đã thấy người (personHasPassed = true), nhưng BÂY GIỜ không thấy nữa
            //    VÀ API chưa được gửi, thì đây chính là lúc người đó vừa đi qua.
            if (personHasPassed && !goOutApiSent && distance >= distanceThreshold) {
                Serial.println("Nguoi (di ra) da di qua. Gui API go-out.");
                sendGoOutRequest(backendApiGoOutUrl);
                goOutApiSent = true; // Đánh dấu đã gửi API để không gửi lại
            }

            // 3. Nếu hết thời gian chờ, đóng cửa.
            //    Logic này sẽ xử lý cả 2 trường hợp:
            //    - Mở cửa nhưng không ai đi ra -> cửa tự đóng.
            //    - Có người đi ra -> cửa đóng sau khi họ đã đi qua một lúc.
            if (millis() - lastPersonDetectedTime > autoCloseDelay) {
                Serial.println("Khong con ai (di ra), tu dong dong cua.");
                // API "go-out" đã được gửi ở trên. Ở đây chỉ cần đóng cửa và gửi sự kiện "door-closed".
                closeTheDoor(true);
            }
        }
        else // Cửa được mở từ bên ngoài
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
    else // Cửa đang đóng
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