# SRC Prüfung - Progressive Web App

Eine Progressive Web App (PWA) für das Training zur SRC (Short Range Certificate) Funkzeugnis-Prüfung.

## 🚀 Features

- ✅ 180 Prüfungsfragen aus den offiziellen SRC-Prüfungsunterlagen
- 📊 Intelligentes Lernsystem mit gewichteter Fragenauswahl
- 💾 Automatische Statistikverfolgung (LocalStorage)
- 📱 Vollständig offline-fähig (Service Worker)
- 🎯 Sofortiges Feedback nach jeder Antwort
- 📈 Detaillierte Lernfortschrittsanzeige
- 🔄 Adaptive Schwierigkeitsanpassung basierend auf Lernfortschritt
- 📲 Installierbar auf allen Plattformen (Android, iOS, Desktop)

## 📱 Installation & Nutzung

### Online-Version (GitHub Pages)

Die App ist direkt über GitHub Pages verfügbar:

1. Öffne: `https://<dein-username>.github.io/SRC_TheoriePruefer/`
2. Klicke auf "Installieren" im Browser-Menü (Chrome/Edge) oder teile → "Zum Startbildschirm hinzufügen" (iOS Safari)
3. Die App läuft nun wie eine native App!

### Lokale Installation

```bash
# Repository klonen
git clone https://github.com/maggo83/SRC_TheoriePruefer.git
cd SRC_TheoriePruefer

# In den web-Ordner wechseln
cd web

# Lokalen Server starten (Python)
python3 -m http.server 8000

# Browser öffnen
# Gehe zu: http://localhost:8000
```

### GitHub Pages Deployment

1. **Repository auf GitHub erstellen/aktualisieren:**
```bash
cd /home/marco/DATA/01_Texte/Python/SRC_Fragen
git add web/
git commit -m "Add PWA version"
git push origin main
```

2. **GitHub Pages aktivieren:**
   - Gehe zu deinem Repository auf GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` → Folder: `/web`
   - Save

3. **Warten (1-2 Minuten):**
   - Die App wird automatisch unter `https://<username>.github.io/SRC_TheoriePruefer/` verfügbar sein

## 🎮 Funktionsweise

### Prüfungsmodus
- 24 zufällig ausgewählte Fragen
- Mindestens 19 richtige Antworten zum Bestehen
- Sofortiges Feedback nach jeder Antwort
- Automatisches Weitergehen bei richtiger Antwort (0,5s)
- Button zum Weitergehen bei falscher Antwort

### Intelligentes Lernsystem
Die App verwendet ein gewichtetes Auswahlsystem:

- **Nie gefragt:** Höchste Priorität (Faktor 10)
- **Fehlerquote:** Mehr Fehler = höhere Wahrscheinlichkeit
- **Aktualität:** Kürzlich falsch = höhere Priorität
- **Erfolgsrate:** Niedrige Erfolgsrate = höhere Gewichtung

### Statistiken
- Gesamtanzahl absolvierter Prüfungen
- Bestandene/Nicht bestandene Prüfungen
- Erfolgsquote pro Frage
- Schwierigste Fragen (Top 10)
- Niemals gestellte Fragen

## 📁 Projektstruktur

```
web/
├── index.html          # Haupt-HTML-Datei
├── style.css           # Responsive Design (Mobile-first)
├── app.js              # Hauptlogik (Prüfung, Navigation)
├── user-stats.js       # Statistik-Tracking (LocalStorage)
├── service-worker.js   # Offline-Funktionalität
├── manifest.json       # PWA-Manifest (Installierbarkeit)
├── questions_SRC.json  # Fragendatenbank (180 Fragen)
├── icon-192.png        # App-Icon (192x192)
└── icon-512.png        # App-Icon (512x512)
```

## 🛠️ Technologien

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage:** LocalStorage für Statistiken
- **PWA:** Service Worker für Offline-Modus
- **Icons:** Benötigt (siehe unten)

## 🎨 Icons erstellen

Die App benötigt noch Icons. Du kannst sie mit einem Online-Tool erstellen:

1. Gehe zu: https://www.favicon-generator.org/
2. Erstelle ein einfaches Icon mit dem Text "SRC"
3. Lade 192x192 und 512x512 PNG herunter
4. Speichere als `icon-192.png` und `icon-512.png` im `web/` Ordner

Oder verwende ImageMagick:
```bash
# Einfaches Icon mit Text erstellen
convert -size 512x512 xc:#2980b9 -font Arial-Bold -pointsize 200 \
  -fill white -gravity center -annotate +0+0 "SRC" icon-512.png

convert icon-512.png -resize 192x192 icon-192.png
```

## 📊 Datenformat

Die Fragen sind im JSON-Format gespeichert:

```json
{
  "number": 1,
  "question": "Was bedeutet SRC?",
  "answers": [
    "Short Range Certificate",
    "Sea Radio Certificate",
    "Ship Radio Certificate",
    "Safety Radio Certificate"
  ],
  "correct_answer": 0,
  "source": "SRC_Fragen_Komplett.pdf"
}
```

**Wichtig:** Die richtige Antwort ist immer an Index 0. Die App mischt die Antworten automatisch!

## 🔧 Python-Version

Das Projekt enthält auch eine Desktop-Version mit Pygame:

```bash
# Python-Umgebung aktivieren
source .venv/bin/activate

# Pygame-Version starten
python exam_program.py
```

## 📄 Lizenz

Dieses Projekt ist für Lernzwecke erstellt. Die Prüfungsfragen stammen aus offiziellen SRC-Prüfungsunterlagen.

## 🤝 Beitragen

Pull Requests sind willkommen! Für größere Änderungen öffne bitte zuerst ein Issue.

## 📞 Support

Bei Fragen oder Problemen öffne ein Issue auf GitHub.

---

**Viel Erfolg bei der Prüfungsvorbereitung! ⚓📻**
