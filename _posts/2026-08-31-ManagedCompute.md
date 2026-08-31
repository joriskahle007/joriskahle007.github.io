---
layout: post
title: Microsoft Foundry Managed Compute: Open Source KI ohne eigene GPU Infrastruktur?
tags: [AI, Microsoft Foundry, Managed Compute, Open Source, Open Weight, Local LLM]
---

Wenn wir heute ein KI Modell einsetzen möchten, haben wir inzwischen erstaunlich viele Möglichkeiten. Wir können eine GPU lokal in unserem eigenen Rechner betreiben, wir können eine GPU Maschine in Azure mieten oder wir überlassen Microsoft praktisch die komplette Infrastruktur und greifen einfach über eine API auf ein Modell zu.

Und genau dazwischen wird es interessant.

Denn mit Microsoft Foundry Managed Compute gibt es inzwischen eine Möglichkeit, Open Source Modelle auf leistungsfähiger GPU Infrastruktur zu betreiben, ohne selbst virtuelle Maschinen, Container, Kubernetes oder die Modell Runtime verwalten zu müssen.

Aber bevor wir uns Managed Compute genauer anschauen, sollten wir einmal einen Schritt zurückgehen.

Denn eigentlich haben wir heute mehrere grundsätzlich unterschiedliche Möglichkeiten, ein KI Modell zu betreiben.<br><br>

<h3>Vom eigenen Rechner bis zur Serverless API</h3>

Die einfachste Möglichkeit ist gleichzeitig die mit der meisten eigenen Verantwortung: Ich betreibe die KI lokal.

Ich kaufe mir beispielsweise eine leistungsfähige NVIDIA GPU, installiere die benötigte Software und lade mein Modell herunter. Damit habe ich maximale Kontrolle. Das Modell läuft auf meiner Hardware, ich kann experimentieren und muss keine Cloud Infrastruktur bezahlen.

Dafür bezahle ich allerdings die Hardware selbst. Dazu kommen Strom, Kühlung, Speicher und natürlich die komplette Administration.

Die nächste Stufe wäre eine eigene GPU in Azure. Ich kaufe die Hardware nicht mehr selbst, sondern miete beispielsweise eine GPU VM. Das nimmt mir zwar die Hardwarebeschaffung ab, aber nicht den eigentlichen Betrieb. Ich muss mich weiterhin um Betriebssystem, Container, Runtime, Modell und viele weitere Dinge kümmern.

Dann kommt Managed Compute.

Hier sagt Microsoft im Grunde: Du bestimmst das Modell und die gewünschte Bereitstellung. Wir kümmern uns um die darunterliegende GPU Infrastruktur.

Und ganz am Ende steht die Serverless API.

Hier muss ich mich überhaupt nicht mehr mit der GPU beschäftigen. Wenn das gewünschte Modell Serverless unterstützt, wähle ich es aus, bekomme einen API Endpunkt und bezahle für die Nutzung.

Genau diese Abstufung finde ich wichtig, denn dadurch wird auch klar, wo Managed Compute eigentlich seinen Platz hat.<br><br>

<h3>Vier Wege, ein Modell zu betreiben</h3>

<table>
<tr><th></th><th>Lokale GPU</th><th>Eigene Azure GPU</th><th>Managed Compute</th><th>Serverless API</th></tr>
<tr><td>Hardware</td><td>Selbst kaufen</td><td>Azure VM</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>GPU verwalten</td><td>Selbst</td><td>Selbst</td><td>Microsoft</td><td>Microsoft</td></tr>
<tr><td>Modellwahl</td><td>Sehr frei</td><td>Sehr frei</td><td>Open Source und ausgewählte Modelle</td><td>Unterstützte Foundry Modelle</td></tr>
<tr><td>Abrechnung</td><td>Hardware und Betrieb</td><td>GPU Zeit</td><td>GPU beziehungsweise Beschleunigerzeit</td><td>Token oder reservierte Kapazität</td></tr>
<tr><td>Skalierung</td><td>Selbst</td><td>Selbst</td><td>Managed</td><td>Managed</td></tr>
<tr><td>Infrastrukturaufwand</td><td>Hoch</td><td>Hoch</td><td>Niedrig</td><td>Sehr niedrig</td></tr>
</table>

Und genau hier liegt für mich der entscheidende Punkt:

<strong>Je weiter wir nach rechts gehen, desto weniger müssen wir uns um die eigentliche Infrastruktur kümmern.</strong>

Gleichzeitig nimmt aber auch unsere Kontrolle über die darunterliegende Infrastruktur ab.<br><br>

<h3>Und wo steht Managed Compute?</h3>

Managed Compute ist damit nicht einfach eine günstigere Variante einer GPU VM.

Es ist vielmehr eine Abstraktionsebene.

Microsoft stellt für Managed Compute dedizierte GPU Kapazität bereit und übernimmt die Verwaltung der GPU Topologie, der Runtime, der Container Images und der Sicherheitsupdates.

Ich muss also nicht mehr selbst entscheiden, welche virtuelle Maschine ich benötige oder wie ich meine GPU Nodes dimensioniere. Stattdessen beschreibe ich meine Anforderungen über das Modell und die passende Deployment Vorlage. Foundry bestimmt daraus die benötigte GPU Konfiguration.

Aktuell unterstützt Managed Compute unter anderem NVIDIA A100 mit 80 GB, NVIDIA H100 mit 80 GB und AMD MI300X mit 192 GB.

Das Entscheidende dabei ist aber: Ich kaufe beziehungsweise miete nicht einfach eine H100 VM und bekomme dann freie Hand.

Ich bekomme einen verwalteten KI Dienst.<br><br>

<h3>Aber brauche ich Managed Compute überhaupt?</h3>

Und genau diese Frage finde ich eigentlich viel spannender.

Denn wenn ich beispielsweise Qwen verwenden möchte, muss ich nicht automatisch Managed Compute verwenden.

Microsoft bietet im Foundry Katalog auch Open Source und Partnermodelle über die Serverless API an. Dazu gehören unter anderem bestimmte Modelle von Anthropic, Mistral, Cohere und Meta. Welche Modelle konkret Serverless unterstützen, hängt vom jeweiligen Modell ab.

Das bedeutet:

Wenn mein gewünschtes Qwen Modell über Serverless verfügbar ist und die angebotenen Funktionen für meinen Anwendungsfall ausreichen, muss ich mich überhaupt nicht mit der GPU beschäftigen.

Ich nehme das Modell.

Ich rufe die API auf.

Microsoft kümmert sich um den Rest.

Und genau das ist der entscheidende Unterschied.<br><br>

<h3>Serverless ist eigentlich das bequemste Modell</h3>

Wenn ich beispielsweise GPT oder ein unterstütztes Anthropic Modell aus Foundry verwende, interessiert mich normalerweise nicht, welche GPU darunter läuft.

Ich bezahle für meine Nutzung und bekomme einen API Endpunkt.

Genau dieses Prinzip kann auch bei anderen unterstützten Modellen funktionieren.

Microsoft bezeichnet die Serverless API aktuell als den bevorzugten Bereitstellungspfad in Foundry. Sie unterstützt unterschiedliche Abrechnungs und Kapazitätsmodelle und bietet unter anderem globale, regionale und Data Zone Optionen.

Das ist für mich die eigentliche Komfortzone der Cloud.

<strong>Ich möchte ein Modell verwenden, aber ich möchte mich nicht mit der Hardware beschäftigen.</strong>

Dann ist Serverless genau das, was ich eigentlich haben möchte.<br><br>

<h3>Warum gibt es dann überhaupt Managed Compute?</h3>

Weil nicht jedes interessante Open Source Modell als Serverless API angeboten wird.

Und genau hier wird Managed Compute interessant.

Microsoft kann beispielsweise Modelle aus der Hugging Face Sammlung über Managed Compute bereitstellen. Dazu gehören unter anderem Qwen Modelle, NVIDIA Nemotron und ausgewählte Modelle von Meta und Mistral.

Ich bekomme damit also Zugriff auf Open Source Modelle, die ich möglicherweise nicht als klassische Serverless API verwenden kann.

Der Unterschied ist allerdings: Statt pro Token bezahle ich bei Managed Compute für die bereitgestellte GPU Kapazität.

Und damit kommen wir zum Thema Kosten.<br><br>

<h3>Was kostet der Unterschied?</h3>

Nehmen wir ein bewusst vereinfachtes Beispiel.

Angenommen, eine Managed Compute Bereitstellung benötigt eine GPU und wir rechnen beispielhaft mit 2 Euro pro Stunde.

Dann entstehen bei einer dauerhaft laufenden Instanz ungefähr:

<li>2 Euro pro Stunde</li>
<li>48 Euro pro Tag</li>
<li>1.440 Euro bei 30 Tagen Dauerbetrieb</li>

Bei zwei GPUs wären es bereits rund 2.880 Euro im Monat.

Das ist ausdrücklich nur ein Rechenbeispiel und kein aktueller Azure Preis. Die tatsächlichen Preise hängen von GPU Familie, Region und aktueller Preisgestaltung ab. Microsoft verweist für Managed Compute auf den aktuellen Azure Preisrechner.

Und hier zeigt sich der große Unterschied zur Serverless API.

Bei Serverless bezahle ich grundsätzlich für die Nutzung beziehungsweise für reservierte Kapazität.

Bei Managed Compute bezahle ich für die bereitgestellte GPU Kapazität.

Das bedeutet: Wenn mein Modell nur wenige Anfragen am Tag bekommt, kann Serverless wirtschaftlich deutlich interessanter sein.<br><br>

<h3>Managed Compute kann trotzdem interessant sein</h3>

Wenn ich dagegen ein bestimmtes Open Source Modell dauerhaft und mit hoher Auslastung betreiben möchte, sieht die Rechnung anders aus.

Dann kann eine dedizierte GPU Kapazität sinnvoll sein.

Und ich muss trotzdem keine GPU VM konfigurieren, keinen Kubernetes Cluster betreiben und keine eigene Inferenz Runtime installieren.

Interessant ist außerdem, dass Managed Compute inzwischen auch automatische Skalierung und Scale to Zero unterstützt. Eine Bereitstellung kann bei fehlendem Traffic auf null Instanzen zurückgehen. Damit kann die Abrechnung ebenfalls gestoppt werden, wenn keine Kapazität benötigt wird.

Das macht Managed Compute deutlich interessanter, als es eine einfache Rechnung mit 24 Stunden GPU Betrieb zunächst vermuten lässt.<br><br>

<h3>Und was ist mit einer lokalen GPU?</h3>

Gerade hier wird die Diskussion aktuell sehr interessant.

Eine lokale GPU kann für Entwickler und Enthusiasten absolut sinnvoll sein.

Wenn ich häufig experimentiere, unterschiedliche Modelle teste und die Hardware sowieso besitze, kann eine lokale KI Infrastruktur unglaublich praktisch sein.

Ich bezahle dann nicht für jede Anfrage und kann meine Modelle jederzeit ausprobieren.

Aber ich habe dafür die Investitionskosten und den kompletten Betrieb selbst.

Und genau deshalb würde ich lokale KI nicht pauschal mit Cloud KI vergleichen.

Eine lokale GPU ist Infrastruktur.

Serverless ist ein Dienst.

Managed Compute liegt irgendwo dazwischen.<br><br>

<h3>Was würde ich heute auswählen?</h3>

Wenn ich einfach ein Modell verwenden möchte und es als Serverless API verfügbar ist, würde ich persönlich zunächst genau diesen Weg gehen.

Kein GPU Kauf.

Keine GPU VM.

Keine Runtime.

Keine Container.

Keine Infrastruktur.

Einfach API aufrufen und nach Nutzung bezahlen.

Wenn mein gewünschtes Modell nicht als Serverless API verfügbar ist, aber über Managed Compute angeboten wird, würde ich mir Managed Compute anschauen.

Und wenn ich maximale Kontrolle benötige oder sehr spezielle Anforderungen habe, kann eine eigene GPU Infrastruktur sinnvoll sein.

Damit ergibt sich für mich eine ziemlich einfache Entscheidungslogik:

<li><strong>Ich möchte maximale Kontrolle:</strong> lokale GPU oder eigene Azure GPU</li>
<li><strong>Ich möchte ein bestimmtes Open Source Modell und keine Infrastruktur betreiben:</strong> Managed Compute</li>
<li><strong>Ich möchte möglichst einfach ein unterstütztes Modell verwenden:</strong> Serverless API</li>
<li><strong>Ich möchte einfach nur ausprobieren:</strong> Wenn verfügbar, sogar Instant Access in Foundry</li>

Denn Microsoft bietet inzwischen für bestimmte unterstützte Modelle sogar einen sogenannten Instant Access an. Dabei muss überhaupt keine Bereitstellung erstellt werden. Das Modell wird einfach anhand seines Namens aufgerufen. Auch diese Funktion befindet sich derzeit noch in der Vorschau. <br><br>

<h3>Mein Fazit</h3>

Für mich wird durch diese Entwicklung eine Sache immer deutlicher:

<strong>Die Frage „Welche GPU brauche ich?“ wird für Entwickler zunehmend unwichtiger.</strong>

Wenn ich lokal arbeite, muss ich diese Frage natürlich beantworten.

Wenn ich eine eigene Azure GPU betreibe, ebenfalls.

Bei Managed Compute kümmert sich Microsoft bereits um die konkrete GPU Topologie.

Und bei einer Serverless API muss ich mich überhaupt nicht mehr darum kümmern.

Genau deshalb würde ich Managed Compute auch nicht als den großen Ersatz für Serverless betrachten.

Im Gegenteil.

Serverless ist für mich die bequemste Variante, wenn mein gewünschtes Modell dort verfügbar ist.

Managed Compute ist die interessante Zwischenstufe, wenn ich mehr Freiheit bei der Modellwahl benötige, aber trotzdem keine eigene GPU Infrastruktur betreiben möchte.

Und lokale beziehungsweise eigene Cloud GPUs bleiben die Variante für diejenigen, die maximale Kontrolle benötigen oder einen Workload haben, bei dem sich die eigene Infrastruktur wirtschaftlich und technisch lohnt.

Damit haben wir eigentlich einen ziemlich schönen Weg:

<strong>Lokal → eigene GPU Infrastruktur → Managed Compute → Serverless API</strong>

Je weiter ich nach rechts gehe, desto weniger muss ich mich um die Hardware kümmern.

Und genau das ist meiner Meinung nach eine der spannendsten Entwicklungen rund um Microsoft Foundry.

Wir reden immer weniger darüber, <strong>welche GPU unter dem Modell steckt</strong>.

Wir reden zunehmend darüber, <strong>welches Modell wir verwenden möchten und wie wir es konsumieren wollen</strong>.

Und wenn Microsoft diesen Weg weitergeht, könnte die GPU für viele Entwickler irgendwann tatsächlich zu dem werden, was sie eigentlich sein sollte:

<strong>ein technisches Detail, über das ich mir möglichst wenig Gedanken machen muss.</strong>
