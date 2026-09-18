/**
 * ご縁ガール 会員ダッシュボード (member.js) - 日英バイリンガル（多言語・インバウンド）対応版
 * 全国展開対応、会員プラン制（無料/480円/980円）、ポイント台帳、達成型称号、
 * 重複防止チェックイン、グッズコレクション・受取予約、コミュニティ交流
 */

// 言語判定と管理 (ja / en)
let memberCurrentLang = "ja";

function detectMemberLanguage() {
  const saved = localStorage.getItem("goen_lang");
  if (saved === "ja" || saved === "en") return saved;
  const browserLang = (navigator.languages && navigator.languages.length > 0)
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage || "");
  return browserLang.toLowerCase().startsWith("ja") ? "ja" : "en";
}

// 日英辞書
const MEMBER_I18N = {
  ja: {
    // Header & Brand
    planFreeBadge: "無料会員",
    planSupporterBadge: "応援会員",
    planCocreateBadge: "共創会員",
    logoutBtn: "ログアウト",
    portalLink: "← 公式情報ポータルへ戻る",
    lpLink: "企業・店舗様向けご案内",

    // Pass Card
    passTitleFirst: "初めてのご縁",
    passPlanFree: "無料会員（0円）",
    passPlanSupporter: "応援会員（月額480円）",
    passPlanCocreate: "共創会員（月額980円）",
    passPilgrimSuffix: " 様",
    passOshiPrefix: "推し: ",
    passSpotsLabel: "巡礼施設",
    passSpotsUnit: "施設",
    passRegionsLabel: "訪問地域",
    passRegionsUnit: "地域",
    passHoldingPoints: "保有ご縁ポイント",
    passChangePlanBtn: "プラン変更 ✦",
    passChangeOshiBtn: "推し変更 🔄",

    // Oshi News
    oshiNewsHead: " の近況と旅のお便り",
    oshiLatestTag: "最新情報",
    oshiDefaultNews: "高野山真言宗 高福寺の新緑が美しい季節です。店頭の等身大パネルで皆様をお待ちしております！",

    // Checkin Section
    checkinTitle: "現地チェックイン",
    checkinDesc: "提携施設に到着したらGPSとカメラで等身大パネルを読み取ろう！<br><span style='color: #b8860b; font-size: 11px;'>※ QRコードは不要です。等身大パネルにスマホカメラを向けます。</span>",
    checkinBtn: "📷 現在地を確認してパネルを読み取る",
    checkinTestModeTitle: "【テスト・検証用GPSモード】",
    checkinTestStayOn: "現地滞在モードON",
    checkinTestDesc: "※ チェックON時は選択スポットに滞在しているものとして判定します。OFFにすると実際の端末GPSで半径判定します。",
    checkinStatusInit: "GPS現在地とカメラでの等身大パネル照合で、現地の訪問を記録します。",
    checkinStatusChecking: "📍 現在地（GPS）を確認中...",
    checkinStatusNoFacilities: "登録された提携施設がありません。",
    checkinStatusNoGps: "お使いの環境は位置情報（GPS）に対応していません。「テスト用GPSモード」をご利用ください。",
    checkinStatusDenied: "位置情報の取得が許可されていません。位置情報アクセスを許可するか、上の「現地滞在モードON」でテストしてください。",
    cameraFrameGuide: "枠内に等身大パネルを合わせてください",
    cameraTargetLabel: "🎯 照合対象: ",
    cameraSampleFeedBtn: "🖼️ パネル画像を表示",
    cameraConfirmBtn: "✨ パネルを確認して訪問を確定する",
    cameraConfirming: "パネル照合・訪問記録を確定中...",

    // Stats & Titles
    statsHead: "🏆 旅の実績と称号",
    statsPointsLabel: "保有ポイント",
    statsPointsSub: "交換で利用可能",
    statsFacilitiesLabel: "訪問施設数",
    statsFacilitiesSub: "目指せ10施設！",
    statsTitlesLabel: "獲得称号数",
    statsTitlesListHead: "🎖️ 達成型称号一覧（行動実績で獲得）",
    titleAchieved: "✔ 達成済み",
    titleUnachieved: "未達成",

    // Destinations
    destHead: "🧭 次に行きたい場所・おすすめスポット",
    destSub: "営業時間・取扱商品を確認できます",
    destVisited: "訪問済み",
    destMapLink: "🗺️ 地図アプリで経路案内 ↗",

    // Stamp Book
    stampHead: "🎴 ご縁スタンプ帳（訪問スタンプ）",
    stampSub: "「まずは気になる３か所で、ご縁を結ぼう」",
    stampFilterAllReg: "全国（全地域）",
    stampFilterAllChar: "全キャラクター",
    stampMarkShrine: "参",
    stampMarkSpot: "結",
    stampUnvisited: "未チェックイン",
    stampVisitedDate: "来訪: ",

    // Goods Collection
    goodsHead: "🛍️ 公式グッズ ＆ マイコレクション",
    goodsSub: "「持っている」「欲しい」を登録してコレクションを管理！",
    goodsTabAll: "すべて",
    goodsTabWants: "欲しいリスト ❤️",
    goodsTabOwns: "持っている 🎒",
    goodsTabRes: "現地受取予約 🎫",
    goodsStockIn: "好評販売中",
    goodsStockLow: "残りわずか",
    goodsReserveBtn: "🎫 現地受取予約",
    goodsReserveMemberOnly: "※ 応援会員限定",
    goodsBtnWant: "欲しい ❤️",
    goodsBtnOwn: "持ってる 🎒",

    // Contents
    contentsHead: "🎙️ 会員限定コンテンツ・推し便り",
    contentsTabAll: "すべて",
    contentsTabVoice: "限定ボイス",
    contentsTabWallpaper: "特製壁紙",
    contentsTabNews: "制作裏話",
    contentsPlayVoice: "🔊 ボイス再生",
    contentsDownload: "📥 壁紙ダウンロード",
    contentsRead: "📖 記事を読む",

    // Hiroba
    hirobaHead: "🌸 会員交流コミュニティ「ご縁ひろば」",
    hirobaSub: "旅の思い出、推しの魅力、グッズの楽しみ方を全国の仲間と共有しよう！",
    hirobaGuideBtn: "📖 使い方ガイド",
    hirobaPostBtn: "✍️ 旅の思い出を投稿",
    hirobaBannerTitle: "みんなの投稿を見て「ここに行ってみたい！」「この衣装に会いたい！」を見つけよう！",
    hirobaBannerDesc: "栃木県3市をはじめ、全国の聖地巡礼や推し活の記録が集まる場所です。<br><span style='font-size: 11px; opacity: 0.85;'>※ 健全で温かい交流のため、投稿や交流によるポイント付与は設けておりません。</span>",
    hirobaCatAll: "すべて",
    hirobaCatTrip: "🗺️ 旅の思い出",
    hirobaCatOshi: "🌸 推しガール自慢",
    hirobaCatGoods: "🛍️ グッズ写真",
    hirobaCatReport: "🧭 聖地巡礼レポ",
    hirobaCatOfficial: "📢 運営便り",
    hirobaFilterCharAll: "全キャラクター",
    hirobaFilterRegAll: "全地域",
    hirobaSavedBtn: "🔖 保存した投稿を見る",
    hirobaVoteTitle: "🗳️ 【共創会員限定】新企画アイデア投票",
    hirobaVoteDesc: "運営が選定した実施可能な次期企画候補です。共創会員の皆様の投票で優先度が決まります。",

    // Rewards Shop & Ledger
    shopHead: "🎁 ご縁ポイント交換所",
    shopSub: "巡礼で貯まったポイントを使って、限定ボイスや特製壁紙、現地特典をアンロック！",
    shopLedgerHead: "📜 ポイント台帳・増減履歴",
    shopUnlockBtn: "ptで解放",
    shopUnlockedBadge: "解放済み ✔",

    // Plans
    plansHead: "💎 会員プラン・契約設定",
    planFreeTitle: "無料会員",
    planFreePrice: "0円",
    planFreeBtnActive: "利用中",
    planSupporterTitle: "応援会員",
    planSupporterPrice: "月額 480円 (税込)",
    planSupporterBtn: "応援会員に変更 (¥480/月)",
    planCocreateTitle: "共創会員",
    planCocreatePrice: "月額 980円 (税込)",
    planCocreateBtn: "共創会員に変更 (¥980/月)",

    // Bottom Nav
    navHome: "ホーム",
    navExplore: "探す",
    navCheckin: "チェックイン",
    navCollection: "コレクション",
    navCommunity: "ご縁ひろば",

    // Complete Modal
    compConnectedWith: "と、ご縁が結ばれました！",
    compCostumeAdded: "衣装がスタンプ帳に加わりました。",
    compBtnGoods: "この店舗のグッズを見る",
    compBtnCostumes: "近くで会える別衣装を見る",
    compBtnExp: "この場所の体験を見る",
    compBtnPost: "旅の写真を残す",
    compBtnClose: "閉じる"
  },
  en: {
    // Header & Brand
    planFreeBadge: "Free Member",
    planSupporterBadge: "Supporter",
    planCocreateBadge: "Co-Creation",
    logoutBtn: "Log Out",
    portalLink: "← Back to Official Portal",
    lpLink: "For Businesses & Spots (LP)",

    // Pass Card
    passTitleFirst: "First Connection",
    passPlanFree: "Free Member ($0 / ¥0)",
    passPlanSupporter: "Supporter Plan (¥480/mo)",
    passPlanCocreate: "Co-Creation Plan (¥980/mo)",
    passPilgrimSuffix: "",
    passOshiPrefix: "Oshi: ",
    passSpotsLabel: "Spots Visited",
    passSpotsUnit: "spots",
    passRegionsLabel: "Regions Visited",
    passRegionsUnit: "regions",
    passHoldingPoints: "Goen Points Balance",
    passChangePlanBtn: "Change Plan ✦",
    passChangeOshiBtn: "Switch Oshi 🔄",

    // Oshi News
    oshiNewsHead: "'s Greetings & Travel Notes",
    oshiLatestTag: "Latest News",
    oshiDefaultNews: "Spring greenery is blooming at Kofukuji Temple. Looking forward to welcoming you at our life-sized standee!",

    // Checkin Section
    checkinTitle: "On-Site Spot Check-In",
    checkinDesc: "Arrived at the spot? Check in via GPS and scan the life-sized standee with your camera!<br><span style='color: #b8860b; font-size: 11px;'>* No QR code required. Just frame the life-sized standee in your camera.</span>",
    checkinBtn: "📷 Check Location & Scan Standee",
    checkinTestModeTitle: "[Test / Simulation GPS Mode]",
    checkinTestStayOn: "Simulate On-Site GPS Mode",
    checkinTestDesc: "* When ON, you are simulated as standing at the selected spot. When OFF, your device's actual GPS is used.",
    checkinStatusInit: "Record your visit with GPS geolocation and camera verification of the life-sized standee.",
    checkinStatusChecking: "📍 Checking current GPS location...",
    checkinStatusNoFacilities: "No partner facilities found.",
    checkinStatusNoGps: "Your environment does not support geolocation. Please use 'Test GPS Mode'.",
    checkinStatusDenied: "Location access denied. Please allow geolocation or turn on 'Simulate On-Site GPS Mode' above.",
    cameraFrameGuide: "Align the life-sized standee inside the frame",
    cameraTargetLabel: "🎯 Target: ",
    cameraSampleFeedBtn: "🖼️ View Standee Image",
    cameraConfirmBtn: "✨ Confirm Visit & Claim Points",
    cameraConfirming: "Verifying standee & confirming visit...",

    // Stats & Titles
    statsHead: "🏆 Travel Achievements & Titles",
    statsPointsLabel: "Points Balance",
    statsPointsSub: "Available for rewards",
    statsFacilitiesLabel: "Spots Visited",
    statsFacilitiesSub: "Goal: 10 spots!",
    statsTitlesLabel: "Titles Unlocked",
    statsTitlesListHead: "🎖️ Achievement Titles (Unlocked by Visits)",
    titleAchieved: "✔ Achieved",
    titleUnachieved: "Locked",

    // Destinations
    destHead: "🧭 Recommended Next Destinations",
    destSub: "Check business hours, standees & available merchandise",
    destVisited: "Visited",
    destMapLink: "🗺️ Open in Maps & Directions ↗",

    // Stamp Book
    stampHead: "🎴 Goen Pilgrimage Stamp Book",
    stampSub: "'Visit your first 3 sacred spots to connect with Japan'",
    stampFilterAllReg: "All Regions (Japan)",
    stampFilterAllChar: "All Characters",
    stampMarkShrine: "Seal",
    stampMarkSpot: "Stamp",
    stampUnvisited: "Unvisited",
    stampVisitedDate: "Visited: ",

    // Goods Collection
    goodsHead: "🛍️ Official Goods & My Collection",
    goodsSub: "Manage your collection with 'Wishlist' and 'Owned' items!",
    goodsTabAll: "All",
    goodsTabWants: "Wishlist ❤️",
    goodsTabOwns: "Owned 🎒",
    goodsTabRes: "Pickup Reservations 🎫",
    goodsStockIn: "In Stock",
    goodsStockLow: "Low Stock",
    goodsReserveBtn: "🎫 Reserve for Pickup",
    goodsReserveMemberOnly: "* Supporters Only",
    goodsBtnWant: "Want ❤️",
    goodsBtnOwn: "Own 🎒",

    // Contents
    contentsHead: "🎙️ Member Exclusive Voices & Media",
    contentsTabAll: "All",
    contentsTabVoice: "Voices",
    contentsTabWallpaper: "Wallpapers",
    contentsTabNews: "Stories",
    contentsPlayVoice: "🔊 Play Voice",
    contentsDownload: "📥 Download Wallpaper",
    contentsRead: "📖 Read Story",

    // Hiroba
    hirobaHead: "🌸 Goen Square (Travelers' Community)",
    hirobaSub: "Share your travel memories, favorite characters, and regional goods nationwide!",
    hirobaGuideBtn: "📖 Community Guide",
    hirobaPostBtn: "✍️ Post Pilgrimage Story",
    hirobaBannerTitle: "Explore posts to find places you want to visit and costumes you want to see!",
    hirobaBannerDesc: "A warm hub connecting travelers across Tochigi (Nasushiobara, Nasu, Otawara) and Japan.<br><span style='font-size: 11px; opacity: 0.85;'>* To ensure healthy and pure fan interactions, points are not awarded for posting.</span>",
    hirobaCatAll: "All",
    hirobaCatTrip: "🗺️ Travel Stories",
    hirobaCatOshi: "🌸 Oshi Moments",
    hirobaCatGoods: "🛍️ Merchandise",
    hirobaCatReport: "🧭 Pilgrimage Reports",
    hirobaCatOfficial: "📢 Official News",
    hirobaFilterCharAll: "All Characters",
    hirobaFilterRegAll: "All Regions",
    hirobaSavedBtn: "🔖 Saved Posts",
    hirobaVoteTitle: "🗳️ [Co-Creation Only] New Project Voting",
    hirobaVoteDesc: "Candidate projects curated by the team. Votes from Co-Creation members determine priorities.",

    // Rewards Shop & Ledger
    shopHead: "🎁 Goen Points Rewards Shop",
    shopSub: "Redeem points earned from pilgrimages for exclusive voices, wallpapers, and on-site perks!",
    shopLedgerHead: "📜 Points Ledger & Balance History",
    shopUnlockBtn: "pt to Unlock",
    shopUnlockedBadge: "Unlocked ✔",

    // Plans
    plansHead: "💎 Membership Plans & Settings",
    planFreeTitle: "Free Member",
    planFreePrice: "¥0 / Free",
    planFreeBtnActive: "Active Plan",
    planSupporterTitle: "Supporter Plan",
    planSupporterPrice: "¥480 / month (tax incl.)",
    planSupporterBtn: "Switch to Supporter (¥480/mo)",
    planCocreateTitle: "Co-Creation Plan",
    planCocreatePrice: "¥980 / month (tax incl.)",
    planCocreateBtn: "Switch to Co-Creation (¥980/mo)",

    // Bottom Nav
    navHome: "Home",
    navExplore: "Explore",
    navCheckin: "Check-in",
    navCollection: "Stamps",
    navCommunity: "Square",

    // Complete Modal
    compConnectedWith: "You have created a special connection with",
    compCostumeAdded: "costume has been stamped in your Goen Book!",
    compBtnGoods: "View Spot's Goods",
    compBtnCostumes: "Find Nearby Standees",
    compBtnExp: "View Spot Experiences",
    compBtnPost: "Share Photos in Square",
    compBtnClose: "Close"
  }
};

// 英語表記マップ（キャラクター名・地域名・称号名・施設名）
const EN_MAP = {
  characters: {
    "那須乃つつじ": "Tsutsuji Nasuno",
    "狩野くるみ": "Kurumi Karino",
    "大俵ちか": "Chika Otawara"
  },
  regions: {
    "REG_NASUSHIOBARA": "Nasushiobara City, Tochigi",
    "REG_NASUMACHI": "Nasu Town, Tochigi",
    "REG_OTAWARA": "Otawara City, Tochigi",
    "那須塩原市": "Nasushiobara City",
    "那須町": "Nasu Town",
    "大田原市": "Otawara City"
  },
  titles: {
    "初めてのご縁": "First Connection",
    "地域のご縁": "Regional Connection",
    "旅するご縁": "Journey Connection",
    "ご縁結びマスター": "Goen Master"
  },
  facilities: {
    "那須ミッドシティホテル": "Nasu Mid-City Hotel",
    "高野山真言宗 高福寺": "Kofukuji Temple",
    "光丸山法輪寺": "Mitsumaruyama Horinji Temple"
  }
};

// デフォルト会員データ
const DEFAULT_MEMBER = {
  isLoggedIn: true,
  memberId: "GG-FAN-884920",
  nickname: "ご縁巡礼者",
  nicknameEn: "Goen Pilgrim",
  joinedDate: new Date().toISOString().split("T")[0],
  plan: "free",
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

// キャラクターメタ情報（日英メッセージ対応）
const CHARACTER_META = {
  "那須乃つつじ": {
    themeClass: "theme-tsutsuji",
    avatar: "../assets/nasuno-tsutsuji.png",
    color: "#e9588d",
    greeting: "ご縁に感謝いたしますわ。今日も素敵な一日になりますように。",
    greetingEn: "Thank you for creating this wonderful connection! May your day be filled with peace and joyful memories."
  },
  "狩野くるみ": {
    themeClass: "theme-milk",
    avatar: "../assets/karino-milk.png",
    color: "#1199c4",
    greeting: "お疲れさま！今日も元気いっぱい笑顔で巡礼いってみよー！",
    greetingEn: "Great job! Let's embark on today's pilgrimage with high energy and big smiles!"
  },
  "大俵ちか": {
    themeClass: "theme-chika",
    avatar: "../assets/otawara-chika.png",
    color: "#c84127",
    greeting: "一矢必中！ご縁の矢を放って、最高の出会いをつかみ取りましょう！",
    greetingEn: "One shot, one bullseye! Let's unleash the arrow of fate and seize magnificent encounters!"
  }
};

// 企画投票の選択肢
const VOTE_CANDIDATES = [
  { id: "VOTE_01", title: "栃木3市連携 湯巡り御朱印スタンプラリー", titleEn: "3-City Onsen Sacred Shrine Stamp Rally", votes: 42, desc: "那須塩原・那須・大田原の温泉施設とコラボした特製スタンプ帳企画", descEn: "Special collectible pilgrimage stamp book across Shiobara, Nasu, and Otawara hot springs." },
  { id: "VOTE_02", title: "狩野くるみ 那須ミッドシティホテルコラボ 宿泊体験プラン", titleEn: "Kurumi Karino Hotel Mid-City Special Stay Plan", votes: 68, desc: "那須塩原の生乳を使用した特製チーズケーキ＆缶バッジセット", descEn: "Exclusive package with fresh local farm cheesecake & limited collectible badge." },
  { id: "VOTE_03", title: "那須乃つつじ＆大俵ちか 合同秋祭りミニ色紙", titleEn: "Tsutsuji & Chika Joint Autumn Festival Shikishi", votes: 35, desc: "高野山真言宗 高福寺例大祭・与一まつり記念の合同記念品", descEn: "Joint artwork commemorating Kofukuji Grand Festival & Samurai Yoichi Matsuri." }
];

// コミュニティ初期投稿データ
const INITIAL_POSTS = [
  {
    id: "P001",
    userName: "とちぎ巡礼団",
    userNameEn: "Tochigi Pilgrim",
    userPlan: "共創会員",
    character: "狩野くるみ",
    spotName: "那須ミッドシティホテル",
    region: "那須塩原市",
    text: "那須ミッドシティホテルのロビーでくるみちゃんの等身大パネルに会えました！フロントの方も親切で最高でした。",
    textEn: "Met Kurumi's life-sized standee right at the Nasu Mid-City Hotel lobby! The front desk staff was super helpful and welcoming.",
    likes: 12,
    date: "2026-09-17"
  },
  {
    id: "P002",
    userName: "つつじ推し",
    userNameEn: "Tsutsuji Fan",
    userPlan: "応援会員",
    character: "那須乃つつじ",
    spotName: "高野山真言宗 高福寺",
    region: "那須町",
    text: "高野山真言宗 高福寺でつつじちゃんの巫女装束を拝見！境内を散策しながら限定の御朱印も受けることができました。",
    textEn: "Saw Tsutsuji in her sacred shrine maiden attire at Kofukuji Temple! Received the exclusive temple stamp while admiring the serene grounds.",
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

  recordLedgerTransaction(type, amount, reason, facilityId = null) {
    const today = new Date().toISOString().split("T")[0];
    const item = {
      id: "LEDGER_" + Date.now(),
      type: type,
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

  processCheckin(facility, costume, character) {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = getJSTMonthKey();
    const isEn = memberCurrentLang === "en";

    const facilityCheckins = this.member.checkins.filter(c => c.spotId === facility.id);
    const isFirstVisit = (facilityCheckins.length === 0);

    const todayCheckin = facilityCheckins.find(c => c.date === today);
    if (todayCheckin) {
      const facName = isEn ? (EN_MAP.facilities[facility.name] || facility.name) : facility.name;
      return {
        success: false,
        isDuplicateToday: true,
        message: isEn
          ? `You have already checked in at ${facName} today.`
          : `本日、${facility.name}には既にチェックイン済みです（同日の重複申請は無効です）。`
      };
    }

    let earnedPoints = 0;
    let pointReasons = [];
    let isRevisitPointsAwarded = false;

    if (isFirstVisit) {
      earnedPoints += 100;
      pointReasons.push(isEn ? `First Visit 100pt` : `初訪問100pt`);
    } else {
      const firstCheckin = facilityCheckins[facilityCheckins.length - 1];
      const firstVisitMonth = firstCheckin.date ? firstCheckin.date.substring(0, 7) : "";
      const hasRevisitThisMonth = facilityCheckins.some(c => c.date && c.date.substring(0, 7) === currentMonth && !c.isFirstVisit);

      if (firstVisitMonth === currentMonth) {
        earnedPoints += 0;
        pointReasons.push(isEn ? `Visited (Bonus earned this month)` : `訪問記録（当月は初訪問済）`);
      } else if (hasRevisitThisMonth) {
        earnedPoints += 0;
        pointReasons.push(isEn ? `Visited (Monthly revisit bonus already awarded)` : `訪問記録（当月再訪pt獲得済）`);
      } else {
        earnedPoints += 30;
        isRevisitPointsAwarded = true;
        pointReasons.push(isEn ? `Monthly Revisit 30pt` : `月次再訪30pt`);
      }
    }

    const checkinRecord = {
      spotId: facility.id,
      spotName: facility.name,
      character: character.name,
      costumeName: costume ? costume.name : "通常衣装",
      regionId: facility.regionId,
      date: today,
      isFirstVisit: isFirstVisit,
      isRevisitPointsAwarded: isRevisitPointsAwarded
    };
    this.member.checkins.unshift(checkinRecord);

    let bonusPoints = 0;
    const sameRegionSpots = (this.master ? this.master.facilities : []).filter(f => f.regionId === facility.regionId);
    const visitedSameRegionSpots = new Set(
      this.member.checkins.filter(c => c.regionId === facility.regionId).map(c => c.spotId)
    );

    if (sameRegionSpots.length >= 3 && visitedSameRegionSpots.size >= 3) {
      const bonusKey = `同一地域3施設制覇ボーナス(${facility.regionId})`;
      if (!this.member.ledger.some(l => l.reason.includes(bonusKey))) {
        bonusPoints += 100;
        this.recordLedgerTransaction("grant", 100, bonusKey, facility.id);
        pointReasons.push(isEn ? `Region 3-Spots Mastery Bonus +100pt` : `同一地域3施設制覇ボーナス100pt`);
      }
    }

    const allVisitedRegions = Array.from(new Set(this.member.checkins.map(c => c.regionId)));
    const allVisitedFacilities = Array.from(new Set(this.member.checkins.map(c => c.spotId)));

    if (allVisitedRegions.length >= 2 && !this.member.ledger.some(l => l.reason.includes(`別地域初訪問ボーナス(${facility.regionId})`))) {
      const firstRegionId = this.member.checkins[this.member.checkins.length - 1].regionId;
      if (facility.regionId !== firstRegionId) {
        bonusPoints += 100;
        this.recordLedgerTransaction("grant", 100, `別地域初訪問ボーナス(${facility.regionId})`, facility.id);
        pointReasons.push(isEn ? `New Region Bonus +100pt` : `別地域初訪問ボーナス100pt`);
      }
    }

    if (earnedPoints > 0) {
      this.recordLedgerTransaction("grant", earnedPoints, `${facility.name} 現地チェックイン (${pointReasons[0]})`, facility.id);
    } else {
      this.save();
    }

    this.checkTitleAchievements(allVisitedFacilities.length, allVisitedRegions.length);

    const facName = isEn ? (EN_MAP.facilities[facility.name] || facility.name) : facility.name;
    const charName = isEn ? (EN_MAP.characters[character.name] || character.name) : character.name;

    return {
      success: true,
      facilityName: facName,
      characterName: charName,
      costumeName: costume ? costume.name : (isEn ? "Standard Costume" : "通常衣装"),
      earnedPoints: earnedPoints + bonusPoints,
      isFirstVisit: isFirstVisit,
      pointReasons: pointReasons,
      message: isEn
        ? (isFirstVisit ? `Earned 100pt for your First Visit!` : (earnedPoints > 0 ? `Earned 30pt for this month's revisit!` : `Visit recorded. Monthly revisit bonus already claimed.`))
        : (isFirstVisit ? `初訪問 100pt を獲得しました！` : (earnedPoints > 0 ? `今月の再訪ポイント 30pt を獲得しました！` : `本日の訪問を記録しました。今月の再訪ポイントは獲得済みです。`))
    };
  }

  checkTitleAchievements(totalFacilities, totalRegions) {
    let newlyAchieved = [];
    if (!this.member.achievedTitles) this.member.achievedTitles = [];

    if (totalFacilities >= 1 && !this.member.achievedTitles.includes("TITLE_FIRST")) {
      this.member.achievedTitles.push("TITLE_FIRST");
      newlyAchieved.push("初めてのご縁");
    }
    if (totalFacilities >= 3 && !this.member.achievedTitles.includes("TITLE_REGION")) {
      this.member.achievedTitles.push("TITLE_REGION");
      newlyAchieved.push("地域のご縁");
    }
    if (totalRegions >= 3 && !this.member.achievedTitles.includes("TITLE_TRAVEL")) {
      this.member.achievedTitles.push("TITLE_TRAVEL");
      newlyAchieved.push("旅するご縁");
    }
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

// 言語設定切り替え関数
function setMemberLanguage(lang) {
  memberCurrentLang = (lang === "en") ? "en" : "ja";
  localStorage.setItem("goen_lang", memberCurrentLang);
  document.documentElement.lang = memberCurrentLang;

  // 言語スイッチャーボタンのアクティブ更新
  document.querySelectorAll(".member-lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === memberCurrentLang);
  });

  // 静的 [data-i18n] 要素を置換
  applyMemberStaticTranslations();

  // 各動的コンポーネントを再レンダリング
  renderMemberCard();
  renderOshiSection();
  renderStatsAndTitles();
  renderNextDestinations();
  renderStampBook();
  renderGoodsCollection();
  renderMemberContents();
  renderShop();
  renderPlans();

  // ご縁ひろば側の再描画
  if (window.hiroba && typeof window.hiroba.setLanguage === "function") {
    window.hiroba.setLanguage(memberCurrentLang);
  } else if (window.hiroba && typeof window.hiroba.renderPosts === "function") {
    window.hiroba.renderPosts();
  }
}

function applyMemberStaticTranslations() {
  const t = MEMBER_I18N[memberCurrentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });
}

// アプリ初期化
document.addEventListener("DOMContentLoaded", async () => {
  memberCurrentLang = detectMemberLanguage();
  document.documentElement.lang = memberCurrentLang;

  await loadMasterData();

  // 言語スイッチャーのイベントバインド
  const switcher = document.getElementById("member-lang-switcher");
  if (switcher) {
    switcher.addEventListener("click", (e) => {
      const btn = e.target.closest(".member-lang-btn");
      if (btn && btn.dataset.lang) {
        setMemberLanguage(btn.dataset.lang);
      }
    });
  }

  setupNavigation();
  setMemberLanguage(memberCurrentLang);
  setupCheckinSystem();
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
 * ナビゲーション設定
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
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];
  const meta = CHARACTER_META[mgr.member.favoriteGirl] || CHARACTER_META["那須乃つつじ"];
  const pass = document.getElementById("member-pass-card");
  if (pass) pass.className = "member-pass " + meta.themeClass;

  const avatar = document.getElementById("pass-avatar");
  if (avatar) avatar.src = meta.avatar;

  const nickname = document.getElementById("pass-nickname");
  if (nickname) {
    nickname.textContent = isEn
      ? (mgr.member.nicknameEn || "Goen Pilgrim")
      : (mgr.member.nickname + t.passPilgrimSuffix);
  }

  const oshiName = document.getElementById("pass-oshi-name");
  if (oshiName) {
    const charName = isEn ? (EN_MAP.characters[mgr.member.favoriteGirl] || mgr.member.favoriteGirl) : mgr.member.favoriteGirl;
    oshiName.textContent = `${t.passOshiPrefix}${charName}`;
  }

  const titleBadge = document.getElementById("pass-title-badge");
  if (titleBadge) {
    const titleText = isEn ? (EN_MAP.titles[mgr.member.title] || mgr.member.title || "First Connection") : (mgr.member.title || "初めてのご縁");
    titleBadge.textContent = titleText;
  }

  const points = document.getElementById("pass-points");
  if (points) points.textContent = mgr.member.points.toLocaleString();

  // プラン表示
  const planTag = document.getElementById("pass-plan-tag");
  const headerPlan = document.getElementById("header-plan-badge");
  let planLabel = t.passPlanFree;
  let headerLabel = t.planFreeBadge;
  if (mgr.member.plan === "supporter") {
    planLabel = t.passPlanSupporter;
    headerLabel = t.planSupporterBadge;
  } else if (mgr.member.plan === "cocreation") {
    planLabel = t.passPlanCocreate;
    headerLabel = t.planCocreateBadge;
  }

  if (planTag) planTag.textContent = planLabel;
  if (headerPlan) headerPlan.textContent = headerLabel;

  // 訪問統計
  const visitedFacilityCount = new Set(mgr.member.checkins.map(c => c.spotId)).size;
  const visitedRegionCount = new Set(mgr.member.checkins.map(c => c.regionId)).size;

  const vCountEl = document.getElementById("pass-visit-count");
  if (vCountEl) vCountEl.textContent = visitedFacilityCount;

  const rCountEl = document.getElementById("pass-region-count");
  if (rCountEl) rCountEl.textContent = visitedRegionCount;

  // ボタン設定
  const btnChangeOshi = document.getElementById("btn-change-oshi");
  if (btnChangeOshi) {
    btnChangeOshi.textContent = t.passChangeOshiBtn;
    btnChangeOshi.onclick = () => {
      const names = Object.keys(CHARACTER_META);
      const idx = names.indexOf(mgr.member.favoriteGirl);
      const next = names[(idx + 1) % names.length];
      mgr.member.favoriteGirl = next;
      mgr.save();
      renderMemberCard();
      renderOshiSection();
      const nextName = isEn ? (EN_MAP.characters[next] || next) : next;
      alert(isEn ? `Favorite character switched to [${nextName}]!` : `推しキャラクターを【${next}】に変更しました！`);
    };
  }

  const btnOpenPlans = document.getElementById("btn-open-plans");
  if (btnOpenPlans) {
    btnOpenPlans.textContent = t.passChangePlanBtn;
    btnOpenPlans.onclick = () => {
      const el = document.getElementById("section-plans");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
  }

  const btnToggleLogin = document.getElementById("btn-toggle-login");
  if (btnToggleLogin) {
    btnToggleLogin.textContent = t.logoutBtn;
    btnToggleLogin.onclick = () => {
      alert(isEn
        ? "Goen Girl Member Dashboard.\nYour session is safely stored in your browser."
        : "ご縁ガール会員ダッシュボードです。\n現在のアカウント状態はブラウザに安全に保存されています。");
    };
  }
}

/**
 * 1. 推しの近況・次の楽しみ
 */
function renderOshiSection() {
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];
  const charName = isEn ? (EN_MAP.characters[mgr.member.favoriteGirl] || mgr.member.favoriteGirl) : mgr.member.favoriteGirl;
  const meta = CHARACTER_META[mgr.member.favoriteGirl] || CHARACTER_META["那須乃つつじ"];

  const headline = document.getElementById("oshi-headline-name");
  if (headline) headline.textContent = charName;

  const msg = document.getElementById("oshi-message-text");
  if (msg) {
    const greetingText = isEn ? meta.greetingEn : meta.greeting;
    msg.textContent = isEn ? `"${greetingText}"` : `「${greetingText}」`;
  }
}

/**
 * 2. 現地チェックインシステム
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
    const isEn = memberCurrentLang === "en";
    demoSelect.innerHTML = mgr.master.facilities.map(f => {
      const char = mgr.master.characters.find(c => {
        const reg = mgr.master.regions.find(r => r.id === f.regionId);
        return reg && reg.characterId === c.id;
      });
      const charName = char ? (isEn ? (EN_MAP.characters[char.name] || char.name) : char.name) : (isEn ? "Guardian Girl" : "守護ガール");
      const spotName = isEn ? (EN_MAP.facilities[f.name] || f.name) : f.name;
      return `<option value="${f.id}">${spotName} (${charName})</option>`;
    }).join("");
  }

  if (startBtn) {
    startBtn.onclick = async () => {
      const isEn = memberCurrentLang === "en";
      const t = MEMBER_I18N[memberCurrentLang];
      statusNotice.className = "notice";
      statusNotice.textContent = t.checkinStatusChecking;
      startBtn.disabled = true;

      const facilities = mgr.master ? mgr.master.facilities : [];
      if (facilities.length === 0) {
        statusNotice.className = "notice error";
        statusNotice.textContent = t.checkinStatusNoFacilities;
        startBtn.disabled = false;
        return;
      }

      const isSimulation = chkSimulate ? chkSimulate.checked : false;

      if (isSimulation) {
        const selId = demoSelect ? demoSelect.value : facilities[0].id;
        currentTargetSpot = facilities.find(f => f.id === selId) || facilities[0];
        onSpotConfirmed(currentTargetSpot);
      } else {
        if (!navigator.geolocation) {
          statusNotice.className = "notice error";
          statusNotice.textContent = t.checkinStatusNoGps;
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
              const spotName = nearest ? (isEn ? (EN_MAP.facilities[nearest.name] || nearest.name) : nearest.name) : "";
              statusNotice.textContent = isEn
                ? `❌ [Not On-Site] Nearest spot "${spotName}" is ~${km}km away. Please check in when you arrive.`
                : `❌【現地未到達】最寄りの登録施設「${spotName}」まで約 ${km}km 離れています。敷地内に到着してからチェックインしてください。`;
              startBtn.disabled = false;
            }
          },
          (err) => {
            statusNotice.className = "notice error";
            statusNotice.textContent = t.checkinStatusDenied;
            startBtn.disabled = false;
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    };
  }

  function onSpotConfirmed(spot) {
    const isEn = memberCurrentLang === "en";
    statusNotice.className = "notice success";
    const costume = mgr.master.costumes.find(c => c.facilityId === spot.id);
    const costumeName = costume ? costume.name : (isEn ? "Costume" : "制服・衣装");
    const char = mgr.master.characters.find(c => {
      const reg = mgr.master.regions.find(r => r.id === spot.regionId);
      return reg && reg.characterId === c.id;
    }) || mgr.master.characters[0];

    const spotName = isEn ? (EN_MAP.facilities[spot.name] || spot.name) : spot.name;
    const charName = isEn ? (EN_MAP.characters[char.name] || char.name) : char.name;

    statusNotice.textContent = isEn
      ? `📍 [Arrival Verified] You are at "${spotName}"! Align the life-sized standee (${charName} / ${costumeName}) in your camera frame.`
      : `📍【現地到着を確認】「${spot.name}」にいます！店頭の等身大パネル（${char.name} / ${costumeName}）をスマホカメラ枠内に収めてください。`;

    if (targetCharLabel) targetCharLabel.textContent = `${spotName} - ${charName}`;

    openCamera(spot, char);
  }

  async function openCamera(spot, char) {
    const isEn = memberCurrentLang === "en";
    try {
      activeVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      if (video) video.srcObject = activeVideoStream;
      if (cameraBox) cameraBox.style.display = "block";
    } catch (e) {
      if (cameraBox) cameraBox.style.display = "block";
      statusNotice.textContent += isEn ? " (Camera unavailable, continuing in image verify mode)" : "（カメラを起動できないため、画像確認モードでチェックインを進めます）";
    }
  }

  if (btnSampleFeed) {
    btnSampleFeed.onclick = () => {
      const isEn = memberCurrentLang === "en";
      alert(isEn
        ? "Verifying standee in frame. Please press 'Confirm Visit & Claim Points'."
        : "店頭の等身大パネルを確認しています。フレーム枠内にパネルを収めて「訪問を確定する」を押してください。");
    };
  }

  if (btnRecognize) {
    btnRecognize.onclick = () => {
      if (!currentTargetSpot) return;
      const isEn = memberCurrentLang === "en";
      const t = MEMBER_I18N[memberCurrentLang];

      btnRecognize.disabled = true;
      btnRecognize.textContent = t.cameraConfirming;

      setTimeout(() => {
        btnRecognize.disabled = false;
        btnRecognize.textContent = t.cameraConfirmBtn;

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
 * チェックイン完了画面モーダル表示
 */
function showCheckinCompleteModal(result) {
  const modal = document.getElementById("modal-checkin-complete");
  if (!modal) return;
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const titleEl = document.getElementById("complete-modal-title");
  const ptsEl = document.getElementById("complete-modal-points");
  const costumeEl = document.getElementById("complete-modal-costume");

  if (titleEl) {
    titleEl.textContent = isEn
      ? `${t.compConnectedWith} ${result.characterName} at ${result.facilityName}!`
      : `「${result.facilityName}」の「${result.characterName}」と、ご縁が結ばれました！`;
  }
  if (ptsEl) ptsEl.textContent = result.message;
  if (costumeEl) {
    costumeEl.textContent = isEn
      ? `"${result.costumeName}" ${t.compCostumeAdded}`
      : `衣装「${result.costumeName}」がご縁スタンプ帳に加わりました。`;
  }

  modal.style.display = "grid";

  // モーダル内アクション
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
    alert(isEn
      ? `[${result.facilityName}] Experiences & Local Tips\nEnjoy authentic local delicacies and sacred sights!`
      : `【${result.facilityName}】の体験・周辺観光情報\n地元ならではのグルメや名所をお楽しみください！`);
  };
  document.getElementById("btn-comp-post").onclick = () => {
    modal.style.display = "none";
    if (window.hiroba && typeof window.hiroba.openPostModal === "function") {
      window.hiroba.openPostModal();
    }
  };
  document.getElementById("btn-close-complete-modal").onclick = () => {
    modal.style.display = "none";
  };
}

/**
 * 3. ポイント残高・訪問数・称号
 */
function renderStatsAndTitles() {
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const pts = document.getElementById("stats-point-val");
  if (pts) pts.innerHTML = `${mgr.member.points.toLocaleString()} <span class="unit">pt</span>`;

  const visitedCount = new Set(mgr.member.checkins.map(c => c.spotId)).size;
  const facEl = document.getElementById("stats-facility-val");
  if (facEl) facEl.innerHTML = `${visitedCount} <span class="unit">${t.passSpotsUnit}</span>`;

  const titleVal = document.getElementById("stats-title-val");
  if (titleVal) titleVal.innerHTML = `${mgr.member.achievedTitles.length} <span class="unit">${isEn ? 'titles' : '個'}</span>`;

  const curTitle = document.getElementById("stats-current-title");
  if (curTitle) {
    curTitle.textContent = isEn ? (EN_MAP.titles[mgr.member.title] || mgr.member.title) : (mgr.member.title || "初めてのご縁");
  }

  const container = document.getElementById("titles-container");
  if (container && mgr.master) {
    const titlesData = [
      { id: "TITLE_FIRST", name: "初めてのご縁", nameEn: "First Connection", desc: "提携施設に初めてチェックインする", descEn: "Check in at your first partner spot" },
      { id: "TITLE_REGION", name: "地域のご縁", nameEn: "Regional Connection", desc: "同一地域で3か所の施設を訪問する", descEn: "Visit 3 different spots in the same region" },
      { id: "TITLE_TRAVEL", name: "旅するご縁", nameEn: "Journey Connection", desc: "異なる3つの地域を訪問する", descEn: "Visit spots across 3 distinct regions" },
      { id: "TITLE_MASTER", name: "ご縁結びマスター", nameEn: "Goen Master", desc: "全国10か所以上の提携施設を巡礼する", descEn: "Complete visits to 10 or more spots nationwide" }
    ];

    container.innerHTML = titlesData.map(titleObj => {
      const isAchieved = mgr.member.achievedTitles.includes(titleObj.id);
      return `
        <div class="title-card ${isAchieved ? 'achieved' : ''}">
          <div class="title-icon">${isAchieved ? '🏅' : '🔒'}</div>
          <div>
            <div class="title-name" style="color: ${isAchieved ? '#b8860b' : '#777'};">${isEn ? titleObj.nameEn : titleObj.name}</div>
            <div class="title-desc">${isEn ? titleObj.descEn : titleObj.desc}</div>
            <div style="font-size: 10px; margin-top: 4px; font-weight: 700; color: ${isAchieved ? '#00875a' : '#999'};">
              ${isAchieved ? t.titleAchieved : t.titleUnachieved}
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
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const visitedSpotIds = new Set(mgr.member.checkins.map(c => c.spotId));

  container.innerHTML = mgr.master.facilities.map(f => {
    const isVisited = visitedSpotIds.has(f.id);
    const costume = mgr.master.costumes.find(c => c.facilityId === f.id);
    const reg = mgr.master.regions.find(r => r.id === f.regionId);
    const char = mgr.master.characters.find(c => reg && reg.characterId === c.id);

    const facName = isEn ? (EN_MAP.facilities[f.name] || f.name) : f.name;
    const regName = isEn ? (EN_MAP.regions[reg ? reg.name : ''] || (reg ? reg.name : '')) : (reg ? reg.name : '');
    const costName = costume ? costume.name : (isEn ? "Standard Costume" : "通常衣装");

    return `
      <div class="dest-card">
        <div style="height: 100px; background: #eef5fa; display: flex; align-items: center; justify-content: center; position: relative;">
          <img src="${char ? char.avatar : '../assets/nasuno-tsutsuji.png'}" alt="" style="height: 90px; object-fit: contain;">
          ${isVisited ? `<span style="position: absolute; top: 8px; right: 8px; background: #00875a; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${t.destVisited}</span>` : ''}
        </div>
        <div class="dest-body">
          <div>
            <div class="dest-title">${facName}</div>
            <div class="dest-meta">${regName} • ${costName}</div>
            <div style="font-size: 11px; color: #666; margin-bottom: 6px;">
              🕒 ${f.openingHours || (isEn ? 'Open' : '営業中')}
            </div>
          </div>
          <a href="https://maps.google.com/?q=${encodeURIComponent(f.address)}" target="_blank" class="btn-secondary" style="display: block; text-align: center; text-decoration: none; font-size: 11px; padding: 6px;">
            ${t.destMapLink}
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
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

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
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #888;">${isEn ? 'No spots found' : '該当する施設がありません'}</div>`;
    return;
  }

  container.innerHTML = list.map(f => {
    const checkin = mgr.member.checkins.find(c => c.spotId === f.id);
    const isStamped = !!checkin;
    const isShrine = f.industry && f.industry.includes("寺社");
    const stampLabel = isEn ? (isShrine ? "Shrine Stamp" : "Visit Stamp") : (isShrine ? "御朱印" : "訪問印");
    const facName = isEn ? (EN_MAP.facilities[f.name] || f.name) : f.name;

    return `
      <div class="stamp-slot ${isStamped ? 'stamped' : ''}">
        <div class="stamp-mark">${isStamped ? (isShrine ? t.stampMarkShrine : t.stampMarkSpot) : '？'}</div>
        <div class="stamp-spot-name">${facName}</div>
        <small style="color: #6b8292;">${stampLabel}</small>
        <div class="stamp-date">${isStamped ? `${t.stampVisitedDate}${checkin.date}` : t.stampUnvisited}</div>
      </div>
    `;
  }).join("");

  if (regFilter) regFilter.onchange = renderStampBook;
  if (charFilter) charFilter.onchange = renderStampBook;
}

/**
 * 6. グッズ ＆ コレクション
 */
function renderGoodsCollection() {
  const container = document.getElementById("goods-container");
  if (!container || !mgr.master) return;
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const tabs = document.querySelectorAll(".goods-tab-btn");
  let activeTab = "all";
  tabs.forEach(tab => {
    if (tab.classList.contains("active")) activeTab = tab.dataset.goodstab;
    tab.onclick = () => {
      tabs.forEach(x => x.classList.remove("active"));
      tab.classList.add("active");
      renderGoodsCollection();
    };
  });

  let goodsList = mgr.master.goods || [
    { id: "G001", name: "アクリルスタンド 巫女装束Ver.", nameEn: "Acrylic Stand Shrine Maiden Ver.", character: "那須乃つつじ", facilityName: "高野山真言宗 高福寺", price: 1500, stock: "in_stock", canReserve: true },
    { id: "G002", name: "狩野くるみ 特製アイススプーン", nameEn: "Kurumi Ice Cream Spoon", character: "狩野くるみ", facilityName: "那須ミッドシティホテル", price: 600, stock: "in_stock", canReserve: true },
    { id: "G003", name: "大俵ちか 与一の矢アクリルチャーム", nameEn: "Chika Arrow Acrylic Charm", character: "大俵ちか", facilityName: "光丸山法輪寺", price: 700, stock: "in_stock", canReserve: true }
  ];

  if (activeTab === "wants") {
    goodsList = goodsList.filter(g => mgr.member.wantsGoods.includes(g.id));
  } else if (activeTab === "owns") {
    goodsList = goodsList.filter(g => mgr.member.ownsGoods.includes(g.id));
  } else if (activeTab === "reservations") {
    if (mgr.member.reservations.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #888;">${isEn ? 'No active reservations' : '予約中の商品はありません'}</div>`;
      return;
    }
    container.innerHTML = mgr.member.reservations.map(r => `
      <div class="goods-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; background: #0052cc; color: #fff; padding: 2px 6px; border-radius: 4px;">${isEn ? 'Reservation Confirmed' : '予約受付済み'}</span>
            <span style="font-size: 11px; color: #666;">${isEn ? 'Voucher Code' : '引換コード'}: <strong>${r.code}</strong></span>
          </div>
          <div class="goods-name">${r.goodsName}</div>
          <div style="font-size: 12px; color: #555; margin-top: 4px;">${isEn ? 'Spot' : '受取施設'}: ${r.facilityName}</div>
          <div style="font-size: 11px; color: #b8860b; margin-top: 2px;">${isEn ? 'Pickup Deadline' : '受取期日'}: ${r.expireDate} (${isEn ? 'Pay on-site' : '現地払い'})</div>
        </div>
      </div>
    `).join("");
    return;
  }

  if (goodsList.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #888;">${isEn ? 'No items in this list' : '登録されている商品がありません'}</div>`;
    return;
  }

  container.innerHTML = goodsList.map(g => {
    const isWant = mgr.member.wantsGoods.includes(g.id);
    const isOwn = mgr.member.ownsGoods.includes(g.id);
    const gName = isEn ? (g.nameEn || g.name) : g.name;
    const facName = isEn ? (EN_MAP.facilities[g.facilityName] || g.facilityName) : g.facilityName;

    return `
      <div class="goods-card">
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; color: #00875a; font-weight: 700;">${t.goodsStockIn}</span>
            <span style="font-size: 13px; font-weight: 800; color: var(--navy);">¥${g.price.toLocaleString()}</span>
          </div>
          <div class="goods-name">${gName}</div>
          <div style="font-size: 11px; color: #666;">📍 ${facName}</div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn-secondary" style="flex: 1; font-size: 11px; padding: 5px; ${isWant ? 'background:#ffebe6; color:#de350b; border-color:#de350b;' : ''}" onclick="toggleGoodsStatus('${g.id}', 'wants')">
            ${isWant ? '❤️ ' + (isEn ? 'Wanted' : '欲しい中') : t.goodsBtnWant}
          </button>
          <button class="btn-secondary" style="flex: 1; font-size: 11px; padding: 5px; ${isOwn ? 'background:#e3fcef; color:#006644; border-color:#006644;' : ''}" onclick="toggleGoodsStatus('${g.id}', 'owns')">
            ${isOwn ? '🎒 ' + (isEn ? 'Owned' : '所持中') : t.goodsBtnOwn}
          </button>
          ${g.canReserve ? `
            <button class="btn-primary" style="width: 100%; font-size: 11px; padding: 6px; margin-top: 4px;" onclick="openReservationModal('${g.id}', '${gName.replace(/'/g, "\\'")}', '${facName.replace(/'/g, "\\'")}')">
              ${t.goodsReserveBtn}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");
}

function toggleGoodsStatus(goodsId, type) {
  const isEn = memberCurrentLang === "en";
  if (type === "wants") {
    if (mgr.member.wantsGoods.includes(goodsId)) {
      mgr.member.wantsGoods = mgr.member.wantsGoods.filter(id => id !== goodsId);
    } else {
      mgr.member.wantsGoods.push(goodsId);
    }
  } else if (type === "owns") {
    if (mgr.member.ownsGoods.includes(goodsId)) {
      mgr.member.ownsGoods = mgr.member.ownsGoods.filter(id => id !== goodsId);
    } else {
      mgr.member.ownsGoods.push(goodsId);
    }
  }
  mgr.save();
  renderGoodsCollection();
}

function openReservationModal(goodsId, goodsName, facilityName) {
  const modal = document.getElementById("modal-reservation");
  const content = document.getElementById("reservation-form-content");
  if (!modal || !content) return;
  const isEn = memberCurrentLang === "en";

  if (mgr.member.plan === "free") {
    content.innerHTML = `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
        <h4 style="font-size: 15px; margin-bottom: 8px;">${isEn ? 'Supporter Feature' : '応援会員・共創会員限定機能です'}</h4>
        <p style="font-size: 12px; color: #666; line-height: 1.6; margin-bottom: 16px;">
          ${isEn ? 'Merchandise pickup reservation is available exclusively for Supporter and Co-Creation members. Never miss out on sold-out local goods!' : '「現地受取予約」は、遠方からの巡礼で確実に限定グッズを手に入れたいファンのための応援会員特典です。'}
        </p>
        <button class="btn-primary" style="width: 100%; padding: 10px;" onclick="document.getElementById('modal-reservation').style.display='none'; document.getElementById('section-plans').scrollIntoView({behavior:'smooth'});">
          ${isEn ? 'Explore Supporter Plan (¥480/mo)' : '応援会員プランを見る (月額480円)'}
        </button>
      </div>
    `;
    modal.style.display = "grid";
    return;
  }

  const expDate = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
  content.innerHTML = `
    <div>
      <div style="background: #f4f5f7; padding: 12px; border-radius: 8px; margin-bottom: 14px;">
        <div style="font-size: 13px; font-weight: 700;">${goodsName}</div>
        <div style="font-size: 12px; color: #555; margin-top: 4px;">📍 ${facilityName}</div>
        <div style="font-size: 11px; color: #0052cc; margin-top: 2px;">${isEn ? 'Hold period: 14 days (Until ' + expDate + ')' : '取り置き期間: 14日間 (' + expDate + ' まで)'}</div>
      </div>
      <p style="font-size: 12px; color: #666; line-height: 1.5; margin-bottom: 14px;">
        ${isEn ? 'Upon confirmation, a voucher code will be issued. Please show this code and pay at the counter.' : '店頭レジにて発行される引換コードをスタッフにご提示のうえ、現地でお支払いください。'}
      </p>
      <button class="btn-primary" style="width: 100%; padding: 12px; font-size: 13px;" onclick="confirmGoodsReservation('${goodsId}', '${goodsName.replace(/'/g, "\\'")}', '${facilityName.replace(/'/g, "\\'")}', '${expDate}')">
        ${isEn ? 'Confirm Pickup Reservation' : '取り置き予約を確定する'}
      </button>
    </div>
  `;
  modal.style.display = "grid";
}

function confirmGoodsReservation(goodsId, goodsName, facilityName, expireDate) {
  const isEn = memberCurrentLang === "en";
  const code = "RES-" + Math.floor(100000 + Math.random() * 900000);
  mgr.member.reservations.unshift({
    id: "RES_" + Date.now(),
    goodsId,
    goodsName,
    facilityName,
    expireDate,
    code,
    date: new Date().toISOString().split("T")[0]
  });
  mgr.save();
  document.getElementById("modal-reservation").style.display = "none";
  renderGoodsCollection();
  alert(isEn
    ? `Pickup Reservation Confirmed!\nVoucher Code: ${code}\nPlease show this code at ${facilityName}.`
    : `受取予約が完了しました！\n引換コード: 【${code}】\n${facilityName} の窓口でご提示ください。`);
}

/**
 * 7. 会員限定コンテンツ
 */
function renderMemberContents() {
  const container = document.getElementById("contents-container");
  if (!container) return;
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const contents = [
    {
      id: "M001",
      title: "那須乃つつじ「春の訪れ」撮り下ろしボイス",
      titleEn: "Tsutsuji Nasuno: 'Spring Arrival' Voice Greeting",
      type: "voice",
      planReq: "supporter",
      desc: "高福寺の桜並木を歩きながら語りかける癒やしのメッセージ",
      descEn: "Gentle message strolling along the cherry blossoms of Kofukuji",
      audioText: "暖かな風が心地よい季節になりましたわ。那須の清らかなお湯で旅の疲れを流していってくださいね。"
    },
    {
      id: "M002",
      title: "那須塩原紅葉峡谷 特製スマホ壁紙",
      titleEn: "Nasushiobara Autumn Gorge Exclusive Wallpaper",
      type: "wallpaper",
      planReq: "free",
      desc: "塩原の吊り橋と狩野くるみ 高解像度イラスト待受",
      descEn: "High-resolution smartphone wallpaper of Kurumi at Shiobara suspension bridge",
      image: "../assets/karino-milk.png"
    },
    {
      id: "M003",
      title: "大俵ちか 武者修行ボイスドラマ（前編）",
      titleEn: "Chika Otawara: Warrior Heritage Audio Drama (Part 1)",
      type: "voice",
      planReq: "cocreation",
      desc: "与一の里で弓道大会に挑むちかの奮闘を描く本格ボイス",
      descEn: "Dramatic voice drama following Chika's archery tournament",
      audioText: "風を読み、心を静め…放つ！一矢必中の想い、あなたに届きましたか？"
    }
  ];

  container.innerHTML = contents.map(item => {
    const isLocked = (item.planReq === "supporter" && mgr.member.plan === "free") ||
                     (item.planReq === "cocreation" && mgr.member.plan !== "cocreation");
    const itemTitle = isEn ? item.titleEn : item.title;
    const itemDesc = isEn ? item.descEn : item.desc;

    return `
      <div class="media-card" style="background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 11px; background: ${item.type === 'voice' ? '#e6f6fa' : '#fff0f5'}; color: ${item.type === 'voice' ? '#1199c4' : '#e9588d'}; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
            ${item.type === 'voice' ? '🎙️ ' + (isEn ? 'Voice' : 'ボイス') : '🖼️ ' + (isEn ? 'Wallpaper' : '壁紙')}
          </span>
          <span style="font-size: 11px; color: ${isLocked ? '#de350b' : '#00875a'}; font-weight: 700;">
            ${isLocked ? '🔒 ' + (item.planReq === 'cocreation' ? (isEn ? 'Co-Creation Only' : '共創会員限定') : (isEn ? 'Supporter Only' : '応援会員限定')) : '✔ ' + (isEn ? 'Unlocked' : '視聴可能')}
          </span>
        </div>
        <h4 style="font-size: 14px; margin-bottom: 6px; color: var(--navy);">${itemTitle}</h4>
        <p style="font-size: 12px; color: #666; margin-bottom: 12px; line-height: 1.5;">${itemDesc}</p>
        <div>
          ${isLocked ? `
            <button class="btn-secondary" style="width: 100%; font-size: 12px;" onclick="document.getElementById('section-plans').scrollIntoView({behavior:'smooth'})">
              ${isEn ? 'Upgrade Plan to Unlock' : 'プランアップグレードで解放'}
            </button>
          ` : `
            <button class="btn-primary" style="width: 100%; font-size: 12px;" onclick="playContentMedia('${item.type}', '${(item.audioText || itemTitle).replace(/'/g, "\\'")}')">
              ${item.type === 'voice' ? t.contentsPlayVoice : t.contentsDownload}
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

function playContentMedia(type, text) {
  const isEn = memberCurrentLang === "en";
  if (type === "voice") {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEn ? 'en-US' : 'ja-JP';
      utterance.pitch = 1.35;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
    alert(isEn ? `[Exclusive Voice Message]\n"${text}"` : `【会員限定ボイス】\n「${text}」`);
  } else {
    alert(isEn ? "Downloading high-resolution smartphone wallpaper..." : "特製高画質スマートフォンのダウンロードを開始しました！");
  }
}

/**
 * 8. ポイント交換所 ＆ 台帳
 */
function renderShop() {
  const container = document.getElementById("shop-container");
  const ledgerContainer = document.getElementById("ledger-history-container");
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const shopItems = [
    { id: "R001", name: "那須乃つつじ シークレット甘味ボイス", nameEn: "Tsutsuji: Secret Sweets Voice", cost: 40, type: "voice" },
    { id: "R002", name: "3人集合 秋の那須連山壁紙", nameEn: "All 3 Girls: Autumn Nasu Mountains Wallpaper", cost: 60, type: "wallpaper" },
    { id: "R003", name: "狩野くるみ 館内放送限定ボイス", nameEn: "Kurumi: Hotel Broadcast Voice", cost: 200, type: "voice" },
    { id: "R004", name: "ご縁巡礼者 特製アクリルバッジ引換券", nameEn: "Special Acrylic Badge Voucher", cost: 350, type: "coupon" }
  ];

  if (container) {
    container.innerHTML = shopItems.map(item => {
      const isUnlocked = mgr.member.unlockedItems.includes(item.id);
      const canAfford = mgr.member.points >= item.cost;
      const itemName = isEn ? item.nameEn : item.name;

      return `
        <div class="shop-item-card" style="background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; color: #b8860b; font-weight: 800;">🪙 ${item.cost} pt</span>
            ${isUnlocked ? `<span style="font-size: 11px; color: #00875a; font-weight: 700;">${t.shopUnlockedBadge}</span>` : ''}
          </div>
          <h4 style="font-size: 13px; color: var(--navy); margin-bottom: 10px;">${itemName}</h4>
          <button class="btn-primary" style="width: 100%; font-size: 11px; padding: 6px; ${isUnlocked ? 'background:#ccc; cursor:default;' : (!canAfford ? 'opacity:0.6;' : '')}" ${isUnlocked ? 'disabled' : ''} onclick="exchangeShopItem('${item.id}', ${item.cost}, '${itemName.replace(/'/g, "\\'")}')">
            ${isUnlocked ? t.shopUnlockedBadge : `${item.cost} ${t.shopUnlockBtn}`}
          </button>
        </div>
      `;
    }).join("");
  }

  if (ledgerContainer) {
    const historyList = mgr.member.ledger || [];
    if (historyList.length === 0) {
      ledgerContainer.innerHTML = `<li style="text-align: center; color: #888; padding: 10px;">${isEn ? 'No ledger transactions yet' : '履歴がありません'}</li>`;
    } else {
      ledgerContainer.innerHTML = historyList.slice(0, 10).map(item => {
        const isPlus = item.type === "grant";
        return `
          <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 12px;">
            <div>
              <div style="font-weight: 700; color: #333;">${item.reason}</div>
              <div style="font-size: 10px; color: #888;">${item.date}</div>
            </div>
            <div style="font-weight: 800; font-size: 13px; color: ${isPlus ? '#00875a' : '#de350b'};">
              ${isPlus ? '+' : '-'}${Math.abs(item.amount)} pt
            </div>
          </li>
        `;
      }).join("");
    }
  }
}

function exchangeShopItem(id, cost, name) {
  const isEn = memberCurrentLang === "en";
  if (mgr.member.points < cost) {
    alert(isEn ? "Not enough points!" : "ポイントが足りません！");
    return;
  }
  if (!confirm(isEn ? `Redeem ${cost}pt for "${name}"?` : `${cost}pt を消費して「${name}」を解放しますか？`)) {
    return;
  }
  mgr.recordLedgerTransaction("consume", -cost, `ポイント交換: ${name}`);
  mgr.member.unlockedItems.push(id);
  mgr.save();
  renderMemberCard();
  renderStatsAndTitles();
  renderShop();
  alert(isEn ? `Unlocked "${name}" successfully!` : `「${name}」を解放しました！`);
}

/**
 * 9. 会員プラン・設定
 */
function renderPlans() {
  const isEn = memberCurrentLang === "en";
  const t = MEMBER_I18N[memberCurrentLang];

  const btnFree = document.getElementById("btn-select-free");
  const btnSupporter = document.getElementById("btn-select-supporter");
  const btnCocreation = document.getElementById("btn-select-cocreation");

  if (btnFree) {
    btnFree.textContent = mgr.member.plan === "free" ? t.planFreeBtnActive : (isEn ? "Select Free" : "無料会員に変更");
    btnFree.disabled = mgr.member.plan === "free";
    btnFree.onclick = () => switchPlan("free");
  }

  if (btnSupporter) {
    btnSupporter.textContent = mgr.member.plan === "supporter" ? t.planFreeBtnActive : t.planSupporterBtn;
    btnSupporter.disabled = mgr.member.plan === "supporter";
    btnSupporter.onclick = () => switchPlan("supporter");
  }

  if (btnCocreation) {
    btnCocreation.textContent = mgr.member.plan === "cocreation" ? t.planFreeBtnActive : t.planCocreateBtn;
    btnCocreation.disabled = mgr.member.plan === "cocreation";
    btnCocreation.onclick = () => switchPlan("cocreation");
  }
}

function switchPlan(newPlan) {
  const isEn = memberCurrentLang === "en";
  const planNames = {
    free: isEn ? "Free Member" : "無料会員",
    supporter: isEn ? "Supporter Plan (¥480/mo)" : "応援会員 (月額480円)",
    cocreation: isEn ? "Co-Creation Plan (¥980/mo)" : "共創会員 (月額980円)"
  };
  if (!confirm(isEn ? `Switch your membership plan to [${planNames[newPlan]}]?` : `会員プランを【${planNames[newPlan]}】に変更しますか？`)) {
    return;
  }
  mgr.member.plan = newPlan;
  mgr.save();
  renderMemberCard();
  renderMemberContents();
  renderPlans();
  alert(isEn ? `Plan changed to [${planNames[newPlan]}]!` : `プランを【${planNames[newPlan]}】に変更しました！`);
}

/**
 * 各種モーダル設定
 */
function setupModals() {
  const closeResBtn = document.getElementById("btn-close-res-modal");
  if (closeResBtn) {
    closeResBtn.onclick = () => {
      document.getElementById("modal-reservation").style.display = "none";
    };
  }
}
