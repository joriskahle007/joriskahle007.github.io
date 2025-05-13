---
layout: post
title: Erste Schritte mit Azure AI Foundry – So legst Du los
tags: [CSP, Azure, Azure AI Foundry]
---

Du möchtest mit **Azure AI Foundry** durchstarten und eigene generative KI-Lösungen entwickeln? Gute Entscheidung! Foundry ist ein mächtiges Tool – aber gerade am Anfang kann es etwas überwältigend wirken. Deshalb bekommst Du hier einen klaren Überblick, **was Du brauchst, wie Du loslegst und welche Schritte sinnvoll sind**, um direkt produktiv zu werden.

## Was brauchst Du, um mit Azure AI Foundry zu starten?
Bevor Du loslegen kannst, solltest Du Folgendes bereithalten:

### 1. Ein Azure-Abonnement
→ Falls Du noch keines hast, kannst Du ein kostenloses Test-Abo unter azure.microsoft.com erstellen.

### 2. Zugriff auf Azure AI Foundry (Preview oder GA)
→ Foundry ist derzeit in vielen Regionen als Preview oder GA verfügbar. Stelle sicher, dass es in Deinem Azure Tenant aktiviert ist. (Wenn Du Dir nicht sicher bist: Frag Deinen Azure Admin oder schau im Azure-Portal unter "AI Services".)

### 3. Ein technisches Grundverständnis
→ Du brauchst nicht unbedingt Data-Science-Expertise, aber ein Grundverständnis für:

- Azure-Ressourcen (z. B. Ressourcengruppen, Workspaces)
- KI/ML-Konzepte (z. B. Foundation Models, Pipelines, Endpunkte)
- Ein wenig CLI oder Python hilft ebenfalls

## So startest Du Schritt für Schritt
### 1. Lege Deinen Azure AI Foundry Workspace an
- Melde Dich im Azure-Portal an.
- Wähle die Region, in der Du arbeiten möchtest (z. B. „West Europe“).
- leg eine Ressourcegruppe an
- Suche nach “Azure Open AI”.
- Klicke auf “Erstellen”.
- Wechsel ins <a href://https://ai.azure.com/>Azure AI Foundry Portal</a>
- Deploye das gewünschten LLM (z.B. GPT4.1, Llama).

**Tipp: Wenn Du im Unternehmen arbeitest, solltest Du vorab mit dem IT-Team klären, welche Governance-Richtlinien gelten.**

### 2. Wähle Dein Foundation Model
Du hast mehrere Möglichkeiten, mit Modellen zu arbeiten:

- Nutze **Open-Source-Modelle** wie LLaMA, Mistral oder Falcon – direkt in der Foundry.
- Binde **kommerzielle APIs** wie GPT-4, Claude oder andere Anbieter ein.
- Lade eigene Modelle hoch oder trainiere sie weiter (z. B. Finetuning).

In der Foundry kannst Du per UI oder API auswählen, welches Modell Du wie verwenden willst.

### 3. Bereite Deine Daten vor
Daten sind der Schlüssel zu jeder KI-Anwendung. Du kannst:

- Datenquellen anbinden (z. B. Blob Storage, Azure Data Lake, SQL)
- Daten in Formate bringen, die für die Modellverarbeitung geeignet sind
- Sogenannte **“Data Recipes”** nutzen, um automatisch zu bereinigen und zu transformieren

**Tipp: Foundry unterstützt Versionierung und Daten-Governance – nutze das, um sauber zu arbeiten.**

### 4. Baue Deine Pipeline
Jetzt wird es spannend! Du erstellst einen Workflow – entweder:

- **Über die visuelle Oberfläche (UI**): Drag & Drop von Komponenten
- **Oder per Code (Python SDK, CLI oder YAML)**

Dein Workflow kann z. B. so aussehen:

1.) Daten laden
2.) Modell vorbereiten / Finetuning
3.) Evaluieren
4.) Inference-Endpunkt bereitstellen
5.) Monitoring aktivieren

### 5. Teste und veröffentliche Dein Modell
Wenn Dein Modell gut performt:

- Erstelle einen **Endpoint**, über den Du Deine Anwendung ansprechen kannst (z. B. für ein internes Tool oder eine Web-App).
- Teste die Integration (REST API oder SDK).
- Überwache das Modell im Betrieb (Performance, Kosten, Fairness etc.).

**Tipp: Du kannst Dashboards und Alerts direkt in Azure erstellen – für maximale Kontrolle.**

## Zusammenfassung: Dein Weg in Azure AI Foundry
| Schritt |	Was Du machst |
|1. Setup |	Azure-Konto + Foundry-Workspace erstellen |
|2. Modellwahl |	Foundation Model auswählen oder hochladen |
|3. Daten	Daten | importieren, vorbereiten, versionieren |
|4. Workflow |	Pipeline bauen – visuell oder per Code |
|5. Deployment |	Modell bereitstellen und testen |
|6. Monitoring |	Nutzung überwachen, optimieren, skalieren |
