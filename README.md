# Lillebamse og Bella

Spill og interaktive eventyr om to kosedyr: ulven Bella og bamsen Lillebamse.

| Fil | Hva det er |
|---|---|
| `index.html` | Startsiden der du velger spill |
| `rodhette.html` | Den røde hetta – et snilt Rødhette-eventyr der du velger hva som skjer |
| `tordenborgen.html` | Tordenborgen – en fortelling der du velger hva som skjer |
| `regnbuehopp.html` | Regnbuehopp – klatrespill med regnbuer |
| `gresskarnatta.html` | Gresskarnatta – Halloween-spill med kosebobler (1–2 spillere) |
| `veien-hjem.html` | Veien hjem til hytta – gåter, gangetabellen og tekstoppgaver |

Alt er vanlig HTML, CSS og JavaScript i hver sin fil. Ingenting må bygges eller installeres. Åpne `index.html` i en nettleser, eller slå på GitHub Pages for å spille på nett.

**Taster:** E er hovedknappen i alle spillene. P eller Esc åpner menyen og innstillingene.

**Som app:** Siden kan installeres på hjemskjermen (iPad/iPhone: Del → «Legg til på Hjem-skjerm» i Safari; Android: «Installer app» i Chrome). `manifest.webmanifest` og ikonene gjør den til en app, og `sw.js` lagrer alle spillene og lydfilene på enheten, så alt virker uten internett. Ikonene lages med `tools/lag_ikoner.ps1`.

**Opplesing i eventyrene:** Hvert avsnitt har en ferdig innspilt lydfil i `lyd/`, laget med Microsofts gratis norske stemme Pernille gjennom [edge-tts](https://github.com/rany2/edge-tts). Endrer du teksten, lager du nye lydfiler med:

```
python -m pip install edge-tts mini-racer
python tools/lag_lyd.py
```
