---
layout: post
title: Microsoft Foundry Managed Compute # Open-Source-KI, ohne selbst zum GPU-Betreiber zu werden?
tags: [AI, Microsoft Foundry, Managed Compute, Open Source, Open Weight, Local LLM]
---

Wenn wir heute über künstliche Intelligenz sprechen, dann landen wir sehr schnell bei den großen Namen. GPT, Claude, Gemini, Llama, Mistral, Qwen und inzwischen unzählige weitere Modelle. Für viele Entwickler ist die Sache dabei erstaunlich einfach geworden. Ich brauche eine Anwendung, ich brauche ein Modell, ich hole mir einen API-Key und schon kann ich loslegen.

Zumindest so lange, wie ich eines der Modelle verwende, die mir ein Anbieter direkt als Managed Service zur Verfügung stellt.

Interessant wird es nämlich genau an dem Punkt, an dem ich sage: Ich möchte **mein eigenes Modell**.

Vielleicht möchte ich ein bestimmtes Open-Source-Modell einsetzen. Vielleicht ist es Qwen, vielleicht Llama, vielleicht ein spezialisiertes Vision-Modell oder irgendein anderes Modell aus dem Hugging-Face-Ökosystem. Vielleicht möchte ich das Modell aus Datenschutzgründen selbst betreiben. Vielleicht brauche ich eine bestimmte Version oder möchte die volle Kontrolle über das Modell behalten.

Und dann stellt sich plötzlich eine ganz andere Frage:

**Wo soll dieses Modell eigentlich laufen?**

Denn ein Large Language Model läuft nun einmal nicht einfach auf irgendeinem kleinen Server. Je nach Modellgröße und gewünschter Performance reden wir schnell über sehr leistungsfähige GPUs. A100, H100 oder AMD MI300X sind dann keine exotischen Begriffe mehr, sondern die Hardware, auf der solche Workloads tatsächlich betrieben werden.

Und genau an diesem Punkt wird es interessant.

Microsoft hat mit **Managed Compute in Microsoft Foundry** einen Ansatz vorgestellt, der meiner Meinung nach eine ziemlich spannende Lücke zwischen klassischem Managed AI Service und vollständig selbst betriebener Open-Source-Infrastruktur schließt.

Die Idee dahinter klingt zunächst relativ unspektakulär:

**Ich möchte ein Open-Source-Modell betreiben, aber ich möchte mich nicht selbst um die komplette GPU-Infrastruktur kümmern.**

Und wenn man sich genauer anschaut, was Microsoft hier eigentlich baut, steckt deutlich mehr dahinter.

---

## Das Problem mit Open-Source-KI beginnt meistens nicht beim Modell

Nehmen wir einmal an, ich entdecke ein interessantes Open-Source-Modell.

Das Modell gefällt mir. Die Qualität stimmt. Die Lizenz passt. Es wäre für meine Anwendung grundsätzlich geeignet.

Also lade ich es herunter.

Und jetzt?

Genau hier beginnt für viele Projekte der eigentlich schwierige Teil.

Denn ein Modell herunterzuladen ist eine Sache. Es **produktiv zu betreiben** ist eine völlig andere.

Ich brauche zunächst einmal die passende Hardware. Dann muss ich herausfinden, ob das Modell überhaupt in den Speicher meiner GPU passt. Wenn nicht, muss ich über Quantisierung oder mehrere GPUs nachdenken. Danach brauche ich eine geeignete Inferenz-Runtime. Vielleicht vLLM, vielleicht SGLang, vielleicht TensorRT-LLM oder eine andere Lösung.

Dann kommen Container ins Spiel. Dazu kommen CUDA und die entsprechenden Treiber. Dann müssen Runtime, Framework und Modell miteinander funktionieren. Anschließend brauche ich Netzwerk, Authentifizierung, Monitoring, Logging, Updates und natürlich eine vernünftige Skalierung.

Und spätestens wenn das Ganze produktiv werden soll, kommt noch eine weitere Frage hinzu:

**Wer kümmert sich eigentlich darum?**

Denn eine GPU ist nicht deshalb plötzlich einfach zu betreiben, nur weil sie in der Cloud steht.

Das ist ein Punkt, den man bei der Diskussion über Open-Source-KI meiner Meinung nach sehr häufig unterschätzt.

Open Source bedeutet nicht automatisch einfach.

Im Gegenteil.

Ein Open-Source-Modell gibt mir enorme Freiheit. Aber diese Freiheit bedeutet normalerweise auch, dass ich mich selbst um deutlich mehr Dinge kümmern muss.

---

## Genau hier setzt Managed Compute an

Microsoft versucht mit Managed Compute, einen großen Teil dieser Komplexität aus der Anwendung herauszuhalten.

Die Idee ist eigentlich ziemlich elegant.

Ich sage nicht mehr:

„Ich möchte eine H100-VM.“

Ich sage auch nicht:

„Ich möchte einen Kubernetes-Cluster mit drei Nodes, darauf vLLM in Version X und dieses Container Image.“

Stattdessen sage ich im Prinzip:

**Ich möchte dieses Modell mit dieser Konfiguration betreiben.**

Die darunterliegende GPU-Infrastruktur wird von Microsoft bereitgestellt und verwaltet.

Damit verschiebt sich die Perspektive.

Bei einer klassischen eigenen KI-Infrastruktur denke ich über Server, GPUs, Container und Runtime nach.

Bei Managed Compute denke ich primär über **das Modell und dessen Deployment** nach.

Und genau diese Abstraktion ist für mich der eigentlich interessante Teil.

---

## Open Source und Managed Service werden plötzlich keine Gegensätze mehr

Bisher war die Welt relativ einfach.

Auf der einen Seite standen Managed Models.

Ich nehme beispielsweise ein Modell, das mir der Cloud-Anbieter direkt zur Verfügung stellt. Ich muss mich nicht um die GPU kümmern, nicht um den Container und nicht um die Modell-Runtime. Ich bezahle für die Nutzung und bekomme einen API-Endpunkt.

Auf der anderen Seite standen Open-Source-Modelle.

Ich kann praktisch jedes interessante Modell aus dem entsprechenden Ökosystem nehmen. Dafür muss ich mich aber selbst um den Betrieb kümmern.

Managed Compute versucht, genau zwischen diesen beiden Welten zu liegen.

Ich kann ein Open-Source-Modell verwenden und bekomme trotzdem einen Managed Service für die darunterliegende Infrastruktur.

Das finde ich tatsächlich ziemlich interessant.

Denn gerade bei Open-Source-KI entsteht aktuell eine enorme Dynamik. Modelle werden immer besser und erscheinen in immer kürzeren Abständen. Es wäre deshalb ziemlich schade, wenn man bei der Auswahl eines Modells immer gleichzeitig entscheiden müsste, ob man auch dessen komplette Infrastruktur selbst betreiben möchte.

Genau diese Kopplung versucht Microsoft mit Managed Compute aufzulösen.

---

## Welche Hardware steckt dahinter?

Natürlich verschwindet die Hardware nicht einfach.

Sie wird nur abstrahiert.

Microsoft stellt für Managed Compute aktuell verschiedene leistungsfähige GPU-Beschleuniger bereit. Dazu gehören NVIDIA A100 mit 80 GB Speicher, NVIDIA H100 mit 80 GB und AMD MI300X mit beeindruckenden 192 GB.

Und spätestens bei diesen Zahlen wird klar, in welcher Liga wir uns bewegen.

Das ist keine Lösung, die darauf ausgelegt ist, mal eben einen kleinen lokalen Chatbot mit einem sieben Milliarden Parameter großen Modell laufen zu lassen.

Hier geht es um professionelle KI-Inferenz.

Und genau deshalb ist die Abstraktion interessant.

Denn ich muss nicht unbedingt selbst entscheiden, welche GPU ich kaufen oder welche Azure-VM ich konfigurieren muss. Stattdessen wähle ich eine passende Bereitstellung für mein Modell.

Microsoft spricht dabei von sogenannten **Deployment Templates**.

---

## Deployment Templates sind eigentlich der Schlüssel

Wenn man Managed Compute verstehen möchte, sollte man diesen Begriff nicht einfach überlesen.

Eine Deployment Template beschreibt im Grunde, **wie ein bestimmtes Modell betrieben werden kann**.

Denn ein Modell ist nicht automatisch gleich ein bestimmter Hardwarebedarf.

Nehmen wir beispielsweise ein Modell wie Qwen3-32B.

Je nachdem, welche Kontextlänge ich benötige, welche Performance ich erreichen möchte und welche Optimierungen eingesetzt werden, kann sich die benötigte Hardware deutlich unterscheiden.

Microsoft stellt für entsprechende Modelle unterschiedliche Templates bereit.

Damit muss der Entwickler nicht zwingend selbst herausfinden, welche GPU-Konfiguration für das Modell sinnvoll ist.

Das ist ein ziemlich wichtiger Unterschied.

Ich muss nicht mehr unbedingt die Frage beantworten:

„Welche GPU brauche ich?“

Sondern eher:

„Welche Bereitstellung passt zu meinem Szenario?“

Das klingt nach einer kleinen Veränderung.

In der Praxis ist es aber eine ziemlich große Vereinfachung.

---

## Und auch die Runtime muss ich nicht selbst zusammensuchen

Wer schon einmal versucht hat, eine moderne LLM-Inferenzumgebung selbst aufzubauen, weiß, wie schnell aus einem einfachen Experiment ein kleines Infrastrukturprojekt werden kann.

Welche CUDA-Version?

Welche PyTorch-Version?

Welche vLLM-Version?

Welcher Container?

Welche Treiberversion?

Welche Parameter?

Welche GPU?

Und dann natürlich die Frage, ob das alles auch wirklich miteinander funktioniert.

Microsoft nimmt auch hier einen großen Teil der Arbeit ab.

Managed Compute unterstützt verschiedene Inferenz-Runtimes, unter anderem vLLM, SGLang, TensorRT-LLM, NVIDIA NIM und llama.cpp. Darüber hinaus gibt es Lösungen für Embeddings und andere Modelltypen.

Das bedeutet nicht, dass plötzlich jedes beliebige Modell automatisch funktioniert.

Aber es bedeutet, dass Microsoft versucht, die Kombination aus Modell, Runtime und GPU als fertige Plattform bereitzustellen.

Und genau das ist aus meiner Sicht der interessante Ansatz.

---

## Der eigentliche Vorteil ist deshalb gar nicht die GPU

Wenn man Managed Compute zum ersten Mal sieht, könnte man denken:

„Okay, Microsoft vermietet mir jetzt eben eine H100.“

Das wäre meiner Meinung nach die falsche Betrachtung.

Die H100 ist nur die Hardware darunter.

Der eigentliche Mehrwert liegt darin, dass ich **nicht mehr selbst der Betreiber dieser Hardware sein muss**.

Ich muss mich nicht darum kümmern, wie die GPU in die Infrastruktur integriert wird. Ich muss nicht selbst die Runtime als Container orchestrieren. Ich muss mich nicht um die grundlegende Bereitstellung kümmern.

Microsoft übernimmt einen großen Teil dieser Aufgaben.

Und genau das ist der Unterschied zwischen einer GPU-VM und einem Managed Compute Service.

---

## Auch Security spielt dabei eine Rolle

Ein weiterer Punkt, der mir bei Managed Compute auffällt, ist das Thema Sicherheit.

Wenn ich mir irgendein Modell von Hugging Face herunterlade und es auf meiner eigenen Infrastruktur betreibe, bin ich letztlich selbst dafür verantwortlich, was ich dort ausführe.

Microsoft beschreibt für die in Managed Compute verwendeten Modelle eine eigene Kurations- und Validierungspipeline.

Modelle und Container werden geprüft, Images werden gescannt und signiert und die Modellgewichte werden validiert.

Die Modellartefakte werden anschließend in von Microsoft verwalteter Azure-Infrastruktur bereitgestellt.

Das ist gerade für Unternehmen interessant.

Denn damit wird aus:

„Wir haben irgendwo ein Open-Source-Modell heruntergeladen.“

etwas deutlich strukturierteres:

„Wir verwenden ein von Microsoft für Managed Compute bereitgestelltes Modell aus dem Foundry-Ökosystem.“

Das ist natürlich nicht automatisch eine Garantie dafür, dass das Modell für jeden denkbaren Anwendungsfall geeignet ist.

Aber es verändert die Ausgangssituation erheblich.

---

## Besonders interessant: Kein direkter Zugriff auf Hugging Face notwendig

Ein Detail finde ich dabei besonders spannend.

Die Managed-Compute-Umgebung muss für die Bereitstellung nicht zwangsläufig direkt auf Hugging Face zugreifen.

Microsoft übernimmt die Bereitstellung der benötigten Modellartefakte und Container.

Damit kann ein Szenario realisiert werden, in dem die eigentliche Produktionsumgebung keinen direkten Outbound-Zugriff auf Hugging Face benötigt.

Und genau an dieser Stelle wird das Thema auch für Enterprise-Architekturen interessant.

Denn in vielen Unternehmen lautet die Vorgabe nicht:

„Das Modell muss Open Source sein.“

Sondern:

„Die Produktionsumgebung darf möglichst wenig oder gar keinen unkontrollierten Internetzugriff haben.“

Wenn ich dann trotzdem Open-Source-Modelle verwenden kann, ohne den gesamten Betrieb selbst aufbauen zu müssen, wird daraus eine ziemlich interessante Kombination.

---

## Für Entwickler bleibt die Schnittstelle relativ vertraut

Eine weitere Sache gefällt mir an dem Ansatz.

Managed Compute versucht nicht, eine komplett neue Welt neben Microsoft Foundry aufzubauen.

Die Bereitstellungen werden in Foundry integriert.

Das bedeutet, dass ich weiterhin mit den bekannten Konzepten von Projekten, Authentifizierung, Endpunkten und Observability arbeiten kann.

Bei vielen der unterstützten Runtimes gibt es außerdem eine OpenAI-kompatible API.

Das ist für Entwickler ausgesprochen praktisch.

Denn wenn meine Anwendung ohnehin mit dem OpenAI SDK arbeitet, kann ich ein entsprechendes Managed-Compute-Modell ansprechen, ohne meine komplette Anwendung auf eine vollkommen neue Schnittstelle umstellen zu müssen.

Und genau hier zeigt sich meiner Meinung nach eine Entwicklung, die wir in den kommenden Jahren noch häufiger sehen werden:

**Das Modell wird zunehmend austauschbar.**

Meine Anwendung muss irgendwann nicht mehr unbedingt wissen, ob hinter dem Endpoint GPT, Qwen, Llama oder ein anderes Modell steckt.

Sie braucht einfach ein Modell, das eine bestimmte Aufgabe mit einer bestimmten Qualität und Geschwindigkeit erledigt.

---

## Das wird insbesondere für Agenten interessant

Und spätestens beim Thema Agents wird das Ganze noch interessanter.

Denn ein Agent ist letztlich nicht nur ein Modell.

Er benötigt ein Modell, Tools, Daten, Memory, möglicherweise RAG und eine ganze Reihe weiterer Komponenten.

Wenn ich dabei mein Modell austauschen kann, ohne meine komplette Agent-Architektur neu bauen zu müssen, bekomme ich eine ganz andere Flexibilität.

Microsoft ermöglicht es, kompatible Managed-Compute-Modelle in Foundry Agent-Szenarien einzubinden.

Damit entsteht eine Kombination, die ich persönlich ziemlich spannend finde:

**Open-Source-Modell + Managed GPU-Infrastruktur + Foundry Agents.**

Das könnte gerade für Unternehmen interessant werden, die nicht ausschließlich auf die Modelle eines einzelnen Anbieters setzen möchten.

---

# Und dann wäre da noch das Thema Skalierung

Bis hierhin klingt das alles ziemlich gut.

Aber ein Modell zu starten ist nur die halbe Miete.

Was passiert, wenn plötzlich mehr Benutzer kommen?

Auch hier versucht Managed Compute, die Komplexität zu reduzieren.

Statt selbst neue GPU-Server bereitzustellen, wird die Anzahl der Modellinstanzen erhöht.

Damit kann die verfügbare Kapazität des Modells skaliert werden.

Und auch hier finde ich die Abstraktion sinnvoll.

Ich denke nicht:

„Ich brauche jetzt noch eine H100-VM.“

Ich denke:

„Meine Anwendung benötigt mehr Modellkapazität.“

Das ist eigentlich genau das, was ein Managed Service tun sollte.

Er sollte mich möglichst weit von der darunterliegenden Infrastruktur entfernen.

---

# Aber jetzt kommen wir zum wichtigsten Punkt: Geld

Und hier würde ich wirklich aufpassen.

Denn nur weil etwas „Managed Compute“ heißt, bedeutet das nicht automatisch, dass es günstig ist.

Im Gegenteil.

Wir sprechen über High-End-GPUs.

Und diese GPUs werden bei Managed Compute stundenbasiert abgerechnet.

Das unterscheidet sich fundamental von einem klassischen tokenbasierten Managed Model.

Wenn ich GPT oder ein anderes klassisches Managed Model verwende, bezahle ich im Wesentlichen für die Nutzung.

Wenn ich dagegen Managed Compute verwende, reserviere beziehungsweise betreibe ich dedizierte GPU-Kapazität.

Und diese GPU kostet Geld.

Auch dann, wenn gerade niemand mit meinem Modell spricht.

Das ist ein Punkt, den man meiner Meinung nach bei der ganzen Begeisterung für Open-Source-KI nicht vergessen sollte.

---

## Managed Compute ist deshalb nicht automatisch die günstigere Lösung

Das ist für mich sogar einer der wichtigsten Punkte des gesamten Themas.

Wenn ich einen kleinen Chatbot betreibe und am Tag vielleicht ein paar hundert Anfragen habe, dann wäre es ziemlich unsinnig, dafür dauerhaft eine H100 laufen zu lassen.

Dann ist ein klassisches Pay-per-Token-Modell wahrscheinlich wesentlich sinnvoller.

Wenn ich dagegen einen Workload habe, bei dem mein Modell permanent stark ausgelastet ist, sieht die Rechnung ganz anders aus.

Dann kann dedizierte GPU-Kapazität durchaus sinnvoll sein.

Und genau deshalb würde ich Managed Compute niemals isoliert betrachten.

Ich würde immer mindestens drei Varianten miteinander vergleichen.

Die erste ist ein klassisches Managed Model mit tokenbasierter Abrechnung.

Die zweite ist Managed Compute mit dedizierter GPU-Kapazität.

Und die dritte ist eine eigene Infrastruktur.

Bei der eigenen Infrastruktur darf man dann allerdings nicht nur den Kaufpreis der GPU betrachten.

Da gehören Strom, Kühlung, Hardwareausfälle, Ersatzteile, Administration, Updates und natürlich auch die Abschreibung dazu.

Eine eigene H100 ist schließlich nicht kostenlos, nur weil sie irgendwann einmal bezahlt wurde.

---

# Für wen ist Managed Compute also wirklich interessant?

Ich glaube nicht, dass Managed Compute für jeden Entwickler gedacht ist.

Wenn ich einfach nur einen kleinen KI-Chatbot bauen möchte, würde ich wahrscheinlich zunächst ein klassisches Managed Model verwenden.

Wenn ich dagegen ein bestimmtes Open-Source-Modell benötige, sieht die Situation schon anders aus.

Noch interessanter wird es, wenn dieses Modell dauerhaft hohe Last erzeugt und ich gleichzeitig keine eigene GPU-Infrastruktur betreiben möchte.

Und dann gibt es noch einen dritten Punkt:

**Unternehmen.**

Für ein Unternehmen kann es einen enormen Unterschied machen, ob ich sage:

„Wir betreiben einen Kubernetes-Cluster mit mehreren GPU-Nodes und kümmern uns selbst um die komplette Inferenz-Infrastruktur.“

oder:

„Wir verwenden Microsoft Foundry Managed Compute.“

Das sind zwei vollkommen unterschiedliche Betriebsmodelle.

---

# Aber Managed Compute hat auch Grenzen

So interessant das Ganze ist, man sollte nicht vergessen, dass Managed Compute derzeit noch als **Preview** angeboten wird.

Und genau deshalb würde ich aktuell nicht einfach hingehen und sagen:

„Das ist jetzt unsere neue Produktionsplattform.“

Microsoft weist selbst darauf hin, dass für die Preview kein SLA gilt und sich Funktionen, Verfügbarkeit und Rahmenbedingungen noch verändern können.

Auch die regionale Verfügbarkeit ist ein Thema.

Und natürlich gibt es Quotas.

Managed Compute besitzt eigene Kapazitätsgrenzen und diese sind nicht einfach identisch mit den normalen Azure-VM-Quotas.

Das kann bei größeren Deployments durchaus relevant werden.

---

# Auch beim Thema Content Safety sollte man genau hinschauen

Ein weiterer Punkt, den ich nicht unterschlagen würde, betrifft Content Safety.

Nur weil ein Modell in Microsoft Foundry betrieben wird, bedeutet das nicht automatisch, dass jeder Managed-Compute-Request durch exakt dieselben integrierten Content-Safety-Mechanismen läuft wie bei anderen Foundry-Modellen.

Microsoft weist für Managed Compute darauf hin, dass die entsprechenden Azure AI Content Safety Filter derzeit nicht automatisch Bestandteil des Datenpfads sind.

Wenn ich diese Filter benötige, muss ich mich also selbst darum kümmern.

Das ist kein grundsätzliches Problem.

Aber es ist ein wichtiger Architekturpunkt.

Und genau deshalb sollte man bei Managed Compute nicht nur auf die Frage schauen:

„Kann ich mein Modell starten?“

Sondern auch:

„Welche Services und Schutzmechanismen brauche ich zusätzlich?“

---

# Ich glaube, dass Managed Compute langfristig ziemlich wichtig werden könnte

Und jetzt kommen wir zu meiner persönlichen Einschätzung.

Für mich ist Managed Compute nicht einfach nur eine weitere Möglichkeit, eine GPU in Azure zu mieten.

Der eigentlich interessante Punkt ist die Entwicklung dahinter.

Wir erleben gerade eine enorme Explosion bei Open-Source-Modellen.

Es erscheinen ständig neue Modelle, neue Quantisierungen, neue Runtimes und neue Optimierungen.

Gleichzeitig möchte aber nicht jedes Unternehmen selbst zum Betreiber einer GPU-Infrastruktur werden.

Und genau hier entsteht ein Markt.

Die Unternehmen möchten die Auswahlfreiheit von Open Source.

Sie möchten aber gleichzeitig die Einfachheit eines Managed Service.

Managed Compute versucht genau diese beiden Anforderungen zusammenzubringen.

---

# Open Source bedeutet damit nicht mehr zwangsläufig Self-Hosted

Und das ist wahrscheinlich die Aussage, die ich aus diesem gesamten Thema mitnehmen würde.

Wenn jemand vor einigen Jahren gesagt hat:

„Wir setzen auf ein Open-Source-LLM.“

war die nächste Frage häufig:

„Und wo hostet ihr das?“

Die Antwort war dann:

„Auf unseren eigenen Servern.“

Oder:

„Auf einer GPU-VM.“

Oder:

„In unserem Kubernetes-Cluster.“

Das könnte sich zunehmend ändern.

Open Source und Self-Hosted müssen nicht mehr zwingend dasselbe bedeuten.

Ich kann ein Open-Source-Modell auswählen und trotzdem einen Managed Service für dessen Infrastruktur verwenden.

Und genau diese Kombination finde ich spannend.

---

# Die GPU wird zunehmend zur Nebensache

Wenn man die Entwicklung der letzten Jahre betrachtet, ist das eigentlich eine ziemlich logische Konsequenz.

Früher haben wir über Server gesprochen.

Dann kamen virtuelle Maschinen.

Dann Container.

Dann Kubernetes.

Und heute abstrahieren wir immer stärker auch die GPU-Infrastruktur.

Der Entwickler soll irgendwann nicht mehr darüber nachdenken müssen, **welche Hardware** unter seiner Anwendung steckt.

Er soll sagen können:

„Ich brauche dieses Modell.“

„Ich brauche diese Latenz.“

„Ich brauche diese Anzahl an Requests pro Sekunde.“

„Ich brauche diese Kontextlänge.“

„Ich brauche diese Sicherheitsanforderungen.“

Und die Plattform kümmert sich um die Infrastruktur darunter.

Genau in diese Richtung geht Managed Compute.

---

# Und trotzdem würde ich nicht alles darauf setzen

Das klingt jetzt vielleicht etwas widersprüchlich.

Ich finde Managed Compute spannend.

Aber ich würde trotzdem nicht automatisch jedes Open-Source-Modell darüber betreiben.

Denn manchmal ist eine eigene VM die bessere Lösung.

Manchmal ist Kubernetes sinnvoll.

Manchmal ist eine lokale GPU sinnvoll.

Und manchmal ist ein klassisches Managed Model einfach die beste Lösung.

Das Entscheidende ist deshalb nicht:

**„Managed Compute ist besser.“**

Sondern:

**„Managed Compute ist eine weitere Abstraktionsebene, die für bestimmte Workloads sehr interessant sein kann.“**

Und genau so würde ich es momentan auch betrachten.

---

# Mein Fazit

Microsoft Foundry Managed Compute ist für mich vor allem deshalb interessant, weil Microsoft versucht, ein Problem zu lösen, das mit der zunehmenden Verbreitung von Open-Source-KI immer wichtiger wird.

Wir haben mittlerweile eine riesige Auswahl hervorragender Modelle.

Was uns häufig fehlt, ist nicht das Modell.

Was uns fehlt, ist eine einfache Möglichkeit, dieses Modell zuverlässig, sicher und skalierbar zu betreiben.

Natürlich kann ich das alles selbst machen.

Ich kann mir eine GPU-VM nehmen, Docker installieren, CUDA konfigurieren, vLLM aufsetzen, das Modell herunterladen, Netzwerk und Security konfigurieren und anschließend meine eigene Monitoring- und Skalierungsstrategie bauen.

Und wenn ich genau das machen möchte, ist das auch vollkommen in Ordnung.

Aber die entscheidende Frage ist:

**Muss ich das wirklich selbst machen?**

Wenn die Antwort darauf „Nein“ lautet, dann wird Managed Compute interessant.

Ich bekomme die Freiheit, ein Open-Source-Modell auszuwählen, ohne gleichzeitig verpflichtet zu sein, dessen komplette Infrastruktur selbst zu betreiben.

Und genau das könnte meiner Meinung nach ein ziemlich wichtiger Schritt sein.

Denn die Zukunft der KI wird wahrscheinlich nicht aus einer einzigen Modellfamilie bestehen.

Wir werden GPT verwenden.

Wir werden Claude verwenden.

Wir werden Gemini verwenden.

Wir werden Llama, Qwen, Mistral und viele andere Open-Source-Modelle verwenden.

Und wir werden je nach Aufgabe entscheiden, welches Modell am besten geeignet ist.

Die eigentliche Plattform muss deshalb zunehmend etwas anderes leisten:

**Sie muss uns die Wahl des Modells ermöglichen, ohne dass wir jedes Mal die komplette Infrastruktur neu bauen müssen.**

Genau hier sehe ich Managed Compute.

Nicht als Ersatz für jede andere Form von KI-Infrastruktur.

Aber als eine interessante Brücke zwischen zwei Welten:

**Open-Source-Modelle auf der einen Seite und Managed Cloud Infrastructure auf der anderen.**

Und wenn Microsoft es schafft, diese Kombination langfristig einfach, zuverlässig und vor allem wirtschaftlich interessant zu machen, könnte Managed Compute deutlich wichtiger werden, als es der Name zunächst vermuten lässt.

Denn am Ende möchte ich als Entwickler eigentlich nicht wissen, ob unter meinem Modell eine A100, H100 oder MI300X steckt.

Ich möchte wissen, ob mein Modell meine Aufgabe gut erledigt.

**Die GPU ist Mittel zum Zweck.**

Und vielleicht ist genau das der wichtigste Gedanke hinter Managed Compute.
