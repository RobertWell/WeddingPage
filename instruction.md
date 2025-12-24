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
// Replace with your spreadsheet ID when using a standalone Apps Script project.
const SPREADSHEET_ID = '';

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActive();
}

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
  const spreadsheet = getSpreadsheet_();
  if (!spreadsheet) return jsonResponse_({ status: 'error', message: 'Spreadsheet not found' }, 500);
  const sheet = spreadsheet.getSheetByName(RSVP_SHEET);
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
  const spreadsheet = getSpreadsheet_();
  if (!spreadsheet) throw new Error('Spreadsheet not found');
  const sheet = spreadsheet.getSheetByName(CONFIG_SHEET);
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

---

## 5. Enhancement: Config-Driven Backgrounds (No UI)

This enhancement lets you change the hero image and overall background purely via the `config` sheet. There is no in-page UI, which keeps the page simple and avoids client-side security concerns.

### 5.1. Background Configuration Keys

Add the following keys to the `config` sheet:

| key | zh | en | purpose |
| --- | --- | --- | --- |
| `hero.imageUrl` | `https://storage.googleapis.com/<bucket>/hero-forest.jpg` | same as `zh` | Hero background image URL. |
| `hero.imagePosition` | `50% 30%` | same as `zh` | Image focal point (maps to `object-position` or CSS background-position). |
| `hero.overlayOpacity` | `0.7` | same as `zh` | Opacity for the hero gradient overlay. |
| `body.background` | `radial-gradient(...), linear-gradient(...)` | same as `zh` | Optional page background. Leave empty to keep defaults. |

**Why this works:** the image URL and its position live together in the config, so there is no extra “mapping file.” Changing the sheet updates the display at page load.

### 5.2. Host Images on Google Cloud Storage (GCS)

1. **Create a bucket**
   - In Google Cloud Console → **Storage** → **Buckets** → **Create**.
   - Example name: `wedding-backgrounds`.
2. **Upload images**
   - Upload your hero images to the bucket (e.g., `hero-forest.jpg`, `hero-sunset.jpg`).
3. **Make the images public**
   - Select uploaded objects → **Permissions** → grant **allUsers** the **Storage Object Viewer** role.
   - Alternatively, set bucket-level public access if appropriate for your use case.
4. **Copy the image URL**
   - Use the public URL format:
     `https://storage.googleapis.com/<bucket>/<file>`
   - Paste this URL into `hero.imageUrl` in the `config` sheet.

### 5.3. Choose the Image Focal Point

To keep the important part of the image visible, set `hero.imagePosition` in the sheet:

- Center: `50% 50%`
- Top: `50% 20%`
- Off-center left: `35% 40%`

If a face or couple is in the image, adjust the percentages so the subject stays centered on mobile.

### 5.4. Optional Body Background Control

To override the page background, set `body.background` to a valid CSS background string:

```
radial-gradient(circle at 10% 20%, #ffffff 0, transparent 55%),
radial-gradient(circle at 80% 0%, #f0ebdf 0, transparent 50%),
linear-gradient(135deg, #fdfaf5, #f3f5ee 60%, #e9efdc)
```

Leave the cell empty to use the default design.

### 5.5. Implementation Notes (for future code work)

- The hero image currently uses an `<img>` in `index.html`. You can continue to use it and apply `object-position` using `hero.imagePosition`.
- Alternatively, convert the hero to a CSS background layer and apply `hero.imageUrl` and `hero.imagePosition` as CSS variables.
- Apply `hero.overlayOpacity` to the hero overlay’s opacity so text contrast remains legible across different images.
