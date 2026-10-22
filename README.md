# Positivhelpcenter – Website-Demo

Eine responsive, statische Website für das Positivhelpcenter mit einer lokalen Mentalchat-Demo. Das Positivhelpcenter ist als Hauptmarke dargestellt; MaxOfficial und die Projekt-Kooperation erscheinen als Kooperationspartner.

## Dateien

- `index.html` – Seitenstruktur und Inhalte
- `styles.css` – responsives Design (Weiß, Grün, klare Typografie)
- `app.js` – Navigation, Alltagshilfe-Karten, Positiv-Impulse und Chat-Demo
- `assets/favicon.svg` – kleines Browser-Icon

## Lokal ansehen

`index.html` im Browser öffnen. Es ist kein Build-Schritt, Framework oder Paketmanager nötig.

## Auf GitHub veröffentlichen

1. Öffne dein Repository `positivhelpcenter/helpcenter`.
2. Lade `index.html`, `styles.css`, `app.js` und den Ordner `assets/` in das Stammverzeichnis des Repositorys hoch.
3. Klicke auf **Commit changes**.
4. Öffne **Settings → Pages**.
5. Wähle unter **Build and deployment** die Quelle **Deploy from a branch**, Branch `main` und Ordner `/ (root)`, falls diese Optionen angezeigt werden.
6. Speichere die Einstellungen. GitHub zeigt anschließend die veröffentlichte Website-Adresse auf der Pages-Seite an.

Wenn das Repository bereits Dateien enthält, lade nicht blind alles darüber. Sichere zuerst bestehende Inhalte oder ersetze nur die Dateien, die zu dieser Website gehören.

## Mentalchat: wichtiger Hinweis

Der Mentalchat ist **keine echte KI**. Er verwendet lokal im Browser vorbereitete Antwortregeln. Es wird kein externer KI-Dienst aufgerufen und die Chatnachricht wird von diesem Projekt nicht an einen Server übertragen. Die Demo ist kein Therapie-, Diagnose- oder Krisendienst und versteht nicht alle Nachrichten.

Wenn später eine echte KI integriert wird:
- API-Schlüssel ausschließlich serverseitig speichern, niemals in `app.js` oder anderem öffentlichen Frontend-Code.
- Datenschutz, Datensparsamkeit, Altersgerechtigkeit, Missbrauchsschutz und klare Hinweise zur KI-Funktion vor dem Start umsetzen.
- Antworten für akute Krisen sorgfältig testen und nicht versprechen, dass die KI immer positiv oder richtig antwortet.

## Vor öffentlicher Veröffentlichung prüfen

- Lass alle genannten Personen und Organisationen ihre Namen, Rollen, Texte und gegebenenfalls Logos freigeben.
- Ergänze echte Kontaktinformationen und rechtlich erforderliche Angaben (z. B. Impressum und Datenschutzhinweise), bevor du die Website öffentlich für ein reales Projekt nutzt.
- Prüfe sämtliche Inhalte und Hilfehinweise mit den verantwortlichen Projektbeteiligten.
