---
layout: post
title: Circus
img: "assets/img/portfolio/chat.png"
date: September 2014
tags: [ChatBot, Azure Open AI, GPT 4o Realtime, RAG ,Fabric]
---

![image]({{ page.img | relative_url }})

Wer sich mit den Lizenzmodellen von Microsoft auseinandersetzt, merkt ziemlich schnell: spannend klingt anders. Oft wirken die Regelwerke trocken, kompliziert und nicht immer eindeutig. Besonders dann, wenn verschiedene Lizenzmodelle ineinandergreifen, kann man sich leicht in Details verlieren. Unterschiedliche Auslegungen einzelner Passagen machen die Sache nicht leichter – und ohne jahrelange Erfahrung oder direkten Draht zum Hersteller stößt man hier schnell an Grenzen. Klassische Modelle wie Open Value, Select, MPSA oder die bekannten Enterprise Agreements sind vielen zwar ein Begriff, wirken aber in Zeiten von Cloud und Flexibilität schon fast wie Relikte. Microsoft selbst steuert daher klar in Richtung Zukunft: Das CSP-Modell soll langfristig das bunte Lizenz-Wirrwarr ablösen.

Ein Sonderfall ist allerdings das SPLA-Modell (Service Provider Licensing Agreement). Hier übernimmt nicht der Endkunde die Rolle des Lizenznehmers, sondern der Service Provider selbst – mit dem besonderen Recht, diese Lizenzen an Endkunden weiterzuvermieten. Gerade in diesem Bereich fehlt es inzwischen an Experten, die die Feinheiten wirklich durchdringen. Und doch stehen zahlreiche Service Provider vor genau diesen lizenzrechtlichen Herausforderungen, bei denen fundiertes Fachwissen unerlässlich ist.

Genau hier setzte meine Idee an: Inspiriert durch ein Video von Pamela Fox im Microsoft Reactor wollte ich ausprobieren, ob sich die neuen Möglichkeiten von gpt-4o Realtime mit einer RAG-Lösung (Retrieval Augmented Generation) kombinieren lassen, um einen Sprach-basierten Lizenz-Bot zu entwickeln, der Service Providern direkt und zuverlässig helfen kann. Statt das Rad neu zu erfinden, griff ich dabei auf ein vorhandenes Repository zurück:👉 <a href="https://github.com/Azure-Samples/aisearch-openai-rag-audio" target="_blank" rel="noopener">github.com/Azure-Samples/aisearch-openai-rag-audio</a>.

<img src="/assets/img/portfolio/aisearchgithub.jpg" alt="Azure AI Search RAG Audio" />

Mit GitHub Codespaces habe ich die App per Script in meiner Azure Subscription deployed und gehofft, dass alles funktioniert. Als Datengrundlage legte ich zunächst einen Blob Storage an, lud die relevanten Lizenzdokumente hoch, passte das Frontend etwas an – und schon schien der Bot betriebsbereit. Dachte ich zumindest.

Die Ernüchterung kam schnell: Die Antworten waren unpräzise, teilweise schlicht falsch. Denn im SPLA-Modell sind die Lizenzrechte klar in den sogenannten SPUR (Service Provider Use Rights) definiert, die Microsoft online bereitstellt. Ich hatte die Inhalte zwar in Word-Dateien kopiert und hochgeladen – inklusive offizieller Vertragsdokumente – aber das Modell fing trotzdem an zu halluzinieren und falsche Antworten als korrekt zu verkaufen.

Damit wurde mir eines klar: Die Qualität der Daten ist in solchen Szenarien absolut entscheidend. Also ging ich einen Schritt weiter. Statt nur die Originalunterlagen hochzuladen, begann ich, die Lizenzierungen selbst in meinen Worten niederzuschreiben – so, wie ich sie täglich am Telefon unseren SPLA-Partnern erkläre. Je präziser und detaillierter ich die Informationen formulierte, desto verlässlicher wurden auch die Antworten des Bots. Damit war der SPLA-Lizenzbot geboren und bereit für erste Tests.

Die nächste Herausforderung wartete jedoch schon: Statt den Blob Storage zu nutzen, wollte ich die Datenhaltung auf Microsoft Fabric umstellen. Nicht nur, weil Microsoft selbst massiv auf Fabric setzt, sondern auch, weil ich meine eigene Expertise in diesem Umfeld erweitern wollte. Also richtete ich mir einen Data Lake in Fabric ein, lud erneut die relevanten Dokumente hoch und passte die Konfiguration im Azure AI Search Service so an, dass nicht mehr der Blob Storage, sondern der Data Lake indexiert wurde. Mit ein paar zusätzlichen Rechtevergaben in Fabric war die Verknüpfung schnell hergestellt – und der Lizenzbot lief nun auf einer zukunftsweisenden Datenplattform.

