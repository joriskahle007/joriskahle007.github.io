---
layout: post
title: Microsoft Foundry Managed Compute | Open Source KI ohne eigene GPU Infrastruktur?
tags: [AI, Microsoft Foundry, Managed Compute, Open Source, Open Weight, Local LLM]
---

Wer sich aktuell mit KI beschäftigt, kommt an Open Source Modellen kaum noch vorbei. Qwen, Llama, Mistral und viele andere Modelle werden immer leistungsfähiger und sind inzwischen für eine ganze Reihe von Anwendungsfällen interessant. Gleichzeitig stellt sich aber irgendwann die Frage, wo diese Modelle eigentlich laufen sollen. Lokal auf dem eigenen Rechner? Auf einer gemieteten GPU in Azure? Oder einfach irgendwo in der Cloud, ohne dass wir uns überhaupt noch Gedanken über die darunterliegende Hardware machen müssen?

Genau an diesem Punkt wird Microsoft Foundry interessant. Denn inzwischen haben wir nicht mehr nur die Wahl zwischen „eigene GPU“ und „Cloud“. Es gibt mehrere Abstufungen, bei denen wir immer mehr Verantwortung an Microsoft abgeben können.<br><br>

<h3>Von der lokalen KI bis zur Serverless API</h3>

Fangen wir ganz links an. Bei einer lokalen KI laden wir das Modell auf unseren eigenen Rechner und lassen es dort laufen. Das hat einen großen Vorteil: Wir haben maximale Kontrolle. Wir entscheiden selbst, welche Hardware wir verwenden, welches Modell installiert wird und wann und wie es läuft. Dafür müssen wir aber auch die komplette Infrastruktur bezahlen und betreiben. Eine leistungsfähige GPU kostet schnell mehrere tausend Euro und auch Strom, Kühlung, Speicher und Wartung sollte man nicht vergessen.

Die nächste Möglichkeit wäre eine eigene GPU in Azure. Damit müssen wir die Hardware nicht selbst kaufen, übernehmen aber weiterhin einen großen Teil des Betriebs. Wir wählen eine passende virtuelle Maschine aus, installieren unsere Umgebung, kümmern uns um Container und Runtime und laden anschließend unser Modell. Microsoft stellt uns also die Hardware zur Verfügung, aber wir betreiben darauf im Grunde unseren eigenen Server.

Mit Managed Compute in Microsoft Foundry geht Microsoft einen Schritt weiter. Hier müssen wir uns nicht mehr selbst um die eigentliche GPU Infrastruktur kümmern. Wir wählen ein unterstütztes Modell und eine passende Bereitstellung und Microsoft stellt die benötigte Rechenkapazität zur Verfügung und übernimmt einen großen Teil des technischen Betriebs.

Am anderen Ende steht die Serverless API. Wenn unser gewünschtes Modell diese Bereitstellungsart unterstützt, müssen wir uns praktisch überhaupt nicht mehr mit der Infrastruktur beschäftigen. Wir wählen das Modell aus, bekommen einen API Endpunkt und bezahlen für die Nutzung. Welche GPU darunter läuft, interessiert uns nicht mehr.

Damit ergibt sich eine ziemlich interessante Entwicklung:

<table>
<tr><th></th><th>Lokale GPU</th><th>Eigene Azure GPU</th><th>Managed Compute</th><th>Serverless API</th></tr>
<tr><td>Hardware</td><td>Selbst</td><td>Azure</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>GPU Verwaltung</td><td>Selbst</td><td>Selbst</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>Modellwahl</td><td>Sehr frei</td><td>Sehr frei</td><td>Open Source und ausgewählte Modelle</td><td>Unterstützte Modelle</td></tr>
<tr><td>Kostenmodell</td><td>Hardware und Betrieb</td><td>GPU Zeit</td><td>GPU Kapazität</td><td>Nutzung beziehungsweise Tokens</td></tr>
<tr><td>Aufwand</td><td>Hoch</td><td>Hoch</td><td>Mittel</td><td>Sehr gering</td></tr>
</table>

Je weiter wir also nach rechts gehen, desto weniger müssen wir uns um die eigentliche Infrastruktur kümmern. Und genau hier kommt Managed Compute ins Spiel.<br><br>

<h3>Was ist Managed Compute eigentlich?</h3>

Managed Compute ist für mich am einfachsten als Zwischenstufe zwischen einer eigenen GPU und einer Serverless API zu verstehen. Ich möchte vielleicht ein Open Source Modell verwenden, möchte aber nicht selbst einen GPU Server betreiben.

Microsoft stellt dafür die notwendige GPU Infrastruktur bereit und übernimmt die Verwaltung der zugrunde liegenden Umgebung. Je nach Modell können dabei beispielsweise NVIDIA A100, NVIDIA H100 oder AMD MI300X zum Einsatz kommen.

Der entscheidende Punkt ist aber: Ich muss nicht selbst eine GPU VM aufsetzen und anschließend herausfinden, welche Runtime, welche Container Konfiguration und welche GPU Kombination für mein Modell geeignet ist. Foundry stellt entsprechende Bereitstellungen und Vorlagen zur Verfügung.

Das macht Managed Compute besonders für Open Source Modelle interessant. Ich bekomme mehr Freiheit bei der Modellwahl als bei einer klassischen Serverless API, ohne gleichzeitig die komplette Infrastruktur selbst betreiben zu müssen.<br><br>

<h3>Aber warum nicht einfach Serverless?</h3>

Und genau diese Frage ist meiner Meinung nach entscheidend.

Wenn ich beispielsweise Qwen verwenden möchte, bedeutet das nicht automatisch, dass ich Managed Compute brauche. Microsoft bietet verschiedene Modelle im Foundry Katalog auch über Serverless APIs an. Je nach konkretem Modell und Verfügbarkeit können dazu auch Open Source beziehungsweise Partnermodelle gehören.

Wenn mein gewünschtes Modell als Serverless API verfügbar ist und für meinen Anwendungsfall funktioniert, würde ich zunächst genau diesen Weg wählen. Warum sollte ich mich mit GPUs beschäftigen, wenn Microsoft mir das Modell bereits als fertigen Dienst zur Verfügung stellt?

Ich bekomme einen API Endpunkt, schicke meine Anfragen dorthin und bezahle für die tatsächliche Nutzung. Keine GPU kaufen, keine VM konfigurieren, keine Runtime installieren und vor allem keine Gedanken darüber machen, ob gerade eine H100 oder eine A100 unter meinem Modell steckt.

<strong>Serverless ist deshalb die bequemste Variante.</strong>

Managed Compute wird interessant, wenn ich mehr Freiheit bei der Modellwahl benötige oder ein bestimmtes Modell verwenden möchte, das nicht als Serverless API verfügbar ist.<br><br>

<h3>Und dann kommt Scale to Zero</h3>

Hier wird Managed Compute für mich persönlich noch einmal deutlich interessanter.

Auf den ersten Blick könnte man nämlich denken, dass Managed Compute bedeutet, dass wir uns einfach eine teure GPU mieten und diese anschließend rund um die Uhr bezahlen. Das muss aber nicht zwingend so sein.

Managed Compute unterstützt Autoscaling und Scale to Zero. Das bedeutet, dass die Anzahl der laufenden Modellinstanzen abhängig von der Auslastung angepasst werden kann. Wenn über einen bestimmten Zeitraum keine Anfragen mehr eingehen, kann die Bereitstellung bis auf null Instanzen heruntergefahren werden.

Und wenn keine Instanz läuft, wird auch keine GPU Kapazität für diese Instanz benötigt.

Nehmen wir einmal ein Beispiel wie PlaudaZeit. Tagsüber haben wir Benutzer und benötigen vielleicht eine Instanz. Wenn die Nutzung stark steigt, können wir auf zwei Instanzen skalieren. Nachts dagegen ist möglicherweise kaum jemand aktiv. Dann könnte die Bereitstellung auf null Instanzen heruntergefahren werden.

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

Das bedeutet: Wenn ich nachts auf null skaliere und morgens um 6 Uhr wieder auf eine oder zwei Instanzen hoch möchte, kann das funktionieren, aber ich sollte nicht davon ausgehen, dass mein Modell innerhalb weniger Sekunden garantiert wieder bereitsteht.

Für eine Anwendung wie PlaudaZeit würde ich deshalb die Instanz nicht erst dann starten, wenn der erste Benutzer die Anwendung öffnet. Wenn ich weiß, dass ab 6 Uhr morgens wieder mit ersten Anfragen zu rechnen ist, könnte die Skalierung beispielsweise bereits einige Minuten vorher erfolgen.

Damit bekomme ich einen interessanten Kompromiss zwischen Kosten und Verfügbarkeit.<br><br>

<h3>Und muss ich die GPU dafür reservieren?</h3>

Hier muss man zwischen Kontingent und tatsächlich verfügbarer GPU Kapazität unterscheiden.

Für Managed Compute benötigen wir das entsprechende Foundry Kontingent für die jeweilige GPU Familie. Dieses Kontingent erlaubt uns, die entsprechende Kapazität anzufordern. Es bedeutet aber nicht automatisch, dass Microsoft uns eine konkrete H100 dauerhaft reserviert.

Das ist wichtig, denn genau hier kann beim Hochskalieren ein Problem entstehen. Wenn in der gewünschten Region gerade nicht genügend passende GPU Kapazität vorhanden ist, kann die Bereitstellung mit einem Kapazitätsfehler scheitern.

<strong>Quota bedeutet also nicht automatisch reservierte GPU Kapazität.</strong>

Wenn unsere Anwendung unbedingt rund um die Uhr verfügbar sein muss und innerhalb weniger Sekunden reagieren soll, ist Scale to Zero deshalb möglicherweise nicht die richtige Wahl. Dann wäre es sinnvoller, mindestens eine Instanz dauerhaft aktiv zu halten.<br><br>

<h3>Was kostet Managed Compute?</h3>

Schauen wir uns dazu ein bewusst vereinfachtes Beispiel an. Angenommen, eine Managed Compute Instanz würde in unserem Beispiel 2 Euro pro Stunde kosten. Bei einem durchgehenden Betrieb wären das 48 Euro am Tag beziehungsweise rund 1.440 Euro bei 30 Tagen.

Wenn wir die Instanz dagegen nur zwölf Stunden am Tag benötigen, wären es unter denselben angenommenen Bedingungen nur noch etwa 720 Euro im Monat. Wird nachts zusätzlich auf null Instanzen skaliert, kann sich die tatsächlich bezahlte Compute Zeit weiter reduzieren.

Die tatsächlichen Azure Preise hängen natürlich von GPU, Region und aktueller Preisgestaltung ab. Die Zahlen sollen deshalb lediglich das Prinzip verdeutlichen.

Der interessante Punkt ist aber: <strong>Managed Compute muss nicht zwangsläufig bedeuten, dass wir eine GPU 24 Stunden am Tag bezahlen.</strong><br><br>

<h3>Was würde ich für eine Anwendung wie PlaudaZeit wählen?</h3>

Genau hier wird es für mich spannend.

Wenn das von uns gewünschte Modell als Serverless API verfügbar ist und die Funktionen für PlaudaZeit ausreichen, würde ich zunächst Serverless verwenden. Das ist die einfachste Variante und wir müssen uns praktisch um keine Infrastruktur kümmern.

Wenn wir dagegen ein bestimmtes Open Source Modell benötigen, das nicht als Serverless API verfügbar ist, würde ich mir Managed Compute genauer ansehen. Dann können wir beispielsweise tagsüber eine oder zwei Instanzen betreiben und nachts auf null skalieren.

Wichtig wäre dabei allerdings, die Hochskalierung nicht erst beim ersten Benutzer auszulösen. Wir müssten unsere typische Nutzung kennen und die Instanz entsprechend frühzeitig wieder hochfahren.

Wenn wir dagegen maximale Kontrolle benötigen, sehr spezielle Modelle verwenden oder eine dauerhaft hohe Auslastung haben, kann eine eigene GPU Infrastruktur weiterhin sinnvoll sein. Das kann lokal sein oder auch eine eigene Azure GPU VM.

Damit haben wir eigentlich eine ziemlich einfache Entscheidungslogik:

<li><strong>Maximale Kontrolle:</strong> eigene lokale oder Azure GPU</li>
<li><strong>Open Source Modell ohne eigene GPU Infrastruktur:</strong> Managed Compute</li>
<li><strong>Möglichst wenig Infrastruktur und unterstütztes Modell:</strong> Serverless API</li>
<li><strong>Sehr geringe oder unregelmäßige Nutzung:</strong> Serverless beziehungsweise Managed Compute mit Scale to Zero prüfen</li>

<h3>Mein Fazit</h3>

Für mich zeigt Managed Compute sehr schön, wohin sich die KI Infrastruktur gerade entwickelt. Vor einigen Jahren musste ich mir noch einen Server kaufen, wenn ich ein eigenes KI Modell betreiben wollte. Heute kann ich das Modell lokal betreiben, eine GPU in Azure mieten, Microsoft die GPU Infrastruktur über Managed Compute verwalten lassen oder im Idealfall einfach eine Serverless API verwenden.

Besonders interessant finde ich dabei die Kombination aus Managed Compute und Scale to Zero. Denn dadurch muss eine Open Source KI nicht zwangsläufig rund um die Uhr auf einer teuren GPU laufen. Wenn nachts niemand das Modell benötigt, kann die Bereitstellung auf null Instanzen herunterfahren. Wenn morgens wieder Bedarf besteht, kann sie automatisch wieder hochskaliert werden.

Der Preis dafür ist allerdings eine gewisse Startzeit und die Tatsache, dass vorhandenes Quota nicht automatisch garantiert, dass die benötigte GPU Kapazität beim nächsten Hochskalieren sofort verfügbar ist.

Damit wird die Entscheidung letztlich ziemlich einfach.

<strong>Lokal bedeutet maximale Kontrolle.</strong>

<strong>Eigene Azure GPU bedeutet maximale Freiheit bei weiterhin hohem Betriebsaufwand.</strong>

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
