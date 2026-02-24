

Wie ich meine Bienenstockwaage mit KI, Microsoft Fabric und GPT-4o Realtime verbunden habe

Joris Kahle · Februar 2026

Bienen, Daten und ein bisschen Verrücktheit

Als Imker steht man normalerweise nicht in der Werkstatt und denkt über Cloud Architektur, Echtzeit APIs oder Sprachassistenten nach. Man denkt über Varroa, Tracht und Wetterumschwünge nach.

Und trotzdem stand ich genau da. Zwischen Holz, Wachs und Werkzeug. Mit einem ESP32 in der Hand und der Frage im Kopf:

Was wäre eigentlich, wenn ich meine Bienenstöcke in Echtzeit überwachen könnte – von überall auf der Welt – und sie mir sogar per Sprache Auskunft geben würden?

Was als kleine Spielerei begann, ist inzwischen ein vollständiges IoT System geworden. Meine Bienenstockwaage misst Gewicht, Temperatur und Luftfeuchtigkeit im 60 Sekunden Takt, sendet alles in die Azure Cloud, speichert es in Microsoft Fabric, visualisiert es in Power BI und beantwortet mir Fragen per GPT 4o Realtime.

Ja, das ist genau so nerdig, wie es klingt.

Und ja, es funktioniert.

Warum überhaupt eine smarte Bienenstockwaage?

Ein Bienenvolk ist dynamisch. Extrem dynamisch.

Wenn ein Volk schwärmt, verliert der Stock innerhalb weniger Stunden mehrere Kilogramm. Wenn die Tracht beginnt, steigt das Gewicht kontinuierlich an. Im Winter kann man am Gewicht erkennen, ob genug Futter vorhanden ist.

Traditionell heißt das: hinfahren, anheben, schätzen, notieren.

Ich wollte Daten. Kontinuierlich. Präzise. Historisch auswertbar.

Also kam eine digitale Waage unter den Bienenstock. Dazu Temperatur- und Luftfeuchtigkeitssensoren. Und plötzlich hatte ich nicht nur ein Gefühl für den Zustand des Volkes, sondern ein belastbares Datenset.

Die Hardware: klein, günstig, erstaunlich leistungsfähig

Herzstück des Ganzen ist ein ESP32. Eingebautes WLAN, stromsparend, riesige Community. Er liest die Wägezellen aus, sammelt die Sensordaten und sendet alles per MQTT weiter.

Gemessen wird:

Gewicht in Kilogramm
Temperatur in Grad Celsius
Luftfeuchtigkeit in Prozent
WLAN Signalstärke in dBm

Das klingt erstmal unspektakulär. Aber in Summe entsteht daraus ein vollständiges Bild über die Aktivität des Volkes.

MQTT ist dabei das perfekte Protokoll. Leichtgewichtig, robust, ideal für IoT Szenarien. Jeder Messwert landet sauber auf einem Topic. Das System ist bereits für fünf Bienenstöcke vorbereitet. Skalierung ist also kein Problem.

Der Raspberry Pi als Gehirn

Alle Daten laufen auf einem Raspberry Pi 4 zusammen. Dort läuft ioBroker als zentrale Plattform.

Der MQTT Adapter empfängt die Daten.
Ein JavaScript Adapter verarbeitet sie weiter.
Ein kleines eigenes Script sammelt alle Werte in einem Puffer.

Und jetzt kommt der spannende Teil.

Alle 60 Sekunden werden die gesammelten Daten als CSV Datei in Microsoft Fabric geschrieben.

Nicht per kompliziertem ETL Prozess. Nicht mit einem riesigen Data Engineering Setup.

Einfach als Datei.

Microsoft Fabric: Wenn aus CSV plötzlich eine echte Datenplattform wird

Fabric ist für mich eines der spannendsten Produkte im Azure Umfeld. Data Engineering, Data Science, Realtime Analytics und BI in einer Plattform.

Ich nutze das Open Mirroring Feature.

Die Idee ist fast schon zu simpel: Man legt CSV Dateien in einen definierten Ordner im OneLake ab. Fabric erkennt sie automatisch, konvertiert sie in eine Delta Tabelle und macht sie über einen SQL Analyseendpunkt verfügbar.

Kein Schema Gefrickel. Kein manuelles Mapping.

Eine kleine metadata.json Datei definiert die Schlüsselspalten. Den Rest übernimmt Fabric.

Ein Spark Notebook sorgt zusätzlich dafür, dass alles sauber strukturiert wird.

Und plötzlich habe ich eine professionelle Datenplattform für meine Bienen.

Das fühlt sich immer noch absurd an.

Power BI: Wenn die Bienen plötzlich Dashboards bekommen

Auf der Delta Tabelle sitzt direkt ein Power BI Bericht.

Gewichtsverläufe. Temperaturkurven. Luftfeuchtigkeit. Signalstärke.

Alles automatisch aktualisiert.

Ich kann unterwegs auf dem Smartphone sehen, ob ein Volk ungewöhnlich an Gewicht verliert oder ob die Temperaturen im Stock auffällig steigen.

Was früher Bauchgefühl war, ist jetzt Datenanalyse.

Sicherheit first: Warum ein Proxy notwendig war

Der spannendste Teil kam danach.

Ich wollte nicht nur Daten sehen. Ich wollte mit ihnen sprechen.

Also habe ich einen KI Sprachassistenten gebaut. Gehostet auf GitHub Pages, erreichbar über joriskahle.de.

Das Problem: API Keys gehören niemals ins Frontend.

Die Lösung: Ein Express Proxy Server auf dem Raspberry Pi.

Der Browser spricht mit dem Proxy.
Der Proxy spricht mit Azure OpenAI.
Die Keys bleiben sicher auf dem Server.

Zusätzlich läuft ein HTTPS Tunnel über ngrok, damit es keine Mixed Content Probleme gibt. Beide Dienste starten automatisch beim Booten als systemd Services.

Historische Daten direkt aus Fabric SQL

Der Proxy verbindet sich über das mssql Paket direkt mit dem SQL Analyseendpunkt von Fabric.

Damit kann er die letzten 30 Tage Messdaten aggregieren und statistisch auswerten.

Durchschnitt. Minimum. Maximum.

Diese Zusammenfassung wird in den System Prompt des Assistenten eingebettet.

Das bedeutet: Der Assistent kennt nicht nur den aktuellen Wert, sondern auch den historischen Kontext.

Er weiß, ob eine Temperatur ungewöhnlich hoch ist.
Er erkennt, ob das Gewicht atypisch gefallen ist.

Das ist kein Gimmick mehr. Das ist kontextuelle Datenintelligenz.

GPT 4o Realtime: Sprechen mit dem Bienenstock

Das Highlight ist ganz klar GPT 4o Realtime.

Über WebRTC läuft bidirektionales Audio direkt im Browser. Der Browser sendet einen SDP Offer an Azure, bekommt einen SDP Answer zurück und ab diesem Moment fließt Audio in Echtzeit.

Ich kann sagen:
"Wie schwer ist Stock 1 gerade?"
Oder: "War die Temperatur diese Woche ungewöhnlich hoch?"

Und bekomme eine fundierte, datenbasierte Antwort.

Der System Prompt wird bei jeder Verbindung dynamisch aus echten Live Daten zusammengesetzt.

Aktuelle Messwerte.
Historische Zusammenfassung.
Zeitstempel der letzten Messung.

Das ist keine Demo. Das ist ein echtes, produktives Mini System.

Die Architektur in fünf Ebenen

Ganz vereinfacht besteht das System aus fünf Schichten.

Edge: ESP32 misst und sendet per MQTT.
Gateway: Raspberry Pi mit ioBroker empfängt und puffert.
Cloud: Microsoft Fabric speichert und verarbeitet.
Analyse: Power BI und SQL Endpunkt liefern Insights.
KI: GPT 4o Realtime beantwortet Fragen per Sprache.

Alle Komponenten sind entweder kostenlos oder sehr günstig. Und alles läuft 24 Stunden am Tag auf handelsüblicher Hardware.

Was ich gelernt habe

Erstens: Dokumentation ist nicht immer so klar, wie man es sich wünscht. Den richtigen Realtime Endpunkt zu finden, hat mich einige Tests gekostet.

Zweitens: CORS und HTTPS sind keine Nebensache. Mixed Content Fehler blockieren gnadenlos.

Drittens: Persistenz ist entscheidend. Der Sequenz Counter für die CSV Dateien musste dauerhaft gespeichert werden, sonst wären alte Daten überschrieben worden.

Und viertens: Fabric ist mächtig. Sehr mächtig. Selbst in einem Hobbyprojekt.

Was als Nächstes kommt

Das System ist skalierbar. Weitere Bienenstöcke können jederzeit integriert werden.

Eine automatische Schwarm Erkennung ist technisch trivial: Mehrere Kilogramm Gewichtsverlust in kurzer Zeit sind ein klares Signal.

Wetterdaten könnten integriert werden. Wintercluster Monitoring ist möglich. Eine feste Tunnel Lösung wäre ebenfalls sinnvoll.

Die Basis steht.

Fazit: Imkerei trifft KI

Was mit der simplen Frage begann, wie schwer mein Bienenstock gerade ist, hat sich zu einer vollständigen Cloud Datenpipeline mit Sprach KI entwickelt.

ESP32, Raspberry Pi, Microsoft Fabric, Power BI und GPT 4o Realtime arbeiten zusammen wie ein kleines verteiltes Enterprise System.

Nur eben für Bienen.

Und das ist vielleicht das Schönste an diesem Projekt.

Die Bienen haben keine Ahnung, dass sie Teil einer Cloud Architektur sind.

Aber ich bin ziemlich sicher, dass sie es feiern würden. 🐝
