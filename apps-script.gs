/* Rating Playground — Google Apps Script Web App (results collector)
 *
 * This is the optional "one shared Google Sheet" data sink. Without it, results
 * stay only in each tester's browser + clipboard. With it, every finished run
 * lands as a row in a Sheet you own.
 *
 * SETUP (about 3 minutes):
 *   1. Make a new Google Sheet (this is where results land).
 *   2. Extensions → Apps Script. Delete the starter code, paste THIS in, Save.
 *   3. Deploy → New deployment → gear icon → "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Authorize when prompted.
 *   4. Copy the Web app URL (…/exec) and paste it into CONFIG.endpoint in index.html,
 *      then commit + push. Done — new runs append to the "runs" tab.
 *
 * To read results: just open the Sheet. Each row is one run; the last column keeps
 * the full raw JSON in case you want the reactions/feelings later.
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('runs') || ss.insertSheet('runs');
  var data = JSON.parse(e.postData.contents);

  var headers = ['ts', 'name', 'item', 'favorite', 'note', 'betterSystem', 'order',
                 'stars5', 'whole6', 'slider', 'sliderfeel', 'seeded', 'raw'];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);

  var byId = {};
  (data.ratings || []).forEach(function (r) { byId[r.system] = r.display; });

  sheet.appendRow([
    data.ts, data.name, data.item, data.favorite, data.note, data.betterSystem,
    (data.order || []).join(' > '),
    byId.stars5 || '', byId.whole6 || '', byId.slider || '',
    byId.sliderfeel || '', byId.seeded || '',
    JSON.stringify(data)
  ]);
  return ContentService.createTextOutput('ok');
}
