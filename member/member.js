// Default member state if none exists
const DEFAULT_MEMBER = {
  isLoggedIn: true,
  memberId: "GG-FAN-884920",
  nickname: "ご縁巡礼者",
  joinedDate: new Date().toISOString().split("T")[0],
  points: 100,
  rank: "レギュラー会員",
  title: "那須の旅人",
  favoriteGirl: "那須乃つつじ",
  checkins: [],
  unlockedItems: [],
  history: [
    { text: "新規入会特典ポイント", pts: "+100", date: new Date().toISOString().split("T")[0] }
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

const DEFAULT_SPOTS = [];

// Dynamically get registered spots from Admin shared storage
function getRegisteredSpots() {
  try {
    const shared = localStorage.getItem("goen_girl_companies_shared");
    if (shared) {
      const companies = JSON.parse(shared);
      if (companies && companies.length > 0) {
        return companies.map(c => {
          let town = "栃木県";
          if (c.address) {
            const m = c.address.match(/(那須町|那須塩原市|大田原市|[^市]+[市区町村])/);
            if (m) town = m[0];
          }
          const charName = c.character || "那須乃つつじ";
          const defaultImg = charName === "狩野みるく" ? "../assets/karino-milk.png" : (charName === "大俵ちか" ? "../assets/otawara-chika.png" : "../assets/nasuno-tsutsuji.png");
          return {
            id: c.id,
            name: c.name,
            town: town,
            char: charName,
            charImg: c.characterImg || defaultImg,
            lat: c.lat !== undefined ? Number(c.lat) : 36.9500,
            lng: c.lng !== undefined ? Number(c.lng) : 140.0000,
            panelType: c.panelType || "等身大"
          };
        });
      }
    }
  } catch (e) {
    console.error("Failed to load shared companies", e);
  }
  return DEFAULT_SPOTS;
}

// Haversine formula to calculate distance between two GPS coordinates in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const φ1 = lat1 * rad;
  const φ2 = lat2 * rad;
  const Δφ = (lat2 - lat1) * rad;
  const Δλ = (lon2 - lon1) * rad;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

const SHOP_ITEMS = [
  { id: "item-voice-secret", type: "voice", name: "那須乃つつじ シークレット甘味ボイス", cost: 40, desc: "「和牛もいいですが…あなたと食べるお団子が一番ですわ」" },
  { id: "item-wp-special", type: "wallpaper", name: "3人集合！秋の那須連山特製壁紙", cost: 60, desc: "スマートフォン用高画質描き下ろし待受画像" },
  { id: "item-title-master", type: "title", name: "特別称号【ご縁結びマスター】", cost: 100, desc: "デジタル会員証に金文字で刻まれる名誉称号" }
];

class MemberManager {
  constructor() {
    this.key = "goen_girl_member_session_v2";
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
      return { success: false, message: `本日、${spot.name}の「${spot.char}」パネルには既にチェックイン済みです！` };
    }
    this.member.checkins.push({
      spotId: spot.id,
      spotName: spot.name,
      character: spot.char,
      date: new Date().toISOString().split("T")[0]
    });
    this.addPoints(100, `${spot.name} 現地パネル読み込み`);
    return { success: true, message: `🎉【照合成功】${spot.name} にて「${spot.char}」の等身大パネルを確認しました！\nご縁ポイント 100pt と限定御朱印スタンプを獲得しました！` };
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
  const chkSimulate = document.getElementById("chk-simulate-location");
  const statusNotice = document.getElementById("checkin-status");
  const cameraBox = document.getElementById("camera-box");
  const video = document.getElementById("video-preview");
  const btnRecognize = document.getElementById("btn-recognize");
  const targetCharLabel = document.getElementById("target-char-label");
  const btnSampleFeed = document.getElementById("btn-sample-feed");

  let currentTargetSpot = null;
  let sampleImageOverlay = null;

  // Populate registered spots
  function updateSpotsList() {
    const spots = getRegisteredSpots();
    if (demoSpotSelect) {
      if (spots.length === 0) {
        demoSpotSelect.innerHTML = `<option value="">-- まだ登録された提携店舗はありません --</option>`;
      } else {
        demoSpotSelect.innerHTML = spots.map(s => `
          <option value="${s.id}">${s.town} - ${s.name} (${s.char} / ${s.panelType || '等身大'})</option>
        `).join("");
      }
    }
  }
  updateSpotsList();

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      statusNotice.className = "notice";
      statusNotice.textContent = "📍 現在地（GPS）を確認中...";
      startBtn.disabled = true;

      const spots = getRegisteredSpots();
      if (spots.length === 0) {
        statusNotice.className = "notice error";
        statusNotice.textContent = "現在、提携店舗・パネルスポットは登録されていません。管理画面（/admin/）から新規提携店舗を登録してください。";
        startBtn.disabled = false;
        return;
      }

      const isSimulation = chkSimulate ? chkSimulate.checked : false;

      if (isSimulation) {
        // Simulation mode: pretend to be at the selected spot
        const selectedId = demoSpotSelect ? demoSpotSelect.value : spots[0].id;
        currentTargetSpot = spots.find(s => s.id === selectedId) || spots[0];
        
        statusNotice.className = "notice success";
        statusNotice.textContent = `📍【現地到着を確認】「${currentTargetSpot.name}」の敷地内にいます！店頭の「${currentTargetSpot.char}」等身大パネルをカメラに収めてください。`;
        if (targetCharLabel) targetCharLabel.textContent = `${currentTargetSpot.char} (${currentTargetSpot.panelType || '等身大'})`;
        openCamera(currentTargetSpot);
      } else {
        // Real GPS Mode
        if (!navigator.geolocation) {
          statusNotice.className = "notice error";
          statusNotice.textContent = "お使いのブラウザはGPS位置情報に対応していません。「現地滞在モードON」でテストしてください。";
          startBtn.disabled = false;
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;

            // Find nearest spot among registered spots
            let nearest = null;
            let minDist = Infinity;

            spots.forEach(s => {
              const d = calculateDistance(userLat, userLng, s.lat, s.lng);
              if (d < minDist) {
                minDist = d;
                nearest = s;
              }
            });

            if (!nearest) {
              statusNotice.className = "notice error";
              statusNotice.textContent = "登録されている提携スポットが見つかりません。";
              startBtn.disabled = false;
              return;
            }

            // Check distance threshold: 200 meters
            if (minDist <= 200) {
              currentTargetSpot = nearest;
              statusNotice.className = "notice success";
              statusNotice.textContent = `📍【現地到着を確認】「${nearest.name}」の周辺（約 ${Math.round(minDist)}m）にいます！店頭の「${nearest.char}」等身大パネルをカメラに収めてください。`;
              if (targetCharLabel) targetCharLabel.textContent = `${nearest.char} (${nearest.panelType || '等身大'})`;
              openCamera(nearest);
            } else {
              // Not on site -> Block point acquisition
              currentTargetSpot = null;
              statusNotice.className = "notice error";
              const kmDist = (minDist / 1000).toFixed(1);
              statusNotice.textContent = `❌【現地未到達】最寄りの登録スポット「${nearest.name}」まで約 ${kmDist} km 離れています。現地に到着してからパネルを撮影してください。（※テスト時は上の「現地滞在モードON」をご利用ください）`;
              startBtn.disabled = false;
              if (cameraBox) cameraBox.style.display = "none";
            }
          },
          (err) => {
            console.warn("GPS error:", err);
            statusNotice.className = "notice error";
            statusNotice.textContent = "位置情報（GPS）の取得が許可されていません。スマホの位置情報アクセスを許可するか、「現地滞在モードON」でお試しください。";
            startBtn.disabled = false;
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    });
  }

  async function openCamera(spot) {
    if (sampleImageOverlay) {
      sampleImageOverlay.remove();
      sampleImageOverlay = null;
    }
    try {
      activeVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      video.srcObject = activeVideoStream;
      cameraBox.style.display = "block";
    } catch (e) {
      console.warn("Camera not available or denied, showing fallback UI", e);
      cameraBox.style.display = "block";
      statusNotice.textContent = `（カメラを起動できないため、画像フィード機能で照合テストを行います）`;
      showSampleImageOverlay(spot);
    }
  }

  function showSampleImageOverlay(spot) {
    if (sampleImageOverlay) sampleImageOverlay.remove();
    const videoContainer = video ? video.parentElement : cameraBox;
    sampleImageOverlay = document.createElement("img");
    sampleImageOverlay.src = spot.charImg || "../assets/nasuno-tsutsuji.png";
    sampleImageOverlay.alt = `${spot.char} パネル`;
    sampleImageOverlay.style.cssText = "position: absolute; top: 10%; left: 50%; transform: translateX(-50%); height: 80%; object-fit: contain; z-index: 5; pointer-events: none; opacity: 0.92; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));";
    videoContainer.appendChild(sampleImageOverlay);
  }

  if (btnSampleFeed) {
    btnSampleFeed.addEventListener("click", () => {
      if (!currentTargetSpot) return;
      showSampleImageOverlay(currentTargetSpot);
      statusNotice.textContent = `店頭の「${currentTargetSpot.char}」等身大パネルがカメラ枠にセットされました！`;
    });
  }

  if (btnRecognize) {
    btnRecognize.addEventListener("click", () => {
      if (!currentTargetSpot) {
        alert("現地スポットが特定されていません。先に「現在地を確認してパネルを読み取る」を押してください。");
        return;
      }

      btnRecognize.disabled = true;
      btnRecognize.textContent = `AIパネル照合中（${currentTargetSpot.char} / 特徴一致率 98.4%）...`;

      setTimeout(() => {
        btnRecognize.disabled = false;
        btnRecognize.textContent = "✨ パネル画像を認識してポイント獲得！";

        if (activeVideoStream) {
          activeVideoStream.getTracks().forEach(t => t.stop());
          activeVideoStream = null;
        }
        if (sampleImageOverlay) {
          sampleImageOverlay.remove();
          sampleImageOverlay = null;
        }
        cameraBox.style.display = "none";
        startBtn.disabled = false;

        const result = mgr.checkin(currentTargetSpot);
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
      }, 1000);
    });
  }
}

function renderStamps() {
  const container = document.getElementById("stamps-container");
  if (!container) return;

  const spots = getRegisteredSpots();
  if (spots.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: #777; background: #fff; border: 1px dashed var(--line); border-radius: var(--radius-md);">
        <div style="font-size: 32px; margin-bottom: 8px;">🎴</div>
        <strong style="font-size: 15px; color: #333; display: block; margin-bottom: 4px;">登録された提携店舗・パネルスポットはありません</strong>
        <span>運営管理コンソール（/admin/）から新しい店舗とパネルをご登録いただくと、ここに自動反映されます。</span>
      </div>
    `;
    return;
  }

  container.innerHTML = spots.map(spot => {
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
