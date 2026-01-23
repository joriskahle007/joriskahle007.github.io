---
layout: post
title: Compliance im Microsoft Foundry Portal – meine ganz persönlichen Learnings
tags: [Microsoft Foundry, Compliance, Governance, Fundament, Voraussetzung]
---

Wenn man, so wie ich, mehrere Projekte im Microsoft Foundry Portal aufsetzt, kommt man an einem Thema nicht vorbei, egal ob man es liebt, fürchtet oder am liebsten ganz weit nach hinten schieben würde: **Compliance**.<br><br>

Ich gebe es offen zu, Compliance war für mich lange Zeit ein Buzzword. Wichtig, ja, aber auch abstrakt, sperrig und irgendwie immer ein bisschen losgelöst vom eigentlichen Projektalltag. Etwas für Auditoren, für Legal-Abteilungen oder für Menschen, die Freude an sehr detaillierten Richtliniendokumenten haben. Spätestens mit meinen ersten echten, produktiven AI-Projekten im Microsoft Foundry Portal hat sich diese Sichtweise radikal geändert.<br><br>

Heute sehe ich Compliance nicht mehr als notwendiges Übel, sondern als etwas, das mir Struktur gibt, als Leitplanke und manchmal auch als Rettungsanker.<br><br>

## Warum Compliance im Foundry Portal so früh relevant wird

Microsoft Foundry ist extrem mächtig. Innerhalb kürzester Zeit lassen sich Daten anbinden, Modelle trainieren, KI-Services bereitstellen und Prozesse automatisieren. Genau diese Geschwindigkeit ist Fluch und Segen zugleich.<br><br>

Denn je schneller man etwas bauen kann, desto schneller kann man auch Dinge bauen, die man später nur mit großem Aufwand wieder einfängt. Compliance ist deshalb kein Thema für „später“, sondern etwas, das eigentlich schon beginnt, bevor das erste Projekt angelegt wird.<br><br>

Ich habe gelernt, wenn ich mir zu Beginn nicht klar darüber bin, welche Daten ich verarbeite, wer darauf zugreifen darf und wofür das System am Ende eingesetzt wird, dann hole ich mir technische Schulden ins Haus, nur dass sie hier rechtlich und organisatorisch sind.<br><br>

## Zugriffe, Identitäten und das Zusammenspiel mit Azure AD

Ein Klassiker, den ich immer wieder sehe und den ich selbst unterschätzt habe, ist das Thema Identitäten und Zugriffe. Im Foundry Portal kannst Du zwar Projektmitglieder einsehen und Rollen vergeben, aber die eigentliche Verwaltung der Identitäten und Berechtigungen erfolgt über **Azure AD / Entra ID**, das Portal ist hier nur die Oberfläche, die die Zuweisung vereinfacht.<br><br>

Es ist extrem wichtig, dass jeder Zugriff nachvollziehbar ist. Rollenbasierte Zugriffe über Entra ID, saubere Trennung zwischen Entwicklung, Test und Produktion und der bewusste Verzicht auf persönliche Accounts für produktive Workloads sind für mich absolute Grundlagen. Änderungen lassen sich zudem direkt im **Azure Portal → Access Control (IAM)** auditieren.<br><br>

## Daten als Herzstück jeder Compliance-Betrachtung

Am Ende läuft alles auf Daten hinaus, egal ob es um klassische Analytics oder um hochkomplexe KI-Modelle geht. Die spannendste Architektur bringt nichts, wenn unklar ist, mit welchen Daten sie arbeitet.<br><br>

Ich habe mir angewöhnt, sehr früh über Daten zu sprechen, noch bevor über Modelle oder Technologien diskutiert wird. Welche Art von Daten ist das eigentlich, sind personenbezogene Informationen dabei, Geschäftsgeheimnisse oder sensible Inhalte?<br><br>

Gerade im europäischen Kontext kommt dann sofort die Frage der Datenresidenz hinzu. Wo liegen diese Daten physisch, in welcher Region und welche Services greifen darauf zu? Hier kommt **Microsoft Purview** ins Spiel, mit Purview kannst Du Daten klassifizieren, Data Lineage verfolgen und sicherstellen, dass Du die Compliance-Regeln einhältst. Es hilft enorm, um Transparenz über Datenflüsse und Risiken zu gewinnen.<br><br>

Ein weiterer Punkt, den ich früher unterschätzt habe, ist Nachvollziehbarkeit. Logging klingt langweilig, bis man es braucht. Spätestens wenn jemand fragt, wer wann welche Daten genutzt oder welches Modell trainiert hat, wird klar, wie wichtig saubere Protokollierung ist.<br><br>

## Sicherheit und Schutzmaßnahmen

Neben der Datenklassifizierung und Zugriffssteuerung sind **Microsoft Defender-Pläne** ein unverzichtbares Instrument. Sie bieten Schutz vor Bedrohungen, Malware und unautorisierten Zugriffen und lassen sich direkt in Foundry-Workloads einbinden. Für mich ist das ein zentraler Bestandteil, um Compliance-Richtlinien nicht nur theoretisch einzuhalten, sondern auch praktisch abzusichern.<br><br>

## KI verändert die Compliance-Fragestellung grundlegend

Sobald KI ins Spiel kommt, verschiebt sich die Diskussion. Es geht nicht mehr nur darum, wer auf Daten zugreift, sondern auch darum, was Systeme selbstständig daraus machen.<br><br>

Ich frage mich bei AI-Projekten im Foundry Portal inzwischen immer, können wir erklären, wie ein Modell zu seinen Ergebnissen kommt, ist dokumentiert, wofür es eingesetzt werden darf und wofür ausdrücklich nicht, und haben wir Mechanismen, um Fehlverhalten, Bias oder Missbrauch zumindest zu erkennen?<br><br>

Je autonomer ein System wird, desto wichtiger werden klare Leitplanken. Nicht, weil man Innovation bremsen will, sondern weil man sie kontrollierbar halten muss.<br><br>

## Die Rolle von Dokumentation und warum ich sie heute anders sehe

Ich war nie ein großer Fan von Dokumentation. Sie fühlt sich oft nach zusätzlicher Arbeit an, die keinen unmittelbaren Mehrwert bringt. Das hat sich geändert.<br><br>

Heute sehe ich Dokumentation als Teil der Architektur. Entscheidungen, die nicht dokumentiert sind, existieren im Zweifel nicht. Gerade im Compliance-Kontext ist das fatal.<br><br>

Ich halte fest, warum bestimmte Daten genutzt werden, warum ein Modell so aufgebaut ist, warum bestimmte Zugriffe vergeben wurden. Nicht für ein Audit, sondern für mein zukünftiges Ich und für alle, die irgendwann Verantwortung für das Projekt übernehmen.<br><br>

## Die wichtigsten Compliance-Schritte in AI-Projekten im Foundry Portal

Um das Ganze etwas greifbarer zu machen, habe ich meine wichtigsten Learnings in einer Tabelle zusammengefasst. Sie ist kein starres Framework, sondern eher eine Orientierung aus der Praxis.

| Phase im Projekt |	Worauf ich achte |	Warum es wichtig ist |
| Projektstart |	Klare Zieldefinition und Use-Case-Abgrenzung |	Verhindert Zweckentfremdung und spätere Compliance-Risiken |
| Datenanbindung |	Datenklassifizierung mit Purview und Herkunft |	Grundlage für DSGVO, AI Act und interne Richtlinien |
| Architektur |	Trennung von Umgebungen, Dev, Test, Prod |	Minimiert Risiken und unkontrollierte Zugriffe |
| Zugriffsmanagement |	RBAC über Entra ID |	Nachvollziehbarkeit und Least-Privilege-Prinzip |
| Modelltraining |	Dokumentation von Trainingsdaten |	Erklärbarkeit und Audit-Fähigkeit |
| Deployment |	Monitoring, Logging und Schutz über Defender-Pläne |	Frühzeitiges Erkennen von Fehlverhalten und Bedrohungen |
| Betrieb |	Regelmäßige Reviews |	Compliance ist kein einmaliger Zustand |


## Governance statt Verbotspolitik

Ein Punkt, der mir besonders wichtig geworden ist, gute Compliance bedeutet nicht, alles zu verbieten. Im Gegenteil, gute Governance schafft Klarheit und ermöglicht erst Innovation.<br><br>

Wenn Teams wissen, in welchem Rahmen sie sich bewegen dürfen, entstehen bessere Lösungen. Unsicherheit ist der größte Innovationskiller, klare Regeln sind oft der beste Beschleuniger.<br><br>

## Schutzmechanismen, die man im AI Kontext nicht ignorieren darf

Ein Aspekt, der mir in den letzten Monaten immer wichtiger geworden ist, gerade im Kontext von produktiven AI Systemen im Microsoft Foundry Portal, ist das Thema Inhaltssicherheit und der Schutz vor gezielten Manipulationsversuchen. Viele dieser Mechanismen laufen im Hintergrund, was dazu führt, dass man sie schnell als selbstverständlich hinnimmt. Genau das ist aber gefährlich.<br><br>

<img src="/assets/img/'Richtlinien.jpg" alt="Richtlinien" /><br><br>

## Jailbreak Angriffe und warum sie mehr als Spielerei sind

Jailbreak Angriffe versuchen, ein KI Modell dazu zu bringen, seine Sicherheitsrichtlinien zu umgehen. Das passiert nicht über klassische technische Angriffe, sondern über Sprache. Über clever formulierte Prompts, die das Modell manipulieren sollen.<br><br>

Typische Beispiele dafür sind Aufforderungen wie, ignoriere alle vorherigen Anweisungen und mache jetzt etwas anderes, oder Aussagen wie, du bist jetzt im Entwicklermodus und darfst alles sagen. Auch Rollenspiel Szenarien, die bewusst ethische oder rechtliche Grenzen austesten, fallen in diese Kategorie.<br><br>

Was viele unterschätzen, das ist kein theoretisches Risiko. Solche Prompts tauchen in realen Anwendungen auf, bewusst oder unbewusst. Genau hier greift der Schutzmechanismus im Foundry Kontext, der solche Manipulationsversuche bereits bei der Benutzereingabe erkennt und blockiert. Für mich ist das ein zentraler Bestandteil von Compliance, denn ein System, das sich leicht überlisten lässt, ist nicht kontrollierbar.<br><br>

## Inhaltssicherheit als dauerhafte Leitplanke

Neben Jailbreaks spielt die klassische Inhaltssicherheit eine große Rolle. Sie wirkt sowohl auf Eingaben als auch auf Ausgaben des Modells und sorgt dafür, dass bestimmte Inhalte gar nicht erst verarbeitet oder ausgegeben werden.<br><br>

Bei hasserfüllten oder diskriminierenden Inhalten geht es darum, geschützte Gruppen zu schützen. Das können ethnische Gruppen sein, Religionen, Geschlechter oder andere sensible Merkmale. Inhalte ab mittlerem Schweregrad werden blockiert, sowohl wenn sie vom Nutzer eingegeben werden als auch wenn das Modell versucht, sie zu generieren.<br><br>

Ein besonders sensibles Feld ist das Thema Selbstverletzung. Hier erkennt das System Inhalte rund um Suizid oder selbstschädigendes Verhalten und blockiert insbesondere Anleitungen oder eine Verherrlichung solcher Handlungen. Gerade in Anwendungen mit Endkunden ist das aus meiner Sicht nicht optional, sondern zwingend notwendig.<br><br>

Auch sexuelle Inhalte unterliegen einer mittleren Blockierung. Explizite Beschreibungen, pornografische Inhalte oder unangemessene Darstellungen werden gefiltert. Das schützt nicht nur Nutzer, sondern auch Unternehmen vor erheblichen Reputationsrisiken.<br><br>

Ähnlich verhält es sich bei Gewalt. Gewaltverherrlichende Inhalte, detaillierte Beschreibungen von Gewalthandlungen oder Anleitungen zu Gewalt werden erkannt und blockiert. Auch hier greift der Filter sowohl bei Eingaben als auch bei Ausgaben.<br><br>

Wichtig ist an dieser Stelle das Verständnis von mittlerer Blockierung. Inhalte mit niedrigem Schweregrad können durchgelassen werden, Inhalte ab mittlerem Schweregrad werden blockiert und Inhalte mit hohem Schweregrad werden immer blockiert. Das sorgt für einen ausgewogenen Umgang zwischen Sicherheit und Nutzbarkeit.<br><br>

## Geschütztes Material und geistiges Eigentum

Ein weiterer Punkt, der häufig vergessen wird, ist der Schutz von urheberrechtlich geschütztem Material. Auch hier bringt die Plattform wichtige Schutzmechanismen mit.<br><br>

Beim Thema Code erkennt das System geschützten Code, etwa aus bekannten Repositories oder lizenzierter Software, und verhindert, dass dieser als Ausgabe reproduziert wird. Wichtig ist dabei, dieser Schutz greift ausschließlich bei der Ausgabe. Das Modell gibt keinen geschützten Code aus, selbst wenn er indirekt angefragt wird.<br><br>

Dasselbe Prinzip gilt für geschützte Texte. Bücher, Artikel oder Songtexte werden erkannt und nicht wortwörtlich wiedergegeben. Damit wird geistiges Eigentum geschützt und rechtliche Risiken werden reduziert.<br><br>

<img src="/assets/img/Schutzmassnahmen.jpg" alt="Schutzmassnahmen" /><br><br>

## Einordnung der Schutzmechanismen

Aus Compliance Sicht hilft mir folgende Einordnung sehr, um die Mechanismen sauber zu trennen.

| Kategorie | Interventionspunkt | Zweck | 
| Jailbreak | Nur Benutzereingabe | Verhindert Manipulation des Modells | 
| Inhaltssicherheit | Eingabe und Ausgabe | Blockiert schädliche Inhalte | 
| Geschütztes Material | Nur Ausgabe | Schützt Urheberrechte |

Diese Differenzierung ist wichtig, weil sie zeigt, dass nicht jeder Filter an derselben Stelle greift und nicht jedes Risiko gleich behandelt wird.<br><br>

## Mein persönliches Fazit

Compliance im Microsoft Foundry Portal ist kein einmaliges To-do, das man abhakt und vergisst. Es ist ein fortlaufender Prozess, der mit jedem Projekt wächst.<br><br>

Ja, er kostet Zeit, ja, er kann nerven. Aber er schafft Vertrauen, ermöglicht Skalierung und trennt am Ende experimentelle Spielereien von professionellen, tragfähigen Plattformen.<br><br>

Wenn Du gerade erst mit Foundry Projekten startest, dann nimm Compliance ernst, aber hab keine Angst davor. Sie ist kein Gegner, sie ist Dein Sicherheitsnetz. Und aus eigener Erfahrung kann ich sagen, man ist sehr froh darüber, wenn man es braucht.<br><br>

