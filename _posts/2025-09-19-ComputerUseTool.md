---
layout: post
title: Das Computer Use Tool – ein Durchbruch für die Automatisierung
tags: [CSP, Azure, GPT, Computer Use Tool, Azure Open AI, Azure AI Foundry]
---

Stell dir vor, dein Computer ‒ dein Bildschirm, deine Maus, deine Tastatur ‒ könnte sprechen. Also: Nicht im Sinne eines sprechenden PC-Geists, aber fast so. Wenn du sagst: „Hey, überprüfe die neuesten Fehlermeldungen im Dashboard, öffne das Ticket-Tool, trag die Daten ein, und schicke den Bericht raus“ ‒ und das passiert alles automatisch. Ohne dass du manuell klickst, kopierst oder zwischen Apps wechselst. Genau das bringt Microsofts neues **Computer Use Tool (Preview)** im Azure AI Foundry Agent Service mit sich.

Bislang war Automatisierung oft sehr auf APIs, Skripts oder definierte Schnittstellen beschränkt. Wenn die Oberfläche anders aussieht, ein Button woanders ist, wenn es ein Popup gibt – dann klemmt alles. Dieses Tool lernt dagegen visuell mit. Es schaut sich an, was auf dem Bildschirm passiert (via Screenshot), erkennt Buttons, Felder, versteht wenn sich etwas verschiebt — und reagiert. Es hält nicht einfach an, wenn etwas anders ist, sondern passt sich an.<br><br>

## Was kann das Tool genau?

Das Computer Use Tool ist wie ein digitaler Assistent, der versteht, was du willst, in normaler Sprache. Du sagst: „Mach das Fenster auf, klick hier, gib das ein, speichere das“ – und der Agent macht es. Egal ob du eine Webseite oder eine Desktop-Anwendung nutzt. Er kann durch mehrere Seiten navigieren, Formulare ausfüllen, Knöpfe drücken – so wie ein Mensch. Aber deutlich schneller, konstant verfügbar, ohne Kaffee-Pause.

Eine ziemlich große Änderung: Statt ständiger Entwicklerarbeit, wenn irgendwas visuell verändert wird, übernimmt der Agent viele Routineaufgaben selbst. Und diese Routine­aufgaben kosten viel Zeit und Nerven – heute noch klicken wir uns durch zig Fenster, Programme, vergessen mal ‘nen Schritt, Tippfehler, etc. Das neue Tool will das deutlich reduzieren.<br><br>

## Wo ist das Tool verfügbar & wie bekommt man Zugriff

Damit das Ganze funktioniert, gibt's ein paar Voraussetzungen und Einschränkungen. Wichtig zu wissen:

**- Regionen, in denen das Tool gerade läuft**: East US 2, Sweden Central und South India. Wenn du also z. B. in Europa bist und deine Subscription nicht in einer dieser Regionen liegt, musst du womöglich in eine unterstützte Region ausweichen. 
**- Zugangsregel**: Es handelt sich um eine Preview („Vorschau“) – das heißt, man muss sich anmelden bzw. Zugriff beantragen. Microsoft prüft Anträge und entscheidet, ob Kunden berechtigt sind. Das Formular hierzu finde ihc hier: <a href src="https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNUhSVEpaRDJaNkVBVFVIWFJCNDBHQ1Y4OSQlQCN0PWcu</a>
**- Technisch**: Du brauchst eine Azure AI Foundry Ressource mit Deployment des „computer-use-preview“ Modells. Man spricht mit der Responses API. Dein Code gibt Anweisungen, Screenshots kommen zurück, der Agent erkennt Statusänderungen und fährt fort. 

## Unterschiede zu klassischer Automation und Browser Scripts<br><br>

Wenn man bisher Browser Automation Tools genutzt hat, war oft so: du sagst, „der Button im DOM heißt xyz“, du greifst direkt über HTML-Elemente zu. Aber sobald das Layout oder Klassen anders sind, funktioniert das nicht mehr.

Das Computer Use Tool ist anders. Es arbeitet mit **Screenshots („Pixeldaten“) und visueller Rückmeldung**. Nicht nur mit DOM. Außerdem kannst du Aufgaben über mehrere Anwendungen hinweg laufen lassen, nicht nur innerhalb eines Browsers. Es ist also robuster gegen Veränderungen und flexibler. <br><br>

## Ein Beispiel:

Unser Bot soll uns folgende Frage beantworten: **Welche Azure-Region unterstützt das Computer Use Preview Modell im Azure OpenAI?**

<img src="/assets/img/computeruse01.jpg" alt="ComputerUse" /><br><br>

Nach der Eingabe der Frage erstellt der Agent automatisch einen Screenshot und erkennt, dass er dafür den Browser nutzen muss. Im nächsten Schritt trägt er die Fragestellung selbstständig in das Suchfeld von Microsoft Bing ein und startet die Suche. Anschließend klickt er sich automatisiert durch die Ergebnisseite, öffnet die passende Quelle und navigiert dort gezielt weiter, bis er die gewünschte Information gefunden hat. Am Ende präsentiert er genau die Antwort, nach der wir ursprünglich gefragt hatten.

<img src="/assets/img/computeruse02.jpg" alt="ComputerUse" /><br>
<img src="/assets/img/computeruse03.jpg" alt="ComputerUse" /><br>
<img src="/assets/img/computeruse04.jpg" alt="ComputerUse" /><br>

Jetzt könnte man natürlich einwenden: „Warum stelle ich die Frage nicht einfach direkt einem GPT-Modell und bekomme die Antwort sofort?“ – und ja, die Überlegung ist absolut berechtigt. Der Sinn des Beispiels liegt jedoch nicht in der Effizienz, sondern in der Demonstration: Es zeigt, welche Möglichkeiten durch diese neue Art der Automatisierung entstehen. Der Agent interagiert nicht nur mit Wissen, das er selbst schon hat, sondern kann eigenständig auf externe Systeme zugreifen, sich durch Webseiten bewegen und Informationen so beschaffen, wie es ein Mensch auch tun würde.<br><br>


## Preis & Kostenüberblick

Leider gibt es aktuell keine **klar veröffentlichten Preise** speziell für das „computer-use-preview“ Modell (Input/Output-Tokens) auf den öffentlichen Microsoft-Preis‐Seiten, jedenfalls nicht, was ich gefunden habe. 

Was wir wissen:

- Azure AI Foundry selbst ist “kostenfrei, um es zu erkunden”. Aber: **jede Funktion**, jedes Modell, jedes Tool das du nutzt, wird separat abgerechnet. 
- Das heißt: Wenn du das computer-use-preview Model nutzt, zahlst wahrscheinlich für die Tokens, sowie für die compute Ressourcen, Screenshots etc. – ähnlich wie bei anderen AI/Agent Modellen.
- Man sollte sich auf einen Kostenblock einstellen, der bei Routine-Nutzung je nach Komplexität und Nutzung mehrere hundert Euro pro Monat erreichen kann – wenn viele Aktionen, viele Screenshots, viele Anwendungen beteiligt sind.

## Warum das unser Arbeitsleben verändern könnte

Ehrlich gesagt: Ich finde, das könnte wirklich ein Gamechanger sein. Nicht übertrieben – sondern in dem Sinne, dass viele Aufgaben, die wir heute **langsam, repetitiv und fehleranfällig** erledigen, einfach automatisiert werden können. Stell dir Support-Teams vor, die nicht mehr zwischen fünf Tools hin-und-her wechseln, um Daten zusammenzutragen; Buchhaltung, wo man Daten aus PDFs oder alten Systemen manuell eingibt – all das könnte mit so einem Agenten deutlich sauberer und schneller laufen.

Der nette Teil: Der Agent ist nie müde, nie offline, vergisst nicht, freundlich zu sein. Er macht keinen Unterschied, wie oft du ihn nutzt, er bleibt genau so performant wie beim ersten Task. Das schafft nicht nur Effizienz, sondern auch Konsistenz: gleiche Qualität, weniger „na, heute mal weniger Konzentration“.

Und: Service Abteilungen, Helpdesks, interne Wissenszentren – alle werden profitieren. Weil der Bot einfache Fragen sofort beantworten kann, Dokumentenrecherche automatisieren, Workflows starten und überwachen kann. Dadurch sparen Unternehmen langfristig nicht nur Personalkosten, sondern auch Zeit – und gewinnen Kapazitäten für kreative, strategische Arbeit.

## Fazit: Eine neue Ära der Automatisierung

Das Computer Use Tool ist mehr als nur ein zusätzliches Feature. Es ist ein Meilenstein auf dem Weg zur KI, die nicht nur denkt, sondern auch handelt. Für viele Unternehmen bedeutet das, dass sie ihre Prozesse endlich durchgängig automatisieren können – auch dort, wo bisher technische Barrieren bestanden.

Wer diese Technologie früh einsetzt, verschafft sich klare Vorteile: weniger Kosten, mehr Effizienz und zufriedenere Mitarbeiter. Man darf ohne Übertreibung sagen: Wir stehen hier am Beginn einer neuen Automatisierungsära, die die Arbeitswelt in den nächsten Jahren stark prägen wird.
