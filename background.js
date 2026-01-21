// 監聽來自 content.js 的訊息
console.log("[TradingGuard] Background Service Worker Started");
// 點擊擴充功能圖標時觸發
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_UI" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TAKE_SCREENSHOT") {
        // 呼叫 Chrome API 進行截圖
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                console.error("截圖失敗:", chrome.runtime.lastError);
                return;
            }

            // 產生檔名: TradingLogs/20231025_143005_NQ.png
            const filename = `TradingLogs/${request.timestampId}_${request.symbol}.png`;

            chrome.downloads.download({
                url: dataUrl,
                filename: filename,
                saveAs: false
            });

            console.log("截圖已儲存:", filename);
        });
    }
});