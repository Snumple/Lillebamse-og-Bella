# Lillebamse og Bella

Spill og interaktive eventyr om to kosedyr: ulven Bella og bamsen Lillebamse.

| Fil | Hva det er |
|---|---|
| `index.html` | Startsiden der du velger spill |
| `ferie.html` | Ferie i Syden – velg klær, bad i bassenget og havet, karuseller i fornøyelsesparken, hengekøyer på balkongen |
| `overnatting.html` | Overnatting hos Lillebamse – film, godteri, tannpuss, leggetid og hundetur |
| `gjemsel.html` | Gjemsel hos Eira – stigespill, så gjemsel i hele huset med Eira, Isabella, Valentina, Bella og Lillebamse |
| `bursdag.html` | Bellas bursdag – ti dyr kommer på besøk, pølser, kake, gaver, og bading i bassenget |
| `lillabilen.html` | Den lilla bilen – velg klær, kjør til butikken og fly over bilene, betal i kassa og sett varene på plass |
| `skoleveien.html` | Skoleveien – gå til skolen med Kua og Kyllingen; oppgaver, gåter og staving, og lærer Reke i klasserommet |
| `ulvekongen.html` | Ulvenes konge – Halloween-plattformspill der Bella er datteren til ulvekongen |
| `kalkunkongen.html` | Kalkunkongen – hopp over pratsomme kalkunsoldater; blir du tatt, må du løse en oppgave |
| `rodhette.html` | Den røde hetta – et snilt Rødhette-eventyr der du velger hva som skjer |
| `tordenborgen.html` | Tordenborgen – en fortelling der du velger hva som skjer |
| `regnbuehopp.html` | Regnbuehopp – klatrespill med regnbuer |
| `gresskarnatta.html` | Gresskarnatta – Halloween-spill med kosebobler (1–2 spillere) |
| `veien-hjem.html` | Veien hjem til hytta – gåter, gangetabellen og tekstoppgaver |

Alt er vanlig HTML, CSS og JavaScript i hver sin fil. Ingenting må bygges eller installeres. Åpne `index.html` i en nettleser, eller slå på GitHub Pages for å spille på nett.

**Taster:** E er hovedknappen i alle spillene. P eller Esc åpner menyen og innstillingene.

**Som app:** Siden kan installeres på hjemskjermen (iPad/iPhone: Del → «Legg til på Hjem-skjerm» i Safari; Android: «Installer app» i Chrome). `manifest.webmanifest` og ikonene gjør den til en app, og `sw.js` lagrer alle spillene og lydfilene på enheten, så alt virker uten internett. Ikonene lages med `tools/lag_ikoner.ps1`.

**Opplesing og stemmer:** Hvert avsnitt i eventyrene og hver replikk i Kalkunkongen, Skoleveien, Den lilla bilen, Bellas bursdag, Gjemsel hos Eira, Overnatting hos Lillebamse og Ferie i Syden har en ferdig innspilt lydfil i `lyd/`, laget med Microsofts gratis norske stemmer (Pernille og Finn) gjennom [edge-tts](https://github.com/rany2/edge-tts). Replikkene i spillene står i `<script id="stemmer">` øverst i filen. Endrer du teksten, lager du nye lydfiler med:

```
python -m pip install edge-tts mini-racer
python tools/lag_lyd.py
```
