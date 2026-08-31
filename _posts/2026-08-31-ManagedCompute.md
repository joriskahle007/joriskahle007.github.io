---
layout: post
title: Microsoft Foundry Managed Compute | Open Source KI ohne eigene GPU Infrastruktur?
tags: [AI, Microsoft Foundry, Managed Compute, Open Source, Open Weight, Local LLM]
---

Wenn wir heute ein KI Modell einsetzen möchten, haben wir inzwischen erstaunlich viele Möglichkeiten. Wir können eine GPU lokal auf unserem eigenen Rechner betreiben, eine GPU in Azure mieten oder die komplette Infrastruktur Microsoft überlassen und einfach eine API verwenden.

Gerade bei Open Source Modellen wird es interessant. Qwen, Llama, Mistral und viele andere Modelle werden immer leistungsfähiger und sind inzwischen für eine ganze Reihe von Anwendungsfällen interessant. Die eigentliche Frage ist deshalb längst nicht mehr nur, welches Modell wir verwenden möchten. Die Frage ist auch: <strong>Wo und wie soll dieses Modell eigentlich laufen?</strong><br><br>

<h3>Von der lokalen KI bis zur Serverless API</h3>

Fangen wir ganz links an. Bei einer lokalen KI laden wir das Modell auf unseren eigenen Rechner und lassen es dort laufen. Das hat einen großen Vorteil: Wir haben maximale Kontrolle. Wir entscheiden selbst, welche Hardware wir verwenden, welches Modell installiert wird und wann und wie es läuft. Dafür müssen wir aber auch die komplette Infrastruktur bezahlen und betreiben. Eine leistungsfähige GPU kostet schnell mehrere tausend Euro und auch Strom, Kühlung, Speicher und Wartung sollte man nicht vergessen.

Die nächste Möglichkeit ist eine eigene GPU in Azure. Damit müssen wir die Hardware nicht selbst kaufen, übernehmen aber weiterhin einen großen Teil des Betriebs. Wir wählen eine passende virtuelle Maschine aus, installieren unsere Umgebung, kümmern uns um Container und Runtime und laden anschließend unser Modell. Microsoft stellt uns also die Hardware zur Verfügung, aber wir betreiben darauf im Grunde unseren eigenen Server.

Mit Managed Compute in Microsoft Foundry geht Microsoft einen Schritt weiter. Hier müssen wir uns nicht mehr selbst um die eigentliche GPU Infrastruktur kümmern. Wir wählen ein unterstütztes Modell und eine passende Bereitstellung und Microsoft stellt die benötigte Rechenkapazität zur Verfügung und übernimmt einen großen Teil des technischen Betriebs.

Am anderen Ende steht die Serverless API. Wenn unser gewünschtes Modell diese Bereitstellungsart unterstützt, müssen wir uns praktisch überhaupt nicht mehr mit der Infrastruktur beschäftigen. Wir wählen das Modell aus, bekommen einen API Endpunkt und bezahlen für die Nutzung.

Damit ergibt sich eine ziemlich interessante Entwicklung:

<table>
<tr><th></th><th>Lokale GPU</th><th>Eigene Azure GPU</th><th>Managed Compute</th><th>Serverless API</th></tr>
<tr><td>Hardware</td><td>Selbst</td><td>Azure</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>GPU Verwaltung</td><td>Selbst</td><td>Selbst</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>Modellwahl</td><td>Sehr frei</td><td>Sehr frei</td><td>Open Source und ausgewählte Modelle</td><td>Unterstützte Modelle</td></tr>
<tr><td>Kostenmodell</td><td>Hardware und Betrieb</td><td>GPU Zeit</td><td>GPU Kapazität</td><td>Nutzung beziehungsweise Tokens</td></tr>
<tr><td>Aufwand</td><td>Hoch</td><td>Hoch</td><td>Mittel</td><td>Sehr gering</td></tr>
</table>

Je weiter wir also nach rechts gehen, desto weniger müssen wir uns um die eigentliche Infrastruktur kümmern. Gleichzeitig geben wir aber auch einen Teil der Kontrolle ab.<br><br>

<h3>Was ist Managed Compute eigentlich?</h3>

Managed Compute ist für mich am einfachsten als Zwischenstufe zwischen einer eigenen GPU und einer Serverless API zu verstehen. Ich möchte vielleicht ein Open Source Modell verwenden, möchte aber nicht selbst einen GPU Server betreiben.

Microsoft stellt dafür die notwendige GPU Infrastruktur bereit und übernimmt die Verwaltung der zugrunde liegenden Umgebung. Je nach Modell können dabei beispielsweise NVIDIA A100, NVIDIA H100 oder AMD MI300X zum Einsatz kommen.

Der entscheidende Punkt ist aber nicht unbedingt die GPU selbst. Interessant ist vielmehr, dass wir ein Open Source Modell verwenden können, ohne gleichzeitig zum Betreiber unserer eigenen GPU Infrastruktur werden zu müssen.

Wir müssen also nicht selbst eine GPU VM aufsetzen und anschließend herausfinden, welche Runtime, welche Container Konfiguration und welche GPU Kombination für unser Modell geeignet ist. Foundry stellt entsprechende Bereitstellungen und Vorlagen zur Verfügung.<br><br>

<h3>Aber warum nicht einfach Serverless?</h3>

Und genau diese Frage ist meiner Meinung nach entscheidend.

Wenn ich beispielsweise Qwen verwenden möchte, bedeutet das nicht automatisch, dass ich Managed Compute brauche. Microsoft bietet verschiedene Modelle im Foundry Katalog auch über Serverless APIs an. Je nach konkretem Modell und Verfügbarkeit können dazu auch Open Source beziehungsweise Partnermodelle gehören.

Wenn mein gewünschtes Modell als Serverless API verfügbar ist und für meinen Anwendungsfall funktioniert, würde ich zunächst genau diesen Weg wählen. Warum sollte ich mich mit GPUs beschäftigen, wenn Microsoft mir das Modell bereits als fertigen Dienst zur Verfügung stellt?

Ich bekomme einen API Endpunkt, schicke meine Anfragen dorthin und bezahle für die tatsächliche Nutzung. Keine GPU kaufen, keine VM konfigurieren, keine Runtime installieren und vor allem keine Gedanken darüber machen, ob gerade eine H100 oder eine A100 unter meinem Modell steckt.

<strong>Serverless ist deshalb die bequemste Variante.</strong>

Managed Compute wird interessant, wenn ich mehr Freiheit bei der Modellwahl benötige oder ein bestimmtes Modell verwenden möchte, das nicht als Serverless API verfügbar ist.<br><br>

<h3>Und dann kommt Scale to Zero</h3>

Hier wird Managed Compute noch einmal deutlich interessanter.

Auf den ersten Blick könnte man nämlich denken, dass Managed Compute bedeutet, dass wir uns einfach eine teure GPU mieten und diese anschließend rund um die Uhr bezahlen. Das muss aber nicht zwingend so sein.

Managed Compute unterstützt Autoscaling und Scale to Zero. Das bedeutet, dass die Anzahl der laufenden Modellinstanzen abhängig von der Auslastung angepasst werden kann. Wenn über einen bestimmten Zeitraum keine Anfragen mehr eingehen, kann die Bereitstellung bis auf null Instanzen heruntergefahren werden.

Und wenn keine Instanz läuft, wird auch keine GPU Kapazität für diese Instanz benötigt.

Nehmen wir ein typisches Szenario mit einer Anwendung, die tagsüber deutlich stärker genutzt wird als nachts. Tagsüber benötigen wir vielleicht eine Instanz. Steigt die Nutzung, können wir auf zwei Instanzen skalieren. Nachts dagegen ist möglicherweise kaum etwas los. Dann könnte die Bereitstellung auf null Instanzen heruntergefahren werden.

Damit hätten wir beispielsweise:

<li>Tagsüber eine Instanz</li>
<li>Bei hoher Last zwei Instanzen</li>
<li>Nachts null Instanzen</li>
<li>Vor Beginn der Hauptnutzungszeit wieder eine Instanz</li>

Das ist ein ziemlich anderes Kostenmodell als „Ich miete eine H100 und lasse sie 24 Stunden am Tag laufen“.<br><br>

<h3>Der Haken beim Scale to Zero</h3>

Natürlich gibt es dabei einen Haken, und den sollte man nicht verschweigen.

Wenn unsere Bereitstellung auf null Instanzen steht, wartet nicht einfach eine bereits laufende GPU auf den nächsten Benutzer. Beim erneuten Hochskalieren muss die benötigte GPU Kapazität bereitgestellt und anschließend das Modell gestartet werden.

Gerade bei großen Sprachmodellen kann das etwas dauern. Die Modellgewichte müssen schließlich erst auf die GPU geladen werden. Microsoft weist außerdem darauf hin, dass die benötigte GPU Kapazität beim Hochskalieren nicht zu jedem Zeitpunkt garantiert verfügbar sein muss.

Das bedeutet: Wenn wir nachts auf null skalieren und morgens wieder auf eine oder zwei Instanzen hoch möchten, kann das funktionieren. Wir sollten aber nicht davon ausgehen, dass unser Modell innerhalb weniger Sekunden garantiert wieder bereitsteht.

Für eine Anwendung mit planbaren Nutzungszeiten wäre es deshalb sinnvoller, die Instanz bereits vor Beginn der erwarteten Hauptnutzungszeit wieder hochzufahren. So kann man die Kostenvorteile von Scale to Zero nutzen, ohne dass der erste Benutzer morgens auf den Start des Modells warten muss.<br><br>

<h3>Muss ich die GPU dafür reservieren?</h3>

Hier muss man zwischen Kontingent und tatsächlich verfügbarer GPU Kapazität unterscheiden.

Für Managed Compute benötigen wir das entsprechende Foundry Kontingent für die verwendete GPU Familie. Dieses Kontingent erlaubt uns, die entsprechende Kapazität anzufordern. Es bedeutet aber nicht automatisch, dass Microsoft uns eine konkrete H100 dauerhaft reserviert.

Das ist wichtig, denn genau hier kann beim Hochskalieren ein Problem entstehen. Wenn in der gewünschten Region gerade nicht genügend passende GPU Kapazität vorhanden ist, kann die Bereitstellung mit einem Kapazitätsfehler scheitern.

<strong>Quota bedeutet also nicht automatisch reservierte GPU Kapazität.</strong>

Wenn unsere Anwendung unbedingt rund um die Uhr verfügbar sein muss und innerhalb weniger Sekunden reagieren soll, ist Scale to Zero deshalb möglicherweise nicht die richtige Wahl. Dann wäre es sinnvoller, mindestens eine Instanz dauerhaft aktiv zu halten.<br><br>

<h3>Was kostet Managed Compute?</h3>

Schauen wir uns dazu ein bewusst vereinfachtes Beispiel an. Angenommen, eine Managed Compute Instanz würde in unserem Beispiel 2 Euro pro Stunde kosten. Bei einem durchgehenden Betrieb wären das 48 Euro am Tag beziehungsweise rund 1.440 Euro bei 30 Tagen.

Wenn wir die Instanz dagegen nur zwölf Stunden am Tag benötigen, wären es unter denselben angenommenen Bedingungen nur noch etwa 720 Euro im Monat. Wird nachts zusätzlich auf null Instanzen skaliert, kann sich die tatsächlich bezahlte Compute Zeit weiter reduzieren.

Die tatsächlichen Azure Preise hängen natürlich von GPU, Region und aktueller Preisgestaltung ab. Die Zahlen sollen deshalb lediglich das Prinzip verdeutlichen.

Der interessante Punkt ist aber: <strong>Managed Compute muss nicht zwangsläufig bedeuten, dass wir eine GPU 24 Stunden am Tag bezahlen.</strong><br><br>

<h3>Managed Compute oder Serverless?</h3>

Damit wird die Entscheidung eigentlich ziemlich einfach.

Wenn mein gewünschtes Modell als Serverless API verfügbar ist und ich keine speziellen Anforderungen habe, würde ich Serverless bevorzugen. Das ist die einfachste Variante und wir müssen uns praktisch um keine Infrastruktur kümmern.

Wenn ich dagegen ein bestimmtes Open Source Modell benötige, das nicht als Serverless API verfügbar ist, kann Managed Compute interessant werden. Ich bekomme die notwendige GPU Infrastruktur von Microsoft, kann die Instanzen skalieren und muss trotzdem keinen eigenen GPU Server betreiben.

Wenn ich dagegen maximale Kontrolle benötige, sehr spezielle Modelle verwenden oder eine dauerhaft hohe Auslastung haben, kann eine eigene GPU Infrastruktur weiterhin sinnvoll sein.<br><br>

<h3>Die vier Möglichkeiten im direkten Vergleich</h3>

Im Grunde lässt sich die Entscheidung auf eine einfache Frage reduzieren: Wie viel Kontrolle möchte ich selbst übernehmen und wie viel Infrastruktur möchte ich an Microsoft abgeben?

<li><strong>Lokale GPU:</strong> maximale Kontrolle, aber auch maximale Verantwortung für Hardware und Betrieb</li>
<li><strong>Eigene Azure GPU:</strong> keine eigene Hardware, aber weiterhin hoher Administrationsaufwand</li>
<li><strong>Managed Compute:</strong> Open Source Modelle auf verwalteter GPU Infrastruktur mit Autoscaling und Scale to Zero</li>
<li><strong>Serverless API:</strong> maximale Einfachheit, sofern das gewünschte Modell unterstützt wird</li>

Je weiter wir von links nach rechts gehen, desto stärker wird die eigentliche Infrastruktur abstrahiert.<br><br>

<h3>Mein Fazit</h3>

Für mich zeigt Managed Compute sehr schön, wohin sich die KI Infrastruktur gerade entwickelt. Vor einigen Jahren musste ich mir noch einen Server kaufen, wenn ich ein eigenes KI Modell betreiben wollte. Heute kann ich das Modell lokal betreiben, eine GPU in Azure mieten, Microsoft die GPU Infrastruktur über Managed Compute verwalten lassen oder im Idealfall einfach eine Serverless API verwenden.

Besonders interessant finde ich dabei die Kombination aus Managed Compute und Scale to Zero. Denn dadurch muss eine Open Source KI nicht zwangsläufig rund um die Uhr auf einer teuren GPU laufen. Wenn nachts niemand das Modell benötigt, kann die Bereitstellung auf null Instanzen herunterfahren. Wenn morgens wieder Bedarf besteht, kann sie wieder hochskaliert werden.

Der Preis dafür ist allerdings eine gewisse Startzeit und die Tatsache, dass vorhandenes Quota nicht automatisch garantiert, dass die benötigte GPU Kapazität beim nächsten Hochskalieren sofort verfügbar ist.

Damit wird die Entscheidung letztlich ziemlich einfach.

<strong>Lokal bedeutet maximale Kontrolle.</strong>

<strong>Eine eigene Azure GPU bedeutet maximale Freiheit bei weiterhin hohem Betriebsaufwand.</strong>

<strong>Managed Compute bedeutet Open Source Modelle mit deutlich weniger Infrastrukturarbeit.</strong>

<strong>Serverless bedeutet maximale Einfachheit.</strong>

Und genau deshalb würde ich heute nicht mehr automatisch fragen: „Welche GPU brauche ich?“

Ich würde zuerst fragen:

<strong>„Muss ich überhaupt wissen, welche GPU darunter läuft?“</strong>

Wenn die Antwort nein lautet, ist Serverless wahrscheinlich der interessanteste Weg.

Wenn ich mehr Freiheit bei der Modellwahl brauche, aber trotzdem keine GPU Infrastruktur betreiben möchte, wird Managed Compute spannend.

Und wenn ich maximale Kontrolle möchte, kann ich meine GPU immer noch selbst betreiben.

Die spannende Entwicklung ist also nicht unbedingt, dass Microsoft uns immer größere GPUs zur Verfügung stellt.

Die spannende Entwicklung ist, dass wir uns immer weniger darum kümmern müssen, <strong>welche GPU eigentlich unter unserer KI steckt.</strong>
