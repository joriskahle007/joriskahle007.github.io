---
layout: post
title: Wenn KI anfängt, mir bei Investmententscheidungen zu helfen
tags: [Microoft Foundry, Azure, Agenten, Workflow, Chart, Aktien]
---

Es gibt Projekte, die entstehen nicht, weil man sie von Anfang an perfekt geplant hat, sondern weil man sich irgendwann fragt, ob das eigentlich auch besser geht. Genau so ist dieses Projekt entstanden. Ich beschäftige mich schon lange mit Wertanlagen und Chartanalysen und habe irgendwann gemerkt, dass ich zwar unglaublich viele Informationen konsumiere, diese aber selten wirklich strukturiert zusammenlaufen. Kennzahlen hier, News dort, technische Indikatoren im Chart und irgendwo dazwischen versuche ich dann, eine halbwegs rationale Entscheidung zu treffen. Zudem wollte ich mal etwas Neues wagen und weg von langfristigen Investments hin zu kurzfrsitigeren Halten von Aktien/CFDs gehen, das Zauberwort nenne man hier Swing-Trading.

Die Frage war also ziemlich simpel: Warum lasse ich mir diese Vorarbeit nicht von KI abnehmen und konzentriere mich selbst nur noch auf die Entscheidung?

Genau daraus ist dieses Projekt entstanden. Ein System, das Wertanlagen analysiert, Marktinformationen zusammenführt und mir am Ende konkrete Handlungsempfehlungen direkt im Chart sichtbar macht. Nicht als Ersatz für eigenes Denken, sondern als zusätzliche, datengetriebene Perspektive.<br><br>

## Die Grundidee hinter dem Projekt

Die Idee ist schnell erklärt. Ich möchte für eine bestimmte Aktie, ein Asset oder einen Marktbereich eine möglichst fundierte Einschätzung bekommen, die nicht nur auf einem einzelnen Indikator basiert. Stattdessen sollen verschiedene Blickwinkel zusammenkommen, von fundamentalen Kennzahlen über aktuelle Marktereignisse bis hin zu Trends, technischer Analyse und Marktstimmung.

All diese Informationen existieren bereits, aber eben verteilt über unzählige Quellen. Genau hier kommt Microsoft Foundry ins Spiel.<br><br>

## Warum ich mich für Microsoft Foundry entschieden habe

Microsoft Foundry hat mir genau das gegeben, was ich für dieses Projekt gebraucht habe: eine saubere Möglichkeit, mehrere spezialisierte Agenten aufzubauen und sie über einen definierten Workflow miteinander arbeiten zu lassen.

Ich habe mich bewusst gegen einen einzelnen, allwissenden Agenten entschieden und stattdessen ein Team aus sieben Agenten gebaut, die jeweils einen klaren Fokus haben. Jeder Agent ist für einen bestimmten Marktbereich zuständig und bringt seine eigene Perspektive mit.

Das fühlt sich weniger nach einem monolithischen KI System an und mehr nach einem kleinen Analystenteam, das gemeinsam an einer Einschätzung arbeitet.<br><br>

## Die sieben Agenten und ihre Aufgaben

Jeder Agent übernimmt eine klar abgegrenzte Rolle im Analyseprozess. Kurz zusammengefasst sieht das aktuell so aus:<br><br>

<div style="display:flex; justify-content:center; width:100%;">
  <img src="/assets/img/MultiAgentWorkflow.jpg"
       alt="Microsoft Foundry - Azure Content Understanding"
       style="width:100%; max-width:1200px; height:auto;" />
</div><br><br>

1. Agent : Du bist ein Finanz-Sentiment-Analyst für die Börse.
2. Agent : Du bist ein technischer Analyst spezialisiert auf Swing Trading (3-20 Tage Haltedauer) für Aktien.
3. Agent : Du bist ein Fundamental-Analyst für Aktien.
4. Agent : Du bist ein makroökonomischer Analyst mit Fokus auf die europäische Wirtschaft und die Eurozone.
5. Agent : Du bist der finale Algorithmic Timing Expert, der alle Analysen zusammenführt und eine umsetzbare Handelsempfehlung erstellt.
6. Agent : Du bist ein Experte für technische Chart-Analyse mit Schwerpunkt auf Kerzenformationen und Chart-Mustern für Swing Trading.
7. Agent : Du bist ein Swing-Trading-Spezialist, der auf Basis aller bisherigen Analysen das OPTIMALE Entry- und Exit-Timing für Swing Trades (3-20 Tage Haltedauer) bestimmt.

Jeder dieser Agenten hat eine spezielle Aufgabe. Einer sammelt und bewertet fundamentale Kennzahlen, ein anderer analysiert aktuelle Marktereignisse, wieder ein anderer kümmert sich um Trend und Momentum oder technische Indikatoren. Ergänzt wird das Ganze durch makroökonomische Betrachtungen, Sentiment Analysen und einen konsolidierenden Agenten, der alle Ergebnisse zusammenführt und daraus Handlungsszenarien ableitet.

Wichtig ist dabei, dass diese Agenten nicht isoliert arbeiten. Sie sind über einen Workflow miteinander verbunden und reichen ihre Ergebnisse weiter. Spätere Agenten bauen auf den Erkenntnissen der vorherigen auf, sodass am Ende keine lose Sammlung von Einzelmeinungen entsteht, sondern eine strukturierte Gesamteinschätzung.<br><br>

## Vom Agenten Ergebnis zum Dashboard

Die Ergebnisse dieser Agenten fließen aktuell in ein zentrales Dashboard, das ich über meine Webseite bereitstelle und mit GitHub Pages hoste. Dort sehe ich für jedes analysierte Asset eine Zusammenfassung der wichtigsten Erkenntnisse, Wahrscheinlichkeiten für unterschiedliche Szenarien und erste Handlungsempfehlungen. Kaufen oder verkaufen wird dabei bewusst nicht als absolute Wahrheit dargestellt, sondern als Wahrscheinlichkeitsbetrachtung, die mir eine zusätzliche Entscheidungsgrundlage liefert.<br><br>

<div style="display:flex; justify-content:center; width:100%;">
  <img src="/assets/img/dashboard.jpg"
       alt="Microsoft Foundry - Azure Content Understanding"
       style="width:100%; max-width:1200px; height:auto;" />
</div><br><br>

Dieses Dashboard ist momentan mein Kontrollzentrum. Hier überprüfe ich die Qualität der Analysen, erkenne schnell Auffälligkeiten und kann gezielt an einzelnen Agenten nachjustieren.<br><br>

## Warum der Chart am Ende entscheidend ist

So gut Dashboards auch sind, am Ende treffe ich Investmententscheidungen immer noch im Chart. Und ich weiß, dass ich damit nicht allein bin. Charts sind der Ort, an dem alles zusammenläuft. Preis, Zeit, Trend und Struktur werden dort sichtbar.

Deshalb war relativ schnell klar, dass die Ergebnisse der KI nicht nur in einem separaten Dashboard leben sollen, sondern direkt im Chart sichtbar sein müssen. Genau hier kommt TradingView ins Spiel.<br><br>

## TradingView als Analyseplattform

Für meine Chartanalysen nutze ich TradingView, weil es weit verbreitet ist, eine solide kostenfreie Basis bietet und sich hervorragend für eigene Indikatoren eignet. Die Idee war also, die von den Agenten berechneten Signale und Wahrscheinlichkeiten direkt im TradingView Chart darzustellen, zum Beispiel als Marker, Zonen oder zusätzliche Indikatoren.

<div style="display:flex; justify-content:center; width:100%;">
  <img src="/assets/img/TradingView.jpg"
       alt="Microsoft Foundry - Azure Content Understanding"
       style="width:100%; max-width:1200px; height:auto;" />
</div><br><br>

Die größte Herausforderung dabei ist allerdings, dass TradingView aktuell keine Möglichkeit bietet, externe API Endpunkte direkt anzubinden. Es gibt also keinen sauberen Weg, die Daten automatisiert aus meinem System in den Chart zu bringen. Aktuell bedeutet das, dass ich die relevanten Ergebnisse manuell aus dem Dashboard übernehme und in mein Pine Script einpflege. Das ist nicht perfekt, aber für einen ersten Prototyp absolut ausreichend und sogar hilfreich, weil ich jede Einschätzung bewusst noch einmal prüfe, bevor sie im Chart landet.<br><br>

## Der nächste logische Schritt: Fabric, OneLake und Power BI

Der nächste große Schritt in diesem Projekt ist bereits klar definiert. Ich möchte die gesammelten Daten aus dem Multi Agent Framework künftig zentral in Microsoft Fabric ablegen. Konkret plane ich, die Ergebnisse der Agenten in OneLake zu speichern und damit eine einheitliche, persistente Datenbasis zu schaffen.

Von dort aus sollen die Daten nicht nur archiviert, sondern auch weiterverarbeitet und visualisiert werden. Power BI bietet sich hier als perfektes Werkzeug an, um zeitliche Entwicklungen, Korrelationen und Veränderungen der Einschätzungen sichtbar zu machen. So entsteht eine zusätzliche analytische Ebene, die über den einzelnen Chart hinausgeht und langfristige Muster erkennbar macht.

Fabric wird damit zum Rückgrat des Projekts, während Foundry die Analyse übernimmt und TradingView weiterhin der Ort bleibt, an dem konkrete Entscheidungen visuell geprüft werden.<br><br>

## Open Source statt Blackbox

Ein weiterer wichtiger Punkt für mich ist Transparenz. Dieses Projekt soll keine geschlossene Spielerei bleiben. Ich plane daher, das komplette Projekt als Repository auf meiner GitHub Page zu veröffentlichen. Jeder soll sich anschauen können, wie die Agenten aufgebaut sind, wie der Workflow funktioniert und wie die Ergebnisse verarbeitet werden.

Mein Ziel ist es, dass jeder, der Lust hat, diese Lösung nachbauen, erweitern oder an die eigenen Bedürfnisse anpassen kann. Vielleicht entstehen daraus neue Ideen, andere Agenten oder völlig neue Anwendungsfälle. Genau dieser offene Austausch ist für mich einer der spannendsten Aspekte an solchen Projekten.<br><br>

## Fazit

Dieses Projekt ist für mich ein Paradebeispiel dafür, wie KI sinnvoll eingesetzt werden kann. Nicht als automatisierter Trader, der blind Entscheidungen trifft, sondern als intelligentes Analystenteam, das mir hilft, bessere und fundiertere Entscheidungen zu treffen.

Microsoft Foundry liefert die Grundlage für skalierbare Agenten und saubere Workflows. Fabric und OneLake werden künftig für Struktur und Transparenz sorgen. Power BI macht Entwicklungen sichtbar. TradingView bleibt der Ort, an dem Theorie auf Praxis trifft. Und ich selbst bleibe derjenige, der Verantwortung übernimmt und am Ende entscheidet.

Genau so fühlt sich für mich moderne, verantwortungsvolle KI Nutzung an.<br><br>
