---
layout: post
title: Was ist Azure Vision in den Foundry Tools – und warum ich es spannender finde als gedacht
feature-img: assets/img/feature-img/enterprise-scale-architecture.jpg
tags: [CSP, Azure, Incentives, Linzenzierung]
---

## Was ist Azure Vision in den Foundry Tools – und warum ich es spannender finde als gedacht

Manchmal stolpert man über einen Service, den man gedanklich sofort in eine Schublade steckt. Bei mir war das lange Zeit Azure Vision. Bilderkennung, Objekte zählen, Texte aus Bildern lesen, klingt erst einmal nach klassischer Computer Vision. Nützlich, aber irgendwie auch ein bisschen erwartbar.<br>

Spätestens seit ich Azure Vision intensiver im Zusammenspiel mit den Foundry Tools genutzt habe, hat sich diese Einschätzung deutlich geändert. Denn hier geht es nicht nur um Bilder, sondern um Kontext, Automatisierung und um sehr reale Geschäftsprozesse.<br>

In diesem Beitrag möchte ich erklären, was Azure Vision im Foundry Kontext eigentlich ist, wie ich es heute einordne und warum es für viele Projekte deutlich relevanter ist, als man auf den ersten Blick denkt.<br><br>

## Azure Vision, kurz eingeordnet

Azure Vision ist Teil der Azure AI Services und stellt Funktionen zur Analyse visueller Inhalte bereit. Dazu gehören Bilder, Videos und alles, was visuell erfassbar ist. Im Kern geht es darum, Maschinen beizubringen, visuelle Informationen zu verstehen und daraus strukturierte Daten zu machen.<br>

Im Foundry Kontext ist Azure Vision kein isolierter Service, sondern ein Baustein, der sich nahtlos in AI Pipelines, Workflows und Anwendungen integrieren lässt. Genau das macht den Unterschied.<br><br>

## Warum Azure Vision in Foundry mehr ist als Bilderkennung

Was sich im Foundry Portal schnell zeigt, ist der Perspektivwechsel. Azure Vision wird hier nicht als einzelnes Feature betrachtet, sondern als Teil eines größeren Systems.<br>

Ein Bild ist selten nur ein Bild. Es ist oft ein Auslöser für einen Prozess. Ein Dokument, das geprüft werden muss. Ein Schaden, der bewertet werden soll. Ein Objekt, das gezählt oder klassifiziert wird.<br>

Foundry hilft dabei, diese Analyse direkt weiterzuverarbeiten. Ergebnisse aus Azure Vision können unmittelbar in weitere Modelle, Entscheidungslogiken oder Automatisierungen einfließen. Dadurch entsteht ein durchgängiger Ablauf, von der visuellen Erfassung bis zur Aktion.<br><br>

## Typische Funktionen, die man in der Praxis nutzt

Azure Vision bringt eine ganze Reihe von Fähigkeiten mit, die im Foundry Kontext besonders häufig genutzt werden.<br><br>

**Bildanalyse und Objekterkennung**

Hier geht es darum, Inhalte in Bildern zu erkennen und zu beschreiben. Objekte, Szenen, Farben oder besondere Merkmale lassen sich automatisch identifizieren. In Foundry Projekten sehe ich das oft in Kombination mit Entscheidungslogik, etwa wenn bestimmte Objekte erkannt werden sollen und daraufhin ein Prozess angestoßen wird.<br><br>

**Texterkennung aus Bildern**

Ein Klassiker, der aber enormen Impact hat. Azure Vision kann Texte aus Bildern extrahieren, zum Beispiel aus gescannten Dokumenten, Fotos von Formularen oder Schildern. Im Foundry Kontext ist das besonders spannend, weil diese Texte direkt weiterverarbeitet werden können, etwa durch Klassifikation, Zusammenfassung oder Validierung.<br><br>

**Gesichtserkennung und visuelle Attribute**

Je nach Szenario lassen sich auch Gesichter und visuelle Attribute erkennen. Das ist ein sensibles Feld und spielt vor allem in Compliance Diskussionen eine Rolle. Foundry bietet hier den Rahmen, um solche Funktionen bewusst, kontrolliert und dokumentiert einzusetzen.<br><br>

## Azure Vision als Teil einer AI Pipeline

Was ich an Foundry besonders schätze, ist der Pipeline Gedanke. Azure Vision steht selten allein.
Ein typischer Ablauf könnte so aussehen:<br><br>

- Ein Bild oder Video wird hochgeladen oder automatisch erfasst
- Azure Vision analysiert den visuellen Inhalt
- Die Ergebnisse werden strukturiert gespeichert
- Weitere Modelle bewerten, klassifizieren oder priorisieren diese Informationen
- Ein Workflow löst Aktionen aus, etwa Benachrichtigungen oder Freigaben

Dadurch wird aus einer reinen Bilderkennung ein echter End to End Prozess.<br><br>

## Governance, Sicherheit und Verantwortung

Sobald visuelle Daten ins Spiel kommen, wird das Thema Governance wichtig. Bilder enthalten oft personenbezogene oder sensible Informationen.<br>

Im Foundry Kontext profitiert Azure Vision stark von den bestehenden Azure Mechanismen. Zugriffe laufen über Entra ID, Daten können über Purview klassifiziert werden und Defender hilft dabei, Workloads abzusichern. So wird sichergestellt, dass Vision nicht unkontrolliert genutzt wird.<br>

Gerade bei Themen wie Gesichtserkennung oder sensiblen Inhalten ist diese Einbettung entscheidend. Technologie allein reicht hier nicht, es braucht klare Regeln und technische Leitplanken.<br><br>

## Typische Einsatzszenarien aus der Praxis

Um es greifbarer zu machen, hier ein paar Szenarien, in denen ich Azure Vision in Foundry Projekten besonders häufig sehe.<br><br>

| Szenario |	Was Azure Vision übernimmt | Mehrwert im Foundry Kontext|
| Dokumentenverarbeitung |	Texterkennung und Strukturierung |	Automatisierte Weiterverarbeitung |
| Qualitätssicherung |	Objekterkennung und Abweichungen |	Schnellere Entscheidungen |
| Schadenserkennung |	Analyse von Bildern |	Unterstützung bei Bewertungen |
| Logistik |	Zählen und Klassifizieren von Objekten |	Transparenz und Automatisierung |
| Sicherheit |	Erkennung visueller Muster |	Frühzeitige Reaktionen |

##Mein persönliches Fazit

Azure Vision in den Foundry Tools ist für mich ein gutes Beispiel dafür, wie sich bekannte Technologien verändern, wenn man sie in den richtigen Kontext setzt.<br>

Alleinstehend ist es ein starker Computer Vision Service. In Foundry wird es zu einem integralen Bestandteil von intelligenten Prozessen. Genau das macht es spannend.<br>

Wenn man visuelle Daten nicht nur analysieren, sondern wirklich nutzen will, dann ist Azure Vision im Foundry Kontext ein Werkzeug, das man sich sehr genau anschauen sollte.<br><br>
