# SRC Prüfung - Progressive Web App

Eine Progressive Web App (PWA) für das Training zur SRC (Short Range Certificate) Funkzeugnis-Prüfung.

🌐 **Live-Demo:** [https://maggo83.github.io/SRC_TheoriePruefer/](https://maggo83.github.io/SRC_TheoriePruefer/)

## 🚀 Features

- ✅ **180 Prüfungsfragen** aus den offiziellen SRC-Prüfungsunterlagen
- 📊 **Intelligentes Lernsystem** mit gewichteter Fragenauswahl
- 💾 **Automatische Statistikverfolgung** (LocalStorage)
- 📱 **Vollständig offline-fähig** (Service Worker)
- 🎯 **Sofortiges Feedback** nach jeder Antwort
- 📈 **Detaillierte Lernfortschrittsanzeige**
- 🔄 **Adaptive Schwierigkeitsanpassung** basierend auf Lernfortschritt
- 📲 **Installierbar auf allen Plattformen** (Android, iOS, Desktop)

## 📱 Installation & Nutzung

### Online-Version

Die App ist direkt über GitHub Pages verfügbar:

1. Öffne: [https://maggo83.github.io/SRC_TheoriePruefer/](https://maggo83.github.io/SRC_TheoriePruefer/)
2. **Installation:**
   - **Android/Chrome:** Menü → "App installieren"
   - **iOS/Safari:** Teilen → "Zum Home-Bildschirm"
   - **Desktop:** Installationssymbol in der Adressleiste

### Lokaler Test

```bash
# Repository klonen
git clone https://github.com/maggo83/SRC_TheoriePruefer.git
cd SRC_TheoriePruefer/web

# Lokalen Server starten
python3 -m http.server 8000

# Browser öffnen: http://localhost:8000
```

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
├── icon-512.png        # App-Icon (512x512)
└── README.md           # Diese Datei
```

## 🛠️ Technologien

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage:** LocalStorage für Statistiken
- **PWA:** Service Worker für Offline-Modus
- **Hosting:** GitHub Pages

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

## 🤝 Beitragen

Pull Requests sind willkommen! Für größere Änderungen öffne bitte zuerst ein Issue.

## 📄 Lizenz

Dieses Projekt ist für Lernzwecke erstellt. Die Prüfungsfragen stammen aus offiziellen SRC-Prüfungsunterlagen.

---

**Viel Erfolg bei der Prüfungsvorbereitung! ⚓📻**
