# Lillebamse og Bella

Spill og en interaktiv fortelling om to kosedyr: ulven Bella og bamsen Lillebamse.

| Fil | Hva det er |
|---|---|
| `index.html` | Startsiden der du velger spill |
| `tordenborgen.html` | Tordenborgen – en fortelling der du velger hva som skjer |
| `regnbuehopp.html` | Regnbuehopp – klatrespill med regnbuer |
| `gresskarnatta.html` | Gresskarnatta – Halloween-spill med kosebobler (1–2 spillere) |
| `veien-hjem.html` | Veien hjem til hytta – gåter, gangetabellen og tekstoppgaver |

Alt er vanlig HTML, CSS og JavaScript i hver sin fil. Ingenting må bygges eller installeres. Åpne `index.html` i en nettleser, eller slå på GitHub Pages for å spille på nett.

**Taster:** E er hovedknappen i alle spillene. P eller Esc åpner menyen og innstillingene.

**Opplesing i Tordenborgen:** Hvert avsnitt har en ferdig innspilt lydfil i `lyd/`, laget med Microsofts gratis norske stemme Pernille gjennom [edge-tts](https://github.com/rany2/edge-tts). Endrer du teksten, lager du nye lydfiler med:

```
python -m pip install edge-tts mini-racer
python tools/lag_lyd.py
```
