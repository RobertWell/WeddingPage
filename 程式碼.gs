const CONFIG_SHEET = 'config';
const RSVP_SHEET = 'rsvp';

function doGet(e) {
  if (e && e.parameter && e.parameter.resource === 'config') {
    return buildCsvResponse_(getConfigCsv_());
  }
  return jsonResponse_({ status: 'ready' });
}

function doOptions(e) {
  // CORS is handled by the deployment configuration
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const params = (e && e.parameter) || {};
  let payload = {};
  if (e && e.postData && e.postData.contents && e.postData.type === 'application/json') {
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (err) {
      payload = {};
    }
  }
  const getField = (key) => {
    if (payload[key] !== undefined && payload[key] !== null) {
      const val = payload[key];
      return typeof val === 'string' ? val.trim() : val;
    }
    if (params[key] !== undefined && params[key] !== null) {
      const val = params[key];
      return typeof val === 'string' ? val.trim() : val;
    }
    return '';
  };

  const name = getField('name');
  const guests = getField('guests');
  const diet = getField('diet');
  const message = getField('message');
  const locale = getField('locale') || 'zh';
  const source = getField('source') || 'web';

  if (!name || !guests || !diet) {
    return jsonResponse_({ status: 'error', message: 'Missing required fields' });
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName(RSVP_SHEET);
  if (!sheet) return jsonResponse_({ status: 'error', message: 'RSVP sheet missing' });

  const timestamp = new Date();
  sheet.appendRow([
    timestamp,
    name,
    guests,
    diet,
    message,
    locale,
    source,
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
