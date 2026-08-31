---
layout: post
title: Microsoft Foundry Managed Compute # Open-Source-KI, ohne selbst zum GPU-Betreiber zu werden?
tags: [AI, Microsoft Foundry, Managed Compute, Open Source, Open Weight, Local LLM]
---

<h3>Microsoft Foundry Managed Compute – Open-Source-KI ohne eigene GPU-Infrastruktur?</h3>

Wer sich aktuell mit KI beschäftigt, kommt an Open-Source-Modellen kaum noch vorbei. Qwen, Llama, Mistral und viele andere Modelle entwickeln sich rasant weiter und sind für immer mehr Anwendungsfälle interessant. Gerade bei speziellen Anforderungen kann ein Open-Source-Modell plötzlich die bessere Wahl sein als eines der großen, direkt aus der Cloud angebotenen Modelle.

Allerdings gibt es dabei ein kleines Problem: Ein Modell herunterzuladen ist relativ einfach. Es produktiv zu betreiben, ist eine ganz andere Geschichte.<br>

Denn sobald wir ein größeres Sprachmodell selbst betreiben möchten, benötigen wir entsprechende Hardware. Und damit sind wir sehr schnell bei leistungsfähigen GPUs wie NVIDIA A100 oder H100 beziehungsweise AMD MI300X. Dazu kommen Treiber, CUDA, Container, Inferenz-Runtime, Updates, Monitoring, Security und natürlich die Frage, wie wir das Ganze skalieren.

Genau hier setzt Microsoft mit <strong>Managed Compute in Microsoft Foundry</strong> an.<br><br>

<h3>Was ist Managed Compute?</h3>

Die Idee dahinter ist eigentlich ziemlich einfach: Ich möchte ein Open-Source-Modell verwenden, möchte mich aber nicht selbst um die komplette GPU-Infrastruktur kümmern.

Bei einer klassischen lokalen Installation würde ich mir beispielsweise eine leistungsfähige GPU kaufen, das Modell herunterladen und anschließend die komplette Umgebung selbst aufbauen. In Azure könnte ich stattdessen eine GPU-VM mieten und dort genau dasselbe tun.

Managed Compute geht einen Schritt weiter.

Ich sage Foundry im Wesentlichen, welches Modell ich betreiben möchte und welche passende Bereitstellung ich dafür verwenden möchte. Die darunterliegende GPU-Infrastruktur wird von Microsoft bereitgestellt und verwaltet.<br>

Das ist ein ziemlich wichtiger Unterschied. Ich kaufe beziehungsweise miete nicht einfach eine GPU und muss anschließend alles selbst installieren. Ich bekomme eine verwaltete Umgebung, in der Microsoft unter anderem die benötigte Runtime und die zugrunde liegende Infrastruktur bereitstellt.<br><br>

<h3>Warum ist das überhaupt interessant?</h3>

Weil Open Source und Managed Service damit nicht mehr zwingend Gegensätze sind.

Bisher musste ich mich im Grunde entscheiden: Entweder ich nehme ein Modell, das mir Microsoft direkt als Managed Service anbietet, oder ich betreibe ein Open-Source-Modell selbst.

Managed Compute versucht, genau diese Lücke zu schließen.

Ich kann beispielsweise ein Modell aus dem Open-Source-Ökosystem verwenden und bekomme trotzdem einen von Foundry verwalteten Betrieb. Microsoft stellt dafür verschiedene Runtimes und GPU-Konfigurationen über sogenannte Deployment Templates bereit.

Damit muss ich nicht jedes Mal selbst herausfinden, welche GPU und welche Runtime für ein bestimmtes Modell geeignet sind.<br><br>

<h3>Die drei Möglichkeiten im direkten Vergleich</h3>

Für mich wird das Konzept am verständlichsten, wenn man die drei Varianten einmal nebeneinanderstellt:

<table>
<tr><th></th><th>Lokale GPU</th><th>Managed Compute</th><th>Foundry Managed Model</th></tr>
<tr><td>Modellwahl</td><td>Sehr frei</td><td>Sehr frei innerhalb des Katalogs</td><td>Modelle aus Foundry</td></tr>
<tr><td>GPU selbst wählen</td><td>Ja</td><td>Über Deployment Template</td><td>Nein</td></tr>
<tr><td>Hardware</td><td>Selbst kaufen</td><td>Azure</td><td>Azure</td></tr>
<tr><td>Betrieb</td><td>Selbst</td><td>Microsoft Managed</td><td>Microsoft Managed</td></tr>
<tr><td>Abrechnung</td><td>Investition + Betrieb</td><td>GPU-/Beschleunigerzeit</td><td>Tokenverbrauch</td></tr>
<tr><td>Skalierung</td><td>Selbst</td><td>Managed Instances</td><td>Managed</td></tr>
</table>

Und genau diese Tabelle zeigt eigentlich schon ziemlich gut, wo Managed Compute seinen Platz findet.

Wer maximale Kontrolle möchte, nimmt eine eigene GPU-Infrastruktur. Wer es maximal einfach möchte und mit den verfügbaren Modellen auskommt, verwendet ein klassisches Foundry-Modell.

Managed Compute sitzt dazwischen.<br><br>

<h3>Und was kostet das?</h3>

Hier wird es interessant – und gleichzeitig sollte man genau hinschauen.

Ein klassisches Foundry-Modell wird in der Regel nach der tatsächlichen Nutzung über Input- und Output-Tokens abgerechnet. Wenn gerade niemand eine Anfrage stellt, entstehen durch die reine Existenz des Modells nicht automatisch GPU-Kosten.

Bei Managed Compute ist das anders. Hier bezahle ich für die bereitgestellte Beschleunigerkapazität.

Nehmen wir deshalb einmal ein bewusst vereinfachtes Beispiel. Angenommen, eine Managed-Compute-Bereitstellung benötigt eine GPU und diese kostet in unserem Beispiel <strong>2 Euro pro Stunde</strong>. Dann sieht die Rechnung ungefähr so aus:

<li>1 GPU × 2 € × 24 Stunden = 48 € pro Tag</li>
<li>48 € × 30 Tage = 1.440 € pro Monat</li>

Und das Entscheidende ist: Diese Kosten entstehen auch dann, wenn mein Modell in dieser Zeit kaum genutzt wird.

Bei zwei GPUs wären es entsprechend bereits rund 2.880 € pro Monat. Bei leistungsfähigeren GPUs oder anderen Azure-Preisen kann die tatsächliche Rechnung natürlich deutlich höher oder niedriger ausfallen.<br>

Das Beispiel soll deshalb nicht einen konkreten Azure-Preis darstellen, sondern vor allem eines zeigen:

<strong>Managed Compute ist nicht automatisch günstiger als ein klassisches Foundry-Modell.</strong>

Es ist ein anderes Abrechnungsmodell.<br><br>

<h3>Wann lohnt sich Managed Compute?</h3>

Wenn ich nur gelegentlich einen Chatbot benutze oder ein kleines Projekt betreibe, würde ich vermutlich zunächst ein klassisches Foundry-Modell verwenden.

Ich bezahle für die tatsächliche Nutzung und muss mich überhaupt nicht um GPUs kümmern.

Anders sieht es aus, wenn ich ein bestimmtes Open-Source-Modell benötige und dieses dauerhaft mit einer höheren Auslastung betreiben möchte.

Dann kann Managed Compute interessant werden. Ich bekomme dedizierte Rechenkapazität, ohne selbst Server kaufen und betreiben zu müssen.

Besonders interessant finde ich das für Unternehmen, die Open-Source-Modelle einsetzen möchten, aber keine eigene GPU-Infrastruktur aufbauen wollen.<br><br>

<h3>Und was ist mit einer lokalen GPU?</h3>

Gerade bei diesem Thema wird aktuell sehr viel über lokale KI gesprochen.

Eine eigene GPU hat natürlich einen großen Vorteil: Sie gehört mir.

Ich kann damit machen, was ich möchte. Ich habe keine laufenden Cloud-Gebühren für jede Betriebsstunde und kann Modelle beliebig ausprobieren.

Aber auch hier darf man die Rechnung nicht zu einfach machen.

Eine leistungsfähige GPU kostet zunächst Geld. Dazu kommen Rechner, Speicher, Strom, Kühlung und gegebenenfalls weitere Hardware. Und natürlich muss sich jemand um Updates, Treiber, Software und die gesamte Umgebung kümmern.

Für einen Entwickler, der einfach experimentieren möchte, kann eine lokale GPU deshalb sehr attraktiv sein.

Für ein Unternehmen, das eine Anwendung 24/7 betreiben möchte, kann die Situation dagegen ganz anders aussehen.<br><br>

<h3>Managed Compute ist also kein Ersatz für lokale KI</h3>

Und genau das ist meiner Meinung nach wichtig.

Managed Compute soll nicht die lokale GPU ersetzen. Es soll auch nicht die klassische Azure-VM ersetzen.

Es ist eine weitere Möglichkeit.

Wenn ich maximale Kontrolle benötige, kann ich meine eigene Infrastruktur betreiben.

Wenn ich maximale Einfachheit möchte, nehme ich ein klassisches Managed Model aus Foundry.

Und wenn ich ein Open-Source-Modell benötige, aber die GPU-Infrastruktur nicht selbst betreiben möchte, wird Managed Compute interessant.<br><br>

<h3>Was ich daran besonders spannend finde</h3>

Für mich ist Managed Compute deshalb weniger wegen der GPU interessant, sondern wegen der Abstraktion.

Die GPU wird zunehmend zur Nebensache.

Ich möchte als Entwickler eigentlich nicht wissen, ob unter meinem Modell eine A100, H100 oder MI300X steckt. Ich möchte wissen, welches Modell ich verwenden kann, welche Performance ich bekomme und was mich der Betrieb kostet.

Genau diese Entwicklung sehen wir gerade an vielen Stellen in der Cloud.

Erst wurden Server abstrahiert. Dann virtuelle Maschinen. Dann Container und Kubernetes.

Jetzt beginnt die Cloud damit, auch die KI-Infrastruktur zu abstrahieren.<br>

Und das könnte gerade bei Open-Source-KI ein wichtiger Schritt sein.

Denn Open Source bedeutet damit nicht mehr zwangsläufig, dass ich auch selbst zum Betreiber meiner GPU-Infrastruktur werden muss.<br><br>

<h3>Mein Fazit</h3>

Managed Compute in Microsoft Foundry finde ich deshalb ausgesprochen interessant.

Nicht, weil es die günstigste Möglichkeit ist, ein KI-Modell zu betreiben. Das wird es in vielen Szenarien vermutlich nicht sein.

Und auch nicht, weil dadurch plötzlich jede Open-Source-KI ohne Einschränkungen betrieben werden kann.

Interessant ist vielmehr die Kombination aus <strong>Open-Source-Modell und Managed Infrastructure</strong>.

Ich kann ein Modell auswählen, das ich tatsächlich einsetzen möchte, bekomme dafür eine passende Deployment-Konfiguration und muss mich nicht selbst um GPU-Server, Container und die grundlegende Runtime kümmern.

Die entscheidende Frage lautet deshalb für mich nicht:

<strong>„Ist Managed Compute besser als eine eigene GPU?“</strong>

Sondern:

<strong>„Wie viel Kontrolle brauche ich wirklich – und wie viel Infrastruktur möchte ich selbst betreiben?“</strong>

Wenn ich maximale Kontrolle und eine hohe Auslastung habe, kann eine eigene GPU sinnvoll sein.

Wenn ich möglichst wenig Aufwand möchte und mit den verfügbaren Modellen zufrieden bin, ist ein klassisches Foundry-Modell wahrscheinlich die bessere Wahl.

Und irgendwo genau dazwischen sitzt Managed Compute.

Ich glaube deshalb, dass wir diese Art von Dienst in Zukunft noch häufiger sehen werden. Denn je mehr leistungsfähige Open-Source-Modelle auf den Markt kommen, desto weniger möchten Unternehmen zwangsläufig auch deren komplette Infrastruktur selbst betreiben.

<strong>Das Modell möchte ich vielleicht selbst auswählen. Die GPU möchte ich aber nicht unbedingt selbst verwalten.</strong>

Und genau dafür könnte Managed Compute eine ziemlich interessante Lösung sein.
