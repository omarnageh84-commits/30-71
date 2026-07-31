function renderTotal() {
  try {
    let db = JSON.parse(localStorage.getItem('dbStore') || '{}');
    let empList = [...new Set((db.employees || []).map(e => e.name).filter(Boolean))];
    let supList = [...new Set([...(db.suppliers || []).map(s => s.name || s.c1), ...(db.masrofat || []).map(s => s.c1), ...(db.arba7 || []).map(s => s.c1)].filter(Boolean))];
    let S = {
      profit: localStorage.getItem('targetProfit') || '25',
      rD: localStorage.getItem('ratioDrug') || '65',
      rC: localStorage.getItem('ratioCosm') || '25',
      rE: localStorage.getItem('ratioExp') || '10'
    };
    let totalEl = document.getElementById('total');
    if (!totalEl) return;
    totalEl.innerHTML = '<div id="total-wrap"></div>';
    let wrap = document.getElementById('total-wrap');
    wrap.innerHTML =
      '<style>' +
      '#total-wrap{font-family:Cairo,sans-serif;background:#f8fafc;padding:14px;border-radius:20px;direction:rtl}' +
      '.glass{background:#fff;border-radius:14px;padding:12px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);border:1px solid #e2e8f0}' +
      '.filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.filters input,.filters select{padding:8px 12px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700;background:#fff;outline:none}.filters button{padding:8px 16px;background:#0f172a;color:#fff;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer}' +
      '.hero{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}' +
      '@media(max-width:1100px){.hero{grid-template-columns:repeat(3,1fr)}}' +
      '@media(max-width:600px){.hero{grid-template-columns:repeat(2,1fr)}}' +
      '.h-card{border-radius:14px;padding:10px 12px;height:82px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;border:1.5px solid;transition:.2s;background:#fff;cursor:pointer;position:relative}' +
      '.h-card:hover{transform:translateY(-3px);box-shadow:0 10px 22px rgba(0,0,0,.1);border-color:#0f172a}' +
      '.h-card.active{outline:2px solid #0f172a;transform:translateY(-2px)}' +
      '.h-card label{font-size:10px;font-weight:800;opacity:.8}' +
      '.h-card b{font-size:16px;font-weight:900;line-height:1}.h-card small{font-size:9px;font-weight:700;opacity:.7}' +
      '.h-card input{width:56px;padding:5px;border-radius:8px;border:1.5px solid;font-weight:900;text-align:center;font-size:13px;background:#fff}' +
      '.h-row{display:flex;align-items:center;gap:4px;justify-content:center}' +
      '.sales{background:linear-gradient(135deg,#fefce8,#fef9c3);border-color:#fde68a;color:#713f12}' +
      '.profit{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-color:#86efac;color:#14532d}.profit input{border-color:#86efac}' +
      '.remain{background:linear-gradient(135deg,#eef2ff,#e0e7ff);border-color:#a5b4fc;color:#3730a3}' +
      '.drug{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e3a8a}.drug input{border-color:#93c5fd}' +
      '.cosm{background:linear-gradient(135deg,#fdf2f8,#fce7f3);border-color:#f9a8d4;color:#831843}.cosm input{border-color:#f9a8d4}' +
      '.exp{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#7c2d12}.exp input{border-color:#fdba74}' +
      '.budget-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px}' +
      '@media(max-width:900px){.budget-grid{grid-template-columns:1fr 1fr}}' +
      '.b-card{background:#fff;border-radius:14px;padding:12px;height:95px;display:flex;flex-direction:column;justify-content:space-between;border:1.5px solid #f1f5f9;transition:.2s;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.03)}' +
      '.b-card:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(0,0,0,.06);border-color:#0f172a}' +
      '.b-card.active{outline:2px solid #0f172a}' +
      '.b-top{display:flex;justify-content:space-between;align-items:center;font-size:10px;font-weight:800}' +
      '.b-val{font-size:14px;font-weight:900}' +
      '.prog{height:6px;background:#f1f5f9;border-radius:20px;overflow:hidden;margin-top:6px}.prog i{display:block;height:100%;border-radius:20px}' +
      'table{width:100%;border-collapse:separate;border-spacing:0;font-size:11px}th{background:#f8fafc;padding:10px 8px;font-size:10px;color:#475569;border-bottom:1.5px solid #e2e8f0;text-align:center;font-weight:800}td{padding:9px 8px;text-align:center;border-bottom:1px solid #f1f5f9}td.r{text-align:right;font-weight:700}' +
      '.badge{padding:4px 10px;border-radius:20px;font-size:9px;font-weight:800}' +
      '.detail-box{animation:slideDown.25s ease}' +
      '@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}' +
      '</style>' +
      '<div class="glass"><div class="filters">' +
      '<input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">' +
      '<input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">' +
      '<select id="totalEmp" onchange="renderTotalTable()"><option value="">كل الموظفين</option>' + empList.map(n => '<option value="' + n + '">' + n + '</option>').join('') + '</select>' +
      '<select id="totalSup" onchange="renderTotalTable()"><option value="">كل الموردين</option>' + supList.map(n => '<option value="' + n + '">' + n + '</option>').join('') + '</select>' +
      '<button onclick="clearTotalFilters()">مسح الفلتر</button>' +
      '</div></div>' +
      '<div class="hero">' +
      '<div class="h-card sales" onclick="showDetail(\'sales\')"><label>💰 المبيعات</label><b id="salesPreview">--</b><small>اضغط للتفاصيل</small></div>' +
      '<div class="h-card profit" onclick="showDetail(\'profit\')"><label>🎯 % الربح</label><div class="h-row"><input id="targetProfit" type="number" value="' + S.profit + '" oninput="saveTargets()" onclick="event.stopPropagation()"></div><small id="profitAmt">--</small></div>' +
      '<div class="h-card remain" onclick="showDetail(\'remain\')"><label>📦 المتبقي</label><b id="remainPreview">--</b><small id="remainAmt">--</small></div>' +
      '<div class="h-card drug" onclick="showDetail(\'drug\')"><label>💊 دواء</label><div class="h-row"><input id="ratioDrug" type="number" value="' + S.rD + '" oninput="saveTargets()" onclick="event.stopPropagation()"><span style="font-size:10px;font-weight:900">%</span></div><b id="drugFinalP" style="font-size:11px">--</b><small id="drugAmt">--</small></div>' +
      '<div class="h-card cosm" onclick="showDetail(\'cosm\')"><label>💖 كوزمتكس</label><div class="h-row"><input id="ratioCosm" type="number" value="' + S.rC + '" oninput="saveTargets()" onclick="event.stopPropagation()"><span style="font-size:10px;font-weight:900">%</span></div><b id="cosmFinalP" style="font-size:11px">--</b><small id="cosmAmt">--</small></div>' +
      '<div class="h-card exp" onclick="showDetail(\'exp\')"><label>💸 مصروفات</label><div class="h-row"><input id="ratioExp" type="number" value="' + S.rE + '" oninput="saveTargets()" onclick="event.stopPropagation()"><span style="font-size:10px;font-weight:900">%</span></div><b id="expFinalP" style="font-size:11px">--</b><small id="expAmt">--</small></div>' +
      '</div>' +
      '<div id="detailBox"></div>' +
      '<div id="budgetCalc"></div><div id="kpiArea" style="margin-top:12px"></div><div id="alertArea"></div><div id="mainTables" style="margin-top:12px"></div><div id="totalTableCard" style="margin-top:12px"></div>';
    renderTotalTable();
  } catch (err) { console.error(err); }
}

let lastDetailData = {};
function showDetail(type) {
  document.querySelectorAll('.h-card,.b-card').forEach(c => c.classList.remove('active'));
  if (event && event.currentTarget) event.currentTarget.classList.add('active');
  let box = document.getElementById('detailBox');
  if (!box) return;
  let d = lastDetailData;
  if (!d || !d.totalSales) { box.innerHTML = ''; return; }

  let html = '';
  if (type === 'sales') {
    html = `<div class="glass detail-box" style="border-color:#fde68a;background:#fffbeb"><b style="font-size:12px">💰 تفصيل المبيعات - جاي من اليومية (شيفت + انستا + فودافون)</b><div style="max-height:300px;overflow:auto;margin-top:10px"><table><thead><tr><th>التاريخ</th><th>كاش شيفت</th><th>انستا</th><th>فودافون</th><th>الإجمالي</th></tr></thead><tbody>${(d.salesDetail || []).map(r => `<tr><td style="font-weight:900">${r.date}</td><td>${r.cash.toLocaleString()}</td><td>${r.insta.toLocaleString()}</td><td>${r.voda.toLocaleString()}</td><td style="font-weight:900;background:#fef3c7;border-radius:8px">${r.total.toLocaleString()}</td></tr>`).join('')}</tbody><tfoot><tr style="background:#422006;color:#fef08a;font-weight:900"><td>الإجمالي</td><td>${d.cashTotal.toLocaleString()}</td><td>${d.instaTotal.toLocaleString()}</td><td>${d.vodaTotal.toLocaleString()}</td><td>${d.totalSales.toLocaleString()} ج</td></tr></tfoot></table></div></div>`;
  } else if (type === 'profit') {
    html = `<div class="glass detail-box" style="border-color:#86efac;background:#f0fdf4"><b>🎯 الربح - الحساب</b><div style="margin-top:10px;font-size:12px;line-height:2"><div>إجمالي المبيعات = <b>${d.totalSales.toLocaleString()} ج</b> (من كل أيام اليومية)</div><div>نسبة الربح اللي انت محددها = <b>${d.p}%</b></div><div>قيمة الربح = ${d.totalSales.toLocaleString()} × ${d.p}% = <b style="color:#16a34a">${d.profitAmt.toLocaleString()} ج</b></div><div>المتبقي للتشغيل = 100% - ${d.p}% = <b>${d.remain}% = ${d.remainAmt.toLocaleString()} ج</b></div></div></div>`;
  } else if (type === 'remain') {
    html = `<div class="glass detail-box" style="border-color:#a5b4fc;background:#eef2ff"><b>📦 المتبقي - توزيعه</b><div style="margin-top:10px;font-size:11px">المتبقي ${d.remain}% بيتوزع على (دواء + كوزمتكس + مصروفات) حسب النسب اللي فوق<br><br><table><tr><th>البند</th><th>نسبتك</th><th>النسبة الفعلية من الإجمالي</th><th>القيمة</th></tr><tr><td>دواء</td><td>${d.rD}%</td><td>${d.fD.toFixed(1)}%</td><td>${d.dAmt.toLocaleString()} ج</td></tr><tr><td>كوزمتكس</td><td>${d.rC}%</td><td>${d.fC.toFixed(1)}%</td><td>${d.cAmt.toLocaleString()} ج</td></tr><tr><td>مصروفات</td><td>${d.rE}%</td><td>${d.fE.toFixed(1)}%</td><td>${d.eAmt.toLocaleString()} ج</td></tr></table></div></div>`;
  } else if (type === 'drug') {
    html = `<div class="glass detail-box" style="border-color:#93c5fd;background:#eff6ff"><b>💊 تفصيل الدواء - جاي من الموردين اللي نوعهم مخزن أدوية</b><div style="max-height:300px;overflow:auto;margin-top:10px"><table><thead><tr><th>المورد</th><th>التاريخ</th><th>القيمة</th><th>من إجمالي الدواء</th></tr></thead><tbody>${(d.drugDetail || []).map(r => `<tr><td class="r">${r.name}</td><td>${r.date}</td><td style="font-weight:800">${r.val.toLocaleString()}</td><td>${(r.val / d.dAmt * 100).toFixed(1)}%</td></tr>`).join('')}</tbody><tfoot><tr style="background:#1e3a8a;color:#fff;font-weight:900"><td>الإجمالي الفعلي</td><td></td><td>${d.purDrug.toLocaleString()} ج</td><td>الميزانية ${d.dAmt.toLocaleString()} ج</td></tr></tfoot></table></div><div style="margin-top:8px;font-size:11px">المصدر: كل إدخالات <b>المورد</b> في اليومية اللي متسجل في قواعد البيانات نوعه مخزن/دواء</div></div>`;
  } else if (type === 'cosm') {
    html = `<div class="glass detail-box" style="border-color:#f9a8d4;background:#fdf2f8"><b>💖 تفصيل الكوزمتكس (ليفر + الحافظ + أي كوزمتكس) - جاي من الموردين</b><div style="max-height:300px;overflow:auto;margin-top:10px"><table><thead><tr><th>المورد</th><th>التاريخ</th><th>القيمة</th></tr></thead><tbody>${(d.cosmDetail || []).map(r => `<tr><td class="r">${r.name}</td><td>${r.date}</td><td style="font-weight:800">${r.val.toLocaleString()}</td></tr>`).join('')}</tbody><tfoot><tr style="background:#831843;color:#fff;font-weight:900"><td>الإجمالي</td><td></td><td>${d.purCosm.toLocaleString()} ج / الميزانية ${d.cAmt.toLocaleString()} ج</td></tr></tfoot></table></div></div>`;
  } else if (type === 'exp') {
    html = `<div class="glass detail-box" style="border-color:#fdba74;background:#fff7ed"><b>💸 تفصيل المصروفات - جاي من خانة المصروفات والموردين اللي نوعهم مصروفات</b><div style="max-height:300px;overflow:auto;margin-top:10px"><table><thead><tr><th>البند</th><th>التاريخ</th><th>القيمة</th></tr></thead><tbody>${(d.expDetail || []).map(r => `<tr><td class="r">${r.name}</td><td>${r.date}</td><td style="font-weight:800">${r.val.toLocaleString()}</td></tr>`).join('')}</tbody><tfoot><tr style="background:#7c2d12;color:#fff;font-weight:900"><td>الإجمالي</td><td></td><td>${d.purExp.toLocaleString()} ج / الميزانية ${d.eAmt.toLocaleString()} ج</td></tr></tfoot></table></div></div>`;
  }
  box.innerHTML = html;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveTargets() { try { localStorage.setItem('targetProfit', document.getElementById('targetProfit').value); localStorage.setItem('ratioDrug', document.getElementById('ratioDrug').value); localStorage.setItem('ratioCosm', document.getElementById('ratioCosm').value); localStorage.setItem('ratioExp', document.getElementById('ratioExp').value); } catch { } renderTotalTable(); }
function clearTotalFilters() { let a = document.getElementById('totalFrom'), b = document.getElementById('totalTo'), c = document.getElementById('totalEmp'), d = document.getElementById('totalSup'); if (a) a.value = ''; if (b) b.value = ''; if (c) c.value = ''; if (d) d.value = ''; renderTotalTable(); document.getElementById('detailBox').innerHTML = ''; }
function parseDateSmartTotal(v) { if (!v) return ''; v = v.trim().replace(/-/g, '/'); let p = v.split('/'); let y = new Date().getFullYear(); if (p.length == 2) return p[0] + '/' + p[1] + '/' + y; if (p.length == 3) { if (p[2].length == 2) p[2] = '20' + p[2]; return p.join('/'); } return v; }
function parseDateForFilterTotal(s) { if (!s) return null; let p = s.split('/'); if (p.length !== 3) return null; return new Date(p[2], p[1] - 1, p[0]); }
function calcNumTotal(v) { try { if (!v) return 0; let e = (v + '').toString().replace(/,/g, '').trim(); if (e.indexOf('+') > -1 || e.indexOf('-') > -1 || e.indexOf('*') > -1 || e.indexOf('/') > -1) { return Function('"use strict";return (' + e + ')')(); } return parseFloat(e) || 0; } catch { return 0; } }
function getSupplierTypeMap() { try { let db = JSON.parse(localStorage.getItem('dbStore') || '{}'), map = {}; (db.suppliers || []).forEach(function (s) { let name = (s.name || s.c1 || '').toString().trim(); if (!name) return; let all = Object.values(s).join(' ').toLowerCase(); let type = 'اخرى'; if (all.indexOf('كوزمتك') > -1 || all.indexOf('تجميل') > -1 || all.indexOf('ليفر') > -1 || all.indexOf('حافظ') > -1 || all.indexOf('cosm') > -1) type = 'كوزمتكس'; else if (all.indexOf('مخزن') > -1 || all.indexOf('ادويه') > -1 || all.indexOf('ادوية') > -1 || all.indexOf('دواء') > -1 || all.indexOf('بدر') > -1 || all.indexOf('متحدة') > -1) type = 'مخزن ادوية'; else if (all.indexOf('مصروف') > -1 || all.indexOf('ايجار') > -1) type = 'مصروفات'; map[name] = { type: type }; map[name.toLowerCase()] = { type: type }; }); (db.masrofat || []).forEach(function (m) { let n = (m.c1 || '').toString().trim(); if (n) { map[n] = { type: 'مصروفات' }; map[n.toLowerCase()] = { type: 'مصروفات' }; } }); return map; } catch { return {}; } }
function getDBMaps() { try { let db = JSON.parse(localStorage.getItem('dbStore') || '{}'); return { sup: new Set((db.suppliers || []).map(function (s) { return (s.name || s.c1 || '').toString().trim().toLowerCase(); }).filter(Boolean)), mas: new Set((db.masrofat || []).map(function (s) { return (s.c1 || '').toString().trim().toLowerCase(); }).filter(Boolean)), arb: new Set((db.arba7 || []).map(function (s) { return (s.c1 || '').toString().trim().toLowerCase(); }).filter(Boolean)), supTypeMap: getSupplierTypeMap() }; } catch { return { sup: new Set(), mas: new Set(), arb: new Set(), supTypeMap: {} } } }

function renderTotalTable() {
  try {
    let dailyStore = JSON.parse(localStorage.getItem('dailyStore') || '{}');
    let maps = getDBMaps(); let mas = maps.mas, supTypeMap = maps.supTypeMap;
    let fromV = document.getElementById('totalFrom') ? document.getElementById('totalFrom').value : '';
    let toV = document.getElementById('totalTo') ? document.getElementById('totalTo').value : '';
    let empF = document.getElementById('totalEmp') ? document.getElementById('totalEmp').value : '';
    let fromD = parseDateForFilterTotal(fromV), toD = parseDateForFilterTotal(toV);
    let p = parseFloat(document.getElementById('targetProfit') ? document.getElementById('targetProfit').value : 25);
    let rD = parseFloat(document.getElementById('ratioDrug') ? document.getElementById('ratioDrug').value : 65);
    let rC = parseFloat(document.getElementById('ratioCosm') ? document.getElementById('ratioCosm').value : 25);
    let rE = parseFloat(document.getElementById('ratioExp') ? document.getElementById('ratioExp').value : 10);
    let sumR = rD + rC + rE || 100, remain = 100 - p, fD = remain * rD / sumR, fC = remain * rC / sumR, fE = remain * rE / sumR;
    let rows = '', sumShift = 0, sumMawrid = 0, sumMasrof = 0, sumInsta = 0, sumVoda = 0, sumSafi = 0, purDrug = 0, purCosm = 0, purExp = 0, purDetail = {}, empSales = {};
    let salesDetail = [], drugDetail = [], cosmDetail = [], expDetail = [];
    let cashTotal = 0, instaTotal = 0, vodaTotal = 0;

    Object.keys(dailyStore).sort(function (a, b) { let da = parseDateForFilterTotal(a), db = parseDateForFilterTotal(b); return (da - db) || 0; }).forEach(function (dateKey) {
      let d = parseDateForFilterTotal(dateKey); if (fromD && d && d < fromD) return; if (toD && d && d > toD) return;
      let data = dailyStore[dateKey]; if (!Array.isArray(data)) return;
      let map = {}, insta = 0, voda = 0;
      data.forEach(function (it) {
        if (!it || !it.id) return;
        if (it.id.startsWith('t1_')) { let m = it.id.match(/t1_r(\d+)_c(\d+)/); if (!m) return; let r = m[1], c = m[2]; if (!map[r]) map[r] = { emp: '', name: '', val: 0, shift: 0, diff: 0 }; if (c === '1') map[r].emp = (it.val || '').trim(); if (c === '2') map[r].shift = calcNumTotal(it.val); if (c === '3') map[r].diff = calcNumTotal(it.val); if (c === '5') map[r].name = (it.val || '').trim(); if (c === '6') map[r].val = calcNumTotal(it.val); }
        if (it.id.indexOf('insta_') > -1 && it.id.indexOf('_c2') > -1) insta += calcNumTotal(it.val);
        if (it.id.indexOf('voda_') > -1 && it.id.indexOf('_c2') > -1) voda += calcNumTotal(it.val);
      });
      let filtered = Object.values(map); if (empF) filtered = filtered.filter(function (r) { return r.emp === empF; });
      let shift = 0, diff = 0; filtered.forEach(function (r) { shift += r.shift; diff += r.diff; });
      filtered.forEach(function (r) { if (!r.emp) return; if (!empSales[r.emp]) empSales[r.emp] = { shift: 0, diff: 0, days: {} }; empSales[r.emp].shift += r.shift; empSales[r.emp].diff += r.diff; empSales[r.emp].days[dateKey] = 1; });
      let mawrid = 0, masrof = 0;
      filtered.forEach(function (r) {
        if (!r.name || !r.val) return;
        let info = supTypeMap[r.name] || supTypeMap[r.name.toLowerCase().trim()];
        let t = info ? info.type : 'اخرى'; if (mas.has(r.name.toLowerCase().trim())) t = 'مصروفات';
        if (t === 'مخزن ادوية') { purDrug += r.val; drugDetail.push({ name: r.name, date: dateKey, val: r.val }); }
        else if (t === 'كوزمتكس') { purCosm += r.val; cosmDetail.push({ name: r.name, date: dateKey, val: r.val }); }
        else if (t === 'مصروفات') { purExp += r.val; expDetail.push({ name: r.name, date: dateKey, val: r.val }); }
        if (!purDetail[r.name]) purDetail[r.name] = { val: 0, type: t, count: 0 }; purDetail[r.name].val += r.val; purDetail[r.name].count++; purDetail[r.name].type = t;
        if (t === 'مصروفات') masrof += r.val; else mawrid += r.val;
      });
      if (shift === 0 && mawrid === 0 && masrof === 0 && insta === 0 && voda === 0) return;
      let cash = Math.max(0, shift - (insta + voda));
      salesDetail.push({ date: dateKey, cash: cash, insta: insta, voda: voda, total: cash + insta + voda });
      cashTotal += cash; instaTotal += insta; vodaTotal += voda;
      let rowSafi = shift + diff - mawrid - masrof + insta + voda;
      sumShift += shift; sumMawrid += mawrid; sumMasrof += masrof; sumInsta += insta; sumVoda += voda; sumSafi += rowSafi;
      rows += '<tr><td style="font-weight:900">' + dateKey + '</td><td>' + shift.toLocaleString() + '</td><td>' + mawrid.toLocaleString() + '</td><td>' + masrof.toLocaleString() + '</td><td>' + insta.toLocaleString() + '</td><td>' + voda.toLocaleString() + '</td><td style="background:#0f172a;color:#fff;border-radius:8px;font-weight:900">' + rowSafi.toLocaleString() + '</td></tr>';
    });
    let totalSales = cashTotal + instaTotal + vodaTotal || 1;
    let profitAmt = totalSales * p / 100, remainAmt = totalSales * remain / 100, dAmt = totalSales * fD / 100, cAmt = totalSales * fC / 100, eAmt = totalSales * fE / 100;

    lastDetailData = { totalSales, profitAmt, remainAmt, dAmt, cAmt, eAmt, purDrug, purCosm, purExp, p, rD, rC, rE, fD, fC, fE, remain, cashTotal, instaTotal, vodaTotal, salesDetail, drugDetail, cosmDetail, expDetail };

    document.getElementById('salesPreview').textContent = totalSales.toLocaleString() + ' ج';
    document.getElementById('remainPreview').textContent = remain.toFixed(0) + '%';
    document.getElementById('remainAmt').textContent = remainAmt.toLocaleString() + ' ج';
    document.getElementById('profitAmt').textContent = profitAmt.toLocaleString() + ' ج';
    document.getElementById('drugFinalP').textContent = fD.toFixed(1) + '%';
    document.getElementById('drugAmt').textContent = dAmt.toLocaleString() + ' ج';
    document.getElementById('cosmFinalP').textContent = fC.toFixed(1) + '%';
    document.getElementById('cosmAmt').textContent = cAmt.toLocaleString() + ' ج';
    document.getElementById('expFinalP').textContent = fE.toFixed(1) + '%';
    document.getElementById('expAmt').textContent = eAmt.toLocaleString() + ' ج';

    document.getElementById('budgetCalc').innerHTML =
      '<div class="budget-grid">' +
      '<div class="b-card" style="border-color:#86efac" onclick="showDetail(\'profit\')"><div class="b-top"><span>💰 صافي الربح</span><span style="color:#14532d">' + p + '%</span></div><div class="b-val">' + profitAmt.toLocaleString() + ' ج</div><div style="font-size:9px;color:#64748b">اضغط للتفصيل</div><div class="prog"><i style="width:' + p + '%;background:#22c55e"></i></div></div>' +
      '<div class="b-card" style="' + (purDrug > dAmt ? 'border-color:#fca5a5;background:#fef2f2' : '') + '" onclick="showDetail(\'drug\')"><div class="b-top"><span>💊 دواء</span><span>' + fD.toFixed(1) + '% • ' + dAmt.toLocaleString() + ' ج</span></div><div class="b-val" style="color:' + (purDrug > dAmt ? '#ef4444' : '#1e40af') + '">' + purDrug.toLocaleString() + ' ج ' + (purDrug <= dAmt ? '✅' : '❌') + '</div><div class="prog"><i style="width:' + Math.min(100, purDrug / (dAmt || 1) * 100) + '%;background:' + (purDrug <= dAmt ? '#3b82f6' : '#ef4444') + '"></i></div><div style="font-size:9px;display:flex;justify-content:space-between;color:#64748b"><span>فعلي ' + (purDrug / totalSales * 100).toFixed(1) + '%</span><span>فاضل ' + (dAmt - purDrug).toLocaleString() + ' ج</span></div></div>' +
      '<div class="b-card" style="' + (purCosm > cAmt ? 'border-color:#fca5a5;background:#fef2f2' : '') + '" onclick="showDetail(\'cosm\')"><div class="b-top"><span>💖 كوزمتكس</span><span>' + fC.toFixed(1) + '% • ' + cAmt.toLocaleString() + ' ج</span></div><div class="b-val" style="color:' + (purCosm > cAmt ? '#ef4444' : '#be185d') + '">' + purCosm.toLocaleString() + ' ج ' + (purCosm <= cAmt ? '✅' : '❌') + '</div><div class="prog"><i style="width:' + Math.min(100, purCosm / (cAmt || 1) * 100) + '%;background:' + (purCosm <= cAmt ? '#ec4899' : '#ef4444') + '"></i></div><div style="font-size:9px;color:#64748b">فعلي ' + (purCosm / totalSales * 100).toFixed(1) + '%</div></div>' +
      '<div class="b-card" style="' + (purExp > eAmt ? 'border-color:#fca5a5;background:#fef2f2' : '') + '" onclick="showDetail(\'exp\')"><div class="b-top"><span>💸 مصروفات</span><span>' + fE.toFixed(1) + '% • ' + eAmt.toLocaleString() + ' ج</span></div><div class="b-val">' + purExp.toLocaleString() + ' ج ' + (purExp <= eAmt ? '✅' : '❌') + '</div><div class="prog"><i style="width:' + Math.min(100, purExp / (eAmt || 1) * 100) + '%;background:' + (purExp <= eAmt ? '#f59e0b' : '#ef4444') + '"></i></div><div style="font-size:9px;color:#64748b">فعلي ' + (purExp / totalSales * 100).toFixed(1) + '%</div></div>' +
      '</div>';
    document.getElementById('kpiArea').innerHTML = '<div class="glass" style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-color:#fcd34d;text-align:center;font-weight:800;font-size:11px">📊 المبيعات ' + totalSales.toLocaleString() + ' ج • المصروف ' + (purDrug + purCosm + purExp).toLocaleString() + ' ج • الصافي ' + sumSafi.toLocaleString() + ' ج • دوس على أي خانة فوق عشان تشوف التفاصيل</div>';
    let alerts = []; if (purDrug > dAmt) alerts.push('<div class="glass" style="background:#fef2f2;border-color:#fecaca;color:#991b1b">🔴 تجاوز دواء ' + (purDrug - dAmt).toLocaleString() + ' ج</div>'); if (purCosm > cAmt) alerts.push('<div class="glass" style="background:#fdf2f8;border-color:#fbcfe8;color:#831843">🔴 تجاوز كوزمتكس ' + (purCosm - cAmt).toLocaleString() + ' ج</div>'); if (purExp > eAmt) alerts.push('<div class="glass" style="background:#fff7ed;border-color:#fed7aa;color:#7c2d12">🔴 تجاوز مصروفات ' + (purExp - eAmt).toLocaleString() + ' ج</div>'); if (alerts.length === 0) alerts.push('<div class="glass" style="background:#f0fdf4;border-color:#86efac;color:#14532d;text-align:center">✅ كله تمام</div>');
    document.getElementById('alertArea').innerHTML = alerts.join('');
    let supRows = ''; Object.keys(purDetail).sort(function (a, b) { return purDetail[b].val - purDetail[a].val; }).forEach(function (name) { let d = purDetail[name]; let badge = d.type === 'مخزن ادوية' ? '<span class="badge" style="background:#dbeafe;color:#1e40af">💊 مخزن</span>' : d.type === 'كوزمتكس' ? '<span class="badge" style="background:#fce7f3;color:#be185d">💖 كوزمتكس</span>' : '<span class="badge" style="background:#ffedd5;color:#9a3412">💸 مصروف</span>'; supRows += '<tr><td class="r">' + name + '</td><td>' + badge + '</td><td style="font-weight:800">' + d.val.toLocaleString() + '</td><td>' + (d.val / totalSales * 100).toFixed(1) + '%</td><td>' + d.count + '</td><td>' + (d.val <= (d.type === 'مخزن ادوية' ? dAmt : d.type === 'كوزمتكس' ? cAmt : eAmt) ? '🟢' : '🔴') + '</td></tr>'; });
    document.getElementById('mainTables').innerHTML = '<div style="display:grid;grid-template-columns:1.2fr.8fr;gap:12px"><div class="glass"><b style="font-size:12px">🏢 الموردين</b><div style="max-height:360px;overflow:auto;margin-top:8px"><table><thead><tr><th>المورد</th><th>النوع</th><th>قيمة</th><th>%</th><th>مرات</th><th></th></tr></thead><tbody>' + supRows + '</tbody></table></div></div><div class="glass"><b style="font-size:12px">👨‍⚕️ الموظفين</b><div style="max-height:360px;overflow:auto;margin-top:8px"><table><thead><tr><th>الموظف</th><th>مبيعات</th><th>أيام</th><th>عجز</th></tr></thead><tbody>' + Object.keys(empSales).map(function (n) { return '<tr><td class="r">' + n + '</td><td>' + empSales[n].shift.toLocaleString() + '</td><td>' + Object.keys(empSales[n].days).length + '</td><td>' + empSales[n].diff.toLocaleString() + '</td></tr>'; }).join('') + '</tbody></table></div></div></div>';
    document.getElementById('totalTableCard').innerHTML = '<div class="glass"><b style="font-size:12px">📅 تفصيل يومي</b><div style="overflow:auto;margin-top:8px"><table><thead><tr><th>تاريخ</th><th>شيفت</th><th>مورد</th><th>مصروف</th><th>انستا</th><th>فودا</th><th>صافي</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr style="background:#0f172a;color:#fff;font-weight:900"><td>الإجمالي</td><td>' + sumShift.toLocaleString() + '</td><td>' + sumMawrid.toLocaleString() + '</td><td>' + sumMasrof.toLocaleString() + '</td><td>' + sumInsta.toLocaleString() + '</td><td>' + sumVoda.toLocaleString() + '</td><td>' + sumSafi.toLocaleString() + '</td></tr></tfoot></table></div></div>';
  } catch (err) { console.error(err); }
}
