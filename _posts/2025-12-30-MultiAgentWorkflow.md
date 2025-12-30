---
layout: post
title: Wenn KI anfängt, mir bei Investmententscheidungen zu helfen
tags: [Microoft Foundry, Azure, Agenten, Workflow, Chart, Aktien]
---

Es gibt Projekte, die entstehen nicht, weil man sie von Anfang an perfekt geplant hat, sondern weil man sich irgendwann fragt, ob das eigentlich auch besser geht. Genau so ist dieses Projekt entstanden. Ich beschäftige mich schon lange mit Wertanlagen und Chartanalysen und habe irgendwann gemerkt, dass ich zwar unglaublich viele Informationen konsumiere, diese aber selten wirklich strukturiert zusammenlaufen. Kennzahlen hier, News dort, technische Indikatoren im Chart und irgendwo dazwischen versuche ich dann, eine halbwegs rationale Entscheidung zu treffen. Zudem wollte ich mal etwas Neues wagen und weg von langfristigen Investments hin zu kurzfrsitigeren Halten von Aktien/CFDs gehen, das Zauberwort nenne man hier Swing-Trading.

Die Frage war also ziemlich simpel: Warum lasse ich mir diese Vorarbeit nicht von KI abnehmen und konzentriere mich selbst nur noch auf die Entscheidung?

Genau daraus ist dieses Projekt entstanden. Ein System, das Wertanlagen analysiert, Marktinformationen zusammenführt und mir am Ende konkrete Handlungsempfehlungen direkt im Chart sichtbar macht. Nicht als Ersatz für eigenes Denken, sondern als zusätzliche, datengetriebene Perspektive.<br><br>

## Die Grundidee hinter dem Projekt

Die Idee ist schnell erklärt. Ich möchte für eine bestimmte Aktie, ein Asset oder einen Marktbereich eine möglichst fundierte Einschätzung bekommen, die nicht nur auf einem einzelnen Indikator basiert.

Stattdessen sollen verschiedene Blickwinkel zusammenkommen:

- Fundamentale Kennzahlen
- Aktuelle Marktereignisse
- Trend und Momentum
- Technische Signale
- Makroökonomische Einflüsse
- Stimmungsbilder aus dem Markt

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

Diese Agenten arbeiten nicht isoliert. Sie sind über einen Workflow miteinander verbunden und reichen ihre Ergebnisse weiter. Das bedeutet, dass spätere Agenten bereits auf den Ergebnissen der vorherigen aufbauen können. Am Ende entsteht keine lose Sammlung von Meinungen, sondern eine konsolidierte Einschätzung.<br><br>

## Vom Agenten Ergebnis zum Dashboard

Die Ergebnisse dieser Agenten fließen aktuell in ein zentrales Dashboard. Dieses Dashboard ist bewusst einfach gehalten und läuft über meine Webseite, die ich mit GitHub Pages bereitstelle.<br><br>

<div style="display:flex; justify-content:center; width:100%;">
  <img src="/assets/img/dashboard.jpg"
       alt="Microsoft Foundry - Azure Content Understanding"
       style="width:100%; max-width:1200px; height:auto;" />
</div><br><br>

Dort sehe ich für jedes analysierte Asset eine Zusammenfassung der wichtigsten Erkenntnisse, Wahrscheinlichkeiten für mögliche Szenarien und erste Handlungsempfehlungen. Kaufen, halten oder verkaufen wird dabei nicht als absolute Wahrheit dargestellt, sondern als Wahrscheinlichkeitsbetrachtung.

Das Dashboard ist aktuell mein Kontrollzentrum. Hier prüfe ich, ob die Agenten sinnvoll arbeiten, ob die Ergebnisse plausibel sind und wo ich nachschärfen muss.<br><br>

## Warum der Chart am Ende entscheidend ist

So gut Dashboards auch sind, am Ende treffe ich Investmententscheidungen immer noch im Chart. Und ich weiß, dass ich damit nicht allein bin. Charts sind der Ort, an dem alles zusammenläuft. Preis, Zeit, Trend und Struktur werden dort sichtbar.

Deshalb war relativ schnell klar, dass die Ergebnisse der KI nicht nur in einem separaten Dashboard leben sollen, sondern direkt im Chart sichtbar sein müssen. Genau hier kommt TradingView ins Spiel.<br><br>

## TradingView als Analyseplattform

Für meine Chartanalysen nutze ich TradingView. Einerseits, weil es extrem verbreitet ist, andererseits, weil es eine solide kostenfreie Basis bietet. Für technische Analysen, eigene Indikatoren und Visualisierung ist TradingView hervorragend geeignet.

<div style="display:flex; justify-content:center; width:100%;">
  <img src="/assets/img/TradingView.jpg"
       alt="Microsoft Foundry - Azure Content Understanding"
       style="width:100%; max-width:1200px; height:auto;" />
</div><br><br>

Die Idee war also simpel: Die von den Agenten berechneten Signale und Wahrscheinlichkeiten sollen direkt im TradingView Chart erscheinen. Idealerweise als visuelle Marker, Zonen oder Indikatoren, die mir auf einen Blick zeigen, wie die KI die aktuelle Situation einschätzt.<br><br>

## Die größte Herausforderung im Projekt

Und genau hier bin ich an die erste echte Grenze gestoßen. TradingView bietet aktuell keine Möglichkeit, externe API Endpunkte direkt anzubinden. Es gibt also keinen sauberen Weg, die Daten automatisiert aus meinem Dashboard oder direkt aus Foundry in den Chart zu schieben.

Das bedeutet konkret: Die Daten, die ich im Chart sehen möchte, müssen aktuell noch manuell in mein TradingView Indikator Script eingebunden werden. Das ist alles andere als elegant, aber für einen ersten Prototyp absolut ausreichend.

Ich exportiere mir die relevanten Ergebnisse aus dem Dashboard und übertrage sie von Hand in das Pine Script meines eigenen Indikators. Dort werden sie dann visualisiert und im Chart dargestellt.<br><br>

## Warum sich der Aufwand trotzdem lohnt

Auch wenn dieser manuelle Schritt erst einmal nach Rückschritt klingt, hat er einen großen Vorteil. Er zwingt mich dazu, die Ergebnisse der Agenten kritisch zu prüfen, bevor sie im Chart landen. Ich sehe sehr schnell, ob eine Einschätzung sinnvoll ist oder ob ein Agent nachjustiert werden muss.

Im Chart selbst entsteht dann eine spannende Kombination aus klassischer technischer Analyse und KI gestützter Entscheidungsunterstützung. Unterstützungszonen, Trendlinien und Indikatoren werden ergänzt durch Wahrscheinlichkeitsmarker, die auf den Analysen der Agenten basieren.

Das fühlt sich nicht nach automatisiertem Trading an, sondern nach einem sehr gut informierten Co Piloten.<br><br>

## Was ich aus dem Projekt bisher gelernt habe

Ein paar Erkenntnisse haben sich relativ schnell herauskristallisiert:

- Mehrere spezialisierte Agenten liefern deutlich bessere Ergebnisse als ein einzelner
- Kontext und saubere Workflows sind entscheidend für konsistente Analysen
- KI Ergebnisse sind am wertvollsten, wenn sie visuell und intuitiv dargestellt werden
- Der Mensch bleibt der Entscheider, die KI liefert Perspektiven

Gerade die Kombination aus Microsoft Foundry, Agenten Workflows und klassischer Chartanalyse hat für mich eine völlig neue Art geschaffen, Märkte zu betrachten.<br><br>

## Wie es weitergeht

Langfristig möchte ich den manuellen Schritt natürlich ablösen. Denkbar sind Zwischenlösungen über Datenfeeds, alternative Visualisierungslayer oder sogar eigene Chart Komponenten. Aktuell steht aber ganz klar die Qualität der Analysen im Fokus.

Das System soll nicht schneller werden, sondern besser. Die Agenten sollen lernen, relevanter zu filtern, sauberer zu argumentieren und ihre Ergebnisse verständlicher aufzubereiten.<br><br>

## Fazit

Dieses Projekt ist für mich ein perfektes Beispiel dafür, wie KI sinnvoll eingesetzt werden kann. Nicht als Blackbox, die Entscheidungen trifft, sondern als intelligentes Analystenteam, das mir hilft, bessere Entscheidungen zu treffen.

Microsoft Foundry liefert dafür die technologische Basis. TradingView bleibt der Ort, an dem ich Entscheidungen visuell prüfe. Und ich selbst bleibe derjenige, der am Ende auf Kaufen oder Verkaufen klickt.

Genau so fühlt sich für mich moderne, verantwortungsvolle KI Nutzung an.<br><br>
