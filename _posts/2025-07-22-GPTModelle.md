---
layout: post
title: Azure OpenAI GPT-Modelle - Vollständiger Überblick – leicht verständlich
tags: [CSP, Azure, GPT, Azure AI Foundry, Modelle]
---

Es gibt inzwischen so viele KI-Modelle über Azure OpenAI – da den Überblick zu behalten, kann ganz schön herausfordernd sein. Aber keine Sorge, ich erkläre dir in diesem Beitrag alles Schritt für Schritt, verständlich und anschaulich. Von GPT-3.5 über o-Serien, GPT-4-Reihe bis hin zu GPT-5, Audio- und Bildmodellen – und sogar dem Modellrouter. Außerdem zeige ich dir, welche Modelle für welche Use Cases am besten geeignet sind.!<br>

Wenn du in Azure AI Foundry KI-Modelle ausrollen möchtest, gibt es ein paar Dinge, die wichtig sind – auch wenn du dich bei Foundry-Modellen wie GPT nicht um die eigentliche Infrastruktur kümmern musst. Microsoft stellt diese Modelle als Managed Service bereit, das heißt: Skalierung, GPUs und Hochverfügbarkeit laufen automatisch im Hintergrund. Deine Rolle verschiebt sich dadurch: Statt Compute-Kapazitäten zu planen, konzentrierst du dich auf die richtige Modellwahl, Kostenkontrolle und die Einbettung in deine Anwendungen. Achte darauf, von Anfang an sauber zwischen Test- und Produktionsumgebung zu trennen, um Transparenz und Kosten im Griff zu behalten. Sicherheit spielt ebenfalls eine zentrale Rolle: Richte Rollen und Berechtigungen sorgfältig ein und denke an Datenschutz und Verschlüsselung, vor allem wenn sensible Daten verarbeitet werden. Ein weiterer Erfolgsfaktor ist Monitoring: Auch wenn du das Modell nicht selbst betreibst, solltest du Protokollierung, Auslastung und Antwortqualität im Blick behalten – so erkennst du frühzeitig, ob dein Setup angepasst werden muss. Und schließlich ist es sinnvoll, die Kostenmodelle gut zu verstehen, da die Abrechnung meist nutzungsbasiert über Tokens erfolgt. Kurz gesagt: Bei Foundry-Modellen musst du dich nicht um Hardware oder Compute kümmern, aber dafür umso mehr um Governance, Sicherheit, Monitoring und Kostenmanagement.<br><br>

Die gesamte Infrastruktur – GPUs, Skalierung, Updates, Verfügbarkeit – liegt bei Microsoft. Für dich bleibt die Perspektive eine reine API-Nutzung:

<li>Du rufst das Modell über einen Endpunkt auf.</li>
<li>Du zahlst nach Nutzungseinheiten (z. B. Tokens).</li>
<li>Du musst keine VM starten, keine GPU auswählen und auch kein Autoscaling konfigurieren.</li>
<li>Du achtest eher auf Themen wie Kostenkontrolle, Rate Limits, Zugriffssicherheit, Daten- und Prompt-Management sowie Governance.</li><br>

👉 Nur wenn du eigene Modelle trainierst oder hostest, kommst du wieder in die Welt der Rechenressourcen zurück.<br><br>

## Welches Modell für welchen Use Case?

Neben den bekannten OpenAI-Modellen wie GPT-4 oder GPT-5 gewinnen zunehmend auch andere Sprachmodelle an Bedeutung, die man als „exotischer“ bezeichnen könnte. Dazu zählen insbesondere **Grok** von xAI, **DeepSeek** aus China, das europäische **Mistral** sowie **Llama** von Meta. Sie unterscheiden sich teils deutlich in Herkunft, Architektur, Verfügbarkeit und Anwendungsbereichen – und genau das macht sie für Unternehmen spannend, die Alternativen zu klassischen OpenAI-Modellen suchen.

**Grok**, entwickelt von Elon Musks Unternehmen xAI, ist vor allem für seine starke Integration von Echtzeitdaten bekannt. Während klassische GPT-Modelle auf statischen Trainingsdaten basieren und Aktualität durch nachträgliche Tools wie RAG oder Plugins erhalten müssen, kann Grok direkt auf aktuelle Informationen zugreifen. Das macht es besonders interessant für Anwendungsfälle wie Finanzanalysen, Social-Media-Monitoring oder Nachrichtendienste, die dynamische Inhalte in Echtzeit benötigen. Allerdings ist der Zugang noch eingeschränkt, da Grok bislang primär über die xAI-Plattform genutzt werden kann. Hinzu kommen datenschutzrechtliche Bedenken, da in der Vergangenheit über öffentlich sichtbare Nutzerinteraktionen diskutiert wurde. Für Projekte, die höchste Compliance-Anforderungen haben, ist hier also Vorsicht geboten.

**DeepSeek** stammt aus China und hat sich schnell einen Namen gemacht, weil es leistungsstarke Sprachmodelle zu einem Bruchteil der Kosten etablierter Anbieter anbietet. Besonders stark ist DeepSeek in logischen Schlussfolgerungen, strukturiertem Denken und Planungsaufgaben – Fähigkeiten, die beispielsweise bei Finanzplanung, Projektorganisation oder im Bildungsbereich sehr wertvoll sind. Damit positioniert sich DeepSeek als kosteneffiziente Alternative zu westlichen Modellen. Allerdings ist die internationale Verfügbarkeit noch eingeschränkt, und die Modelle sind teils auf bestimmte Hardware optimiert, was die Flexibilität reduziert.

Das französische **Mistral** verfolgt einen komplett anderen Ansatz: Als europäisches Open-Source-Sprachmodell setzt es auf Transparenz und Anpassbarkeit. Der große Vorteil liegt darin, dass Entwickler das Modell nach eigenen Bedürfnissen trainieren, erweitern oder in bestehende Systeme integrieren können, ohne an einen einzelnen Anbieter gebunden zu sein. Das macht Mistral besonders interessant für Forschung, öffentliche Institutionen oder Unternehmen mit hohen Anforderungen an Datenkontrolle und Anpassbarkeit. Die Kehrseite ist, dass Open-Source-Modelle wie Mistral meist einen höheren Ressourcenbedarf haben und für produktive Szenarien entsprechend starke Infrastruktur erfordern. Zudem hängt die Weiterentwicklung stark von der Community ab – was einerseits Innovation fördert, andererseits aber weniger verlässliche Roadmaps mit sich bringt.

**Llama**, entwickelt von Meta, ist mittlerweile die bekannteste Open-Source-Alternative zu GPT. Llama-Modelle sind in verschiedenen Größen verfügbar, von leichteren Varianten für experimentelle Anwendungen bis hin zu sehr großen Modellen für anspruchsvolle Workloads. Besonders hervorzuheben ist die zunehmende Multimodalität: Llama kann nicht nur Text verarbeiten, sondern auch Bilder und andere Eingaben. Dadurch wird es zu einer flexiblen Plattform für unterschiedlichste Anwendungen – von Chatbots über Dokumentenanalyse bis hin zu kreativen Projekten, die Text und visuelle Elemente verbinden. Für Entwickler und Unternehmen, die Open-Source-Modelle produktiv einsetzen möchten, bietet Llama dank einer großen Community und starker Unterstützung durch Meta eine vergleichsweise stabile Grundlage.

Zusammengefasst lohnt sich auch ein Blick auf diese „exotischeren“ Modelle vor allem dann, wenn man nach Alternativen zu klassischen Azure OpenAI-Modellen sucht. Grok überzeugt mit Echtzeitfähigkeit, DeepSeek mit Kosteneffizienz und starkem strukturiertem Denken, Mistral mit Offenheit und Anpassbarkeit, und Llama mit Multimodalität und einer starken Open-Source-Community. Wichtig ist dabei immer, die jeweiligen Stärken mit den eigenen Anforderungen abzugleichen: Wer Stabilität und garantierte Roadmaps braucht, ist bei Meta oder OpenAI besser aufgehoben, während Mistral und Llama Flexibilität und Kontrolle ermöglichen. DeepSeek kann ein Kostenvorteil sein, bringt aber Abhängigkeiten von regionalen Infrastrukturen mit. Grok wiederum ist hochinnovativ, aber aktuell nur eingeschränkt nutzbar.

Die große Stärke der Azure OpenAI Plattform liegt darin, dass du dir genau das Modell aussuchen kannst, das am besten zu deinem Projekt passt. Damit du nicht nur Tabellenwerte siehst, sondern auch verstehst, wofür sich die einzelnen Varianten lohnen, habe ich die wichtigsten Anwendungsfälle hier ausführlicher beschrieben:

in der folgenden Übersicht, gehe ich jedoch nur noch auf die gängigsten GPT-Modelle ein.

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

## Token-Kapazität und Abrechnungsmodelle: TPM & PTU

Neben der Wahl des passenden Modells ist auch die Art der Bereitstellung entscheidend.
<li>TPM (Tokens per Minute): Standard-Limitierung im Pay-as-you-go-Modell. Sie legt fest, wie viele Tokens pro Minute verarbeitet werden dürfen. Gut geeignet für Prototypen oder kleinere Workloads.</li><br>
<li>PTU (Provisioned Throughput Unit): Reservierte Kapazität mit garantierten Durchsatzwerten. PTUs stellen sicher, dass die Latenz auch bei hoher Auslastung stabil bleibt. Besonders interessant für produktive Szenarien oder wenn Lastspitzen vorhersehbar sind.</li>

| Merkmal |	TPM (Tokens per Minute) |	PTU (Provisioned Throughput Unit) |
| Abrechnung |	Pay-as-you-go (pro Token) |	Fixpreis pro reservierter Einheit |
| Kapazität |	Geteilt mit anderen Kunden |	Dediziert, garantiert |
| Leistung |	variabel, abhängig von Auslastung |	stabile Latenz, vorhersagbar |
| Empfohlen für |	Tests, Prototypen, geringe Last |	Produktion, hohe Auslastung, Business-kritisch |<br>

## Erweiterte Empfehlungen: Modelle & Use-Cases PTU's vs. TPM's

| Use Case |	Empfohlenes Modell |	Warum dieses Modell? |	Empfohlene Kapazität |
| Kundensupport / Chatbot (24/7) |	gpt-5-chat oder gpt-4.1-mini |	Optimiert für Dialoge, kosteneffizient, gute Sprachqualität |	Start: PAYG mit TPM. Bei >50k Usern oder Peaks → PTU für Stabilität |
| Dokumentenanalyse / Long Context Q&A |	gpt-4.1 oder gpt-5 |	Sehr lange Kontexte (bis 1 Mio Tokens), gutes Reasoning	| PTU empfohlen (lange Prompts verursachen hohes Token-Volumen, TPM könnte schnell limitieren) |
| Code-Generierung & Dev-Assistenz |	o4-mini, Codex-mini, gpt-5-nano |	Kurze Latenz, gut im Code-Reasoning, günstig |	TPM reicht oft aus; PTU lohnt sich nur bei konstant hohen Builds/CI-Integrationen |
| Wissens-Chatbot für Unternehmen	| Phi-4 oder gpt-5-chat	Phi-4: | sehr effizientes Reasoning, günstig; GPT-5 für Multimodalität |	TPM für Prototypen; PTU bei >10 gleichzeitigen Sessions im Unternehmenskontext |
| Multimodale Szenarien (Bild+Text)	| gpt-4-turbo-vision, gpt-5 |	Kombination von Text & Bildern, auch für Content-Analyse |	TPM reicht für Tests; PTU sinnvoll bei z. B. automatisierter Bildpipeline |
| High-Volume API (z. B. Suche, RAG) |	gpt-4.1-nano, o3 |	Sehr schnelle & günstige Antworten, ideal für Einbettung in RAG-Pipelines |	PTU empfohlen, da konstante, vorhersehbare Antwortzeit wichtig |
| Forschung & volle Kontrolle |	gpt-oss-120b oder gpt-oss-20b	| Open-Weight, volle Kontrolle & Reproduzierbarkeit |	PTU fast immer sinnvoll – PAYG hat zu viele Limits für Forschung |
| Copilot-ähnliche Integrationen |	gpt-5, gpt-4.5 preview |	Hohe Qualität, gute Integration in Tools & Workflows |	TPM für MVP; PTU bei produktivem Rollout mit hoher Nutzlast |<br><br>

## Leitfaden: TPM oder PTU?

**TPM (Tokens per Minute)**
👉 Ideal für kleine bis mittlere Projekte, Pilotphasen, Proof-of-Concepts.
👉 Flexibel, keine Bindung, du zahlst nur pro Token.

**PTU (Provisioned Throughput Unit)**
👉 Ideal bei planbarer Last (z. B. tägliche Verarbeitung von tausenden Dokumenten oder Millionen Chatnachrichten).
👉 Garantierte Latenz, weniger Schwankungen, skalierbar.
👉 Kosteneffizient ab einem bestimmten Nutzungsvolumen (Break-Even oft schon bei wenigen Mio Tokens pro Tag).<br><br>


## Regionale Verfügbarkeit der Modelle
<li><b>GPT-5 Modelle</b> (Standard, mini, nano, chat) sind aktuell in <b>East US 2</b> und <b>Sweden Central</b> verfügbar. Für GPT-5 ist eine Registrierung nötig, die kleineren Varianten hingegen nicht</li><br>
<li>Die älteren Modelle <b>(GPT-4, o-Serien, GPT-4o etc.)</b> sind breit über viele Regionen verfügbar – beispielweise auch in <b>Sweden Central, Germany West, East US, West US</b> und weiteren</li><br>

💡 Tipp: <b>Sora</b> ist aktuell nur eingeschränkt verfügbar. Wenn du also Videos einsetzen willst, solltest du vorher prüfen, ob das Modell in deiner Region freigeschaltet ist.<br><br>
**Wichtig**: Nicht alle Modelle sind über alle Bezugskanäle verfügbar. Die Llama Modelle zum Beispiel gibt es nur, wenn  

## Azure Speech Service vs. gpt-4o Realtime Preview
Der Azure Speech Service und gpt-4o Realtime Preview erfüllen unterschiedliche Rollen: Speech Service ist ein spezialisierter Sprachdienst für präzise Transkription (ASR), natürlich klingende Text-to-Speech-Stimmen, Übersetzungen und Speaker-Features wie Diarisierung. Er eignet sich vor allem, wenn es um saubere Transkripte, Anpassungen mit Fachvokabular, Custom Voices oder sogar On-Prem-Deployments mit strengen Datenschutzanforderungen geht und wird nach Audio-Stunden oder erzeugten Zeichen abgerechnet. gpt-4o Realtime hingegen ist ein multimodales Sprachmodell, das Audio direkt versteht und in Echtzeit generative Antworten als Text oder Sprache zurückgibt – also perfekt für interaktive Dialog-Systeme, Assistenten oder Voice Agents, bei denen es auf natürliche Konversationen ankommt. Technisch setzt es auf WebRTC/WebSockets für niedrige Latenz, hat in der Preview bestimmte Limits (z. B. ca. 100.000 Tokens pro Minute und 1.000 Requests pro Minute) und wird tokenbasiert abgerechnet. Während Speech Service für höchste Transkriptionsqualität und anpassbare Stimmen die bessere Wahl ist, punktet gpt-4o Realtime bei kontextreichen Gesprächen und generativer Intelligenz. In vielen Szenarien ergänzt sich beides: Speech Service liefert die robuste Sprachbasis, gpt-4o Realtime sorgt für die intelligente, konversationsfähige Ebene.<br><br>
<b>Zu diesem Thema werden ich einen eigenen Blogbeitrag verfassen. Sei bespannt, welche Insides ich hier für dich hier habe.</b>

## Fazit

Mit Azure AI Foundry erhältst du Zugang zu einer breiten Palette von Modellen – von klassischen Chatbots über Bild-/Audio-KI bis hin zu leistungsfähigen GPT-5-Varianten. Überlege dir einfach:
<li><b>1.) Was ist dein Use Case?</b> (Text, Bild, Audio, Chat-Agent, Code etc.)</li>
<li><b>2.) Wie viel Leistung & Token-Kapazität brauchst du?</b></li>
<li><b>3.) Wo wird das Modell gehostet?</b> (Regionale Verfügbarkeit checken)</li>
<li><b>4.) Welche TPM- und Kostenbedingungen sind akzeptabel?</b></li><br>
Dann wählst du das Modell, das am besten passt – und nutzt es effizient, effizient und kostenbewusst.
