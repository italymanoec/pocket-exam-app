// 把 essay_drafts.json 合併進 law_map.json：只在 essays[id] 加 draft 欄位，既有欄位不動。
// 用法：node 合併擬答草稿.cjs <law_map.json> <essay_drafts.json> <輸出.json>
const fs = require('fs');
const [, , MAP, DR, OUT] = process.argv;
if (!OUT) { console.error('用法：node 合併擬答草稿.cjs <law_map.json> <essay_drafts.json> <輸出.json>'); process.exit(2); }
const m = JSON.parse(fs.readFileSync(MAP, 'utf8')), d = JSON.parse(fs.readFileSync(DR, 'utf8'));
let n = 0, miss = [];
for (const [id, v] of Object.entries(d.essays)) {
  if (!m.essays[id]) { miss.push(id); continue; }
  if ('draft' in m.essays[id]) { console.error('已有 draft 欄位，拒絕覆蓋：' + id); process.exit(3); }
  m.essays[id].draft = v.draft; n++;
}
// 核對：拿掉 draft 後要和原檔完全相同
const back = JSON.parse(JSON.stringify(m));
for (const id of Object.keys(back.essays)) delete back.essays[id].draft;
if (JSON.stringify(back) !== JSON.stringify(JSON.parse(fs.readFileSync(MAP, 'utf8')))) { console.error('合併後既有欄位有變動，不寫檔'); process.exit(4); }
fs.writeFileSync(OUT, JSON.stringify(m));
console.log(`合併 ${n} 題 draft；題庫找不到的 ${miss.length} 題 ${miss.join(' ')}；輸出 ${OUT}`);
