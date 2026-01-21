# Chrome Web Store Listing Info / 上架資訊包

## 1. Basic Info / 基本資訊

| Field / 欄位 | Content / 內容 |
| :--- | :--- |
| **Name (Display Name)** | **TradingGuard** |
| **Short Description** | **Universal risk management dashboard for traders. Calculates position size, logs trades, and enforces discipline.** |
| **短描述 (中文)** | **通用型交易風控儀表板。自動計算部位風險、紀錄交易日誌，並協助執行交易紀律。** |
| **Version** | **3.0** |
| **Category** | **Productivity** (生產力工具) or **Finance** (金融) |

---

## 2. Detailed Description / 詳細描述

### English
**A lightweight, experimental risk management helper for traders.**

TradingGuard is a simple overlay tool built to help me (and potentially you) maintain basic trading discipline. It works on Topstep, Tradovate, and other web platforms by providing a quick pre-trade checklist and a basic position size calculator.

**Features:**
*   **🛡️ Universal Helper**: Click the shield icon to open a simple risk panel on any site.
*   **💰 Position Calculator**: Estimates safe contract size (Qty) based on your stop-loss distance and risk limit.
*   **✅ Simple Checklist**: A quick reminder to check Trend, News, and Tilt before clicking buy/sell.
*   **📸 Screenshot Log**: Automatically saves a screenshot to your Downloads folder when you act.
*   **� Local Only**: No servers, no data collection. Everything stays on your computer.

*Note: This is an experimental tool created for personal use and study. Use at your own risk.*

---

### Chinese (Traditional)
**一個輕量級、實驗性質的交易風控小幫手。**

TradingGuard 是一個簡單的網頁覆蓋工具，最初是為了幫助我自己維持交易紀律而開發的。它可以協助您在 Topstep、Tradovate 等網頁平台上，快速進行風險試算與進場前的自我檢查。

**主要功能：**
*   **🛡️ 通用輔助**：點擊右下角盾牌圖示，即可在任何網站叫出簡易計算面板。
*   **💰 部位試算**：輸入止損點數與風險金額，粗略計算建議的口數上限 (Qty)。
*   **✅ 進場檢查**：簡單的勾選清單，提醒自己確認趨勢與新聞。
*   **📸 自動截圖**：紀錄時會自動將當前畫面截圖存到下載資料夾 (TradingLogs)。
*   **🔒 本地運行**：沒有後端伺服器，資料完全儲存在您的電腦裡。

*注意：此為個人研究用途的實驗性工具，請根據自身判斷謹慎使用。*

---

## 3. Privacy & Permissions / 隱私權與權限說明

**Google will ask for strict justification because of `<all_urls>`. Use the text below.**
**由於申請了 `<all_urls>` 權限，Google 會嚴格審查，請務必複製以下英文說明填入後台。**

### Q: Why do you need access to "Read and change all your data on the websites you visit" (`<all_urls>`)?
**Justification:**
> "This extension is a universal risk management overlay designed to work across various proprietary and web-based trading platforms (e.g., Topstep, Tradovate, NinjaTrader, Rithmic, and custom broker dashboards).
> Since users may access these trading platforms via dynamic URLs or different domains depending on their region and broker whitelabeling, we cannot predict every possible domain in advance.
> The extension MUST interpret the potential risk data (PnL DOM elements) on these diverse sites to provide real-time risk calculations.
> We strictly implement a logic gate (in content.js) that defaults to a passive 'minimized' state on non-trading sites to ensure no interference with normal browsing."

### Q: Data Usage (Privacy Policy)
*   **Hosting**: Select "No, I do not process user data on my server." (全部本地處理)
*   **Data sold to third parties?**: No.
*   **Data used for unrelated purposes?**: No.
*   **Privacy Policy URL**: (You need to provide a simple URL. If you don't have one, create a Google Site / Notion page saying "Data is stored locally only.")

---

## 4. Graphics Assets (Required) / 圖片素材需求

*   **Store Icon**: 128x128 pixels (PNG)
*   **Screenshot**: 1280x800 pixels (JPEG/PNG) - *Capture the panel open on a chart.*
*   **Small Promo Tile**: 440x280 pixels (JPEG/PNG)
