const fs = require('fs');
const path = require('path');

// 対象ファイルリスト
const files = [
  'index.html',
  'member/index.html',
  'member/member.js',
  'admin/admin.js',
  'lp/index.html',
  'join/index.html',
  'portal/index.html',
  'portal/portal.js',
  'data/master.json',
];

// 置換ルール（順番重要: 長い文字列から処理）
const replacements = [
  // キャラ名
  ['狩野みるく 地元牧場コラボ ミルクスイーツ開発', '狩野くるみ 那須ミッドシティホテルコラボ 宿泊体験プラン'],
  ['狩野みるくのSNS配信サンプル動画', '狩野くるみのSNS配信サンプル動画'],
  ['那須塩原市のキャラクター、狩野みるく。牛と並ぶスーツ姿の人物', '那須塩原市のキャラクター、狩野くるみ'],
  ['那須塩原市のキャラクター、狩野みるく', '那須塩原市のキャラクター、狩野くるみ'],
  ['狩野みるくと、ご縁が結ばれました', '狩野くるみと、ご縁が結ばれました'],
  ['狩野みるく (那須塩原市)', '狩野くるみ (那須塩原市)'],
  ['狩野みるく', '狩野くるみ'],
  ['みるくちゃん', 'くるみちゃん'],
  ['つつじ・みるく・ちか', 'つつじ・くるみ・ちか'],
  ['"狩野みるく"', '"狩野くるみ"'],
  // 施設名（設置場所）
  ['那須温泉神社', '高野山真言宗 高福寺'],
  // alt属性の残り
  ['alt="狩野みるく"', 'alt="狩野くるみ"'],
];

let totalChanges = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`SKIP (not found): ${file}`);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of replacements) {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const before = content;
    content = content.replace(regex, to);
    if (content !== before) changed++;
  }
  if (changed > 0) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`UPDATED (${changed} replacements): ${file}`);
    totalChanges += changed;
  } else {
    console.log(`No changes: ${file}`);
  }
}

console.log(`\nDone. Total file changes: ${totalChanges}`);
