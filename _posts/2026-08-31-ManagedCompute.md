---
layout: post
title: Microsoft Foundry Managed Compute | Open Source KI ohne eigene GPU Infrastruktur?
tags: [AI, Microsoft Foundry, Managed Compute, Open Source, Open Weight, Local LLM]
---

Wenn wir heute ein KI Modell einsetzen möchten, haben wir inzwischen erstaunlich viele Möglichkeiten. Wir können eine GPU lokal in unserem eigenen Rechner betreiben, eine GPU in Azure mieten oder die komplette Infrastruktur Microsoft überlassen und einfach eine API verwenden.

Gerade bei Open Source Modellen wird es interessant. Qwen, Llama, Mistral und viele andere Modelle lassen sich inzwischen in unterschiedlichsten Szenarien einsetzen. Die eigentliche Frage ist deshalb längst nicht mehr nur, welches Modell wir verwenden möchten.

Die Frage ist auch: <strong>Wo und wie soll dieses Modell eigentlich laufen?</strong><br><br>

<h3>Vom eigenen Rechner bis zur Serverless API</h3>

Wenn wir es ganz einfach betrachten, gibt es vier Möglichkeiten.

Wir können das Modell lokal auf unserer eigenen Hardware betreiben. Damit haben wir maximale Kontrolle, müssen aber auch die komplette Infrastruktur selbst anschaffen und betreiben.

Die nächste Möglichkeit ist eine eigene GPU in Azure. Die Hardware steht dann zwar in einem Microsoft Rechenzentrum, um Betriebssystem, Container, Runtime und Modell müssen wir uns aber weiterhin selbst kümmern.

Danach kommt Managed Compute in Microsoft Foundry. Hier stellt Microsoft die benötigte GPU Infrastruktur bereit und übernimmt einen großen Teil des technischen Betriebs.

Und schließlich gibt es die Serverless API. Wenn das gewünschte Modell diesen Bereitstellungstyp unterstützt, müssen wir uns überhaupt nicht mehr mit GPUs beschäftigen. Wir wählen das Modell aus und greifen per API darauf zu.

<table>
<tr><th></th><th>Lokale GPU</th><th>Eigene Azure GPU</th><th>Managed Compute</th><th>Serverless API</th></tr>
<tr><td>Hardware</td><td>Selbst</td><td>Azure</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>GPU verwalten</td><td>Selbst</td><td>Selbst</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>Modellwahl</td><td>Sehr frei</td><td>Sehr frei</td><td>Open Source und ausgewählte Modelle</td><td>Unterstützte Modelle</td></tr>
<tr><td>Abrechnung</td><td>Hardware und Betrieb</td><td>GPU Zeit</td><td>GPU Kapazität</td><td>Nutzung beziehungsweise Tokens</td></tr>
<tr><td>Infrastrukturaufwand</td><td>Hoch</td><td>Hoch</td><td>Niedrig</td><td>Sehr niedrig</td></tr>
</table>

Je weiter wir also nach rechts gehen, desto weniger müssen wir uns um die eigentliche Infrastruktur kümmern. Gleichzeitig geben wir aber auch einen Teil der Kontrolle ab.<br><br>

<h3>Was ist Managed Compute?</h3>

Managed Compute ist im Grunde die Zwischenstufe zwischen einer selbst betriebenen GPU und einer vollständig abstrahierten Serverless API.

Wir wählen ein unterstütztes Modell und eine passende Deployment Konfiguration. Microsoft stellt die benötigte GPU Infrastruktur bereit und kümmert sich um die zugrunde liegende Umgebung.

Damit müssen wir beispielsweise nicht selbst eine GPU VM aufsetzen, Container Images verwalten oder die passende Inferenz Runtime installieren.

Für Managed Compute kommen je nach Modell unterschiedliche leistungsfähige Beschleuniger zum Einsatz. Dazu gehören beispielsweise NVIDIA A100, NVIDIA H100 oder AMD MI300X.

Das Interessante daran ist aber nicht unbedingt die GPU selbst.

<strong>Interessant ist, dass wir ein Open Source Modell verwenden können, ohne gleichzeitig zum Betreiber unserer eigenen GPU Infrastruktur werden zu müssen.</strong><br><br>

<h3>Aber brauche ich dafür überhaupt Managed Compute?</h3>

Nicht unbedingt.

Und genau das ist ein wichtiger Punkt.

Microsoft bietet im Foundry Katalog verschiedene Modelle auch über die Serverless API an. Dazu gehören neben Microsoft Modellen beispielsweise auch Modelle von Anthropic, Mistral, Meta und weiteren Anbietern.

Auch bei Open Source Modellen wie Qwen hängt es vom konkreten Modell ab, welche Bereitstellungsoptionen verfügbar sind.

Wenn mein gewünschtes Modell über Serverless verfügbar ist und für meinen Anwendungsfall passt, würde ich zunächst diesen Weg wählen.

Dann muss ich mich weder um eine GPU noch um deren Skalierung kümmern.

<strong>Modell auswählen, API aufrufen und nach Nutzung bezahlen.</strong>

Genau das ist der große Vorteil von Serverless.<br><br>

<h3>Warum gibt es dann Managed Compute?</h3>

Weil nicht jedes Modell und nicht jeder Anwendungsfall über Serverless abgedeckt wird.

Vielleicht möchte ich ein bestimmtes Open Source Modell verwenden, das nicht als Serverless API verfügbar ist. Vielleicht benötige ich eine bestimmte Modellversion oder eine dedizierte Rechenumgebung.

Dann wird Managed Compute interessant.

Ich bekomme eine verwaltete GPU Umgebung, habe aber deutlich mehr Freiheit bei der Auswahl des Modells.

Und hier kommt noch ein weiterer Punkt hinzu, der Managed Compute deutlich interessanter macht, als man zunächst denkt.<br><br>

<h3>Scale to Zero: Die GPU muss nicht die ganze Nacht laufen</h3>

Bei Managed Compute kann die Anzahl der Modellinstanzen automatisch angepasst werden. Dazu gehört auch <strong>Scale to Zero</strong>.

Wenn keine Anfragen mehr eingehen, kann die Bereitstellung auf null Instanzen heruntergefahren werden. Damit läuft auch keine GPU Kapazität mehr für diese Bereitstellung.

Das ist für Anwendungen mit stark schwankender Auslastung interessant.

Nehmen wir beispielsweise PlaudaZeit.

Tagsüber haben wir Benutzer und benötigen vielleicht eine oder zwei Instanzen. Nachts dagegen ist kaum etwas los.

Dann könnte die Architektur beispielsweise so aussehen:

<li>Tagsüber: 1 Instanz</li>
<li>Bei höherer Auslastung: 2 Instanzen</li>
<li>Nachts: 0 Instanzen</li>
<li>Vor Beginn der Hauptnutzungszeit: wieder 1 Instanz</li>

Damit bezahlen wir nicht zwangsläufig 24 Stunden am Tag für die maximale GPU Kapazität.

Und genau das verändert die Kostenbetrachtung erheblich.<br><br>

<h3>Was passiert beim Hochskalieren?</h3>

Hier gibt es allerdings einen wichtigen Haken.

Wenn wir auf null Instanzen heruntergefahren haben, wartet nicht einfach eine fertig laufende H100 auf den nächsten Request.

Beim erneuten Hochskalieren muss die benötigte GPU Kapazität bereitgestellt und anschließend das Modell gestartet werden.

Das kann einige Zeit dauern. Gerade bei großen Sprachmodellen müssen schließlich nicht nur die GPUs bereitgestellt werden, sondern auch die Modellgewichte geladen werden.

Microsoft weist außerdem darauf hin, dass beim Hochskalieren nicht garantiert werden kann, dass die benötigte GPU Kapazität jederzeit verfügbar ist.

<strong>Quota bedeutet also nicht automatisch, dass uns zu jedem Zeitpunkt eine konkrete GPU garantiert zur Verfügung steht.</strong>

Für eine Anwendung mit sehr hoher Verfügbarkeitsanforderung sollte man deshalb nicht einfach davon ausgehen, dass morgens um 6 Uhr nach einem Scale to Zero innerhalb weniger Sekunden wieder alles bereitsteht.

Für ein Szenario wie PlaudaZeit wäre es sinnvoller, die Instanz beispielsweise bereits einige Minuten vor Beginn der erwarteten Hauptnutzungszeit wieder hochzufahren.<br><br>

<h3>Muss ich die GPU reservieren?</h3>

Nicht im klassischen Sinne einer dauerhaft für uns reservierten GPU.

Für Managed Compute benötigen wir zunächst das entsprechende Foundry Kontingent für die verwendete GPU Familie. Dieses Kontingent erlaubt uns, die entsprechende Kapazität anzufordern.

Es ist aber keine Garantie dafür, dass beim nächsten Hochskalieren sofort eine physisch verfügbare GPU bereitsteht.

Das ist ein wichtiger Unterschied.

Wenn ich nachts auf null gehe, spare ich zwar die laufenden Compute Kosten. Dafür akzeptiere ich beim erneuten Hochskalieren eine gewisse Bereitstellungszeit und ein gewisses Kapazitätsrisiko.

Wenn eine Anwendung dagegen rund um die Uhr sofort verfügbar sein muss, wäre eine dauerhaft laufende Instanz die sicherere Variante.<br><br>

<h3>Was kostet das Ganze?</h3>

Nehmen wir ein bewusst vereinfachtes Beispiel.

Angenommen, eine Managed Compute Instanz würde in unserem Beispiel 2 Euro pro Stunde kosten.

Bei einem Dauerbetrieb wären das:

<li>2 Euro pro Stunde</li>
<li>48 Euro pro Tag</li>
<li>1.440 Euro bei 30 Tagen</li>

Wenn wir aber beispielsweise nur 12 Stunden am Tag eine Instanz benötigen, wären es im gleichen Rechenbeispiel nur noch rund 720 Euro im Monat.

Und wenn wir nachts zusätzlich auf null skalieren, kann sich die tatsächlich bezahlte Compute Zeit weiter reduzieren.

Der tatsächliche Azure Preis hängt natürlich von GPU, Region und Verfügbarkeit ab. Die Zahlen hier dienen deshalb nur dazu, das Prinzip zu verdeutlichen.

Und genau hier liegt der entscheidende Unterschied zur klassischen Vorstellung von Managed Compute:

<strong>Wir müssen nicht zwangsläufig eine GPU 24 Stunden am Tag bezahlen.</strong><br><br>

<h3>Managed Compute oder Serverless?</h3>

Damit wird die Entscheidung eigentlich ziemlich einfach.

Wenn mein gewünschtes Modell als Serverless API verfügbar ist und ich keine speziellen Anforderungen habe, würde ich Serverless bevorzugen.

Ich muss mich um nichts kümmern und bezahle entsprechend der Nutzung.

Wenn ich dagegen ein bestimmtes Open Source Modell benötige, das nicht als Serverless API verfügbar ist, kann Managed Compute interessant werden.

Ich bekomme die notwendige GPU Infrastruktur von Microsoft, kann die Instanzen skalieren und muss trotzdem keinen eigenen GPU Server betreiben.

Und wenn ich maximale Kontrolle benötige, bleibt die eigene lokale oder Azure GPU Infrastruktur die interessanteste Variante.<br><br>

<h3>Mein Fazit</h3>

Für mich zeigt Managed Compute sehr schön, wohin sich die KI Infrastruktur gerade entwickelt.

Wir bewegen uns von der eigenen Hardware immer weiter in Richtung abstrahierter Dienste.

Lokal bedeutet: <strong>Ich kümmere mich um alles.</strong>

Eigene Azure GPU bedeutet: <strong>Microsoft stellt die Hardware, ich betreibe sie.</strong>

Managed Compute bedeutet: <strong>Microsoft stellt und verwaltet die GPU Infrastruktur für mein Modell.</strong>

Serverless API bedeutet schließlich: <strong>Ich möchte eigentlich gar nicht mehr wissen, welche GPU darunter steckt.</strong>

Und genau deshalb finde ich Managed Compute spannend.

Es ist nicht einfach nur eine Möglichkeit, eine H100 in Azure zu mieten.

Es ist eine Art Zwischenstufe für diejenigen, die Open Source Modelle verwenden möchten, aber keine eigene GPU Infrastruktur betreiben wollen.

Durch Autoscaling und Scale to Zero wird das Ganze zusätzlich interessant, weil wir die GPU Kapazität an unsere tatsächliche Nutzung anpassen können.

Die entscheidende Frage lautet deshalb für mich inzwischen nicht mehr:

<strong>„Welche GPU brauche ich?“</strong>

Sondern:

<strong>„Wie viel Kontrolle brauche ich wirklich und wie viel Infrastruktur möchte ich selbst betreiben?“</strong>

Wenn die Antwort lautet „möglichst wenig“, ist Serverless wahrscheinlich der einfachste Weg.

Wenn ich mehr Freiheit bei der Modellwahl benötige, aber trotzdem keine GPU Infrastruktur selbst betreiben möchte, wird Managed Compute interessant.

Und wenn ich maximale Kontrolle möchte, bleibt die eigene GPU.

<strong>Die GPU wird damit zunehmend zu dem, was sie eigentlich sein sollte: ein technisches Detail, über das sich der Entwickler möglichst wenig Gedanken machen muss.</strong>
