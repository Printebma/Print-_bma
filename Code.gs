const SHEETS = {
  config: 'CONFIG',
  products: 'PRODUTOS',
  sales: 'VENDAS',
  movements: 'MOVIMENTACOES',
  stores: 'LOJAS'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('PRINTÊ Manager')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, SHEETS.config, ['key','value']);
  ensureSheet_(ss, SHEETS.products, ['id','name','peso','tempo','acab','acc','estoque','sku','obs']);
  ensureSheet_(ss, SHEETS.sales, ['id','date','pid','name','q','total','lucro','type','store']);
  ensureSheet_(ss, SHEETS.movements, ['id','date','pid','type','q','reason']);
  ensureSheet_(ss, SHEETS.stores, ['id','name','contact','obs']);
  const sh = ss.getSheetByName(SHEETS.config);
  if (sh.getLastRow() < 2) {
    const c = {fil:130,w:350,e:1.061,a1:5100,vida:3000,mao:20,man:5,com:30,atacadoCom:15,marg:40};
    sh.getRange(2,1,Object.keys(c).length,2).setValues(Object.entries(c));
  }
  return 'OK';
}

function getDB() {
  setup();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const db = {c:{},p:[],s:[],m:[],stores:[]};
  const cfg = rows_(ss.getSheetByName(SHEETS.config));
  cfg.forEach(r => { if (r[0]) db.c[String(r[0])] = Number(r[1]); });
  const p = rows_(ss.getSheetByName(SHEETS.products));
  db.p = p.map(r => ({id:Number(r[0]),name:String(r[1]),peso:Number(r[2]),tempo:Number(r[3]),acab:Number(r[4]),acc:Number(r[5]),estoque:Number(r[6]),sku:String(r[7]||''),obs:String(r[8]||'')}));
  const s = rows_(ss.getSheetByName(SHEETS.sales));
  db.s = s.map(r => ({id:Number(r[0]),date:String(r[1]),pid:Number(r[2]),name:String(r[3]),q:Number(r[4]),total:Number(r[5]),lucro:Number(r[6]),type:String(r[7]||''),store:r[8]===''||r[8]==null?'':Number(r[8])}));
  const m = rows_(ss.getSheetByName(SHEETS.movements));
  db.m = m.map(r => ({id:Number(r[0]),date:String(r[1]),pid:Number(r[2]),type:String(r[3]),q:Number(r[4]),reason:String(r[5]||'')}));
  const st = rows_(ss.getSheetByName(SHEETS.stores));
  db.stores = st.map(r => ({id:Number(r[0]),name:String(r[1]),contact:String(r[2]||''),obs:String(r[3]||'')}));
  return db;
}

function saveDB(db) {
  setup();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const csh = ss.getSheetByName(SHEETS.config);
  clearData_(csh, 2);
  csh.getRange(2,1,Object.keys(db.c).length,2).setValues(Object.entries(db.c));
  write_(ss.getSheetByName(SHEETS.products), ['id','name','peso','tempo','acab','acc','estoque','sku','obs'], db.p.map(x=>[x.id,x.name,x.peso,x.tempo,x.acab,x.acc,x.estoque,x.sku||'',x.obs||'']));
  write_(ss.getSheetByName(SHEETS.sales), ['id','date','pid','name','q','total','lucro','type','store'], db.s.map(x=>[x.id,x.date,x.pid,x.name,x.q,x.total,x.lucro,x.type||'',x.store===''||x.store==null?'':x.store]));
  write_(ss.getSheetByName(SHEETS.movements), ['id','date','pid','type','q','reason'], db.m.map(x=>[x.id,x.date,x.pid,x.type,x.q,x.reason||'']));
  write_(ss.getSheetByName(SHEETS.stores), ['id','name','contact','obs'], db.stores.map(x=>[x.id,x.name,x.contact||'',x.obs||'']));
  SpreadsheetApp.flush();
  return true;
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.getRange(1,1,1,headers.length).setValues([headers]);
  return sh;
}
function rows_(sh) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2,1,last-1,sh.getLastColumn()).getValues();
}
function clearData_(sh, startRow) {
  const n = sh.getLastRow();
  if (n >= startRow) sh.getRange(startRow,1,n-startRow+1,sh.getLastColumn()).clearContent();
}
function write_(sh, headers, data) {
  clearData_(sh,2);
  if (data.length) sh.getRange(2,1,data.length,headers.length).setValues(data);
}
