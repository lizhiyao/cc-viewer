# CC-Viewer

Et Vibe Coding-værktøjssæt destilleret fra over 15 års forsknings- og udviklingserfaring i internetindustrien, bygget oven på Claude Code:

1. Kør /ultraPlan og /ultraReview lokalt, så din kode aldrig skal være fuldt eksponeret over for Claudes cloud;
2. Muliggør mobil programmering over dit lokale netværk (kan udvides af brugeren);
3. Fuld Claude Code payload-aflytning og -analyse — fremragende til logning, debugging, læring og reverse engineering;
4. Leveres med akkumulerede studienoter og praktisk erfaring (kig efter „?"-ikonerne overalt i appen), så vi kan udforske og vokse sammen;
5. Web-UI tilpasser sig enhver størrelsestilstand — læg det i browserudvidelser, OS-splitvisninger og ethvert indlejringsscenarie; en native installer er også tilgængelig.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Italiano](./README.it.md) | Dansk | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | [Türkçe](./README.tr.md) | [Українська](./README.uk.md)

## Brug

### Installation

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Programmeringstilstand

ccv er en drop-in erstatning for claude — alle argumenter sendes videre til claude, mens Web Viewer startes.

```bash
ccv                    # == claude (interactive mode)
ccv -c                 # == claude --continue (continue last conversation)
ccv -r                 # == claude --resume (resume a conversation)
ccv -p "hello"         # == claude --print "hello" (print mode)
ccv --d                # == claude --dangerously-skip-permissions (shortcut)
ccv --model opus       # == claude --model opus
```

Forfatterens mest brugte kommando er:
```
ccv -c --d             # == claude --continue --dangerously-skip-permissions
```

Efter start i programmeringstilstand åbnes en webside automatisk.

CC-Viewer leveres også som en native desktop-app — hent builden til din platform fra GitHub.
[Downloadside](https://github.com/weiesky/cc-viewer/releases)


### Logger-tilstand

Hvis du stadig foretrækker det native claude-værktøj eller VS Code-udvidelsen, skal du bruge denne tilstand.

I denne tilstand vil start af `claude` automatisk starte en logningsproces, der registrerer anmodningslogs til ~/.claude/cc-viewer/*yourproject*/date.jsonl

Aktivér logger-tilstand:
```bash
ccv -logger
```

Når konsollen ikke kan udskrive den specifikke port, er standard første port 127.0.0.1:7008. Flere instanser bruger sekventielle porte som 7009, 7010.

Afinstaller logger-tilstand:
```bash
ccv --uninstall
```

### Fejlfinding

Hvis du støder på problemer med at starte cc-viewer, er her den ultimative fejlfindingsmetode:

Trin 1: Åbn Claude Code i en hvilken som helst mappe.

Trin 2: Giv Claude Code følgende instruktion:

```
I have installed the cc-viewer npm package, but after running ccv it still doesn't work properly. Please check cc-viewer's cli.js and findcc.js, and adapt them to the local Claude Code deployment based on the specific environment. Keep the scope of changes as constrained as possible within findcc.js.
```

At lade Claude Code selv diagnosticere problemet er mere effektivt end at spørge nogen eller læse dokumentation!

Efter ovenstående instruktion er fuldført, vil `findcc.js` være opdateret. Hvis dit projekt ofte kræver lokal udrulning, eller hvis forket kode ofte skal løse installationsproblemer, kan du ved at beholde denne fil simpelthen kopiere den næste gang. På dette tidspunkt er mange projekter og virksomheder, der bruger Claude Code, ikke udrullet på Mac, men snarere på server-side hostede miljøer, så forfatteren har adskilt `findcc.js` for at gøre det lettere at spore cc-viewer kildekodeopdateringer fremover.


### Andre kommandoer

Se:

```bash
ccv -h
```

### Lydløs tilstand

Som standard kører `ccv` i lydløs tilstand, når den ombryder `claude`, hvilket holder din terminaloutput ren og konsistent med den native oplevelse. Alle logs fanges i baggrunden og kan ses på `http://localhost:7008`.

Når det er konfigureret, skal du bruge `claude`-kommandoen som normalt. Besøg `http://localhost:7008` for at få adgang til overvågningsgrænsefladen.


## Funktioner


### Programmeringstilstand

Efter start med ccv kan du se:

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/ab353a2b-f101-409d-a28c-6a4e41571ea2" />


Du kan se kode-diffs direkte efter redigering:

<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Selvom du kan åbne filer og kode manuelt, anbefales manuel kodning ikke — det er gammeldags kodning!

### Mobil programmering

Du kan endda scanne en QR-kode for at kode fra din mobile enhed:

<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Opfyld din forestilling om mobil programmering. Der er også en plugin-mekanisme — hvis du har brug for at tilpasse til dine kodevaner, så hold øje med opdateringer af plugin-hooks.


### Logger-tilstand (se komplette Claude Code-sessioner)

<img width="1500" height="768" alt="image" src="https://github.com/user-attachments/assets/a8a9f3f7-d876-4f6b-a64d-f323a05c4d21" />


- Fanger alle API-anmodninger fra Claude Code i realtid, hvilket sikrer rå tekst — ikke redigerede logs (dette er vigtigt!!!)
- Identificerer og mærker automatisk Main Agent- og Sub Agent-anmodninger (undertyper: Plan, Search, Bash)
- MainAgent-anmodninger understøtter Body Diff JSON og viser sammenklappede forskelle fra den forrige MainAgent-anmodning (kun ændrede/nye felter)
- Hver anmodning viser inline Token-brugsstatistik (input/output-tokens, cache oprettelse/læsning, hitrate)
- Kompatibel med Claude Code Router (CCR) og andre proxy-scenarier — falder tilbage til API-stimønstermatching

### Samtaletilstand

Klik på knappen „Samtaletilstand" i øverste højre hjørne for at parse Main Agents komplette samtalehistorik til en chat-grænseflade:

<img width="1500" height="764" alt="image" src="https://github.com/user-attachments/assets/725b57c8-6128-4225-b157-7dba2738b1c6" />

- Agent Team-visning understøttes endnu ikke
- Brugerbeskeder er højrejusterede (blå bobler), Main Agent-svar er venstrejusterede (mørke bobler)
- `thinking`-blokke er sammenklappede som standard, renderet som Markdown — klik for at udvide og se tankeprocessen; oversættelse med ét klik understøttes (funktionen er stadig ustabil)
- Brugervalgsbeskeder (AskUserQuestion) vises i Q&A-format
- Tovejs tilstandssynkronisering: Skift til samtaletilstand ruller automatisk til den samtale, der svarer til den valgte anmodning; skift tilbage til rå tilstand ruller automatisk til den valgte anmodning
- Indstillingspanel: Skift standard sammenklappet tilstand for værktøjsresultater og thinking-blokke
- Mobil samtale-browsing: I mobil CLI-tilstand tap på knappen „Samtale-browsing" i topbjælken for at glide en skrivebeskyttet samtalevisning ud for at browse den komplette samtalehistorik på mobil

### Log-administration

Via CC-Viewer dropdown-menuen i øverste venstre hjørne:

<img width="1500" height="760" alt="image" src="https://github.com/user-attachments/assets/33295e2b-f2e0-4968-a6f1-6f3d1404454e" />

**Log-komprimering**
Angående logs vil forfatteren gerne afklare, at de officielle Anthropic-definitioner ikke er blevet ændret, hvilket sikrer log-integritet. Men da individuelle log-indgange fra 1M Opus-modellen kan blive ekstremt store i senere faser, takket være visse log-optimeringer for MainAgent opnås mindst 66% størrelsesreduktion uden gzip. Parsingsmetoden for disse komprimerede logs kan udtrækkes fra det nuværende repository.

### Flere nyttige funktioner

<img width="1500" height="767" alt="image" src="https://github.com/user-attachments/assets/add558c5-9c4d-468a-ac6f-d8d64759fdbd" />

Du kan hurtigt lokalisere dine prompter ved hjælp af sidebjælke-værktøjerne.

--- 

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/82b8eb67-82f5-41b1-89d6-341c95a047ed" />

Den interessante KV-Cache-Text-funktion lader dig se præcis hvad Claude ser.

---

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/54cdfa4e-677c-4aed-a5bb-5fd946600c46" />

Du kan uploade billeder og beskrive dine behov — Claudes billedforståelse er utroligt kraftfuld. Og som du ved, kan du indsætte billeder direkte med Ctrl+V, og dit komplette indhold vil blive vist i samtalen.

---

<img width="600" height="370" alt="image" src="https://github.com/user-attachments/assets/87d332ea-3e34-4957-b442-f9d070211fbf" />

Du kan tilpasse plugins, administrere alle CC-Viewer-processer, og CC-Viewer understøtter hot-switching til tredjeparts-API'er (ja, du kan bruge GLM, Kimi, MiniMax, Qwen, DeepSeek — selvom forfatteren betragter dem alle som ret svage på dette tidspunkt).

---

<img width="1500" height="746" alt="image" src="https://github.com/user-attachments/assets/b1f60c7c-1438-4ecc-8c64-193d21ee3445" />

Flere funktioner venter på at blive opdaget... For eksempel: Systemet understøtter Agent Team og har en indbygget Code Reviewer. Codex Code Reviewer-integration kommer snart (forfatteren anbefaler stærkt at bruge Codex til at gennemgå Claude Codes kode).

## Licens

MIT
