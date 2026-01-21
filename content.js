(function () {
    // 防止重複注入
    if (document.getElementById('ts-risk-panel')) return;

    // --- 0. 基礎設定與常數 ---
    const HOST = window.location.hostname;

    // [REMOVED] Domain checks - always active
    console.log("[TradingGuard] 初始化... (Global Mode)", { HOST });

    // 多語言字典 (I18n)
    const TRANSLATIONS = {
        'zh-TW': {
            'title': 'TradingGuard 🛡️ Universal',
            'checklist_title': 'CHECKLIST',
            'risk_title': 'RISK CALC (資金控管)',
            'symbol_label': '商品',
            'risk_label': '風險上限 ($)',
            'sl_label': '停損 (Pts)',
            'tp_label': '停利 (Pts)',
            'res_qty': '建議口數 (Max Qty):',
            'res_rr': '預期盈虧比 (R:R):',
            'journal_title': 'JOURNAL (紀錄)',
            'reason_ph': '進場理由 (例如: VWAP 回測)...',
            'auto_ss_label': '紀錄時自動截圖',
            'history_title': 'HISTORY',
            'btn_check': '⛔ 請完成檢查清單',
            'btn_risk': '⛔ 風險過高 / 停損太近',
            'btn_rr': '⛔ 盈虧比需 > 1',
            'btn_reason': '⛔ 請填寫理由',
            'btn_ready_confirm': '✅ 確認並紀錄', // Unified button text
            'settings_title': '設定 (Settings)',
            'lang_label': '語言 (Language)',
            'checklist_label': '自訂檢查清單 (每行一項)',
            'btn_save': '儲存 (Save)',
            'btn_cancel': '取消 (Cancel)',
            'unit_qty': '口',
            'clear_history': '🗑️',
            'confirm_clear': '確定要清除所有歷史紀錄嗎？',
            'stat_win': '勝率',
            'stat_count': '勝 / 負'
        },
        'en-US': {
            'title': 'TradingGuard 🛡️ Universal',
            'checklist_title': 'PRE-TRADE CHECKLIST',
            'risk_title': 'RISK CALCULATOR',
            'symbol_label': 'Symbol',
            'risk_label': 'Risk Limit ($)',
            'sl_label': 'Stop Loss (Pts)',
            'tp_label': 'Take Profit (Pts)',
            'res_qty': 'Max Size (Qty):',
            'res_rr': 'Reward/Risk (R:R):',
            'journal_title': 'TRADE JOURNAL',
            'reason_ph': 'Entry reason (e.g., VWAP bounce)...',
            'auto_ss_label': 'Auto Screenshot on Record',
            'history_title': 'HISTORY',
            'btn_check': '⛔ Complete Checklist',
            'btn_risk': '⛔ High Risk / Tight SL',
            'btn_rr': '⛔ R:R must be > 1',
            'btn_reason': '⛔ Enter Reason',
            'btn_ready_confirm': '✅ CONFIRM & LOG', // Unified button text
            'settings_title': 'SETTINGS',
            'lang_label': 'Language',
            'checklist_label': 'Custom Checklist (One per line)',
            'btn_save': 'Save',
            'btn_cancel': 'Cancel',
            'unit_qty': 'Contracts',
            'clear_history': '🗑️',
            'confirm_clear': 'Are you sure you want to clear all history?',
            'stat_win': 'Win Rate',
            'stat_count': 'Win / Loss'
        }
    };

    const SPECS = {
        'MNQ': { val: 2 }, 'NQ': { val: 20 }, 'MES': { val: 5 }, 'ES': { val: 50 },
        'RTY': { val: 10 }, 'M2K': { val: 1 }, 'CL': { val: 1000 }, 'MCL': { val: 100 },
        'GC': { val: 100 }, 'MGC': { val: 10 }, 'GENERIC': { val: 1 }
    };

    const DEFAULT_SETTINGS = {
        lang: 'zh-TW', // 或根據 navigator.language 判斷
        checklist: [
            "大趨勢方向一致 (Trend Aligned)",
            "無重大新聞 (No High Impact News)",
            "情緒穩定 (No Tilt)"
        ]
    };

    // 當前狀態
    let appSettings = { ...DEFAULT_SETTINGS };
    let cachedLogs = []; // Cache log data for stats calc
    let isVisible = true; // Default visible

    // --- 1. 建立 UI 結構 ---

    // A. FAB (Floating Action Button) - used to restore when minimized
    const fab = document.createElement('div');
    fab.id = 'ts-minimized-btn';
    fab.innerHTML = '🛡️';
    fab.title = 'Open TradingGuard';
    fab.classList.add('hidden'); // Initially hidden if panel is shown
    document.body.appendChild(fab);

    // B. Panel
    const panel = document.createElement('div');
    panel.id = 'ts-risk-panel';
    // Remove hidden class by default, or keep it depending on desired startup behavior. 
    // Let's keep it visible by default as requested "don't specify webpage".

    // HTML 結構 (主畫面 + 設定畫面)
    // [MODIFIED] Removed Lock Settings
    const panelContent = `
        <div id="ts-risk-header">
            <span data-i18n="title">TradingGuard 🛡️ Universal</span>
            <div class="ts-header-actions">
                <span id="ts-settings-btn">⚙️</span>
                <span id="ts-minimize-action" style="cursor:pointer; padding:0 5px;">_</span>
            </div>
        </div>
        
        <!-- 主畫面 -->
        <div id="ts-main-view" class="ts-view active">
            <div id="ts-risk-content">
                <div class="ts-section-title" data-i18n="checklist_title">CHECKLIST</div>
                <div id="checklist-container">
                    <!-- 動態生成檢查項目 -->
                </div>
                
                <div class="ts-section-title" data-i18n="risk_title">RISK CALC</div>
                <div class="ts-calc-row">
                    <div class="ts-input-group">
                        <label data-i18n="symbol_label">Symbol</label>
                        <select id="symbol-select">
                            <option value="MNQ">MNQ</option><option value="NQ">NQ</option>
                            <option value="MES">MES</option><option value="ES">ES</option>
                            <option value="GENERIC">Generic (x1)</option>
                        </select>
                    </div>
                    <div class="ts-input-group">
                        <label data-i18n="risk_label">Risk ($)</label>
                        <input type="number" id="risk-usd" placeholder="$" value="150">
                    </div>
                </div>
                <div class="ts-calc-row">
                    <div class="ts-input-group">
                        <label data-i18n="sl_label">Stop Loss</label>
                        <input type="number" id="sl-points" placeholder="pts" value="20">
                    </div>
                    <div class="ts-input-group">
                        <label data-i18n="tp_label">Take Profit</label>
                        <input type="number" id="tp-points" placeholder="pts" value="40">
                    </div>
                </div>

                <div class="calc-result">
                    <span data-i18n="res_qty">Max Qty:</span>
                    <span id="res-qty" class="result-highlight">0</span>
                </div>
                <div class="calc-result">
                    <span data-i18n="res_rr">R:R:</span>
                    <span id="res-rr">0.0</span>
                </div>

                <div class="ts-section-title" data-i18n="journal_title">JOURNAL</div>
                <div class="ts-input-group">
                    <textarea id="trade-reason"></textarea>
                </div>
                <div class="ts-check-item" style="margin-top:5px">
                    <label style="font-size:11px; color:#aaa">
                        <input type="checkbox" id="auto-screenshot" checked> <span data-i18n="auto_ss_label">Auto Screenshot</span>
                    </label>
                </div>

                <button id="ts-unlock-btn" disabled>⛔ LOCKED</button>

                <div id="ts-log-area">
                    <div class="ts-section-title" style="margin-top:0">
                        <span data-i18n="history_title">HISTORY</span>
                        <span id="clear-history-btn" title="Clear All History">🗑️</span>
                    </div>
                    
                    <div id="ts-stats-header">
                        <div class="stat-item">
                            <label data-i18n="stat_win">Win Rate</label>
                            <span class="stat-val" id="val-win-rate">-%</span>
                        </div>
                        <div class="stat-item">
                            <label data-i18n="stat_count">W / L</label>
                            <span class="stat-val" id="val-wl-count">0 / 0</span>
                        </div>
                    </div>

                    <div id="log-list" style="font-size:10px; color:#666; text-align:center; padding:10px;">...</div>
                </div>
            </div>
            <!-- Resize Handle (Visual only, CSS does the work via resize:both) -->
            <!-- <div class="ts-resize-handle"></div> --> 
        </div>

        <!-- 設定畫面 -->
        <div id="ts-settings-view" class="ts-view">
            <div class="ts-section-title" data-i18n="settings_title">SETTINGS</div>
            
            <div class="ts-settings-row">
                <h4 data-i18n="lang_label">Language</h4>
                <select id="setting-lang" style="width:100%; padding:5px; background:#333; color:white; border:1px solid #555;">
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                </select>
            </div>

            <!-- Removed Hard Lock Setting -->

            <div class="ts-settings-row">
                <h4 data-i18n="checklist_label">Custom Checklist</h4>
                <textarea id="checklist-editor"></textarea>
            </div>

            <div class="ts-btn-group">
                <button id="btn-save-settings" class="btn-primary" data-i18n="btn_save">Save</button>
                <button id="btn-cancel-settings" class="btn-secondary" data-i18n="btn_cancel">Cancel</button>
            </div>
        </div>
    `;

    panel.innerHTML = panelContent;
    document.body.appendChild(panel);

    // --- 2. 初始化與邏輯 ---

    // UI 參照
    const ui = {
        mainView: document.getElementById('ts-main-view'),
        settingsView: document.getElementById('ts-settings-view'),
        settingsBtn: document.getElementById('ts-settings-btn'),
        minActionBtn: document.getElementById('ts-minimize-action'),
        checklistContainer: document.getElementById('checklist-container'),
        symbolSelect: document.getElementById('symbol-select'),
        riskInput: document.getElementById('risk-usd'),
        slInput: document.getElementById('sl-points'),
        tpInput: document.getElementById('tp-points'),
        resQty: document.getElementById('res-qty'),
        resRr: document.getElementById('res-rr'),
        reasonInput: document.getElementById('trade-reason'),
        autoSsCb: document.getElementById('auto-screenshot'),
        unlockBtn: document.getElementById('ts-unlock-btn'),
        logList: document.getElementById('log-list'),
        clearBtn: document.getElementById('clear-history-btn'),

        statWinRate: document.getElementById('val-win-rate'),
        statWLCount: document.getElementById('val-wl-count'),

        sLang: document.getElementById('setting-lang'),
        sChecklist: document.getElementById('checklist-editor'),
        btnSave: document.getElementById('btn-save-settings'),
        btnCancel: document.getElementById('btn-cancel-settings'),
    };

    // 載入設定 -> 渲染 UI
    loadSettings();

    function loadSettings() {
        chrome.storage.sync.get(['tg_settings'], (res) => {
            if (res.tg_settings) {
                // Merge, ignoring old lock setting
                appSettings = { ...DEFAULT_SETTINGS, ...res.tg_settings };
            }
            renderApp();
            loadSavedLogs();
        });
    }

    function t(key) {
        return TRANSLATIONS[appSettings.lang][key] || key;
    }

    function renderApp() {
        // 1. 套用文字翻譯
        panel.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.dataset.i18n);
        });
        ui.reasonInput.placeholder = t('reason_ph');

        // 2. 渲染 Checkbox
        ui.checklistContainer.innerHTML = '';
        appSettings.checklist.forEach((itemText, idx) => {
            const div = document.createElement('div');
            div.className = 'ts-check-item';
            div.innerHTML = `<label><input type="checkbox" class="ts-chk-dynamic" id="cb-${idx}"> ${itemText}</label>`;
            ui.checklistContainer.appendChild(div);
        });

        // 重新綁定 Checkbox 事件
        document.querySelectorAll('.ts-chk-dynamic').forEach(cb => {
            cb.addEventListener('change', checkStatus);
        });

        // 3. 更新狀態檢查
        checkStatus();
    }

    // --- 計算與狀態檢查 ---
    function updateCalc() {
        const sym = ui.symbolSelect.value;
        const spec = SPECS[sym] || SPECS['GENERIC'];

        const risk = parseFloat(ui.riskInput.value) || 0;
        const sl = parseFloat(ui.slInput.value) || 0;
        const tp = parseFloat(ui.tpInput.value) || 0;

        let rrValid = false;
        if (sl > 0 && tp > 0) {
            const rr = (tp / sl).toFixed(2);
            ui.resRr.textContent = `1 : ${rr}`;
            if (rr >= 1.0) {
                ui.resRr.className = 'result-highlight';
                rrValid = true;
            } else {
                ui.resRr.className = 'result-warning';
            }
        } else {
            ui.resRr.textContent = '-';
            ui.resRr.className = '';
        }

        let qty = 0;
        if (risk > 0 && sl > 0) {
            qty = Math.floor(risk / (sl * spec.val));
        }

        const unitText = t('unit_qty');
        if (qty > 0) {
            ui.resQty.textContent = `${qty} ${unitText} (${sym})`;
            ui.resQty.className = 'result-highlight';
        } else {
            ui.resQty.textContent = `0 ${unitText}`;
            ui.resQty.className = 'result-warning';
        }
        return { rrValid, qty };
    }

    function checkStatus() {
        const { rrValid, qty } = updateCalc();
        const allChecked = Array.from(document.querySelectorAll('.ts-chk-dynamic')).every(cb => cb.checked);
        const reason = ui.reasonInput.value.trim();
        const reasonValid = reason.length >= 2;

        const btn = ui.unlockBtn;

        if (allChecked && rrValid && qty > 0 && reasonValid) {
            btn.disabled = false;
            btn.classList.add('ready');
            // Always show Confirm & Log, as mechanism is removed
            btn.textContent = t('btn_ready_confirm');
        } else {
            btn.disabled = true;
            btn.classList.remove('ready');
            if (!allChecked) btn.textContent = t('btn_check');
            else if (qty <= 0) btn.textContent = t('btn_risk');
            else if (!rrValid) btn.textContent = t('btn_rr');
            else if (!reasonValid) btn.textContent = t('btn_reason');
        }
    }

    // --- 事件監聽 ---
    [ui.symbolSelect, ui.riskInput, ui.slInput, ui.tpInput, ui.reasonInput].forEach(el => el.addEventListener('input', checkStatus));

    // Toggle Views
    ui.settingsBtn.addEventListener('click', () => {
        ui.mainView.classList.remove('active');
        ui.settingsView.classList.add('active');
        // Populate Settings
        ui.sLang.value = appSettings.lang;
        ui.sChecklist.value = appSettings.checklist.join('\n');
    });

    ui.btnCancel.addEventListener('click', () => {
        ui.settingsView.classList.remove('active');
        ui.mainView.classList.add('active');
    });

    ui.btnSave.addEventListener('click', () => {
        const newLang = ui.sLang.value;
        const newChecklist = ui.sChecklist.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        appSettings = {
            lang: newLang,
            checklist: newChecklist.length > 0 ? newChecklist : DEFAULT_SETTINGS.checklist
            // No lock setting
        };

        chrome.storage.sync.set({ tg_settings: appSettings });
        renderApp();

        ui.settingsView.classList.remove('active');
        ui.mainView.classList.add('active');
    });

    // 最小化 / 展開 / Toggle Logic
    function togglePanel(show) {
        isVisible = show;
        if (show) {
            panel.classList.remove('hidden');
            fab.classList.add('hidden');
        } else {
            panel.classList.add('hidden');
            fab.classList.remove('hidden');
        }
    }
    fab.addEventListener('click', () => togglePanel(true));
    ui.minActionBtn.addEventListener('click', () => togglePanel(false));

    // Listen for background toggle command
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "TOGGLE_UI") {
            togglePanel(!isVisible);
        }
    });

    // --- 核心按鈕邏輯 (Simplified) ---
    ui.unlockBtn.addEventListener('click', () => {
        const now = new Date();
        const timestampId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const timeDisplay = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        const symbol = ui.symbolSelect.value;
        const risk = ui.riskInput.value;
        const reason = ui.reasonInput.value;
        const qtyMatch = ui.resQty.textContent.match(/^(\d+)/);
        const qty = qtyMatch ? qtyMatch[1] : '0';

        // 1. 截圖
        let screenshotFilename = null;
        if (ui.autoSsCb && ui.autoSsCb.checked) {
            screenshotFilename = `TradingLogs/${timestampId}_${symbol}.png`;
            // Visual Flash
            const flash = document.createElement('div');
            flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;opacity:0.6;z-index:9999999;pointer-events:none;transition:opacity 0.3s;';
            document.body.appendChild(flash);
            setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 300); }, 50);

            setTimeout(() => {
                chrome.runtime.sendMessage({
                    action: "TAKE_SCREENSHOT",
                    timestampId: timestampId,
                    symbol: symbol
                });
            }, 400);
        }

        // 2. 紀錄
        const newLog = {
            id: timestampId, timeDisplay, symbol, qty, risk, reason,
            screenshot: screenshotFilename,
            result: null
        };
        chrome.storage.local.get(['ts_logs'], (result) => {
            const logs = result.ts_logs || [];
            logs.unshift(newLog);
            if (logs.length > 50) logs.pop();
            chrome.storage.local.set({ ts_logs: logs });
            cachedLogs = logs;
            renderAllLogs();
        });

        // 3. 視覺回饋與重置
        const originalText = ui.unlockBtn.textContent;
        ui.unlockBtn.textContent = "OK!";
        ui.unlockBtn.style.background = '#4CAF50';
        ui.unlockBtn.style.color = '#fff';
        ui.unlockBtn.disabled = true;

        setTimeout(() => {
            resetSystem();
        }, 1000);
    });

    function resetSystem() {
        ui.unlockBtn.style.background = '';
        ui.unlockBtn.style.color = '';

        // Clear non-persistent inputs
        document.querySelectorAll('.ts-chk-dynamic').forEach(cb => cb.checked = false);
        ui.reasonInput.value = '';
        checkStatus();
    }

    // --- 日誌與工具邏輯 ---
    function loadSavedLogs() {
        chrome.storage.local.get(['ts_logs'], (result) => {
            cachedLogs = result.ts_logs || [];
            renderAllLogs();
        });
    }

    function renderAllLogs() {
        updateStats();
        ui.logList.innerHTML = '';
        if (cachedLogs.length === 0) {
            ui.logList.innerHTML = '<div style="font-size:10px; color:#666; text-align:center; padding:10px;">(No History)</div>';
        } else {
            cachedLogs.forEach(log => renderLogEntry(log));
        }
    }

    function updateStats() {
        let wins = 0, losses = 0, draws = 0;
        let totalClosed = 0;
        cachedLogs.forEach(l => {
            if (l.result === 'win') wins++;
            else if (l.result === 'loss') losses++;
            else if (l.result === 'draw') draws++;
        });
        totalClosed = wins + losses + draws;

        let wr = 0;
        const meaningfulTrades = wins + losses;
        if (meaningfulTrades > 0) {
            wr = Math.round((wins / meaningfulTrades) * 100);
        }

        ui.statWinRate.textContent = totalClosed > 0 ? `${wr}%` : '-%';
        ui.statWLCount.textContent = `${wins}W ${losses}L ${draws}D`;

        ui.statWinRate.className = 'stat-val ' + (wr >= 50 ? 'win' : (meaningfulTrades > 0 ? 'loss' : ''));
    }

    function updateLogResult(id, result) {
        const log = cachedLogs.find(l => l.id === id);
        if (log) {
            log.result = result;
            chrome.storage.local.set({ ts_logs: cachedLogs });
            renderAllLogs();
        }
    }

    function updateLogReason(id, newReason) {
        const log = cachedLogs.find(l => l.id === id);
        if (log) {
            log.reason = newReason;
            chrome.storage.local.set({ ts_logs: cachedLogs });
        }
    }

    ui.clearBtn.addEventListener('click', () => {
        if (confirm(t('confirm_clear'))) {
            chrome.storage.local.set({ ts_logs: [] }, () => {
                cachedLogs = [];
                renderAllLogs();
            });
        }
    });

    function renderLogEntry(log) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const fileDisplay = log.screenshot ?
            `<div class="log-file" title="Click to Copy Path" data-file="${log.screenshot}">📷 ${log.screenshot.split('/').pop()}</div>` : '';

        const activeClass = (res) => log.result === res ? `active ${res}` : '';

        entry.innerHTML = `
            <div class="log-time">
                <span>${log.timeDisplay} | ${log.symbol} x ${log.qty}</span>
                <span>Risk: $${log.risk}</span>
            </div>
            <div class="log-reason editable" title="Click to edit">${log.reason}</div>
            ${fileDisplay}
            <div class="log-actions">
                <button class="btn-outcome ${activeClass('win')}" data-res="win">WIN</button>
                <button class="btn-outcome ${activeClass('draw')}" data-res="draw">DRAW</button>
                <button class="btn-outcome ${activeClass('loss')}" data-res="loss">LOSS</button>
            </div>
        `;

        if (log.screenshot) {
            entry.querySelector('.log-file').addEventListener('click', function () {
                const fullPath = "Downloads/" + this.dataset.file;
                navigator.clipboard.writeText(fullPath);
                alert("Path copied: " + fullPath);
            });
        }

        entry.querySelectorAll('.btn-outcome').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const res = e.target.dataset.res;
                const newRes = (log.result === res) ? null : res;
                updateLogResult(log.id, newRes);
            });
        });

        const reasonDiv = entry.querySelector('.log-reason');
        reasonDiv.addEventListener('click', () => {
            const newText = prompt("Edit Note:", log.reason);
            if (newText !== null) {
                reasonDiv.textContent = newText;
                updateLogReason(log.id, newText);
            }
        });

        ui.logList.appendChild(entry);
    }

    // 拖曳邏輯
    function makeDraggable(element, handle) {
        let isDragging = false, startX, startY, initialLeft, initialTop;
        handle.addEventListener('mousedown', (e) => {
            if (['ts-settings-btn', 'ts-minimize-action', 'clear-history-btn'].includes(e.target.id)) return;
            if (e.target.classList.contains('btn-outcome')) return;
            // Allow drag on header
            isDragging = true; startX = e.clientX; startY = e.clientY;
            initialLeft = element.offsetLeft; initialTop = element.offsetTop;
            element.style.cursor = 'grabbing';
            e.preventDefault(); // Prevent text selection
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = `${initialLeft + e.clientX - startX}px`;
            element.style.top = `${initialTop + e.clientY - startY}px`;
        });
        document.addEventListener('mouseup', () => { isDragging = false; element.style.cursor = 'default'; });
    }
    makeDraggable(panel, document.getElementById('ts-risk-header'));

})();