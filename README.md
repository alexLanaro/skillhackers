# Sito Skill Hackers

Sito di [skillhackers.it](https://skillhackers.it), costruito con [Eleventy](https://www.11ty.dev/) e pubblicato su Netlify.
Ogni modifica salvata su GitHub viene pubblicata in automatico.

## Cosa serve

- **Node.js** versione 22 (LTS), da [nodejs.org](https://nodejs.org)
- **Git** e un account **GitHub**
- **Visual Studio Code**
- Un account **Netlify**

## Primo avvio in locale

1. Estrai lo zip e apri la cartella `skillhackers-site` in VS Code (File → Apri cartella).
2. VS Code ti suggerirà l'estensione **Nunjucks** per colorare i template: installala.
3. Apri il terminale (Terminale → Nuovo terminale) e lancia una sola volta:
   ```
   npm install
   ```
4. Per vedere il sito mentre lo modifichi:
   ```
   npm start
   ```
   Apri [http://localhost:8080](http://localhost:8080). Ogni volta che salvi un file, la pagina si aggiorna da sola.
   Per fermare il server: `Ctrl + C` nel terminale.

## Dove si modifica cosa

| Voglio cambiare… | File |
|---|---|
| Il testo di una pagina | `src/nome-pagina.njk` (italiano) e `src/en/nome-pagina.njk` (inglese) |
| Voci del menu e del footer | `src/_data/i18n.json` (testi) e `src/_includes/partials/nav.njk`, `footer.njk` (struttura) |
| Email, link di prenotazione, P.IVA, LinkedIn | `src/_data/site.json` |
| Loghi del carosello clienti | `src/_data/clients.json` |
| Corsi della formazione corporate | `src/_data/courses.json` |
| Colori, font, spaziature | `src/assets/css/style.css` (le variabili principali sono in cima al file) |
| Animazioni e carosello | `src/assets/js/main.js` |
| Redirect da vecchi indirizzi | `src/_redirects` |

Tre regole da ricordare:

- **Ogni pagina esiste in due lingue.** Se modifichi un testo in `src/`, ricordati la versione in `src/en/`.
- **Non togliere il blocco tra i due `---`** in cima a ogni pagina: contiene titolo, descrizione per Google e indirizzo della pagina.
- **Non modificare la cartella `_site`**: viene rigenerata a ogni avvio e non finisce su GitHub.

## Operazioni frequenti

**Aggiungere un logo cliente.** Salva il logo (PNG o SVG con sfondo trasparente) in `src/assets/img/clients/`, poi aggiungi una riga in `src/_data/clients.json`:
```json
{ "name": "Nome Azienda", "logo": "/assets/img/clients/nome-azienda.png" }
```
Il carosello si divide da solo su due righe. Se un file manca, al suo posto compare il nome dell'azienda.

Loghi ancora da caricare (i nomi sono già pronti in `clients.json`): `poste-italiane.png`, `enel.png`, `luxottica.png`, `publicis-groupe.png`, `publitalia.png`, `24ore-business-school.png`, `ceres.png`.

**Aggiungere o modificare un corso corporate.** In `src/_data/courses.json` ogni corso ha titolo, sottotitolo, target, obiettivo, durata e programma. C'è una lista per l'italiano (`it`) e una per l'inglese (`en`).

**Aggiungere un case study.**
1. Duplica `src/caso-studio-cariverona.njk` con un nuovo nome, per esempio `caso-studio-nomecliente.njk`.
2. Nel blocco in cima aggiorna `key`, `permalink`, `title` e `description` con il nuovo nome del file.
3. Riscrivi i contenuti.
4. In `src/casi-studio.njk` aggiungi una scheda copiando una delle esistenti (`<a href="caso-studio-..." class="case-card ...">`).
5. Aggiungi il nome del file all'elenco `pages` in `src/_data/site.json`, così entra nella sitemap.
6. Ripeti per la versione inglese in `src/en/`.

## Pubblicare: GitHub

Da fare una sola volta, tutto da VS Code:

1. Apri il pannello **Controllo del codice sorgente** (icona a sinistra con i tre pallini collegati).
2. Clicca **Inizializza repository**.
3. Scrivi un messaggio, per esempio `Prima versione del sito`, e clicca **Commit** (se chiede di includere tutti i file, rispondi sì).
4. Clicca **Pubblica Branch**, scegli **repository privato** e accedi a GitHub se richiesto.

Da qui in avanti, per pubblicare una modifica: **Commit** con un messaggio che descrive cosa hai cambiato, poi **Sincronizza modifiche**.

## Pubblicare: Netlify

Da fare una sola volta:

1. Su Netlify: **Add new site → Import an existing project → GitHub**, e scegli il repository `skillhackers-site`.
2. Le impostazioni di build vengono lette da `netlify.toml`: non serve cambiare nulla. Clicca **Deploy**.
3. Controlla il sito sull'indirizzo provvisorio `.netlify.app`.

Da qui in avanti ogni push su GitHub viene pubblicato in automatico in uno o due minuti.

## Collegare il dominio skillhackers.it

1. In Netlify, **Domain management → Add a domain** e inserisci `skillhackers.it`.
2. Netlify mostra i record DNS da aggiungere dal pannello del tuo provider (di solito uno per `skillhackers.it` e un CNAME per `www`). Aggiungi **solo quelli**.
3. **Non toccare** i record MX, autodiscover, i TXT (SPF, DKIM, DMARC) e il CNAME di `learn`: servono per email e piattaforma corsi.
4. Il certificato HTTPS si attiva da solo entro qualche ora.
5. Dopo la pubblicazione, invia `https://skillhackers.it/sitemap.xml` a Google Search Console.

## Crediti

L'icona di Power BI viene dal pacchetto ufficiale [microsoft/PowerBI-Icons](https://github.com/microsoft/PowerBI-Icons) (licenza CC BY 4.0). Le icone di Excel, Word e PowerPoint sono caricate da Wikimedia Commons.
