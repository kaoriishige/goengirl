/**
 * ご縁ガール — ご縁ひろば (hiroba.js)
 * 会員同士が旅の思い出、推しの魅力、グッズの楽しみ方を共有する交流コミュニティ
 * 
 * 仕様準拠:
 * - 既存の会員認証・プラン（無料/480円/980円）と完全連携
 * - 話題分類（旅の思い出、推しガール自慢、グッズ写真、聖地巡礼レポート、運営からのお便り）
 * - キャラクター/地域/話題/プラン別の柔軟な絞り込み
 * - 写真投稿（最大4枚・Base64・Exif削除シミュレーション・プレビュー）
 * - いいね（重複防止・トグル）、コメント（500文字）、保存（ブックマーク）
 * - 通報・ブロック機能（ローカルモデレーション）
 * - 初回ガイドオーバーレイ ＆ 初回投稿ルール同意確認
 * - Firebase未接続（localStorage運用、管理画面ステータス連動）
 * - 投稿・交流によるポイント付与はなし（厳格順守）
 */

// LocalStorageキー定義
const HIROBA_KEYS = {
  POSTS: "goen_hiroba_posts_v1",
  LIKES: "goen_hiroba_likes_v1",
  COMMENTS: "goen_hiroba_comments_v1",
  SAVES: "goen_hiroba_saves_v1",
  REPORTS: "goen_hiroba_reports_v1",
  BLOCKS: "goen_hiroba_blocks_v1",
  RULE_AGREED: "goen_hiroba_rule_agreed_v1",
  GUIDE_SEEN: "goen_hiroba_guide_seen_v1"
};

// 話題（カテゴリ）定義
const HIROBA_CATEGORIES = {
  trip: { label: "旅の思い出", labelEn: "Travel Memories", icon: "🗺️", color: "#1199c4", desc: "観光スポット、現地グルメ、旅の風景", descEn: "Scenic sights, local food & travel moments" },
  oshi: { label: "推しガール自慢", labelEn: "Oshi Moments", icon: "🌸", color: "#e9588d", desc: "等身大パネル、推し活、衣装の魅力", descEn: "Life-sized standees, oshi photos & costume charms" },
  goods: { label: "グッズ写真", labelEn: "Goods Photos", icon: "🛍️", color: "#d4a337", desc: "購入したグッズ、現地限定品、飾り方", descEn: "Purchased merchandise, regional goods & displays" },
  report: { label: "聖地巡礼レポート", labelEn: "Pilgrimage Reports", icon: "🧭", color: "#00875a", desc: "おすすめ巡礼ルート、見どころ、アドバイス", descEn: "Pilgrimage routes, scenic spots & tips" },
  official: { label: "運営からのお便り", labelEn: "Official News", icon: "📢", color: "#0f2740", desc: "公式お知らせ、新企画情報、先行レポート", descEn: "Official updates, project news & reports" }
};

// 初期ダミー投稿データ（初回ロード時に登録）
const INITIAL_HIROBA_POSTS = [
  {
    id: "POST_OFFICIAL_001",
    authorId: "OFFICIAL_ADMIN",
    authorName: "ご縁ガール運営事務局",
    authorPlan: "official",
    isOfficial: true,
    category: "official",
    characterId: "all",
    characterName: "全キャラクター",
    facilityId: null,
    facilityName: "公式運営オフィス",
    goodsId: null,
    goodsName: null,
    region: "全国",
    title: "【公式】会員交流コミュニティ「ご縁ひろば」がオープンしました！",
    content: "全国のご縁ガールファンの皆様、大変お待たせいたしました！\n会員同士で旅の思い出や推し活、現地で見つけた素敵なお店やグッズの楽しみ方を共有できる「ご縁ひろば」を開設いたしました。\n\n「ここに行ってみたい！」「この衣装に会いたい！」「このグッズを現地で手に入れたい！」という温かいご縁が広がる場所を目指しています。\n皆様の素敵な旅のお写真やレポートの投稿を心よりお待ちしております🌸",
    images: [],
    visibility: "public",
    likesCount: 38,
    commentsCount: 2,
    createdAt: "2026-09-18 10:00",
    status: "active"
  },
  {
    id: "POST_DEMO_001",
    authorId: "GG-FAN-102938",
    authorName: "那須高原の風",
    authorPlan: "cocreation",
    isOfficial: false,
    category: "oshi",
    characterId: "CHAR_TSUTSUJI",
    characterName: "那須乃つつじ",
    facilityId: "FAC_C002",
    facilityName: "高野山真言宗 高福寺",
    goodsId: "GOODS_003",
    goodsName: "那須乃つつじ 公式参拝御朱印",
    region: "那須町",
    title: "高福寺のつつじちゃんに会ってきました！境内が本当に美しい",
    content: "秋晴れの日に高野山真言宗 高福寺へ巡礼に行ってきました！\n本堂前に佇むつつじちゃんの等身大パネル、清楚な参拝装束が緑の境内に映えて本当に神々しかったです。\n社務所でいただいた公式参拝御朱印も和紙の手触りが素晴らしくて宝物になりました。静けさに包まれて心が洗われます。",
    images: [
      "../assets/nasuno-tsutsuji.png"
    ],
    visibility: "public",
    likesCount: 24,
    commentsCount: 3,
    createdAt: "2026-09-17 14:30",
    status: "active"
  },
  {
    id: "POST_DEMO_002",
    authorId: "GG-FAN-551920",
    authorName: "くるみ推し鉄",
    authorPlan: "supporter",
    isOfficial: false,
    category: "trip",
    characterId: "CHAR_MILK",
    characterName: "狩野くるみ",
    facilityId: "FAC_C001",
    facilityName: "那須ミッドシティホテル",
    goodsId: "GOODS_001",
    goodsName: "狩野くるみ アクリルキーホルダー",
    region: "那須塩原市",
    title: "那須ミッドシティホテル宿泊記！駅チカで巡礼拠点に最高でした",
    content: "JR那須塩原駅西口から歩いてすぐの那須ミッドシティホテルに宿泊しました！\nロビーにくるみちゃんの等身大パネルがお出迎えしてくれてテンションMAX！\nスタッフさんもとても親切で、ホテル限定のアクリルキーホルダーも無事ゲットできました。朝食の地元食材も美味しくて、栃木巡礼の拠点として超おすすめです！",
    images: [
      "../assets/karino-milk.png"
    ],
    visibility: "public",
    likesCount: 19,
    commentsCount: 1,
    createdAt: "2026-09-16 19:15",
    status: "active"
  },
  {
    id: "POST_DEMO_003",
    authorId: "GG-FAN-773821",
    authorName: "大俵の弓師",
    authorPlan: "supporter",
    isOfficial: false,
    category: "report",
    characterId: "CHAR_CHIKA",
    characterName: "大俵ちか",
    facilityId: "FAC_C003",
    facilityName: "光丸山法輪寺",
    goodsId: "GOODS_004",
    goodsName: "大俵ちか 願掛け破魔矢絵馬",
    region: "大田原市",
    title: "【聖地巡礼】光丸山法輪寺の日本一の大天狗面とちかちゃん！",
    content: "大田原市の光丸山法輪寺へ！天狗伝説が息づく厳かなお寺で、日本一の大天狗面は迫力満点でした。\n大俵ちかちゃんの法被姿のパネルが門前を華やかに盛り上げていてかっこいい！\n破魔矢絵馬に「ご縁ガール全国展開祈願」を書いて奉納してきました。大田原の唐辛子グルメも楽しめて大満足のルートです！",
    images: [
      "../assets/otawara-chika.png"
    ],
    visibility: "public",
    likesCount: 31,
    commentsCount: 2,
    createdAt: "2026-09-15 11:45",
    status: "active"
  },
  {
    id: "POST_DEMO_004",
    authorId: "GG-FAN-990112",
    authorName: "ご縁トラベラー",
    authorPlan: "cocreation",
    isOfficial: false,
    category: "goods",
    characterId: "all",
    characterName: "全キャラクター",
    facilityId: null,
    facilityName: "栃木3市巡礼ロード",
    goodsId: "GOODS_002",
    goodsName: "狩野くるみ 等身大イラストアクリルスタンド",
    region: "栃木県全域",
    title: "栃木3市アクスタ連れて巡礼コンプリートしました！",
    content: "週末を使って那須塩原・那須・大田原の3拠点を巡礼してきました！\n現地で手に入れたアクスタと一緒に各スポットで記念撮影。現地限定の御朱印やキーホルダーも揃って最高のコレクションになりました。\n次は共創会員の投票で新しい企画が実現するのを心待ちにしています！",
    images: [
      "../assets/karino-milk.png",
      "../assets/nasuno-tsutsuji.png",
      "../assets/otawara-chika.png"
    ],
    visibility: "supporter",
    likesCount: 45,
    commentsCount: 4,
    createdAt: "2026-09-14 16:20",
    status: "active"
  }
];

// 初期コメントデータ
const INITIAL_COMMENTS = {
  "POST_DEMO_001": [
    {
      id: "C_001",
      authorId: "GG-FAN-884920",
      authorName: "ご縁巡礼者",
      authorPlan: "free",
      content: "写真とても綺麗ですね！今週末に高福寺に行ってみたくなりました！",
      createdAt: "2026-09-17 15:10"
    },
    {
      id: "C_002",
      authorId: "GG-FAN-551920",
      authorName: "くるみ推し鉄",
      authorPlan: "supporter",
      content: "和紙の御朱印、実物見ると本当に品があって素敵ですよね。",
      createdAt: "2026-09-17 16:40"
    }
  ],
  "POST_DEMO_002": [
    {
      id: "C_003",
      authorId: "GG-FAN-773821",
      authorName: "大俵の弓師",
      authorPlan: "supporter",
      content: "駅西口からすぐなのは巡礼組には本当に助かりますよね！くるみちゃんキーホルダー可愛い！",
      createdAt: "2026-09-16 20:05"
    }
  ]
};

/**
 * ご縁ひろば管理クラス (HirobaManager)
 */
class HirobaManager {
  constructor(memberManager) {
    this.memberMgr = memberManager;
    this.filter = {
      category: "all",
      characterId: "all",
      region: "all",
      savedOnly: false
    };
    this.page = 1;
    this.pageSize = 20;
    this.tempUploadedImages = []; // 投稿用アップロード済みBase64画像
    this.lang = localStorage.getItem("goen_lang") || "ja";
    this.initStorage();
  }

  setLanguage(lang) {
    this.lang = (lang === "en") ? "en" : "ja";
    this.render();
  }

  initStorage() {
    // 投稿データ初期化
    if (!localStorage.getItem(HIROBA_KEYS.POSTS)) {
      localStorage.setItem(HIROBA_KEYS.POSTS, JSON.stringify(INITIAL_HIROBA_POSTS));
    }
    // いいねデータ初期化
    if (!localStorage.getItem(HIROBA_KEYS.LIKES)) {
      localStorage.setItem(HIROBA_KEYS.LIKES, JSON.stringify({
        "POST_OFFICIAL_001": ["GG-FAN-884920", "GG-FAN-102938"],
        "POST_DEMO_001": ["GG-FAN-884920"]
      }));
    }
    // コメントデータ初期化
    if (!localStorage.getItem(HIROBA_KEYS.COMMENTS)) {
      localStorage.setItem(HIROBA_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    }
    // 保存データ初期化
    if (!localStorage.getItem(HIROBA_KEYS.SAVES)) {
      localStorage.setItem(HIROBA_KEYS.SAVES, JSON.stringify({
        "GG-FAN-884920": ["POST_DEMO_001"]
      }));
    }
    // 通報データ初期化
    if (!localStorage.getItem(HIROBA_KEYS.REPORTS)) {
      localStorage.setItem(HIROBA_KEYS.REPORTS, JSON.stringify([]));
    }
    // ブロックデータ初期化
    if (!localStorage.getItem(HIROBA_KEYS.BLOCKS)) {
      localStorage.setItem(HIROBA_KEYS.BLOCKS, JSON.stringify({}));
    }
    // ルール同意初期化
    if (!localStorage.getItem(HIROBA_KEYS.RULE_AGREED)) {
      localStorage.setItem(HIROBA_KEYS.RULE_AGREED, JSON.stringify({}));
    }
    // ガイド表示初期化
    if (!localStorage.getItem(HIROBA_KEYS.GUIDE_SEEN)) {
      localStorage.setItem(HIROBA_KEYS.GUIDE_SEEN, JSON.stringify({}));
    }
  }

  // データ取得
  getPosts() {
    try {
      return JSON.parse(localStorage.getItem(HIROBA_KEYS.POSTS)) || [];
    } catch (e) {
      return [];
    }
  }

  savePosts(posts) {
    localStorage.setItem(HIROBA_KEYS.POSTS, JSON.stringify(posts));
  }

  getLikes() {
    try {
      return JSON.parse(localStorage.getItem(HIROBA_KEYS.LIKES)) || {};
    } catch (e) {
      return {};
    }
  }

  saveLikes(likes) {
    localStorage.setItem(HIROBA_KEYS.LIKES, JSON.stringify(likes));
  }

  getComments() {
    try {
      return JSON.parse(localStorage.getItem(HIROBA_KEYS.COMMENTS)) || {};
    } catch (e) {
      return {};
    }
  }

  saveComments(comments) {
    localStorage.setItem(HIROBA_KEYS.COMMENTS, JSON.stringify(comments));
  }

  getSaves() {
    try {
      return JSON.parse(localStorage.getItem(HIROBA_KEYS.SAVES)) || {};
    } catch (e) {
      return {};
    }
  }

  saveSaves(saves) {
    localStorage.setItem(HIROBA_KEYS.SAVES, JSON.stringify(saves));
  }

  getBlocks() {
    try {
      return JSON.parse(localStorage.getItem(HIROBA_KEYS.BLOCKS)) || {};
    } catch (e) {
      return {};
    }
  }

  saveBlocks(blocks) {
    localStorage.setItem(HIROBA_KEYS.BLOCKS, JSON.stringify(blocks));
  }

  getReports() {
    try {
      return JSON.parse(localStorage.getItem(HIROBA_KEYS.REPORTS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveReports(reports) {
    localStorage.setItem(HIROBA_KEYS.REPORTS, JSON.stringify(reports));
  }

  // 現在のユーザー情報
  getCurrentMember() {
    return this.memberMgr ? this.memberMgr.member : {
      memberId: "GG-FAN-884920",
      nickname: "ご縁巡礼者",
      plan: "free"
    };
  }

  // いいね判定
  isLiked(postId) {
    const member = this.getCurrentMember();
    const likes = this.getLikes();
    const list = likes[postId] || [];
    return list.includes(member.memberId);
  }

  // いいね切り替え（トグル）
  toggleLike(postId) {
    const member = this.getCurrentMember();
    const likes = this.getLikes();
    let list = likes[postId] || [];
    let isNowLiked = false;

    if (list.includes(member.memberId)) {
      list = list.filter(id => id !== member.memberId);
      isNowLiked = false;
    } else {
      list.push(member.memberId);
      isNowLiked = true;
    }
    likes[postId] = list;
    this.saveLikes(likes);

    // 投稿のlikesCountを同期
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likesCount = list.length;
      this.savePosts(posts);
    }
    return { isLiked: isNowLiked, count: list.length };
  }

  // 保存判定
  isSaved(postId) {
    const member = this.getCurrentMember();
    const saves = this.getSaves();
    const list = saves[member.memberId] || [];
    return list.includes(postId);
  }

  // 保存切り替え（トグル）
  toggleSave(postId) {
    const member = this.getCurrentMember();
    const saves = this.getSaves();
    let list = saves[member.memberId] || [];
    let isNowSaved = false;

    if (list.includes(postId)) {
      list = list.filter(id => id !== postId);
      isNowSaved = false;
    } else {
      list.push(postId);
      isNowSaved = true;
    }
    saves[member.memberId] = list;
    this.saveSaves(saves);
    return isNowSaved;
  }

  // ブロック
  blockUser(authorId, authorName) {
    const member = this.getCurrentMember();
    if (authorId === member.memberId) {
      alert("ご自身をブロックすることはできません。");
      return;
    }
    if (confirm(`「${authorName}」さんをブロックしますか？\nブロックすると、このユーザーの投稿とコメントが表示されなくなります。`)) {
      const blocks = this.getBlocks();
      let list = blocks[member.memberId] || [];
      if (!list.includes(authorId)) {
        list.push(authorId);
        blocks[member.memberId] = list;
        this.saveBlocks(blocks);
      }
      alert(`「${authorName}」さんをブロックしました。`);
      this.render();
    }
  }

  // 通報
  submitReport(postId, reason, detail) {
    const member = this.getCurrentMember();
    const reports = this.getReports();
    const newReport = {
      id: "REP_" + Date.now(),
      postId: postId,
      reporterId: member.memberId,
      reason: reason,
      detail: detail || "",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "pending"
    };
    reports.push(newReport);
    this.saveReports(reports);
    return true;
  }

  // コメント追加
  addComment(postId, content) {
    if (!content || !content.trim()) return null;
    const member = this.getCurrentMember();
    const comments = this.getComments();
    const list = comments[postId] || [];
    const newComment = {
      id: "COMM_" + Date.now(),
      authorId: member.memberId,
      authorName: member.nickname,
      authorPlan: member.plan,
      content: content.trim(),
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    list.push(newComment);
    comments[postId] = list;
    this.saveComments(comments);

    // 投稿のcommentsCountを更新
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount = list.length;
      this.savePosts(posts);
    }
    return newComment;
  }

  // 新規投稿作成
  createPost(postData) {
    const member = this.getCurrentMember();
    const posts = this.getPosts();

    const newPost = {
      id: "POST_" + Date.now(),
      authorId: member.memberId,
      authorName: member.nickname,
      authorPlan: member.plan,
      isOfficial: false,
      category: postData.category || "trip",
      characterId: postData.characterId || "all",
      characterName: postData.characterName || "全キャラクター",
      facilityId: postData.facilityId || null,
      facilityName: postData.facilityName || "",
      goodsId: postData.goodsId || null,
      goodsName: postData.goodsName || "",
      region: postData.region || "栃木県",
      title: postData.title || "",
      content: postData.content,
      images: postData.images || [],
      visibility: postData.visibility || "public", // "public" | "supporter"
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "active"
    };

    posts.unshift(newPost);
    this.savePosts(posts);
    return newPost;
  }

  // ルール同意確認
  hasAgreedRule() {
    const member = this.getCurrentMember();
    try {
      const agreedMap = JSON.parse(localStorage.getItem(HIROBA_KEYS.RULE_AGREED)) || {};
      return !!agreedMap[member.memberId];
    } catch (e) {
      return false;
    }
  }

  setRuleAgreed() {
    const member = this.getCurrentMember();
    const agreedMap = JSON.parse(localStorage.getItem(HIROBA_KEYS.RULE_AGREED)) || {};
    agreedMap[member.memberId] = { agreed: true, date: new Date().toISOString() };
    localStorage.setItem(HIROBA_KEYS.RULE_AGREED, JSON.stringify(agreedMap));
  }

  // 初回ガイド表示判定
  hasSeenGuide() {
    const member = this.getCurrentMember();
    try {
      const guideMap = JSON.parse(localStorage.getItem(HIROBA_KEYS.GUIDE_SEEN)) || {};
      return !!guideMap[member.memberId];
    } catch (e) {
      return false;
    }
  }

  setGuideSeen() {
    const member = this.getCurrentMember();
    const guideMap = JSON.parse(localStorage.getItem(HIROBA_KEYS.GUIDE_SEEN)) || {};
    guideMap[member.memberId] = true;
    localStorage.setItem(HIROBA_KEYS.GUIDE_SEEN, JSON.stringify(guideMap));
  }

  // フィルタリングした投稿一覧を取得
  getFilteredPosts() {
    const member = this.getCurrentMember();
    const blocks = this.getBlocks();
    const userBlocks = blocks[member.memberId] || [];
    const saves = this.getSaves();
    const userSaves = saves[member.memberId] || [];

    let posts = this.getPosts().filter(p => {
      // 削除・モデレーション非表示
      if (p.status === "hidden") return false;
      // ブロックしたユーザーの投稿は除外
      if (userBlocks.includes(p.authorId)) return false;
      return true;
    });

    // 保存のみフィルター
    if (this.filter.savedOnly) {
      posts = posts.filter(p => userSaves.includes(p.id));
    }

    // 話題フィルター
    if (this.filter.category !== "all") {
      posts = posts.filter(p => p.category === this.filter.category);
    }

    // キャラクターフィルター
    if (this.filter.characterId !== "all") {
      posts = posts.filter(p => p.characterId === this.filter.characterId || p.characterName.includes(this.filter.characterId));
    }

    // 地域フィルター
    if (this.filter.region !== "all") {
      posts = posts.filter(p => p.region.includes(this.filter.region));
    }

    return posts;
  }

  // メインレンダリング
  render() {
    const container = document.getElementById("posts-container");
    if (!container) return;

    const member = this.getCurrentMember();
    const posts = this.getFilteredPosts();

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="hiroba-empty-box">
          <div style="font-size: 36px; margin-bottom: 8px;">🌸</div>
          <p style="font-weight: 700; color: var(--navy); margin-bottom: 4px;">該当する投稿がまだありません</p>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
            ${this.filter.savedOnly ? '保存した投稿はまだありません。気になる投稿の「保存」ボタンを押してみましょう！' : 'あなたの旅の思い出や推しガール自慢を、一番乗りで投稿してみませんか？'}
          </p>
          <button class="btn-primary" onclick="hiroba.openPostModal()" style="font-size: 13px; padding: 8px 18px;">
            ✍️ 最初の思い出を投稿する
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.renderPostCard(post, member)).join("");

    // イベントバインド
    this.bindPostEvents(container);
  }

  // 投稿カードHTML生成
  renderPostCard(post, currentMember) {
    const cat = HIROBA_CATEGORIES[post.category] || HIROBA_CATEGORIES.trip;
    const isLiked = this.isLiked(post.id);
    const isSaved = this.isSaved(post.id);
    const isAuthor = (post.authorId === currentMember.memberId);

    // 会員限定投稿のロック判定
    const isLocked = (post.visibility === "supporter" && currentMember.plan === "free" && !isAuthor && !post.isOfficial);

    const isEn = (this.lang === "en");

    // プランバッジ
    let planBadge = "";
    if (post.isOfficial) {
      planBadge = `<span class="hiroba-plan-badge official">${isEn ? 'Official Staff' : '公式運営'}</span>`;
    } else if (post.authorPlan === "cocreation") {
      planBadge = `<span class="hiroba-plan-badge cocreation">${isEn ? 'Co-Creation' : '共創会員'}</span>`;
    } else if (post.authorPlan === "supporter") {
      planBadge = `<span class="hiroba-plan-badge supporter">${isEn ? 'Supporter' : '応援会員'}</span>`;
    } else {
      planBadge = `<span class="hiroba-plan-badge free">${isEn ? 'Free Member' : '無料会員'}</span>`;
    }

    // 画像ギャラリーHTML
    let imagesHtml = "";
    if (post.images && post.images.length > 0) {
      if (isLocked) {
        imagesHtml = `
          <div class="hiroba-images-grid grid-${Math.min(post.images.length, 4)} locked-blur">
            <img src="${post.images[0]}" alt="限定写真" class="hiroba-post-img" style="filter: blur(12px);">
            <div class="hiroba-lock-overlay">
              <span style="font-size: 20px;">🔒</span>
              <span style="font-size: 12px; font-weight: 700;">応援会員・共創会員限定の写真です</span>
            </div>
          </div>
        `;
      } else {
        imagesHtml = `
          <div class="hiroba-images-grid grid-${Math.min(post.images.length, 4)}">
            ${post.images.map((img, idx) => `
              <div class="hiroba-img-wrapper" onclick="hiroba.openLightbox('${post.id}', ${idx})">
                <img src="${img}" alt="投稿写真" class="hiroba-post-img" loading="lazy">
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    // 本文（ロック時は冒頭のみ＋案内）
    let contentHtml = "";
    if (isLocked) {
      const truncated = post.content.substring(0, 60) + "……";
      contentHtml = `
        <div class="hiroba-post-body" style="position: relative;">
          <p style="white-space: pre-wrap; margin-bottom: 8px;">${this.escapeHtml(truncated)}</p>
          <div class="hiroba-locked-box">
            <div style="font-weight: 700; font-size: 13px; color: #b01b4c; margin-bottom: 4px;">
              🔒 応援会員・共創会員 限定公開の投稿です
            </div>
            <p style="font-size: 12px; color: #555; margin-bottom: 10px;">
              月額480円（応援会員）にご加入いただくと、限定投稿の全文・高画質写真・制作裏話をすべてご覧いただけます。
            </p>
            <button class="btn-primary" style="font-size: 12px; padding: 6px 16px;" onclick="document.getElementById('section-plans').scrollIntoView({behavior: 'smooth'})">
              会員プランを見る (¥480/月〜)
            </button>
          </div>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="hiroba-post-body">
          ${post.title ? `<div class="hiroba-post-title">${this.escapeHtml(post.title)}</div>` : ''}
          <p style="white-space: pre-wrap;">${this.escapeHtml(post.content)}</p>
        </div>
      `;
    }

    // 関連タグ（施設、キャラ、グッズ）
    let tagsHtml = `<span class="hiroba-tag-item category" style="background: ${cat.color}15; color: ${cat.color}; border-color: ${cat.color}30;">${cat.icon} ${cat.label}</span>`;
    if (post.characterName && post.characterName !== "全キャラクター") {
      tagsHtml += `<span class="hiroba-tag-item character">🌸 ${post.characterName}</span>`;
    }
    if (post.facilityName) {
      tagsHtml += `<span class="hiroba-tag-item facility" onclick="hiroba.filterByFacility('${post.facilityName}')">📍 ${post.facilityName}</span>`;
    }
    if (post.goodsName) {
      tagsHtml += `<span class="hiroba-tag-item goods" onclick="document.getElementById('section-goods-collection').scrollIntoView({behavior: 'smooth'})">🛍️ ${post.goodsName}</span>`;
    }
    if (post.region && post.region !== "全国") {
      tagsHtml += `<span class="hiroba-tag-item region">🚩 ${post.region}</span>`;
    }

    return `
      <article class="hiroba-card ${post.isOfficial ? 'official-card' : ''}" id="card-${post.id}">
        <!-- ヘッダー -->
        <div class="hiroba-card-header">
          <div class="hiroba-author-info">
            <div class="hiroba-author-avatar">
              ${post.isOfficial ? '🌸' : '👤'}
            </div>
            <div>
              <div class="hiroba-author-name-row">
                <span class="hiroba-author-name">${this.escapeHtml(post.authorName)}</span>
                ${planBadge}
              </div>
              <div class="hiroba-post-meta">
                <time>${post.createdAt}</time>
                ${post.visibility === "supporter" ? '<span class="hiroba-vis-tag">会員限定</span>' : ''}
              </div>
            </div>
          </div>

          <!-- その他メニュー（通報・ブロック） -->
          <div class="hiroba-card-menu">
            <button class="hiroba-btn-dots" onclick="hiroba.toggleCardMenu('${post.id}')" title="メニュー">⋯</button>
            <div class="hiroba-dropdown-menu" id="menu-${post.id}" style="display: none;">
              ${!isAuthor && !post.isOfficial ? `
                <button onclick="hiroba.openReportModal('${post.id}')">🚩 投稿を通報する</button>
                <button onclick="hiroba.blockUser('${post.authorId}', '${this.escapeHtml(post.authorName)}')">🚫 このユーザーをブロック</button>
              ` : ''}
              ${isAuthor ? `
                <button onclick="hiroba.deletePost('${post.id}')" style="color: #de350b;">🗑️ 投稿を削除する</button>
              ` : ''}
              <button onclick="hiroba.copyPostLink('${post.id}')">🔗 リンクをコピー</button>
            </div>
          </div>
        </div>

        <!-- タグ -->
        <div class="hiroba-tags-row">
          ${tagsHtml}
        </div>

        <!-- 本文 -->
        ${contentHtml}

        <!-- 画像ギャラリー -->
        ${imagesHtml}

        <!-- アクションバー（いいね、コメント、保存、シェア） -->
        <div class="hiroba-actions-bar">
          <button class="hiroba-btn-action ${isLiked ? 'active' : ''}" onclick="hiroba.handleLike('${post.id}')" id="btn-like-${post.id}">
            <span class="hiroba-action-icon">${isLiked ? '❤️' : '🤍'}</span>
            <span class="hiroba-action-text">${isEn ? 'Like' : 'いいね'}</span>
            <span class="hiroba-count" id="count-like-${post.id}">${post.likesCount}</span>
          </button>

          <button class="hiroba-btn-action" onclick="hiroba.toggleCommentSection('${post.id}')" id="btn-comm-${post.id}">
            <span class="hiroba-action-icon">💬</span>
            <span class="hiroba-action-text">${isEn ? 'Comment' : 'コメント'}</span>
            <span class="hiroba-count" id="count-comm-${post.id}">${post.commentsCount}</span>
          </button>

          <button class="hiroba-btn-action ${isSaved ? 'active' : ''}" onclick="hiroba.handleSave('${post.id}')" id="btn-save-${post.id}">
            <span class="hiroba-action-icon">${isSaved ? '🔖' : '📑'}</span>
            <span class="hiroba-action-text">${isSaved ? (isEn ? 'Saved' : '保存済み') : (isEn ? 'Save' : '保存')}</span>
          </button>
        </div>

        <!-- コメントセクション -->
        <div class="hiroba-comment-section" id="comments-${post.id}" style="display: none;">
          <div class="hiroba-comment-list" id="comment-list-${post.id}">
            <!-- コメント一覧を動的生成 -->
          </div>
          <div class="hiroba-comment-form">
            <input type="text" class="hiroba-comment-input" id="input-comm-${post.id}" placeholder="${isEn ? 'Write a friendly comment... (max 500 chars)' : '温かいコメントを書き込もう…（最大500文字）'}" maxlength="500">
            <button class="hiroba-comment-submit" onclick="hiroba.submitComment('${post.id}')">${isEn ? 'Send' : '送信'}</button>
          </div>
        </div>
      </article>
    `;
  }

  // イベントバインド
  bindPostEvents(container) {
    // ドロップダウンメニュー外クリックで閉じる
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".hiroba-card-menu")) {
        document.querySelectorAll(".hiroba-dropdown-menu").forEach(m => m.style.display = "none");
      }
    });
  }

  // メニュー開閉
  toggleCardMenu(postId) {
    const menu = document.getElementById(`menu-${postId}`);
    if (!menu) return;
    const isShown = menu.style.display === "block";
    document.querySelectorAll(".hiroba-dropdown-menu").forEach(m => m.style.display = "none");
    menu.style.display = isShown ? "none" : "block";
  }

  // いいね処理
  handleLike(postId) {
    const res = this.toggleLike(postId);
    const btn = document.getElementById(`btn-like-${postId}`);
    const countEl = document.getElementById(`count-like-${postId}`);
    if (btn && countEl) {
      if (res.isLiked) {
        btn.classList.add("active");
        btn.querySelector(".hiroba-action-icon").textContent = "❤️";
      } else {
        btn.classList.remove("active");
        btn.querySelector(".hiroba-action-icon").textContent = "🤍";
      }
      countEl.textContent = res.count;
    }
  }

  // 保存処理
  handleSave(postId) {
    const isSaved = this.toggleSave(postId);
    const btn = document.getElementById(`btn-save-${postId}`);
    if (btn) {
      if (isSaved) {
        btn.classList.add("active");
        btn.querySelector(".hiroba-action-icon").textContent = "🔖";
        btn.querySelector(".hiroba-action-text").textContent = "保存済み";
      } else {
        btn.classList.remove("active");
        btn.querySelector(".hiroba-action-icon").textContent = "📑";
        btn.querySelector(".hiroba-action-text").textContent = "保存";
      }
    }
    // 保存フィルター有効時は再描画
    if (this.filter.savedOnly) {
      this.render();
    }
  }

  // コメントセクション開閉
  toggleCommentSection(postId) {
    const section = document.getElementById(`comments-${postId}`);
    if (!section) return;
    const isHidden = section.style.display === "none";
    if (isHidden) {
      this.renderComments(postId);
      section.style.display = "block";
      const input = document.getElementById(`input-comm-${postId}`);
      if (input) input.focus();
    } else {
      section.style.display = "none";
    }
  }

  // コメント一覧レンダリング
  renderComments(postId) {
    const listEl = document.getElementById(`comment-list-${postId}`);
    if (!listEl) return;

    const comments = this.getComments();
    const list = comments[postId] || [];

    if (list.length === 0) {
      listEl.innerHTML = `<div style="font-size: 12px; color: #888; text-align: center; padding: 12px;">まだコメントはありません。最初のコメントを残してみませんか？</div>`;
      return;
    }

    listEl.innerHTML = list.map(c => `
      <div class="hiroba-comment-item">
        <div class="hiroba-comm-author">
          <strong>${this.escapeHtml(c.authorName)}</strong>
          <small>${c.createdAt}</small>
        </div>
        <div class="hiroba-comm-content">${this.escapeHtml(c.content)}</div>
      </div>
    `).join("");
  }

  // コメント投稿送信
  submitComment(postId) {
    const input = document.getElementById(`input-comm-${postId}`);
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
      alert("コメントを入力してください。");
      return;
    }

    const newComment = this.addComment(postId, val);
    if (newComment) {
      input.value = "";
      this.renderComments(postId);
      const countEl = document.getElementById(`count-comm-${postId}`);
      if (countEl) {
        const comments = this.getComments();
        countEl.textContent = (comments[postId] || []).length;
      }
    }
  }

  // 投稿削除
  deletePost(postId) {
    if (!confirm("この投稿を削除しますか？\n削除すると元に戻せません。")) return;
    let posts = this.getPosts();
    posts = posts.filter(p => p.id !== postId);
    this.savePosts(posts);
    alert("投稿を削除しました。");
    this.render();
  }

  // リンクコピー
  copyPostLink(postId) {
    const url = window.location.origin + window.location.pathname + "#card-" + postId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert("投稿のリンクをコピーしました！");
      }).catch(() => {
        prompt("投稿のURLです。コピーしてご利用ください:", url);
      });
    } else {
      prompt("投稿のURLです。コピーしてご利用ください:", url);
    }
  }

  // 施設フィルター
  filterByFacility(facName) {
    this.filter.category = "all";
    this.filter.characterId = "all";
    this.filter.region = "all";
    this.filter.savedOnly = false;
    // タグバーのUI更新
    const tagBar = document.getElementById("community-tag-bar");
    if (tagBar) {
      tagBar.querySelectorAll(".tag-chip").forEach(c => c.classList.remove("active"));
      const allChip = tagBar.querySelector('[data-tag="all"]');
      if (allChip) allChip.classList.add("active");
    }
    const posts = this.getPosts().filter(p => p.facilityName === facName);
    const container = document.getElementById("posts-container");
    if (container) {
      container.innerHTML = `
        <div style="background: #eef5fb; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
          <span>📍 <strong>${facName}</strong> の投稿（${posts.length}件）</span>
          <button class="btn-secondary" style="font-size: 11px; padding: 3px 8px;" onclick="hiroba.resetFilter()">すべての投稿に戻る</button>
        </div>
      ` + posts.map(p => this.renderPostCard(p, this.getCurrentMember())).join("");
    }
  }

  resetFilter() {
    this.filter = { category: "all", characterId: "all", region: "all", savedOnly: false };
    this.render();
  }

  // 投稿モーダルオープン
  openPostModal() {
    // 初回ルール同意確認
    if (!this.hasAgreedRule()) {
      this.openRuleModal();
      return;
    }

    const modal = document.getElementById("modal-hiroba-post");
    if (!modal) return;

    // フォームリセット
    this.tempUploadedImages = [];
    this.renderImagePreviews();
    const form = document.getElementById("form-hiroba-post");
    if (form) form.reset();
    document.getElementById("hiroba-post-counter").textContent = "0 / 1000";

    modal.style.display = "grid";
  }

  // ルール同意モーダルオープン
  openRuleModal() {
    const modal = document.getElementById("modal-hiroba-rule");
    if (modal) modal.style.display = "grid";
  }

  agreeRuleAndContinue() {
    this.setRuleAgreed();
    const modal = document.getElementById("modal-hiroba-rule");
    if (modal) modal.style.display = "none";
    this.openPostModal();
  }

  // 初回ガイドモーダルオープン
  openGuideModal() {
    const modal = document.getElementById("modal-hiroba-guide");
    if (modal) {
      this.currentGuideStep = 1;
      this.updateGuideStepUI();
      modal.style.display = "grid";
    }
  }

  nextGuideStep() {
    if (this.currentGuideStep < 3) {
      this.currentGuideStep++;
      this.updateGuideStepUI();
    } else {
      this.closeGuideModal();
    }
  }

  prevGuideStep() {
    if (this.currentGuideStep > 1) {
      this.currentGuideStep--;
      this.updateGuideStepUI();
    }
  }

  closeGuideModal() {
    const chk = document.getElementById("chk-hide-guide");
    if (chk && chk.checked) {
      this.setGuideSeen();
    }
    const modal = document.getElementById("modal-hiroba-guide");
    if (modal) modal.style.display = "none";
  }

  updateGuideStepUI() {
    for (let i = 1; i <= 3; i++) {
      const stepEl = document.getElementById(`guide-step-${i}`);
      const dotEl = document.getElementById(`guide-dot-${i}`);
      if (stepEl) stepEl.style.display = (i === this.currentGuideStep) ? "block" : "none";
      if (dotEl) {
        if (i === this.currentGuideStep) dotEl.classList.add("active");
        else dotEl.classList.remove("active");
      }
    }
    const btnNext = document.getElementById("btn-guide-next");
    const btnPrev = document.getElementById("btn-guide-prev");
    if (btnNext) {
      btnNext.textContent = (this.currentGuideStep === 3) ? "ひろばへ進む 🚀" : "次へ ❯";
    }
    if (btnPrev) {
      btnPrev.style.visibility = (this.currentGuideStep === 1) ? "hidden" : "visible";
    }
  }

  // 通報モーダル
  openReportModal(postId) {
    const modal = document.getElementById("modal-hiroba-report");
    if (!modal) return;
    document.getElementById("report-target-post-id").value = postId;
    document.getElementById("report-detail-input").value = "";
    modal.style.display = "grid";
  }

  submitReportFromModal() {
    const postId = document.getElementById("report-target-post-id").value;
    const reason = document.getElementById("report-reason-select").value;
    const detail = document.getElementById("report-detail-input").value.trim();

    this.submitReport(postId, reason, detail);
    alert("通報を受付いたしました。\nご縁ガール運営事務局にて内容を確認のうえ、必要に応じて適切な対応を実施いたします。ご協力に感謝申し上げます。");
    document.getElementById("modal-hiroba-report").style.display = "none";
  }

  // 画像アップロード処理（最大4枚・リサイズ＆Exif削除シミュレーション）
  handleImageUpload(input) {
    const files = Array.from(input.files);
    if (!files.length) return;

    if (this.tempUploadedImages.length + files.length > 4) {
      alert("写真は最大4枚まで添付できます。");
      return;
    }

    files.forEach(file => {
      // 簡易画像リサイズ (最大幅1200px) & Exif削除
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          // JPEG圧縮してBase64取得（Exifはcanvas再描画により自動除去）
          const base64 = canvas.toDataURL("image/jpeg", 0.85);
          this.tempUploadedImages.push(base64);
          this.renderImagePreviews();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
    input.value = "";
  }

  renderImagePreviews() {
    const container = document.getElementById("hiroba-img-preview-container");
    if (!container) return;

    container.innerHTML = this.tempUploadedImages.map((src, idx) => `
      <div class="hiroba-preview-thumb">
        <img src="${src}" alt="プレビュー">
        <button type="button" class="btn-remove-thumb" onclick="hiroba.removeImage(${idx})">&times;</button>
      </div>
    `).join("");

    const addBtn = document.getElementById("btn-hiroba-add-img");
    if (addBtn) {
      addBtn.style.display = (this.tempUploadedImages.length >= 4) ? "none" : "inline-flex";
    }
  }

  removeImage(idx) {
    this.tempUploadedImages.splice(idx, 1);
    this.renderImagePreviews();
  }

  // ライトボックス（拡大表示）
  openLightbox(postId, imgIdx) {
    const post = this.getPosts().find(p => p.id === postId);
    if (!post || !post.images || !post.images[imgIdx]) return;

    let lb = document.getElementById("hiroba-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "hiroba-lightbox";
      lb.className = "hiroba-lightbox-backdrop";
      lb.innerHTML = `
        <div class="hiroba-lightbox-content">
          <img id="hiroba-lightbox-img" src="" alt="拡大写真">
          <button class="hiroba-lightbox-close" onclick="document.getElementById('hiroba-lightbox').style.display='none'">&times;</button>
        </div>
      `;
      document.body.appendChild(lb);
      lb.onclick = (e) => {
        if (e.target === lb) lb.style.display = "none";
      };
    }
    document.getElementById("hiroba-lightbox-img").src = post.images[imgIdx];
    lb.style.display = "flex";
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// グローバル初期化ヘルパー
let hiroba = null;

function initHiroba(memberManager) {
  hiroba = new HirobaManager(memberManager);
  window.hiroba = hiroba;

  // 初回訪問ガイドの自動判定（未読の場合に表示）
  if (!hiroba.hasSeenGuide()) {
    setTimeout(() => {
      hiroba.openGuideModal();
    }, 800);
  }

  hiroba.render();
  setupHirobaUI();
}

/**
 * UIコントロールとフォームリスナーの初期化
 */
function setupHirobaUI() {
  // カテゴリチップ切り替え
  const catChips = document.querySelectorAll(".hiroba-cat-chip");
  catChips.forEach(chip => {
    chip.onclick = () => {
      catChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.dataset.cat;
      hiroba.filter.category = cat;
      hiroba.render();
    };
  });

  // キャラクターセレクト切り替え
  const charSelect = document.getElementById("hiroba-filter-char");
  if (charSelect) {
    charSelect.onchange = () => {
      hiroba.filter.characterId = charSelect.value;
      hiroba.render();
    };
  }

  // 地域セレクト切り替え
  const regionSelect = document.getElementById("hiroba-filter-region");
  if (regionSelect) {
    regionSelect.onchange = () => {
      hiroba.filter.region = regionSelect.value;
      hiroba.render();
    };
  }

  // 保存した投稿のみトグル
  const btnSavedToggle = document.getElementById("btn-hiroba-saved-toggle");
  if (btnSavedToggle) {
    btnSavedToggle.onclick = () => {
      hiroba.filter.savedOnly = !hiroba.filter.savedOnly;
      if (hiroba.filter.savedOnly) {
        btnSavedToggle.classList.add("active");
        btnSavedToggle.textContent = "🔖 保存済み投稿のみ表示中";
      } else {
        btnSavedToggle.classList.remove("active");
        btnSavedToggle.textContent = "🔖 保存した投稿を見る";
      }
      hiroba.render();
    };
  }

  // 投稿モーダル本文文字数カウンター
  const contentInput = document.getElementById("hiroba-post-content-input");
  const counterEl = document.getElementById("hiroba-post-counter");
  if (contentInput && counterEl) {
    contentInput.oninput = () => {
      const len = contentInput.value.length;
      counterEl.textContent = `${len} / 1000`;
      if (len > 1000) {
        counterEl.style.color = "#de350b";
      } else {
        counterEl.style.color = "var(--text-muted)";
      }
    };
  }

  // 投稿フォーム送信
  const formPost = document.getElementById("form-hiroba-post");
  if (formPost) {
    formPost.onsubmit = (e) => {
      e.preventDefault();
      const cat = document.getElementById("hiroba-post-category-select").value;
      const charName = document.getElementById("hiroba-post-char-select").value;
      const facility = document.getElementById("hiroba-post-spot-input").value.trim();
      const goods = document.getElementById("hiroba-post-goods-input").value.trim();
      const title = document.getElementById("hiroba-post-title-input").value.trim();
      const content = contentInput.value.trim();
      const visibility = document.querySelector('input[name="hiroba-visibility"]:checked').value;

      if (!content) {
        alert("投稿本文を入力してください。");
        return;
      }

      // 送信ボタン連打・二重送信防止
      const submitBtn = document.getElementById("btn-hiroba-submit-post");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "投稿中...";
      }

      setTimeout(() => {
        // キャラクターから地域を判定
        let region = "栃木県";
        if (charName === "狩野くるみ") region = "那須塩原市";
        else if (charName === "那須乃つつじ") region = "那須町";
        else if (charName === "大俵ちか") region = "大田原市";

        hiroba.createPost({
          category: cat,
          characterId: charName,
          characterName: charName,
          facilityName: facility,
          goodsName: goods,
          region: region,
          title: title,
          content: content,
          images: [...hiroba.tempUploadedImages],
          visibility: visibility
        });

        document.getElementById("modal-hiroba-post").style.display = "none";
        formPost.reset();
        hiroba.tempUploadedImages = [];
        hiroba.renderImagePreviews();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "この内容で投稿する 🌸";
        }
        hiroba.render();
        alert("🎉 ご縁ひろばに思い出を投稿しました！\n全国のファンと旅のワクワクを分かち合いましょう！");
      }, 350);
    };
  }
}
