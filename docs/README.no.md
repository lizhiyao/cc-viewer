# CC-Viewer

Et overvåkingssystem for Claude Code-forespørsler som fanger opp og visuelt viser alle API-forespørsler og -svar fra Claude Code i sanntid (rå tekst, uten sensur). Praktisk for utviklere som vil overvåke sin egen kontekst, slik at man enkelt kan gå tilbake og feilsøke under Vibe Coding.
Den nyeste versjonen av CC-Viewer tilbyr også løsninger for serverdistribusjon og webutvikling, samt verktøy for mobilutvikling. Velkommen til å ta det i bruk i egne prosjekter — støtte for skydistribusjon kommer i fremtiden.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Italiano](./README.it.md) | [Dansk](./README.da.md) | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | Norsk | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | [Türkçe](./README.tr.md) | [Українська](./README.uk.md)

## Bruksanvisning

### Installasjon

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Overvåkingsmodus (i denne modusen starter claude eller claude --dangerously-skip-permissions automatisk en loggprosess som registrerer forespørsler)

```bash
ccv
```

### Programmeringsmodus

== claude

```bash
ccv -c
```

== claude --dangerously-skip-permissions

```bash
ccv -d
```

Etter at programmeringsmodus er startet, åpnes nettsiden automatisk.

Du kan bruke Claude direkte på nettsiden, samtidig som du kan se fullstendige forespørsler og kodeendringer.

Og enda mer imponerende — du kan til og med programmere fra mobilenheten!

Kommandoen oppdager automatisk hvordan Claude Code er installert lokalt (NPM eller Native Install) og tilpasser seg deretter.

- **NPM-installasjon**: Injiserer automatisk et avlyttingsskript i Claude Codes `cli.js`.
- **Native Install**: Oppdager automatisk `claude`-binærfilen, konfigurerer en lokal transparent proxy og setter opp en Zsh Shell Hook for automatisk videresending av trafikk.
- Dette prosjektet anbefaler å bruke Claude Code installert via npm.

### Konfigurasjonsoverstyring (Configuration Override)

Hvis du trenger å bruke et tilpasset API-endepunkt (f.eks. en bedriftsproxy), kan du konfigurere det i `~/.claude/settings.json` eller sette miljøvariabelen `ANTHROPIC_BASE_URL`. `ccv` gjenkjenner dette automatisk og videresender forespørsler korrekt.

### Stillemodus (Silent Mode)

Som standard kjører `ccv` i stillemodus når den omslutter `claude`, slik at terminalutskriften holdes ryddig og konsistent med den opprinnelige opplevelsen. Alle logger fanges opp i bakgrunnen og kan vises via `http://localhost:7008`.

Etter at konfigurasjonen er fullført, bruker du bare `claude`-kommandoen som vanlig. Gå til `http://localhost:7008` for å se overvåkingsgrensesnittet.

### Feilsøking (Troubleshooting)

Hvis du opplever problemer med oppstart, finnes det en ultimat feilsøkingsmetode:
Steg 1: Åpne Claude Code i en vilkårlig mappe.
Steg 2: Gi Claude Code følgende instruksjon:
```
Jeg har installert npm-pakken cc-viewer, men etter å ha kjørt ccv fungerer den fortsatt ikke. Sjekk cli.js og findcc.js i cc-viewer, og tilpass til den lokale Claude Code-installasjonen basert på det spesifikke miljøet. Begrens endringene til findcc.js så langt det er mulig.
```
Å la Claude Code selv undersøke feilen er mer effektivt enn å spørre noen eller lese dokumentasjon!

Etter at instruksjonen ovenfor er fullført, oppdateres findcc.js. Hvis prosjektet ditt ofte krever lokal distribusjon, eller du har forket koden og ofte må løse installasjonsproblemer, kan du beholde denne filen og kopiere den direkte neste gang. Mange prosjekter og bedrifter bruker i dag Claude Code med serverdistribusjon i stedet for Mac-distribusjon, så forfatteren har skilt ut findcc.js for å gjøre det enklere å følge kildekodeoppdateringer for cc-viewer.

### Avinstallasjon

```bash
ccv --uninstall
```

### Sjekk versjon

```bash
ccv -v
```

## Funksjoner

### Forespørselsovervåking (råtekstmodus)
<img width="1500" height="720" alt="image" src="https://github.com/user-attachments/assets/519dd496-68bd-4e76-84d7-2a3d14ae3f61" />

- Fanger alle API-forespørsler fra Claude Code i sanntid, og sikrer at det er råtekst — ikke sensurerte logger (dette er viktig!!!)
- Gjenkjenner og merker automatisk Main Agent- og Sub Agent-forespørsler (undertyper: Plan, Search, Bash)
- MainAgent-forespørsler støtter Body Diff JSON, som viser forskjeller fra forrige MainAgent-forespørsel i sammenfoldet visning (kun endrede/nye felt)
- Hver forespørsel viser inline tokenforbruksstatistikk (inn-/ut-tokens, cache-opprettelse/-lesing, treffrate)
- Kompatibel med Claude Code Router (CCR) og andre proxy-scenarier — matcher forespørsler via API-stimønster som reserveløsning

### Samtalemodus

Klikk på «Samtalemodus»-knappen øverst til høyre for å analysere Main Agents fullstendige samtalehistorikk som et chattegrensesnitt:
<img width="1500" height="730" alt="image" src="https://github.com/user-attachments/assets/c973f142-748b-403f-b2b7-31a5d81e33e6" />

- Støtter foreløpig ikke visning av Agent Team
- Brukermeldinger er høyrejustert (blå bobler), Main Agent-svar er venstrejustert (mørke bobler)
- `thinking`-blokker er sammenfoldet som standard, gjengitt i Markdown — klikk for å utvide og se tankeprosessen; støtter ett-klikks oversettelse (funksjonen er fortsatt ustabil)
- Brukervalgmeldinger (AskUserQuestion) vises i spørsmål-og-svar-format
- Toveis modussynkronisering: ved bytte til samtalemodus navigeres det automatisk til samtalen som tilsvarer den valgte forespørselen; ved bytte tilbake til råtekstmodus navigeres det automatisk til den valgte forespørselen
- Innstillingspanel: du kan veksle standardtilstanden for sammenfolding av verktøyresultater og tenkingsblokker
- Samtalevisning på mobil: i CLI-modus på mobil, trykk på «Samtalevisning»-knappen i topplinjen for å åpne en skrivebeskyttet samtalevisning der du kan bla gjennom fullstendig samtalehistorikk på mobilen

### Programmeringsmodus

Etter oppstart med ccv -c eller ccv -d ser du:
<img width="1500" height="725" alt="image" src="https://github.com/user-attachments/assets/a64a381e-5a68-430c-b594-6d57dc01f4d3" />

Du kan se kodediff direkte etter redigering:
<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Du kan åpne filer og redigere manuelt, men det anbefales ikke — det er gammeldags programmering!

### Mobilprogrammering

Du kan til og med skanne en QR-kode for å programmere på mobilenheten:
<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />

På mobilenheten kan du se:
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Oppfyller dine forventninger til mobilprogrammering.

### Statistikkverktøy

Svevepanelet «Datastatistikk» i topptekstområdet:
<img width="1500" height="729" alt="image" src="https://github.com/user-attachments/assets/b23f9a81-fc3d-4937-9700-e70d84e4e5ce" />

- Viser antall cache creation/read og cache-treffrate
- Statistikk for cache-gjenoppbygging: viser antall og cache_creation tokens gruppert etter årsak (TTL, system/tools/model-endringer, meldingsavkorting/-endring, key-endring)
- Verktøybruksstatistikk: viser bruksfrekvensen for hvert verktøy sortert etter antall kall
- Skill-bruksstatistikk: viser bruksfrekvensen for hver Skill sortert etter antall kall
- Konsepthjelp (?)-ikon: klikk for å se innebygd dokumentasjon for MainAgent, CacheRebuild og ulike verktøy

### Loggadministrasjon

Via CC-Viewer-rullegardinmenyen øverst til venstre:
<img width="1200" height="672" alt="image" src="https://github.com/user-attachments/assets/8cf24f5b-9450-4790-b781-0cd074cd3b39" />

- Importer lokale logger: bla gjennom historiske loggfiler, gruppert etter prosjekt, åpne i nytt vindu
- Last inn lokal JSONL-fil: velg en lokal `.jsonl`-fil direkte for visning (støtter opptil 500 MB)
- Lagre gjeldende logg som: last ned gjeldende overvåkings-JSONL-loggfil
- Slå sammen logger: slå sammen flere JSONL-loggfiler til én økt for samlet analyse
- Vis bruker-Prompt: trekk ut og vis alle brukerinndata, støtter tre visningsmodi — Råmodus (originalt innhold), Kontekstmodus (systemtagger kan foldes sammen), Tekstmodus (ren tekst); skråstrekkommandoer (`/model`, `/context` osv.) vises som selvstendige oppføringer; kommandorelaterte tagger skjules automatisk fra Prompt-innholdet
- Eksporter Prompt som TXT: eksporter bruker-Prompt (ren tekst, uten systemtagger) til en lokal `.txt`-fil

### Flerspråklig støtte

CC-Viewer støtter 18 språk og bytter automatisk basert på systemets språkinnstilling:

简体中文 | English | 繁體中文 | 한국어 | Deutsch | Español | Français | Italiano | Dansk | 日本語 | Polski | Русский | العربية | Norsk | Português (Brasil) | ไทย | Türkçe | Українська

### Automatisk oppdatering

CC-Viewer sjekker automatisk for oppdateringer ved oppstart (maksimalt én gang hver 4. time). Innenfor samme hovedversjon (f.eks. 1.x.x → 1.y.z) brukes oppdateringer automatisk og trer i kraft ved neste omstart. Endringer av hovedversjon viser kun et varsel.

Automatisk oppdatering følger Claude Codes globale konfigurasjon i `~/.claude/settings.json`. Hvis Claude Code har deaktivert automatiske oppdateringer (`autoUpdates: false`), hopper CC-Viewer også over automatiske oppdateringer.

## License

MIT
