// Portal Data Definition
const PORTAL_DATA = {
  characters: [
    {
      id: "tsutsuji",
      name: "那須乃つつじ",
      region: "栃木県 那須町",
      color: "#e9588d",
      image: "../assets/nasuno-tsutsuji.png",
      lead: "九尾の狐伝説と歴史の町・那須町の守護少女。那須和牛や高原牛乳が大好物のおっとりお嬢様。",
      voiceText: "ご縁に感謝いたしますわ。那須の美しい自然と名湯で、心ゆくまで癒やされていってくださいね。",
      birthday: "8月22日",
      hobby: "歴史探訪、カフェ巡り、温泉めぐり",
      specialty: "天気予報、乗馬、利きチーズ",
      spotsCount: 2,
      goodsCount: 3
    },
    {
      id: "milk",
      name: "狩野みるく",
      region: "栃木県 那須塩原市",
      color: "#1199c4",
      image: "../assets/karino-milk.png",
      lead: "生乳生産量本州一を誇る那須塩原市の守護ガール。牧場スイーツとキャンプが大好きな活発アウトドア派。",
      voiceText: "今日も元気いっぱい行こう！那須塩原の美味しいミルクと温泉で、エネルギーチャージだよっ！",
      birthday: "9月17日",
      hobby: "イベント巡り、キャンプ、お花鑑賞",
      specialty: "お菓子作り、地元案内、サイクリング",
      spotsCount: 2,
      goodsCount: 3
    },
    {
      id: "chika",
      name: "大俵ちか",
      region: "栃木県 大田原市",
      color: "#c84127",
      image: "../assets/otawara-chika.png",
      lead: "那須与一の里、大田原市の歴史を宿す守護少女。一矢必中の精神を持つ一本気な努力家。",
      voiceText: "一矢必中！あなたとの出会いも、きっと素晴らしいご縁の矢が引き寄せたものですね！",
      birthday: "7月12日",
      hobby: "グルメ旅、コスプレ、鮎釣り",
      specialty: "利きとうがらし、早起き、弓道",
      spotsCount: 2,
      goodsCount: 2
    }
  ],
  panels: [
    {
      id: "p1",
      title: "巫女装束Ver. 等身大パネル",
      character: "那須乃つつじ",
      spotName: "那須温泉神社",
      address: "栃木県那須郡那須町湯本182",
      image: "../assets/nasuno-tsutsuji.png",
      category: "等身大パネル",
      isNew: true,
      description: "那須温泉神社の社務所前に設置された等身大パネル。神聖な巫女装束を纏ったつつじちゃんが出迎えてくれます。"
    },
    {
      id: "p2",
      title: "フォーマルスーツVer. 等身大パネル",
      character: "狩野みるく",
      spotName: "千本松牧場 レストラン",
      address: "栃木県那須塩原市千本松799",
      image: "../assets/karino-milk.png",
      category: "等身大パネル",
      isNew: true,
      description: "千本松牧場のメインエントランスに設置。牧場長スタイルのキリッとしたみるくちゃんと記念撮影が楽しめます。"
    },
    {
      id: "p3",
      title: "那須与一弓道着Ver. 等身大パネル",
      character: "大俵ちか",
      spotName: "道の駅 那須与一の郷",
      address: "栃木県大田原市南金丸268-6",
      image: "../assets/otawara-chika.png",
      category: "等身大パネル",
      isNew: true,
      description: "扇の的を射抜いた那須与一の伝説にちなんだ、勇ましい弓道着姿の大俵ちか等身大パネルです。"
    },
    {
      id: "p4",
      title: "エプロンカフェVer. SDパネル",
      character: "那須乃つつじ",
      spotName: "森のカフェ ベルツ",
      address: "栃木県那須郡那須町高久乙1200",
      image: "../assets/nasuno-tsutsuji.png",
      category: "SDパネル",
      isNew: false,
      description: "店内のテラス席近くにちょこんと設置されたミニSDパネル。カフェ巡りのお供にぴったりです。"
    },
    {
      id: "p5",
      title: "温泉浴衣Ver. 等身大パネル",
      character: "狩野みるく",
      spotName: "塩原温泉 湯守田中屋",
      address: "栃木県那須塩原市塩原328",
      image: "../assets/karino-milk.png",
      category: "等身大パネル",
      isNew: false,
      description: "渓谷の絶景を望む野天風呂ロビーに設置。湯上がりに爽やかなみるくちゃんがお出迎えします。"
    }
  ],
  goods: [
    {
      id: "g1",
      name: "ご縁結び御朱印カード (那須乃つつじ)",
      character: "那須乃つつじ",
      spotName: "那須温泉神社",
      price: 500,
      category: "御朱印風カード",
      image: "../assets/nasuno-tsutsuji.png",
      isNew: true,
      stockStatus: "好評販売中"
    },
    {
      id: "g2",
      name: "アクリルスタンド 巫女Ver. (那須乃つつじ)",
      character: "那須乃つつじ",
      spotName: "那須温泉神社 / ベルツ",
      price: 1500,
      category: "アクリルスタンド",
      image: "../assets/nasuno-tsutsuji.png",
      isNew: true,
      stockStatus: "残りわずか"
    },
    {
      id: "g3",
      name: "みるくアイススプーン (狩野みるく)",
      character: "狩野みるく",
      spotName: "千本松牧場 レストラン",
      price: 600,
      category: "食器・雑貨",
      image: "../assets/karino-milk.png",
      isNew: true,
      stockStatus: "好評販売中"
    },
    {
      id: "g4",
      name: "アクリルキーホルダー スーツVer. (狩野みるく)",
      character: "狩野みるく",
      spotName: "千本松牧場 / 田中屋",
      price: 700,
      category: "キーホルダー",
      image: "../assets/karino-milk.png",
      isNew: true,
      stockStatus: "好評販売中"
    },
    {
      id: "g5",
      name: "与一の矢 アクリルチャーム (大俵ちか)",
      character: "大俵ちか",
      spotName: "道の駅 那須与一の郷",
      price: 700,
      category: "チャーム",
      image: "../assets/otawara-chika.png",
      isNew: true,
      stockStatus: "好評販売中"
    },
    {
      id: "g6",
      name: "ご縁結び缶バッジ 3種セット",
      character: "3人集合",
      spotName: "各提携店舗・道の駅",
      price: 800,
      category: "缶バッジ",
      image: "../assets/goen-girl-logo.png",
      isNew: false,
      stockStatus: "好評販売中"
    }
  ],
  collabs: [
    {
      id: "c1",
      title: "塩原温泉郷 ご縁めぐり宿泊プラン",
      character: "狩野みるく",
      spotName: "塩原温泉 湯守田中屋",
      image: "../assets/karino-milk.png",
      isNew: true,
      description: "宿泊者限定の「狩野みるく 特製手ぬぐい＆限定ボイスカード」がもらえるスペシャル宿泊プランです。"
    },
    {
      id: "c2",
      title: "九尾伝説カフェスイーツ コラボセット",
      character: "那須乃つつじ",
      spotName: "森のカフェ ベルツ",
      image: "../assets/nasuno-tsutsuji.png",
      isNew: true,
      description: "つつじちゃんの大好物チーズケーキとオリジナル木製コースターがセットになった限定カフェメニュー。"
    },
    {
      id: "c3",
      title: "那須与一の郷 名物鮎塩焼き＆ご縁米キャンペーン",
      character: "大俵ちか",
      spotName: "道の駅 那須与一の郷",
      image: "../assets/otawara-chika.png",
      isNew: true,
      description: "レストランでお食事または特産品購入で、大俵ちか限定オリジナルステッカーをプレゼント！"
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  renderCharacters();
  renderPanels();
  renderGoods();
  renderCollabs();
  setupModal();
});

function renderCharacters() {
  const container = document.getElementById("char-container");
  if (!container) return;

  container.innerHTML = PORTAL_DATA.characters.map(c => `
    <article class="char-card">
      <div class="char-card-header">
        <img src="${c.image}" alt="${c.name}" class="char-avatar">
        <div>
          <span class="char-region">${c.region}</span>
          <h3 class="char-name">${c.name}</h3>
        </div>
      </div>
      <div class="char-card-body">
        <p class="char-bio">${c.lead}</p>
        <dl class="char-profile-list">
          <dt>誕生日</dt><dd>${c.birthday}</dd>
          <dt>趣味</dt><dd>${c.hobby}</dd>
          <dt>特技</dt><dd>${c.specialty}</dd>
          <dt>設置スポット</dt><dd><strong>${c.spotsCount} か所</strong></dd>
          <dt>限定グッズ</dt><dd><strong>${c.goodsCount} 種</strong></dd>
        </dl>
        <button class="voice-sample-btn" onclick="playVoiceSample('${c.name}', '${c.voiceText.replace(/'/g, "\\'")}')">
          <span>🔊</span> 公式ボイスメッセージを聴く
        </button>
      </div>
    </article>
  `).join("");
}

function renderPanels() {
  const container = document.getElementById("panel-container");
  if (!container) return;

  container.innerHTML = PORTAL_DATA.panels.map(p => `
    <div class="poka-card" onclick="openDetailModal('panel', '${p.id}')">
      <div class="poka-card-img-wrap">
        <img src="${p.image}" alt="${p.title}" class="poka-card-img">
        ${p.isNew ? '<span class="poka-badge-new">NEW</span>' : ''}
        <span class="poka-badge-category">${p.category}</span>
      </div>
      <div class="poka-card-body">
        <p class="poka-card-character">${p.character}</p>
        <h3 class="poka-card-title">${p.title}</h3>
        <p class="poka-card-spot">📍 ${p.spotName}</p>
      </div>
    </div>
  `).join("");
}

function renderGoods() {
  const container = document.getElementById("goods-container");
  if (!container) return;

  container.innerHTML = PORTAL_DATA.goods.map(g => `
    <div class="poka-card" onclick="openDetailModal('goods', '${g.id}')">
      <div class="poka-card-img-wrap">
        <img src="${g.image}" alt="${g.name}" class="poka-card-img">
        ${g.isNew ? '<span class="poka-badge-new">NEW</span>' : ''}
        <span class="poka-badge-category">${g.category}</span>
      </div>
      <div class="poka-card-body">
        <p class="poka-card-character">${g.character}</p>
        <h3 class="poka-card-title">${g.name}</h3>
        <p class="poka-card-spot">🏬 ${g.spotName}</p>
        <p class="poka-card-price">¥${g.price.toLocaleString()} <small>(税込)</small></p>
      </div>
    </div>
  `).join("");
}

function renderCollabs() {
  const container = document.getElementById("collab-container");
  if (!container) return;

  container.innerHTML = PORTAL_DATA.collabs.map(c => `
    <div class="poka-card" onclick="openDetailModal('collab', '${c.id}')">
      <div class="poka-card-img-wrap">
        <img src="${c.image}" alt="${c.title}" class="poka-card-img">
        ${c.isNew ? '<span class="poka-badge-new">NEW</span>' : ''}
        <span class="poka-badge-category">コラボ企画</span>
      </div>
      <div class="poka-card-body">
        <p class="poka-card-character">${c.character}</p>
        <h3 class="poka-card-title">${c.title}</h3>
        <p class="poka-card-spot">🏨 ${c.spotName}</p>
      </div>
    </div>
  `).join("");
}

// Voice synthesis with friendly speech
function playVoiceSample(name, text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.pitch = 1.35; // Cute pitch
    utterance.rate = 1.05;

    // Find female voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes("ja") && (v.name.includes("Kyoko") || v.name.includes("Nanami") || v.name.includes("Otoya") || v.name.includes("Female") || v.name.includes("Microsoft Ichiro") || v.name.includes("Microsoft Sayaka") || v.name.includes("Microsoft Haruka")));
    if (jaVoice) utterance.voice = jaVoice;

    window.speechSynthesis.speak(utterance);
  }
  alert(`【${name}の公式ボイスメッセージ】\n「${text}」`);
}

// Modal handling
function setupModal() {
  const modal = document.getElementById("detail-modal");
  const closeBtn = document.getElementById("detail-modal-close");
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.remove("open");
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove("open");
    };
  }
}

function openDetailModal(type, id) {
  const modal = document.getElementById("detail-modal");
  const content = document.getElementById("detail-modal-content");
  if (!modal || !content) return;

  let item = null;
  let html = "";

  if (type === "panel") {
    item = PORTAL_DATA.panels.find(p => p.id === id);
    if (item) {
      html = `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${item.image}" alt="${item.title}" style="max-height: 260px; object-fit: contain;">
        </div>
        <span style="color: #b8860b; font-weight: 700; font-size: 13px;">${item.character}</span>
        <h2 style="color: #3b3259; font-size: 20px; margin: 6px 0 12px;">${item.title}</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.8; margin-bottom: 16px;">${item.description}</p>
        <div style="background: #faf8fc; padding: 14px; border-radius: 8px; font-size: 13px;">
          <p><strong>設置スポット:</strong> ${item.spotName}</p>
          <p style="color: #666; margin-top: 4px;"><strong>住所:</strong> ${item.address}</p>
        </div>
        <div style="margin-top: 20px; display: flex; gap: 12px;">
          <a href="https://maps.google.com/?q=${encodeURIComponent(item.spotName + ' ' + item.address)}" target="_blank" rel="noopener" class="btn-hero-primary" style="flex: 1; justify-content: center; font-size: 13px; padding: 10px;">
            Google マップでルート案内 ↗
          </a>
          <a href="../member/" class="btn-hero-secondary" style="flex: 1; justify-content: center; font-size: 13px; padding: 10px;">
            現地チェックイン画面へ →
          </a>
        </div>
      `;
    }
  } else if (type === "goods") {
    item = PORTAL_DATA.goods.find(g => g.id === id);
    if (item) {
      html = `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${item.image}" alt="${item.name}" style="max-height: 240px; object-fit: contain;">
        </div>
        <span style="color: #b8860b; font-weight: 700; font-size: 13px;">${item.character}</span>
        <h2 style="color: #3b3259; font-size: 20px; margin: 6px 0 8px;">${item.name}</h2>
        <p style="color: #c84127; font-size: 24px; font-weight: 800; margin-bottom: 16px;">¥${item.price.toLocaleString()} <small style="font-size: 13px; color: #666;">(税込)</small></p>
        <div style="background: #faf8fc; padding: 14px; border-radius: 8px; font-size: 13px;">
          <p><strong>カテゴリ:</strong> ${item.category}</p>
          <p><strong>取扱スポット:</strong> ${item.spotName}</p>
          <p><strong>販売状況:</strong> <span style="color: #006644; font-weight: 700;">${item.stockStatus}</span></p>
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 14px;">※現地店舗の営業時間・在庫状況は変動する場合がございます。事前にご確認ください。</p>
      `;
    }
  } else if (type === "collab") {
    item = PORTAL_DATA.collabs.find(c => c.id === id);
    if (item) {
      html = `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${item.image}" alt="${item.title}" style="max-height: 240px; object-fit: contain;">
        </div>
        <span style="color: #b8860b; font-weight: 700; font-size: 13px;">${item.character}</span>
        <h2 style="color: #3b3259; font-size: 20px; margin: 6px 0 12px;">${item.title}</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.8; margin-bottom: 16px;">${item.description}</p>
        <div style="background: #faf8fc; padding: 14px; border-radius: 8px; font-size: 13px;">
          <p><strong>実施場所:</strong> ${item.spotName}</p>
        </div>
      `;
    }
  }

  content.innerHTML = html;
  modal.classList.add("open");
}

window.playVoiceSample = playVoiceSample;
window.openDetailModal = openDetailModal;
