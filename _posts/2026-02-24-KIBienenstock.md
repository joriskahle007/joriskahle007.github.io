---
layout: post
title: Vom Bienenstock in die Cloud - Wie ich meine Bienenstockwaage mit KI, Microsoft Fabric und GPT-4o Realtime verbunden habe
tags: [IoT, Fabric, Power BI, Realtime, CSP, Azure, GPT, Foundry, Voice, Speech]
---

Als Imker denkt man selten an Cloud-Architektur, Echtzeit-APIs oder KI-Sprachassistenten. Ende Januar dachte ich mir : Was, wenn ich meine Bienenstöcke in Echtzeit überwachen könnte? Und was, wenn sie mir sogar per Sprache antworten würden? Diese Idee klang zunächst verrückt, aber genau solche Projekte haben das Potenzial, Hobbyimkerei auf ein völlig neues Level zu heben.<br>

In den letzten Tagen ist aus dieser kleinen Idee ein vollwertiges IoT-System geworden, das Gewicht, Temperatur und Luftfeuchtigkeit misst, die Daten in Microsoft Fabric speichert, sie visualisiert und per GPT-4o Realtime auswertet. Dabei handelt es sich nicht nur um ein technisches Spielzeug, sondern um ein praktisches Werkzeug, das mir hilft, die Gesundheit und Produktivität meiner Bienenvölker besser zu verstehen und zu steuern.<br><br>

## Warum eine smarte Bienenstockwaage?

Bienenstöcke sind dynamisch. Wenn ein Volk schwärmt, verliert der Stock innerhalb weniger Stunden mehrere Kilogramm. Während der Trachtphase steigt das Gewicht kontinuierlich an, und im Winter zeigt sich am Gewicht, ob noch genügend Futter vorhanden ist. Früher bedeutete dies: hinfahren, den Stock anheben, schätzen, Notizen machen. Ich wollte jedoch mehr: kontinuierliche Daten, präzise Messungen und das alles aus der Ferne.<br>

Mit der digitalen Waage unter dem Bienenstock, kombiniert mit Temperatur- und Luftfeuchtigkeitssensoren, kann ich nun jederzeit einen vollständigen Überblick über den Zustand jedes Volkes erhalten. Die Waage sendet jede Minute die Messwerte in die Cloud. Durch die Kombination von Echtzeitmessungen und historischen Daten kann ich Trends erkennen, frühe Warnungen erhalten und sogar Vorhersagen treffen, wann ein Schwarm wahrscheinlich wird oder wie sich die Tracht entwickelt.<br><br>

## Hardware: ESP32, SHT31-D und HX711 Halbbrücken-Wägezelle

Das Herzstück meiner Waage ist der ESP32-Mikrocontroller. Aber die Sensortechnik ist entscheidend. Für die Temperatur- und Luftfeuchtigkeitsmessung setze ich auf den SHT31-D Sensor. Er liefert präzise und stabile Messwerte, selbst bei wechselnden Außentemperaturen und Feuchtigkeitsschwankungen. Damit kann ich genau erkennen, ob das Klima im Bienenstock optimal ist.<br>

Für die Gewichtsmessung nutze ich pro Bienenstock 4 Halbbrücken-Wägezelle in Kombination mit einem HX711 ADC-Modul. Die Halbbrücken-Technik ist robust und ideal für die Belastung durch Bienenstockgewicht. Der HX711 wandelt die analogen Signale der Wägezelle in digitale Daten um, die der ESP32 auslesen kann. Zusammen mit der Kalibrierung ermöglicht dies eine Messgenauigkeit im Gramm-Bereich, was für Schwarm- und Futterüberwachung entscheidend ist.<br>

<img src="/assets/img/aufbau.jpg" alt="ESP-Aufbau" /><br><br>
<br><br>

Für die korrekte Montage der Wägezellen lässt ein Freund passende Halterungen im 3D-Drucker anfertigen. Parallel dazu wird die Verkabelung optimiert und die gesamte Technik in wasserdichte Behälter verbaut. Da die Wägezellen noch nicht final montiert sind, konnte die Kalibrierung noch nicht abgeschlossen werden, die aktuell etwas kuriosen Messwerte sind daher bewusst in Kauf genommen und werden sich nach der finalen Installation normalisieren.<br><br>

Hier ein kleines Code-Schnipsel, wie die Sensoren ausgelesen und die Daten per MQTT gesendet werden:<br>

```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const HX711 = require('hx711');
const SHT31 = require('sht31');


const scale = new HX711(DOUT_PIN, SCK_PIN);
const climate = new SHT31(I2C_BUS);


function readSensors() {
  const weight = scale.get_units();
  const { temperature, humidity } = climate.read();
  return { weight, temperature, humidity };
}


setInterval(() => {
  const data = readSensors();
  client.publish('bienenwaage/stock1/gewicht', data.weight.toString());
  client.publish('bienenwaage/stock1/temperatur', data.temperature.toString());
  client.publish('bienenwaage/stock1/luftfeuchtigkeit', data.humidity.toString());
}, 60000);
```

Mit dieser Kombination aus ESP32, SHT31-D und HX711 ist die Waage in der Lage, hochpräzise Messwerte zu liefern, die zuverlässig und regelmäßig in die Cloud übertragen werden.<br><br>

## Raspberry Pi und ioBroker als Gateway

Bei uns im Haus läuft ioBroker bereits seit Jahren als Smart-Home-Zentrale. Es steuern knapp hundert Sensoren und Aktoren das Licht, Bewegungsmelder, Rauchmelder, Rollläden und weitere Geräte. Für die Bienenstockwaage musste lediglich der MQTT-Adapter installiert und konfiguriert werden. Der bestehende JavaScript-Adapter, der schon für diverse Automatisierungen im Haus im Einsatz war, konnte direkt für die Übertragung der Messwerte in Richtung Microsoft Fabric genutzt werden. Dank dieser vorhandenen Infrastruktur war der Einstieg extrem einfach, und die Bienenstockdaten integrierten sich nahtlos in das bestehende Smart-Home-System.<br>

<img src="/assets/img/mqtt.jpg" alt="MQTT-Adapter" /><br><br>
Der Adapter erhält vom ESP die Messdaten!<br><br><br>

<img src="/assets/img/javascript.jpg" alt="javascript" /><br><br>
<br><br>

Das JavaScript-Skript sammelt die Daten aus den MQTT-Topics, puffert sie und schreibt sie regelmäßig als CSV-Dateien in Microsoft Fabric. Dabei sorgt ein persistenter Sequenz-Counter dafür, dass die Dateien fortlaufend nummeriert werden, was für Open Mirroring und die spätere Verarbeitung entscheidend ist.<br>

```javascript
const fs = require('fs');
const path = require('path');

const sequenceState = getState('javascript.0.bienenwaage.fileSequence');
function writeCsv(data) {
  const filename = sequenceState.value.toString().padStart(20, '0') + '.csv';
  fs.writeFileSync(path.join('/OneLake/LandingZone/messwerte', filename), data);
  setState('javascript.0.bienenwaage.fileSequence', sequenceState.value + 1);
}
```
<br><br>
## Microsoft Fabric: Detaillierte Schritte

Die Verarbeitung in Microsoft Fabric gliedert sich in mehrere Schritte:

1. **CSV-Upload in OneLake Landing Zone** – Das JavaScript-Skript auf dem Raspberry Pi schreibt die CSV-Dateien in einen speziell vorbereiteten Ordner in OneLake, z.B. /LandingZone/messwerte/. Jede Datei wird chronologisch nummeriert.

2. **Open Mirroring** – Fabric erkennt automatisch neue CSV-Dateien und spiegelt sie in eine Delta-Tabelle. Dabei werden die Daten strukturiert und für SQL-Abfragen vorbereitet, ohne dass manuell ein Schema definiert werden muss.

3. **Metadata-Definition** – Über die _metadata.json Datei wird festgelegt, welche Spalten als Schlüssel dienen (timestamp, scale_id) und welche Dateierweiterung genutzt wird (.csv).

4. **Spark Notebook Transformation** – Ein Fabric Spark Notebook verarbeitet die Rohdaten, bereinigt Ausreißer, wandelt Zeitstempel in einheitliches Format um und bereitet die Daten für Visualisierung und KI auf.

5. **SQL-Endpunkt & Power BI Integration** – Die bereinigten Delta-Tabellen sind direkt über den SQL-Endpunkt abfragbar. Power BI Dashboards greifen darauf zu, visualisieren Trends, Gewichtsentwicklung, Temperaturverläufe und Luftfeuchtigkeit, und aktualisieren automatisch in Echtzeit.

6. **Historische Daten für GPT-4o Realtime** – Der KI-Assistent nutzt die SQL-Abfragen, um historische Zusammenfassungen (Durchschnitt, Min, Max der letzten 30 Tage) zu erstellen. So kann er fundierte Antworten geben, die nicht nur auf aktuellen, sondern auch auf historischen Daten basieren.

<img src="/assets/img/fabriccsv.jpg" alt="Fabric - CSV" /><br><br>
<br><br>

Dieser Aufbau erlaubt eine nahtlose Integration von Hardware-Daten in die Cloud, deren Analyse und Visualisierung, sowie die Anbindung an den KI-Sprachassistenten. Jeder Schritt ist automatisiert, zuverlässig und skalierbar.<br><br>

## Power BI Dashboard

Power BI zeigt in Echtzeit Gewicht, Temperatur und Luftfeuchtigkeit. Historische Trends sind ebenso abrufbar. Früher hätte ich Tabellen stundenlang analysieren müssen, heute genügt ein Blick auf das Dashboard.<br><br>

<img src="/assets/img/powerbi.jpg" alt="javascript" /><br><br>

## KI-Sprachassistent mit GPT-4o Realtime

Der spannendste Teil des Projekts ist der GPT-4o Realtime Sprachassistent. Dieser wurde in der Region West US 2 deployt und liefert eine beeindruckende Echtzeit-Konversation. Anders als bei klassischen REST-basierten APIs wird hier Audio bidirektional über WebRTC übertragen – der Browser sendet einen SDP-Offer, Azure antwortet mit einem SDP-Answer und ab diesem Moment fließt der Audio-Stream in beide Richtungen.<br>

<img src="/assets/img/realtime.jpg" alt="javascript" /><br><br>

Das Ergebnis ist nahezu latenzfreie Kommunikation. Der Assistent kann Fragen zu aktuellen Messwerten oder historischen Trends beantworten, Zusammenhänge erkennen und sogar Vorhersagen basierend auf den letzten 30 Tagen liefern. Die Kombination aus Fabric SQL-Daten, Delta-Tabellen und Echtzeit-Audio macht die Interaktion fast schon magisch – man hat das Gefühl, direkt mit dem Bienenstock zu sprechen.<br>

Der Proxy-Server auf dem Raspberry Pi stellt sicher, dass die Azure OpenAI API-Keys sicher bleiben, während ngrok einen stabilen HTTPS-Tunnel bereitstellt. Alles zusammen ermöglicht eine sichere, zuverlässige und vollständig interaktive Konversation.<br><br>

## Architekturübersicht

```
[ESP32] --> MQTT --> [Raspberry Pi/ioBroker] --> CSV Upload --> [Microsoft Fabric Delta Table] --> Power BI & GPT-4o Realtime
```

Dieses Diagramm stellt die fünf Schichten des Systems vereinfacht dar: Edge (ESP32), Gateway (Raspberry Pi), Cloud (Fabric), Analyse (Power BI), KI (GPT-4o).<br><br>

## Lessons Learned

Die größte Herausforderung war, die richtige Azure Realtime API zu finden und CORS-Probleme zu lösen. Der Sequenz-Counter musste persistent gespeichert werden, und das Proxy-Setup erforderte einige Tests. Diese Hürden zeigten mir, wie flexibel moderne Cloud-Lösungen für Hobbyprojekte sein können.<br><br>

## Ausblick

Weitere Bienenstöcke lassen sich leicht hinzufügen, Schwarm-Erkennung automatisieren, Wetterdaten einbinden und Wintercluster überwachen. Eine feste Tunnel-URL könnte Stabilität erhöhen. Die Basis steht, und die Möglichkeiten sind nahezu unbegrenzt.<br><br>

## Fazit

Aus der simplen Frage „Wie schwer ist mein Bienenstock?“ ist ein vollwertiges IoT-System mit Cloud-Datenpipeline und KI-Sprachassistent entstanden. ESP32, ioBroker, Microsoft Fabric, Power BI und GPT-4o Realtime (Microsoft Foundry) arbeiten zusammen wie ein kleines verteiltes Enterprise System – nur eben für Bienen. Sie haben keine Ahnung, dass sie Teil einer Cloud-KI-Pipeline sind, aber ich bin mir sicher, dass sie es feiern würden. 🐝<br><br>
