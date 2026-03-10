# CC-Viewer

System monitorowania zapytań Claude Code, który w czasie rzeczywistym przechwytuje i wizualizuje wszystkie zapytania i odpowiedzi API (oryginalny tekst, bez skracania). Umożliwia programistom monitorowanie własnego kontekstu w celu przeglądania i diagnozowania problemów podczas Vibe Codingu.
Najnowsza wersja CC-Viewer oferuje również rozwiązanie do programowania webowego z wdrożeniem serwerowym oraz narzędzia do programowania mobilnego. Zachęcamy do stosowania w swoich projektach. W przyszłości pojawią się kolejne funkcje wtyczek oraz wsparcie dla wdrożeń chmurowych.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Italiano](./README.it.md) | [Dansk](./README.da.md) | Polski | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | [Türkçe](./README.tr.md) | [Українська](./README.uk.md)

## Sposób użycia

### Instalacja

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Tryb monitorowania (w tym trybie uruchomienie claude lub claude --dangerously-skip-permissions automatycznie uruchamia proces logowania rejestrujący zapytania)

```bash
ccv
```

### Tryb programowania

== claude

```bash
ccv -c
```

== claude --dangerously-skip-permissions

```bash
ccv -d
```

Po uruchomieniu trybu programowania automatycznie otworzy się strona internetowa.

Na stronie internetowej możesz bezpośrednio korzystać z claude, jednocześnie przeglądając pełne treści zapytań i zmiany w kodzie.

Co więcej, możesz nawet programować na urządzeniu mobilnym!

To polecenie automatycznie wykrywa sposób instalacji lokalnego Claude Code (NPM lub Native Install) i odpowiednio się dostosowuje.

- **Instalacja NPM**: automatycznie wstrzykuje skrypt przechwytujący do pliku `cli.js` Claude Code.
- **Native Install**: automatycznie wykrywa plik binarny `claude`, konfiguruje lokalny transparentny proxy i ustawia Zsh Shell Hook do automatycznego przekierowywania ruchu.
- Zalecamy korzystanie z Claude Code zainstalowanego przez npm.

### Nadpisywanie konfiguracji (Configuration Override)

Jeśli potrzebujesz użyć niestandardowego endpointu API (np. proxy firmowego), wystarczy skonfigurować go w `~/.claude/settings.json` lub ustawić zmienną środowiskową `ANTHROPIC_BASE_URL`. `ccv` automatycznie go rozpozna i prawidłowo przekieruje zapytania.

### Tryb cichy (Silent Mode)

Domyślnie `ccv` działa w trybie cichym podczas opakowywania `claude`, zapewniając czystość wyjścia terminala, zgodnie z natywnym doświadczeniem. Wszystkie logi są przechwytywane w tle i dostępne pod adresem `http://localhost:7008`.

Po zakończeniu konfiguracji wystarczy normalnie używać polecenia `claude`. Interfejs monitorowania jest dostępny pod adresem `http://localhost:7008`.

### Rozwiązywanie problemów (Troubleshooting)

Jeśli napotkasz problemy z uruchomieniem, istnieje uniwersalne rozwiązanie diagnostyczne:
Krok pierwszy: otwórz Claude Code w dowolnym katalogu;
Krok drugi: wydaj Claude Code następującą instrukcję:
```
我已经安装了cc-viewer这个npm包，但是执行ccv以后仍然无法有效运行。查看cc-viewer的cli.js 和 findcc.js，根据具体的环境，适配本地的claude code的部署方式。适配的时候修改范围尽量约束在findcc.js中。
```
Pozwolenie Claude Code na samodzielne sprawdzenie błędów jest skuteczniejsze niż konsultacja z kimkolwiek czy czytanie jakiejkolwiek dokumentacji!

Po wykonaniu powyższej instrukcji plik findcc.js zostanie zaktualizowany. Jeśli Twój projekt często wymaga lokalnego wdrożenia lub sforkowany kod wymaga częstego rozwiązywania problemów z instalacją, zachowaj ten plik — następnym razem wystarczy go skopiować. Na obecnym etapie wiele projektów i firm korzysta z Claude Code nie na Macu, lecz na serwerach hostingowych, dlatego autor wyodrębnił plik findcc.js, aby ułatwić śledzenie aktualizacji kodu źródłowego cc-viewer.

### Odinstalowanie

```bash
ccv --uninstall
```

### Sprawdzanie wersji

```bash
ccv -v
```

## Funkcje

### Monitorowanie zapytań (tryb oryginalny)
<img width="1500" height="720" alt="image" src="https://github.com/user-attachments/assets/519dd496-68bd-4e76-84d7-2a3d14ae3f61" />

- Przechwytywanie w czasie rzeczywistym wszystkich zapytań API wysyłanych przez Claude Code — oryginalny tekst, nie skrócone logi (to bardzo ważne!!!)
- Automatyczne rozpoznawanie i oznaczanie zapytań Main Agent i Sub Agent (podtypy: Plan, Search, Bash)
- Zapytania MainAgent obsługują Body Diff JSON — zwijane wyświetlanie różnic względem poprzedniego zapytania MainAgent (pokazywane są tylko zmienione/nowe pola)
- Każde zapytanie wyświetla inline statystyki zużycia tokenów (tokeny wejściowe/wyjściowe, tworzenie/odczyt cache, współczynnik trafień)
- Kompatybilność z Claude Code Router (CCR) i innymi scenariuszami proxy — dopasowywanie zapytań na podstawie wzorców ścieżek API

### Tryb konwersacji

Kliknij przycisk „Tryb konwersacji" w prawym górnym rogu, aby przetworzyć pełną historię konwersacji Main Agent na interfejs czatu:
<img width="1500" height="730" alt="image" src="https://github.com/user-attachments/assets/c973f142-748b-403f-b2b7-31a5d81e33e6" />

- Wyświetlanie Agent Team nie jest jeszcze obsługiwane
- Wiadomości użytkownika wyrównane do prawej (niebieskie dymki), odpowiedzi Main Agent wyrównane do lewej (ciemne dymki)
- Bloki `thinking` domyślnie zwinięte, renderowane w Markdown — kliknij, aby rozwinąć i zobaczyć proces myślenia; obsługa tłumaczenia jednym kliknięciem (funkcja jeszcze niestabilna)
- Wiadomości wyboru użytkownika (AskUserQuestion) wyświetlane w formacie pytanie-odpowiedź
- Dwukierunkowa synchronizacja trybów: przełączenie na tryb konwersacji automatycznie lokalizuje odpowiednią konwersację dla wybranego zapytania; przełączenie z powrotem na tryb oryginalny automatycznie lokalizuje wybrane zapytanie
- Panel ustawień: możliwość przełączania domyślnego stanu zwijania wyników narzędzi i bloków myślenia
- Przeglądanie konwersacji na telefonie: w trybie CLI na telefonie kliknij przycisk „Przeglądanie konwersacji" na górnym pasku, aby wysunąć widok konwersacji tylko do odczytu i przeglądać pełną historię konwersacji na telefonie

### Tryb programowania

Po uruchomieniu za pomocą ccv -c lub ccv -d zobaczysz:
<img width="1500" height="725" alt="image" src="https://github.com/user-attachments/assets/a64a381e-5a68-430c-b594-6d57dc01f4d3" />

Po zakończeniu edycji możesz bezpośrednio przeglądać diff kodu:
<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Chociaż możesz otwierać pliki i programować ręcznie, nie jest to zalecane — to programowanie starego typu!

### Programowanie mobilne

Możesz nawet zeskanować kod QR i programować na urządzeniu mobilnym:
<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />

Na urządzeniu mobilnym zobaczysz:
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Spełnia Twoje wyobrażenia o programowaniu mobilnym.

### Narzędzia statystyczne

Panel „Statystyki danych" w obszarze nagłówka:
<img width="1500" height="729" alt="image" src="https://github.com/user-attachments/assets/b23f9a81-fc3d-4937-9700-e70d84e4e5ce" />

- Wyświetla liczbę operacji tworzenia/odczytu cache oraz współczynnik trafień
- Statystyki przebudowy cache: wyświetla liczbę wystąpień i tokeny cache_creation pogrupowane według przyczyny (TTL, zmiana system/tools/model, obcięcie/modyfikacja wiadomości, zmiana klucza)
- Statystyki użycia narzędzi: wyświetla częstotliwość wywołań każdego narzędzia posortowaną według liczby wywołań
- Statystyki użycia Skill: wyświetla częstotliwość wywołań każdego Skill posortowaną według liczby wywołań
- Ikona pomocy koncepcyjnej (?): kliknij, aby wyświetlić wbudowaną dokumentację dla MainAgent, CacheRebuild i różnych narzędzi

### Zarządzanie logami

Przez menu rozwijane CC-Viewer w lewym górnym rogu:
<img width="1200" height="672" alt="image" src="https://github.com/user-attachments/assets/8cf24f5b-9450-4790-b781-0cd074cd3b39" />

- Importuj lokalne logi: przeglądaj historyczne pliki logów pogrupowane według projektu, otwierane w nowym oknie
- Wczytaj lokalny plik JSONL: bezpośrednio wybierz lokalny plik `.jsonl` do wczytania (obsługuje do 500MB)
- Zapisz bieżący log jako: pobierz bieżący plik logu monitorowania JSONL
- Scalanie logów: łączenie wielu plików logów JSONL w jedną sesję do ujednoliconej analizy
- Przeglądaj Prompty użytkownika: wyodrębnij i wyświetl wszystkie dane wejściowe użytkownika z trzema trybami widoku — tryb Oryginał (surowa treść), tryb Kontekst (tagi systemowe zwijalne), tryb Tekst (tylko czysty tekst); komendy slash (`/model`, `/context` itp.) wyświetlane jako osobne wpisy; tagi związane z komendami automatycznie ukrywane z treści Promptu
- Eksportuj Prompt do TXT: eksportuj prompty użytkownika (czysty tekst, bez tagów systemowych) do lokalnego pliku `.txt`

### Obsługa wielu języków

CC-Viewer obsługuje 18 języków, automatycznie przełączając się na podstawie ustawień regionalnych systemu:

简体中文 | English | 繁體中文 | 한국어 | Deutsch | Español | Français | Italiano | Dansk | 日本語 | Polski | Русский | العربية | Norsk | Português (Brasil) | ไทย | Türkçe | Українська

### Automatyczna aktualizacja

CC-Viewer automatycznie sprawdza aktualizacje przy uruchomieniu (maksymalnie raz na 4 godziny). W ramach tej samej wersji głównej (np. 1.x.x → 1.y.z) aktualizacja następuje automatycznie i zaczyna obowiązywać przy następnym uruchomieniu. Przy zmianie wersji głównej wyświetlane jest jedynie powiadomienie.

Automatyczna aktualizacja jest powiązana z globalną konfiguracją Claude Code `~/.claude/settings.json`. Jeśli Claude Code ma wyłączone automatyczne aktualizacje (`autoUpdates: false`), CC-Viewer również pominie automatyczną aktualizację.

## License

MIT
