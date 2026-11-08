# 驗證方式

技能檢查涵蓋 frontmatter、相對連結、元件索引、上游 SHA-256、工具入口及新增程式碼的真實套件型別；不等於 GPU 視覺驗收。

實際整合後按風險驗證：

1. 專案 typecheck/build，確認 imports、props、尺寸及 bundle。
2. 目標瀏覽器先確認 adapter/device，再確認第一幀與動畫。headless 軟體 adapter 不等於使用者硬體，不能靠軟體渲染旗標假稱解決裝置問題。
3. 檢查 GPU validation error、初始化次數及資源成長。驗證 resize、StrictMode、卸載、背景分頁和 reduced-motion。
4. 在指定 viewport 檢查對比、mask、alpha、順序、pointer 和真實狀態；手機不能靠桌面 hover 推測。
5. 有效能風險時記錄裝置、瀏覽器、viewport/DPR、frame time 或 FPS、層數與大小。數字只適用測過的環境。

GPU 不可用時回報具體原因，保留問題供定位。空白畫面、CSS 替代或沒有 log 都不是成功證據。

正式發布遵守專案部署規則：audit JS／媒體大小，來源素材不放 public/dist，驗證壓縮、cache 範圍與 live headers/timing。Git push 需要批准。

測試檔、截圖或錄影若由本次產生，刪除前列出並取得使用者同意；能在記憶體驗證時避免持久檔案。AI 候選圖片遵守使用者素材選擇流程。
