# CC-Viewer

Sistema di monitoraggio delle richieste di Claude Code, che cattura e visualizza in tempo reale tutte le richieste e risposte API di Claude Code (testo originale, senza tagli). Pensato per aiutare gli sviluppatori a monitorare il proprio Context, facilitando la revisione e il debug durante il Vibe Coding.
L'ultima versione di CC-Viewer offre anche soluzioni per il deploy su server con programmazione web, oltre a strumenti per la programmazione da dispositivi mobili. Siete invitati a utilizzarlo nei vostri progetti; in futuro saranno disponibili ulteriori funzionalità tramite plugin e supporto per il deploy in cloud.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | [Français](./README.fr.md) | Italiano | [Dansk](./README.da.md) | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | [Türkçe](./README.tr.md) | [Українська](./README.uk.md)

## Utilizzo

### Installazione

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Modalità monitoraggio (in questa modalità, avviando claude o claude --dangerously-skip-permissions verrà automaticamente avviato un processo di log per registrare i messaggi delle richieste)

```bash
ccv
```

### Modalità programmazione

== claude

```bash
ccv -c
```

== claude --dangerously-skip-permissions

```bash
ccv -d
```

Dopo l'avvio della modalità programmazione, la pagina web si aprirà automaticamente.

Puoi utilizzare Claude direttamente dalla pagina web, visualizzando contemporaneamente i messaggi completi delle richieste e le modifiche al codice.

E, cosa ancora più interessante, puoi persino programmare dal tuo dispositivo mobile!

Il comando rileva automaticamente la modalità di installazione locale di Claude Code (NPM o Native Install) e si adatta di conseguenza.

- **Installazione NPM**: inietta automaticamente lo script di intercettazione nel `cli.js` di Claude Code.
- **Native Install**: rileva automaticamente il binario `claude`, configura un proxy trasparente locale e imposta uno Zsh Shell Hook per il reindirizzamento automatico del traffico.
- Per questo progetto si consiglia l'installazione di Claude Code tramite NPM.

### Override della configurazione (Configuration Override)

Se hai bisogno di utilizzare un endpoint API personalizzato (ad esempio un proxy aziendale), basta configurarlo in `~/.claude/settings.json` o impostare la variabile d'ambiente `ANTHROPIC_BASE_URL`. `ccv` lo rileverà automaticamente e inoltrerà correttamente le richieste.

### Modalità silenziosa (Silent Mode)

Per impostazione predefinita, `ccv` opera in modalità silenziosa quando avvolge l'esecuzione di `claude`, mantenendo l'output del terminale pulito e coerente con l'esperienza nativa. Tutti i log vengono catturati in background e sono consultabili su `http://localhost:7008`.

Una volta configurato, basta utilizzare normalmente il comando `claude`. Visita `http://localhost:7008` per accedere all'interfaccia di monitoraggio.

### Risoluzione dei problemi (Troubleshooting)

Se riscontri problemi di avvio, ecco una soluzione definitiva:
Primo passo: apri Claude Code in una directory qualsiasi;
Secondo passo: dai a Claude Code la seguente istruzione:
```
Ho installato il pacchetto npm cc-viewer, ma dopo aver eseguito ccv non funziona correttamente. Esamina cli.js e findcc.js di cc-viewer e, in base all'ambiente specifico, adatta la modalità di deploy locale di Claude Code. Le modifiche dovrebbero essere limitate il più possibile a findcc.js.
```
Lasciare che Claude Code verifichi gli errori da solo è più efficace che consultare chiunque o leggere qualsiasi documentazione!

Una volta completata l'istruzione, findcc.js verrà aggiornato. Se il tuo progetto richiede frequentemente il deploy locale, o se il codice forkato deve risolvere spesso problemi di installazione, conserva questo file e copialo direttamente la prossima volta. Attualmente molti progetti e aziende non utilizzano Claude Code su Mac, ma lo ospitano su server, quindi l'autore ha separato findcc.js per facilitare il tracciamento degli aggiornamenti del codice sorgente di cc-viewer.

### Disinstallazione

```bash
ccv --uninstall
```

### Verifica versione

```bash
ccv -v
```

## Funzionalità

### Monitoraggio richieste (modalità testo originale)
<img width="1500" height="720" alt="image" src="https://github.com/user-attachments/assets/519dd496-68bd-4e76-84d7-2a3d14ae3f61" />

- Cattura in tempo reale tutte le richieste API inviate da Claude Code, garantendo il testo originale e non log tagliati (questo è fondamentale!)
- Identifica e contrassegna automaticamente le richieste Main Agent e Sub Agent (sottotipi: Plan, Search, Bash)
- Le richieste MainAgent supportano Body Diff JSON, mostrando in modo compatto le differenze rispetto alla richiesta MainAgent precedente (solo campi modificati/aggiunti)
- Ogni richiesta mostra inline le statistiche di utilizzo dei Token (Token input/output, creazione/lettura cache, hit rate)
- Compatibile con Claude Code Router (CCR) e altri scenari proxy — matching delle richieste tramite pattern del percorso API

### Modalità conversazione

Clicca sul pulsante "Modalità conversazione" in alto a destra per visualizzare la cronologia completa delle conversazioni del Main Agent come interfaccia chat:
<img width="1500" height="730" alt="image" src="https://github.com/user-attachments/assets/c973f142-748b-403f-b2b7-31a5d81e33e6" />

- La visualizzazione dell'Agent Team non è ancora supportata
- I messaggi dell'utente sono allineati a destra (bolla blu), le risposte del Main Agent a sinistra (bolla scura)
- I blocchi `thinking` sono compressi per impostazione predefinita, renderizzati in Markdown; clicca per espandere e visualizzare il processo di ragionamento; supporto per la traduzione con un clic (funzionalità ancora instabile)
- I messaggi di scelta dell'utente (AskUserQuestion) sono visualizzati in formato domanda-risposta
- Sincronizzazione bidirezionale: passando alla modalità conversazione ci si posiziona automaticamente sulla conversazione corrispondente alla richiesta selezionata; tornando alla modalità originale ci si posiziona automaticamente sulla richiesta selezionata
- Pannello impostazioni: permette di cambiare lo stato di compressione predefinito dei risultati degli strumenti e dei blocchi di ragionamento
- Navigazione conversazioni su mobile: in modalità CLI su mobile, tocca il pulsante "Sfoglia conversazioni" nella barra superiore per aprire una vista conversazione in sola lettura e sfogliare l'intera cronologia delle conversazioni dal telefono

### Modalità programmazione

Dopo l'avvio con ccv -c o ccv -d vedrai:
<img width="1500" height="725" alt="image" src="https://github.com/user-attachments/assets/a64a381e-5a68-430c-b594-6d57dc01f4d3" />

Puoi visualizzare direttamente il diff del codice dopo la modifica:
<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Anche se puoi aprire i file e programmare manualmente, non è consigliato: quella è programmazione all'antica!

### Programmazione da mobile

Puoi persino scansionare un QR code per programmare dal tuo dispositivo mobile:
<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />

Sul dispositivo mobile puoi vedere:
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Soddisfa ogni tua aspettativa sulla programmazione da mobile. Inoltre è disponibile un sistema di plugin: se hai bisogno di personalizzare in base alle tue abitudini di programmazione, potrai seguire gli aggiornamenti degli hooks dei plugin.


### Strumenti statistici

Pannello flottante "Statistiche dati" nell'area Header:
<img width="1500" height="729" alt="image" src="https://github.com/user-attachments/assets/b23f9a81-fc3d-4937-9700-e70d84e4e5ce" />

- Mostra il numero di cache creation/read e il tasso di hit della cache
- Statistiche di ricostruzione cache: raggruppate per causa (TTL, modifiche system/tools/model, troncamento/modifica messaggi, modifica key) con conteggio e token cache_creation
- Statistiche utilizzo strumenti: mostra la frequenza di chiamata di ogni strumento, ordinata per numero di chiamate
- Statistiche utilizzo Skill: mostra la frequenza di chiamata di ogni Skill, ordinata per numero di chiamate
- Icona di aiuto concettuale (?): clicca per consultare la documentazione integrata di MainAgent, CacheRebuild e dei vari strumenti

### Gestione log

Tramite il menu a tendina CC-Viewer in alto a sinistra:
<img width="1200" height="672" alt="image" src="https://github.com/user-attachments/assets/8cf24f5b-9450-4790-b781-0cd074cd3b39" />

- Importa log locali: sfoglia i file di log storici, raggruppati per progetto, apertura in nuova finestra
- Carica file JSONL locali: seleziona direttamente un file `.jsonl` locale da caricare (supporto fino a 500MB)
- Salva log corrente con nome: scarica il file di log JSONL attualmente monitorato
- Unisci log: combina più file di log JSONL in un'unica sessione per un'analisi unificata
- Visualizza Prompt utente: estrae e mostra tutti gli input dell'utente, con tre modalità di visualizzazione — modalità originale (contenuto grezzo), modalità contesto (tag di sistema comprimibili), modalità Text (solo testo); i comandi slash (`/model`, `/context`, ecc.) vengono mostrati come voci separate; i tag relativi ai comandi vengono automaticamente nascosti dal contenuto del Prompt
- Esporta Prompt come TXT: esporta i Prompt dell'utente (solo testo, senza tag di sistema) come file `.txt` locale

### Supporto multilingua

CC-Viewer supporta 18 lingue, con cambio automatico in base alla lingua del sistema:

简体中文 | English | 繁體中文 | 한국어 | Deutsch | Español | Français | Italiano | Dansk | 日本語 | Polski | Русский | العربية | Norsk | Português (Brasil) | ไทย | Türkçe | Українська

### Aggiornamento automatico

CC-Viewer verifica automaticamente la disponibilità di aggiornamenti all'avvio (al massimo una volta ogni 4 ore). All'interno della stessa versione major (ad esempio 1.x.x → 1.y.z) l'aggiornamento è automatico e diventa effettivo al prossimo avvio. Per aggiornamenti cross-major viene mostrata solo una notifica.

L'aggiornamento automatico segue la configurazione globale di Claude Code `~/.claude/settings.json`. Se Claude Code ha disabilitato gli aggiornamenti automatici (`autoUpdates: false`), anche CC-Viewer salterà l'aggiornamento automatico.

## License

MIT
