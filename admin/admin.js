// Clean Data Template (Empty for production / testing)
const DEFAULT_DATA = {
  companies: [],
  panels: [],
  goods: [],
  payments: []
};

// State Manager
class AdminStore {
  constructor() {
    this.storageKey = "goen_girl_admin_db_v1";
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.companies) {
          this.save(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse localStorage", e);
    }
    this.save(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
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
});

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
        goods: "グッズ情報・在庫管理"
      };
      document.getElementById("page-title").textContent = titleMap[tabId] || "管理コンソール";
    });
  });
}

function setupEventListeners() {
  // Reset / Clear All Data Button
  const resetBtn = document.getElementById("btn-reset-data");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("⚠️ すべての提携店舗・パネル・売上データを完全に消去（クリア）しますか？\n\n・提携企業・店舗データ: 0件\n・パネル設置情報: 0件\n・会員巡礼スポット: 0件\nになります。新規入力テストをゼロから行えます。")) {
        store.clearAll();
        renderAll();
        alert("すべての仮データを消去しました！\n「＋ 新規提携先を登録」から新しい店舗・住所・パネル画像を入力してテストしてください。");
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

  const charSelect = document.getElementById("form-company-character");
  const customCharInput = document.getElementById("form-company-custom-char");
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

  const CHAR_IMAGE_MAP = {
    "那須乃つつじ": "../assets/nasuno-tsutsuji.png",
    "狩野みるく": "../assets/karino-milk.png",
    "大俵ちか": "../assets/otawara-chika.png"
  };

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
      if (panelFilenameLabel) panelFilenameLabel.textContent = "画像未選択（パソコンから選択するか、キャラクターを選択してください）";
    }
  }

  // Handle Character Dropdown Change
  if (charSelect) {
    charSelect.addEventListener("change", () => {
      const val = charSelect.value;
      if (val === "__custom__") {
        if (customCharInput) {
          customCharInput.style.display = "block";
          customCharInput.focus();
        }
      } else {
        if (customCharInput) customCharInput.style.display = "none";
        if (val && CHAR_IMAGE_MAP[val]) {
          setPanelImage(CHAR_IMAGE_MAP[val], `${val} 公式パネル画像`);
        }
      }
    });
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
      if (customCharInput) {
        customCharInput.value = "";
        customCharInput.style.display = "none";
      }
      if (charSelect) charSelect.value = "";
      setPanelImage("", "");
      if (panelFileInput) panelFileInput.value = "";

      document.getElementById("modal-company-title").textContent = "新規提携企業・店舗の登録";
      modalCompany.classList.add("open");
    });
  }

  const closeModal = () => modalCompany.classList.remove("open");
  if (modalCompanyClose) modalCompanyClose.addEventListener("click", closeModal);
  if (modalCompanyCancel) modalCompanyCancel.addEventListener("click", closeModal);

  if (formCompany) {
    formCompany.addEventListener("submit", (e) => {
      e.preventDefault();
      const editId = document.getElementById("company-edit-id").value;

      // Determine character name
      let charName = charSelect.value;
      if (charName === "__custom__") {
        charName = customCharInput.value.trim() || "オリジナルキャラクター";
      }
      if (!charName) {
        charName = "那須乃つつじ";
      }

      // Determine panel image
      let charImg = panelImgDataInput.value;
      if (!charImg) {
        charImg = CHAR_IMAGE_MAP[charName] || "../assets/nasuno-tsutsuji.png";
      }
      
      let latVal = parseFloat(document.getElementById("form-company-lat").value);
      let lngVal = parseFloat(document.getElementById("form-company-lng").value);
      if (isNaN(latVal) || isNaN(lngVal)) {
        latVal = 36.9500;
        lngVal = 140.0000;
      }

      const panelTypeVal = document.getElementById("form-company-panel").value || "等身大パネル";

      const formData = {
        name: document.getElementById("form-company-name").value,
        industry: document.getElementById("form-company-industry").value,
        representative: document.getElementById("form-company-rep").value,
        phone: document.getElementById("form-company-phone").value,
        email: document.getElementById("form-company-email").value,
        address: document.getElementById("form-company-address").value,
        lat: latVal,
        lng: lngVal,
        character: charName,
        characterImg: charImg,
        panelType: panelTypeVal,
        plan: document.getElementById("form-company-plan").value,
        status: document.getElementById("form-company-status").value
      };

      if (editId) {
        // Update existing
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
        }
      } else {
        // Create new
        const newId = "C" + String(store.data.companies.length + 1).padStart(3, "0");
        const newCompany = {
          id: newId,
          ...formData,
          startDate: new Date().toISOString().split("T")[0],
          nextRenewal: new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
          monthlyFee: formData.plan.includes("月払い") ? 11000 : 0,
          initialPaid: 150000,
          annualPaid: formData.plan.includes("一括") ? 110000 : 0,
          totalAmount: formData.plan.includes("一括") ? 260000 : 150000,
          paymentStatus: "正常入金"
        };
        store.data.companies.unshift(newCompany);

        // Add panel with accurate GPS
        store.data.panels.push({
          id: "PN-" + String(store.data.panels.length + 1).padStart(3, "0"),
          companyId: newId,
          companyName: formData.name,
          character: formData.character,
          costume: panelTypeVal,
          serial: "GG-" + newId,
          lat: latVal,
          lng: lngVal,
          status: "稼働中",
          condition: "良好"
        });
      }

      store.save();
      closeModal();
      renderAll();
      alert(`「${formData.name}」の提携情報、GPS座標（緯度: ${latVal.toFixed(4)}, 経度: ${lngVal.toFixed(4)}）、パネル画像を保存しました！\nファン側のパネル読み込み機能と即時連携されます。`);
    });
  }
}

function renderAll() {
  renderKPIs();
  renderCompanies();
  renderSales();
  renderPayments();
  renderPanels();
  renderGoods();
}

function renderKPIs() {
  const companies = store.data.companies;
  const activeCount = companies.filter(c => c.status === "契約中").length;
  const panelsCount = store.data.panels.filter(p => p.status === "稼働中").length;
  
  // Total Revenue calculation
  let totalRevenue = companies.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  let monthlyRecurring = companies.filter(c => c.status === "契約中" && c.plan.includes("月払い")).length * 11000;

  document.getElementById("kpi-company-count").textContent = `${activeCount} 社`;
  document.getElementById("kpi-company-sub").textContent = `全提携申請 ${companies.length} 件（審査中 ${companies.length - activeCount} 件）`;

  document.getElementById("kpi-panel-count").textContent = `${panelsCount} 台`;
  document.getElementById("kpi-panel-sub").textContent = `那須町・那須塩原市・大田原市で稼働中`;

  document.getElementById("kpi-total-revenue").textContent = `¥${totalRevenue.toLocaleString()}`;
  document.getElementById("kpi-monthly-mrr").textContent = `月額サブスク収益: ¥${monthlyRecurring.toLocaleString()}/月`;

  document.getElementById("kpi-renewal-rate").textContent = `100%`;
  document.getElementById("kpi-renewal-sub").textContent = `契約満了前の離脱 0件 (1年自動更新)`;
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
          <span>画面右上の「＋ 新規提携先を登録」から、店舗名・住所・パネル画像を登録してテストしてください。</span>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(c => {
    const statusClass = c.status === "契約中" ? "status-active" : (c.status === "審査中" ? "status-pending" : "status-alert");
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
          <br><small style="color: #6b778c;">${escapeHtml(c.panelType || "等身大")}</small>
        </td>
        <td>${escapeHtml(c.plan)}</td>
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
  const panelImgPreview = document.getElementById("company-panel-preview");
  const charPreviewName = document.getElementById("preview-char-name");

  if (latInput) latInput.value = c.lat !== undefined ? Number(c.lat).toFixed(6) : "";
  if (lngInput) lngInput.value = c.lng !== undefined ? Number(c.lng).toFixed(6) : "";
  if (gpsHint) {
    if (c.lat && c.lng) {
      gpsHint.style.color = "#2e7d32";
      gpsHint.textContent = `📍 登録済みGPS座標: (緯度: ${Number(c.lat).toFixed(4)}, 経度: ${Number(c.lng).toFixed(4)})`;
    } else {
      gpsHint.textContent = "";
    }
  }

  const charSelect = document.getElementById("form-company-character");
  const customCharInput = document.getElementById("form-company-custom-char");
  const CHAR_IMAGE_MAP = {
    "那須乃つつじ": "../assets/nasuno-tsutsuji.png",
    "狩野みるく": "../assets/karino-milk.png",
    "大俵ちか": "../assets/otawara-chika.png"
  };

  if (CHAR_IMAGE_MAP[c.character]) {
    charSelect.value = c.character;
    if (customCharInput) customCharInput.style.display = "none";
  } else {
    charSelect.value = "__custom__";
    if (customCharInput) {
      customCharInput.value = c.character || "";
      customCharInput.style.display = "block";
    }
  }

  const previewSrc = c.characterImg || CHAR_IMAGE_MAP[c.character] || "";
  setPanelImage(previewSrc, `${c.character} 登録パネル画像`);

  document.getElementById("form-company-panel").value = c.panelType || "";
  document.getElementById("form-company-plan").value = c.plan;
  document.getElementById("form-company-status").value = c.status;

  document.getElementById("modal-company-title").textContent = `提携情報編集: ${c.name}`;
  document.getElementById("modal-company").classList.add("open");
}

function deleteCompany(id) {
  if (confirm("この企業・店舗データを削除しますか？関連するパネル情報も整理されます。")) {
    store.data.companies = store.data.companies.filter(c => c.id !== id);
    store.data.panels = store.data.panels.filter(p => p.companyId !== id);
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
    return `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.plan}</td>
        <td>¥${(c.initialPaid || 0).toLocaleString()}</td>
        <td>${c.monthlyFee ? `¥${c.monthlyFee.toLocaleString()}/月` : `一括前払済`}</td>
        <td><strong style="color: #0052cc;">¥${(c.totalAmount || 0).toLocaleString()}</strong></td>
        <td>${c.nextRenewal}</td>
        <td><span class="status-pill status-active">継続契約中</span></td>
      </tr>
    `;
  }).join("");
}

function renderPayments() {
  const paymentTableBody = document.getElementById("table-payments-body");
  if (!paymentTableBody) return;

  if (store.data.payments.length === 0) {
    paymentTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #888;">決済・請求データはありません。</td></tr>`;
    return;
  }

  paymentTableBody.innerHTML = store.data.payments.map(p => {
    const statusClass = p.status === "入金済" ? "status-active" : (p.status === "請求中" ? "status-pending" : "status-alert");
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${escapeHtml(p.companyName)}</td>
        <td>${escapeHtml(p.billingItem)}</td>
        <td><strong>¥${p.amount.toLocaleString()}</strong></td>
        <td>${p.method}</td>
        <td>${p.dueDate}</td>
        <td>${p.paidDate}</td>
        <td><span class="status-pill ${statusClass}">${p.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="togglePaymentStatus('${p.id}')">
            ${p.status === "入金済" ? "取消" : "入金済みにする"}
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
    panelTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #888;">設置パネルデータはありません。店舗を登録すると自動でパネルが生成されます。</td></tr>`;
    return;
  }

  panelTableBody.innerHTML = store.data.panels.map(p => {
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${escapeHtml(p.serial)}</td>
        <td><strong>${escapeHtml(p.character)}</strong></td>
        <td>${escapeHtml(p.costume)}</td>
        <td>${escapeHtml(p.companyName)}</td>
        <td><small>${(p.lat || 0).toFixed(4)}, ${(p.lng || 0).toFixed(4)}</small></td>
        <td><span class="status-pill ${p.status === '稼働中' ? 'status-active' : 'status-pending'}">${p.status}</span></td>
        <td>${p.condition}</td>
      </tr>
    `;
  }).join("");
}

function renderGoods() {
  const goodsTableBody = document.getElementById("table-goods-body");
  if (!goodsTableBody) return;

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
        <td>${g.shippedTotal} 個</td>
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
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Global functions for inline onclick handlers
window.editCompany = editCompany;
window.deleteCompany = deleteCompany;
window.togglePaymentStatus = togglePaymentStatus;
window.adjustStock = adjustStock;
