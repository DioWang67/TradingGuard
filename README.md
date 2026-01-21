# 🛡️ TradingGuard

> **Universal risk management dashboard for traders. Calculates position size, logs trades, and enforces discipline.**  
> 通用型交易風控儀表板。自動計算部位風險、紀錄交易日誌，並協助執行交易紀律。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-3.6.0-orange.svg)](manifest.json)

---

## 📋 Overview / 概述

**TradingGuard** is a lightweight, experimental Chrome extension designed to help traders maintain discipline across various web-based trading platforms (Topstep, Tradovate, NinjaTrader, etc.). 

It works as a non-intrusive overlay that provides:
- **Position size calculator** based on risk parameters
- **Pre-trade checklist** to enforce trading rules
- **Automatic screenshot logging** for trade journal
- **100% local storage** - no data leaves your computer

**TradingGuard** 是一款輕量級實驗性 Chrome 擴充套件，協助交易者在各種網頁交易平台上維持紀律。所有資料完全儲存於本機，無需擔心隱私問題。

---

## ✨ Features / 功能特色

### 🛡️ Universal Trading Assistant
- Works on **any trading platform** via universal overlay
- Minimal design to avoid interfering with charts
- Quick access via shield icon in bottom-right corner

### 💰 Smart Position Calculator
```
Safe Qty = (Risk Amount / Stop Loss Distance) / Contract Point Value
```
- Input your **account risk** and **stop loss distance**
- Get recommended **contract quantity** instantly
- Prevents over-leveraging

### ✅ Discipline Checklist
Enforce your trading plan with customizable pre-trade checks:
- ✅ Trend confirmation
- ✅ News calendar check
- ✅ Emotional state (避免情緒交易)
- ✅ Custom notes field

### 📸 Automatic Trade Journaling
- **Auto-screenshot** on trade confirmation
- Saves to `Downloads/TradingLogs/` with timestamp
- Includes trade parameters in filename
- Perfect for post-trade review

### 🔒 Privacy First
- **No backend servers** - 100% local processing
- **No data collection** - everything stays on your device
- **No tracking** - compliance with Chrome Web Store privacy policies

---

## 🚀 Installation / 安裝方式

### Option 1: Chrome Web Store (Recommended)
*(Coming soon / 即將上架)*

### Option 2: Manual Installation / 手動安裝開發者模式

1. **Clone this repository:**
   ```bash
   git clone https://github.com/DioWang67/TradingGuard.git
   cd TradingGuard
   ```

2. **Open Chrome Extensions:**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (右上角開發者模式)
   - Click **"Load unpacked"** (載入未封裝項目)
   - Select the `TradingGuard` folder

3. **Verify Installation:**
   - You should see the TradingGuard shield icon 🛡️
   - Visit any trading platform and click the icon to activate

---

## 📖 Usage Guide / 使用說明

### Basic Workflow / 基本流程

1. **Click the shield icon** on any trading webpage
2. **Fill in your risk parameters:**
   - Account risk amount (單筆風險金額)
   - Stop loss distance in ticks (止損點數)
   - Contract point value (每跳價值)
3. **Complete the checklist** (確認趨勢、新聞、情緒狀態)
4. **Review the calculated safe quantity**
5. **Click "PASS" or "LOG"** to record the decision
   - Screenshot is automatically saved
   - Log entry is stored locally

### Calculator Example / 計算範例

```
Account Risk: $100
Stop Loss: 10 ticks
Point Value: $5/tick

Safe Qty = $100 / (10 × $5) = 2 contracts
```

### History Panel / 歷史紀錄

- Access via **"OPEN HISTORY"** button
- View all past trade decisions
- Search by date, symbol, or outcome
- Export logs for analysis

---

## 🗂️ Project Structure / 專案結構

```
TradingGuard/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for tab communication
├── content.js          # Main logic & UI injection
├── styles.css          # Modern glassmorphism UI
├── icon16.png          # Extension icons
├── icon48.png
├── icon128.png
├── STORE_LISTING.md    # Chrome Web Store submission guide
└── README.md           # This file
```

---

## 🛠️ Development / 開發指南

### Tech Stack
- **Manifest V3** (latest Chrome extension standard)
- **Vanilla JavaScript** - no dependencies
- **CSS Variables** for theming
- **Chrome Storage API** for data persistence
- **Chrome Downloads API** for screenshot saving

### Customization / 自訂修改

**Modify default checklist items:**
```javascript
// In content.js, find the buildChecklistHTML() function
const defaultChecklist = "✅ Trend\n✅ News\n✅ No Tilt";
```

**Change theme colors:**
```css
/* In styles.css */
--tg-accent: #00d4ff;        /* Primary accent color */
--tg-glass-bg: rgba(20, 25, 35, 0.85); /* Panel background */
```

---

## ⚠️ Disclaimer / 免責聲明

> **This is an experimental tool for educational and personal use only.**  
> Trading involves substantial risk of loss. This extension does NOT provide trading advice or guarantee profits. Always conduct your own research and risk management.

> **此為實驗性工具，僅供教育與個人研究使用。**  
> 交易具有重大虧損風險。此擴充套件不提供交易建議或保證獲利。請自行進行研究與風險管理。

---

## 📝 Privacy Policy / 隱私權政策

- **No data collection:** All data is stored locally via `chrome.storage.local`
- **No analytics:** No tracking scripts or third-party services
- **No server communication:** Extension works 100% offline
- **Screenshot storage:** Screenshots are saved to your local Downloads folder only

---

## 🤝 Contributing / 貢獻

This is a personal project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License / 授權

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links / 相關連結

- **GitHub Repository**: [https://github.com/DioWang67/TradingGuard](https://github.com/DioWang67/TradingGuard)
- **Issues & Bug Reports**: [GitHub Issues](https://github.com/DioWang67/TradingGuard/issues)
- **Chrome Web Store**: *(Coming soon)*

---

## 📮 Contact / 聯絡方式

For questions or support:
- Open an issue on [GitHub](https://github.com/DioWang67/TradingGuard/issues)
- Email: *(Add your email if you want to provide support)*

---

<p align="center">
  <sub>Built with ❤️ by traders, for traders</sub>
</p>
