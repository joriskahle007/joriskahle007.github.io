---
layout: post
title: Azure OpenAI-Modelle 2025: Vollständiger Überblick – leicht verständlich
tags: [CSP, Azure, GPT, Azure AI Foundry, Modelle]
---

Es gibt inzwischen so viele KI-Modelle über Azure OpenAI – da den Überblick zu behalten, kann ganz schön herausfordernd sein. Aber keine Sorge, ich erkläre dir in diesem Beitrag alles Schritt für Schritt, verständlich und anschaulich. Von GPT-3.5 über o-Serien, GPT-4-Reihe bis hin zu GPT-5, Audio- und Bildmodellen – und sogar dem Modellrouter. Außerdem zeige ich dir, welche Modelle für welche Use Cases am besten geeignet sind.!<br>

## Die Modellauswahl im Überblick

Azure AI Foundry bietet dir eine beeindruckende Bandbreite an Modellen. Hier die wichtigsten:

| Modellgruppe / Name |	Kurzbeschreibung |
| GPT-3.5 |	Fortschritt gegenüber GPT-3: besseres Sprach- und Codeverständnis |
| GPT-4 |	Nächste Generation, präziser, leistungsfähiger |
| GPT-4o / GPT-4o-Mini / GPT-4 Turbo |	Multimodal (Text & Bild), Turbo-Version für höhere Geschwindigkeit |
| o-Series (o1, o3, o-mini) |	Speziell für logisches Denken & Problemlösung, größere Input-Fenster |
| codex-mini |	Sprachmodell mehr mit Fokus auf Code, Ableitung aus o4-Mini |
| model-router |	Automatischer Auswahlmechanismus für das optimale Modell je Prompt |
| computer-use-preview |	Experimentelles Modell für toolgestützte Antworten |
| Embeddings, Image generation, Audio-Modelle |	Für Vektor-Einbettung, Bild & Audio, z. B. Speech-to-Text, TTS |
| GPT-5 Serie (gpt-5, mini, nano, chat) |	Neueste Generation mit logischem Denken, Multimodalität, Tool-Unterstützung – mit enormen Tokenfenstern |


## Regionale Verfügbarkeit der Modelle
<li>**GPT-5 Modelle** (Standard, mini, nano, chat) sind aktuell in **East US 2** und **Sweden Central** verfügbar. Für GPT-5 ist eine Registrierung nötig, die kleineren Varianten hingegen nicht</li>
<li>Die älteren Modelle (**GPT-4, o-Serien, GPT-4o etc.**) sind breit über viele Regionen verfügbar – beispielweise auch in **Sweden Central, Germany West, East US, West US* und weiteren</li>

💡 Tipp: Sora ist aktuell nur eingeschränkt verfügbar. Wenn du also Videos einsetzen willst, solltest du vorher prüfen, ob das Modell in deiner Region freigeschaltet ist.<br>

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

## Azure Speech Service vs. gpt-4o Realtime Preview
Der Azure Speech Service und gpt-4o Realtime Preview erfüllen unterschiedliche Rollen: Speech Service ist ein spezialisierter Sprachdienst für präzise Transkription (ASR), natürlich klingende Text-to-Speech-Stimmen, Übersetzungen und Speaker-Features wie Diarisierung. Er eignet sich vor allem, wenn es um saubere Transkripte, Anpassungen mit Fachvokabular, Custom Voices oder sogar On-Prem-Deployments mit strengen Datenschutzanforderungen geht und wird nach Audio-Stunden oder erzeugten Zeichen abgerechnet. gpt-4o Realtime hingegen ist ein multimodales Sprachmodell, das Audio direkt versteht und in Echtzeit generative Antworten als Text oder Sprache zurückgibt – also perfekt für interaktive Dialog-Systeme, Assistenten oder Voice Agents, bei denen es auf natürliche Konversationen ankommt. Technisch setzt es auf WebRTC/WebSockets für niedrige Latenz, hat in der Preview bestimmte Limits (z. B. ca. 100.000 Tokens pro Minute und 1.000 Requests pro Minute) und wird tokenbasiert abgerechnet. Während Speech Service für höchste Transkriptionsqualität und anpassbare Stimmen die bessere Wahl ist, punktet gpt-4o Realtime bei kontextreichen Gesprächen und generativer Intelligenz. In vielen Szenarien ergänzt sich beides: Speech Service liefert die robuste Sprachbasis, gpt-4o Realtime sorgt für die intelligente, konversationsfähige Ebene.<br><br>

## Fazit

Mit Azure AI Foundry erhältst du Zugang zu einer breiten Palette von Modellen – von klassischen Chatbots über Bild-/Audio-KI bis hin zu leistungsfähigen GPT-5-Varianten. Überlege dir einfach:
**1.) Was ist dein Use Case?** (Text, Bild, Audio, Chat-Agent, Code etc.)
**2.) Wie viel Leistung & Token-Kapazität brauchst du?**
**3.) Wo wird das Modell gehostet?** (Regionale Verfügbarkeit checken)
**4.) Welche TPM- und Kostenbedingungen sind akzeptabel?**
Dann wählst du das Modell, das am besten passt – und nutzt es effizient, effizient und kostenbewusst.
