Vom Bienenstock in die Cloud: Wie ich meine Bienenstockwaage mit KI, Microsoft Fabric und GPT-4o Realtime verbunden habe" date: "2026-02-24" author: "Joris Kahle" tags: [IoT, Bienen, Microsoft Fabric, GPT-4o, Cloud, Power BI] excerpt: "Ein Einblick, wie ich meine Bienenstöcke in Echtzeit überwache, Daten in die Cloud schicke und mit GPT-4o Realtime spreche."
Bienen, Daten und ein bisschen Verrücktheit

Als Imker denkt man selten an Cloud Architektur, Echtzeit-APIs oder Sprachassistenten. Trotzdem stand ich eines Tages in meiner Werkstatt zwischen Holz, Wachs und Werkzeug, mit dem Gedanken: Was wäre, wenn ich meine Bienenstöcke in Echtzeit überwachen könnte – von überall auf der Welt – und sie mir sogar per Sprache Auskunft geben würden?

Was als kleine Spielerei begann, ist inzwischen ein vollständiges IoT-System geworden. Meine Bienenstockwaage misst Gewicht, Temperatur und Luftfeuchtigkeit jede Minute, sendet alles in die Azure Cloud, speichert es in Microsoft Fabric, visualisiert es in Power BI und beantwortet Fragen per GPT-4o Realtime.

Ja, das klingt nerdig. Und ja, es funktioniert.

Warum eine smarte Bienenstockwaage?

Ein Bienenvolk ist dynamisch: Wenn ein Volk schwärmt, verliert es innerhalb weniger Stunden mehrere Kilogramm. Während der Trachtphase steigt das Gewicht kontinuierlich. Im Winter zeigt das Gewicht, ob noch genug Futter vorhanden ist.

Traditionell bedeutet das: hinfahren, anheben, schätzen, notieren. Ich wollte kontinuierliche, präzise und historisch auswertbare Daten.

Die Lösung: eine digitale Waage unter dem Bienenstock kombiniert mit Temperatur- und Luftfeuchtigkeitssensoren. So entsteht ein vollständiges Bild über den Zustand des Volkes – jederzeit und von überall.

Hardware: ESP32, Wägezellen und MQTT

Herzstück ist ein ESP32. Eingebautes WLAN, stromsparend, preiswert und unterstützt von einer großen Community. Der Mikrocontroller liest die Sensordaten aus und sendet sie per MQTT weiter.

Gemessen wird:

Gewicht in Kilogramm

Temperatur in °C

Luftfeuchtigkeit in %

WLAN-Signalstärke

MQTT ist das perfekte Protokoll für IoT: leichtgewichtig, robust und ideal für batteriebetriebene oder netzwerkbegrenzte Geräte. Jeder Messwert landet auf einem Topic, das System ist für fünf Bienenstöcke vorbereitet – Skalierung kein Problem.

Raspberry Pi als Gateway und Gehirn

Ein Raspberry Pi 4 mit ioBroker empfängt die MQTT-Daten, puffert sie und führt mein Upload-Script aus. Alle 60 Sekunden schreibt es die Messwerte als CSV-Datei in Microsoft Fabric OneLake. Der Sequenz-Counter für die CSV-Dateien wird dauerhaft gespeichert, sodass keine alten Daten überschrieben werden.

Microsoft Fabric: Die Datenpipeline

Microsoft Fabric wandelt die CSV-Dateien automatisch in Delta-Tabellen um – über Open Mirroring. Kein ETL-Aufwand, kein Schema-Gefrickel. Ein Spark Notebook sorgt zusätzlich für saubere Datenstruktur. Jetzt sind die Bienenstöcke SQL-abfragbar und bereit für Power BI und GPT-4o.

Power BI Dashboard

Das Dashboard zeigt Gewicht, Temperatur, Luftfeuchtigkeit und Signalstärke aller Bienenstöcke. Automatische Aktualisierung erlaubt, von überall zu überprüfen, ob ein Schwarm droht oder die Trachtphase beginnt.

Proxy und Sicherheit

Der KI-Sprachassistent darf API-Keys nicht ins Frontend legen. Lösung: ein Express.js Proxy auf dem Raspberry Pi. Der Browser kommuniziert mit dem Proxy, der dann mit Azure OpenAI spricht. HTTPS-Tunnel via ngrok ermöglicht sichere Kommunikation.

Drei API-Endpunkte:

/api/token – ephemeral Token für GPT-4o Realtime

/api/sensor – aktuelle Messwerte aus Fabric SQL

/api/history – statistische Zusammenfassung der letzten 30 Tage

Historische Daten und KI-Kontext

Der Proxy liest die letzten 30 Tage aus Fabric SQL aus, berechnet Durchschnitt, Minimum, Maximum und füttert diese Zusammenfassung in den System Prompt. So kennt der Assistent aktuelle Werte und historische Trends.

GPT-4o Realtime: Sprechen mit dem Bienenstock

Bidirektionales Audio via WebRTC. Der Assistent weiß alles über Gewicht, Temperatur, Luftfeuchtigkeit und kann auf Fragen antworten wie:

„Wie schwer ist Stock 1 gerade?“

„War die Temperatur diese Woche ungewöhnlich hoch?“

System Prompt wird dynamisch aus Live-Daten zusammengesetzt – ein wirklich interaktives Erlebnis.

Architektur im Überblick

Edge: ESP32 misst und sendet Daten per MQTT

Gateway: Raspberry Pi mit ioBroker empfängt und puffert

Cloud: Microsoft Fabric speichert und verarbeitet Daten

Analyse: Power BI Dashboard & SQL Endpunkt

KI: GPT-4o Realtime beantwortet Fragen per Sprache

Alle Komponenten laufen rund um die Uhr auf handelsüblicher Hardware, teils kostenlos, teils kostengünstig.

Lessons Learned

Den richtigen Azure Realtime Endpunkt zu finden, erfordert Geduld.

HTTPS vs. HTTP: ngrok rettet Mixed Content.

Persistenz der Sequenz-Counter ist entscheidend.

Fabric ist mächtig, selbst in einem Hobbyprojekt.

Ausblick

Mehr Bienenstöcke integrieren

Schwarm-Erkennung automatisieren

Wetterdaten einbinden

Wintercluster-Überwachung

Feste Tunnel-URLs via Cloudflare

Fazit

Was als einfache Frage begann – „Wie schwer ist mein Bienenstock?“ – wurde ein vollständiges IoT-System mit Cloud-Datenpipeline und KI-Sprachassistent. Die Kombination aus ESP32, ioBroker, Microsoft Fabric, Power BI und GPT-4o zeigt, was heute möglich ist.

Die Bienen haben keine Ahnung, dass sie jetzt Teil einer Cloud-KI-Pipeline sind. Ich bin mir sicher, sie würden es gut finden. 🐝

Tech Stack Zusammenfassung:

Hardware: ESP32, Wägezellen, DHT-Sensor

Protokoll: MQTT über TCP

Gateway: Raspberry Pi 4 mit ioBroker

Cloud Storage: Microsoft Fabric OneLake (ADLS Gen2)

Datenpipeline: Fabric Open Mirroring + Spark Notebook

Datenbank: Delta Table über Fabric SQL-Analyseendpunkt

Visualisierung: Power BI mit Auto-Refresh

Backend: Node.js / Express.js Proxy-Server

Tunnel: ngrok HTTPS-Tunnel

KI: Azure OpenAI GPT-4o Realtime (WebRTC)

Frontend: Vanilla HTML/CSS/JS auf GitHub Pages

Hosting: joriskahle.de / GitHub Pages
