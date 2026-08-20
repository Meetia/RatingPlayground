/* Rating Playground — Google Apps Script Web App (results collector)
 *
 * This is the optional "one shared Google Sheet" data sink. Without it, results
 * stay only in each tester's browser + clipboard. With it, every finished run
 * lands as a row in a Sheet you own.
 *
 * SETUP (about 3 minutes):
 *   1. Make a new Google Sheet (this is where results land).
 *   2. From THAT sheet: Extensions → Apps Script. (Opening it this way is what
 *      "binds" the script to the sheet — see debugging note below.) Delete the
 *      starter code, paste THIS in, Save.
 *   3. Deploy → New deployment → gear icon → "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone        <-- must be "Anyone", not "Anyone with a Google account"
 *      Authorize when prompted.
 *   4. Copy the Web app URL (…/exec) and paste it into CONFIG.endpoint in index.html,
 *      then commit + push.
 *
 * DEBUGGING — if the sheet isn't updating, work through these in order:
 *   A. Open the …/exec URL directly in a browser. You should see
 *      "collector is live. runs rows: N". That confirms the URL routes to THIS
 *      code, the deployment is current, and the script is bound to a sheet.
 *        - "ERROR: not bound…"          → the script isn't attached to a sheet (step 2). See below.
 *        - redirects to a Google login  → the deployment's access isn't "Anyone" (step 3).
 *        - "Script function not found: doGet" → you deployed an OLD version; redeploy (see D).
 *   B. In the editor, select `testInsert` in the function dropdown and click Run.
 *      If a row appears in the sheet, the script + binding are fine and the problem
 *      is the web-app plumbing (endpoint URL / access / redeploy). If it errors,
 *      the problem is the script/binding (read the error).
 *   C. Editor left sidebar → Executions. Do a run on the live site, then refresh.
 *        - a `doPost` row appears (maybe red/errored) → requests ARE arriving; read the error.
 *        - NO row appears                              → requests aren't reaching the script:
 *          wrong URL, access not "Anyone", or CONFIG.endpoint isn't set on the live page.
 *   D. Edited the script? Changes only go live on redeploy:
 *      Deploy → Manage deployments → (pencil) Edit → Version: New version → Deploy.
 *      The …/exec URL stays the same.
 *
 * "Bound" means the script was created from the sheet's Extensions menu, so
 * SpreadsheetApp.getActiveSpreadsheet() returns that sheet. If you made a STANDALONE
 * script (script.google.com → New project), getActiveSpreadsheet() is null and nothing
 * writes — either recreate it from Extensions → Apps Script, or replace
 * getActiveSpreadsheet() below with SpreadsheetApp.openById('YOUR_SHEET_ID').
 */

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('runs') || ss.insertSheet('runs');
  var data = JSON.parse(e.postData.contents);

  // one score column + one reactions column per system, interleaved
  var headers = ['ts', 'name', 'item', 'favorite', 'note', 'betterSystem', 'order',
                 'stars5', 'stars5_reactions',
                 'whole6', 'whole6_reactions',
                 'slider', 'slider_reactions',
                 'sliderfeel', 'sliderfeel_feeling', 'sliderfeel_reactions',
                 'seeded', 'seeded_reactions',
                 'criteria', 'criteria_detail', 'criteria_gut', 'criteria_reactions',
                 'raw'];

  // write/refresh the header row if it's empty or the schema changed
  var current = sheet.getLastRow() ? sheet.getRange(1, 1, 1, headers.length).getValues()[0] : [];
  if (current.join('|') !== headers.join('|')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  var RLBL = { easy: 'easy', quick: 'quick', expressive: 'expressive',
               lowload: 'low-effort', decisive: 'decisive' };
  var byId = {}, byReact = {}, feeling = '', critDetail = '', critGut = '';
  (data.ratings || []).forEach(function (r) {
    byId[r.system] = r.display;
    if (r.system === 'sliderfeel') feeling = r.feeling || '';
    if (r.system === 'criteria') { critDetail = r.detail || ''; critGut = (r.gut == null ? '' : r.gut); }
    var on = [];
    var rx = r.reactions || {};
    Object.keys(rx).forEach(function (k) { if (rx[k]) on.push(RLBL[k] || k); });
    byReact[r.system] = on.join(', ');
  });

  sheet.appendRow([
    data.ts, data.name, data.item, data.favorite, data.note, data.betterSystem,
    (data.order || []).join(' > '),
    byId.stars5 || '',     byReact.stars5 || '',
    byId.whole6 || '',     byReact.whole6 || '',
    byId.slider || '',     byReact.slider || '',
    byId.sliderfeel || '', feeling, byReact.sliderfeel || '',
    byId.seeded || '',     byReact.seeded || '',
    byId.criteria || '',   critDetail, critGut, byReact.criteria || '',
    JSON.stringify(data)
  ]);
  return ContentService.createTextOutput('ok');
}

/* Health check — open the /exec URL in a browser to hit this. */
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    return ContentService.createTextOutput(
      'ERROR: not bound to a Sheet (getActiveSpreadsheet is null). Recreate the script from the ' +
      'Sheet’s Extensions → Apps Script, or use SpreadsheetApp.openById(…).');
  }
  var sheet = ss.getSheetByName('runs');
  var rows = sheet ? sheet.getLastRow() : 0;
  return ContentService.createTextOutput('Rating Playground collector is live. runs rows: ' + rows);
}

/* Diagnostic — run this from the editor to write one test row without the web page. */
function testInsert() {
  doPost({ postData: { contents: JSON.stringify({
    ts: new Date().toISOString(), name: 'TEST', item: 'debug run',
    favorite: null, note: 'inserted from testInsert()', betterSystem: null,
    order: [], ratings: []
  }) } });
}
