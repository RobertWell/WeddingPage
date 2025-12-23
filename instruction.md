# Google Sheets / Google Apps Script Guide

This project keeps presentation content in `config.csv` and pushes RSVP submissions into a Google Sheet through an Apps Script web app. Follow the steps below to recreate the same setup in your own Google account.

---

## 1. Prepare the Spreadsheet

1. Create a new Google Sheet (for example “Forest Wedding”).
2. Add two tabs:
   - `config` – columns: `key`, `zh`, `en`. Copy/paste the entire contents of `config.csv` (row 1 should be the header).
   - `rsvp` – columns: `Timestamp`, `Name`, `Guests`, `Diet`, `Message`, `Locale`, `Source`. You can rename or add columns, but keep the first row as the header so the script can append rows.
3. Share the sheet with anyone who needs to edit the text or view RSVPs. Visitors to the website never access the sheet directly; they only hit the Apps Script endpoint.

---

## 2. Create the Apps Script Web App

1. Inside the sheet choose **Extensions → Apps Script**.
2. Replace the default `Code.gs` with the script below (update the sheet names at the top if you changed them):

```gs
const CONFIG_SHEET = 'config';
const RSVP_SHEET = 'rsvp';

function doGet(e) {
  if (e && e.parameter && e.parameter.resource === 'config') {
    return buildCsvResponse_(getConfigCsv_());
  }
  return jsonResponse_({ status: 'ready' });
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return jsonResponse_({ status: 'error', message: 'Missing payload' }, 400);
  }
  const payload = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActive().getSheetByName(RSVP_SHEET);
  if (!sheet) return jsonResponse_({ status: 'error', message: 'RSVP sheet missing' }, 500);

  const timestamp = new Date();
  sheet.appendRow([
    timestamp,
    payload.name || '',
    payload.guests || '',
    payload.diet || '',
    payload.message || '',
    payload.locale || '',
    payload.source || 'web',
  ]);

  return jsonResponse_({ status: 'success' });
}

function getConfigCsv_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET);
  if (!sheet) throw new Error('Config sheet not found');
  const values = sheet.getDataRange().getDisplayValues();
  return values.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

function buildCsvResponse_(csv) {
  return ContentService.createTextOutput(csv)
    .setMimeType(ContentService.MimeType.CSV)
    .setHeader('Access-Control-Allow-Origin', '*');
}

function jsonResponse_(obj, status = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
  if (status !== 200) {
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    output.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  }
  return output;
}
```

3. Click **Deploy → New deployment → Web app**.
   - Description: e.g. “Forest Wedding API”.
   - “Execute as”: **Me**.
   - “Who has access”: **Anyone** (or “Anyone with the link”).
   - Save the deployment; note the Web App URL (looks like `https://script.google.com/macros/s/XXXXX/exec`).

---

## 3. Connect the Website

1. Open `index.html` and locate the `<body>` tag. Update the data attributes:

```html
<body
  class="bg-parchment text-pine"
  data-config-src="https://script.google.com/macros/s/AKfycbw5glgrF8ODvZ_X5onkXlXAlwPa19jo-mBdNJ5tu80rZ6rhYeracZrJOxumVRNK0ecs/exec?resource=config"
  data-default-lang="zh"
  data-rsvp-endpoint="https://script.google.com/macros/s/AKfycbw5glgrF8ODvZ_X5onkXlXAlwPa19jo-mBdNJ5tu80rZ6rhYeracZrJOxumVRNK0ecs/exec"
>
```

   - Use the **same** Apps Script URL for both attributes; append `?resource=config` when requesting the CSV.
   - Alternatively, set `window.CONFIG_SOURCE_URL` or `window.RSVP_ENDPOINT` before the script block if you prefer not to modify the HTML.
2. Redeploy the site (GitHub Pages, Netlify, etc.). When the page loads it fetches the CSV from your web app, so every change made inside the Google Sheet appears automatically.

---

## 4. Using the Sheets

- **Updating copy**: edit the `config` sheet directly. Each `key` maps to the `data-config` attribute in `index.html`. Save the sheet; visitors see the new text after the next reload.
- **Managing languages**: add more language columns (e.g., `ja`). The site automatically exposes a language switch button when a column exists.
- **Tracking RSVPs**: open the `rsvp` sheet to see responses. Each submission adds a timestamped row with the data sent from the form.
- **Resending / testing**: Use the dev tools console to call `window.RSVP_ENDPOINT` with `fetch` manually, or fill the form on the page.

Now both the display content and RSVP data flow through Google Sheets while the static site remains GitHub-Pages friendly.
