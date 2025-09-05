---
layout: post
title: Spillover in Azure OpenAI - So rettet dich PTU & Standard vor Lastspitzen
tags: [CSP, Azure, GPT, Spillover, PTU, Azure Open AI]
---

Stell dir vor, du baust eine Anwendung, die auf Azure OpenAI setzt. Mal ist die Auslastung eher gemütlich, mal schießen die Anfragen 
durch die Decke. Genau in solchen Momenten zeigt sich, ob dein Setup robust genug ist, um nicht ins Wanken zu geraten. Und genau hier 
kommt das Thema **Spillover Traffic Management** ins Spiel. Vor allem dann, wenn du Provisioned Throughput Units (PTUs) im Einsatz hast, 
lohnt sich ein genauer Blick, denn Spillover kann dir richtig Arbeit und Kopfschmerzen ersparen.<br>

## Provisioned vs. Standard – was steckt wirklich dahinter?

Um zu verstehen, warum Spillover so praktisch ist, lass uns kurz einen Schritt zurückgehen und die zwei Modelle anschauen, die es bei Azure OpenAI gibt.<br>

**Provisioned Throughput Units (PTUs)** sind wie ein reservierter Tisch im Restaurant. Egal, wie voll es ist – dein Platz ist sicher. Du 
buchst dir also eine feste Kapazität, die dir garantiert zur Verfügung steht. Dafür zahlst du pro Stunde, egal ob du sie komplett nutzt 
oder nicht. Der Vorteil liegt auf der Hand: du weißt genau, dass deine Anwendung im Rahmen dieser Kapazität zuverlässig läuft. Kein Zittern, 
keine Warteschlangen – solange du die Grenze deiner gebuchten PTUs nicht überschreitest.<br><br>

Auf der anderen Seite steht das **Standard-Modell**, das nach dem Pay-as-you-go-Prinzip funktioniert. Hier zahlst du nur das, was du tatsächlich 
verbrauchst. Klingt erstmal super attraktiv, weil es so flexibel ist. Aber: Es gibt keine Garantie, dass deine Anfrage sofort verarbeitet wird. 
Wenn gerade viel los ist und die Nachfrage bei Azure OpenAI steigt, kann es passieren, dass du auf die Nase fällst – mit Fehlern wie „Too Many 
Requests“. Für weniger kritische Anwendungen kann das okay sein, aber wenn du auf Verlässlichkeit angewiesen bist, ist das riskant.<br><br>

Kurz gefasst: PTU bedeutet **Sicherheit und Planbarkeit**, Standard bedeutet **Flexibilität und unklare Performance**.<br><br>

## Warum Spillover so genial ist

Jetzt stell dir vor, dein PTU ist an einem geschäftigen Nachmittag plötzlich am Limit. Normalerweise würdest du für Anfragen, die darüber hinausgehen, 
nur noch Fehlermeldungen zurückbekommen. Das wäre fatal – gerade dann, wenn du es dir am wenigsten leisten kannst. Niemand will, dass Kund:innen in 
diesem Moment eine Fehlermeldung sehen.<br><br>

Und hier setzt Spillover an. Spillover sorgt nämlich dafür, dass überschüssige Anfragen nicht einfach abgelehnt werden. Stattdessen werden sie 
automatisch an eine Standard-Bereitstellung weitergereicht. Deine Anwendung kann also weiterlaufen, auch wenn deine reservierte PTU-Kapazität 
gerade erschöpft ist. Aus Anwendersicht gibt es dadurch im besten Fall gar keinen spürbaren Unterschied – die Antwort kommt einfach trotzdem.<br><br>

Der Clou dabei: Du kombinierst die Sicherheit deiner PTUs mit der Flexibilität des Standard-Modells. So hast du ein Setup, das zuverlässig durchhält 
und gleichzeitig flexibel genug ist, um Spitzenlasten abzufangen, ohne dass du dafür unnötig viele PTUs dauerhaft buchen musst.<br><br>

## Wie du Spillover aktivierst

Damit Spillover funktioniert, brauchst du mindestens zwei Deployments: eines auf PTU-Basis und eines im Standard-Modell. Beide müssen in derselben 
Ressource liegen und möglichst gleich konfiguriert sein – damit die Umleitung reibungslos klappt.<br><br>

**Es gibt zwei Wege, wie du Spillover aktivierst:**

1.) **Globale Einstellung fürs Deployment**: Du kannst direkt in deinem PTU-Deployment angeben, welches Standard-Deployment als Fallback dienen soll. 
Das geht über die Eigenschaft spilloverDeploymentName. Damit entscheidest du quasi auf oberster Ebene: „Wenn es eng wird, leite bitte alle überflüssigen 
Anfragen nach Standard-Deployment XY um.“<br><br>

2.) **Feinsteuerung pro Anfrage**: Falls du nicht alles global umleiten möchtest, kannst du es auch im Request selbst angeben. Dafür setzt du den 
HTTP-Header x-ms-spillover-deployment. Das gibt dir maximale Kontrolle, weil du sehr spezifisch bestimmen kannst, welche Anfragen weitergeleitet 
werden dürfen und welche nicht.<br><br>

Falls du dich jetzt fragst, was passiert, wenn du beide Methoden nutzt: Die globale Einstellung hat Vorrang. Sie überstimmt also alles, was du im Request-Header setzt.<br><br>

## Wann wird Spillover aktiv?

Spillover ist kein Dauerbetrieb. Es springt nur dann an, wenn es wirklich gebraucht wird. Das heißt: Solange dein PTU freie Kapazität hat, 
werden alle Anfragen dort abgearbeitet. Erst wenn deine PTU überlastet ist und Fehler wie 429 Too Many Requests entstehen würden, greift 
das Spillover und schickt die Anfrage an die Standard-Bereitstellung.<br><br>

Das bedeutet auch: Es kann minimal länger dauern, weil zuerst versucht wird, die Anfrage über dein PTU-Deployment zu verarbeiten, bevor 
sie ins Standard-Deployment übergeht. Aber im Großen und Ganzen ist das ein sehr fairer Deal: Lieber eine kleine Verzögerung als ein harter Fehler.<br><br>

## Monitoring und Kosten – keine Überraschungen bitte!

Natürlich willst du wissen, was im Hintergrund passiert. Vor allem willst du verstehen, wie oft deine Anfragen wirklich im Spillover landen. 
Dafür kannst du **Azure Monitor** nutzen. Dort findest du Metriken, die dir genau zeigen, was los ist.<br><br>

Du kannst zum Beispiel nach Deployment-Namen oder Statuscodes filtern. So erkennst du, wie viele Anfragen regulär beantwortet wurden und wie 
viele umgeleitet wurden. Es gibt sogar ein spezielles Feld <u>IsSpillover</u>, das dir explizit sagt: „Ja, diese Anfrage wurde weitergeleitet.“<br><br>

Das ist extrem hilfreich, weil du damit abschätzen kannst, ob deine gebuchte PTU-Kapazität überhaupt noch passt oder ob deine Standard-Deployments 
mittlerweile heimlich die Hauptlast tragen. Im schlimmsten Fall zahlst du also für PTUs, die gar nicht ausreichend genutzt werden, während du 
gleichzeitig im Standard zusätzliche Kosten verursachst. Das Monitoring gibt dir die Transparenz, die du brauchst, um klug nachzusteuern.<br><br>

Und was die Kosten angeht: Die Rechnung ist einfach.

- Alles, was im PTU abgearbeitet wird, ist mit deinen fixen Stundensätzen abgegolten. Keine Überraschungen.<br><br>
- Alles, was ins Standard umgeleitet wird, wird nach Tokens abgerechnet. Klassisches Pay-as-you-go also.<br><br>

So hast du beides: die Sicherheit der Fixkosten und die Flexibilität, wenn es mal drüber hinausgeht. Aber du musst genau hinschauen, dass die Balance stimmt.<br><br>

## Fazit – Spillover als Gamechanger

Am Ende lässt sich sagen: Spillover ist wie ein Sicherheitsnetz für deine Azure OpenAI Deployments. Mit PTUs stellst du sicher, dass dein System auch 
bei hoher Last stabil bleibt. Aber weil Lasten selten immer gleichbleiben, sondern eher schwanken, ist es unsinnig, dauerhaft zu viel PTU-Kapazität 
vorzuhalten. Das würde unnötig Geld verbrennen. Stattdessen kombinierst du die garantierte Power der PTUs mit der Flexibilität des Standard-Modells. 
Und genau das macht Spillover so wertvoll.<br><br>

Du kannst deine Basisleistung perfekt planen und gleichzeitig entspannt Peaks abfangen. Das Ergebnis: stabile Systeme, zufriedene User und Kosten, die du jederzeit im Griff hast.<br><br>

Wenn du also mit Azure OpenAI ernsthaft arbeiten willst – egal ob in einem kleinen Projekt oder im großen Produktionsbetrieb – solltest du Spillover 
unbedingt einplanen. Es macht dein Setup nicht nur zuverlässiger, sondern auch deutlich flexibler. Und am Ende ersparst du dir damit eine Menge Stress 
und schaffst dir die Freiheit, dich auf die eigentlichen Inhalte deiner Anwendung zu konzentrieren.<br><br>
