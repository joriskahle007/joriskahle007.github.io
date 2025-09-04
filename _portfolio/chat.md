---
layout: post
title: Lizenz Audio Voice Bot - realisiert mit gpt4o Realtime + Fabric
img: "assets/img/portfolio/chat.png"
date: September 2014
tags: [ChatBot, Azure Open AI, GPT 4o Realtime, RAG ,Fabric]
---

![image]({{ page.img | relative_url }})

Wer sich mit den Lizenzmodellen von Microsoft auseinandersetzt, merkt ziemlich schnell: spannend klingt anders. Oft wirken die Regelwerke trocken, kompliziert und nicht immer eindeutig. Besonders dann, wenn verschiedene Lizenzmodelle ineinandergreifen, kann man sich leicht in Details verlieren. Unterschiedliche Auslegungen einzelner Passagen machen die Sache nicht leichter – und ohne jahrelange Erfahrung oder direkten Draht zum Hersteller stößt man hier schnell an Grenzen. Klassische Modelle wie Open Value, Select, MPSA oder die bekannten Enterprise Agreements sind vielen zwar ein Begriff, wirken aber in Zeiten von Cloud und Flexibilität schon fast wie Relikte. Microsoft selbst steuert daher klar in Richtung Zukunft: Das CSP-Modell soll langfristig das bunte Lizenz-Wirrwarr ablösen.

Ein Sonderfall ist allerdings das SPLA-Modell (Service Provider Licensing Agreement). Hier übernimmt nicht der Endkunde die Rolle des Lizenznehmers, sondern der Service Provider selbst – mit dem besonderen Recht, diese Lizenzen an Endkunden weiterzuvermieten. Gerade in diesem Bereich fehlt es inzwischen an Experten, die die Feinheiten wirklich durchdringen. Und doch stehen zahlreiche Service Provider vor genau diesen lizenzrechtlichen Herausforderungen, bei denen fundiertes Fachwissen unerlässlich ist.

Genau hier setzte meine Idee an: Inspiriert durch ein Video von Pamela Fox im Microsoft Reactor wollte ich ausprobieren, ob sich die neuen Möglichkeiten von GPT-4o Realtime mit einer RAG-Lösung (Retrieval Augmented Generation) kombinieren lassen, um einen Sprach-basierten Lizenz-Bot zu entwickeln, der Service Providern direkt und zuverlässig helfen kann. Statt das Rad neu zu erfinden, griff ich dabei auf ein vorhandenes Repository zurück:👉 <a href="https://github.com/Azure-Samples/aisearch-openai-rag-audio" target="_blank" rel="noopener">github.com/Azure-Samples/aisearch-openai-rag-audio</a>.

<img src="/assets/img/portfolio/aisearchgithub.jpg" alt="Azure AI Search RAG Audio" />

Das Architekturszenario ist denkbar spannend: Über Azure AI Search wird der Datenbestand durchsucht, GPT-4o Realtime übernimmt die Sprachschnittstelle, und als Datenplattform nutze ich Microsoft Fabric. Mit GitHub Codespaces habe ich die App per Script in meiner Azure Subscription deployed. Automatisch wurden die notwendigen Ressourcen erstellt: ein Container App Backend, ein Azure OpenAI Service mit GPT-4o Realtime, ein Search Service, ein Log Analytics Workspace, eine Container Apps Environment, eine Managed Identity sowie eine Container Registry.


## Das Architectur Diagramm sieht wie folgt aus:
<img src="/assets/img/portfolio/architecturediagram.jpg" alt="RAG Voice BOT - Architecture Diagram" />


Mit GitHub Codespaces habe ich die App per Script in meiner Azure Subscription deployed und gehofft, dass alles funktioniert. Als Datengrundlage legte ich zunächst einen Blob Storage an, lud die relevanten Lizenzdokumente hoch, passte das Frontend etwas an – und schon schien der Bot betriebsbereit. Dachte ich zumindest.

## Folgende Services werden vom Script deployed:

<img src="/assets/img/portfolio/azureressource.jpg" alt="Azure AI Ressource" /><br><br>


Automatisch wurde vom System auch in AI Foundry das GPT-4o Realtime Modell deployd. Die Restlichen Modelle habe ich zu Testzwecken im Nachgang manuell ausgerollt.

<img src="/assets/img/portfolio/gptrealtime.jpg" alt="Azure AI Ressource" /><br>

Die Ernüchterung kam zunächst schnell: Die Antworten waren unpräzise, teilweise schlicht falsch. Denn im SPLA-Modell sind die Lizenzrechte klar in den sogenannten SPUR (Service Provider Use Rights) definiert, die Microsoft online bereitstellt. Ich hatte die Inhalte zwar in Word-Dateien kopiert und hochgeladen – inklusive offizieller Vertragsdokumente – aber das Modell fing trotzdem an zu halluzinieren und falsche Antworten als korrekt zu verkaufen. Damit wurde mir eines klar: Die Qualität der Daten ist in solchen Szenarien absolut entscheidend. Also ging ich einen Schritt weiter und formulierte die Lizenzregeln in meinen eigenen Worten, so wie ich sie täglich Partnern erkläre. Je präziser ich wurde, desto verlässlicher antwortete der Bot.

Im nächsten Schritt verlagerte ich die Datenhaltung von Blob Storage auf Microsoft Fabric. Nicht nur, weil Microsoft selbst stark auf Fabric setzt, sondern auch, weil ich meine eigene Expertise dort ausbauen wollte. Ich richtete also einen Data Lake ein, lud die Dokumente hoch und konfigurierte den Azure AI Search Service so, dass nicht mehr Blob Storage, sondern der Data Lake indexiert wurde. Nach ein paar zusätzlichen Rechtevergaben in Fabric lief der Lizenzbot nun auf einer zukunftsweisenden Datenplattform – und konnte nicht nur Antworten geben, sondern diese auch mit Quellen belegen.<br>


## Im DataLake wurden die Daten für den Indexder bereitgestellt:<br>

<img src="/assets/img/portfolio/datalake.jpg" alt="Azure - Fabric - Connector" /><br><br>




## Der Connector zu Fabric wurde eingerichtet:<br>

<img src="/assets/img/portfolio/connector.jpg" alt="Azure - Fabric - Connector" /><br><br>




## Und fertig war die finale Lösung:<br>
Das Spannende dabei ist noch, dass das Modell die Quelle von den Antworten gleich mit angibt und man hier nachlesen kann. 

<img src="/assets/img/portfolio/frontend.jpg" alt="GPT License Voice Audio Bot" /><br>


## Warum GPT-4o Realtime?

Der Einsatz von GPT-4o Realtime bietet im Vergleich zu klassischen Speech-to-Text- und Text-to-Speech-Services von Azure entscheidende Vorteile. Während die herkömmlichen Dienste getrennt arbeiten und damit zwangsläufig eine gewisse Latenz verursachen, ist GPT-4o Realtime multimodal trainiert und verarbeitet Sprache, Text und Audio in einem einzigen Modell. Das Ergebnis sind deutlich schnellere Reaktionszeiten, flüssigere Dialoge und die Fähigkeit, sogar Tonalität oder Emotionen im Sprachfluss zu berücksichtigen. Allerdings ist dieser Komfort auch mit höheren Kosten verbunden und der Dienst ist aktuell nur in den USA und in Schweden verfügbar – daher musste ich in meiner Subscription auf die Region USA ausweichen.<br><br>

##Kosten der eingesetzten Dienste

Um ein Gefühl für die Kosten zu bekommen, lohnt ein Blick auf die einzelnen Bausteine der Lösung:

- **Azure OpenAI (GPT-4o Realtime)**: Die Preise liegen bei rund **$44 pro Million Tokens** Input und **$88 pro Million Tokens Output**, mit deutlich günstigeren Raten bei gecachtem Input (ca. $2,75 pro Million Tokens). Ein Beispiel mit 1 Stunde Sprachdialog (etwa 360.000 Tokens) kommt schnell auf rund **$48 pro Nutzungseinheit**.

- **Azure AI Search**: Die Abrechnung erfolgt pro Such-Einheit (Search Unit). Im kleineren Basic-Tier liegt man bei etwa **75 € pro Monat**, für produktive Szenarien mit mehr Leistung sind es schnell **200–250 € pro Monat**.

- **Azure Container Apps**: Hier bezahlt man pro vCPU- und RAM-Sekunde. Durch die Möglichkeit, Instanzen auf null zu skalieren, bleiben die Kosten oft niedrig. In meinem Test lagen die Aufwände je nach Auslastung zwischen **5 € und 25 € im Monat**.

- **Azure Container Registry**: Für die Standardnutzung fallen ca. **4–5 € pro Monat an**.

- **Azure Log Analytics Workspace**: Hier wird nach eingehenden Logs abgerechnet. Für die ersten 5 GB pro Monat ist der Service kostenlos, danach liegt der Preis bei etwa **2 € pro GB**. In meinem Szenario summierte sich das auf wenige Euro.

- **Azure Container Apps Environment**: Die Umgebung selbst verursacht keine hohen Zusatzkosten – sie wird über die Ressourcennutzung der eigentlichen Container Apps abgedeckt.

- **Managed Identity**: Für die Identitätsverwaltung entstehen keine direkten Zusatzkosten.<br><br>

In Summe lässt sich das Projekt mit unter **100 € pro Monat im Testbetrieb** realisieren, sofern die Nutzung moderat bleibt. Mit produktiver Auslastung (intensive Sprachdialoge, viele Anfragen an die AI Search, große Logmengen) können die Kosten aber schnell dreistellig werden, wobei der größte Kostenblock klar beim GPT-4o Realtime-Modell liegt.

## Fazit

Das Projekt zeigt eindrucksvoll, welches Potenzial in der Verbindung von GPT-4o Realtime mit Azure AI Search und Microsoft Fabric steckt. Was bislang nur mit großem Aufwand in klassischen Service-Abteilungen möglich war, lässt sich nun durch einen intelligenten, Sprach-basierten Lizenzbot in Echtzeit bereitstellen. Die Vorteile liegen auf der Hand: Der Bot ist rund um die Uhr verfügbar, benötigt keine Pausen, wird niemals krank und reagiert stets zuverlässig sowie freundlich – selbst dann, wenn die Anfrage zum hundertsten Mal gestellt wird.

Darüber hinaus liefert er in kürzester Zeit präzise und nachvollziehbare Antworten, verweist direkt auf die zugrunde liegenden Dokumente und ermöglicht so nicht nur Effizienzsteigerung, sondern auch Transparenz und Vertrauen. Service-Mitarbeitende, die bislang stundenlang Dokumente durchforsten oder interne Rückfragen stellen mussten, können entlastet werden und sich auf komplexere oder beratungsintensive Fälle konzentrieren. Für Unternehmen bedeutet dies nicht nur einen enormen Produktivitätsgewinn, sondern auch eine klare Kostenreduktion – sowohl durch die Automatisierung von Standardanfragen als auch durch die Möglichkeit, Servicekapazitäten gezielt dort einzusetzen, wo sie wirklich benötigt werden.

Es handelt sich hierbei um eine absolut bahnbrechende Entwicklung, die über den konkreten Anwendungsfall SPLA-Lizenzierung weit hinausgeht. Ob im Kundenservice, im technischen Support oder in internen Wissensabteilungen – ein solcher Sprachbot lässt sich bei jedem Endkunden einsetzen und an die jeweiligen Inhalte anpassen. Der Mehrwert ist universell: schnelle Antworten, Verfügbarkeit rund um die Uhr und eine gleichbleibend hohe Qualität der Auskünfte.

Damit öffnet diese Lösung die Tür in eine neue Ära des intelligenten Kunden- und Servicemanagements. Unternehmen, die frühzeitig auf solche Technologien setzen, können sich nicht nur von Wettbewerbern abheben, sondern auch nachhaltig ihre Kostenstruktur verbessern, die Kundenzufriedenheit steigern und die Qualität der internen Prozesse auf ein neues Level heben. Wenn Ihr FRagen habt, kommt gerne auf mich zu.

