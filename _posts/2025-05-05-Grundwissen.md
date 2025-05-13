---
layout: post
title: Grundwissen: GPT, Token, PTUs & Prompts – was Du verstehen solltest, bevor Du loslegst
tags: [AI, Voraussetzungen]
---

Bevor Du Dich in Azure AI Foundry, Azure OpenAI oder generell in generative KI stürzt, ist es hilfreich, wenn Du ein paar grundlegende Begriffe verstehst. Viele davon begegnen Dir ständig – z. B. in der Kostenberechnung oder beim Umgang mit Modellen wie GPT-4.

Hier kommt Dein Mini-Crashkurs. 👇

## Was ist GPT überhaupt?
**GPT** steht für **Generative Pre-trained Transformer**. Es ist ein Sprachmodell, das:

- mit riesigen Mengen an Text vortrainiert wurde
- Sprache versteht und erzeugt (Text, Code, E-Mails, Zusammenfassungen etc.)
- mit sog. *Prompts* gesteuert wird – also Texteingaben, mit denen Du dem Modell sagst, was es tun soll

Modelle wie *GPT-4*, *GPT-3.5*, oder *GPT-4 Turbo* sind Varianten dieses Prinzips – jede Version ist leistungsfähiger, schneller oder günstiger.

## Was ist ein Prompt?
Ein **Prompt** ist einfach gesagt **Dein Befehl an das Modell.**

Beispiele für Prompts:
- „Fasse diesen Text in drei Sätzen zusammen.“
- „Schreibe eine Einladung für ein Sommerfest.“
- „Welche Risiken birgt generative KI in der Medizin?“

Je besser Dein Prompt, desto präziser die Antwort – das nennt man auch **Prompt Engineering.**

## Was sind Tokens und warum sind sie wichtig?
Ein **Token** ist ein Teil eines Wortes – nicht immer ein ganzes Wort!
Token ist aber nicht gleich Toiken

| Beispiel | Wort | Token(s) |
| „Computer“ |	1 Wort |	1 Token |
| „Unvorstellbar“ |	1 Wort |	2 Tokens („Un-“, „vorstellbar“) |
| „Hello, world!“ |	2 Wörter |	4 Tokens (Hello, ,, space, world!) |

Tokens sind deshalb wichtig, weil GPT-Modelle nach Tokens abgerechnet werden – nicht nach Wörtern oder Prompts.

Beispiel:

- Du schreibst eine Eingabe mit 100 Tokens.
- GPT erzeugt eine Antwort mit 300 Tokens.
- Abgerechnet werden also 400 Tokens.

## Wie funktioniert die Abrechnung in Azure OpenAI?
Wenn Du GPT über **Azure OpenAI** nutzt (auch über Foundry eingebunden), hast Du diese Abrechnungsgrundlagen:

## Kosten nach Modell und Tokens
Du zahlst pro **1.000 Tokens**, abhängig vom Modell:

| Modell |	Prompt (Input) |	Completion (Output) |	Beispiel |
| GPT-4 Turbo |	ca. $0.01	| ca. $0.03	| pro 1.000 Tokens |
| GPT-3.5	| günstiger	| günstiger	| < $0.001 pro 1.000 Tokens |

Die **Preise können sich ändern**, darum lohnt sich ein Blick auf <a https://azure.microsoft.com/de-de/pricing/details/cognitive-services/openai-service/>Microsofts Preisseite für Azure OpenAI</a>.

## Was bedeutet Tokens per Minute (TPM)?
In Azure hast Du zusätzlich **Rate Limits:**

- **Tokens per Minute (TPM)**: Wie viele Tokens Du pro Minute senden darfst.
- **Requests per Minute (RPM)**: Wie viele Anfragen Du pro Minute stellen darfst.

Wenn Du z. B. 240.000 TPM hast, kannst Du:

- 6 Anfragen mit je 40.000 Tokens
- oder 24 Anfragen mit je 10.000 Tokens
- … pro Minute senden

Diese Limits skalieren je nach deinem **Nutzungskontingent**, und Du kannst bei Microsoft **erhöhte Quoten beantragen**, wenn Du mehr brauchst.

## Was ist eine Provisioned Throughput Unit (PTU)?
Eine **PTU** ist eine **Abrechnungseinheit in Azure OpenAI**, die Dir eine bestimmte Menge an Rechenkapazität für GPT-Modelle zusichert – ähnlich wie bei einer reservierten Bandbreite.

**Eine PTU bestimmt:**
- Wie viele **Token pro Minute (TPM)** Du verarbeiten kannst
- Welche **Modelle** (GPT-3.5, GPT-4, GPT-4 Turbo etc.) Du wie performant ansprechen kannst
- Wie hoch **verfügbar** Deine Ressourcen sind

## Was bekommst Du pro PTU?
Microsoft gibt typischerweise an:

- z. B. **1 PTU GPT-4 Turbo** = ~20 Requests/Minute mit je 8.000 Tokens (konkrete Werte können variieren)
- PTUs gelten **modellabhängig** – d. h. GPT-3.5 hat günstigere, kleinere PTUs als GPT-4 Turbo
- Du kannst **mehrere PTUs buchen**, um Kapazität zu skalieren

Diese PTUs gelten **pro Region und Deployment**, also z. B. „West Europe – GPT-4 Turbo – 2 PTUs“.

## Warum gibt es PTUs überhaupt?
Microsoft bietet mit PTUs:

- **Planbare Leistung** – Du bekommst zugesicherte Kapazität, unabhängig von Auslastung
- **Verlässliche API-Nutzung** – wichtig für produktive Anwendungen
- **Kostenkontrolle & Reservierungen** – PTUs können im Vorfeld gebucht oder bereitgestellt werden

Du kannst aber alternativ auch **Pay-as-you-go mit Shared Throughput** nutzen – allerdings ist dann Deine Performance nicht garantiert (besonders bei hoher Last).
Durch solche Optionen kann man einen ChatBot den Anforderungen des Kunden anpassen ud skalieren.
Wird er Not zu 80% mit einer Vi!!!!!!!!!!!!!!!!!!!!!!!

## Was PTU NICHT ist:
| Falsch verstandene Bedeutung	| Richtig |
| „Prompt Token Unit“	| ❌ Gibt es nicht |
| Token-Kontingent im Lizenzpaket	| ❌ Nicht direkt |
| Verbrauchsmessung pro API-Call	| ❌ Das läuft über Token-Anzahl, nicht PTUs |

## 🧠 Fazit: PTU = Durchsatz, nicht Tokens
**PTUs sind keine Maßeinheit für Tokenmengen**, sondern stehen für garantierte Leistungsfähigkeit (Throughput) Deiner Azure OpenAI Deployments.

**✅ Fazit: Was solltest Du Dir merken?**
- Du bezahlst pro verbrauchtem Token, nicht pro Prompt.
- Es gibt Limits pro Minute (Tokens/Anfragen) – die kannst Du aber skalieren.
- „PTUs“ sind eine Art Token-Paket – aber (noch) nicht überall relevant.
- Ein gutes Kostenverständnis hilft Dir, nicht böse überrascht zu werden – und effizient zu skalieren.
