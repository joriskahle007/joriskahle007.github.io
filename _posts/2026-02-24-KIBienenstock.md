---

title: "🐝 Vom Bienenstock in die Cloud: Wie ich meine Bienenstockwaage mit KI, Microsoft Fabric und GPT-4o Realtime verbunden habe"
date: "2026-02-24"
author: "Joris Kahle"
tags: [IoT, Bienen, Microsoft Fabric, GPT-4o, Cloud, Power BI]
excerpt: "Ein Einblick, wie ich meine Bienenstöcke in Echtzeit überwache, Daten in die Cloud schicke und mit GPT-4o Realtime spreche."
--------------------------------------------------------------------------------------------------------------------------------------

## Bienen, Daten und ein bisschen Verrücktheit

Als Imker denkt man selten an Cloud-Architektur, Echtzeit-APIs oder KI-Sprachassistenten. Ich stand jedoch eines Tages zwischen Holz, Wachs und Werkzeug und fragte mich: Was, wenn ich meine Bienenstöcke in Echtzeit überwachen könnte? Und was, wenn sie mir sogar auf Sprache antworten würden? So begann ein Projekt, das sowohl meine Werkstatt als auch meine Vorstellungskraft sprengte. Was als kleines Experiment begann, ist inzwischen ein voll funktionsfähiges IoT-System, das Gewicht, Temperatur und Luftfeuchtigkeit misst, die Daten in Microsoft Fabric speichert, visualisiert und per GPT-4o Realtime auswertet. Es war eine Mischung aus handwerklicher Präzision, Softwarebastelei und Cloud-Know-how.

## Warum eine smarte Bienenstockwaage?

Ein Bienenvolk lebt im ständigen Wandel. Wenn ein Volk schwärmt, verliert der Stock innerhalb weniger Stunden mehrere Kilogramm. Wenn die Tracht beginnt, steigt das Gewicht kontinuierlich an, und im Winter zeigt sich am Gewicht, ob genügend Futter vorhanden ist. Früher bedeutete das: hinfahren, den Stock anheben, schätzen, Notizen machen. Ich wollte jedoch mehr: kontinuierliche Daten, präzise Messungen, und das alles aus der Ferne. Mit einer digitalen Waage unter dem Bienenstock, kombiniert mit Temperatur- und Luftfeuchtigkeitssensoren, kann ich nun jederzeit einen kompletten Überblick über das Volk erhalten. Es ist, als hätten die Bienen plötzlich eine Sprache, die ich verstehen kann, ohne dass ich täglich vor Ort sein muss.

## Die Hardware: ESP32 und Sensordaten

Der ESP32 ist das Herzstück meiner Waage. Dieser Mikrocontroller ist klein, stromsparend und verfügt über integriertes WLAN. Er sammelt die Sensordaten der Wägezellen, der Temperatur- und Luftfeuchtigkeitssensoren und sendet sie zuverlässig über MQTT weiter. Jede Minute werden die Daten übertragen, sodass ich einen nahezu Live-Einblick in das Verhalten der Bienenstöcke erhalte. Es fühlt sich an, als würde ein winziger Assistent unermüdlich alles aufzeichnen, während ich mich anderen Dingen widmen kann.

Hier ein kleiner Ausschnitt aus dem Script, das die Daten vom ESP32 an MQTT sendet:

```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

function sendSensorData(weight, temp, humidity) {
  client.publish('bienenwaage/stock1/gewicht', weight.toString());
  client.publish('bienenwaage/stock1/temperatur', temp.toString());
  client.publish('bienenwaage/stock1/luftfeuchtigkeit', humidity.toString());
}

setInterval(() => {
  const weight = readWeightSensor();
  const temp = readTemperatureSensor();
  const humidity = readHumiditySensor();
  sendSensorData(weight, temp, humidity);
}, 60000);
```

## Raspberry Pi und ioBroker als Gateway

Alle Daten laufen auf einem Raspberry Pi 4 zusammen. Dort empfängt ioBroker die MQTT-Nachrichten, puffert sie und schreibt sie regelmäßig als CSV-Dateien in Microsoft Fabric. Der Sequenz-Counter stellt sicher, dass keine Datei überschrieben wird, selbst nach einem Neustart. Hier ein Auszug des Upload-Skripts:

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

## Microsoft Fabric: Die Cloud-Pipeline

Microsoft Fabric wandelt die CSV-Dateien automatisch in Delta-Tabellen um, bereit für SQL-Abfragen oder Power BI Dashboards. Das Open Mirroring Feature spart enorm Zeit, da kein manuelles Schema-Management nötig ist. Zusätzlich wird ein Spark Notebook verwendet, um die Daten zu strukturieren und für den KI-Assistenten aufzubereiten.

## Power BI Dashboard

Power BI zeigt in Echtzeit Gewicht, Temperatur und Luftfeuchtigkeit. Historische Trends sind ebenso abrufbar. Früher hätte ich Tabellen stundenlang analysieren müssen, heute genügt ein Blick auf das Dashboard.

## KI-Sprachassistent mit GPT-4o Realtime

Dank WebRTC kann ich direkt aus dem Browser mit GPT-4o Realtime kommunizieren. Der Assistent kennt aktuelle Messwerte und historische Daten der letzten 30 Tage. Über einen Proxy auf dem Raspberry Pi bleibt die API-Key-Sicherheit gewährleistet. Ngrok sorgt für HTTPS-Verbindungen und verhindert Mixed-Content-Probleme.

## Architekturübersicht

```
[ESP32] --> MQTT --> [Raspberry Pi/ioBroker] --> CSV Upload --> [Microsoft Fabric Delta Table] --> Power BI & GPT-4o Realtime
```

Dieses Diagramm stellt die fünf Schichten des Systems vereinfacht dar: Edge (ESP32), Gateway (Raspberry Pi), Cloud (Fabric), Analyse (Power BI), KI (GPT-4o).

## Lessons Learned

Die größte Herausforderung war, die richtige Azure Realtime API zu finden und CORS-Probleme zu lösen. Der Sequenz-Counter musste persistent gespeichert werden, und das Proxy-Setup erforderte einige Tests. Diese Hürden zeigten mir, wie flexibel moderne Cloud-Lösungen für Hobbyprojekte sein können.

## Ausblick

Weitere Bienenstöcke lassen sich leicht hinzufügen, Schwarm-Erkennung automatisieren, Wetterdaten einbinden und Wintercluster überwachen. Eine feste Tunnel-URL könnte Stabilität erhöhen. Die Basis steht, und die Möglichkeiten sind nahezu unbegrenzt.

## Fazit

Aus der simplen Frage „Wie schwer ist mein Bienenstock?“ ist ein vollwertiges IoT-System mit Cloud-Datenpipeline und KI-Sprachassistent entstanden. ESP32, ioBroker, Microsoft Fabric, Power BI und GPT-4o Realtime arbeiten zusammen wie ein kleines verteiltes Enterprise System – nur eben für Bienen. Sie haben keine Ahnung, dass sie Teil einer Cloud-KI-Pipeline sind, aber ich bin mir sicher, dass sie es gut finden würden. 🐝

Joris Kahle · Februar 2026
