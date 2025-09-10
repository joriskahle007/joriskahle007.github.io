---
layout: post
title: OpenWebUI - LiteLLM - GPT
feature-img: "assets/img/portfolio/open.png"
img: "assets/img/portfolio/open.png"
date: 09 September 2025
tags: [OpenWebUI, GPT-Modelle, Azure, Azure Open AI, LiteLLM]
---

## OpenWebUI + Azure OpenAI – eine flexible Alternative zu den Abo-Modellen

Wer schon einmal mit den Bezahlmodellen von OpenAI gearbeitet hat, kennt das Prinzip: Man bucht ein Abo, erhält Zugriff auf bestimmte GPT-Modelle und zahlt eine monatliche Pauschale. Für viele Szenarien ist das völlig ausreichend – gerade, wenn man nur ein einzelnes Projekt betreiben oder sich schnell einen Überblick verschaffen will.
Doch was, wenn man mehr Flexibilität benötigt? Wenn man eigene Infrastruktur, eigene Integrationen oder einfach ein freieres Setup nutzen möchte? Genau dieser Gedanke war für mich der Ausgangspunkt für mein nächstes Projekt.<br><br>

<img src="/assets/img/portfolio/openwebuifrontend.jpg" alt="RAG Voice BOT - Architecture Diagram" /><br><br>

## Zielsetzung
Ich wollte eine Alternative zu den klassischen OpenAI-ABOs schaffen – mit mehr Kontrolle über die Architektur, besserer Kostensteuerung und der Möglichkeit, unterschiedliche Modelle in einer eigenen Umgebung parallel bereitzustellen.<br><br>

**Architektur im Überblick**<br><br>
<img src="/assets/img/portfolio/oepnwebuidia.png" alt="Architecture Diagram" />

## Die Basis: Azure Burstmaschine & OpenWebUI
Den Anfang machte eine sogenannte Burstmaschine in Azure. Diese Maschinen eignen sich besonders für Szenarien, in denen man phasenweise viel Rechenleistung benötigt, ohne dauerhaft hohe Kosten zu verursachen. Auf dieser Basis installierte ich OpenWebUI – eine schlanke, lokal laufende Oberfläche, die als Frontend für unterschiedliche Sprachmodelle genutzt werden kann. Damit hatte ich bereits eine zentrale Oberfläche, über die ich verschiedene Modelle im Browser ansprechen konnte.<br>

## Azure OpenAI + AI Foundry
Parallel dazu habe ich in Azure den Azure OpenAI Service eingerichtet und in AI Foundry genau die Modelle bereitgestellt, die ich in meinem Projekt nutzen wollte. Damit stand mir die volle Leistungsfähigkeit der GPT-Modelle zur Verfügung – allerdings eben in meiner eigenen Azure-Subscription und nicht über ein Abo bei OpenAI direkt.<br>

**Azure-Deployment - Burst-Maschine**:<br><br>
<img src="/assets/img/portfolio/azureowngptjpg.jpg" alt="Azure Ressource" /><br><br>

**Azure Open AI - Azure AI Foundry**:<br><br>
<img src="/assets/img/portfolio/foundry.jpg" alt="GPT-Modelle" /><br><br>

## Die Herausforderung: Die Welten verbinden
Theorie und Praxis klaffen oft auseinander – und so auch in diesem Fall.
So einfach, wie erhofft, ließ sich OpenWebUI nicht direkt mit Azure OpenAI verbinden. Zwar bietet OpenWebUI Schnittstellen für verschiedene Modelle, doch die Authentifizierung und API-Mechanismen von Azure OpenAI unterscheiden sich spürbar vom „klassischen“ OpenAI-Setup.

**Die Folge**: Anfragen liefen ins Leere oder wurden mit Fehlermeldungen quittiert. Damit war klar – eine direkte Kopplung war nicht zuverlässig möglich.<br>

## Die Lösung: LiteLLM als Proxy
An diesem Punkt kam LiteLLM ins Spiel – ein leichtgewichtiger Proxy, der die Brücke zwischen OpenWebUI und Azure OpenAI schlagen kann. LiteLLM fungiert im Prinzip als Übersetzer: Es nimmt Anfragen aus OpenWebUI entgegen, wandelt sie in das passende Format für Azure OpenAI um und leitet die Antworten zurück.
Das Ergebnis: OpenWebUI konnte plötzlich nahtlos mit den Modellen aus Azure arbeiten, ohne dass ich tief in die spezifische Azure-API einsteigen musste.<br>

**API-Schnittstelle wurde eingebungen**:<br><br>
<img src="/assets/img/portfolio/Litellmapi.jpg" alt="LiteLLM-API" /><br><br>

- Azure Burstmaschine → Basis-Infrastruktur für die Installation von OpenWebUI
- OpenWebUI → Frontend für die Interaktion mit den Modellen
- Azure OpenAI + AI Foundry → Bereitstellung der gewünschten GPT-Modelle
- LiteLLM → Proxy, der die technische Brücke zwischen Frontend und Azure schlägt<br><br>

**Verbindung - OpenWebUI & LiteLLM**:<br><br>
<img src="/assets/img/portfolio/openwebuicon.jpg" alt="Architecture Diagram" /><br><br><br>

**Auswahl von GPT-modelle**:<br><br>
<img src="/assets/img/portfolio/openwebuimodel.jpg" alt="Architecture Diagram" /><br><br><br>

**Benutzerverwaltung:**<br><br>
<img src="/assets/img/portfolio/useradmin.jpg" alt="LiteLLM-API" /><br><br><br>

## Learnings & Vorteile
Die Lösung hat mir eindrucksvoll gezeigt, wie flexibel sich moderne AI-Architekturen gestalten lassen:

- **Kostenkontrolle**: Statt fester Abos zahle ich nur für die tatsächlich genutzten Ressourcen in Azure.
- **Flexibilität**: Ich kann genau die Modelle ausrollen, die ich für ein Projekt brauche – und diese jederzeit anpassen.
- **Erweiterbarkeit**: Mit LiteLLM als Proxy kann ich weitere Systeme oder Integrationen anbinden, ohne die Architektur neu denken zu müssen.
- **Unabhängigkeit**: Ich bin nicht auf die Plattform von OpenAI beschränkt, sondern kann mein eigenes Setup aufbauen.<br><br>

## Grenzen der aktuellen Umsetzung – fehlende Unterstützung in OpenWebUI für Realtime- und Image-Modelle

So spannend die Architektur mit Azure OpenAI, OpenWebUI und LiteLLM auch ist, ganz ohne Einschränkungen kommt sie aktuell nicht aus. Besonders deutlich zeigt sich das bei drei Modellfamilien: **GPT-Realtime, GPT-Image und DALL·E**.

Alle drei Modelle sind über **Azure OpenAI und Azure AI Foundry grundsätzlich verfügbar**, lassen sich jedoch **nicht nahtlos in OpenWebUI nutzen**, da die Plattform diese speziellen Endpunkte derzeit nicht unterstützt.

- **GPT-Realtime**: Diese Modelle verarbeiten Sprache, Text und Audio multimodal in Echtzeit. Sie ermöglichen flüssige Sprachdialoge ohne merkliche Verzögerung – ideal für Voice-Bots oder interaktive Assistenzsysteme. Da OpenWebUI die Realtime-Schnittstellen nicht unterstützt, bleibt dieser entscheidende Innovationsschritt in der Architektur ungenutzt.
 **GPT-Image**: Mit diesen Modellen lassen sich Bilder aus Textbeschreibungen generieren oder bestehende Bilder mit Text-Input verändern. Sie sind in Azure bereits verfügbar, können aber über OpenWebUI nicht direkt angesprochen werden. Für Szenarien, in denen Bildgenerierung in den Chatfluss integriert werden soll, bedeutet das eine deutliche Einschränkung.
- **DALL·E**: Als eines der bekanntesten Text-zu-Bild-Modelle ist DALL·E inzwischen ebenfalls Teil von Azure OpenAI. Doch auch hier gilt: Ohne Unterstützung durch OpenWebUI bleibt die Nutzung auf externe APIs oder zusätzliche Proxy-Lösungen beschränkt.<br>

**Warum ist das ein Nachteil?**
Die Stärke einer selbst aufgesetzten Architektur liegt in der Flexibilität – eigene Infrastruktur, eigene Kostenkontrolle, eigene Modelle. Wenn aber zentrale Features im Frontend nicht unterstützt werden, stößt man schnell an Grenzen:

- Projekte, die bewusst auf Echtzeit-Dialoge oder Bildgenerierung setzen, lassen sich nicht 1:1 abbilden.
- Entwickler:innen müssen zusätzliche Dienste oder Workarounds integrieren, was die Architektur verkompliziert.
- Der Mehrwert einer zentralisierten, benutzerfreundlichen Oberfläche wird eingeschränkt, wenn man am Ende doch externe Services oder Proxys anbinden muss.

## Update zum Projekt!

Mit der neuesten Version von OpenWebUi (v0.6.27) - (danke an **Benjamin Eha** für den Tipp) ist es nun möglich, GPT-Modelle direkt einzubinden – ganz ohne den Umweg über LiteLLM. Ich habe die neue Version installiert und die Modelle direkt integriert. Der Installationsprozess verlief reibungslos, und die Anbindung der Modelle funktioniert einwandfrei.

<img src="/assets/img/portfolio/InstallOpenWebUI.jpg" alt="Architecture Diagram" /><br><br><br>

Durch diese Neuerung wird OpenWebUi noch leistungsfähiger und flexibler einsetzbar. Die direkte Integration erlaubt nicht nur eine einfachere Einrichtung, sondern auch eine schnellere Interaktion mit den Modellen, was insbesondere für prototypische Projekte und KI-Demos von großem Vorteil ist. Darüber hinaus eröffnet die Möglichkeit, GPT-Modelle ohne zusätzliche Zwischenschicht zu nutzen, neue Chancen für individuelle Anpassungen und Optimierungen in der Modellnutzung.

<img src="/assets/img/portfolio/directcon.jpg" alt="Architecture Diagram" /><br><br><br>

**Mit dieser Version wird OpenWebUi für Entwickler und KI-Enthusiasten gleichermaßen noch attraktiver und praxisnaher.**<br>

## Fazit
Die aktuelle Lösung zeigt klar die Potenziale eines offenen, flexiblen Setups – aber ebenso auch die Schwächen. Solange OpenWebUI keine native Unterstützung für GPT-Realtime, GPT-Image und DALL·E bietet, bleibt ein Teil der Vision unerfüllt. Für viele klassische Text-Szenarien ist das Setup mehr als ausreichend. Wer jedoch auf Multimodalität und Bildgenerierung setzt, muss mit Umwegen leben oder zusätzliche Komponenten in die Architektur integrieren.

**Das Projekt zeigt für mich sehr deutlich**: Wer die nötige Infrastruktur und etwas technisches Know-how mitbringt, kann sich von starren Abo-Strukturen lösen und eigene, zukunftsfähige KI-Plattformen schaffen.<br><br>
