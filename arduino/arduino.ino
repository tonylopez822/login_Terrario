#include "DHTesp.h"
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "iPhone de Enrique";
const char* password = "123456781";

const char* serverUrl = "http://74.208.74.18:443/api/peticiones/temperaturahumedad";

int pinDHT = 15;
DHTesp dht;

void setup() {
  Serial.begin(115200);
  dht.setup(pinDHT, DHTesp::DHT11);

  WiFi.begin(ssid, password);
  Serial.println("Conectando a la red WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando...");
  }
  Serial.println("Conectado a la red WiFi");
}

void loop() {
  TempAndHumidity data = dht.getTempAndHumidity();
  
  Serial.print("Temperatura: ");
  Serial.print(data.temperature);
  Serial.println(" °C");
  
  Serial.print("Humedad: ");
  Serial.print(data.humidity);
  Serial.println(" %");
  
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    String url = serverUrl;
    
    http.begin(url);
    
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    
    String postData = "temperatura=" + String(data.temperature, 2) + "&humedad=" + String(data.humidity, 1) + "&idTerrario=19";

    Serial.print("Enviando datos al servidor: ");
    Serial.println(postData);
    
    int httpCode = http.POST(postData);
    
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.print("Respuesta del servidor: ");
      Serial.println(payload);
    } else {
      Serial.print("Error al realizar la solicitud HTTP. Código de error: ");
      Serial.println(httpCode);
    }
    
    http.end();
  } else {
    Serial.println("No se puede enviar la solicitud, no se ha conectado a WiFi");
  }
  
  delay(10000);
}


