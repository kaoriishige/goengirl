// Portal Data Definition with Bilingual (JA / EN) Support
const PORTAL_DATA = {
  characters: [
    {
      id: "tsutsuji",
      name: "那須乃つつじ",
      nameEn: "Tsutsuji Nasuno",
      region: "栃木県 那須町",
      regionEn: "Nasu Town, Tochigi",
      color: "#e9588d",
      image: "../assets/nasuno-tsutsuji.png",
      lead: "九尾の狐伝説や殺生石の物語が語り継がれる歴史の町、那須町の守護少女。豊かな自然が育む絶品の那須和牛や濃厚なチーズ、フレッシュな高原牛乳など美味しいものには目がないグルメ少女。雄大な那須連山の自然と歴史の魅力を温かい笑顔で元気いっぱいお届けします。",
      leadEn: "The guardian girl of historic Nasu Town, famous for the Nine-Tailed Fox legend and Sessho-seki stone. A cheerful gourmet girl who loves Nasu wagyu beef, rich artisanal cheese, and fresh highland milk. She welcomes visitors to the breathtaking Nasu mountain range with a warm, beaming smile.",
      voiceText: "ご縁に感謝いたしますわ。那須の美しい自然と名湯で、心ゆくまで癒やされていってくださいね。",
      voiceTextEn: "Thank you for creating this fateful connection with Nasu! Please enjoy the serene hot springs and breathtaking highland nature.",
      birthday: "8月22日",
      birthdayEn: "Aug 22",
      hobby: "歴史探訪、カフェ巡り",
      hobbyEn: "Historic sights, visiting quaint cafes",
      specialty: "天気予報、乗馬",
      specialtyEn: "Weather forecasting, horseback riding",
      personality: "おっとりしていてマイペース。お嬢様っぽい上品さがあるが、猪突猛進なところがあり周囲を惹きつける愛されキャラ。",
      personalityEn: "Gentle, calm, and charmingly elegant with an adventurous foodie streak.",
      spotsCount: 2,
      goodsCount: 3
    },
    {
      id: "milk",
      name: "狩野くるみ",
      nameEn: "Kurumi Karino",
      region: "栃木県 那須塩原市",
      regionEn: "Nasushiobara City, Tochigi",
      color: "#1199c4",
      image: "../assets/karino-milk.png",
      lead: "自然豊かで生乳生産量本州一を誇る那須塩原市の守護ガール。牧場のミルクシェイクやチーズケーキ、ヤシオマスのお寿司が好物でどこにでも一人で出掛けてしまうアウトドア派。地元で2年に一度開催される花火大会をはじめ毎年恒例の多くのイベントを楽しみに日々の活動をしています。那須塩原の食や自然の魅力を全力で発信していきます。",
      leadEn: "The energetic guardian of Nasushiobara, renowned for Honshu's top raw milk production and historic hot springs. An outdoor enthusiast who loves farm-fresh milkshakes, cheesecakes, and local river trout sushi. She shares the vibrant culinary and natural charms of Shiobara with boundless enthusiasm.",
      voiceText: "今日も元気いっぱい行こう！那須塩原の美味しいミルクと温泉で、エネルギーチャージだよっ！",
      voiceTextEn: "Let's make today energetic and joyful! Recharge your soul with Nasushiobara's delicious milk and rejuvenating onsen!",
      birthday: "9月17日",
      birthdayEn: "Sep 17",
      hobby: "イベント巡り、キャンプ、お花観賞",
      hobbyEn: "Local festivals, camping, flower viewing",
      specialty: "お菓子作り、地元案内",
      specialtyEn: "Baking sweets, guiding travelers",
      personality: "活発的なアウトドア派。思い立ったらどこにでも出掛けてしまう反面、計画が立てられない。明るいタイプですぐに打ち解けるので友達が多い。",
      personalityEn: "Spontaneous, outdoorsy, and quick to make friends with anyone she meets.",
      spotsCount: 2,
      goodsCount: 3
    },
    {
      id: "chika",
      name: "大俵ちか",
      nameEn: "Chika Otawara",
      region: "栃木県 大田原市",
      regionEn: "Otawara City, Tochigi",
      color: "#c84127",
      image: "../assets/otawara-chika.png",
      lead: "大田原市の歴史を宿す守護少女。明るく一本気な性格で、一矢必中の精神を持つ努力家。地元名産の「お米」と「鮎の塩焼き」が大好物！「とうがらしソフト」を食べてるときは我を忘れて夢中になる。大俵のように皆に福を届けるため大田原市の魅力を元気に発信中。",
      leadEn: "The spirited guardian girl carrying the historic warrior heritage of Otawara. A determined achiever who embraces the samurai motto 'one shot, one bullseye.' She loves regional Otawara rice, salt-grilled sweetfish, and sweet-and-spicy chili ice cream, bringing fortune and good luck to everyone.",
      voiceText: "一矢必中！あなたとの出会いも、きっと素晴らしいご縁の矢が引き寄せたものですね！",
      voiceTextEn: "One shot, one bullseye! Meeting you today is surely an arrow of fate guiding our wonderful connection!",
      birthday: "7月12日",
      birthdayEn: "Jul 12",
      hobby: "グルメ旅、コスプレ、鮎釣り",
      hobbyEn: "Culinary tours, cosplay, sweetfish fishing",
      specialty: "効きとうがらし、早起き",
      specialtyEn: "Chili spice tasting, early riser",
      personality: "明るく一本気な努力家。打ち込みやすい反面回りが見えなくなる。",
      personalityEn: "Passionate, sincere, and hardworking, with an unwavering focus on bringing joy to visitors.",
      spotsCount: 2,
      goodsCount: 2
    }
  ],
  panels: [
    {
      id: "p1",
      title: "巫女装束Ver. 等身大パネル",
      titleEn: "Shrine Maiden Ver. Life-Sized Standee",
      character: "那須乃つつじ",
      characterEn: "Tsutsuji Nasuno",
      spotName: "高野山真言宗 高福寺",
      spotNameEn: "Kofukuji Temple (Koyasan Shingon Sect)",
      address: "栃木県那須郡那須町大字高久甲578",
      addressEn: "578 Takaku-ko, Nasu Town, Nasu District, Tochigi",
      image: "../assets/nasuno-tsutsuji.png",
      category: "等身大パネル",
      categoryEn: "Life-Sized Standee",
      isNew: true,
      description: "高野山真言宗 高福寺の社務所前に設置された等身大パネル。神聖な巫女装束を纏ったつつじちゃんが出迎えてくれます。",
      descriptionEn: "Located in front of the temple reception office at Kofukuji Temple. Tsutsuji welcomes you in sacred traditional shrine maiden attire."
    },
    {
      id: "p2",
      title: "フォーマルスーツVer. 等身大パネル",
      titleEn: "Hotel Uniform Ver. Life-Sized Standee",
      character: "狩野くるみ",
      characterEn: "Kurumi Karino",
      spotName: "那須ミッドシティホテル",
      spotNameEn: "Nasu Mid-City Hotel",
      address: "栃木県那須塩原市方京1-1-10",
      addressEn: "1-1-10 Hokyo, Nasushiobara City, Tochigi",
      image: "../assets/karino-milk.png",
      category: "等身大パネル",
      categoryEn: "Life-Sized Standee",
      isNew: true,
      description: "那須ミッドシティホテルのメインエントランスに設置。キリッとした制服スタイルのくるみちゃんと記念撮影が楽しめます。",
      descriptionEn: "Located at the main hotel lobby of Nasu Mid-City Hotel. Kurumi greets travelers in a smart hotel manager uniform."
    },
    {
      id: "p3",
      title: "那須与一弓道着Ver. 等身大パネル",
      titleEn: "Samurai Archer Kyudo Ver. Standee",
      character: "大俵ちか",
      characterEn: "Chika Otawara",
      spotName: "光丸山法輪寺",
      spotNameEn: "Mitsumaruyama Horinji Temple",
      address: "栃木県大田原市佐良土1401",
      addressEn: "1401 Sarado, Otawara City, Tochigi",
      image: "../assets/otawara-chika.png",
      category: "等身大パネル",
      categoryEn: "Life-Sized Standee",
      isNew: true,
      description: "扇の的を射抜いた那須与一の伝説にちなんだ、勇ましい弓道着姿の大俵ちか等身大パネルです。",
      descriptionEn: "Honoring the legendary samurai archer Nasu no Yoichi. Chika greets pilgrims in an elegant traditional archery uniform."
    },
    {
      id: "p4",
      title: "エプロンカフェVer. SDパネル",
      titleEn: "Cafe Apron Ver. Mini SD Standee",
      character: "那須乃つつじ",
      characterEn: "Tsutsuji Nasuno",
      spotName: "高野山真言宗 高福寺",
      spotNameEn: "Kofukuji Temple / Cafe Terrace",
      address: "栃木県那須郡那須町大字高久甲578",
      addressEn: "578 Takaku-ko, Nasu Town, Tochigi",
      image: "../assets/nasuno-tsutsuji.png",
      category: "SDパネル",
      categoryEn: "Mini SD Standee",
      isNew: false,
      description: "店内のテラス席近くにちょこんと設置されたミニSDパネル。カフェ巡りのお供にぴったりです。",
      descriptionEn: "A cute mini standee placed near the terrace seating. Perfect companion for enjoying sweets and tea."
    },
    {
      id: "p5",
      title: "温泉浴衣Ver. 等身大パネル",
      titleEn: "Hot Springs Yukata Ver. Standee",
      character: "狩野くるみ",
      characterEn: "Kurumi Karino",
      spotName: "那須ミッドシティホテル",
      spotNameEn: "Nasu Mid-City Hotel / Spa",
      address: "栃木県那須塩原市方京1-1-10",
      addressEn: "1-1-10 Hokyo, Nasushiobara City, Tochigi",
      image: "../assets/karino-milk.png",
      category: "等身大パネル",
      categoryEn: "Life-Sized Standee",
      isNew: false,
      description: "渓谷の絶景を望む野天風呂ロビーに設置。湯上がりに爽やかなくるみちゃんがお出迎えします。",
      descriptionEn: "Placed in the hot spring lounge. Kurumi greets bathers in a charming onsen yukata."
    }
  ],
  goods: [
    {
      id: "g1",
      name: "ご縁結び御朱印カード (那須乃つつじ)",
      nameEn: "Goen Shrine Stamp Card (Tsutsuji)",
      character: "那須乃つつじ",
      characterEn: "Tsutsuji Nasuno",
      spotName: "高野山真言宗 高福寺",
      spotNameEn: "Kofukuji Temple",
      price: 500,
      category: "御朱印風カード",
      categoryEn: "Shrine Stamp Card",
      image: "../assets/nasuno-tsutsuji.png",
      isNew: true,
      stockStatus: "好評販売中",
      stockStatusEn: "In Stock"
    },
    {
      id: "g2",
      name: "アクリルスタンド 巫女Ver. (那須乃つつじ)",
      nameEn: "Acrylic Stand Shrine Maiden Ver. (Tsutsuji)",
      character: "那須乃つつじ",
      characterEn: "Tsutsuji Nasuno",
      spotName: "高野山真言宗 高福寺 / ベルツ",
      spotNameEn: "Kofukuji Temple / Belz",
      price: 1500,
      category: "アクリルスタンド",
      categoryEn: "Acrylic Stand",
      image: "../assets/nasuno-tsutsuji.png",
      isNew: true,
      stockStatus: "残りわずか",
      stockStatusEn: "Low Stock"
    },
    {
      id: "g3",
      name: "くるみアイススプーン (狩野くるみ)",
      nameEn: "Kurumi Ice Cream Spoon (Kurumi)",
      character: "狩野くるみ",
      characterEn: "Kurumi Karino",
      spotName: "那須ミッドシティホテル",
      spotNameEn: "Nasu Mid-City Hotel",
      price: 600,
      category: "食器・雑貨",
      categoryEn: "Tableware & Goods",
      image: "../assets/karino-milk.png",
      isNew: true,
      stockStatus: "好評販売中",
      stockStatusEn: "In Stock"
    },
    {
      id: "g4",
      name: "アクリルキーホルダー スーツVer. (狩野くるみ)",
      nameEn: "Acrylic Keychain Hotel Suit Ver. (Kurumi)",
      character: "狩野くるみ",
      characterEn: "Kurumi Karino",
      spotName: "那須ミッドシティホテル / 田中屋",
      spotNameEn: "Nasu Mid-City Hotel / Tanakaya",
      price: 700,
      category: "キーホルダー",
      categoryEn: "Keychain",
      image: "../assets/karino-milk.png",
      isNew: true,
      stockStatus: "好評販売中",
      stockStatusEn: "In Stock"
    },
    {
      id: "g5",
      name: "与一の矢 アクリルチャーム (大俵ちか)",
      nameEn: "Archer's Arrow Charm (Chika)",
      character: "大俵ちか",
      characterEn: "Chika Otawara",
      spotName: "光丸山法輪寺",
      spotNameEn: "Mitsumaruyama Horinji Temple",
      price: 700,
      category: "チャーム",
      categoryEn: "Charm",
      image: "../assets/otawara-chika.png",
      isNew: true,
      stockStatus: "好評販売中",
      stockStatusEn: "In Stock"
    },
    {
      id: "g6",
      name: "ご縁結び缶バッジ 3種セット",
      nameEn: "Goen Button Badge 3-Piece Set",
      character: "3人集合",
      characterEn: "All 3 Characters",
      spotName: "各提携店舗・道の駅",
      spotNameEn: "All Partner Spots & Roadside Stations",
      price: 800,
      category: "缶バッジ",
      categoryEn: "Button Badge",
      image: "../assets/goen-girl-logo.png",
      isNew: false,
      stockStatus: "好評販売中",
      stockStatusEn: "In Stock"
    }
  ],
  collabs: [
    {
      id: "c1",
      title: "塩原温泉郷 ご縁めぐり宿泊プラン",
      titleEn: "Shiobara Onsen Sacred Goen Stay Plan",
      character: "狩野くるみ",
      characterEn: "Kurumi Karino",
      spotName: "那須ミッドシティホテル",
      spotNameEn: "Nasu Mid-City Hotel",
      image: "../assets/karino-milk.png",
      isNew: true,
      description: "宿泊者限定の「狩野くるみ 特製手ぬぐい＆限定ボイスカード」がもらえるスペシャル宿泊プランです。",
      descriptionEn: "Special accommodation package including exclusive Kurumi Karino Japanese hand towel and special voice message card."
    },
    {
      id: "c2",
      title: "九尾伝説カフェスイーツ コラボセット",
      titleEn: "Nine-Tailed Fox Sweets Cafe Set",
      character: "那須乃つつじ",
      characterEn: "Tsutsuji Nasuno",
      spotName: "高野山真言宗 高福寺",
      spotNameEn: "Kofukuji Temple",
      image: "../assets/nasuno-tsutsuji.png",
      isNew: true,
      description: "つつじちゃんの大好物チーズケーキとオリジナル木製コースターがセットになった限定カフェメニュー。",
      descriptionEn: "Limited cafe set featuring Tsutsuji's favorite Nasu cheesecake with a collectible wooden engraved coaster."
    },
    {
      id: "c3",
      title: "那須与一の郷 名物鮎塩焼き＆ご縁米キャンペーン",
      titleEn: "Samurai Heritage Sweetfish & Goen Rice Campaign",
      character: "大俵ちか",
      characterEn: "Chika Otawara",
      spotName: "光丸山法輪寺",
      spotNameEn: "Mitsumaruyama Horinji Temple",
      image: "../assets/otawara-chika.png",
      isNew: true,
      description: "レストランでお食事または特産品購入で、大俵ちか限定オリジナルステッカーをプレゼント！",
      descriptionEn: "Receive an exclusive Chika Otawara vinyl sticker when dining or purchasing local specialty rice and fish!"
    }
  ]
};

// Bilingual UI Text Dictionary for Portal
const PORTAL_I18N = {
  ja: {
    // Header & Nav
    announcementBadge: "新規入会特典",
    announcementText: "今なら無料会員登録で<strong>即時100pt ＆ 推しガールデジタル会員証</strong>をプレゼント中！",
    announcementLink: "10秒で無料登録する →",
    portalTitle: "ご縁ガール ポータル",
    portalTagline: "人とご縁で、日本を豊かに。公式巡礼ポータル",
    navBenefits: "会員特典",
    navRewards: "特典カタログ",
    navCharacters: "キャラクター",
    navPanels: "設置パネル",
    navGoods: "限定グッズ",
    navPlans: "料金プラン",
    navJoinBtn: "🎁 無料会員登録 (0円)",
    navMemberBtn: "会員マイページ ↗",
    breadcrumbHome: "ホーム（企業・店舗向けLP）",
    breadcrumbTop: "情報ポータル TOP",

    // Hero
    heroTag: "✿ 公式ファン支援・聖地巡礼サービス",
    heroHeading: "地域をめぐって、<br><span>推しとご縁</span>を結ぼう。",
    heroDesc: "栃木県の那須町・那須塩原市・大田原市をはじめ、全国の寺社や名所・老舗店舗に広がる「ご縁ガール」の世界。<br>現地に設置された等身大パネルで<strong>GPSチェックイン</strong>してポイント獲得！<br>集めたポイントで<strong>限定ボイスや特製壁紙</strong>を解放し、あなただけの巡礼スタンプ帳を完成させよう。",
    heroJoinBtn: "🎁 今すぐ無料で会員証を発行する (100pt進呈)",
    heroBenefitsBtn: "🔍 無料会員でできること",
    passPreviewTitle: "🎴 デジタル会員証プレビュー",
    passOwnerDefault: "ご縁巡礼者 様",
    passPtsLabel: "HOLDING POINTS",
    passOshiLabel: "推し: ",
    passBalloonTitle: "無料登録でこの会員証がすぐ届く！",
    passBalloonDesc: "推しガールを選ぶと会員証のテーマ色が変化します。",

    // Quick Search
    searchSpotTitle: "設置スポットから探す",
    searchSpotDesc: "那須町・那須塩原市・大田原市の設置店舗",
    searchCharTitle: "キャラクターから探す",
    searchCharDesc: "つつじ・くるみ・ちかのプロフィールとボイス",
    searchGoodsTitle: "取扱グッズから探す",
    searchGoodsDesc: "御朱印カード・アクスタ・限定アイテム",

    // 5 Key Experiences
    expTitle: "ご縁ガール無料会員で広がる 5つの体験",
    expSubtitle: "スマホ1つでいつものお出かけ・観光がドラマチックな聖地巡礼に変わる",
    exp1Title: "推し色に染まる<br>デジタル会員証",
    exp1Desc: "登録するだけで専用のファンIDが即時発行。つつじ・くるみ・ちかの中から推しガールを選ぶと、会員証が推しカラーに美しく染まります。",
    exp1Tag: "ずっと無料発行",
    exp2Title: "等身大パネルで<br>GPSチェックイン",
    exp2Desc: "提携スポットでマイページを開いてチェックイン！初回訪問で100pt、同一地域3施設制覇でボーナス+100ptが手に入ります。",
    exp2Tag: "初回訪問 100pt獲得",
    exp3Title: "限定ボイス＆特製壁紙を<br>即時アンロック",
    exp3Desc: "貯めたポイントはシークレット甘味ボイスや限定壁紙といつでも交換可能。入会特典の100ptを使えば、登録直後に最初の特典を楽しめます。",
    exp3Tag: "40pt〜で交換可能",
    exp4Title: "限定グッズの<br>現地お取り置き予約",
    exp4Desc: "「せっかく現地に行ったのに売り切れ…」を防ぐため、対象グッズをマイページから事前予約可能（応援会員機能）。確実に思い出をお持ち帰りいただけます。",
    exp4Tag: "引換コード即時発行",
    exp5Title: "旅の写真共有 ＆<br>新企画ファン投票",
    exp5Desc: "パネルと撮った思い出写真を全国のファンと共有！さらに新グッズやコラボ企画を決めるファン投票に参加して、地域を一緒に盛り上げましょう。",
    exp5Tag: "コミュニティ参加",
    expJoinCta: "🌸 10秒で無料会員登録して始める（0円）",

    // Rewards
    rewardsTitle: "貯まる！もらえる！限定特典カタログ",
    rewardsSubtitle: "現地チェックインや入会で手に入るポイントで交換できる豪華デジタル＆リアル特典",
    rewardsIntro: "✨ <strong>新規入会キャンペーン特典:</strong> 今なら無料登録するだけで <strong>100pt</strong> がすぐに付与されます！",
    rewardsIntroBadge: "登録直後にボイスや壁紙と交換OK！",
    rewardsCta: "🎁 無料登録して100ptを受け取る →",

    // Section Titles
    charSectionTitle: "地域の守護少女たち",
    charSectionSubtitle: "ボイスボタンでメッセージが再生されます（会員になると限定ボイスが解放されます）",
    panelSectionTitle: "新着パネル一覧（チェックイン対象スポット）",
    panelSectionSubtitle: "現地に行くとGPSチェックインで初回100ptを獲得できます！",
    goodsSectionTitle: "新着グッズ一覧（コレクション＆現地受取予約）",
    goodsSectionSubtitle: "現地限定アイテムをマイページで「欲しい／持っている」コレクション管理できます",
    collabSectionTitle: "新着コラボ・宿泊プラン一覧",
    collabSectionSubtitle: "地域店舗・宿泊施設との特別タイアップ",

    // Plans
    plansTitle: "選べる3つの会員プラン",
    plansSubtitle: "まずは完全無料のフリー会員でOK！あなたの推し活スタイルに合わせて選べます",
    planFreeTitle: "無料会員",
    planFreeBadge: "まずはここから！",
    planFreePrice: "¥0",
    planFreePriceUnit: "/ ずっと無料",
    planFreeDesc: "無料で好きになり、現地で思い出とコレクションが増える基本プラン",
    planFreeCta: "🎁 無料で今すぐ登録する",
    planSupporterTitle: "応援会員",
    planSupporterPrice: "¥480",
    planSupporterPriceUnit: "/ 月 (税込)",
    planSupporterDesc: "現地巡礼やコレクションをさらに深く楽しみたいファンのためのプラン",
    planSupporterCta: "マイページで詳細を見る",
    planCocreateTitle: "共創会員",
    planCocreatePrice: "¥980",
    planCocreatePriceUnit: "/ 月 (税込)",
    planCocreateDesc: "新企画や新グッズの開発に直接投票・参加できるプレミアムプラン",
    planCocreateCta: "マイページで詳細を見る",

    // Bottom CTA
    bottomTag: "JOIN THE JOURNEY",
    bottomTitle: "スマホ片手に、<br>新しいご縁の巡礼旅へ出かけよう。",
    bottomDesc: "無料登録はわずか10秒。面倒な入力なしですぐにあなただけのデジタル会員証を発行！<br>今なら新規登録で<strong>100ptをプレゼント</strong>。登録直後に最初の限定ボイスをアンロックできます。",
    bottomJoinBtn: "🎁 10秒で無料会員証を発行する (100pt進呈)",
    bottomLoginBtn: "既に会員の方（ログイン / マイページへ）",

    // Footer
    footerLp: "企業・店舗向けトップページ",
    footerJoin: "ファン無料会員登録",
    footerMember: "会員ダッシュボード",
    footerPrivacy: "プライバシーポリシー",
    footerTokusho: "特定商取引法に基づく表記",
    footerAdmin: "運営管理コンソール",

    // Card Badges & Actions
    voiceSampleBtn: "🔊 公式ボイス試聴",
    issuePassBtn: "🎁 推し会員証を発行",
    checkinBadge: "📍 チェックイン +100pt",
    checkinBonusNote: "✨ 現地チェックインで初回100pt進呈！",
    reserveBadge: "🎫 受取予約対象",
    reserveNote: "🛍️ 応援会員なら現地お取り置き可能",
    collabBadge: "コラボ企画",
    dtBirthday: "誕生日",
    dtHobby: "趣味",
    dtSpecialty: "特技",
    dtPersonality: "性格",
    dtSpots: "設置スポット",
    dtGoods: "限定グッズ",
    spotsUnit: "か所",
    goodsUnit: "種",
    taxIncluded: "(税込)"
  },
  en: {
    // Header & Nav
    announcementBadge: "Welcome Bonus",
    announcementText: "Join free now and get <strong>Instant 100pt & Digital Oshi Pass</strong>!",
    announcementLink: "Free Join in 10s →",
    portalTitle: "GOEN GIRL Portal",
    portalTagline: "Connecting travelers to sacred Japan. Official Pilgrimage Portal",
    navBenefits: "Benefits",
    navRewards: "Rewards",
    navCharacters: "Characters",
    navPanels: "Spot Standees",
    navGoods: "Goods",
    navPlans: "Plans",
    navJoinBtn: "🎁 Free Join (¥0)",
    navMemberBtn: "Member Pass ↗",
    breadcrumbHome: "Home (Business LP)",
    breadcrumbTop: "Information Portal TOP",

    // Hero
    heroTag: "✿ Official Fan Pilgrimage & Tourism Portal",
    heroHeading: "Journey Across Japan,<br><span>Connect with Your Oshi.</span>",
    heroDesc: "Explore the captivating world of 'Goen Girl' across Tochigi's Nasu, Nasushiobara, Otawara, and heritage spots nationwide.<br>Check in via <strong>GPS at life-sized standees</strong> to earn Goen points!<br>Unlock <strong>exclusive voices and wallpapers</strong> to complete your own digital pilgrimage stamp book.",
    heroJoinBtn: "🎁 Get Your Free Digital Pass Now (+100pt Bonus)",
    heroBenefitsBtn: "🔍 What You Can Do For Free",
    passPreviewTitle: "🎴 Digital Pass Preview",
    passOwnerDefault: "Goen Pilgrim",
    passPtsLabel: "HOLDING POINTS",
    passOshiLabel: "Oshi: ",
    passBalloonTitle: "Instantly yours with free registration!",
    passBalloonDesc: "Select your favorite girl to change the card theme color.",

    // Quick Search
    searchSpotTitle: "Find by Spot Standees",
    searchSpotDesc: "Temples, hotels & shops in Nasu, Nasushiobara, Otawara",
    searchCharTitle: "Meet the Characters",
    searchCharDesc: "Profiles and voice samples of Tsutsuji, Kurumi & Chika",
    searchGoodsTitle: "Explore Regional Goods",
    searchGoodsDesc: "Stamp cards, acrylic stands & exclusive local items",

    // 5 Key Experiences
    expTitle: "5 Wonderful Experiences for Goen Free Members",
    expSubtitle: "Transform ordinary sightseeing into a memorable, interactive pilgrimage right from your smartphone",
    exp1Title: "Customized Color<br>Digital Member Pass",
    exp1Desc: "Instantly receive your official fan ID upon free sign-up. Select Tsutsuji, Kurumi, or Chika to style your digital pass with her signature colors.",
    exp1Tag: "Always Free",
    exp2Title: "Life-Sized Standee<br>GPS Check-In",
    exp2Desc: "Open your pass at partner locations to check in! Receive 100pt on your first visit, plus a +100pt bonus when completing 3 spots in the same region.",
    exp2Tag: "First Visit: +100pt",
    exp3Title: "Exclusive Voices &<br>Special Wallpapers",
    exp3Desc: "Redeem your earned points for secret sweet voice lines and high-res wallpapers. Use your initial 100pt bonus right away!",
    exp3Tag: "Available from 40pt",
    exp4Title: "On-Site Pickup<br>Reservation for Goods",
    exp4Desc: "Never worry about sold-out items. Reserve exclusive character goods in advance and pick them up directly at the spot (Supporter feature).",
    exp4Tag: "Instant Voucher Code",
    exp5Title: "Photo Sharing &<br>Fan Creation Votes",
    exp5Desc: "Share your pilgrimage photos with fellow fans nationwide! Participate in community votes to decide future merchandise and collaborations.",
    exp5Tag: "Community Access",
    expJoinCta: "🌸 Join Free in 10 Seconds (¥0)",

    // Rewards
    rewardsTitle: "Earn & Redeem! Exclusive Rewards Catalog",
    rewardsSubtitle: "Exciting digital voices and authentic regional gifts redeemable with check-in points",
    rewardsIntro: "✨ <strong>New Member Campaign:</strong> Register for free today and get <strong>100pt</strong> credited to your pass immediately!",
    rewardsIntroBadge: "Redeem voices & wallpapers immediately!",
    rewardsCta: "🎁 Register Free & Claim 100pt →",

    // Section Titles
    charSectionTitle: "Regional Guardian Girls",
    charSectionSubtitle: "Click the voice buttons to hear their greetings (Exclusive voices unlock for members)",
    panelSectionTitle: "Spot Standees (Check-In Locations)",
    panelSectionSubtitle: "Visit on-site to GPS check in and earn an instant 100pt bonus!",
    goodsSectionTitle: "Regional Goods (Collection & Pickup)",
    goodsSectionSubtitle: "Manage your 'Wanted' and 'Owned' collections directly in your member dashboard",
    collabSectionTitle: "Collaborations & Special Stay Plans",
    collabSectionSubtitle: "Special tie-ups with regional hotels, historic temples, and scenic spots",

    // Plans
    plansTitle: "Choose Your Membership Plan",
    plansSubtitle: "Start completely free! Upgrade anytime according to your travel and fan style",
    planFreeTitle: "Free Member",
    planFreeBadge: "Start Here!",
    planFreePrice: "¥0",
    planFreePriceUnit: "/ Always Free",
    planFreeDesc: "The essential plan to fall in love with regions, collect stamps, and grow your travel memories",
    planFreeCta: "🎁 Join Free Now",
    planSupporterTitle: "Supporter Plan",
    planSupporterPrice: "¥480",
    planSupporterPriceUnit: "/ Month (tax incl.)",
    planSupporterDesc: "For fans who want deeper pilgrimage experiences and guaranteed goods reservation",
    planSupporterCta: "View Details in Dashboard",
    planCocreateTitle: "Co-Creation Plan",
    planCocreatePrice: "¥980",
    planCocreatePriceUnit: "/ Month (tax incl.)",
    planCocreateDesc: "Premium plan offering voting rights on new merchandise and quarterly creator meetings",
    planCocreateCta: "View Details in Dashboard",

    // Bottom CTA
    bottomTag: "JOIN THE JOURNEY",
    bottomTitle: "Hold Your Smartphone,<br>Begin a Sacred Journey of Connections.",
    bottomDesc: "Sign up takes only 10 seconds. No complex registration needed—instantly receive your digital pass!<br>Receive <strong>100pt instantly</strong> to unlock your first exclusive character voice.",
    bottomJoinBtn: "🎁 Issue Free Digital Pass in 10s (+100pt)",
    bottomLoginBtn: "Already a Member? (Log In / Dashboard)",

    // Footer
    footerLp: "For Businesses & Partners (LP)",
    footerJoin: "Free Fan Sign-Up",
    footerMember: "Member Dashboard",
    footerPrivacy: "Privacy Policy",
    footerTokusho: "Commercial Disclosure",
    footerAdmin: "Management Console",

    // Card Badges & Actions
    voiceSampleBtn: "🔊 Listen to Voice",
    issuePassBtn: "🎁 Issue Oshi Pass",
    checkinBadge: "📍 Check-In +100pt",
    checkinBonusNote: "✨ 100pt Bonus on First Visit!",
    reserveBadge: "🎫 Pickup Available",
    reserveNote: "🛍️ Reserve & hold at spot (Supporters)",
    collabBadge: "Collab Feature",
    dtBirthday: "Birthday",
    dtHobby: "Hobbies",
    dtSpecialty: "Skills",
    dtPersonality: "Personality",
    dtSpots: "Locations",
    dtGoods: "Goods",
    spotsUnit: "spots",
    goodsUnit: "items",
    taxIncluded: "(tax incl.)"
  }
};

// Language detection and state management
let currentLang = "ja";

function detectLanguage() {
  const saved = localStorage.getItem("goen_lang");
  if (saved === "ja" || saved === "en") return saved;
  const browserLang = (navigator.languages && navigator.languages.length > 0)
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage || "");
  return browserLang.toLowerCase().startsWith("ja") ? "ja" : "en";
}

function setLanguage(lang) {
  currentLang = (lang === "en") ? "en" : "ja";
  localStorage.setItem("goen_lang", currentLang);
  document.documentElement.lang = currentLang;

  // Update switcher button active state
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  // Apply static translations
  applyStaticTranslations();

  // Re-render dynamic lists
  renderCharacters();
  renderPanels();
  renderGoods();
  renderCollabs();
  updateDigitalPassLabels();
}

function applyStaticTranslations() {
  const t = PORTAL_I18N[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  currentLang = detectLanguage();
  document.documentElement.lang = currentLang;

  // Initialize Language Switcher Buttons
  const switcherContainer = document.getElementById("lang-switcher");
  if (switcherContainer) {
    switcherContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-btn");
      if (btn && btn.dataset.lang) {
        setLanguage(btn.dataset.lang);
      }
    });
  }

  // Initial Render with detected language
  setLanguage(currentLang);
  setupModal();
  initDigitalPassPreview();
});

// Digital Pass Preview Interactive Switcher
function initDigitalPassPreview() {
  const tabsContainer = document.getElementById("pass-char-tabs");
  const card = document.getElementById("mini-pass-card");
  const avatar = document.getElementById("mini-pass-avatar");
  const favGirlLabel = document.getElementById("mini-pass-fav-girl");
  const titleBadge = document.getElementById("mini-pass-title-badge");

  if (!tabsContainer || !card) return;

  const charThemes = {
    tsutsuji: {
      themeClass: "theme-tsutsuji",
      name: currentLang === "en" ? "Tsutsuji Nasuno" : "那須乃つつじ",
      image: "../assets/nasuno-tsutsuji.png",
      title: currentLang === "en" ? "🏅 First Connection" : "🏅 初めてのご縁"
    },
    milk: {
      themeClass: "theme-milk",
      name: currentLang === "en" ? "Kurumi Karino" : "狩野くるみ",
      image: "../assets/karino-milk.png",
      title: currentLang === "en" ? "🏅 Regional Connection" : "🏅 地域のご縁"
    },
    chika: {
      themeClass: "theme-chika",
      name: currentLang === "en" ? "Chika Otawara" : "大俵ちか",
      image: "../assets/otawara-chika.png",
      title: currentLang === "en" ? "🏅 Journey Connection" : "🏅 旅するご縁"
    }
  };

  tabsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".char-tab-btn");
    if (!btn) return;

    const charKey = btn.dataset.char;
    const config = charThemes[charKey];
    if (!config) return;

    tabsContainer.querySelectorAll(".char-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    card.classList.remove("theme-tsutsuji", "theme-milk", "theme-chika");
    card.classList.add(config.themeClass);

    if (avatar) avatar.src = config.image;
    if (favGirlLabel) favGirlLabel.textContent = config.name;
    if (titleBadge) titleBadge.textContent = config.title;
  });
}

function updateDigitalPassLabels() {
  const activeTab = document.querySelector(".char-tab-btn.active");
  const charKey = activeTab ? activeTab.dataset.char : "tsutsuji";
  const favGirlLabel = document.getElementById("mini-pass-fav-girl");
  const titleBadge = document.getElementById("mini-pass-title-badge");
  const ownerLabel = document.getElementById("mini-pass-owner-name");

  if (ownerLabel) {
    ownerLabel.textContent = currentLang === "en" ? "Goen Pilgrim" : "ご縁巡礼者 様";
  }

  const nameMap = {
    tsutsuji: currentLang === "en" ? "Tsutsuji Nasuno" : "那須乃つつじ",
    milk: currentLang === "en" ? "Kurumi Karino" : "狩野くるみ",
    chika: currentLang === "en" ? "Chika Otawara" : "大俵ちか"
  };
  const titleMap = {
    tsutsuji: currentLang === "en" ? "🏅 First Connection" : "🏅 初めてのご縁",
    milk: currentLang === "en" ? "🏅 Regional Connection" : "🏅 地域のご縁",
    chika: currentLang === "en" ? "🏅 Journey Connection" : "🏅 旅するご縁"
  };

  if (favGirlLabel) favGirlLabel.textContent = nameMap[charKey] || nameMap.tsutsuji;
  if (titleBadge) titleBadge.textContent = titleMap[charKey] || titleMap.tsutsuji;
}

function renderCharacters() {
  const container = document.getElementById("char-container");
  if (!container) return;
  const isEn = currentLang === "en";
  const t = PORTAL_I18N[currentLang];

  container.innerHTML = PORTAL_DATA.characters.map(c => `
    <article class="char-card">
      <div class="char-card-header">
        <img src="${c.image}" alt="${isEn ? c.nameEn : c.name}" class="char-avatar">
        <div>
          <span class="char-region">${isEn ? c.regionEn : c.region}</span>
          <h3 class="char-name">${isEn ? c.nameEn : c.name}</h3>
        </div>
      </div>
      <div class="char-card-body">
        <p class="char-bio">${isEn ? c.leadEn : c.lead}</p>
        <dl class="char-profile-list">
          <dt>${t.dtBirthday}</dt><dd>${isEn ? c.birthdayEn : c.birthday}</dd>
          <dt>${t.dtHobby}</dt><dd>${isEn ? c.hobbyEn : c.hobby}</dd>
          <dt>${t.dtSpecialty}</dt><dd>${isEn ? c.specialtyEn : c.specialty}</dd>
          <dt>${t.dtPersonality}</dt><dd>${isEn ? c.personalityEn : c.personality}</dd>
          <dt>${t.dtSpots}</dt><dd><strong>${c.spotsCount} ${t.spotsUnit}</strong></dd>
          <dt>${t.dtGoods}</dt><dd><strong>${c.goodsCount} ${t.goodsUnit}</strong></dd>
        </dl>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
          <button class="voice-sample-btn" style="flex: 1; min-width: 140px;" onclick="playVoiceSample('${isEn ? c.nameEn : c.name}', '${(isEn ? c.voiceTextEn : c.voiceText).replace(/'/g, "\\'")}', '${isEn ? 'en-US' : 'ja-JP'}')">
            <span>🔊</span> ${t.voiceSampleBtn}
          </button>
          <a href="../join/" class="voice-sample-btn" style="flex: 1; min-width: 140px; background: #fff0f5; border-color: #f28baf; color: #c72c5b; text-decoration: none; display: flex; align-items: center; justify-content: center;">
            <span>🎁</span> ${t.issuePassBtn}
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderPanels() {
  const container = document.getElementById("panel-container");
  if (!container) return;
  const isEn = currentLang === "en";
  const t = PORTAL_I18N[currentLang];

  container.innerHTML = PORTAL_DATA.panels.map(p => `
    <div class="poka-card" onclick="openDetailModal('panel', '${p.id}')">
      <div class="poka-card-img-wrap">
        <img src="${p.image}" alt="${isEn ? p.titleEn : p.title}" class="poka-card-img">
        <span class="poka-badge-points">${t.checkinBadge}</span>
        ${p.isNew ? '<span class="poka-badge-new">NEW</span>' : ''}
        <span class="poka-badge-category">${isEn ? p.categoryEn : p.category}</span>
      </div>
      <div class="poka-card-body">
        <p class="poka-card-character">${isEn ? p.characterEn : p.character}</p>
        <h3 class="poka-card-title">${isEn ? p.titleEn : p.title}</h3>
        <p class="poka-card-spot">📍 ${isEn ? p.spotNameEn : p.spotName}</p>
        <div style="margin-top: 8px; font-size: 11px; color: #059669; font-weight: 700;">
          ${t.checkinBonusNote}
        </div>
      </div>
    </div>
  `).join("");
}

function renderGoods() {
  const container = document.getElementById("goods-container");
  if (!container) return;
  const isEn = currentLang === "en";
  const t = PORTAL_I18N[currentLang];

  container.innerHTML = PORTAL_DATA.goods.map(g => `
    <div class="poka-card" onclick="openDetailModal('goods', '${g.id}')">
      <div class="poka-card-img-wrap">
        <img src="${g.image}" alt="${isEn ? g.nameEn : g.name}" class="poka-card-img">
        <span class="poka-badge-reserve">${t.reserveBadge}</span>
        ${g.isNew ? '<span class="poka-badge-new">NEW</span>' : ''}
        <span class="poka-badge-category">${isEn ? g.categoryEn : g.category}</span>
      </div>
      <div class="poka-card-body">
        <p class="poka-card-character">${isEn ? g.characterEn : g.character}</p>
        <h3 class="poka-card-title">${isEn ? g.nameEn : g.name}</h3>
        <p class="poka-card-spot">🏬 ${isEn ? g.spotNameEn : g.spotName}</p>
        <p class="poka-card-price">¥${g.price.toLocaleString()} <small>${t.taxIncluded}</small></p>
        <div style="margin-top: 6px; font-size: 11px; color: #2563eb; font-weight: 700;">
          ${t.reserveNote}
        </div>
      </div>
    </div>
  `).join("");
}

function renderCollabs() {
  const container = document.getElementById("collab-container");
  if (!container) return;
  const isEn = currentLang === "en";
  const t = PORTAL_I18N[currentLang];

  container.innerHTML = PORTAL_DATA.collabs.map(c => `
    <div class="poka-card" onclick="openDetailModal('collab', '${c.id}')">
      <div class="poka-card-img-wrap">
        <img src="${c.image}" alt="${isEn ? c.titleEn : c.title}" class="poka-card-img">
        ${c.isNew ? '<span class="poka-badge-new">NEW</span>' : ''}
        <span class="poka-badge-category">${t.collabBadge}</span>
      </div>
      <div class="poka-card-body">
        <p class="poka-card-character">${isEn ? c.characterEn : c.character}</p>
        <h3 class="poka-card-title">${isEn ? c.titleEn : c.title}</h3>
        <p class="poka-card-spot">🏨 ${isEn ? c.spotNameEn : c.spotName}</p>
      </div>
    </div>
  `).join("");
}

// Voice synthesis with bilingual speech
function playVoiceSample(name, text, langCode = 'ja-JP') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.pitch = 1.35;
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    if (langCode.startsWith('ja')) {
      const jaVoice = voices.find(v => v.lang.includes("ja") && (v.name.includes("Kyoko") || v.name.includes("Nanami") || v.name.includes("Female") || v.name.includes("Microsoft Ichiro") || v.name.includes("Microsoft Haruka")));
      if (jaVoice) utterance.voice = jaVoice;
    } else {
      const enVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Female") || v.name.includes("Google US English") || v.name.includes("Microsoft Zira")));
      if (enVoice) utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
  const title = currentLang === 'en' ? `[${name}'s Official Voice Message]` : `【${name}の公式ボイスメッセージ】`;
  alert(`${title}\n"${text}"`);
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
  const isEn = currentLang === "en";

  let item;
  if (type === "panel") item = PORTAL_DATA.panels.find(p => p.id === id);
  else if (type === "goods") item = PORTAL_DATA.goods.find(g => g.id === id);
  else if (type === "collab") item = PORTAL_DATA.collabs.find(c => c.id === id);

  if (!item) return;

  const title = isEn ? (item.titleEn || item.nameEn) : (item.title || item.name);
  const character = isEn ? (item.characterEn || item.character) : item.character;
  const spot = isEn ? (item.spotNameEn || item.spotName) : item.spotName;
  const desc = isEn ? (item.descriptionEn || item.description || "") : (item.description || "");
  const addr = isEn ? (item.addressEn || item.address || "") : (item.address || "");

  content.innerHTML = `
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <img src="${item.image}" alt="${title}" style="max-width: 140px; border-radius: 12px; background: #fdfbf7; border: 1px solid #e6e1eb; object-fit: contain;">
      <div style="flex: 1; min-width: 200px;">
        <span style="display: inline-block; font-size: 11px; color: #564a7e; font-weight: 700; background: #f0ecf8; padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;">
          ${character}
        </span>
        <h3 style="font-size: 18px; margin-bottom: 10px; color: #2c2836;">${title}</h3>
        <p style="font-size: 13px; color: #564a7e; font-weight: 700; margin-bottom: 6px;">📍 ${spot}</p>
        ${addr ? `<p style="font-size: 12px; color: #6f687d; margin-bottom: 12px;">${addr}</p>` : ''}
        ${desc ? `<p style="font-size: 13px; line-height: 1.7; color: #4b4458;">${desc}</p>` : ''}
        <div style="margin-top: 18px; display: flex; gap: 10px;">
          <a href="../join/" class="btn-hero-primary" style="font-size: 13px; padding: 8px 18px; text-decoration: none;">
            ${isEn ? "🎁 Free Join & Start Pilgrimage" : "🎁 無料登録して聖地巡礼を始める"}
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("open");
}
