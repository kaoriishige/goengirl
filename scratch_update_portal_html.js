const fs = require('fs');
let html = fs.readFileSync('portal/index.html', 'utf8');

html = html.replace(/<button class="char-tab-btn" data-char="milk">みるく<\/button>/g, '<button class="char-tab-btn" data-char="milk">くるみ</button>');
html = html.replace(/狩野みるく/g, '狩野くるみ');
html = html.replace(/みるくちゃん/g, 'くるみちゃん');
html = html.replace(/つつじ・みるく・ちか/g, 'つつじ・くるみ・ちか');
html = html.replace(/那須温泉神社/g, '高野山真言宗 高福寺');

fs.writeFileSync('portal/index.html', html, 'utf8');
console.log('portal/index.html updated successfully!');
