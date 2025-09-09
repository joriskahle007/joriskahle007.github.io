---
layout: post
title: OpenWebUI - LiteLLM - GPT
feature-img: "assets/img/portfolio/open.png"
img: "assets/img/portfolio/open.png"
date: 03 September 2025
tags: [OpenWebUI, GPT-Modelle, Azure, Azure Open AI, LiteLLM]
---

## OpenWebUI + Azure OpenAI – eine flexible Alternative zu den Abo-Modellen

Wer schon einmal mit den Bezahlmodellen von OpenAI gearbeitet hat, kennt das Prinzip: Man bucht ein Abo, erhält Zugriff auf bestimmte GPT-Modelle und zahlt eine monatliche Pauschale. Für viele Szenarien ist das völlig ausreichend – gerade, wenn man nur ein einzelnes Projekt betreiben oder sich schnell einen Überblick verschaffen will.
Doch was, wenn man mehr Flexibilität benötigt? Wenn man eigene Infrastruktur, eigene Integrationen oder einfach ein freieres Setup nutzen möchte? Genau dieser Gedanke war für mich der Ausgangspunkt für mein nächstes Projekt.

## Zielsetzung
Ich wollte eine Alternative zu den klassischen OpenAI-ABOs schaffen – mit mehr Kontrolle über die Architektur, besserer Kostensteuerung und der Möglichkeit, unterschiedliche Modelle in einer eigenen Umgebung parallel bereitzustellen.

## Die Basis: Azure Burstmaschine & OpenWebUI
Den Anfang machte eine sogenannte Burstmaschine in Azure. Diese Maschinen eignen sich besonders für Szenarien, in denen man phasenweise viel Rechenleistung benötigt, ohne dauerhaft hohe Kosten zu verursachen. Auf dieser Basis installierte ich OpenWebUI – eine schlanke, lokal laufende Oberfläche, die als Frontend für unterschiedliche Sprachmodelle genutzt werden kann. Damit hatte ich bereits eine zentrale Oberfläche, über die ich verschiedene Modelle im Browser ansprechen konnte.

## Azure OpenAI + AI Foundry
Parallel dazu habe ich in Azure den Azure OpenAI Service eingerichtet und in AI Foundry genau die Modelle bereitgestellt, die ich in meinem Projekt nutzen wollte. Damit stand mir die volle Leistungsfähigkeit der GPT-Modelle zur Verfügung – allerdings eben in meiner eigenen Azure-Subscription und nicht über ein Abo bei OpenAI direkt.

## Die Herausforderung: Die Welten verbinden
Theorie und Praxis klaffen oft auseinander – und so auch in diesem Fall.
So einfach, wie erhofft, ließ sich OpenWebUI nicht direkt mit Azure OpenAI verbinden. Zwar bietet OpenWebUI Schnittstellen für verschiedene Modelle, doch die Authentifizierung und API-Mechanismen von Azure OpenAI unterscheiden sich spürbar vom „klassischen“ OpenAI-Setup.

**Die Folge**: Anfragen liefen ins Leere oder wurden mit Fehlermeldungen quittiert. Damit war klar – eine direkte Kopplung war nicht zuverlässig möglich.

## Die Lösung: LiteLLM als Proxy
An diesem Punkt kam LiteLLM ins Spiel – ein leichtgewichtiger Proxy, der die Brücke zwischen OpenWebUI und Azure OpenAI schlagen kann. LiteLLM fungiert im Prinzip als Übersetzer: Es nimmt Anfragen aus OpenWebUI entgegen, wandelt sie in das passende Format für Azure OpenAI um und leitet die Antworten zurück.
Das Ergebnis: OpenWebUI konnte plötzlich nahtlos mit den Modellen aus Azure arbeiten, ohne dass ich tief in die spezifische Azure-API einsteigen musste.

<img src="/assets/img/portfolio/Litellmapi.jpg" alt="LiteLLM-API" /><br><br>

## Architektur im Überblick

<img src="/assets/img/portfolio/oepnwebuidia.png" alt="Architecture Diagram" />

- Azure Burstmaschine → Basis-Infrastruktur für die Installation von OpenWebUI
- OpenWebUI → Frontend für die Interaktion mit den Modellen
- Azure OpenAI + AI Foundry → Bereitstellung der gewünschten GPT-Modelle
- LiteLLM → Proxy, der die technische Brücke zwischen Frontend und Azure schlägt<br>

**Verbindung - OpenWebUI & LiteLLM**:<br><br>
<img src="/assets/img/portfolio/openwebuicon.jpg" alt="Architecture Diagram" />

**Auswahl von GPT-modelle**:<br><br>
<img src="/assets/img/portfolio/openwebuimodel.jpg" alt="Architecture Diagram" /><br><br><br>

## Learnings & Vorteile
Die Lösung hat mir eindrucksvoll gezeigt, wie flexibel sich moderne AI-Architekturen gestalten lassen:

- **Kostenkontrolle**: Statt fester Abos zahle ich nur für die tatsächlich genutzten Ressourcen in Azure.
- **Flexibilität**: Ich kann genau die Modelle ausrollen, die ich für ein Projekt brauche – und diese jederzeit anpassen.
- **Erweiterbarkeit**: Mit LiteLLM als Proxy kann ich weitere Systeme oder Integrationen anbinden, ohne die Architektur neu denken zu müssen.
- **Unabhängigkeit**: Ich bin nicht auf die Plattform von OpenAI beschränkt, sondern kann mein eigenes Setup aufbauen.

##  Grenzen der aktuellen Umsetzung – fehlende Bereitstellung von Realtime- und Image-Modellen

So spannend die Architektur mit Azure OpenAI, OpenWebUI und LiteLLM auch ist, ganz ohne Einschränkungen kommt sie aktuell nicht aus. Besonders deutlich zeigt sich das an zwei Punkten: **GPT-Realtime-Modelle** und **Image-Generierung mit DALL·E**.

Beide Modelle sind momentan über Azure OpenAI **nicht direkt verfügbar** und lassen sich somit auch nicht nahtlos in die hier aufgebaute Umgebung integrieren.

- **Realtime-Modelle** wie GPT-4o Realtime sind in der Lage, Sprache, Text und Audio multimodal und nahezu verzögerungsfrei zu verarbeiten. Sie eröffnen ganz neue Anwendungsfelder – von Voice-Bots bis hin zu interaktiven Assistenzsystemen. Allerdings lassen sich diese Modelle derzeit nicht über Azure bereitstellen. Damit fällt einer der größten Innovationsschritte weg, wenn man versucht, ein alternatives Setup außerhalb der klassischen OpenAI-Abos aufzubauen.

- **Image-Modelle** wie DALL·E, die aus Textbeschreibungen Bilder generieren, stehen ebenfalls nicht als Dienst in Azure OpenAI zur Verfügung. Für Anwendungsfälle, bei denen Texteingaben und visuelle Ausgaben Hand in Hand gehen sollen, bedeutet das eine klare Einschränkung. Zwar lassen sich externe APIs anbinden, doch das widerspricht dem Ziel einer einheitlichen, zentral in Azure betriebenen Lösung.

## Warum ist das ein Nachteil?
Die Stärke einer selbst aufgesetzten Architektur liegt in der Flexibilität – eigene Infrastruktur, eigene Kostenkontrolle, eigene Modelle. Wenn aber bestimmte Schlüsselmodelle fehlen, stößt man schnell an Grenzen:

- Projekte, die bewusst auf Echtzeit-Dialoge oder Bildgenerierung setzen, lassen sich nicht 1:1 abbilden.
- Entwickler:innen müssen zusätzliche Dienste einkaufen oder Workarounds bauen, was die Architektur verkompliziert.
- Der Mehrwert einer zentralisierten Lösung in Azure wird teilweise konterkariert, wenn man am Ende doch externe Services anbinden muss.

## Fazit
Die aktuelle Lösung zeigt klar die Potenziale eines offenen, flexiblen Setups – aber ebenso auch die Schwächen. Solange Azure OpenAI keine Realtime- und Image-Modelle bereitstellt, bleibt ein Teil der Vision unerfüllt. Für viele klassische Text-Szenarien ist das Setup mehr als ausreichend. Wer jedoch auf Multimodalität und Bildgenerierung setzt, muss mit Umwegen leben oder auf die Weiterentwicklung des Azure-Portfolios warten.

<img src="/assets/img/portfolio/openwebuifrontend.jpg" alt="RAG Voice BOT - Architecture Diagram" /><br><br>

**Das Projekt zeigt für mich sehr deutlich**: Wer die nötige Infrastruktur und etwas technisches Know-how mitbringt, kann sich von starren Abo-Strukturen lösen und eigene, zukunftsfähige KI-Plattformen schaffen.<br><br>
