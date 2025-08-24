---
layout: post
title: Azure OpenAI GPT-Modelle - Vollständiger Überblick – leicht verständlich
tags: [CSP, Azure, GPT, Azure AI Foundry, Modelle]
---

Es gibt inzwischen so viele KI-Modelle über Azure OpenAI – da den Überblick zu behalten, kann ganz schön herausfordernd sein. Aber keine Sorge, ich erkläre dir in diesem Beitrag alles Schritt für Schritt, verständlich und anschaulich. Von GPT-3.5 über o-Serien, GPT-4-Reihe bis hin zu GPT-5, Audio- und Bildmodellen – und sogar dem Modellrouter. Außerdem zeige ich dir, welche Modelle für welche Use Cases am besten geeignet sind.!<br>

Wenn du in Azure AI Foundry KI-Modelle ausrollen möchtest, gibt es ein paar Dinge, die wichtig sind – auch wenn du dich bei Foundry-Modellen wie GPT nicht um die eigentliche Infrastruktur kümmern musst. Microsoft stellt diese Modelle als Managed Service bereit, das heißt: Skalierung, GPUs und Hochverfügbarkeit laufen automatisch im Hintergrund. Deine Rolle verschiebt sich dadurch: Statt Compute-Kapazitäten zu planen, konzentrierst du dich auf die richtige Modellwahl, Kostenkontrolle und die Einbettung in deine Anwendungen. Achte darauf, von Anfang an sauber zwischen Test- und Produktionsumgebung zu trennen, um Transparenz und Kosten im Griff zu behalten. Sicherheit spielt ebenfalls eine zentrale Rolle: Richte Rollen und Berechtigungen sorgfältig ein und denke an Datenschutz und Verschlüsselung, vor allem wenn sensible Daten verarbeitet werden. Ein weiterer Erfolgsfaktor ist Monitoring: Auch wenn du das Modell nicht selbst betreibst, solltest du Protokollierung, Auslastung und Antwortqualität im Blick behalten – so erkennst du frühzeitig, ob dein Setup angepasst werden muss. Und schließlich ist es sinnvoll, die Kostenmodelle gut zu verstehen, da die Abrechnung meist nutzungsbasiert über Tokens erfolgt. Kurz gesagt: Bei Foundry-Modellen musst du dich nicht um Hardware oder Compute kümmern, aber dafür umso mehr um Governance, Sicherheit, Monitoring und Kostenmanagement.<br><br>

Wenn du im Azure AI Foundry ein GPT-Modell von Microsoft nutzt, hast du mit den Rechenressourcen nichts direkt zu tun.

Die gesamte Infrastruktur – GPUs, Skalierung, Updates, Verfügbarkeit – liegt bei Microsoft. Für dich bleibt die Perspektive eine reine API-Nutzung:

<li>Du rufst das Modell über einen Endpunkt auf.</li>
<li>Du zahlst nach Nutzungseinheiten (z. B. Tokens).</li>
<li>Du musst keine VM starten, keine GPU auswählen und auch kein Autoscaling konfigurieren.</li>

Deine Verantwortung verschiebt sich dadurch: Statt dich mit Hardware oder Compute zu beschäftigen, achtest du eher auf Themen wie Kostenkontrolle, Rate Limits, Zugriffssicherheit, Daten- und Prompt-Management sowie Governance.

👉 Nur wenn du eigene Modelle trainierst oder hostest, kommst du wieder in die Welt der Rechenressourcen zurück.<br><br>

## Welches Modell für welchen Use Case?

Die große Stärke der Azure OpenAI Plattform liegt darin, dass du dir genau das Modell aussuchen kannst, das am besten zu deinem Projekt passt. Damit du nicht nur Tabellenwerte siehst, sondern auch verstehst, wofür sich die einzelnen Varianten lohnen, habe ich die wichtigsten Anwendungsfälle hier ausführlicher beschrieben:

| Use Case |	Modellgruppe |	Beschreibung & Vorteile |
| Standard-Textverarbeitung |	GPT-3.5, GPT-4 |	Ideal, wenn du klassische Chatbots, FAQ-Antworten oder Texterstellung brauchst. Diese Modelle sind zuverlässig, laufen stabil und sind im Vergleich zu den neuesten Generationen günstiger. |
| Komplexe Analysen & Logik |	o-Series, GPT-4	| Wenn es um tiefere Analysen, datenbasierte Auswertungen oder komplexes Problemlösen geht, bist du hier richtig. Diese Modelle können lange Kontexte verarbeiten und sind stark im „logischen Denken“. |
| Multimodale Aufgaben (Text & Bild) |	GPT-4o, GPT-4 Turbo |	Du willst Bilder beschreiben lassen oder Text mit Bildinhalten kombinieren? Diese Modelle verstehen und erzeugen multimodale Inhalte und sind perfekt für Szenarien wie Dokumentanalyse mit Bildanteilen oder kreative Content-Erstellung. |
| Realtime Sprachdialoge |	GPT-4o-realtime-preview |	Stelle dir vor, du sprichst mit einer KI wie mit einem echten Menschen. Diese Variante ermöglicht latenzarme Sprach-zu-Sprach-Kommunikation – perfekt für Assistenten, Callcenter oder interaktive Sprachtools. |
| Transkription / TTS |	GPT-4o Audio-Modelle |	Wenn du Meetings transkribieren, Podcasts zusammenfassen oder Sprache in Text (und umgekehrt) verwandeln willst, bist du hier richtig. Die Audio-Modelle sind optimiert für Spracheingaben und -ausgaben. |
| Automatisiertes Modell-Routing |	model-router |	Du willst dich gar nicht mit Modellwahl beschäftigen? Der Router nimmt dir diese Entscheidung ab und leitet deine Anfrage automatisch an das am besten passende Modell weiter. Ideal für Systeme, die flexibel bleiben müssen. |
| Tool-getriebene Antworten (Code etc.) |	computer-use-preview |	Dieses Modell ist für Szenarien gedacht, in denen die KI gezielt Tools steuert oder externe Systeme anbindet. Ein Beispiel: Code schreiben und gleichzeitig gleich testen lassen. |
| High-End Reasoning & große Kontexte |	GPT-5 (Standard) |	Hier bekommst du die volle Power: riesige Kontextfenster, logisches Denken, multimodale Verarbeitung. Geeignet für wissenschaftliche Analysen, komplexe Unternehmensprozesse oder Forschung. |
| Schnelle, ressourcenschonende KI |	GPT-5 mini / nano |	Nicht jede Aufgabe braucht die „große Kanone“. Mini- und Nano-Modelle sind optimiert auf Geschwindigkeit und Kosten – ideal für einfache Chatbots, Microservices oder Apps mit vielen gleichzeitigen Usern. |
| Chat-Agent mit Kontextmanagement  |	GPT-5 chat | Wenn du längere Gespräche führst, in denen der Kontext nicht verloren gehen darf, spielt dieses Modell seine Stärke aus. Ideal für Support-Chatbots oder persönliche Assistenten. |
| Lokale Nutzung / Offline |	gpt-oss-20B / 120B (Open-Weight) |	Für alle, die ihre Daten nicht in die Cloud geben können oder wollen: Die Open-Weight-Modelle laufen lokal und bieten dir maximale Kontrolle – mit dem Nachteil, dass du selbst die Infrastruktur stemmen musst. |<br>

💡 Tipp: Wenn du viele Anfragen gleichzeitig stellen möchtest, ist GPT-5 Nano oder Mini aufgrund ihrer hohen TPM-Werte besonders geeignet. Für kreative Aufgaben wie Storytelling oder Content Creation ist GPT-4.5 optimal, während für komplexe logische Aufgaben GPT-5 Standard die beste Wahl ist.<br><br>

## Regionale Verfügbarkeit der Modelle
<li><b>GPT-5 Modelle</b> (Standard, mini, nano, chat) sind aktuell in <b>East US 2</b> und <b>Sweden Central</b> verfügbar. Für GPT-5 ist eine Registrierung nötig, die kleineren Varianten hingegen nicht</li>
<li>Die älteren Modelle <b>(GPT-4, o-Serien, GPT-4o etc.)</b> sind breit über viele Regionen verfügbar – beispielweise auch in **Sweden Central, Germany West, East US, West US* und weiteren</li><br>

💡 Tipp: Sora ist aktuell nur eingeschränkt verfügbar. Wenn du also Videos einsetzen willst, solltest du vorher prüfen, ob das Modell in deiner Region freigeschaltet ist.<br>

## Azure Speech Service vs. gpt-4o Realtime Preview
Der Azure Speech Service und gpt-4o Realtime Preview erfüllen unterschiedliche Rollen: Speech Service ist ein spezialisierter Sprachdienst für präzise Transkription (ASR), natürlich klingende Text-to-Speech-Stimmen, Übersetzungen und Speaker-Features wie Diarisierung. Er eignet sich vor allem, wenn es um saubere Transkripte, Anpassungen mit Fachvokabular, Custom Voices oder sogar On-Prem-Deployments mit strengen Datenschutzanforderungen geht und wird nach Audio-Stunden oder erzeugten Zeichen abgerechnet. gpt-4o Realtime hingegen ist ein multimodales Sprachmodell, das Audio direkt versteht und in Echtzeit generative Antworten als Text oder Sprache zurückgibt – also perfekt für interaktive Dialog-Systeme, Assistenten oder Voice Agents, bei denen es auf natürliche Konversationen ankommt. Technisch setzt es auf WebRTC/WebSockets für niedrige Latenz, hat in der Preview bestimmte Limits (z. B. ca. 100.000 Tokens pro Minute und 1.000 Requests pro Minute) und wird tokenbasiert abgerechnet. Während Speech Service für höchste Transkriptionsqualität und anpassbare Stimmen die bessere Wahl ist, punktet gpt-4o Realtime bei kontextreichen Gesprächen und generativer Intelligenz. In vielen Szenarien ergänzt sich beides: Speech Service liefert die robuste Sprachbasis, gpt-4o Realtime sorgt für die intelligente, konversationsfähige Ebene.<br><br>
Zu diesem Thema werden ich einen eigenes Blogbeitrag verfassen. Sei bespannt, welche Insides ich hier für dich hier habe.

## Fazit

Mit Azure AI Foundry erhältst du Zugang zu einer breiten Palette von Modellen – von klassischen Chatbots über Bild-/Audio-KI bis hin zu leistungsfähigen GPT-5-Varianten. Überlege dir einfach:
<li><b>1.) Was ist dein Use Case?</b> (Text, Bild, Audio, Chat-Agent, Code etc.)</li>
<li><b>2.) Wie viel Leistung & Token-Kapazität brauchst du?</b></li>
<li><b>3.) Wo wird das Modell gehostet?</b> (Regionale Verfügbarkeit checken)</li>
<li><b>4.) Welche TPM- und Kostenbedingungen sind akzeptabel?</b></li>
Dann wählst du das Modell, das am besten passt – und nutzt es effizient, effizient und kostenbewusst.
