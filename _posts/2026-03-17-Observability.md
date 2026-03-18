---
layout: post
title: Microsoft Foundry Observability - So behältst du deine KI immer unter Kontrolle
tags: [CSP, Azure, Agents, Observability, Evaluations, Monitoring, Tracing]
---


KI ist ein mächtiges Werkzeug. Sie kann Texte schreiben, Prozesse automatisieren, Daten analysieren oder Entscheidungen unterstützen, oft schneller und effizienter, als wir es selbst könnten. Gleichzeitig kann KI unvorhersehbar sein: Antworten können unlogisch, fehlerhaft oder inkonsistent ausfallen. Genau hier setzt Microsoft Foundry an und liefert mit den neuen Funktionen **Evaluations, Monitoring und Tracing** das Werkzeug, das deine KI zuverlässig kontrollierbar macht. Seit kurzem sind diese Funktionen offiziell **general available (GA)**, also produktionsreif.<br>

Stell dir vor, du betreibst eine KI, die Kundenanfragen beantwortet. Anfangs läuft alles glatt, doch nach einigen Wochen stellst du fest, dass die Antworten manchmal falsch oder widersprüchlich sind. Das liegt daran, dass sich Modelle, Daten und Nutzungsszenarien kontinuierlich verändern. Früher testete man KI einmal und ging live, heute reicht das nicht mehr. Du brauchst ein System, das **ständig überprüft, wie gut deine KI arbeitet**, Probleme frühzeitig erkennt und dir transparent zeigt, wie Entscheidungen zustande kommen.<br><br>

## Evaluations – der permanente Qualitätscheck

Evaluations sind wie ein **TÜV für deine KI**. Sie prüfen automatisch die Qualität der Antworten und decken mehrere Dimensionen ab. Dabei geht es nicht nur darum, ob eine Antwort richtig oder falsch ist, sondern auch, ob sie **sinnvoll, kohärent und auf verlässlichen Informationen basiert.** Microsoft Foundry liefert bereits fertige Bewertungsmetriken, du kannst aber auch eigene Regeln definieren, die genau auf dein Unternehmen zugeschnitten sind.<br>

Neben standardisierten Metriken für allgemeine Qualität, Retrieval‑Performance oder Sicherheit kannst du auch eigene Evaluationsregeln definieren, die dein Team für wichtig hält, beispielsweise bestimmte inhaltliche Vorgaben oder Business‑SLA‑Regeln. So siehst du nicht erst nach dem Livegang, sondern schon fortlaufend, wie Änderungen an Modellen oder Pipelines sich auf die Qualität auswirken.

**Was Evaluations für dich tun:**

- Prüfen, ob die Antworten inhaltlich korrekt sind
- Sicherstellen, dass Unternehmensrichtlinien und Compliance eingehalten werden
- Kontinuierlich messen, wie neue Modelle oder Anpassungen die Qualität beeinflussen
- Eigene Regeln für spezielle Anforderungen definieren

**Praxisbeispiel:** Du betreibst eine KI im Kundenservice, die täglich hunderte Anfragen beantwortet. Du fügst ein neues Modell hinzu, das schneller antworten soll. Mit Evaluations siehst du sofort, ob die Antworten weiterhin korrekt und verständlich sind und ob die Qualität besser wird oder noch angepasst werden muss.<br>

**Wichtig zu wissen:** Evaluations können in der Entwicklungs‑ und in der Produktionsphase eingesetzt werden, sowohl lokal in Tests als auch integriert in CI/CD‑Pipelines.<br><br>

## Monitoring – das Cockpit deiner KI‑Anwendung

Monitoring ist der Teil der Observability, der dir einen **Live‑Überblick über den Zustand deiner KI liefert**. Es zeigt dir, wie viele Anfragen verarbeitet werden, wie lange sie dauern, wie viele Tokens verbraucht werden, welche Fehler auftreten und wie die Qualitätsmetriken aussehen. Dieses Monitoring wird in Foundry über **Azure Monitor Application Insights** realisiert, dem Observability‑Tool von Azure, das Telemetriedaten sammelt und visualisiert.<br>

**Was ist Azure Monitor Application Insights?**

Azure Monitor Application Insights ist ein Teil von Azure Monitor und dient als moderne Lösung für **Application Performance Monitoring (APM)**. Es sammelt Telemetriedaten wie Anfragen, Fehler, Abhängigkeiten, Metriken oder benutzerdefinierte Ereignisse und macht sie sichtbar in Dashboards, Reports oder Analysen. Durch Integration mit OpenTelemetry können Daten standardisiert gesammelt werden, unabhängig von Programmiersprache oder Framework.<br>

**Monitoring hilft dir konkret:**

- Antwortzeiten und Latenzen überwachen
- Fehlerquoten erkennen und beheben
- Ressourcenverbrauch analysieren
- Trends und Muster über die Zeit beobachten

**Praxisbeispiel:** Eine Marketing-KI erstellt E-Mail-Kampagnen automatisch. Monitoring zeigt, dass bestimmte Kampagnen mehr Ressourcen benötigen oder schlechtere Qualität liefern. Du kannst sofort eingreifen und die Kampagnen optimieren, bevor sie live gehen.<br>

**Voraussetzungen für Azure Monitor Application Insights**

Damit du Application Insights fürs Foundry‑Monitoring sinnvoll nutzen kannst, gibt es ein paar Dinge, die du vorbereiten musst. Diese Voraussetzungen sind nicht besonders kompliziert, aber sie sind entscheidend dafür, dass du später Daten korrekt sammeln, analysieren und visualisieren kannst:

**Grundlage**
- **Azure‑Abonnement**: Du brauchst ein aktives Azure‑Abonnement, damit du Ressourcen wie Application Insights anlegen kannst.
- **Application Insights‑Ressource**: Lege im Azure‑Portal eine neue Application Insights‑Ressource an. Das ist der Speicherort für alle Telemetriedaten.
- **Log Analytics Workspace**: Application Insights wird meist an einen Log Analytics Workspace gekoppelt. Dieser Workspace speichert die Telemetriedaten und ermöglicht Abfragen und Analysen.

Ohne Log Analytics kann Application Insights zwar Daten sammeln, aber viele Analyse‑ und Dashboard‑Funktionen gehen verloren bzw. sind stark eingeschränkt.<br><br>

## Tracing – nachvollziehen, wie die KI denkt

Tracing ist der Teil, bei dem du wirklich verstehen kannst, **wie eine KI‑Antwort aufgebaut ist**. Es zeigt dir Schritt für Schritt, wie Eingaben verarbeitet werden, welche Modelle aufgerufen werden, welche Tools oder APIs involviert waren und wie lange einzelne Schritte gedauert haben. Dieses verteilte Tracing basiert auf OpenTelemetry‑Standards und ist direkt in Application Insights integriert, sobald die Instrumentierung erfolgt ist.<br>

Gerade in komplexen KI‑Agentenszenarien, in denen mehrere Modelle, Tools oder Datenquellen beteiligt sind, hilft dir Tracing enorm dabei, **Ursachen für Performance‑Probleme, Fehler oder Qualitätsabweichungen zu erkennen**, ohne lange manuell zu debuggen.<br>

**Was Tracing dir liefert:**

- Schritt-für-Schritt-Nachvollziehbarkeit
- Transparenz über Modelle, Tools und Datenquellen
- Optimierungspotenzial aufdecken
- Debugging deutlich beschleunigen

**Praxisbeispiel:** Deine KI beantwortet Finanzanfragen. Plötzlich tauchen falsche Empfehlungen auf. Mit Tracing erkennst du, dass ein bestimmter Datenfeed fehlerhafte Informationen geliefert hat. Du kannst das Problem direkt beheben, ohne lange Ursachenforschung betreiben zu müssen.<br><br>

## So nutzt du Evaluations, Monitoring und Tracing effektiv

Schon in der Entwicklungsphase lohnt es sich, diese Funktionen einzusetzen. Du testest neue Modelle kontinuierlich, erkennst sofort Verbesserungen oder Probleme und stellst sicher, dass deine KI zuverlässig arbeitet. Im produktiven Betrieb liefern dir Monitoring und Tracing Echtzeitinformationen, Warnmeldungen und eine lückenlose Übersicht, wie jede Anfrage verarbeitet wurde. Langfristig kannst du Benchmarks erstellen, Trends analysieren und die KI kontinuierlich optimieren.<br>

**Praxis-Tipps für Einsteiger:**

- Starte klein: Standard-Evaluationsmetriken und Monitoring-Dashboards nutzen
- Passe Regeln auf deinen Use-Case an: Nicht jede KPI ist für jeden Anwendungsfall relevant
- Tracing gezielt bei Problemfällen einsetzen, um Ursachen schnell zu finden
- Regelmäßig Trends analysieren und Benchmarks erstellen<br><br>

## Red Teaming im Observability‑Kontext von Microsoft Foundry

Ein zunehmend wichtiger Aspekt der Observability bei KI‑Agenten und LLM‑basierten Systemen ist das **sogenannte „AI Red Teaming“**. Während Evaluations, Monitoring und Tracing dir helfen, wie gut deine KI arbeitet und ob sie korrekt, performant und transparent ist, geht es beim Red Teaming speziell um das Erkennen von Sicherheits‑ und Vertrauensrisiken, bevor sie im Echtbetrieb auftreten<br>

**Was bedeutet „Red Team“ hier konkret?**
In Microsoft Foundry wird der **AI Red Teaming Agent** als Teil der Observability‑Funktionen bereitgestellt. Dieser Agent simuliert gezielt adversariale bzw. potenziell bösartige Eingaben und Angriffsszenarien gegen deine KI‑Agenten, um Schwachstellen aufzudecken, etwa:

- unbeabsichtigte **Datenleaks** von sensiblen Informationen
- **Jailbreaks** oder Missbrauch durch Prompt‑Injektionen
- **Verstöße gegen Richtlinien oder verbotene Aktionen**
- **Abweichungen in der Aufgabenbefolgung**, wenn das Agentensystem gezielt irritiert wird<br>

Diese Art von Tests zielt nicht auf Performance‑ oder Qualitätsmetriken ab, sondern darauf, wie robust und sicher ein Agent unter realistischen Angriffsversionen arbeitet. Solche Red‑Team‑Tests lassen sich sowohl in **Vorproduktions‑Workflows (z. B. CI/CD‑Pipelines)** als auch regelmäßig im Betrieb einbinden, um neu auftretende Risiken frühzeitig zu erkennen und zu beheben.<br>

In der Observability‑Praxis ergänzt Red Teaming klassische Logs, Metriken und Traces:<br>

- Logs sagen dir „was passiert ist“
- Traces zeigen „wo es passiert ist“
- Red Teaming sagt „was passieren könnte, wenn jemand dein System ausnutzt“

So wird Observability nicht nur ein Werkzeug zur Transparenz über das Verhalten deiner KI, sondern auch zu einem aktiven Sicherheits‑ und Vertrauens‑Schild, bevor es zu echten Vorfällen kommt.<br><br>

## Warum sich der Einsatz lohnt

Mit Evaluations, Monitoring und Tracing hast du ein **komplettes Kontrollzentrum für deine KI**. Du behältst die Kontrolle, erkennst Probleme frühzeitig, verstehst die Entscheidungen deiner KI und kannst sie kontinuierlich verbessern. Für dich bedeutet das: weniger Überraschungen, höhere Qualität, schnelleres Debugging und eine solide Grundlage für Governance und Compliance. Du kannst sicher sein, dass deine KI nicht nur funktioniert, sondern auch zuverlässig, nachvollziehbar und sicher arbeitet.<br><br>

## Fazit:

Wenn du dir all das zusammen ansiehst, wird schnell klar: **Evaluations, Monitoring und Tracing sind keine Spielereien, sondern echte Gamechanger für produktive KI**. Sie geben dir die **Sicherheit, Kontrolle und Transparenz**, die moderne KI im Unternehmenskontext braucht. Du kannst neue Modelle testen, die Performance im Betrieb überwachen und jede Anfrage Schritt für Schritt nachvollziehen. Kurz gesagt: Mit diesen Tools machst du aus einer komplexen, manchmal unberechenbaren Technologie ein wirklich **steuerbares und wertvolles Werkzeug**, genau wie ein gut funktionierendes Kontrollzentrum, in dem du jederzeit den Überblick behältst.<br><br>
