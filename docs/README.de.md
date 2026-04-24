# CC-Viewer

Ein Vibe-Coding-Toolkit, destilliert aus über 15 Jahren Forschungs- und Entwicklungserfahrung in der Internetbranche, aufgebaut auf Claude Code:

1. Führen Sie /ultraPlan und /ultraReview lokal aus, damit Ihr Code nie vollständig Claudes Cloud ausgesetzt werden muss;
2. Ermöglicht mobiles Programmieren über Ihr lokales Netzwerk (benutzererweiterbar);
3. Vollständige Claude Code Payload-Abfangung und -Analyse — hervorragend für Protokollierung, Debugging, Lernen und Reverse-Engineering;
4. Wird mit gesammelten Studiennotizen und praktischen Erfahrungen ausgeliefert (achten Sie auf die "?"-Symbole in der gesamten Anwendung), damit wir gemeinsam erkunden und wachsen können;
5. Web-UI passt sich an jeden Größenmodus an — setzen Sie sie in Browser-Erweiterungen, Betriebssystem-Splitansichten und beliebige Einbettungsszenarien ein; ein nativer Installer ist ebenfalls verfügbar.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | Deutsch | [Español](./README.es.md) | [Français](./README.fr.md) | [Italiano](./README.it.md) | [Dansk](./README.da.md) | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | [Türkçe](./README.tr.md) | [Українська](./README.uk.md)

## Verwendung

### Installation

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Programmiermodus

ccv ist ein Drop-in-Ersatz für claude — alle Argumente werden an claude weitergereicht, während der Web-Viewer gestartet wird.

```bash
ccv                    # == claude (interactive mode)
ccv -c                 # == claude --continue (continue last conversation)
ccv -r                 # == claude --resume (resume a conversation)
ccv -p "hello"         # == claude --print "hello" (print mode)
ccv --d                # == claude --dangerously-skip-permissions (shortcut)
ccv --model opus       # == claude --model opus
```

Der vom Autor am häufigsten verwendete Befehl ist:
```
ccv -c --d             # == claude --continue --dangerously-skip-permissions
```

Nach dem Start im Programmiermodus wird automatisch eine Webseite geöffnet.

CC-Viewer wird auch als native Desktop-App ausgeliefert — holen Sie sich den Build für Ihre Plattform von GitHub.
[Download-Seite](https://github.com/weiesky/cc-viewer/releases)


### Logger-Modus

Wenn Sie weiterhin das native claude-Tool oder die VS Code-Erweiterung bevorzugen, verwenden Sie diesen Modus.

In diesem Modus startet der Befehl `claude` automatisch einen Protokollierungsprozess, der Anfrageprotokolle in ~/.claude/cc-viewer/*yourproject*/date.jsonl aufzeichnet.

Logger-Modus aktivieren:
```bash
ccv -logger
```

Wenn die Konsole den spezifischen Port nicht ausgeben kann, ist der erste Standardport 127.0.0.1:7008. Mehrere Instanzen verwenden sequenzielle Ports wie 7009, 7010.

Logger-Modus deinstallieren:
```bash
ccv --uninstall
```

### Fehlerbehebung

Falls beim Start von cc-viewer Probleme auftreten, ist hier der ultimative Fehlerbehebungsansatz:

Schritt 1: Öffnen Sie Claude Code in einem beliebigen Verzeichnis.

Schritt 2: Geben Sie Claude Code die folgende Anweisung:

```
I have installed the cc-viewer npm package, but after running ccv it still doesn't work properly. Please check cc-viewer's cli.js and findcc.js, and adapt them to the local Claude Code deployment based on the specific environment. Keep the scope of changes as constrained as possible within findcc.js.
```

Claude Code das Problem selbst diagnostizieren zu lassen, ist effektiver, als jemanden zu fragen oder eine Dokumentation zu lesen!

Nachdem die obige Anweisung abgeschlossen ist, wird `findcc.js` aktualisiert. Wenn Ihr Projekt häufig lokale Bereitstellung erfordert oder wenn geforkter Code häufig Installationsprobleme lösen muss, können Sie diese Datei beim nächsten Mal einfach kopieren, wenn Sie sie behalten. In diesem Stadium werden viele Projekte und Unternehmen, die Claude Code einsetzen, nicht auf Mac bereitgestellt, sondern in serverseitig gehosteten Umgebungen, daher hat der Autor `findcc.js` separiert, um das Verfolgen von cc-viewer-Quellcode-Updates in Zukunft zu erleichtern.


### Weitere Befehle

Siehe:

```bash
ccv -h
```

### Silent-Modus

Standardmäßig läuft `ccv` im Silent-Modus, wenn es `claude` umhüllt, hält Ihre Terminal-Ausgabe sauber und konsistent mit der nativen Erfahrung. Alle Protokolle werden im Hintergrund erfasst und können unter `http://localhost:7008` angezeigt werden.

Nach der Konfiguration verwenden Sie den Befehl `claude` wie gewohnt. Besuchen Sie `http://localhost:7008`, um auf die Überwachungsoberfläche zuzugreifen.


## Funktionen


### Programmiermodus

Nach dem Start mit ccv sehen Sie:

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/ab353a2b-f101-409d-a28c-6a4e41571ea2" />


Sie können Code-Diffs direkt nach der Bearbeitung anzeigen:

<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Sie können Dateien und Code zwar manuell öffnen, aber manuelles Programmieren wird nicht empfohlen — das ist Old-School-Coding!

### Mobiles Programmieren

Sie können sogar einen QR-Code scannen, um von Ihrem mobilen Gerät aus zu programmieren:

<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Erfüllen Sie Ihre Vorstellung vom mobilen Programmieren. Es gibt auch einen Plugin-Mechanismus — wenn Sie Anpassungen an Ihre Programmiergewohnheiten benötigen, bleiben Sie auf dem Laufenden für Plugin-Hook-Updates.


### Logger-Modus (Vollständige Claude Code-Sitzungen anzeigen)

<img width="1500" height="768" alt="image" src="https://github.com/user-attachments/assets/a8a9f3f7-d876-4f6b-a64d-f323a05c4d21" />


- Erfasst alle API-Anfragen von Claude Code in Echtzeit und stellt Rohtext sicher — keine redigierten Protokolle (das ist wichtig!!!)
- Identifiziert und kennzeichnet automatisch Main Agent- und Sub Agent-Anfragen (Untertypen: Plan, Search, Bash)
- MainAgent-Anfragen unterstützen Body Diff JSON und zeigen eingeklappte Unterschiede zur vorherigen MainAgent-Anfrage (nur geänderte/neue Felder)
- Jede Anfrage zeigt Inline-Token-Nutzungsstatistiken an (Input/Output-Tokens, Cache-Erstellung/-Lesung, Trefferquote)
- Kompatibel mit Claude Code Router (CCR) und anderen Proxy-Szenarien — fällt auf API-Pfadmusterabgleich zurück

### Konversationsmodus

Klicken Sie oben rechts auf die Schaltfläche "Conversation Mode", um den vollständigen Gesprächsverlauf des Main Agent in eine Chat-Oberfläche zu parsen:

<img width="1500" height="764" alt="image" src="https://github.com/user-attachments/assets/725b57c8-6128-4225-b157-7dba2738b1c6" />

- Agent Team-Anzeige wird noch nicht unterstützt
- Benutzernachrichten sind rechtsbündig (blaue Sprechblasen), Main Agent-Antworten sind linksbündig (dunkle Sprechblasen)
- `thinking`-Blöcke sind standardmäßig eingeklappt und werden als Markdown gerendert — klicken Sie zum Erweitern und Anzeigen des Denkprozesses; Ein-Klick-Übersetzung wird unterstützt (Funktion ist noch instabil)
- Benutzerauswahlnachrichten (AskUserQuestion) werden im Q&A-Format angezeigt
- Bidirektionale Modussynchronisation: Der Wechsel in den Konversationsmodus scrollt automatisch zum Gespräch, das der ausgewählten Anfrage entspricht; der Wechsel zurück in den Rohmodus scrollt automatisch zur ausgewählten Anfrage
- Einstellungspanel: Schalten Sie den Standard-Einklappzustand für Werkzeugergebnisse und thinking-Blöcke um
- Mobiles Durchsuchen von Gesprächen: Tippen Sie im mobilen CLI-Modus auf die Schaltfläche "Conversation Browse" in der oberen Leiste, um eine schreibgeschützte Konversationsansicht zum Durchsuchen des vollständigen Gesprächsverlaufs auf dem Mobilgerät auszuklappen

### Protokollverwaltung

Über das CC-Viewer-Dropdown-Menü oben links:

<img width="1500" height="760" alt="image" src="https://github.com/user-attachments/assets/33295e2b-f2e0-4968-a6f1-6f3d1404454e" />

**Protokollkomprimierung**
In Bezug auf Protokolle möchte der Autor klarstellen, dass die offiziellen Anthropic-Definitionen nicht geändert wurden, um die Protokollintegrität zu gewährleisten. Da jedoch einzelne Protokolleinträge des 1M Opus-Modells in späteren Phasen extrem groß werden können, wird dank bestimmter Protokolloptimierungen für MainAgent ohne gzip eine Größenreduzierung von mindestens 66 % erreicht. Die Parsing-Methode für diese komprimierten Protokolle kann aus dem aktuellen Repository extrahiert werden.

### Weitere nützliche Funktionen

<img width="1500" height="767" alt="image" src="https://github.com/user-attachments/assets/add558c5-9c4d-468a-ac6f-d8d64759fdbd" />

Sie können Ihre Prompts schnell über die Sidebar-Tools lokalisieren.

--- 

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/82b8eb67-82f5-41b1-89d6-341c95a047ed" />

Die interessante KV-Cache-Text-Funktion lässt Sie genau das sehen, was Claude sieht.

---

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/54cdfa4e-677c-4aed-a5bb-5fd946600c46" />

Sie können Bilder hochladen und Ihre Bedürfnisse beschreiben — Claudes Bildverständnis ist unglaublich leistungsstark. Und wie Sie wissen, können Sie Bilder direkt mit Ctrl+V einfügen, und Ihr vollständiger Inhalt wird im Gespräch angezeigt.

---

<img width="600" height="370" alt="image" src="https://github.com/user-attachments/assets/87d332ea-3e34-4957-b442-f9d070211fbf" />

Sie können Plugins anpassen, alle CC-Viewer-Prozesse verwalten, und CC-Viewer unterstützt das Hot-Switching zu Drittanbieter-APIs (ja, Sie können GLM, Kimi, MiniMax, Qwen, DeepSeek verwenden — obwohl der Autor sie derzeit alle für ziemlich schwach hält).

---

<img width="1500" height="746" alt="image" src="https://github.com/user-attachments/assets/b1f60c7c-1438-4ecc-8c64-193d21ee3445" />

Weitere Funktionen warten darauf, entdeckt zu werden... Zum Beispiel: Das System unterstützt Agent Team und verfügt über einen integrierten Code Reviewer. Die Codex Code Reviewer-Integration kommt bald (der Autor empfiehlt dringend die Verwendung von Codex zur Überprüfung des Claude Code-Codes).

## Lizenz

MIT
