// Default member state if none exists
const DEFAULT_MEMBER = {
  isLoggedIn: true,
  memberId: "GG-FAN-884920",
  nickname: "ご縁巡礼者",
  joinedDate: "2026-09-01",
  points: 150,
  rank: "レギュラー会員",
  title: "那須の旅人",
  favoriteGirl: "那須乃つつじ",
  checkins: [
    { spotId: "s1", spotName: "那須温泉神社", character: "那須乃つつじ", date: "2026-09-10" }
  ],
  unlockedItems: ["voice-tsutsuji-welcome", "wp-tsutsuji-spring"],
  history: [
    { text: "新規入会特典ポイント", pts: "+100", date: "2026-09-01" },
    { text: "那須温泉神社 現地チェックイン", pts: "+50", date: "2026-09-10" }
  ]
};

const CHARACTER_META = {
  "那須乃つつじ": {
    themeClass: "theme-tsutsuji",
    avatar: "../assets/nasuno-tsutsuji.png",
    color: "#e9588d",
    greeting: "ご縁に感謝いたしますわ。今日も素敵な一日になりますように。"
  },
  "狩野みるく": {
    themeClass: "theme-milk",
    avatar: "../assets/karino-milk.png",
    color: "#1199c4",
    greeting: "お疲れさま！今日も元気いっぱい笑顔で巡礼いってみよー！"
  },
  "大俵ちか": {
    themeClass: "theme-chika",
    avatar: "../assets/otawara-chika.png",
    color: "#c84127",
    greeting: "一矢必中！ご縁の矢を放って、最高の出会いをつかみ取りましょう！"
  }
};

const ALL_SPOTS = [
  { id: "s1", name: "那須温泉神社", town: "那須町", char: "那須乃つつじ", lat: 37.1002, lng: 139.9678 },
  { id: "s2", name: "森のカフェ ベルツ", town: "那須町", char: "那須乃つつじ", lat: 37.0655, lng: 139.9921 },
  { id: "s3", name: "千本松牧場 レストラン", town: "那須塩原市", char: "狩野みるく", lat: 36.9123, lng: 139.9542 },
  { id: "s4", name: "塩原温泉 湯守田中屋", town: "那須塩原市", char: "狩野みるく", lat: 36.9688, lng: 139.8155 },
  { id: "s5", name: "道の駅 那須与一の郷", town: "大田原市", char: "大俵ちか", lat: 36.8542, lng: 140.0631 },
  { id: "s6", name: "黒羽城址 前田屋", town: "大田原市", char: "大俵ちか", lat: 36.8711, lng: 140.1245 }
];

const SHOP_ITEMS = [
  { id: "item-voice-secret", type: "voice", name: "那須乃つつじ シークレット甘味ボイス", cost: 40, desc: "「和牛もいいですが…あなたと食べるお団子が一番ですわ」" },
  { id: "item-wp-special", type: "wallpaper", name: "3人集合！秋の那須連山特製壁紙", cost: 60, desc: "スマートフォン用高画質描き下ろし待受画像" },
  { id: "item-title-master", type: "title", name: "特別称号【ご縁結びマスター】", cost: 100, desc: "デジタル会員証に金文字で刻まれる名誉称号" }
];

class MemberManager {
  constructor() {
    this.key = "goen_girl_member_session";
    this.member = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    this.save(DEFAULT_MEMBER);
    return JSON.parse(JSON.stringify(DEFAULT_MEMBER));
  }

  save(data) {
    this.member = data || this.member;
    localStorage.setItem(this.key, JSON.stringify(this.member));
  }

  addPoints(amount, reason) {
    this.member.points += amount;
    this.member.history.unshift({
      text: reason,
      pts: (amount >= 0 ? "+" : "") + amount,
      date: new Date().toISOString().split("T")[0]
    });
    this.save();
  }

  checkin(spot) {
    const exists = this.member.checkins.find(c => c.spotId === spot.id);
    if (exists) {
      return { success: false, message: `本日、${spot.name}には既にチェックイン済みです！` };
    }
    this.member.checkins.push({
      spotId: spot.id,
      spotName: spot.name,
      character: spot.char,
      date: new Date().toISOString().split("T")[0]
    });
    this.addPoints(50, `${spot.name} 現地チェックイン`);
    return { success: true, message: `🎉 ${spot.name} にチェックインしました！ 50 GOEN POINTを獲得しました！` };
  }
}

const mgr = new MemberManager();
let activeVideoStream = null;

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupMemberCard();
  setupCheckin();
  renderStamps();
  renderMedia();
  renderShop();
  renderHistory();
});

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach(t => {
    t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.remove("active"));
      panels.forEach(p => p.hidden = true);

      t.classList.add("active");
      const targetPanel = document.getElementById(`panel-${t.dataset.tab}`);
      if (targetPanel) targetPanel.hidden = false;
    });
  });
}

function setupMemberCard() {
  renderCardInfo();

  const changeOshiBtn = document.getElementById("btn-change-oshi");
  if (changeOshiBtn) {
    changeOshiBtn.addEventListener("click", () => {
      const girlNames = Object.keys(CHARACTER_META);
      const currentIndex = girlNames.indexOf(mgr.member.favoriteGirl);
      const nextGirl = girlNames[(currentIndex + 1) % girlNames.length];
      mgr.member.favoriteGirl = nextGirl;
      mgr.save();
      renderCardInfo();
      alert(`推しガールを【${nextGirl}】に設定しました！`);
    });
  }

  const logoutBtn = document.getElementById("btn-toggle-login");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (mgr.member.isLoggedIn) {
        if (confirm("ログアウトしますか？")) {
          mgr.member.isLoggedIn = false;
          mgr.save();
          renderCardInfo();
        }
      } else {
        mgr.member.isLoggedIn = true;
        mgr.save();
        renderCardInfo();
        alert("ログインしました！");
      }
    });
  }
}

function renderCardInfo() {
  const pass = document.getElementById("member-pass-card");
  const meta = CHARACTER_META[mgr.member.favoriteGirl] || CHARACTER_META["那須乃つつじ"];

  // Update theme classes
  pass.className = "member-pass " + meta.themeClass;
  document.getElementById("pass-avatar").src = meta.avatar;
  document.getElementById("pass-id").textContent = mgr.member.isLoggedIn ? mgr.member.memberId : "GUEST-000000";
  document.getElementById("pass-nickname").textContent = mgr.member.isLoggedIn ? mgr.member.nickname : "ゲスト会員様";
  document.getElementById("pass-oshi-name").textContent = `推し: ${mgr.member.favoriteGirl}`;
  document.getElementById("pass-title-badge").textContent = mgr.member.title || "ご縁ビギナー";
  document.getElementById("pass-points").textContent = mgr.member.points.toLocaleString();

  const toggleBtn = document.getElementById("btn-toggle-login");
  if (toggleBtn) {
    toggleBtn.textContent = mgr.member.isLoggedIn ? "ログアウト" : "LINE / 会員ログイン";
  }
}

function setupCheckin() {
  const startBtn = document.getElementById("btn-start-checkin");
  const demoSpotSelect = document.getElementById("demo-spot-select");
  const statusNotice = document.getElementById("checkin-status");
  const cameraBox = document.getElementById("camera-box");
  const video = document.getElementById("video-preview");
  const btnRecognize = document.getElementById("btn-recognize");

  // Populate demo spot select
  if (demoSpotSelect) {
    demoSpotSelect.innerHTML = ALL_SPOTS.map(s => `
      <option value="${s.id}">${s.town} - ${s.name} (${s.char})</option>
    `).join("");
  }

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      statusNotice.className = "notice";
      statusNotice.textContent = "現在地 (GPS) を確認しています...";
      startBtn.disabled = true;

      // Try actual geolocation or fallback to demo
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            statusNotice.textContent = `現在地を取得しました (緯度: ${pos.coords.latitude.toFixed(2)}, 経度: ${pos.coords.longitude.toFixed(2)})。パネルをカメラで読み取ってください。`;
            openCamera();
          },
          (err) => {
            statusNotice.textContent = `位置情報の取得がスキップされました（デモモードでスポットを判定します）。カメラを起動します。`;
            openCamera();
          },
          { timeout: 4000 }
        );
      } else {
        openCamera();
      }
    });
  }

  async function openCamera() {
    try {
      activeVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      video.srcObject = activeVideoStream;
      cameraBox.style.display = "block";
      statusNotice.textContent = "等身大パネルの顔または衣装全体を枠内に収めてください。";
    } catch (e) {
      cameraBox.style.display = "block";
      statusNotice.textContent = "（カメラ非対応または未許可のため、シミュレーション読取を実行できます）";
    }
  }

  if (btnRecognize) {
    btnRecognize.addEventListener("click", () => {
      const spotId = demoSpotSelect.value;
      const spot = ALL_SPOTS.find(s => s.id === spotId);
      if (!spot) return;

      btnRecognize.disabled = true;
      btnRecognize.textContent = "AI画像照合中...";

      setTimeout(() => {
        btnRecognize.disabled = false;
        btnRecognize.textContent = "パネルを認識・ポイント獲得！";

        if (activeVideoStream) {
          activeVideoStream.getTracks().forEach(t => t.stop());
          activeVideoStream = null;
        }
        cameraBox.style.display = "none";
        startBtn.disabled = false;

        const result = mgr.checkin(spot);
        if (result.success) {
          statusNotice.className = "notice success";
          statusNotice.textContent = result.message;
          renderCardInfo();
          renderStamps();
          renderHistory();
          alert(result.message);
        } else {
          statusNotice.className = "notice";
          statusNotice.textContent = result.message;
          alert(result.message);
        }
      }, 900);
    });
  }
}

function renderStamps() {
  const container = document.getElementById("stamps-container");
  if (!container) return;

  container.innerHTML = ALL_SPOTS.map(spot => {
    const checkinRecord = mgr.member.checkins.find(c => c.spotId === spot.id);
    const isStamped = !!checkinRecord;

    return `
      <div class="stamp-slot ${isStamped ? 'stamped' : ''}">
        <div class="stamp-mark">${isStamped ? '結' : '？'}</div>
        <div class="stamp-spot-name">${spot.name}</div>
        <small style="color: #6b8292;">${spot.char}</small>
        <div class="stamp-date">${isStamped ? `来訪: ${checkinRecord.date}` : '未チェックイン'}</div>
      </div>
    `;
  }).join("");
}

function renderMedia() {
  const container = document.getElementById("media-container");
  if (!container) return;

  const currentMeta = CHARACTER_META[mgr.member.favoriteGirl] || CHARACTER_META["那須乃つつじ"];

  container.innerHTML = `
    <div class="media-item-card">
      <div class="media-item-title">🎙️ ${mgr.member.favoriteGirl} 日替わり限定ボイス</div>
      <div class="media-item-desc">会員証の推しガールに設定中の限定あいさつボイスです。</div>
      <button class="btn-secondary" onclick="playMemberVoice('${mgr.member.favoriteGirl}', '${currentMeta.greeting}')">
        🔊 ボイスメッセージを再生
      </button>
    </div>

    <div class="media-item-card">
      <div class="media-item-title">🖼️ 会員限定 春のデジタル壁紙 (那須乃つつじ)</div>
      <div class="media-item-desc">入会特典として付与された高解像度壁紙イラストです。</div>
      <a href="../assets/nasuno-tsutsuji.png" target="_blank" class="btn-secondary" style="text-decoration:none;">
        👁️ 壁紙を拡大プレビュー・保存
      </a>
    </div>

    <div class="media-item-card">
      <div class="media-item-title">🎬 SNS配信PR動画アーカイブ</div>
      <div class="media-item-desc">毎月制作される那須町・那須塩原・大田原の縦型動画集。</div>
      <a href="../portal/#characters" class="btn-secondary" style="text-decoration:none;">
        ▶ ポータルで最新動画を見る
      </a>
    </div>
  `;
}

function playMemberVoice(name, text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.pitch = 1.35;
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  }
  alert(`【${name}の会員限定ボイス】\n「${text}」`);
}

function renderShop() {
  const container = document.getElementById("shop-container");
  if (!container) return;

  container.innerHTML = SHOP_ITEMS.map(item => {
    const isUnlocked = mgr.member.unlockedItems.includes(item.id);

    return `
      <div class="shop-card">
        <div>
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">${item.name}</div>
          <div style="font-size: 12px; color: #6b8292;">${item.desc}</div>
        </div>
        <div>
          <div class="shop-card-cost">${item.cost} GOEN POINT</div>
          ${isUnlocked ? `
            <button class="btn-secondary" disabled style="width: 100%; opacity: 0.7;">
              ✔ 交換・解放済み
            </button>
          ` : `
            <button class="btn-primary" style="width: 100%; padding: 10px; font-size: 13px;" onclick="exchangeItem('${item.id}')">
              ポイントで交換する
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

function exchangeItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  if (mgr.member.points < item.cost) {
    alert(`ポイントが不足しています。\n必要ポイント: ${item.cost}pt\n現在ポイント: ${mgr.member.points}pt\n\n等身大パネルにチェックインしてポイントを貯めましょう！`);
    return;
  }

  if (confirm(`【${item.name}】を ${item.cost} ポイントで交換・解放しますか？`)) {
    mgr.addPoints(-item.cost, `特典交換: ${item.name}`);
    mgr.member.unlockedItems.push(item.id);
    if (item.type === "title") {
      mgr.member.title = "ご縁結びマスター";
    }
    mgr.save();
    renderCardInfo();
    renderShop();
    renderHistory();
    alert(`🎉 交換が完了しました！特典が解放されました。`);
  }
}

function renderHistory() {
  const container = document.getElementById("history-container");
  if (!container) return;

  container.innerHTML = mgr.member.history.map(h => `
    <li class="history-item">
      <div>
        <div style="font-weight: 600;">${h.text}</div>
        <small style="color: #8da4b0;">${h.date}</small>
      </div>
      <div class="history-pts ${h.pts.startsWith('+') ? 'plus' : 'minus'}">${h.pts} pt</div>
    </li>
  `).join("");
}

window.playMemberVoice = playMemberVoice;
window.exchangeItem = exchangeItem;
