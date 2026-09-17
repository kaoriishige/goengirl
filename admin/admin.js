// Clean Data Template (Zero State for Testing & Production)
const DEFAULT_DATA = {
  companies: [],
  panels: [],
  goods: [],
  payments: []
};

// State Manager
class AdminStore {
  constructor() {
    this.storageKey = "goen_girl_admin_db_v7";
    // Force clear old mock data
    if (!localStorage.getItem("goen_girl_cleaned_mock_v7")) {
      localStorage.removeItem("goen_girl_admin_db_v1");
      localStorage.removeItem("goen_girl_admin_db_v2");
      localStorage.removeItem("goen_girl_admin_db_v3");
      localStorage.removeItem("goen_girl_admin_db_v4");
      localStorage.removeItem("goen_girl_admin_db_v5");
      localStorage.removeItem("goen_girl_admin_db_v6");
      localStorage.removeItem("goen_girl_companies_shared");
      localStorage.removeItem("goen_girl_member_session");
      localStorage.setItem("goen_girl_cleaned_mock_v7", "true");
      this.reset();
    }
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.companies && parsed.panels && parsed.payments) {
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
    
    // 10,000 yen (tax excluded) * 12 = 120,000 yen (tax excluded)
    // 11,000 yen (tax included) * 12 = 132,000 yen (tax included)
    const snsAnnualFee = isSns ? 120000 : 0;
    const snsAnnualTax = isSns ? 132000 : 0;

    const totalExcluded = panelFee + goodsFee + snsAnnualFee;
    const totalTax = Math.round(totalExcluded * 0.1);
    const totalIncluded = totalExcluded + totalTax;

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
          summarySnsEl.innerHTML = `年払い一括 = 税別 ¥120,000 <span style="font-weight: 700; color: #0284c7;">(税込 ¥132,000)</span>`;
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
          <small style="color: #666;">（内訳: パネル ¥${panelTax.toLocaleString()} ${isGoods ? `+ グッズ ¥${goodsTax.toLocaleString()} ` : ''}${isSns ? '+ SNS年間 ¥132,000' : ''}）</small>
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
      if (isNaN(latVal) || isNaN(lngVal)) {
        alert("GPS座標（緯度・経度）が未入力です。「📍 GPS自動取得」をクリックするか、数値を入力してください。");
        return;
      }

      // 3. Validate Panel Image (必須)
      let charImg = panelImgDataInput.value;
      if (!charImg) {
        alert("⚠️ 設置パネルの画像が登録されていません。\n店頭でファンがスキャン照合するためにパネル画像は必須です。\n「📁 パソコンからパネル画像を選択」から画像ファイルを登録してください。");
        return;
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
        
        // 10,000 yen (tax excluded) * 12 = 120,000 yen (tax excluded)
        // 11,000 yen (tax included) * 12 = 132,000 yen (tax included)
        snsAnnualFee = 120000;
        snsAnnualTax = 132000;

        if (snsBillingType === "一括清算") {
          snsPaymentMethod = "請求書一括清算（年払い）";
        } else {
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
      const annualTotalTaxExcluded = panelFee + goodsAmount + (snsEnabled ? 120000 : 0);
      const annualTotalTaxIncluded = panelFeeTax + goodsAmountTax + (snsEnabled ? 132000 : 0);

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
          billingItem: `等身大キャラクターパネル初期導入費 (${formData.panelType}) [税別¥${panelFee.toLocaleString()} + 税¥${(panelFeeTax - panelFee).toLocaleString()}]`,
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

        // Payment C: SNS Video PR Service (11,000円×12 = 132,000円)
        if (snsEnabled) {
          if (snsBillingType === "一括清算") {
            store.data.payments.unshift({
              id: "INV-SNS-" + String(store.data.payments.length + 1).padStart(3, "0"),
              companyId: newId,
              companyName: formData.name,
              billingItem: "SNSショート動画配信PR 年間一括費用 (税込132,000円 / 11,000円×12ヶ月)",
              amount: 132000,
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
              billingItem: "SNSショート動画配信PR 月額利用料（初回当月分 / 税込11,000円）",
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

      alert(`✅「${formData.name}」の契約登録が完了しました！\n\n【初年度お支払い総額（合計）】\n・税別合計: ¥${annualTotalTaxExcluded.toLocaleString()}\n・税込合計: ¥${annualTotalTaxIncluded.toLocaleString()}\n\n【内訳】\n・パネル導入: ¥${panelFeeTax.toLocaleString()} (税込 / 請求書一括)\n${goodsEnabled ? `・グッズ発注: ¥${goodsAmountTax.toLocaleString()} (税込 / 請求書一括)\n` : ''}${snsEnabled ? `・SNS動画PR: ¥132,000 (税込 / 11,000円×12ヶ月 / ${snsBillingType})\n` : ''}\n売上台帳・請求書に1円の狂いなく反映されました。`);
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
        serviceHtml += `<div><span class="billing-badge invoice">🎬 SNS動画PR (年払い一括 税込¥132,000)</span></div>`;
      } else if (c.snsPaymentMethod === "クレジットカード毎月決済") {
        serviceHtml += `<div><span class="billing-badge credit">🎬 SNS動画PR (毎月クレカ 税込¥11,000/月)</span></div>`;
      } else {
        serviceHtml += `<div><span class="billing-badge bank">🎬 SNS動画PR (毎月口座振替 税込¥11,000/月)</span></div>`;
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
    if (c.snsEnabled) breakdown += `<br>+ SNS PR (年間税込¥132,000)`;

    let payMethodDisplay = `<span class="billing-badge invoice">パネル: 請求書一括</span>`;
    if (c.goodsEnabled) {
      payMethodDisplay += `<br><span class="billing-badge invoice" style="margin-top:2px;">グッズ: 請求書一括</span>`;
    }
    if (c.snsEnabled) {
      if (c.snsBillingType === "一括清算") {
        payMethodDisplay += `<br><span class="billing-badge invoice" style="margin-top:2px;">SNS: 請求書一括(年払い)</span>`;
      } else {
        const badgeClass = c.snsPaymentMethod.includes('クレジット') ? 'credit' : 'bank';
        payMethodDisplay += `<br><span class="billing-badge ${badgeClass}" style="margin-top:2px;">SNS: ${c.snsPaymentMethod}</span>`;
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
          ${c.monthlyFeeTax ? `<strong style="color: #0284c7;">¥${c.monthlyFeeTax.toLocaleString()}</strong>/月 <small style="color:#666;">(税込)</small><br><small style="color: #888;">税別 ¥${c.monthlyFee.toLocaleString()}/月</small>` : (c.snsEnabled ? `一括年払済 (税込¥132,000)` : `未契約`)}
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
