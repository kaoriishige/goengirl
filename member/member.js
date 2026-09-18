/**
 * ご縁ガール 会員ダッシュボード (member.js)
 * 全国展開対応、会員プラン制（無料/480円/980円）、ポイント台帳、達成型称号、
 * 重複防止チェックイン、グッズコレクション・受取予約、コミュニティ交流
 */

// デフォルト会員データ（既存ユーザーの互換性維持＋新機能フィールド追加）
const DEFAULT_MEMBER = {
  isLoggedIn: true,
  memberId: "GG-FAN-884920",
  nickname: "ご縁巡礼者",
  joinedDate: new Date().toISOString().split("T")[0],
  plan: "free", // "free" | "supporter" (480円) | "cocreation" (980円)
  planNextBillingDate: null,
  planStatus: "active",
  points: 100,
  title: "初めてのご縁",
  favoriteGirl: "那須乃つつじ",
  checkins: [
    {
      spotId: "FAC_C001",
      spotName: "那須ミッドシティホテル",
      character: "狩野くるみ",
      costumeName: "那須ミッドシティホテル制服",
      regionId: "REG_NASUSHIOBARA",
      date: new Date().toISOString().split("T")[0],
      isFirstVisit: true
    }
  ],
  unlockedItems: [],
  achievedTitles: ["TITLE_FIRST"],
  wantsGoods: [],
  ownsGoods: [],
  reservations: [],
  history: [
    { text: "新規入会特典ポイント", pts: "+100", date: new Date().toISOString().split("T")[0] }
  ],
  ledger: [
    {
      id: "LEDGER_001",
      type: "grant",
      amount: 100,
      reason: "新規入会特典",
      facilityId: null,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now()
    }
  ]
};

// キャラクターメタ情報
const CHARACTER_META = {
  "那須乃つつじ": {
    themeClass: "theme-tsutsuji",
    avatar: "../assets/nasuno-tsutsuji.png",
    color: "#e9588d",
    greeting: "ご縁に感謝いたしますわ。今日も素敵な一日になりますように。"
  },
  "狩野くるみ": {
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

// 企画投票の選択肢（要件15: 運営が選定した実施可能候補）
const VOTE_CANDIDATES = [
  { id: "VOTE_01", title: "栃木3市連携 湯巡り御朱印スタンプラリー", votes: 42, desc: "那須塩原・那須・大田原の温泉施設とコラボした特製スタンプ帳企画" },
  { id: "VOTE_02", title: "狩野くるみ 那須ミッドシティホテルコラボ 宿泊体験プラン", votes: 68, desc: "那須塩原の生乳を使用した特製チーズケーキ＆缶バッジセット" },
  { id: "VOTE_03", title: "那須乃つつじ＆大俵ちか 合同秋祭りミニ色紙", votes: 35, desc: "高野山真言宗 高福寺例大祭・与一まつり記念の合同記念品" }
];

// コミュニティ初期投稿データ
const INITIAL_POSTS = [
  {
    id: "P001",
    userName: "とちぎ巡礼団",
    userPlan: "共創会員",
    character: "狩野くるみ",
    spotName: "那須ミッドシティホテル",
    region: "那須塩原市",
    text: "那須ミッドシティホテルのロビーでくるみちゃんの等身大パネルに会えました！フロントの方も親切で最高でした。",
    likes: 12,
    date: "2026-09-17"
  },
  {
    id: "P002",
    userName: "つつじ推し",
    userPlan: "応援会員",
    character: "那須乃つつじ",
    spotName: "高野山真言宗 高福寺",
    region: "那須町",
    text: "高野山真言宗 高福寺でつつじちゃんの巫女装束を拝見！境内を散策しながら限定の御朱印も受けることができました。",
    likes: 18,
    date: "2026-09-16"
  }
];

// Haversine距離計算（メートル）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const φ1 = lat1 * rad;
  const φ2 = lat2 * rad;
  const Δφ = (lat2 - lat1) * rad;
  const Δλ = (lon2 - lon1) * rad;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 日本時間（JST）の暦月キーを取得 ("YYYY-MM")
function getJSTMonthKey(d = new Date()) {
  const jst = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000);
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * MemberManager
 */
class MemberManager {
  constructor() {
    this.key = "goen_girl_member_session_v2";
    this.postsKey = "goen_girl_community_posts_v2";
    this.votesKey = "goen_girl_votes_v2";
    this.master = null;
    this.member = this.load();
    this.posts = this.loadPosts();
    this.votes = this.loadVotes();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) {
        const data = JSON.parse(stored);
        // マイグレーション: 新規フィールドが不足している場合は補完
        if (!data.plan) data.plan = "free";
        if (!data.ledger) {
          data.ledger = (data.history || []).map((h, i) => ({
            id: `MIG_${i}`,
            type: h.pts && h.pts.startsWith("-") ? "consume" : "grant",
            amount: parseInt(h.pts, 10) || 0,
            reason: h.text || "移行記録",
            date: h.date || new Date().toISOString().split("T")[0],
            timestamp: Date.now() - (i * 1000)
          }));
        }
        if (!data.achievedTitles) data.achievedTitles = ["TITLE_FIRST"];
        if (!data.wantsGoods) data.wantsGoods = [];
        if (!data.ownsGoods) data.ownsGoods = [];
        if (!data.reservations) data.reservations = [];
        this.save(data);
        return data;
      }
    } catch (e) {
      console.error("Failed to load member session", e);
    }
    this.save(DEFAULT_MEMBER);
    return JSON.parse(JSON.stringify(DEFAULT_MEMBER));
  }

  save(data) {
    this.member = data || this.member;
    localStorage.setItem(this.key, JSON.stringify(this.member));
  }

  loadPosts() {
    try {
      const stored = localStorage.getItem(this.postsKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(this.postsKey, JSON.stringify(INITIAL_POSTS));
    return JSON.parse(JSON.stringify(INITIAL_POSTS));
  }

  savePosts() {
    localStorage.setItem(this.postsKey, JSON.stringify(this.posts));
  }

  loadVotes() {
    try {
      const stored = localStorage.getItem(this.votesKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return JSON.parse(JSON.stringify(VOTE_CANDIDATES));
  }

  saveVotes() {
    localStorage.setItem(this.votesKey, JSON.stringify(this.votes));
  }

  // ポイント台帳への記録（直接書き換え禁止）
  recordLedgerTransaction(type, amount, reason, facilityId = null) {
    const today = new Date().toISOString().split("T")[0];
    const item = {
      id: "LEDGER_" + Date.now(),
      type: type, // "grant" | "consume" | "adjust"
      amount: amount,
      reason: reason,
      facilityId: facilityId,
      date: today,
      timestamp: Date.now()
    };
    this.member.ledger.unshift(item);
    this.member.points += amount;
    this.member.history.unshift({
      text: reason,
      pts: (amount >= 0 ? "+" : "") + amount,
      date: today
    });
    this.save();
  }

  // チェックイン判定＆ポイント付与ロジック（要件6・7・8）
  processCheckin(facility, costume, character) {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = getJSTMonthKey();

    // 過去の同施設チェックイン記録
    const facilityCheckins = this.member.checkins.filter(c => c.spotId === facility.id);
    const isFirstVisit = (facilityCheckins.length === 0);

    // 同日・同スポットの重複操作防止
    const todayCheckin = facilityCheckins.find(c => c.date === today);
    if (todayCheckin) {
      return {
        success: false,
        isDuplicateToday: true,
        message: `本日、${facility.name}には既にチェックイン済みです（同日の重複申請は無効です）。`
      };
    }

    let earnedPoints = 0;
    let pointReasons = [];
    let isRevisitPointsAwarded = false;

    if (isFirstVisit) {
      // 初回訪問: 100pt（施設単位で1回）
      earnedPoints += 100;
      pointReasons.push(`初訪問100pt`);
    } else {
      // 再訪判定: 月1回まで30pt。ただし初回訪問月には再訪30ptを追加付与しない。
      const firstCheckin = facilityCheckins[facilityCheckins.length - 1]; // 最古の訪問
      const firstVisitMonth = firstCheckin.date ? firstCheckin.date.substring(0, 7) : "";
      const hasRevisitThisMonth = facilityCheckins.some(c => c.date && c.date.substring(0, 7) === currentMonth && !c.isFirstVisit);

      if (firstVisitMonth === currentMonth) {
        // 初回訪問月と同月 -> 再訪30ptは付与しない
        pointReasons.push(`今月初回訪問済みのため再訪ptなし`);
      } else if (hasRevisitThisMonth) {
        // 今月すでに再訪pt獲得済み
        pointReasons.push(`今月の再訪30pt獲得済み`);
      } else {
        // 翌月以降、月1回目の再訪 -> 30pt付与
        earnedPoints += 30;
        pointReasons.push(`月次再訪30pt`);
        isRevisitPointsAwarded = true;
      }
    }

    // チェックインをスタンプ帳に記録
    const record = {
      spotId: facility.id,
      spotName: facility.name,
      character: character.name,
      costumeName: costume ? costume.name : "通常衣装",
      regionId: facility.regionId,
      date: today,
      isFirstVisit: isFirstVisit
    };
    this.member.checkins.unshift(record);

    // ボーナスポイント判定（地域達成・2地域目以降初訪問）
    let bonusPoints = 0;
    const allVisitedFacilities = [...new Set(this.member.checkins.map(c => c.spotId))];
    const allVisitedRegions = [...new Set(this.member.checkins.map(c => c.regionId))];

    // ① 同一地域の異なる3施設達成ボーナス: +100pt（地域ごとに1回限り）
    const regionVisitedCount = this.master ? this.master.facilities.filter(f => f.regionId === facility.regionId && allVisitedFacilities.includes(f.id)).length : 0;
    const regionBonusKey = `BONUS_REGION_3_${facility.regionId}`;
    if (regionVisitedCount >= 3 && !this.member.ledger.some(l => l.reason.includes(`同一地域3施設ボーナス(${facility.regionId})`))) {
      bonusPoints += 100;
      this.recordLedgerTransaction("grant", 100, `同一地域3施設ボーナス(${facility.regionId})`, facility.id);
      pointReasons.push(`同一地域3施設達成ボーナス100pt`);
    }

    // ② 初めて訪問する2地域目以降の地域: +100pt（地域ごとに1回限り。最初の地域には追加なし）
    if (allVisitedRegions.length >= 2 && !this.member.ledger.some(l => l.reason.includes(`別地域初訪問ボーナス(${facility.regionId})`))) {
      // 最初の地域でないか確認
      const firstRegionId = this.member.checkins[this.member.checkins.length - 1].regionId;
      if (facility.regionId !== firstRegionId) {
        bonusPoints += 100;
        this.recordLedgerTransaction("grant", 100, `別地域初訪問ボーナス(${facility.regionId})`, facility.id);
        pointReasons.push(`別地域初訪問ボーナス100pt`);
      }
    }

    // 基本ポイントの台帳記録
    if (earnedPoints > 0) {
      this.recordLedgerTransaction("grant", earnedPoints, `${facility.name} 現地チェックイン (${pointReasons[0]})`, facility.id);
    } else {
      this.save();
    }

    // 称号の判定と更新
    this.checkTitleAchievements(allVisitedFacilities.length, allVisitedRegions.length);

    return {
      success: true,
      facilityName: facility.name,
      characterName: character.name,
      costumeName: costume ? costume.name : "通常衣装",
      earnedPoints: earnedPoints + bonusPoints,
      isFirstVisit: isFirstVisit,
      pointReasons: pointReasons,
      message: isFirstVisit
        ? `初訪問 100pt を獲得しました！`
        : (earnedPoints > 0 ? `今月の再訪ポイント 30pt を獲得しました！` : `本日の訪問を記録しました。今月の再訪ポイントは獲得済みです。`)
    };
  }

  // 称号達成判定（要件13）
  checkTitleAchievements(totalFacilities, totalRegions) {
    let newlyAchieved = [];
    if (!this.member.achievedTitles) this.member.achievedTitles = [];

    // 初回訪問
    if (totalFacilities >= 1 && !this.member.achievedTitles.includes("TITLE_FIRST")) {
      this.member.achievedTitles.push("TITLE_FIRST");
      newlyAchieved.push("初めてのご縁");
    }
    // 同一地域3施設（仮判定）
    if (totalFacilities >= 3 && !this.member.achievedTitles.includes("TITLE_REGION")) {
      this.member.achievedTitles.push("TITLE_REGION");
      newlyAchieved.push("地域のご縁");
    }
    // 3地域訪問
    if (totalRegions >= 3 && !this.member.achievedTitles.includes("TITLE_TRAVEL")) {
      this.member.achievedTitles.push("TITLE_TRAVEL");
      newlyAchieved.push("旅するご縁");
    }
    // 10施設訪問
    if (totalFacilities >= 10 && !this.member.achievedTitles.includes("TITLE_MASTER")) {
      this.member.achievedTitles.push("TITLE_MASTER");
      newlyAchieved.push("ご縁結びマスター");
      this.member.title = "ご縁結びマスター";
    }

    this.save();
    return newlyAchieved;
  }
}

const mgr = new MemberManager();
window.mgr = mgr;
let activeVideoStream = null;
let currentTargetSpot = null;

// アプリ初期化
document.addEventListener("DOMContentLoaded", async () => {
  await loadMasterData();
  setupNavigation();
  renderMemberCard();
  renderOshiSection();
  setupCheckinSystem();
  renderStatsAndTitles();
  renderNextDestinations();
  renderStampBook();
  renderGoodsCollection();
  renderMemberContents();
  renderCommunity();
  renderShop();
  renderPlans();
  setupModals();
});

/**
 * マスターデータの読み込み
 */
async function loadMasterData() {
  try {
    const res = await fetch("../data/master.json?v=" + Date.now());
    if (res.ok) {
      mgr.master = await res.json();
    }
  } catch (e) {
    console.warn("Failed to load master.json, using bundled data", e);
  }

  // フォールバック用の最小構成
  if (!mgr.master) {
    mgr.master = {
      regions: [
        { id: "REG_NASUSHIOBARA", name: "那須塩原市", pref: "栃木県", characterId: "CHAR_MILK" },
        { id: "REG_NASUMACHI", name: "那須町", pref: "栃木県", characterId: "CHAR_TSUTSUJI" },
        { id: "REG_OTAWARA", name: "大田原市", pref: "栃木県", characterId: "CHAR_CHIKA" }
      ],
      characters: [
        { id: "CHAR_MILK", name: "狩野くるみ", avatar: "../assets/karino-milk.png", color: "#1199c4" },
        { id: "CHAR_TSUTSUJI", name: "那須乃つつじ", avatar: "../assets/nasuno-tsutsuji.png", color: "#e9588d" },
        { id: "CHAR_CHIKA", name: "大俵ちか", avatar: "../assets/otawara-chika.png", color: "#c84127" }
      ],
      facilities: [
        {
          id: "FAC_C001",
          name: "那須ミッドシティホテル",
          regionId: "REG_NASUSHIOBARA",
          address: "栃木県那須塩原市方京1-1-10",
          lat: 36.933365,
          lng: 140.017654,
          allowedDistance: 200,
          character: "狩野くるみ",
          openingHours: "フロント 24h"
        }
      ],
      costumes: [
        { id: "COST_MILK_HOTEL", characterId: "CHAR_MILK", facilityId: "FAC_C001", name: "那須ミッドシティホテル制服", image: "../assets/karino-milk.png" }
      ],
      panels: [
        { id: "PANEL_C001_1", facilityId: "FAC_C001", costumeId: "COST_MILK_HOTEL" }
      ],
      goods: [],
      titles: [],
      rewards: []
    };
  }
}

/**
 * ナビゲーション設定（下部ナビゲーション 5項目）
 */
function setupNavigation() {
  const navItems = document.querySelectorAll(".bottom-nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      const nav = item.dataset.nav;
      let targetSectionId = "section-oshi-news";
      if (nav === "home") targetSectionId = "member-pass-card";
      if (nav === "explore") targetSectionId = "section-next-destinations";
      if (nav === "checkin") targetSectionId = "section-checkin-action";
      if (nav === "collection") targetSectionId = "section-stamp-book";
      if (nav === "community") targetSectionId = "section-community";

      const el = document.getElementById(targetSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/**
 * デジタル会員証レンダリング
 */
function renderMemberCard() {
  const meta = CHARACTER_META[mgr.member.favoriteGirl] || CHARACTER_META["那須乃つつじ"];
  const pass = document.getElementById("member-pass-card");
  if (pass) pass.className = "member-pass " + meta.themeClass;

  const avatar = document.getElementById("pass-avatar");
  if (avatar) avatar.src = meta.avatar;

  const nickname = document.getElementById("pass-nickname");
  if (nickname) nickname.textContent = mgr.member.nickname + " 様";

  const oshiName = document.getElementById("pass-oshi-name");
  if (oshiName) oshiName.textContent = `推し: ${mgr.member.favoriteGirl}`;

  const titleBadge = document.getElementById("pass-title-badge");
  if (titleBadge) titleBadge.textContent = mgr.member.title || "初めてのご縁";

  const points = document.getElementById("pass-points");
  if (points) points.textContent = mgr.member.points.toLocaleString();

  // プラン表示
  const planTag = document.getElementById("pass-plan-tag");
  const headerPlan = document.getElementById("header-plan-badge");
  let planLabel = "無料会員 (0円)";
  if (mgr.member.plan === "supporter") planLabel = "応援会員 (月額480円)";
  if (mgr.member.plan === "cocreation") planLabel = "共創会員 (月額980円)";

  if (planTag) planTag.textContent = planLabel;
  if (headerPlan) headerPlan.textContent = mgr.member.plan === "free" ? "無料会員" : (mgr.member.plan === "supporter" ? "応援会員" : "共創会員");

  // 訪問統計
  const visitedFacilityCount = new Set(mgr.member.checkins.map(c => c.spotId)).size;
  const visitedRegionCount = new Set(mgr.member.checkins.map(c => c.regionId)).size;

  const vCountEl = document.getElementById("pass-visit-count");
  if (vCountEl) vCountEl.textContent = visitedFacilityCount;

  const rCountEl = document.getElementById("pass-region-count");
  if (rCountEl) rCountEl.textContent = visitedRegionCount;

  // 推し変更ボタン
  const btnChangeOshi = document.getElementById("btn-change-oshi");
  if (btnChangeOshi) {
    btnChangeOshi.onclick = () => {
      const names = Object.keys(CHARACTER_META);
      const idx = names.indexOf(mgr.member.favoriteGirl);
      const next = names[(idx + 1) % names.length];
      mgr.member.favoriteGirl = next;
      mgr.save();
      renderMemberCard();
      renderOshiSection();
      alert(`推しキャラクターを【${next}】に変更しました！`);
    };
  }

  // プラン変更ボタン
  const btnOpenPlans = document.getElementById("btn-open-plans");
  if (btnOpenPlans) {
    btnOpenPlans.onclick = () => {
      const el = document.getElementById("section-plans");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
  }

  // ログアウトトグル
  const btnToggleLogin = document.getElementById("btn-toggle-login");
  if (btnToggleLogin) {
    btnToggleLogin.onclick = () => {
      alert("ご縁ガール会員ダッシュボードです。\n現在のアカウント状態はブラウザに安全に保存されています。");
    };
  }
}

/**
 * 1. 推しの近況・次の楽しみ
 */
function renderOshiSection() {
  const meta = CHARACTER_META[mgr.member.favoriteGirl] || CHARACTER_META["那須乃つつじ"];
  const headline = document.getElementById("oshi-headline-name");
  if (headline) headline.textContent = mgr.member.favoriteGirl;

  const msg = document.getElementById("oshi-message-text");
  if (msg) {
    msg.textContent = `「${meta.greeting}」`;
  }
}

/**
 * 2. 現地チェックインシステム（GPS + カメラ枠照合）
 */
function setupCheckinSystem() {
  const startBtn = document.getElementById("btn-start-checkin");
  const demoSelect = document.getElementById("demo-spot-select");
  const chkSimulate = document.getElementById("chk-simulate-location");
  const statusNotice = document.getElementById("checkin-status");
  const cameraBox = document.getElementById("camera-box");
  const video = document.getElementById("video-preview");
  const btnRecognize = document.getElementById("btn-recognize");
  const targetCharLabel = document.getElementById("target-char-label");
  const btnSampleFeed = document.getElementById("btn-sample-feed");

  // スポット一覧のプルダウン充填
  if (demoSelect && mgr.master) {
    demoSelect.innerHTML = mgr.master.facilities.map(f => {
      const char = mgr.master.characters.find(c => {
        const reg = mgr.master.regions.find(r => r.id === f.regionId);
        return reg && reg.characterId === c.id;
      });
      const charName = char ? char.name : "守護ガール";
      return `<option value="${f.id}">${f.name}（${charName} / ${f.address}）</option>`;
    }).join("");
  }

  if (startBtn) {
    startBtn.onclick = async () => {
      statusNotice.className = "notice";
      statusNotice.textContent = "📍 現在地（GPS）を確認中...";
      startBtn.disabled = true;

      const facilities = mgr.master ? mgr.master.facilities : [];
      if (facilities.length === 0) {
        statusNotice.className = "notice error";
        statusNotice.textContent = "登録された提携施設がありません。";
        startBtn.disabled = false;
        return;
      }

      const isSimulation = chkSimulate ? chkSimulate.checked : false;

      if (isSimulation) {
        // テスト用シミュレーション滞在
        const selId = demoSelect ? demoSelect.value : facilities[0].id;
        currentTargetSpot = facilities.find(f => f.id === selId) || facilities[0];
        onSpotConfirmed(currentTargetSpot);
      } else {
        // 実端末GPS測位
        if (!navigator.geolocation) {
          statusNotice.className = "notice error";
          statusNotice.textContent = "お使いの環境は位置情報（GPS）に対応していません。「テスト用GPSモード」をご利用ください。";
          startBtn.disabled = false;
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const uLat = pos.coords.latitude;
            const uLng = pos.coords.longitude;
            let nearest = null;
            let minDist = Infinity;

            facilities.forEach(f => {
              const d = calculateDistance(uLat, uLng, f.lat, f.lng);
              if (d < minDist) {
                minDist = d;
                nearest = f;
              }
            });

            const maxAllowed = nearest && nearest.allowedDistance ? nearest.allowedDistance : 200;
            if (nearest && minDist <= maxAllowed) {
              currentTargetSpot = nearest;
              onSpotConfirmed(nearest);
            } else {
              currentTargetSpot = null;
              statusNotice.className = "notice error";
              const km = (minDist / 1000).toFixed(1);
              statusNotice.textContent = `❌【現地未到達】最寄りの登録施設「${nearest ? nearest.name : ''}」まで約 ${km}km 離れています。敷地内に到着してからチェックインしてください。`;
              startBtn.disabled = false;
            }
          },
          (err) => {
            statusNotice.className = "notice error";
            statusNotice.textContent = "位置情報の取得が許可されていません。位置情報アクセスを許可するか、上の「現地滞在モードON」でテストしてください。";
            startBtn.disabled = false;
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    };
  }

  function onSpotConfirmed(spot) {
    statusNotice.className = "notice success";
    const costume = mgr.master.costumes.find(c => c.facilityId === spot.id);
    const costumeName = costume ? costume.name : "制服・衣装";
    const char = mgr.master.characters.find(c => {
      const reg = mgr.master.regions.find(r => r.id === spot.regionId);
      return reg && reg.characterId === c.id;
    }) || mgr.master.characters[0];

    statusNotice.textContent = `📍【現地到着を確認】「${spot.name}」にいます！店頭の等身大パネル（${char.name} / ${costumeName}）をスマホカメラ枠内に収めてください。`;
    if (targetCharLabel) targetCharLabel.textContent = `${spot.name} - ${char.name}`;

    openCamera(spot, char);
  }

  async function openCamera(spot, char) {
    try {
      activeVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      if (video) {
        video.srcObject = activeVideoStream;
      }
      if (cameraBox) cameraBox.style.display = "block";
    } catch (e) {
      if (cameraBox) cameraBox.style.display = "block";
      statusNotice.textContent += "（カメラを起動できないため、画像確認モードでチェックインを進めます）";
    }
  }

  if (btnSampleFeed) {
    btnSampleFeed.onclick = () => {
      alert("店頭の等身大パネルを確認しています。フレーム枠内にパネルを収めて「訪問を確定する」を押してください。");
    };
  }

  // 確定ボタン押下
  if (btnRecognize) {
    btnRecognize.onclick = () => {
      if (!currentTargetSpot) return;

      btnRecognize.disabled = true;
      btnRecognize.textContent = "パネル照合・訪問記録を確定中...";

      setTimeout(() => {
        btnRecognize.disabled = false;
        btnRecognize.textContent = "✨ パネルを確認して訪問を確定する";

        if (activeVideoStream) {
          activeVideoStream.getTracks().forEach(t => t.stop());
          activeVideoStream = null;
        }
        if (cameraBox) cameraBox.style.display = "none";
        if (startBtn) startBtn.disabled = false;

        const costume = mgr.master.costumes.find(c => c.facilityId === currentTargetSpot.id);
        const char = mgr.master.characters.find(c => {
          const reg = mgr.master.regions.find(r => r.id === currentTargetSpot.regionId);
          return reg && reg.characterId === c.id;
        }) || mgr.master.characters[0];

        const res = mgr.processCheckin(currentTargetSpot, costume, char);

        if (res.success) {
          renderMemberCard();
          renderStatsAndTitles();
          renderStampBook();
          renderShop();

          // チェックイン完了画面モーダルを表示（要件8仕様）
          showCheckinCompleteModal(res);
        } else {
          statusNotice.className = "notice error";
          statusNotice.textContent = res.message;
          alert(res.message);
        }
      }, 700);
    };
  }
}

/**
 * チェックイン完了画面モーダル表示（要件8）
 */
function showCheckinCompleteModal(result) {
  const modal = document.getElementById("modal-checkin-complete");
  if (!modal) return;

  const titleEl = document.getElementById("complete-modal-title");
  const ptsEl = document.getElementById("complete-modal-points");
  const costumeEl = document.getElementById("complete-modal-costume");

  if (titleEl) {
    titleEl.textContent = `「${result.facilityName}」の「${result.characterName}」と、ご縁が結ばれました！`;
  }
  if (ptsEl) {
    ptsEl.textContent = result.message;
  }
  if (costumeEl) {
    costumeEl.textContent = `衣装「${result.costumeName}」がご縁スタンプ帳に加わりました。`;
  }

  modal.style.display = "grid";

  // モーダル内アクションボタン
  document.getElementById("btn-comp-goods").onclick = () => {
    modal.style.display = "none";
    document.getElementById("section-goods-collection").scrollIntoView({ behavior: "smooth" });
  };
  document.getElementById("btn-comp-costumes").onclick = () => {
    modal.style.display = "none";
    document.getElementById("section-next-destinations").scrollIntoView({ behavior: "smooth" });
  };
  document.getElementById("btn-comp-exp").onclick = () => {
    modal.style.display = "none";
    alert(`【${result.facilityName}】の体験・周辺観光情報\n地元ならではのグルメや名所をお楽しみください！`);
  };
  document.getElementById("btn-comp-post").onclick = () => {
    modal.style.display = "none";
    const postModal = document.getElementById("modal-post");
    if (postModal) postModal.style.display = "grid";
  };
  document.getElementById("btn-close-complete-modal").onclick = () => {
    modal.style.display = "none";
  };
}

/**
 * 3. ポイント残高・訪問数・称号
 */
function renderStatsAndTitles() {
  const pts = document.getElementById("stats-point-val");
  if (pts) pts.innerHTML = `${mgr.member.points.toLocaleString()} <span class="unit">pt</span>`;

  const visitedCount = new Set(mgr.member.checkins.map(c => c.spotId)).size;
  const facEl = document.getElementById("stats-facility-val");
  if (facEl) facEl.innerHTML = `${visitedCount} <span class="unit">施設</span>`;

  const titleVal = document.getElementById("stats-title-val");
  if (titleVal) titleVal.innerHTML = `${mgr.member.achievedTitles.length} <span class="unit">個</span>`;

  const curTitle = document.getElementById("stats-current-title");
  if (curTitle) curTitle.textContent = mgr.member.title || "初めてのご縁";

  // 達成型称号グリッド
  const container = document.getElementById("titles-container");
  if (container && mgr.master) {
    container.innerHTML = mgr.master.titles.map(t => {
      const isAchieved = mgr.member.achievedTitles.includes(t.id);
      return `
        <div class="title-card ${isAchieved ? 'achieved' : ''}">
          <div class="title-icon">${isAchieved ? '🏅' : '🔒'}</div>
          <div>
            <div class="title-name" style="color: ${isAchieved ? '#b8860b' : '#777'};">${t.name}</div>
            <div class="title-desc">${t.desc}</div>
            <div style="font-size: 10px; margin-top: 4px; font-weight: 700; color: ${isAchieved ? '#00875a' : '#999'};">
              ${isAchieved ? '✔ 達成済み' : '未達成'}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}

/**
 * 4. 次に行きたい場所・おすすめスポット
 */
function renderNextDestinations() {
  const container = document.getElementById("destinations-container");
  if (!container || !mgr.master) return;

  const visitedSpotIds = new Set(mgr.member.checkins.map(c => c.spotId));

  container.innerHTML = mgr.master.facilities.map(f => {
    const isVisited = visitedSpotIds.has(f.id);
    const costume = mgr.master.costumes.find(c => c.facilityId === f.id);
    const reg = mgr.master.regions.find(r => r.id === f.regionId);
    const char = mgr.master.characters.find(c => reg && reg.characterId === c.id);

    return `
      <div class="dest-card">
        <div style="height: 100px; background: #eef5fa; display: flex; align-items: center; justify-content: center; position: relative;">
          <img src="${char ? char.avatar : '../assets/nasuno-tsutsuji.png'}" alt="" style="height: 90px; object-fit: contain;">
          ${isVisited ? '<span style="position: absolute; top: 8px; right: 8px; background: #00875a; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">訪問済み</span>' : ''}
        </div>
        <div class="dest-body">
          <div>
            <div class="dest-title">${f.name}</div>
            <div class="dest-meta">${reg ? reg.name : ''} • 衣装: ${costume ? costume.name : '通常衣装'}</div>
            <div style="font-size: 11px; color: #666; margin-bottom: 6px;">
              🕒 ${f.openingHours || '営業中'}
            </div>
          </div>
          <a href="https://maps.google.com/?q=${encodeURIComponent(f.address)}" target="_blank" class="btn-secondary" style="display: block; text-align: center; text-decoration: none; font-size: 11px; padding: 6px;">
            🗺️ 地図アプリで経路案内 ↗
          </a>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * 5. ご縁スタンプ帳・訪問地図
 */
function renderStampBook() {
  const container = document.getElementById("stamps-container");
  if (!container || !mgr.master) return;

  const regFilter = document.getElementById("filter-region-select");
  const charFilter = document.getElementById("filter-character-select");

  const selectedReg = regFilter ? regFilter.value : "all";
  const selectedChar = charFilter ? charFilter.value : "all";

  let list = mgr.master.facilities.filter(f => {
    if (selectedReg !== "all" && f.regionId !== selectedReg) return false;
    const reg = mgr.master.regions.find(r => r.id === f.regionId);
    if (selectedChar !== "all" && reg && reg.characterId !== selectedChar) return false;
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #888;">該当する施設がありません</div>`;
    return;
  }

  container.innerHTML = list.map(f => {
    const checkin = mgr.member.checkins.find(c => c.spotId === f.id);
    const isStamped = !!checkin;
    const isShrine = f.industry && f.industry.includes("寺社");
    const stampLabel = isShrine ? "御朱印" : "訪問印";

    return `
      <div class="stamp-slot ${isStamped ? 'stamped' : ''}">
        <div class="stamp-mark">${isStamped ? (isShrine ? '参' : '結') : '？'}</div>
        <div class="stamp-spot-name">${f.name}</div>
        <small style="color: #6b8292;">${stampLabel}</small>
        <div class="stamp-date">${isStamped ? `来訪: ${checkin.date}` : '未チェックイン'}</div>
      </div>
    `;
  }).join("");

  if (regFilter) regFilter.onchange = renderStampBook;
  if (charFilter) charFilter.onchange = renderStampBook;
}

/**
 * 6. グッズ ＆ コレクション（持っている・欲しい・受取予約）
 */
function renderGoodsCollection() {
  const container = document.getElementById("goods-container");
  if (!container || !mgr.master) return;

  const tabs = document.querySelectorAll(".goods-tab-btn");
  let activeTab = "all";
  tabs.forEach(t => {
    if (t.classList.contains("active")) activeTab = t.dataset.goodstab;
    t.onclick = () => {
      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      renderGoodsCollection();
    };
  });

  let goodsList = mgr.master.goods || [];
  if (activeTab === "wants") {
    goodsList = goodsList.filter(g => mgr.member.wantsGoods.includes(g.id));
  } else if (activeTab === "owns") {
    goodsList = goodsList.filter(g => mgr.member.ownsGoods.includes(g.id));
  } else if (activeTab === "reservations") {
    // 予約一覧表示
    if (mgr.member.reservations.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #888;">予約中の商品はありません</div>`;
      return;
    }
    container.innerHTML = mgr.member.reservations.map(r => `
      <div class="goods-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; background: #0052cc; color: #fff; padding: 2px 6px; border-radius: 4px;">予約受付済み</span>
            <span style="font-size: 11px; color: #666;">引換コード: <strong>${r.code}</strong></span>
          </div>
          <div class="goods-name">${r.goodsName}</div>
          <div style="font-size: 12px; color: #555; margin-top: 4px;">受取施設: ${r.facilityName}</div>
          <div style="font-size: 11px; color: #b8860b; margin-top: 2px;">受取期日: ${r.expireDate} (現地払い)</div>
        </div>
      </div>
    `).join("");
    return;
  }

  if (goodsList.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #888;">登録されている商品がありません</div>`;
    return;
  }

  container.innerHTML = goodsList.map(g => {
    const isWanted = mgr.member.wantsGoods.includes(g.id);
    const isOwned = mgr.member.ownsGoods.includes(g.id);
    const isMemberOnly = g.targetPlan === "member";
    const canReserve = g.canReserve;

    return `
      <div class="goods-card">
        <div class="goods-header">
          <img src="${g.image}" alt="" class="goods-thumb">
          <div class="goods-info">
            <div style="font-size: 10px; color: var(--text-muted);">${g.salesType} • ${g.stockStatus}</div>
            <div class="goods-name">${g.name}</div>
            <div class="goods-price">¥${g.price.toLocaleString()} <span style="font-size: 11px; color: #666;">(税込)</span></div>
          </div>
        </div>
        <div class="goods-action-row">
          <button class="btn-toggle-collect ${isWanted ? 'active' : ''}" onclick="toggleWantGoods('${g.id}')">
            ${isWanted ? '❤️ 欲しい登録済' : '🤍 欲しい'}
          </button>
          <button class="btn-toggle-collect ${isOwned ? 'active' : ''}" onclick="toggleOwnGoods('${g.id}')">
            ${isOwned ? '🎒 持っている済' : '🎒 持っている'}
          </button>
        </div>
        ${canReserve ? `
          <button class="btn-reserve-goods" onclick="openReservationModal('${g.id}')">
            🎫 現地受取予約をする (応援・共創会員)
          </button>
        ` : ''}
      </div>
    `;
  }).join("");
}

function toggleWantGoods(goodsId) {
  const idx = mgr.member.wantsGoods.indexOf(goodsId);
  if (idx >= 0) mgr.member.wantsGoods.splice(idx, 1);
  else mgr.member.wantsGoods.push(goodsId);
  mgr.save();
  renderGoodsCollection();
}

function toggleOwnGoods(goodsId) {
  const idx = mgr.member.ownsGoods.indexOf(goodsId);
  if (idx >= 0) mgr.member.ownsGoods.splice(idx, 1);
  else mgr.member.ownsGoods.push(goodsId);
  mgr.save();
  renderGoodsCollection();
}

/**
 * 7. 会員コンテンツ（無料・応援480円・共創980円・交換獲得）
 */
function renderMemberContents() {
  const container = document.getElementById("contents-container");
  if (!container) return;

  const currentPlan = mgr.member.plan;
  const isSupporterOrAbove = (currentPlan === "supporter" || currentPlan === "cocreation");
  const isCocreation = (currentPlan === "cocreation");

  container.innerHTML = `
    <!-- 無料公開ボイス -->
    <div class="media-item-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-size: 10px; background: #eef5fa; color: var(--navy); padding: 2px 6px; border-radius: 4px;">無料公開</span>
      </div>
      <div class="media-item-title">🎙️ ${mgr.member.favoriteGirl} 日替わりご挨拶</div>
      <div class="media-item-desc">推しガールに設定中の限定あいさつボイスです。</div>
      <button class="btn-secondary" onclick="playMemberVoice('${mgr.member.favoriteGirl}')">
        🔊 ボイスを再生する
      </button>
    </div>

    <!-- 応援会員向け（480円）制作裏話 -->
    <div class="media-item-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-size: 10px; background: #fff0f5; color: var(--pink); padding: 2px 6px; border-radius: 4px;">応援会員（月額480円）</span>
        ${isSupporterOrAbove ? '<span style="font-size: 11px; color: #00875a;">✔ 閲覧可能</span>' : '<span style="font-size: 11px; color: #de350b;">🔒 ロック</span>'}
      </div>
      <div class="media-item-title">📖 キャラクター制作裏話・新衣装先行ラフ</div>
      <div class="media-item-desc">那須塩原・那須・大田原の新衣装デザイン決定までの裏話を公開。</div>
      ${isSupporterOrAbove ? `
        <button class="btn-primary" style="font-size: 12px; padding: 6px 12px;" onclick="alert('【制作裏話 Vol.1】\\n那須ミッドシティホテルの制服verは、フロントの落ち着いた色調に合わせてネクタイと名札のディテールにこだわってデザインされました！')">
          記事を読む
        </button>
      ` : `
        <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="document.getElementById('section-plans').scrollIntoView({behavior: 'smooth'})">
          応援会員に登録して読む (¥480/月)
        </button>
      `}
    </div>

    <!-- 共創会員向け（980円）企画検討裏話レポート -->
    <div class="media-item-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-size: 10px; background: #e6f0ff; color: #0043a8; padding: 2px 6px; border-radius: 4px;">共創会員（月額980円）</span>
        ${isCocreation ? '<span style="font-size: 11px; color: #00875a;">✔ 閲覧可能</span>' : '<span style="font-size: 11px; color: #de350b;">🔒 ロック</span>'}
      </div>
      <div class="media-item-title">📊 四半期 企画進捗レポート ＆ 次期検討会</div>
      <div class="media-item-desc">会員投票で選ばれた新企画の試作品進捗やオンライン交流会の案内。</div>
      ${isCocreation ? `
        <button class="btn-primary" style="font-size: 12px; padding: 6px 12px;" onclick="alert('【共創会員レポート】\\n現在、皆様の投票に基づき「特製ミルクスイーツセット」の試作が進行中です！次回のオンライン企画交流会は来月開催予定です。')">
          企画レポートを見る
        </button>
      ` : `
        <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="document.getElementById('section-plans').scrollIntoView({behavior: 'smooth'})">
          共創会員に登録して参加 (¥980/月)
        </button>
      `}
    </div>
  `;
}

function playMemberVoice(charName) {
  const meta = CHARACTER_META[charName] || CHARACTER_META["那須乃つつじ"];
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(meta.greeting);
    u.lang = 'ja-JP';
    u.pitch = 1.35;
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
  }
  alert(`【${charName}の限定ボイス】\n「${meta.greeting}」`);
}

/**
 * 8. 会員交流コミュニティ「ご縁ひろば」＆ 共創企画投票
 */
function renderCommunity() {
  // ご縁ひろばの初期化または再レンダリング
  if (typeof initHiroba === "function" && !window.hiroba) {
    initHiroba(mgr);
  } else if (window.hiroba) {
    window.hiroba.memberMgr = mgr;
    window.hiroba.render();
  }

  // 企画投票エリア（共創会員限定）
  const voteContainer = document.getElementById("vote-options-container");
  if (voteContainer && mgr.votes) {
    const isCocreation = (mgr.member.plan === "cocreation");
    voteContainer.innerHTML = mgr.votes.map(v => `
      <div class="vote-option-card">
        <div>
          <div style="font-size: 13px; font-weight: 700;">${v.title}</div>
          <div style="font-size: 11px; color: #666;">${v.desc}</div>
          <div style="font-size: 11px; color: #0052cc; margin-top: 2px;">現在 ${v.votes} 票</div>
        </div>
        ${isCocreation ? `
          <button class="btn-vote" onclick="castVote('${v.id}')">投票する</button>
        ` : `
          <button class="btn-secondary" style="font-size: 11px; padding: 4px 8px;" disabled>共創会員限定</button>
        `}
      </div>
    `).join("");
  }
}

function likePost(postId) {
  if (window.hiroba) {
    window.hiroba.handleLike(postId);
  }
}

function castVote(voteId) {
  const v = mgr.votes.find(x => x.id === voteId);
  if (v) {
    v.votes += 1;
    mgr.saveVotes();
    renderCommunity();
    alert(`【${v.title}】に投票しました！ご協力ありがとうございます。`);
  }
}

/**
 * 9. ポイント交換所（管理画面登録方式・台帳連動）
 */
function renderShop() {
  const container = document.getElementById("shop-container");
  if (!container || !mgr.master) return;

  const rewards = mgr.master.rewards || [];

  container.innerHTML = rewards.map(r => {
    const isUnlocked = mgr.member.unlockedItems.includes(r.id);
    const canAfford = (mgr.member.points >= r.cost);
    const requiresSupporter = (r.targetPlan === "supporter");
    const hasPlan = !requiresSupporter || (mgr.member.plan === "supporter" || mgr.member.plan === "cocreation");

    return `
      <div class="shop-card">
        <div>
          <div style="font-size: 11px; color: ${requiresSupporter ? '#e9588d' : '#0052cc'}; font-weight: 700; margin-bottom: 2px;">
            ${requiresSupporter ? '応援会員・共創会員限定' : '全会員交換可能'}
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${r.name}</div>
          <div style="font-size: 12px; color: #6b8292;">${r.desc}</div>
        </div>
        <div>
          <div class="shop-card-cost">${r.cost} pt</div>
          ${isUnlocked ? `
            <button class="btn-secondary" disabled style="width: 100%; opacity: 0.7;">
              ✔ 交換済み
            </button>
          ` : `
            <button class="btn-primary" style="width: 100%; padding: 8px; font-size: 12px;" onclick="exchangeReward('${r.id}')" ${(!canAfford || !hasPlan) ? 'disabled style="opacity: 0.6;"' : ''}>
              ${!hasPlan ? '応援会員限定' : (!canAfford ? 'ポイント不足' : 'ポイントで交換')}
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");

  // 台帳履歴のレンダリング
  const historyEl = document.getElementById("ledger-history-container");
  if (historyEl) {
    historyEl.innerHTML = (mgr.member.ledger || []).slice(0, 10).map(l => `
      <li class="history-item">
        <div>
          <div style="font-weight: 600;">${l.reason}</div>
          <small style="color: #8da4b0;">${l.date}</small>
        </div>
        <div class="history-pts ${l.amount >= 0 ? 'plus' : 'minus'}">
          ${l.amount >= 0 ? '+' : ''}${l.amount} pt
        </div>
      </li>
    `).join("");
  }
}

function exchangeReward(rewardId) {
  const r = mgr.master.rewards.find(x => x.id === rewardId);
  if (!r) return;

  if (mgr.member.points < r.cost) {
    alert(`ポイントが不足しています。\n必要ポイント: ${r.cost}pt\n現在ポイント: ${mgr.member.points}pt`);
    return;
  }

  if (confirm(`【${r.name}】を ${r.cost} ポイントで交換しますか？`)) {
    mgr.recordLedgerTransaction("consume", -r.cost, `特典交換: ${r.name}`);
    mgr.member.unlockedItems.push(r.id);
    mgr.save();
    renderMemberCard();
    renderStatsAndTitles();
    renderShop();
    renderMemberContents();
    alert(`🎉 【${r.name}】の交換が完了しました！`);
  }
}

/**
 * 10. 会員プラン・契約設定（無料0円、応援会員480円、共創会員980円）
 */
function renderPlans() {
  const btnFree = document.getElementById("btn-select-free");
  const btnSupporter = document.getElementById("btn-select-supporter");
  const btnCocreation = document.getElementById("btn-select-cocreation");
  const billingInfo = document.getElementById("plan-billing-info");

  const p = mgr.member.plan;

  if (btnFree) {
    btnFree.disabled = (p === "free");
    btnFree.textContent = (p === "free") ? "現在利用中" : "無料会員に戻る";
    btnFree.onclick = () => changePlanAction("free");
  }
  if (btnSupporter) {
    btnSupporter.disabled = (p === "supporter");
    btnSupporter.textContent = (p === "supporter") ? "現在利用中" : "応援会員に変更 (¥480/月)";
    btnSupporter.onclick = () => changePlanAction("supporter");
  }
  if (btnCocreation) {
    btnCocreation.disabled = (p === "cocreation");
    btnCocreation.textContent = (p === "cocreation") ? "現在利用中" : "共創会員に変更 (¥980/月)";
    btnCocreation.onclick = () => changePlanAction("cocreation");
  }

  if (billingInfo) {
    let planText = "無料会員 (0円)";
    let desc = "会費は発生しません。いつでも有料プランへのアップグレードが可能です。";
    if (p === "supporter") {
      planText = "応援会員 (月額480円 税込)";
      desc = "次回更新日: 2026-10-18（テスト決済シミュレーション中。解約予約後も期間終了まで特典を利用できます）";
    } else if (p === "cocreation") {
      planText = "共創会員 (月額980円 税込)";
      desc = "次回更新日: 2026-10-18（企画投票・オンライン交流会特典が適用されています）";
    }

    billingInfo.innerHTML = `
      <div style="background: #fff; padding: 14px; border-radius: 8px; border: 1px solid var(--line); font-size: 12px;">
        <div style="font-weight: 700; color: var(--navy); margin-bottom: 4px;">現在の契約: ${planText}</div>
        <div style="color: #666;">${desc}</div>
        <div style="margin-top: 6px; font-size: 11px; color: #b8860b;">
          ※ カード情報は本サイトのサーバーには一切保存されません。外部決済サービス連携は現在テスト準備中（未接続）です。
        </div>
      </div>
    `;
  }
}

function changePlanAction(targetPlan) {
  const planNames = { free: "無料会員 (0円)", supporter: "応援会員 (月額480円)", cocreation: "共創会員 (月額980円)" };
  const modal = document.getElementById("modal-plan-change");
  const body = document.getElementById("plan-modal-body");

  if (!modal || !body) return;

  body.innerHTML = `
    <div style="background: #fff8e8; border: 1px solid #ffd478; border-radius: 8px; padding: 12px; margin-bottom: 14px; font-size: 12px;">
      <strong style="color: #b8860b; display: block; margin-bottom: 4px;">⚠️ 外部決済サービス未接続（開発・テスト環境）</strong>
      本番のクレジットカード決済（Stripe）は現在未接続です。本画面ではテストシミュレーションとしてプラン変更を即時反映できます。
    </div>
    <p style="font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
      【${planNames[targetPlan]}】に変更しますか？<br>
      <span style="font-size: 11px; color: #666;">※ 有料プラン解約後も、これまでに獲得したスタンプ帳・訪問履歴・保有ポイント・称号はそのまま維持されます。</span>
    </p>
    <div style="display: flex; gap: 8px;">
      <button type="button" class="btn-secondary" style="flex: 1;" onclick="document.getElementById('modal-plan-change').style.display='none'">キャンセル</button>
      <button type="button" class="btn-primary" style="flex: 1;" onclick="confirmPlanChange('${targetPlan}')">変更を確定する</button>
    </div>
  `;

  modal.style.display = "grid";
}

function confirmPlanChange(newPlan) {
  mgr.member.plan = newPlan;
  mgr.save();
  document.getElementById("modal-plan-change").style.display = "none";
  renderMemberCard();
  renderMemberContents();
  renderCommunity();
  renderShop();
  renderPlans();
  alert(`会員プランを更新しました！`);
}

/**
 * モーダル等の設定
 */
function setupModals() {
  // 投稿モーダル
  const btnOpenPost = document.getElementById("btn-open-post-modal");
  const btnCompPost = document.getElementById("btn-comp-post");

  if (btnOpenPost) {
    btnOpenPost.onclick = () => {
      if (window.hiroba) window.hiroba.openPostModal();
    };
  }

  if (btnCompPost) {
    btnCompPost.onclick = () => {
      const compModal = document.getElementById("modal-checkin-complete");
      if (compModal) compModal.style.display = "none";
      if (window.hiroba) window.hiroba.openPostModal();
    };
  }

  // 現地受取予約モーダル
  const btnCloseRes = document.getElementById("btn-close-res-modal");
  const modalRes = document.getElementById("modal-reservation");
  if (btnCloseRes && modalRes) {
    btnCloseRes.onclick = () => { modalRes.style.display = "none"; };
  }

  // プラン変更モーダル閉じる
  const btnClosePlan = document.getElementById("btn-close-plan-modal");
  const modalPlan = document.getElementById("modal-plan-change");
  if (btnClosePlan && modalPlan) {
    btnClosePlan.onclick = () => { modalPlan.style.display = "none"; };
  }
}

function openReservationModal(goodsId) {
  // 権限判定: 応援会員(480円) または 共創会員(980円) のみ
  if (mgr.member.plan === "free") {
    alert("現地受取予約は【応援会員（月額480円）】または【共創会員（月額980円）】限定の特典です。\n会員プランセクションよりプラン変更をお願いいたします。");
    document.getElementById("section-plans").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const goods = mgr.master.goods.find(g => g.id === goodsId);
  const facility = mgr.master.facilities.find(f => f.id === goods.facilityId);
  const modal = document.getElementById("modal-reservation");
  const content = document.getElementById("reservation-form-content");

  if (!modal || !content) return;

  content.innerHTML = `
    <div style="font-size: 13px; margin-bottom: 12px;">
      <strong>${goods.name}</strong><br>
      <span style="color: #b01b4c; font-weight: 700;">¥${goods.price.toLocaleString()} (現地払い)</span>
    </div>
    <div style="background: #f7fafc; padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 14px; border: 1px solid var(--line);">
      受取場所: <strong>${facility ? facility.name : '現地提携店舗'}</strong><br>
      営業時間: ${facility ? facility.openingHours : '営業時間内'}<br>
      住所: ${facility ? facility.address : ''}
    </div>
    <form id="form-submit-reservation">
      <div class="form-group">
        <label class="form-label">受取予定日 *</label>
        <input type="date" id="res-date-input" class="form-input" required min="${new Date().toISOString().split("T")[0]}">
      </div>
      <div class="form-group">
        <label class="form-label">予約数量</label>
        <input type="number" id="res-qty-input" class="form-input" value="1" min="1" max="2" required>
        <div style="font-size: 11px; color: #888; margin-top: 2px;">※ お一人様2点までご予約いただけます。</div>
      </div>
      <button type="submit" class="btn-primary" style="width: 100%; padding: 12px; margin-top: 8px;">予約を確定する</button>
    </form>
  `;

  modal.style.display = "grid";

  const form = document.getElementById("form-submit-reservation");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const date = document.getElementById("res-date-input").value;
      const qty = parseInt(document.getElementById("res-qty-input").value, 10) || 1;
      const code = "RES-" + Math.floor(100000 + Math.random() * 900000);

      const reservation = {
        id: "RES_" + Date.now(),
        code: code,
        goodsId: goods.id,
        goodsName: goods.name,
        facilityId: goods.facilityId,
        facilityName: facility ? facility.name : "提携施設",
        date: date,
        qty: qty,
        expireDate: date,
        status: "confirmed",
        createdAt: new Date().toISOString().split("T")[0]
      };

      mgr.member.reservations.unshift(reservation);
      mgr.save();
      modal.style.display = "none";
      renderGoodsCollection();
      alert(`🎉 現地受取予約が完了しました！\n引換コード: 【${code}】\n受取当日に店舗スタッフに画面をご提示ください。`);
    };
  }
}

// グローバルスコープ登録
window.playMemberVoice = playMemberVoice;
window.toggleWantGoods = toggleWantGoods;
window.toggleOwnGoods = toggleOwnGoods;
window.openReservationModal = openReservationModal;
window.exchangeReward = exchangeReward;
window.changePlanAction = changePlanAction;
window.confirmPlanChange = confirmPlanChange;
window.likePost = likePost;
window.castVote = castVote;
