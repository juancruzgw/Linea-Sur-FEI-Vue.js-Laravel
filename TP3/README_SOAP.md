# 🌡️ Servicio SOAP + Wrapper REST - TP3 Línea Sur

## 📋 Tabla de Contenidos

- [¿Qué es el servicio SOAP?](#qué-es-el-servicio-soap)
- [Características Técnicas](#características-técnicas)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Comparativa XML vs JSON](#comparativa-xml-vs-json)
- [Beneficios del Wrapper REST](#beneficios-del-wrapper-rest)
- [Cómo Probarlo](#cómo-probarlo)

---

## 🧪 ¿Qué es el servicio SOAP?

**SOAP (Simple Object Access Protocol)** es un protocolo de mensajería basado en XML que permite la comunicación entre aplicaciones distribuidas. En este proyecto, consumimos el servicio público de W3Schools que convierte temperaturas entre Celsius y Fahrenheit.

### Servicio Consumido

- **URL WSDL:** https://www.w3schools.com/xml/tempconvert.asmx?WSDL
- **Proveedor:** W3Schools
- **Operaciones disponibles:**
  - `CelsiusToFahrenheit` - Convierte de °C a °F
  - `FahrenheitToCelsius` - Convierte de °F a °C

---

## ⚙️ Características Técnicas

### Protocolo SOAP

- **Versión:** SOAP 1.2
- **Transporte:** HTTP POST
- **Namespace:** `https://www.w3schools.com/xml/`
- **Formato de datos:** XML
- **Encoding:** UTF-8

### Wrapper REST (Laravel)

- **Framework:** Laravel 12
- **Lenguaje:** PHP 8.2+
- **Cliente SOAP:** SoapClient nativo de PHP
- **Formato de respuesta:** JSON
- **Endpoints expuestos:**
  - `GET /api/temperature/convert` - Conversión simple
  - `POST /api/temperature/batch-convert` - Conversión múltiple
  - `GET /api/temperature/soap/info` - Metadata del servicio

---

## 📝 Ejemplos de Uso

### 1️⃣ Request SOAP (XML Original)

```xml
POST https://www.w3schools.com/xml/tempconvert.asmx
Content-Type: text/xml; charset=utf-8

<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CelsiusToFahrenheit xmlns="https://www.w3schools.com/xml/">
      <Celsius>25</Celsius>
    </CelsiusToFahrenheit>
  </soap:Body>
</soap:Envelope>
```

### 2️⃣ Response SOAP (XML Original)

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CelsiusToFahrenheitResponse xmlns="https://www.w3schools.com/xml/">
      <CelsiusToFahrenheitResult>77</CelsiusToFahrenheitResult>
    </CelsiusToFahrenheitResponse>
  </soap:Body>
</soap:Envelope>
```

**Tamaño:** ~420 bytes

---

### 3️⃣ Request REST Wrapper (JSON Moderno)

```bash
GET http://localhost:8000/api/temperature/convert?value=25&from=celsius&to=fahrenheit
```

### 4️⃣ Response REST Wrapper (JSON Moderno)

```json
{
  "message": "Conversión exitosa",
  "data": {
    "input": {
      "value": 25,
      "unit": "celsius"
    },
    "output": {
      "value": 77,
      "unit": "fahrenheit"
    },
    "formula": "(25°C × 9/5) + 32 = 77°F",
    "source": "W3Schools SOAP Service",
    "timestamp": "2025-10-27T15:30:00.000000Z"
  }
}
```

**Tamaño:** ~280 bytes (33% más pequeño)

---

## 📊 Comparativa XML vs JSON

| Característica          | SOAP (XML)            | REST Wrapper (JSON)   |
| ----------------------- | --------------------- | --------------------- |
| **Tamaño del payload**  | ~420 bytes            | ~280 bytes            |
| **Legibilidad**         | Baja (verbose)        | Alta (conciso)        |
| **Parsing**             | Complejo (DOM/SAX)    | Nativo en JavaScript  |
| **Flexibilidad**        | Rígido (Schema WSDL)  | Flexible              |
| **Metadatos**           | Solo resultado        | Fórmula + timestamp   |
| **Manejo de errores**   | SOAP Faults complejos | HTTP Status + JSON    |
| **Consumo en frontend** | Requiere librerías    | Axios/Fetch nativo    |
| **Latencia**            | Mayor (overhead XML)  | Menor (JSON compacto) |

---

## ✨ Beneficios del Wrapper REST

### 🚀 Para el Frontend

- **Simplicidad:** Consumo directo con `axios.get()` sin configurar clientes SOAP
- **Tipado:** TypeScript interfaces para autocompletado y validación
- **Debugging:** Herramientas de desarrollo de navegador funcionan nativamente
- **Caché:** HTTP caching estándar con headers

### 🛡️ Para el Backend

- **Validación centralizada:** Laravel Validator antes de llamar SOAP
- **Logging robusto:** Registro de todas las operaciones SOAP
- **Manejo de errores:** Catch de `SoapFault` con mensajes user-friendly
- **Rate limiting:** Posibilidad de limitar requests al servicio externo
- **Transformación de datos:** Enriquecimiento con fórmulas y metadata

### 🔒 Seguridad

- **Abstracción:** El frontend nunca conoce el servicio SOAP subyacente
- **Timeout:** Protección contra servicios lentos/caídos (10 segundos)
- **Validación:** Input sanitization antes de enviar al SOAP

---

## 🧪 Cómo Probarlo

### 🔧 Con Postman

#### Conversión Simple

```
GET http://localhost:8000/api/temperature/convert
Params:
  - value: 100
  - from: celsius
  - to: fahrenheit
```

**Respuesta esperada:** `212°F`

---

#### Conversión Múltiple

```
POST http://localhost:8000/api/temperature/batch-convert
Content-Type: application/json

{
  "conversions": [
    {"value": 0, "from": "celsius", "to": "fahrenheit"},
    {"value": 100, "from": "celsius", "to": "fahrenheit"},
    {"value": 32, "from": "fahrenheit", "to": "celsius"},
    {"value": 212, "from": "fahrenheit", "to": "celsius"}
  ]
}
```

**Respuesta esperada:** Array con 4 conversiones (32°F, 212°F, 0°C, 100°C)

---

#### Info del Servicio SOAP

```
GET http://localhost:8000/api/temperature/soap/info
```

**Respuesta esperada:** Metadata completa del WSDL

---

### 💻 Con cURL (PowerShell)

```powershell
# Conversión simple
curl "http://localhost:8000/api/temperature/convert?value=25&from=celsius&to=fahrenheit"

# Conversión múltiple
curl -X POST "http://localhost:8000/api/temperature/batch-convert" `
  -H "Content-Type: application/json" `
  -d '{\"conversions\": [{\"value\": 25, \"from\": \"celsius\", \"to\": \"fahrenheit\"}]}'

# Info SOAP
curl "http://localhost:8000/api/temperature/soap/info"
```

---

### 🌐 Desde el Frontend React

Navega a: **http://localhost:5173/tools/temperature**

Interfaz gráfica con:

- Input numérico
- Selectores Celsius/Fahrenheit
- Botón de intercambio de unidades
- Visualización de fórmula
- Badge "Vía SOAP"
- Manejo de errores

---

## 🐛 Troubleshooting

### Error: "SOAP service unavailable"

- **Causa:** Timeout o servicio W3Schools caído
- **Solución:** Verifica conexión a internet, reintenta en unos minutos

### Error: "Validation failed"

- **Causa:** Parámetros incorrectos
- **Solución:** Verifica que `from` y `to` sean `celsius` o `fahrenheit` (lowercase)

### Error: 500 Internal Server Error

- **Causa:** Extensión SOAP no habilitada en PHP
- **Solución:**

  ```bash
  # Verificar extensión SOAP
  php -m | grep soap

  # Si no aparece, habilitar en php.ini
  extension=soap
  ```

---

## 📁 Archivos Creados

### Backend

```
backend-plecipitacion/API/
├── app/Http/Controllers/TemperatureController.php
└── routes/api.php (modificado)
```

### Frontend

```
front/precipitacionWeb/
├── src/
│   ├── services/temperatureService.tsx
│   └── components/Temperature/TemperatureConverter.tsx
└── src/App.tsx (modificado - nueva ruta)
```

---

## 🎯 Endpoints Disponibles

| Método | Endpoint                         | Descripción                    |
| ------ | -------------------------------- | ------------------------------ |
| GET    | `/api/temperature/convert`       | Conversión simple              |
| POST   | `/api/temperature/batch-convert` | Conversión múltiple (hasta 50) |
| GET    | `/api/temperature/soap/info`     | Metadata del servicio SOAP     |

---

## 📚 Referencias

- [SOAP Specification](https://www.w3.org/TR/soap/)
- [W3Schools SOAP Tutorial](https://www.w3schools.com/xml/xml_soap.asp)
- [Laravel SoapClient Docs](https://www.php.net/manual/en/class.soapclient.php)
- [REST API Best Practices](https://restfulapi.net/)

---

## 👨‍💻 Autor

**Proyecto TP3 - Línea Sur CONICET**  
Sistema de Monitoreo Hidroclimático - Patagonia  
Implementado como ejercicio académico de integración SOAP/REST

---

## 📅 Fecha de Implementación

27 de Octubre de 2025
