// Clean Data Template (Zero State for Testing & Production)
const DEFAULT_DATA = {
  companies: [],
  panels: [],
  goods: [],
  payments: []
};

// ========== GitHub 自動同期 ==========
const GH_OWNER = "kaoriishige";
const GH_REPO  = "goengirl";
const GH_BRANCH = "main";
const GH_FILE   = "data/companies.json";
const GH_TOKEN_KEY = "goen_girl_gh_token";

function getGhToken() {
  return localStorage.getItem(GH_TOKEN_KEY) || "";
}

function setGhToken(token) {
  localStorage.setItem(GH_TOKEN_KEY, token.trim());
}

async function autoSyncToGitHub(companies) {
  const token = getGhToken();
  if (!token) return; // トークン未設定の場合はスキップ

  try {
    const apiUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`;
    const headers = {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    };

    // 現在のファイルのSHAを取得（更新に必要）
    const getRes = await fetch(`${apiUrl}?ref=${GH_BRANCH}`, { headers });
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // Base64エンコードしてPUT
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(companies, null, 2))));
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `auto-sync: 店舗データ自動更新 (${new Date().toLocaleString("ja-JP")})`,
        content,
        sha,
        branch: GH_BRANCH
      })
    });

    if (putRes.ok) {
      console.log("✅ GitHub自動同期完了 → Netlify自動デプロイ開始（約1〜2分後にスマホ反映）");
      showSyncToast("✅ スマホに自動反映中... 約1〜2分後に反映されます", "success");
    } else {
      const errJson = await putRes.json();
      console.warn("GitHub sync error:", errJson.message);
      if (errJson.message && errJson.message.includes("Bad credentials")) {
        showSyncToast("⚠️ GitHubトークンが無効です。設定を確認してください", "warn");
      }
    }
  } catch (e) {
    console.warn("GitHub自動同期失敗（ネットワークエラー）:", e);
  }
}

function showSyncToast(msg, type) {
  let toast = document.getElementById("gh-sync-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "gh-sync-toast";
    toast.style.cssText = "position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);transition:opacity 0.3s;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === "success" ? "#e3fcef" : "#fffbe6";
  toast.style.color = type === "success" ? "#006644" : "#7c5c00";
  toast.style.border = type === "success" ? "1px solid #abf5d1" : "1px solid #ffe58f";
  toast.style.opacity = "1";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = "0"; }, 5000);
}
// ======================================

// State Manager
class AdminStore {
  constructor() {
    this.storageKey = "goen_girl_admin_db_permanent";
    this.data = this.load();
    // localStorage が空の場合、data/companies.json から自動読み込み
    this._initFromServer();
  }

  load() {
    // 1. Try permanent storage first
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.companies)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading permanent store", e);
    }

    // 2. Rescue any previously entered data from v7, v6, v5, v4, v3, v2, v1
    const oldKeys = [
      "goen_girl_admin_db_v7", "goen_girl_admin_db_v6", "goen_girl_admin_db_v5",
      "goen_girl_admin_db_v4", "goen_girl_admin_db_v3", "goen_girl_admin_db_v2",
      "goen_girl_companies_shared"
    ];
    for (const k of oldKeys) {
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // It was companies array
            const rescued = { companies: parsed, panels: [], goods: [], payments: [] };
            this.save(rescued);
            return rescued;
          } else if (parsed && Array.isArray(parsed.companies) && parsed.companies.length > 0) {
            this.save(parsed);
            return parsed;
          }
        }
      } catch (e) {}
    }

    this.save(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  // data/companies.json を自動フェッチして同期
  async _initFromServer(force = false) {
    try {
      const res = await fetch("../data/companies.json?v=" + Date.now());
      if (res.ok) {
        const companies = await res.json();
        if (Array.isArray(companies) && companies.length > 0) {
          const currentFirst = this.data.companies[0]?.name;
          const serverFirst = companies[0]?.name;
          const isDifferent = !this.data.companies.length || (currentFirst !== serverFirst) || (this.data.companies[0]?.totalAmount !== companies[0]?.totalAmount);
          
          if (force || isDifferent) {
            this.data.companies = companies;
            // パネルデータ補完
            this.data.panels = companies.map((c, i) => ({
              id: `PN-${String(i+1).padStart(3,"0")}`,
              serial: `GG-${c.id}`,
              character: c.character || "狩野くるみ",
              costume: c.panelType || "等身大",
              companyId: c.id,
              companyName: c.name,
              location: c.panelLocation || "ロビー特設",
              lat: c.lat || 0,
              lng: c.lng || 0,
              status: "稼働中",
              condition: "良好",
              image: c.characterImg || ""
            }));
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            try {
              localStorage.setItem("goen_girl_companies_shared", JSON.stringify(this.data.companies));
            } catch (e) {}
            if (typeof renderAll === "function") renderAll();
          }
        }
      }
    } catch (e) {
      console.warn("サーバーからデータ読み込み失敗:", e);
    }
  }

  save(data) {
    this.data = data || this.data;
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    // Sync to shared storage for consumer member app
    try {
      localStorage.setItem("goen_girl_companies_shared", JSON.stringify(this.data.companies));
    } catch (e) {
      console.error(e);
    }
    // GitHub自動同期（非同期・ノンブロッキング）
    autoSyncToGitHub(this.data.companies).catch(e => console.warn("GitHub sync skip:", e));
  }

  reset() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem("goen_girl_companies_shared");
    localStorage.removeItem("goen_girl_member_session");
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save(this.data);
  }

  clearAll() {
    this.reset();
  }
}

const store = new AdminStore();

// App Logic
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupEventListeners();
  renderAll();
  initGhTokenUI();
});

function initGhTokenUI() {
  const statusEl = document.getElementById("gh-token-status");
  const inputEl = document.getElementById("gh-token-input");
  const token = getGhToken();
  if (statusEl) {
    if (token) {
      statusEl.innerHTML = '<span style="color:#57d9a3;">✅ 自動同期ON</span>';
      if (inputEl) inputEl.placeholder = "（設定済み）変更する場合のみ入力";
    } else {
      statusEl.innerHTML = '<span style="color:#ff8f73;">⚠️ 未設定（下記参照）</span>';
    }
  }
}

function saveGhTokenFromUI() {
  const input = document.getElementById("gh-token-input");
  const statusEl = document.getElementById("gh-token-status");
  const saveBtn = document.getElementById("gh-save-btn");
  if (!input || !input.value.trim()) return;
  setGhToken(input.value.trim());
  if (statusEl) statusEl.innerHTML = '<span style="color:#57d9a3;">✅ 自動同期ON（次回保存から有効）</span>';
  if (saveBtn) saveBtn.style.display = "none";
  input.value = "";
  input.placeholder = "（設定済み）変更する場合のみ入力";
  alert("✅ GitHubトークンを保存しました！\n次回から店舗を登録・更新すると自動でスマホに反映されます。");
}
window.saveGhTokenFromUI = saveGhTokenFromUI;



function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-tab]");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      
      const tabId = item.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(p => {
        p.classList.toggle("active", p.id === `tab-${tabId}`);
      });
      
      const titleMap = {
        dashboard: "ダッシュボード（概要・KPI）",
        companies: "登録企業・店舗管理",
        sales: "売上・サブスクリプションデータ",
        payments: "決済・請求ステータス",
        panels: "パネル設置情報管理",
        goods: "グッズ情報・在庫管理",
        analytics: "会員・ファン回遊KPI分析（要件20）",
        reservations: "対象グッズ 現地受取予約管理（要件11）",
        hiroba: "ご縁ひろば・通報モデレーション管理"
      };
      document.getElementById("page-title").textContent = titleMap[tabId] || "管理コンソール";
      if (tabId === "analytics") renderAnalytics();
      if (tabId === "reservations") renderReservations();
      if (tabId === "hiroba") renderAdminHiroba();

      // Auto scroll to content on mobile so user does not need to scroll down manually
      if (window.innerWidth <= 900) {
        const contentEl = document.querySelector(".content") || document.getElementById(`tab-${tabId}`);
        if (contentEl) {
          setTimeout(() => {
            contentEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 60);
        }
      }
    });
  });
}

function setupEventListeners() {
  // Reset / Clear All Data Button
  const resetBtn = document.getElementById("btn-reset-data");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("⚠️ すべての提携店舗・パネル・売上データを完全に消去（クリア）しますか？\n\n・提携企業・店舗データ: 0件\n・パネル設置情報: 0件\n・請求書・決済データ: 0件\n・会員巡礼スポット: 0件\nになります。新規入力テストをゼロから行えます。")) {
        store.clearAll();
        renderAll();
        alert("すべてのデータをクリアしました！\n「＋ 新規提携先を登録」からテストデータを登録してください。");
      }
    });
  }

  // Company Search & Filter
  const companySearch = document.getElementById("company-search");
  const companyStatusFilter = document.getElementById("company-status-filter");
  if (companySearch) companySearch.addEventListener("input", renderCompanies);
  if (companyStatusFilter) companyStatusFilter.addEventListener("change", renderCompanies);

  // New Company Modal & GPS Geocoding
  const btnNewCompany = document.getElementById("btn-new-company");
  const modalCompany = document.getElementById("modal-company");
  const modalCompanyClose = document.getElementById("modal-company-close");
  const modalCompanyCancel = document.getElementById("modal-company-cancel");
  const formCompany = document.getElementById("form-company");

  const charInput = document.getElementById("form-company-character");
  const panelImgPreview = document.getElementById("company-panel-preview");
  const panelNoImgLabel = document.getElementById("company-panel-no-img");
  const panelFileInput = document.getElementById("company-panel-file");
  const btnClearPanelImg = document.getElementById("btn-clear-panel-img");
  const panelImgDataInput = document.getElementById("form-company-char-img-data");
  const panelFilenameLabel = document.getElementById("panel-img-filename");

  const btnFetchGps = document.getElementById("btn-fetch-gps");
  const addressInput = document.getElementById("form-company-address");
  const latInput = document.getElementById("form-company-lat");
  const lngInput = document.getElementById("form-company-lng");
  const gpsHint = document.getElementById("gps-status-hint");

  
  // Mobile Sync QR Modal
  const btnSyncPhone = document.getElementById("btn-sync-phone");
  const modalSync = document.getElementById("modal-sync-phone");
  const modalSyncClose = document.getElementById("modal-sync-close");
  const qrImgEl = document.getElementById("sync-qr-image");
  const syncUrlInput = document.getElementById("sync-url-input");
  const btnCopySyncUrl = document.getElementById("btn-copy-sync-url");

  if (btnSyncPhone) {
    btnSyncPhone.addEventListener("click", () => {
      const companies = store.data.companies;
      if (companies.length === 0) {
        alert("提携店舗データがまだ登録されていません。先に「＋ 新規提携先を登録」から店舗を登録してください。");
        return;
      }

      // Compact sync payload
      const payload = companies.map(c => ({
        id: c.id,
        name: c.name,
        address: c.address,
        character: c.character,
        characterImg: c.characterImg,
        lat: c.lat,
        lng: c.lng,
        panelType: c.panelType,
        panelLocation: c.panelLocation
      }));

      const jsonStr = JSON.stringify(payload);
      const b64 = btoa(encodeURIComponent(jsonStr));
      const syncUrl = `https://goen-girl.netlify.app/member/?import=${b64}`;

      if (syncUrlInput) syncUrlInput.value = syncUrl;
      if (qrImgEl) {
        qrImgEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(syncUrl)}`;
      }

      if (modalSync) modalSync.classList.add("open");
    });
  }

  if (modalSyncClose) {
    modalSyncClose.addEventListener("click", () => modalSync.classList.remove("open"));
  }

  if (btnCopySyncUrl && syncUrlInput) {
    btnCopySyncUrl.addEventListener("click", () => {
      syncUrlInput.select();
      navigator.clipboard.writeText(syncUrlInput.value);
      alert("✅ スマホ同期用URLをコピーしました！\nスマホのLINEやメールに送って開くことでも同期できます。");
    });
  }

  // JSONダウンロードボタン: data/companies.jsonを直接生成できる
  const btnDownloadJson = document.getElementById("btn-download-json");
  if (btnDownloadJson) {
    btnDownloadJson.addEventListener("click", () => {
      const companies = store.data.companies;
      if (companies.length === 0) {
        alert("登録された店舗データがありません。先に店舗を登録してください。");
        return;
      }
      const json = JSON.stringify(companies, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "companies.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert("⬇️ companies.json をダウンロードしました。\nダウンロードしたファイルを 「data/companies.json」 に上書きして！\nNetlifyへ再デプロイするとスマホでも常に最新データが表示されます。");
    });
  }

  // Dynamic Options (Goods & SNS) & Real-time Calculation
  const panelFeeInput = document.getElementById("form-company-panel-fee");
  const goodsCheckbox = document.getElementById("form-company-goods-enabled");
  const goodsAmountInput = document.getElementById("form-company-goods-amount");
  const goodsDetails = document.getElementById("goods-order-details");
  const snsCheckbox = document.getElementById("form-company-sns-enabled");
  const snsDetails = document.getElementById("sns-plan-details");
  const snsTypeRadios = document.querySelectorAll("input[name='form-company-sns-billing-type']");
  const snsMonthlyMethodBox = document.getElementById("sns-monthly-payment-method");

  // Real-time Billing Summary Calculation
  function updateModalBillingSummary() {
    const panelFee = parseInt(panelFeeInput?.value, 10) || 0;
    const panelTax = Math.round(panelFee * 1.1);

    const isGoods = goodsCheckbox?.checked;
    const goodsFee = isGoods ? (parseInt(goodsAmountInput?.value, 10) || 0) : 0;
    const goodsTax = Math.round(goodsFee * 1.1);

    const isSns = snsCheckbox?.checked;
    const selectedSnsType = document.querySelector("input[name='form-company-sns-billing-type']:checked")?.value || "毎月課金";
    
    // SNS PR動画制作: 一括清算なら100,000円税別（110,000円税込）、毎月課金なら120,000円税別（132,000円税込）
    let snsAnnualFee = 0;
    let snsAnnualTax = 0;
    if (isSns) {
      if (selectedSnsType === "一括清算") {
        snsAnnualFee = 100000;
        snsAnnualTax = 110000;
      } else {
        snsAnnualFee = 120000;
        snsAnnualTax = 132000;
      }
    }

    const totalExcluded = panelFee + goodsFee + snsAnnualFee;
    // 各項目の税込額を個別に合算（二重課税防止）
    const totalIncluded = panelTax + goodsTax + snsAnnualTax;


    // Update UI elements
    const summaryPanelEl = document.getElementById("summary-panel-amount");
    const summaryGoodsEl = document.getElementById("summary-goods-amount");
    const summarySnsEl = document.getElementById("summary-sns-amount");
    const summaryTotalEl = document.getElementById("summary-total-amount");
    const summaryFlowEl = document.getElementById("summary-payment-flow");

    if (summaryPanelEl) {
      summaryPanelEl.innerHTML = `税別 ¥${panelFee.toLocaleString()} <span style="font-weight: 700; color: #172b4d;">(税込 ¥${panelTax.toLocaleString()})</span>`;
    }
    if (summaryGoodsEl) {
      if (isGoods) {
        summaryGoodsEl.innerHTML = `税別 ¥${goodsFee.toLocaleString()} <span style="font-weight: 700; color: #172b4d;">(税込 ¥${goodsTax.toLocaleString()})</span>`;
      } else {
        summaryGoodsEl.innerHTML = `<span style="color: #888;">発注なし (¥0)</span>`;
      }
    }
    if (summarySnsEl) {
      if (isSns) {
        if (selectedSnsType === "毎月課金") {
          summarySnsEl.innerHTML = `月額1万円税別×12ヶ月 = 税別 ¥120,000 <span style="font-weight: 700; color: #0284c7;">(税込 ¥132,000 / 月々¥11,000)</span>`;
        } else {
          summarySnsEl.innerHTML = `年払い一括 = 税別 ¥100,000 <span style="font-weight: 700; color: #0284c7;">(税込 ¥110,000)</span>`;
        }
      } else {
        summarySnsEl.innerHTML = `<span style="color: #888;">未契約 (¥0)</span>`;
      }
    }
    if (summaryTotalEl) {
      summaryTotalEl.innerHTML = `税別 ¥${totalExcluded.toLocaleString()} <span style="font-size: 16px; color: #d9381e;">(税込 ¥${totalIncluded.toLocaleString()})</span>`;
    }

    if (summaryFlowEl) {
      if (!isSns || selectedSnsType === "一括清算") {
        summaryFlowEl.innerHTML = `
          <strong>【お支払い方法】</strong><br>
          ・初回一括ご請求書発行額：<strong style="color: #0052cc; font-size: 14px;">¥${totalIncluded.toLocaleString()}（税込）</strong><br>
          <small style="color: #666;">（内訳: パネル ¥${panelTax.toLocaleString()} ${isGoods ? `+ グッズ ¥${goodsTax.toLocaleString()} ` : ''}${isSns ? '+ PR動画年間一括 ¥110,000' : ''}）</small>
        `;
      } else {
        const initialInvoice = panelTax + goodsTax;
        summaryFlowEl.innerHTML = `
          <strong>【お支払い方法】</strong><br>
          ・初回一括ご請求書発行額（パネル${isGoods ? '+グッズ' : ''}）：<strong style="color: #0052cc;">¥${initialInvoice.toLocaleString()}（税込）</strong><br>
          ・毎月の継続お支払い額（SNS動画PR）：<strong style="color: #0284c7;">¥11,000 / 月（税込）</strong>（12ヶ月合計: ¥132,000 税込）<br>
          <strong style="color: #d9381e;">➡ 初年度1年間のお支払い合計：¥${totalIncluded.toLocaleString()}（税込）</strong>
        `;
      }
    }
  }

  // Bind real-time recalculation
  if (panelFeeInput) panelFeeInput.addEventListener("input", updateModalBillingSummary);
  if (goodsAmountInput) goodsAmountInput.addEventListener("input", updateModalBillingSummary);
  if (goodsCheckbox) {
    goodsCheckbox.addEventListener("change", () => {
      if (goodsDetails) goodsDetails.style.display = goodsCheckbox.checked ? "block" : "none";
      updateModalBillingSummary();
    });
  }
  if (snsCheckbox) {
    snsCheckbox.addEventListener("change", () => {
      if (snsDetails) snsDetails.style.display = snsCheckbox.checked ? "block" : "none";
      updateModalBillingSummary();
    });
  }
  snsTypeRadios.forEach(r => {
    r.addEventListener("change", () => {
      if (snsMonthlyMethodBox) {
        snsMonthlyMethodBox.style.display = (r.value === "毎月課金") ? "block" : "none";
      }
      updateModalBillingSummary();
    });
  });

  function setPanelImage(src, filename) {
    if (src) {
      if (panelImgPreview) {
        panelImgPreview.src = src;
        panelImgPreview.style.display = "block";
      }
      if (panelNoImgLabel) panelNoImgLabel.style.display = "none";
      if (panelImgDataInput) panelImgDataInput.value = src;
      if (panelFilenameLabel) panelFilenameLabel.textContent = filename ? `選択中: ${filename}` : "パネル画像が設定されています";
    } else {
      if (panelImgPreview) {
        panelImgPreview.src = "";
        panelImgPreview.style.display = "none";
      }
      if (panelNoImgLabel) panelNoImgLabel.style.display = "block";
      if (panelImgDataInput) panelImgDataInput.value = "";
      if (panelFilenameLabel) panelFilenameLabel.textContent = "パソコンからパネル画像ファイル（PNG / JPG / WebP等）を選択してください。（必須）";
    }
  }

  // Handle File Upload from User PC
  if (panelFileInput) {
    panelFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Data = evt.target.result;
        setPanelImage(base64Data, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  // Clear Image Button
  if (btnClearPanelImg) {
    btnClearPanelImg.addEventListener("click", () => {
      setPanelImage("", "");
      if (panelFileInput) panelFileInput.value = "";
    });
  }

  // Geocoding via GSI (国土地理院 住所検索API)
  async function fetchGpsForAddress(addr) {
    if (!addr || !addr.trim()) {
      alert("先に所在地（住所）を入力してください。");
      return;
    }
    if (gpsHint) {
      gpsHint.style.color = "#0066cc";
      gpsHint.textContent = "国土地理院APIからGPS座標を特定中...";
    }
    try {
      const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(addr.trim())}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0 && data[0].geometry && data[0].geometry.coordinates) {
        const [lng, lat] = data[0].geometry.coordinates;
        if (latInput) latInput.value = Number(lat).toFixed(6);
        if (lngInput) lngInput.value = Number(lng).toFixed(6);
        if (gpsHint) {
          gpsHint.style.color = "#2e7d32";
          gpsHint.textContent = `✅ GPS座標を特定しました (緯度: ${Number(lat).toFixed(4)}, 経度: ${Number(lng).toFixed(4)})`;
        }
      } else {
        fallbackGeocode(addr);
      }
    } catch (e) {
      console.warn("GSI geocode error, using fallback", e);
      fallbackGeocode(addr);
    }
  }

  function fallbackGeocode(addr) {
    let lat = 36.9500;
    let lng = 140.0000;
    if (addr.includes("那須町") || addr.includes("湯本")) {
      lat = 37.0800 + (Math.random() - 0.5) * 0.04;
      lng = 139.9800 + (Math.random() - 0.5) * 0.04;
    } else if (addr.includes("那須塩原") || addr.includes("塩原") || addr.includes("千本松")) {
      lat = 36.9300 + (Math.random() - 0.5) * 0.04;
      lng = 139.9200 + (Math.random() - 0.5) * 0.04;
    } else if (addr.includes("大田原") || addr.includes("黒羽")) {
      lat = 36.8600 + (Math.random() - 0.5) * 0.04;
      lng = 140.0800 + (Math.random() - 0.5) * 0.04;
    }
    if (latInput) latInput.value = lat.toFixed(6);
    if (lngInput) lngInput.value = lng.toFixed(6);
    if (gpsHint) {
      gpsHint.style.color = "#d97706";
      gpsHint.textContent = `📍 地域推定からGPS座標を自動設定しました (手動微調整可能)`;
    }
  }

  if (btnFetchGps && addressInput) {
    btnFetchGps.addEventListener("click", () => {
      fetchGpsForAddress(addressInput.value);
    });
    addressInput.addEventListener("blur", () => {
      if (addressInput.value.trim() && (!latInput.value || !lngInput.value)) {
        fetchGpsForAddress(addressInput.value);
      }
    });
  }

  // Open New Company Modal (Reset to completely empty)
  if (btnNewCompany) {
    btnNewCompany.addEventListener("click", () => {
      formCompany.reset();
      document.getElementById("company-edit-id").value = "";
      if (latInput) latInput.value = "";
      if (lngInput) lngInput.value = "";
      if (gpsHint) gpsHint.textContent = "";
      if (charInput) charInput.value = "";
      setPanelImage("", "");
      if (panelFileInput) panelFileInput.value = "";

      // Reset options
      if (goodsCheckbox) goodsCheckbox.checked = false;
      if (goodsDetails) goodsDetails.style.display = "none";
      if (snsCheckbox) snsCheckbox.checked = true;
      if (snsDetails) snsDetails.style.display = "block";
      const monthlyRadio = document.getElementById("sns-type-monthly");
      if (monthlyRadio) monthlyRadio.checked = true;
      if (snsMonthlyMethodBox) snsMonthlyMethodBox.style.display = "block";

      const startDateInput = document.getElementById("form-company-start-date");
      if (startDateInput) startDateInput.value = new Date().toISOString().split("T")[0];

      // Update real-time summary
      updateModalBillingSummary();

      document.getElementById("modal-company-title").textContent = "新規提携企業・店舗の登録";
      modalCompany.classList.add("open");
    });
  }

  const closeModal = () => modalCompany.classList.remove("open");
  if (modalCompanyClose) modalCompanyClose.addEventListener("click", closeModal);
  if (modalCompanyCancel) modalCompanyCancel.addEventListener("click", closeModal);

  // Form Submit Handler
  if (formCompany) {
    formCompany.addEventListener("submit", (e) => {
      e.preventDefault();
      const editId = document.getElementById("company-edit-id").value;

      // 1. Validate Character Name (すべて手入力)
      const charName = charInput.value.trim();
      if (!charName) {
        alert("導入キャラクター名を手入力してください。");
        charInput.focus();
        return;
      }

      // 2. Validate Panel Requirements (すべて入力必須)
      const panelTypeVal = document.getElementById("form-company-panel").value.trim();
      if (!panelTypeVal) {
        alert("パネル形態・仕様（例: 等身大パネル 巫女Ver.）を入力してください。");
        document.getElementById("form-company-panel").focus();
        return;
      }

      const panelLocationVal = document.getElementById("form-company-panel-location").value.trim();
      if (!panelLocationVal) {
        alert("店内・敷地内の設置場所詳細（例: レジ横特設ブース、エントランス等）を入力してください。");
        document.getElementById("form-company-panel-location").focus();
        return;
      }

      let latVal = parseFloat(document.getElementById("form-company-lat").value);
      let lngVal = parseFloat(document.getElementById("form-company-lng").value);
      const addrVal = document.getElementById("form-company-address").value.trim();
      
      // GPSが未入力の場合は住所から自動算出
      if (isNaN(latVal) || isNaN(lngVal)) {
        fallbackGeocode(addrVal);
        latVal = parseFloat(document.getElementById("form-company-lat").value);
        lngVal = parseFloat(document.getElementById("form-company-lng").value);
        if (isNaN(latVal) || isNaN(lngVal)) {
          latVal = 36.933365;
          lngVal = 140.017654;
        }
      }

      // 3. Validate / Fallback Panel Image
      let charImg = panelImgDataInput.value;
      if (!charImg) {
        // 画像未選択時はキャラクターに応じた公式立ち絵画像を自動補完
        if (charName.includes("くるみ") || charName.includes("みるく")) {
          charImg = "../assets/karino-milk.png";
        } else if (charName.includes("ちか")) {
          charImg = "../assets/otawara-chika.png";
        } else {
          charImg = "../assets/nasuno-tsutsuji.png";
        }
      }

      // Accurate Billing & Services Calculation
      const panelFee = parseInt(document.getElementById("form-company-panel-fee").value, 10) || 150000;
      const panelFeeTax = Math.round(panelFee * 1.1);

      const goodsEnabled = document.getElementById("form-company-goods-enabled").checked;
      const goodsPackage = goodsEnabled ? document.getElementById("form-company-goods-package").value : "発注なし";
      const goodsAmount = goodsEnabled ? (parseInt(document.getElementById("form-company-goods-amount").value, 10) || 50000) : 0;
      const goodsAmountTax = Math.round(goodsAmount * 1.1);

      const snsEnabled = document.getElementById("form-company-sns-enabled").checked;
      let snsBillingType = "未契約";
      let snsPaymentMethod = "未契約";
      let monthlyFee = 0; // Tax excluded
      let monthlyFeeTax = 0; // Tax included
      let snsAnnualFee = 0; // Tax excluded
      let snsAnnualTax = 0; // Tax included

      if (snsEnabled) {
        const selectedTypeRadio = document.querySelector("input[name='form-company-sns-billing-type']:checked");
        snsBillingType = selectedTypeRadio ? selectedTypeRadio.value : "毎月課金";
        
        if (snsBillingType === "一括清算") {
          snsAnnualFee = 100000;
          snsAnnualTax = 110000;
          snsPaymentMethod = "請求書一括清算（年払い）";
        } else {
          snsAnnualFee = 120000;
          snsAnnualTax = 132000;
          monthlyFee = 10000;
          monthlyFeeTax = 11000;
          const selectedPayRadio = document.querySelector("input[name='form-company-sns-pay-method']:checked");
          snsPaymentMethod = selectedPayRadio ? selectedPayRadio.value : "クレジットカード毎月決済";
        }
      }

      // Initial Invoice Total (Immediate Billing)
      let initialInvoiceTax = panelFeeTax + goodsAmountTax;
      if (snsEnabled && snsBillingType === "一括清算") {
        initialInvoiceTax += snsAnnualTax;
      }

      // Annual Grand Total (Full 1 Year)
      const annualTotalTaxExcluded = panelFee + goodsAmount + (snsEnabled ? snsAnnualFee : 0);
      const annualTotalTaxIncluded = panelFeeTax + goodsAmountTax + (snsEnabled ? snsAnnualTax : 0);

      const startDateVal = document.getElementById("form-company-start-date").value || new Date().toISOString().split("T")[0];
      const nextRenewalVal = new Date(new Date(startDateVal).getTime() + 365*24*60*60*1000).toISOString().split("T")[0];

      const formData = {
        name: document.getElementById("form-company-name").value.trim(),
        industry: document.getElementById("form-company-industry").value,
        representative: document.getElementById("form-company-rep").value.trim(),
        phone: document.getElementById("form-company-phone").value.trim(),
        email: document.getElementById("form-company-email").value.trim(),
        address: document.getElementById("form-company-address").value.trim(),
        lat: latVal,
        lng: lngVal,
        character: charName,
        characterImg: charImg,
        panelType: panelTypeVal,
        panelLocation: panelLocationVal,
        panelFee: panelFee,
        panelFeeTax: panelFeeTax,
        goodsEnabled: goodsEnabled,
        goodsPackage: goodsPackage,
        goodsAmount: goodsAmount,
        goodsAmountTax: goodsAmountTax,
        snsEnabled: snsEnabled,
        snsBillingType: snsBillingType,
        snsPaymentMethod: snsPaymentMethod,
        monthlyFee: monthlyFee,
        monthlyFeeTax: monthlyFeeTax,
        snsAnnualFee: snsAnnualFee,
        snsAnnualTax: snsAnnualTax,
        initialInvoiceTax: initialInvoiceTax,
        totalAmount: annualTotalTaxExcluded, // Tax excluded for book revenue
        totalAmountTax: annualTotalTaxIncluded, // Tax included
        startDate: startDateVal,
        nextRenewal: nextRenewalVal,
        status: document.getElementById("form-company-status").value
      };

      if (editId) {
        // Update existing company
        const index = store.data.companies.findIndex(c => c.id === editId);
        if (index !== -1) {
          store.data.companies[index] = { ...store.data.companies[index], ...formData };
        }
        // Update associated panel
        const pIndex = store.data.panels.findIndex(p => p.companyId === editId);
        if (pIndex !== -1) {
          store.data.panels[pIndex].lat = latVal;
          store.data.panels[pIndex].lng = lngVal;
          store.data.panels[pIndex].character = charName;
          store.data.panels[pIndex].costume = panelTypeVal;
          store.data.panels[pIndex].location = panelLocationVal;
          store.data.panels[pIndex].image = charImg;
        }
      } else {
        // Create new company
        const newId = "C" + String(store.data.companies.length + 1).padStart(3, "0");
        const newCompany = {
          id: newId,
          ...formData
        };
        store.data.companies.unshift(newCompany);

        // 1. Add Panel
        const panelId = "PN-" + String(store.data.panels.length + 1).padStart(3, "0");
        store.data.panels.push({
          id: panelId,
          companyId: newId,
          companyName: formData.name,
          character: formData.character,
          costume: panelTypeVal,
          location: panelLocationVal,
          serial: "GG-" + newId,
          lat: latVal,
          lng: lngVal,
          image: charImg,
          status: "稼働中",
          condition: "良好"
        });

        // 2. Generate Invoices & Payments automatically with exact amounts
        const todayStr = new Date().toISOString().split("T")[0];
        const dueStr = new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0];

        // Invoice A: Panel Introduction (請求書で一括清算)
        store.data.payments.unshift({
          id: "INV-PN-" + String(store.data.payments.length + 1).padStart(3, "0"),
          companyId: newId,
          companyName: formData.name,
          billingItem: `キャラクターパネル初期導入費 (${formData.panelType}) [税別¥${panelFee.toLocaleString()} + 税¥${(panelFeeTax - panelFee).toLocaleString()}]`,
          amount: panelFeeTax,
          method: "請求書で一括清算 (銀行振込)",
          dueDate: dueStr,
          paidDate: "-",
          status: "請求中"
        });

        // Invoice B: Goods Wholesale Order (請求書で一括清算)
        if (goodsEnabled && goodsAmount > 0) {
          store.data.payments.unshift({
            id: "INV-GD-" + String(store.data.payments.length + 1).padStart(3, "0"),
            companyId: newId,
            companyName: formData.name,
            billingItem: `公式グッズ初回卸仕入れ (${goodsPackage}) [税別¥${goodsAmount.toLocaleString()} + 税¥${(goodsAmountTax - goodsAmount).toLocaleString()}]`,
            amount: goodsAmountTax,
            method: "請求書で一括清算 (銀行振込)",
            dueDate: dueStr,
            paidDate: "-",
            status: "請求中"
          });
        }

        // Payment C: SNS Video PR Service (一括: 110,000円 / 毎月: 11,000円×12)
        if (snsEnabled) {
          if (snsBillingType === "一括清算") {
            store.data.payments.unshift({
              id: "INV-SNS-" + String(store.data.payments.length + 1).padStart(3, "0"),
              companyId: newId,
              companyName: formData.name,
              billingItem: "PRショート動画制作 年間一括費用 (税込110,000円 / 年払い一括割引)",
              amount: 110000,
              method: "請求書で一括清算 (年払い)",
              dueDate: dueStr,
              paidDate: "-",
              status: "請求中"
            });
          } else {
            // Monthly Subscription (11,000 yen / month)
            store.data.payments.unshift({
              id: "SUB-SNS-" + String(store.data.payments.length + 1).padStart(3, "0"),
              companyId: newId,
              companyName: formData.name,
              billingItem: "PRショート動画制作 月額利用料（初回当月分 / 税込11,000円）",
              amount: 11000,
              method: snsPaymentMethod,
              dueDate: todayStr,
              paidDate: todayStr,
              status: "入金済"
            });
          }
        }
      }

      store.save();
      closeModal();
      renderAll();

      // スマホへのデータ反映のため、JSONを自動ダウンロード
      (function autoExportJson() {
        try {
          const json = JSON.stringify(store.data.companies, null, 2);
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "companies.json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch(e) {}
      })();

      alert(`✅「${formData.name}」の契約登録が完了しました！\n\n【初年度お支払い総額（合計）】\n・税別合計: ¥${annualTotalTaxExcluded.toLocaleString()}\n・税込合計: ¥${annualTotalTaxIncluded.toLocaleString()}\n\n【内訳】\n・パネル導入: ¥${panelFeeTax.toLocaleString()} (税込 / 請求書一括)\n${goodsEnabled ? `・グッズ発注: ¥${goodsAmountTax.toLocaleString()} (税込 / 請求書一括)\n` : ''}${snsEnabled ? `・PR動画制作: ${snsBillingType === '一括清算' ? '¥110,000 (税込 / 年払い一括)' : '¥132,000 (税込 / 11,000円×12ヶ月)'} (${snsBillingType})\n` : ''}\n📱【スマホ反映手順】\nダウンロードされた companies.json を\nご縁ガールのフォルダ内 data/ に上書き保存し、\nGitHubへプッシュ（または担当者へ転送）してください。`);
    });
  }
}


function renderAll() {
  renderKPIs();
  renderDashboard();
  renderCompanies();
  renderSales();
  renderPayments();
  renderPanels();
  renderGoods();
  renderAnalytics();
  renderReservations();
}

function renderKPIs() {
  const companies = store.data.companies;
  const activeCount = companies.filter(c => c.status === "契約中").length;
  const panelsCount = store.data.panels.filter(p => p.status === "稼働中").length;
  
  // Dynamic Revenue calculation (Tax excluded & Tax included)
  let totalRevenueExcluded = companies.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  let totalRevenueIncluded = companies.reduce((sum, c) => sum + (c.totalAmountTax || Math.round((c.totalAmount || 0) * 1.1)), 0);

  let monthlyRecurringExcluded = companies.filter(c => c.status === "契約中").reduce((sum, c) => sum + (c.monthlyFee || 0), 0);
  let monthlyRecurringIncluded = companies.filter(c => c.status === "契約中").reduce((sum, c) => sum + (c.monthlyFeeTax || Math.round((c.monthlyFee || 0) * 1.1)), 0);

  const countEl = document.getElementById("kpi-company-count");
  const subEl = document.getElementById("kpi-company-sub");
  const panelEl = document.getElementById("kpi-panel-count");
  const panelSubEl = document.getElementById("kpi-panel-sub");
  const revEl = document.getElementById("kpi-total-revenue");
  const mrrEl = document.getElementById("kpi-monthly-mrr");
  const renEl = document.getElementById("kpi-renewal-rate");
  const renSubEl = document.getElementById("kpi-renewal-sub");

  if (countEl) countEl.textContent = `${activeCount} 社`;
  if (subEl) subEl.textContent = companies.length > 0 ? `全提携申請 ${companies.length} 件（審査中 ${companies.length - activeCount} 件）` : "全提携申請 0 件";

  if (panelEl) panelEl.textContent = `${panelsCount} 台`;
  if (panelSubEl) panelSubEl.textContent = panelsCount > 0 ? `稼働中パネル ${panelsCount} 台` : "稼働中パネル 0 台";

  if (revEl) {
    if (totalRevenueIncluded > 0) {
      revEl.innerHTML = `¥${totalRevenueExcluded.toLocaleString()} <span style="font-size: 13px; font-weight: normal; color: #555;">(税込 ¥${totalRevenueIncluded.toLocaleString()})</span>`;
    } else {
      revEl.textContent = "¥0";
    }
  }

  if (mrrEl) {
    if (monthlyRecurringIncluded > 0) {
      mrrEl.textContent = `月額サブスク: 税別¥${monthlyRecurringExcluded.toLocaleString()}/月 (税込¥${monthlyRecurringIncluded.toLocaleString()}/月)`;
    } else {
      mrrEl.textContent = "月額サブスク収益: ¥0/月";
    }
  }

  if (renEl) renEl.textContent = activeCount > 0 ? "100%" : "0%";
  if (renSubEl) renSubEl.textContent = activeCount > 0 ? "中途解約 0件 (1年自動更新)" : "提携企業数 0 件";
}

function renderDashboard() {
  const companies = store.data.companies;

  // 1. Dashboard Table
  const dashTableBody = document.getElementById("table-dashboard-companies");
  if (dashTableBody) {
    if (companies.length === 0) {
      dashTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 36px 16px; color: #888;">
            登録された提携企業・店舗はありません。「＋ 新規提携先を登録」から入力してください。
          </td>
        </tr>
      `;
    } else {
      dashTableBody.innerHTML = companies.slice(0, 5).map(c => {
        const statusClass = c.status === "契約中" ? "status-active" : "status-pending";
        return `
          <tr>
            <td><strong>${c.id}</strong></td>
            <td>
              <div style="font-weight: 700; color: #172b4d;">${escapeHtml(c.name)}</div>
              <small style="color: #6b778c;">${escapeHtml(c.address)}</small>
            </td>
            <td><span class="status-pill ${statusClass}">${c.status}</span></td>
            <td>${escapeHtml(c.industry)}</td>
            <td>
              <span style="font-weight: 600; color: #b8860b;">${escapeHtml(c.character)}</span>
            </td>
            <td>
              <div style="font-size: 12px; font-weight: 600;">パネル導入 (請求書一括)</div>
              ${c.goodsEnabled ? `<div style="font-size: 11px; color: #1a73e8;">グッズ発注 (請求書一括)</div>` : ''}
              ${c.snsEnabled ? `<div style="font-size: 11px; color: #0284c7;">SNS PR (${c.snsBillingType})</div>` : ''}
            </td>
            <td>
              <div>${c.startDate}</div>
              <small style="color: #6b778c;">更新: ${c.nextRenewal}</small>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  // 2. Sales Chart
  const chartContainer = document.getElementById("sales-chart-container");
  if (chartContainer) {
    if (companies.length === 0) {
      chartContainer.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 160px; color: #888; background: #fafafa; border-radius: 8px; border: 1px dashed #e2e2e2;">
          <div style="font-size: 28px; margin-bottom: 6px;">📊</div>
          <strong style="color: #555; margin-bottom: 2px;">売上データがありません</strong>
          <span style="font-size: 12px;">新規提携先を登録すると、初期導入費・グッズ卸売・月額PR配信の売上推移がここに自動集計・描画されます</span>
        </div>
      `;
    } else {
      const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      const totalRev = companies.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
      const avg = Math.round(totalRev / 12);
      
      chartContainer.innerHTML = months.map((m, idx) => {
        const heightPct = totalRev > 0 ? Math.min(100, Math.max(20, Math.round(((idx + 1) / 12) * 85))) : 0;
        const estAmount = Math.round(avg * (0.7 + (idx * 0.06)));
        return `
          <div class="chart-col">
            <div class="chart-bar" style="height: ${heightPct}%;" data-tooltip="${m}: ¥${estAmount.toLocaleString()}"></div>
            <span class="chart-label">${m}</span>
          </div>
        `;
      }).join("");
    }
  }
}

function renderCompanies() {
  const tableBody = document.getElementById("table-companies-body");
  if (!tableBody) return;

  const searchQuery = (document.getElementById("company-search")?.value || "").toLowerCase();
  const statusFilter = document.getElementById("company-status-filter")?.value || "ALL";

  const filtered = store.data.companies.filter(c => {
    const matchSearch = (c.name || "").toLowerCase().includes(searchQuery) || 
                        (c.address || "").toLowerCase().includes(searchQuery) ||
                        (c.representative || "").toLowerCase().includes(searchQuery) ||
                        (c.character || "").toLowerCase().includes(searchQuery);
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 48px 20px; color: #777;">
          <div style="font-size: 32px; margin-bottom: 8px;">🏢</div>
          <strong style="font-size: 15px; color: #333; display: block; margin-bottom: 4px;">提携企業・店舗データがありません</strong>
          <span>画面右上の「＋ 新規提携先を登録」から、店舗情報・パネル画像・契約清算方法を入力して登録してください。</span>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(c => {
    const statusClass = c.status === "契約中" ? "status-active" : "status-pending";
    
    // Format Services & Payment Badges
    let serviceHtml = `<div style="display: flex; flex-direction: column; gap: 4px;">`;
    serviceHtml += `<div><span class="billing-badge invoice">🪧 パネル導入 (税込¥${(c.panelFeeTax || 165000).toLocaleString()})</span></div>`;
    if (c.goodsEnabled) {
      serviceHtml += `<div><span class="billing-badge invoice">🛍️ グッズ発注 (税込¥${(c.goodsAmountTax || 55000).toLocaleString()})</span></div>`;
    }
    if (c.snsEnabled) {
      if (c.snsBillingType === "一括清算") {
        serviceHtml += `<div><span class="billing-badge invoice">🎬 PR動画 (年払い一括 税込¥110,000)</span></div>`;
      } else if (c.snsPaymentMethod === "クレジットカード毎月決済") {
        serviceHtml += `<div><span class="billing-badge credit">🎬 PR動画 (毎月クレカ 税込¥11,000/月)</span></div>`;
      } else {
        serviceHtml += `<div><span class="billing-badge bank">🎬 PR動画 (毎月口座振替 税込¥11,000/月)</span></div>`;
      }
    }
    serviceHtml += `</div>`;

    return `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>
          <div style="font-weight: 700; color: #172b4d;">${escapeHtml(c.name)}</div>
          <small style="color: #6b778c;">${escapeHtml(c.address)}</small>
        </td>
        <td><span class="status-pill ${statusClass}">${c.status}</span></td>
        <td>${escapeHtml(c.industry)}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${c.characterImg ? `<img src="${c.characterImg}" style="width: 28px; height: 36px; object-fit: contain; border-radius: 4px; background: #fff; border: 1px solid #ddd;">` : ''}
            <div>
              <strong style="color: #b8860b;">${escapeHtml(c.character)}</strong>
              <br><small style="color: #6b778c;">${escapeHtml(c.panelType || "等身大")}</small>
            </div>
          </div>
        </td>
        <td>${serviceHtml}</td>
        <td>
          <div>${c.startDate}</div>
          <small style="color: #6b778c;">更新: ${c.nextRenewal}</small>
        </td>
        <td style="white-space: nowrap;">
          <button class="btn btn-secondary btn-sm" onclick="editCompany('${c.id}')">編集</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCompany('${c.id}')">削除</button>
        </td>
      </tr>
    `;
  }).join("");
}

function editCompany(id) {
  const c = store.data.companies.find(item => item.id === id);
  if (!c) return;

  document.getElementById("company-edit-id").value = c.id;
  document.getElementById("form-company-name").value = c.name;
  document.getElementById("form-company-industry").value = c.industry;
  document.getElementById("form-company-rep").value = c.representative;
  document.getElementById("form-company-phone").value = c.phone;
  document.getElementById("form-company-email").value = c.email;
  document.getElementById("form-company-address").value = c.address;

  const latInput = document.getElementById("form-company-lat");
  const lngInput = document.getElementById("form-company-lng");
  const gpsHint = document.getElementById("gps-status-hint");

  if (latInput) latInput.value = c.lat !== undefined ? Number(c.lat).toFixed(6) : "";
  if (lngInput) lngInput.value = c.lng !== undefined ? Number(c.lng).toFixed(6) : "";
  if (gpsHint && c.lat && c.lng) {
    gpsHint.style.color = "#2e7d32";
    gpsHint.textContent = `📍 登録済みGPS: (緯度: ${Number(c.lat).toFixed(4)}, 経度: ${Number(c.lng).toFixed(4)})`;
  }

  // Panel Fields (すべて手入力)
  const charInput = document.getElementById("form-company-character");
  if (charInput) charInput.value = c.character || "";

  const previewSrc = c.characterImg || "";
  const panelImgPreview = document.getElementById("company-panel-preview");
  const panelNoImgLabel = document.getElementById("company-panel-no-img");
  const panelImgDataInput = document.getElementById("form-company-char-img-data");
  if (panelImgPreview) {
    panelImgPreview.src = previewSrc;
    panelImgPreview.style.display = previewSrc ? "block" : "none";
  }
  if (panelNoImgLabel) panelNoImgLabel.style.display = previewSrc ? "none" : "block";
  if (panelImgDataInput) panelImgDataInput.value = previewSrc;

  document.getElementById("form-company-panel").value = c.panelType || "";
  document.getElementById("form-company-panel-location").value = c.panelLocation || "";
  document.getElementById("form-company-panel-fee").value = c.panelFee || 150000;

  // Goods
  const goodsCheckbox = document.getElementById("form-company-goods-enabled");
  const goodsDetails = document.getElementById("goods-order-details");
  if (goodsCheckbox) {
    goodsCheckbox.checked = !!c.goodsEnabled;
    if (goodsDetails) goodsDetails.style.display = c.goodsEnabled ? "block" : "none";
    if (c.goodsPackage) document.getElementById("form-company-goods-package").value = c.goodsPackage;
    if (c.goodsAmount) document.getElementById("form-company-goods-amount").value = c.goodsAmount;
  }

  // SNS
  const snsCheckbox = document.getElementById("form-company-sns-enabled");
  const snsDetails = document.getElementById("sns-plan-details");
  if (snsCheckbox) {
    snsCheckbox.checked = !!c.snsEnabled;
    if (snsDetails) snsDetails.style.display = c.snsEnabled ? "block" : "none";
    if (c.snsBillingType === "一括清算") {
      const annRadio = document.getElementById("sns-type-annual");
      if (annRadio) annRadio.checked = true;
    } else {
      const monRadio = document.getElementById("sns-type-monthly");
      if (monRadio) monRadio.checked = true;
    }
  }

  document.getElementById("form-company-status").value = c.status;
  document.getElementById("form-company-start-date").value = c.startDate || "";

  // Trigger real-time calculation in modal
  const panelFeeInput = document.getElementById("form-company-panel-fee");
  if (panelFeeInput) panelFeeInput.dispatchEvent(new Event("input"));

  document.getElementById("modal-company-title").textContent = `提携情報・契約編集: ${c.name}`;
  document.getElementById("modal-company").classList.add("open");
}

function deleteCompany(id) {
  if (confirm("この企業・店舗データを削除しますか？関連するパネルおよび未入金請求書データも整理されます。")) {
    store.data.companies = store.data.companies.filter(c => c.id !== id);
    store.data.panels = store.data.panels.filter(p => p.companyId !== id);
    store.data.payments = store.data.payments.filter(p => p.companyId !== id);
    store.save();
    renderAll();
  }
}

function renderSales() {
  const salesTableBody = document.getElementById("table-sales-body");
  if (!salesTableBody) return;

  if (store.data.companies.length === 0) {
    salesTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: #888;">登録企業・店舗がないため、売上データはありません。</td></tr>`;
    return;
  }

  salesTableBody.innerHTML = store.data.companies.map(c => {
    let breakdown = `パネル (税込¥${(c.panelFeeTax || 165000).toLocaleString()})`;
    if (c.goodsEnabled) breakdown += `<br>+ グッズ (税込¥${(c.goodsAmountTax || 55000).toLocaleString()})`;
    if (c.snsEnabled) breakdown += `<br>+ PR動画 (${c.snsBillingType === '一括清算' ? '年間一括税込¥110,000' : '年間税込¥132,000'})`;

    let payMethodDisplay = `<span class="billing-badge invoice">パネル: 請求書一括</span>`;
    if (c.goodsEnabled) {
      payMethodDisplay += `<br><span class="billing-badge invoice" style="margin-top:2px;">グッズ: 請求書一括</span>`;
    }
    if (c.snsEnabled) {
      if (c.snsBillingType === "一括清算") {
        payMethodDisplay += `<br><span class="billing-badge invoice" style="margin-top:2px;">PR動画: 請求書一括(年払い)</span>`;
      } else {
        const badgeClass = c.snsPaymentMethod.includes('クレジット') ? 'credit' : 'bank';
        payMethodDisplay += `<br><span class="billing-badge ${badgeClass}" style="margin-top:2px;">PR動画: ${c.snsPaymentMethod}</span>`;
      }
    }

    const initialTotalTax = (c.panelFeeTax || 165000) + (c.goodsEnabled ? (c.goodsAmountTax || 55000) : 0);
    const totalTaxIncluded = c.totalAmountTax || (c.totalAmount ? Math.round(c.totalAmount * 1.1) : 297000);
    const totalTaxExcluded = c.totalAmount || Math.round(totalTaxIncluded / 1.1);

    return `
      <tr>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td>${breakdown}</td>
        <td>
          <strong>¥${initialTotalTax.toLocaleString()}</strong> <small style="color: #666;">(税込)</small>
          <br><small style="color: #888;">税別 ¥${((c.panelFee || 150000) + (c.goodsEnabled ? (c.goodsAmount || 50000) : 0)).toLocaleString()}</small>
        </td>
        <td>
          ${c.monthlyFeeTax ? `<strong style="color: #0284c7;">¥${c.monthlyFeeTax.toLocaleString()}</strong>/月 <small style="color:#666;">(税込)</small><br><small style="color: #888;">税別 ¥${c.monthlyFee.toLocaleString()}/月</small>` : (c.snsEnabled ? `一括年払済 (税込¥110,000)` : `未契約`)}
        </td>
        <td>${payMethodDisplay}</td>
        <td>
          <strong style="color: #0052cc; font-size: 15px;">¥${totalTaxIncluded.toLocaleString()}</strong> <small style="color:#666;">(税込)</small>
          <br><small style="color: #888;">税別 ¥${totalTaxExcluded.toLocaleString()}</small>
        </td>
        <td>${c.nextRenewal}</td>
      </tr>
    `;
  }).join("");
}

function renderPayments() {
  const paymentTableBody = document.getElementById("table-payments-body");
  if (!paymentTableBody) return;

  if (store.data.payments.length === 0) {
    paymentTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #888;">決済・請求データはありません。店舗を登録すると自動で請求書が生成されます。</td></tr>`;
    return;
  }

  paymentTableBody.innerHTML = store.data.payments.map(p => {
    const statusClass = p.status === "入金済" ? "status-active" : (p.status === "請求中" ? "status-pending" : "status-alert");
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td><strong>${escapeHtml(p.companyName)}</strong></td>
        <td>${escapeHtml(p.billingItem)}</td>
        <td><strong style="color: #172b4d; font-size: 14px;">¥${p.amount.toLocaleString()}</strong> <small style="color: #666;">(税込)</small></td>
        <td>
          <span class="billing-badge ${p.method.includes('クレジット') ? 'credit' : (p.method.includes('銀行引') ? 'bank' : 'invoice')}">
            ${p.method}
          </span>
        </td>
        <td>${p.dueDate}</td>
        <td>${p.paidDate}</td>
        <td><span class="status-pill ${statusClass}">${p.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="togglePaymentStatus('${p.id}')">
            ${p.status === "入金済" ? "未入金に戻す" : "入金済みにする"}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function togglePaymentStatus(id) {
  const p = store.data.payments.find(item => item.id === id);
  if (!p) return;
  if (p.status === "入金済") {
    p.status = "請求中";
    p.paidDate = "-";
  } else {
    p.status = "入金済";
    p.paidDate = new Date().toISOString().split("T")[0];
  }
  store.save();
  renderPayments();
}

function renderPanels() {
  const panelTableBody = document.getElementById("table-panels-body");
  if (!panelTableBody) return;

  if (store.data.panels.length === 0) {
    panelTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #888;">設置パネルデータはありません。店舗を登録すると自動でパネルが登録されます。</td></tr>`;
    return;
  }

  panelTableBody.innerHTML = store.data.panels.map(p => {
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${escapeHtml(p.serial)}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${p.image ? `<img src="${p.image}" style="width: 28px; height: 36px; object-fit: contain; border-radius: 4px; background: #fff; border: 1px solid #ddd;">` : ''}
            <strong>${escapeHtml(p.character)}</strong>
          </div>
        </td>
        <td>${escapeHtml(p.costume)}</td>
        <td><strong>${escapeHtml(p.companyName)}</strong></td>
        <td><span style="color: #444;">${escapeHtml(p.location || "店頭特設")}</span></td>
        <td><small style="color: #0052cc;">${(p.lat || 0).toFixed(4)}, ${(p.lng || 0).toFixed(4)}</small></td>
        <td><span class="status-pill ${p.status === '稼働中' ? 'status-active' : 'status-pending'}">${p.status}</span></td>
        <td>${p.condition}</td>
      </tr>
    `;
  }).join("");
}

function renderGoods() {
  const goodsTableBody = document.getElementById("table-goods-body");
  if (!goodsTableBody) return;

  if (store.data.goods.length === 0) {
    goodsTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #888;">公式グッズ登録データはありません。</td></tr>`;
    return;
  }

  goodsTableBody.innerHTML = store.data.goods.map(g => {
    return `
      <tr>
        <td><strong>${g.id}</strong></td>
        <td><strong>${escapeHtml(g.name)}</strong></td>
        <td><span style="color: #b8860b; font-weight: 600;">${escapeHtml(g.character)}</span></td>
        <td>${escapeHtml(g.category)}</td>
        <td>¥${g.wholesalePrice.toLocaleString()}</td>
        <td>¥${g.retailPrice.toLocaleString()}</td>
        <td><strong style="color: ${g.stock < 150 ? '#de350b' : '#006644'};">${g.stock} 個</strong></td>
        <td><strong>${g.shippedTotal} 個</strong></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="adjustStock('${g.id}')">在庫調整</button>
        </td>
      </tr>
    `;
  }).join("");
}

function adjustStock(id) {
  const g = store.data.goods.find(item => item.id === id);
  if (!g) return;
  const newStock = prompt(`${g.name} の新しい現在庫数を入力してください:`, g.stock);
  if (newStock !== null && !isNaN(parseInt(newStock, 10))) {
    g.stock = parseInt(newStock, 10);
    store.save();
    renderGoods();
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Global functions for inline onclick handlers
window.editCompany = editCompany;
window.deleteCompany = deleteCompany;
window.togglePaymentStatus = togglePaymentStatus;
window.adjustStock = adjustStock;

// =========================================
// 要件18・20: 会員分析KPI ＆ 現地受取予約 ＆ 権限管理
// =========================================

let currentAdminRole = "superAdmin";

document.addEventListener("DOMContentLoaded", () => {
  setupRoleSwitching();
});

function setupRoleSwitching() {
  const roleSelect = document.getElementById("select-admin-role");
  const userLabel = document.getElementById("label-current-admin-user");

  if (roleSelect) {
    roleSelect.addEventListener("change", () => {
      currentAdminRole = roleSelect.value;
      if (currentAdminRole === "facilityStaff_C001") {
        if (userLabel) userLabel.innerHTML = `施設担当者: <strong>泉 道夫（那須ミッドシティホテル）</strong>`;
        alert("【施設担当者モードに切り替えました】\n自施設（那須ミッドシティホテル）の担当商品・受取予約のみアクセス可能です。\n他施設の予約や他会員の全国行動履歴は閲覧制限されます。");
      } else {
        if (userLabel) userLabel.innerHTML = `管理者: <strong>菊地 孝史 (TS DELY)</strong>`;
      }
      renderCompanies();
      renderPanels();
      renderReservations();
    });
  }
}

function getMemberSessionData() {
  try {
    const raw = localStorage.getItem("goen_girl_member_session_v2");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function renderAnalytics() {
  const m = getMemberSessionData();
  const freeEl = document.getElementById("kpi-member-free");
  const supEl = document.getElementById("kpi-member-supporter");
  const cocEl = document.getElementById("kpi-member-cocreation");
  const retEl = document.getElementById("kpi-paid-retention");

  let freeCount = 1;
  let supCount = 0;
  let cocCount = 0;

  if (m) {
    if (m.plan === "supporter") { freeCount = 0; supCount = 1; }
    else if (m.plan === "cocreation") { freeCount = 0; cocCount = 1; }
  }

  if (freeEl) freeEl.textContent = `${freeCount} 名`;
  if (supEl) supEl.textContent = `${supCount} 名`;
  if (cocEl) cocEl.textContent = `${cocCount} 名`;
  if (retEl) retEl.textContent = "100%";

  // 回遊指標
  const firstVisEl = document.getElementById("analytics-first-visitors");
  const repRateEl = document.getElementById("analytics-repeat-rate");
  const reg3El = document.getElementById("analytics-region-3-users");
  const multiRegEl = document.getElementById("analytics-multi-regions");

  const checkins = m && m.checkins ? m.checkins : [];
  const visitedFacilities = [...new Set(checkins.map(c => c.spotId))];
  const visitedRegions = [...new Set(checkins.map(c => c.regionId))];

  if (firstVisEl) firstVisEl.textContent = `${visitedFacilities.length > 0 ? 1 : 0} 名`;
  if (repRateEl) repRateEl.textContent = visitedFacilities.length >= 2 ? "100%" : "0%";
  if (reg3El) reg3El.textContent = visitedFacilities.length >= 3 ? "1 名" : "0 名";
  if (multiRegEl) multiRegEl.textContent = visitedRegions.length >= 2 ? "1 名" : "0 名";

  // 台帳財務
  const ptsGrantEl = document.getElementById("analytics-pts-granted");
  const ptsConsEl = document.getElementById("analytics-pts-consumed");
  const ptsBalEl = document.getElementById("analytics-pts-balance");
  const rewCostEl = document.getElementById("analytics-rewards-cost");

  let grantSum = 0;
  let consSum = 0;
  if (m && m.ledger) {
    m.ledger.forEach(l => {
      if (l.amount > 0) grantSum += l.amount;
      else consSum += Math.abs(l.amount);
    });
  } else {
    grantSum = m ? m.points : 100;
  }

  if (ptsGrantEl) ptsGrantEl.textContent = `${grantSum.toLocaleString()} pt`;
  if (ptsConsEl) ptsConsEl.textContent = `${consSum.toLocaleString()} pt`;
  if (ptsBalEl) ptsBalEl.textContent = `${(grantSum - consSum).toLocaleString()} pt`;
  if (rewCostEl) rewCostEl.textContent = `¥${(consSum * 0.8).toLocaleString()}`;
}

function renderReservations() {
  const tbody = document.getElementById("table-reservations-body");
  if (!tbody) return;

  const m = getMemberSessionData();
  let resList = m && m.reservations ? m.reservations : [];

  // 施設担当者モード時は自施設（那須ミッドシティホテル: FAC_C001 / C001）のみフィルタリング
  if (currentAdminRole === "facilityStaff_C001") {
    resList = resList.filter(r => r.facilityId === "FAC_C001" || r.facilityId === "C001" || (r.facilityName && r.facilityName.includes("那須ミッドシティ")));
  }

  if (resList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: #888;">受取予約データはありません。</td></tr>`;
    return;
  }

  tbody.innerHTML = resList.map(r => {
    const isCompleted = (r.status === "completed");
    return `
      <tr>
        <td><strong>${escapeHtml(r.code)}</strong></td>
        <td>${escapeHtml(m ? m.nickname : '会員')}</td>
        <td><strong>${escapeHtml(r.goodsName)}</strong></td>
        <td>${escapeHtml(r.facilityName)}</td>
        <td>${r.qty} 点</td>
        <td>${r.expireDate}</td>
        <td>
          <span class="status-pill ${isCompleted ? 'status-active' : 'status-pending'}">
            ${isCompleted ? '受取完了' : '確保済み（受付中）'}
          </span>
        </td>
        <td>
          ${isCompleted ? `
            <span style="font-size: 11px; color: #00875a; font-weight: 700;">✔ 消込済</span>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="completeReservation('${r.id}')">
              受渡完了（消込）
            </button>
          `}
        </td>
      </tr>
    `;
  }).join("");
}

function completeReservation(reservationId) {
  const m = getMemberSessionData();
  if (!m || !m.reservations) return;

  const res = m.reservations.find(r => r.id === reservationId);
  if (res) {
    if (confirm(`引換コード【${res.code}】の商品「${res.goodsName}」をお客様に受け渡しましたか？\nステータスを受取完了に更新します。`)) {
      res.status = "completed";
      res.completedAt = new Date().toISOString();
      localStorage.setItem("goen_girl_member_session_v2", JSON.stringify(m));
      renderReservations();
      alert("受渡完了の消込を行いました！");
    }
  }
}

window.completeReservation = completeReservation;

/**
 * ご縁ひろば・通報モデレーション管理
 */
function renderAdminHiroba() {
  const reportsTable = document.getElementById("table-reports-body");
  const postsTable = document.getElementById("table-admin-posts-body");
  const countBadge = document.getElementById("admin-reports-count-badge");

  // LocalStorageからデータ取得
  let reports = [];
  let posts = [];
  try {
    reports = JSON.parse(localStorage.getItem("goen_hiroba_reports_v1")) || [];
  } catch(e) {}
  try {
    posts = JSON.parse(localStorage.getItem("goen_hiroba_posts_v1")) || [];
  } catch(e) {}

  if (countBadge) {
    const pendingCount = reports.filter(r => r.status === "pending").length;
    countBadge.textContent = `未対応通報 ${pendingCount}件`;
    countBadge.className = pendingCount > 0 ? "badge badge-warning" : "badge badge-success";
  }

  // 通報キューの描画
  if (reportsTable) {
    if (reports.length === 0) {
      reportsTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888; padding: 20px;">現在、通報されている投稿はありません。健全に運用されています。</td></tr>`;
    } else {
      reportsTable.innerHTML = reports.map(r => {
        const post = posts.find(p => p.id === r.postId);
        const postTitle = post ? (post.title || post.content.substring(0, 30) + "...") : "(削除済み投稿)";
        const isPending = (r.status === "pending");

        return `
          <tr>
            <td><small>${r.createdAt}</small></td>
            <td><strong style="color: #de350b;">${escapeHtml(r.reason)}</strong></td>
            <td>
              <div style="font-weight: 600; font-size: 12px;">${escapeHtml(postTitle)}</div>
              <small style="color: #888;">ID: ${r.postId}</small>
            </td>
            <td>
              <div style="font-size: 11px;">通報者: ${r.reporterId}</div>
              <div style="font-size: 11px; color: #555;">${escapeHtml(r.detail || "（詳細記述なし）")}</div>
            </td>
            <td>
              <span class="badge ${isPending ? 'badge-warning' : 'badge-success'}">
                ${isPending ? '要対応' : '対応完了'}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 6px;">
                ${isPending ? `
                  <button class="btn btn-sm" style="background: #de350b; color: #fff;" onclick="hidePostFromAdmin('${r.postId}', '${r.id}')">投稿を非表示</button>
                  <button class="btn btn-secondary btn-sm" onclick="dismissReport('${r.id}')">問題なし(完了)</button>
                ` : `
                  <span style="font-size: 11px; color: #888;">対応済</span>
                `}
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  // 投稿全件一覧の描画
  if (postsTable) {
    if (posts.length === 0) {
      postsTable.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #888; padding: 20px;">投稿データがありません。</td></tr>`;
    } else {
      const catLabels = {
        trip: "旅の思い出",
        oshi: "推しガール自慢",
        goods: "グッズ写真",
        report: "聖地巡礼レポ",
        official: "運営便り"
      };

      postsTable.innerHTML = posts.map(p => {
        const isHidden = (p.status === "hidden");
        return `
          <tr style="${isHidden ? 'opacity: 0.6; background: #fff5f5;' : ''}">
            <td><small>${p.createdAt}</small></td>
            <td><span class="badge badge-info">${catLabels[p.category] || p.category}</span></td>
            <td>
              <strong>${escapeHtml(p.authorName)}</strong>
              <small style="display: block; color: #888;">(${p.authorPlan})</small>
            </td>
            <td>
              <div style="font-size: 12px;">${escapeHtml(p.characterName || "全キャラ")}</div>
              <small style="color: #666;">${escapeHtml(p.facilityName || "-")}</small>
            </td>
            <td style="max-width: 200px;">
              <div style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.content)}</div>
              ${p.images && p.images.length > 0 ? `<small style="color: #0052cc;">📷 写真${p.images.length}枚</small>` : ''}
            </td>
            <td>
              <span style="font-size: 11px;">${p.visibility === "supporter" ? '🔒 会員限定' : '全体公開'}</span>
            </td>
            <td>
              <span class="badge ${isHidden ? 'badge-danger' : 'badge-success'}">
                ${isHidden ? '非表示中' : '公開中'}
              </span>
            </td>
            <td>
              <button class="btn btn-sm ${isHidden ? 'btn-secondary' : 'btn-warning'}" onclick="togglePostVisibility('${p.id}')">
                ${isHidden ? '再公開する' : '非表示にする'}
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }
  }
}

function hidePostFromAdmin(postId, reportId) {
  try {
    const posts = JSON.parse(localStorage.getItem("goen_hiroba_posts_v1")) || [];
    const p = posts.find(x => x.id === postId);
    if (p) {
      p.status = "hidden";
      localStorage.setItem("goen_hiroba_posts_v1", JSON.stringify(posts));
    }
    const reports = JSON.parse(localStorage.getItem("goen_hiroba_reports_v1")) || [];
    const r = reports.find(x => x.id === reportId);
    if (r) {
      r.status = "resolved";
      localStorage.setItem("goen_hiroba_reports_v1", JSON.stringify(reports));
    }
    renderAdminHiroba();
    alert("投稿を非表示にし、通報を対応済みにしました。");
  } catch(e) {
    console.error(e);
  }
}

function dismissReport(reportId) {
  try {
    const reports = JSON.parse(localStorage.getItem("goen_hiroba_reports_v1")) || [];
    const r = reports.find(x => x.id === reportId);
    if (r) {
      r.status = "dismissed";
      localStorage.setItem("goen_hiroba_reports_v1", JSON.stringify(reports));
    }
    renderAdminHiroba();
    alert("通報を対応済み（問題なし）に更新しました。");
  } catch(e) {
    console.error(e);
  }
}

function togglePostVisibility(postId) {
  try {
    const posts = JSON.parse(localStorage.getItem("goen_hiroba_posts_v1")) || [];
    const p = posts.find(x => x.id === postId);
    if (p) {
      p.status = (p.status === "hidden") ? "active" : "hidden";
      localStorage.setItem("goen_hiroba_posts_v1", JSON.stringify(posts));
      renderAdminHiroba();
      alert(`投稿を【${p.status === "hidden" ? "非表示" : "公開"}】に変更しました。`);
    }
  } catch(e) {
    console.error(e);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

window.renderAdminHiroba = renderAdminHiroba;
window.hidePostFromAdmin = hidePostFromAdmin;
window.dismissReport = dismissReport;
window.togglePostVisibility = togglePostVisibility;

