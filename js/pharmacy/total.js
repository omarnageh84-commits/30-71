// ==================== الاجمالي - نهائي - اصلاح الفعلي صفر ====================
let activeMonthTab = localStorage.getItem('activeMonthTab') || null;
let monthCashTotal = 0;

function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
.glass{background:#fff;border-radius:16px;padding:14px;margin-bottom:12px;border:1px solid #eef2f7;box-shadow:0 4px 12px rgba(0,0,0,.04)}
.filters{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.filters input{padding:6px 10px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:10px;font-weight:700}
.filters button{padding:6px 12px;border:none;border-radius:10px;font-weight:800;font-size:10px;cursor:pointer;color:#fff}
.month-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}
.month-tab{padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:800;font-size:10px;cursor:pointer;color:#475569}
.month-tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
    table{width:100%;border-collapse:separate;border-spacing:0;font-size:11px;overflow:hidden;border-radius:12px;border:1px solid #e2e8f0}
    th{background:#0f172a;color:#fff;padding:12px 6px;font-size:10px;text-align:center;font-weight:900}
    td{padding:10px 6px;text-align:center;border-bottom:1px solid #f1f5f9;font-weight:700;background:#fff}
.safi{background:#0f172a;color:#fff;border-radius:8px;font-weight:900}
.profit-input{width:56px;padding:5px;border-radius:8px;border:1.5px solid #cbd5e1;text-align:center;font-weight:900;font-size:11px;background:#1e293b;color:#fff}
.kpi{flex:1;min-width:120px;padding:10px;border-radius:12px;text-align:center;border:1px solid #e2e8f0}
    </style>

    <div class="glass">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <div class="kpi" style="background:#eff6ff"><small style="font-size:9px">مبيعات الشهر كاش تلقائي</small><b id="autoSalesKPI">0</b></div>
        <div class="kpi" style="background:#f0fdf4"><small style="font-size:9px">نسبة الربح المطلوبة %</small><div style="display:flex;justify-content:center;gap:4px;margin-top:4px"><input id="desiredProfit" type="number" class="profit-input" style="background:#fff;color:#000" oninput="saveProfitConfig()"><span>%</span></div></div>
        <div class="kpi"><small style="font-size:9px">صافي الربح</small><b id="autoProfitKPI" style="color:#16a34a">0</b></div>
        <div style="margin-right:auto;font-size:11px;font-weight:900">توزيع الارباح - حسب جدول التصنيف (3)</div>
      </div>
      <div id="profitDistTable" style="margin-top:12px"></div>
    </div>

    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 Excel</button>
        <span id="monthSummary" style="margin-right:auto;font-size:9px;background:#f8fafc;padding:6px 10px;border-radius:20px"></span>
      </div>
      <div id="monthTabs" class="month-tabs"></div>
      <div id="totalTableCard" style="margin-top:8px"></div>
    </div>
  </div>`;
  loadProfitConfig();
  renderTotalTable();
}

function parseDateSmartTotal(v){ if(!v) return ''; v=v.trim().replace(/-/g,'/'); let p=v.split('/'); let y=new Date().getFullYear(); if(p.length==2) return p[0]+'/'+p[1]+'/'+y; if(p.length==3){ if(p[2].length==2) p[2]='20'+p[2]; return p.join('/'); } return v; }
function parseDateForFilterTotal(s){ if(!s) return null; let p=s.split('/'); if(p.length!==3) return null; return new Date(p[2],p[1]-1,p[0]); }
function calcNumTotal(v){
  try{
    if(!v) return 0;
    let s=(v+'').toString().trim().replace(/,/g,'');
    // يتعامل مع 5280- اللي عندك في الصورة
    let isNeg=s.endsWith('-'); if(isNeg) s='-'+s.slice(0,-1);
    s=s.replace(/[^0-9.\-+*\/]/g,'');
    if(!s) return 0;
    if(/[\+\-\*\/]/.test(s.slice(1))) return Function('"use strict";return ('+s+')')();
    return parseFloat(s)||0;
  }catch{ return 0; }
}
function isNumericVal(v){ if(!v) return false; let s=v.toString().trim(); return /^-?[0-9,.\-]+\-?$/.test(s) && s.replace(/[^0-9]/g,'').length>0; }
function clearTotalFilters(){ let a=document.getElementById('totalFrom'), b=document.getElementById('totalTo'); if(a) a.value=''; if(b) b.value=''; renderTotalTable(); }
function exportTotalExcel(){ let html=document.getElementById('totalTableCard').innerHTML; let blob=new Blob(['\uFEFF'+html],{type:'application/vnd.ms-excel'}); let url=URL.createObjectURL(blob); let a=document.createElement('a'); a.href=url; a.download='الاجمالي_'+(activeMonthTab||'')+'.xls'; a.click(); }

function getSupplierClassifications(){
  let cats=new Set();
  let keys=[];
  for(let i=0;i<localStorage.length;i++){
    let k=localStorage.key(i); if(!k) continue;
    let low=k.toLowerCase();
    if(low.includes('tasn') || low.includes('class') || low.includes('categ') || low.includes('تصنيف')) keys.push(k);
  }
  keys.forEach(k=>{
    try{
      let data=JSON.parse(localStorage.getItem(k)||'[]');
      let arr=Array.isArray(data)?data:(data.data||data.list||Object.values(data));
      if(!Array.isArray(arr)) return;
      arr.forEach(o=>{
        if(!o||typeof o!=='object') return;
        let name=o.الاسم||o.name||o.title;
        if(name && typeof name==='string'){
          let n=name.trim();
          if(n && n!=='المجموعة' && n.length>=2 && n.length<=20) cats.add(n);
        }
      });
    }catch(e){}
  });
  try{
    let daily=JSON.parse(localStorage.getItem('dailyStore')||'{}');
    Object.values(daily).forEach(arr=>{
      if(!Array.isArray(arr)) return;
      arr.forEach(it=>{ if(it.id&&it.id.includes('_c4')&&it.val){ let v=it.val.trim(); if(v&&v!=='المجموعة'&&v.length>=2&&v.length<=20&&!isNumericVal(v)) cats.add(v); } });
    });
  }catch(e){}
  if(cats.size===0) ['دواء','كوزمتكس','مصاريف'].forEach(c=>cats.add(c));
  cats.delete('المجموعة');
  return [...cats];
}

function loadProfitConfig(){
  let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":10,"dist":{"دواء":40,"كوزمتكس":30,"مصاريف":30}}');
  setTimeout(()=>{ let inp=document.getElementById('desiredProfit'); if(inp) inp.value=cfg.desired||10; },20);
  let cats=getSupplierClassifications();
  let dist=cfg.dist||{};
  let sales=monthCashTotal||0;
  let desired=cfg.desired||10;
  let remainingPerc=100-desired;
  let remainingValue=sales*remainingPerc/100;

  if(document.getElementById('autoSalesKPI')) document.getElementById('autoSalesKPI').textContent=sales.toLocaleString();
  if(document.getElementById('autoProfitKPI')) document.getElementById('autoProfitKPI').textContent=(sales*desired/100).toLocaleString();

  let html=`
  <div style="overflow:auto;border-radius:12px">
  <table>
    <thead>
      <tr>
        <th style="width:100px">البند</th>
        ${cats.map(c=>`<th>${c}<div style="margin-top:6px"><input data-cat="${c}" value="${dist[c]||0}" oninput="saveProfitConfig()" class="profit-input"> %</div></th>`).join('')}
        <th style="background:#1e40af">الاجمالي</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#f0f9ff">
        <td style="background:#eff6ff;font-weight:900;color:#1e40af">المفروض كده</td>
        ${cats.map(c=>{ let p=dist[c]||0; let val=remainingValue*p/100; return `<td data-val="${c}" style="background:#eff6ff"><div style="font-weight:900">${val.toLocaleString()}</div><div style="font-size:8px;color:#64748b">${p}% من المتبقي</div></td>`; }).join('')}
        <td style="background:#dbeafe;font-weight:900">${remainingValue.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="background:#fef9c3;font-weight:900">الفعلي بقا</td>
        ${cats.map(c=>`<td data-actual="${c}" style="background:#fffbeb;font-weight:900">0</td>`).join('')}
        <td data-actual="totalCat" style="background:#fef3c7;font-weight:900">0</td>
      </tr>
      <tr>
        <td style="background:#fee2e2;font-weight:900;color:#991b1b">الفرق (المشاكل)</td>
        ${cats.map(c=>`<td data-diff="${c}" style="font-weight:900">-</td>`).join('')}
        <td data-diff="totalCat">-</td>
      </tr>
    </tbody>
  </table>
  </div>
  <div id="distSum" style="text-align:center;margin-top:8px;font-size:10px"></div>`;
  document.getElementById('profitDistTable').innerHTML=html;
  calcPreview();
}

function saveProfitConfig(){
  let desired=calcNumTotal(document.getElementById('desiredProfit')?.value||10);
  let dist={};
  document.querySelectorAll('input[data-cat]').forEach(inp=>{ dist[inp.dataset.cat]=calcNumTotal(inp.value); });
  localStorage.setItem('profitConfigTotal', JSON.stringify({desired, dist}));
  loadProfitConfig();
}

function calcPreview(){
  try{
    let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
    let sum=Object.values(cfg.dist||{}).reduce((a,b)=>a+b,0);
    let el=document.getElementById('distSum');
    if(el) el.innerHTML=`مجموع التوزيع: <span style="padding:3px 10px;border-radius:20px;background:${sum===100?'#dcfce7':'#fee2e2'}">${sum}% ${sum===100?'✓':'لازم 100%'}</span>`;
  }catch(e){}
}

function goToDaily(dateKey){ localStorage.setItem('jumpToDate', dateKey); if(typeof showTab==='function') showTab('daily'); }
function goToSupplier(supName){ if(!supName||supName=='-') return; localStorage.setItem('supplierFilter', supName); if(typeof showTab==='function') showTab('qawaed'); }

function renderTotalTable(){
  try{
    let dailyStore=JSON.parse(localStorage.getItem('dailyStore')||'{}');
    let fromV=document.getElementById('totalFrom')?.value||'', toV=document.getElementById('totalTo')?.value||'';
    let fromD=parseDateForFilterTotal(fromV), toD=parseDateForFilterTotal(toV);
    const monthNames=['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'];
    let months={};
    Object.keys(dailyStore).sort((a,b)=> parseDateForFilterTotal(b)-parseDateForFilterTotal(a)).forEach(dateKey=>{
      let d=parseDateForFilterTotal(dateKey); if(!d) return;
      if(fromD && d<fromD) return; if(toD && d>toD) return;
      let monthKey=`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}`;
      if(!months[monthKey]) months[monthKey]={days:[],monthNum:d.getMonth(),year:d.getFullYear()};
      let data=dailyStore[dateKey]; if(!Array.isArray(data)) return;

      // تجميع الصفوف بطريقة ذكية تتعامل مع ترتيب الاعمدة المختلف
      let rowsMap={};
      data.forEach(it=>{
        if(!it||!it.id) return;
        let m=it.id.match(/t1_r(\d+)_c(\d+)/); if(!m) return;
        let r=m[1], c=m[2];
        if(!rowsMap[r]) rowsMap[r]={c1:'',c2:'',c3:'',c4:'',c5:'',c6:'',insta:0,voda:0};
        rowsMap[r]['c'+c]=it.val||'';
      });
      let empRows=[];
      Object.values(rowsMap).forEach(rr=>{
        let shift=calcNumTotal(rr.c2);
        let diff=calcNumTotal(rr.c3);
        // نكتشف التصنيف والقيمة واسم المورد بذكاء
        let candidates=[rr.c4,rr.c5,rr.c6];
        let cat='', val=0, sup='';
        candidates.forEach(v=>{
          if(!v) return;
          let t=v.toString().trim();
          if(!t) return;
          // لو نص وموجود في جدول التصنيف -> ده التصنيف
          let knownCats=getSupplierClassifications();
          if(knownCats.includes(t) || (!isNumericVal(t) && t.length<=20 &&!t.includes('-') )){
            // لو مش رقم يبقى ممكن تصنيف او مورد
            if(knownCats.includes(t) || ['دواء','كوزمتكس','مصاريف','عام','مخزن دواء','شركة دواء'].some(k=>t.includes(k))){
              cat=t;
            } else if(!cat &&!isNumericVal(t)){
              // لو مش تصنيف معروف يبقى اسم مورد
              if(t.length>2 &&!/^[0-9]+$/.test(t)) sup=t;
            }
          }
          if(isNumericVal(t)){
            let num=calcNumTotal(t);
            if(Math.abs(num)>0){
              // اكبر رقم في الصف غالبا هو قيمة المورد او الشيفت، لكن الشيفت في c2
              // هنا نعتبر اي رقم في c4,c5,c6 هو قيمة المورد لو c2 موجود
              if(!val || Math.abs(num)>Math.abs(val)) val=num;
            }
          }
        });
        // لو لسه مالقيناش قيمة، جرب c4,c5,c6
        if(val===0){
          [rr.c4,rr.c5,rr.c6].forEach(v=>{ let n=calcNumTotal(v); if(n!==0) val=n; });
        }
        // لو التصنيف لسه فاضي، خده من c4 لو مش رقم
        if(!cat){
          [rr.c4,rr.c5,rr.c6].forEach(v=>{
            if(v &&!isNumericVal(v) && v.trim().length>=2) cat=v.trim();
          });
        }
        if(rr.c1 || shift!==0 || val!==0){
          empRows.push({emp:rr.c1, shift, diff, cat, sup, val, insta:0, voda:0});
        }
      });

      let instaSum=0, vodaSum=0;
      data.forEach(it=>{
        if(it.id&&it.id.includes('insta_')) instaSum+=calcNumTotal(it.val);
        if(it.id&&it.id.includes('voda_')) vodaSum+=calcNumTotal(it.val);
      });

      months[monthKey].days.push({dateKey, empRows, instaSum, vodaSum});
    });

    let monthKeys=Object.keys(months).sort((a,b)=> b.localeCompare(a));
    if(!activeMonthTab ||!months[activeMonthTab]){ activeMonthTab=monthKeys[0]||null; if(activeMonthTab) localStorage.setItem('activeMonthTab',activeMonthTab); }

    document.getElementById('monthTabs').innerHTML=monthKeys.map(m=>{
      let isActive=m===activeMonthTab?'active':'';
      return `<div class="month-tab ${isActive}" onclick="activeMonthTab='${m}';localStorage.setItem('activeMonthTab','${m}');renderTotalTable()">${monthNames[months[m].monthNum]}</div>`;
    }).join('') || '<div style="font-size:10px">مفيش بيانات</div>';

    let rows=''; monthCashTotal=0; let totalCatActual={}; let totalInsta=0, totalVoda=0;
    let activeData=months[activeMonthTab]?.days||[];
    activeData.forEach(({dateKey, empRows, instaSum, vodaSum})=>{
      totalInsta+=instaSum; totalVoda+=vodaSum;
      empRows.forEach(r=>{
        if(!r.emp && r.shift==0 && r.val==0) return;
        monthCashTotal+=r.shift;
        if(r.cat){
          let k=r.cat.trim();
          totalCatActual[k]=(totalCatActual[k]||0)+r.val;
        }
        let safi=r.shift + r.diff - r.val;
        rows+=`<tr>
          <td onclick="goToDaily('${dateKey}')">${dateKey}</td>
          <td>${r.emp||'-'}</td>
          <td><span style="background:#eff6ff;padding:4px 8px;border-radius:8px;font-size:10px">${r.shift?r.shift.toLocaleString():'-'}</span></td>
          <td style="${r.diff<0?'color:#dc2626':'color:#16a34a'}">${r.diff||0}</td>
          <td><span style="font-size:8px;background:#f1f5f9;padding:2px 6px;border-radius:20px">${r.cat||''}</span> ${r.val?r.val.toLocaleString():'-'}</td>
          <td>${r.sup||'-'}</td>
          <td style="color:#7c3aed;font-size:10px">${instaSum?instaSum.toLocaleString(): '-'}</td>
          <td style="color:#dc2626;font-size:10px">${vodaSum?vodaSum.toLocaleString(): '-'}</td>
          <td class="safi" style="font-size:10px">${safi.toLocaleString()}</td>
        </tr>`;
      });
    });

    setTimeout(()=>{
      if(document.getElementById('autoSalesKPI')) document.getElementById('autoSalesKPI').textContent=monthCashTotal.toLocaleString();
      if(document.getElementById('autoProfitKPI')){
        let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":10}');
        document.getElementById('autoProfitKPI').textContent=(monthCashTotal*(cfg.desired||10)/100).toLocaleString();
      }
      let cats=getSupplierClassifications();
      let totalCatSum=0;
      cats.forEach(cat=>{
        let sum=0;
        Object.keys(totalCatActual).forEach(k=>{
          if(k===cat || k.includes(cat) || cat.includes(k)) sum+=totalCatActual[k];
        });
        let el=document.querySelector(`[data-actual="${cat}"]`);
        if(el){ el.textContent=sum?sum.toLocaleString():'0'; totalCatSum+=sum; }
      });
      let totalEl=document.querySelector('[data-actual="totalCat"]');
      if(totalEl) totalEl.textContent=totalCatSum.toLocaleString();

      document.querySelectorAll('[data-diff]').forEach(td=>{
        let k=td.getAttribute('data-diff');
        if(k==='totalCat'){
          let ev=Array.from(document.querySelectorAll('[data-val]')).reduce((a,el)=>a+calcNumTotal(el.textContent),0);
          let diff=totalCatSum-ev; td.textContent=(diff>0?'+':'')+diff.toLocaleString(); td.style.color=diff>0?'#dc2626':'#16a34a';
        } else {
          let valEl=document.querySelector(`[data-val="${k}"]`);
          let actEl=document.querySelector(`[data-actual="${k}"]`);
          if(valEl && actEl){
            let ev=calcNumTotal(valEl.textContent); let av=calcNumTotal(actEl.textContent); let diff=av-ev;
            td.textContent=(diff>0?'+':'')+diff.toLocaleString(); td.style.color=diff>0?'#dc2626':'#16a34a'; if(diff!==0) td.style.background=diff>0?'#fee2e2':'#dcfce7';
          }
        }
      });
      calcPreview();
      let sumEl=document.getElementById('monthSummary');
      if(sumEl) sumEl.textContent=`كاش: ${monthCashTotal.toLocaleString()} - انستا: ${totalInsta.toLocaleString()} - فودافون: ${totalVoda.toLocaleString()}`;
    },150);

    document.getElementById('totalTableCard').innerHTML=`<div class="glass" style="padding:10px"><div style="display:flex;justify-content:space-between;font-size:10px"><b>📅 ${activeMonthTab?monthNames[months[activeMonthTab].monthNum]+' '+months[activeMonthTab].year:''} - كاش: ${monthCashTotal.toLocaleString()}</b></div><div style="overflow:auto;max-height:70vh;margin-top:8px;border-radius:10px"><table><thead><tr><th>التاريخ</th><th>الموظف</th><th>الشيفت كاش</th><th>العجز</th><th>المورد [التصنيف]</th><th>اسم مورد</th><th>انستا</th><th>فودافون</th><th>الصافي</th></tr></thead><tbody>${rows||'<tr><td colspan=9>مفيش بيانات</td></tr>'}</tbody></table></div></div>`;
  }catch(e){ console.error(e); document.getElementById('totalTableCard').innerHTML='Error: '+e.message; }
}
