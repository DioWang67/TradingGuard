// 監聽來自 content.js 的訊息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "TAKE_SCREENSHOT") {

        // 呼叫 Chrome API 進行截圖
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {

            if (chrome.runtime.lastError) {
                console.error("截圖失敗:", chrome.runtime.lastError);
                return;
            }

            // 產生檔名: TradingLogs/20231025_143005_NQ.png
            // 注意：Chrome 限制只能存到「下載」資料夾或其子資料夾
            const filename = `TradingLogs/${request.timestampId}_${request.symbol}.png`;

            chrome.downloads.download({
                url: dataUrl,
                filename: filename,
                saveAs: false // false = 自動儲存，不跳出視窗
            });

            console.log("截圖已儲存:", filename);
        });
    }
});