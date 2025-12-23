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
  return ContentService.createTextOutput(csv).setMimeType(ContentService.MimeType.CSV);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
