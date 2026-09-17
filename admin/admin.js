// Initial Mock Data
const DEFAULT_DATA = {
  companies: [
    {
      id: "C001",
      name: "那須温泉神社",
      industry: "寺社・宗教法人",
      representative: "宮司 那須 健一",
      phone: "0287-76-2301",
      email: "info@nasu-shrine.jp",
      address: "栃木県那須郡那須町湯本182",
      status: "契約中",
      plan: "年間契約（一括前払い）",
      startDate: "2026-04-01",
      nextRenewal: "2027-03-31",
      character: "那須乃つつじ",
      panelType: "等身大（巫女Ver.）",
      monthlyFee: 0,
      initialPaid: 150000,
      annualPaid: 110000,
      totalAmount: 260000,
      paymentStatus: "入金済"
    },
    {
      id: "C002",
      name: "那須高原 森のカフェ ベルツ",
      industry: "飲食店",
      representative: "高橋 陽子",
      phone: "0287-78-1122",
      email: "cafe@belz-nasu.com",
      address: "栃木県那須郡那須町高久乙1200",
      status: "契約中",
      plan: "年間契約（月払い）",
      startDate: "2026-05-15",
      nextRenewal: "2027-05-14",
      character: "那須乃つつじ",
      panelType: "SDパネル（エプロンVer.）",
      monthlyFee: 11000,
      initialPaid: 150000,
      annualPaid: 0,
      totalAmount: 194000,
      paymentStatus: "正常入金"
    },
    {
      id: "C003",
      name: "千本松牧場 レストラン",
      industry: "観光・レジャー施設",
      representative: "斉藤 達也",
      phone: "0287-36-1025",
      email: "senbonmatsu@farm.co.jp",
      address: "栃木県那須塩原市千本松799",
      status: "契約中",
      plan: "年間契約（一括前払い）",
      startDate: "2026-04-10",
      nextRenewal: "2027-04-09",
      character: "狩野みるく",
      panelType: "等身大（スーツVer.）",
      monthlyFee: 0,
      initialPaid: 150000,
      annualPaid: 110000,
      totalAmount: 260000,
      paymentStatus: "入金済"
    },
    {
      id: "C004",
      name: "塩原温泉 湯守田中屋",
      industry: "ホテル・旅館",
      representative: "田中 健太郎",
      phone: "0287-32-3232",
      email: "tanakaya@shiobara-onsen.jp",
      address: "栃木県那須塩原市塩原328",
      status: "契約中",
      plan: "年間契約（月払い）",
      startDate: "2026-06-01",
      nextRenewal: "2027-05-31",
      character: "狩野みるく",
      panelType: "等身大（浴衣Ver.）",
      monthlyFee: 11000,
      initialPaid: 150000,
      annualPaid: 0,
      totalAmount: 183000,
      paymentStatus: "正常入金"
    },
    {
      id: "C005",
      name: "道の駅 那須与一の郷",
      industry: "自治体・DMO / 小売",
      representative: "大田原 敏夫",
      phone: "0287-54-1110",
      email: "yoichi@michinoeki.ohtawara.jp",
      address: "栃木県大田原市南金丸268-6",
      status: "契約中",
      plan: "年間契約（一括前払い）",
      startDate: "2026-04-20",
      nextRenewal: "2027-04-19",
      character: "大俵ちか",
      panelType: "等身大（甲冑弓道Ver.）",
      monthlyFee: 0,
      initialPaid: 150000,
      annualPaid: 110000,
      totalAmount: 260000,
      paymentStatus: "入金済"
    },
    {
      id: "C006",
      name: "黒羽城址 前田屋",
      industry: "飲食店 / 小売",
      representative: "前田 忠雄",
      phone: "0287-54-3388",
      email: "maedaya@kurobane.com",
      address: "栃木県大田原市前田987",
      status: "審査中",
      plan: "年間契約（月払い）予定",
      startDate: "2026-10-01",
      nextRenewal: "2027-09-30",
      character: "大俵ちか",
      panelType: "SDパネル（和装Ver.）",
      monthlyFee: 11000,
      initialPaid: 0,
      annualPaid: 0,
      totalAmount: 0,
      paymentStatus: "請求前"
    }
  ],
  panels: [
    { id: "PN-001", companyId: "C001", companyName: "那須温泉神社", character: "那須乃つつじ", costume: "巫女装束Ver.", serial: "GG-NS-001", lat: 37.1002, lng: 139.9678, status: "稼働中", condition: "良好" },
    { id: "PN-002", companyId: "C002", companyName: "那須高原 森のカフェ ベルツ", character: "那須乃つつじ", costume: "エプロンVer.(SD)", serial: "GG-NS-002", lat: 37.0655, lng: 139.9921, status: "稼働中", condition: "良好" },
    { id: "PN-003", companyId: "C003", companyName: "千本松牧場 レストラン", character: "狩野みるく", costume: "フォーマルスーツVer.", serial: "GG-SB-001", lat: 36.9123, lng: 139.9542, status: "稼働中", condition: "良好" },
    { id: "PN-004", companyId: "C004", companyName: "塩原温泉 湯守田中屋", character: "狩野みるく", costume: "温泉浴衣Ver.", serial: "GG-SB-002", lat: 36.9688, lng: 139.8155, status: "稼働中", condition: "良好" },
    { id: "PN-005", companyId: "C005", companyName: "道の駅 那須与一の郷", character: "大俵ちか", costume: "那須与一弓道着Ver.", serial: "GG-OT-001", lat: 36.8542, lng: 140.0631, status: "稼働中", condition: "良好" },
    { id: "PN-006", companyId: "C006", companyName: "黒羽城址 前田屋", character: "大俵ちか", costume: "黒羽茶屋和装Ver.(SD)", serial: "GG-OT-002", lat: 36.8711, lng: 140.1245, status: "準備中", condition: "未設置" }
  ],
  goods: [
    { id: "GD-001", name: "ご縁結び御朱印カード (那須乃つつじ)", character: "那須乃つつじ", category: "カード", wholesalePrice: 280, retailPrice: 500, stock: 420, shippedTotal: 180 },
    { id: "GD-002", name: "アクリルスタンド (那須乃つつじ 巫女Ver.)", character: "那須乃つつじ", category: "アクスタ", wholesalePrice: 850, retailPrice: 1500, stock: 150, shippedTotal: 90 },
    { id: "GD-003", name: "限定木製コースター (那須乃つつじ SD)", character: "那須乃つつじ", category: "コースター", wholesalePrice: 200, retailPrice: 400, stock: 260, shippedTotal: 140 },
    { id: "GD-004", name: "みるくアイススプーン (狩野みるく)", character: "狩野みるく", category: "食器", wholesalePrice: 320, retailPrice: 600, stock: 310, shippedTotal: 190 },
    { id: "GD-005", name: "アクリルキーホルダー (狩野みるく スーツVer.)", character: "狩野みるく", category: "アクキー", wholesalePrice: 380, retailPrice: 700, stock: 180, shippedTotal: 120 },
    { id: "GD-006", name: "温泉手ぬぐい (狩野みるく 浴衣Ver.)", character: "狩野みるく", category: "手ぬぐい", wholesalePrice: 450, retailPrice: 800, stock: 140, shippedTotal: 80 },
    { id: "GD-007", name: "与一の矢 アクリルチャーム (大俵ちか)", character: "大俵ちか", category: "チャーム", wholesalePrice: 380, retailPrice: 700, stock: 210, shippedTotal: 110 },
    { id: "GD-008", name: "ご縁缶バッジ (大俵ちか)", character: "大俵ちか", category: "缶バッジ", wholesalePrice: 150, retailPrice: 300, stock: 500, shippedTotal: 250 }
  ],
  payments: [
    { id: "INV-202609-01", companyName: "那須温泉神社", billingItem: "年間利用料（一括更新前払い）", amount: 110000, dueDate: "2026-03-25", paidDate: "2026-03-22", status: "入金済", method: "銀行振込" },
    { id: "INV-202609-02", companyName: "千本松牧場 レストラン", billingItem: "等身大パネル設置費 + 年間利用料", amount: 260000, dueDate: "2026-04-05", paidDate: "2026-04-02", status: "入金済", method: "銀行振込" },
    { id: "INV-202609-03", companyName: "道の駅 那須与一の郷", billingItem: "等身大パネル設置費 + 年間利用料", amount: 260000, dueDate: "2026-04-15", paidDate: "2026-04-12", status: "入金済", method: "銀行振込" },
    { id: "INV-202609-04", companyName: "森のカフェ ベルツ", billingItem: "PR動画・SNS配信 月額利用料（9月度）", amount: 11000, dueDate: "2026-09-30", paidDate: "2026-09-15", status: "入金済", method: "クレジットカード" },
    { id: "INV-202609-05", companyName: "塩原温泉 湯守田中屋", billingItem: "PR動画・SNS配信 月額利用料（9月度）", amount: 11000, dueDate: "2026-09-30", paidDate: "-", status: "請求中", method: "クレジットカード" },
    { id: "INV-202609-06", companyName: "黒羽城址 前田屋", billingItem: "初回パネル制作費見積", amount: 150000, dueDate: "2026-10-10", paidDate: "-", status: "審査・見積中", method: "銀行振込" }
  ]
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
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse localStorage", e);
    }
    this.save(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  save(data) {
    this.data = data || this.data;
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  reset() {
    localStorage.removeItem(this.storageKey);
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
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
  // Reset Data Button
  const resetBtn = document.getElementById("btn-reset-data");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("データを初期サンプル状態にリセットしますか？追加・編集した内容が初期化されます。")) {
        store.reset();
        renderAll();
        alert("データを初期化しました。");
      }
    });
  }

  // Company Search & Filter
  const companySearch = document.getElementById("company-search");
  const companyStatusFilter = document.getElementById("company-status-filter");
  if (companySearch) companySearch.addEventListener("input", renderCompanies);
  if (companyStatusFilter) companyStatusFilter.addEventListener("change", renderCompanies);

  // New Company Modal
  const btnNewCompany = document.getElementById("btn-new-company");
  const modalCompany = document.getElementById("modal-company");
  const modalCompanyClose = document.getElementById("modal-company-close");
  const modalCompanyCancel = document.getElementById("modal-company-cancel");
  const formCompany = document.getElementById("form-company");

  if (btnNewCompany) {
    btnNewCompany.addEventListener("click", () => {
      formCompany.reset();
      document.getElementById("company-edit-id").value = "";
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
      const formData = {
        name: document.getElementById("form-company-name").value,
        industry: document.getElementById("form-company-industry").value,
        representative: document.getElementById("form-company-rep").value,
        phone: document.getElementById("form-company-phone").value,
        email: document.getElementById("form-company-email").value,
        address: document.getElementById("form-company-address").value,
        character: document.getElementById("form-company-character").value,
        panelType: document.getElementById("form-company-panel").value,
        plan: document.getElementById("form-company-plan").value,
        status: document.getElementById("form-company-status").value
      };

      if (editId) {
        // Update existing
        const index = store.data.companies.findIndex(c => c.id === editId);
        if (index !== -1) {
          store.data.companies[index] = { ...store.data.companies[index], ...formData };
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

        // Add panel
        store.data.panels.push({
          id: "PN-" + String(store.data.panels.length + 1).padStart(3, "0"),
          companyId: newId,
          companyName: formData.name,
          character: formData.character,
          costume: formData.panelType,
          serial: "GG-" + newId,
          lat: 36.9 + Math.random() * 0.2,
          lng: 139.9 + Math.random() * 0.2,
          status: "稼働中",
          condition: "良好"
        });
      }

      store.save();
      closeModal();
      renderAll();
      alert("保存しました。");
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
    const matchSearch = c.name.toLowerCase().includes(searchQuery) || 
                        c.address.toLowerCase().includes(searchQuery) ||
                        c.representative.toLowerCase().includes(searchQuery) ||
                        c.character.toLowerCase().includes(searchQuery);
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
  document.getElementById("form-company-character").value = c.character;
  document.getElementById("form-company-panel").value = c.panelType;
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

  panelTableBody.innerHTML = store.data.panels.map(p => {
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${escapeHtml(p.serial)}</td>
        <td><strong>${escapeHtml(p.character)}</strong></td>
        <td>${escapeHtml(p.costume)}</td>
        <td>${escapeHtml(p.companyName)}</td>
        <td><small>${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</small></td>
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
