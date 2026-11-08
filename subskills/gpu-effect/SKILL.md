---
name: gpu-effect
description: 在網站、React 介面或瀏覽器遊戲加入 WebGPU 即時背景、材質、濾鏡、轉場與游標互動特效；使用本機 shaders 原始碼和整合範例，處理 GPU 支援、生命週期與效能驗證。適用於畫面特效，不涵蓋 GPU 計算或完整遊戲玩法。
---

# GPU Effect

使用 Shader Effects Inc. 的 `shaders` 建立可組合的即時畫面特效。這個技能包含實際程式碼：`upstream/` 保留引擎、199 個元件資料夾、五種前端整合及建置工具；`assets/integration/` 提供可重用的 TypeScript 與 React 整合範例。

## 選擇與實作

1. 確認效果的畫面用途、目標裝置和現有技術棧。沿用專案框架、色彩與互動方式。
2. 讀 [效果選擇](references/effect-selection.md)，用本機工具找元件，再讀原始碼確認 props、角色與子節點需求：

   ```bash
   python3 scripts/effects.py search glass
   python3 scripts/effects.py show CursorRipples
   python3 scripts/effects.py verify
   ```

   指令路徑以本技能資料夾為起點。完整索引在 [component-index.json](references/component-index.json)，不必一次載入全部元件。
3. 讀 [整合方式](references/integration.md)。React 專案可用宣告式 `shaders/react`；需要 pause/resume、獨立遊戲 canvas 或跨框架控制時，用 `shaders/js` 與本機 `mountEffect.ts`。每個效果獨立成模組，props 與頁面內容分開。
4. 現成元件無法滿足要求時，讀 [自訂 Shader](references/custom-shaders.md)。一般 UI 位移或開合沿用宿主 UI 的動畫工具。
5. 按 [驗證方式](references/validation.md) 檢查實際畫面、互動、GPU 錯誤及效能，回報已執行的檢查和未驗證的裝置。

## 必須保留的行為

- 此固定版本是 **WebGPU-only**。`navigator.gpu` 存在仍不代表 adapter/device 可用；使用 `getWebGPUSupport()`，接住執行期間錯誤。上游可能只留下透明 canvas，不能用「沒有 console error」判定成功。
- 不可用 CSS 漸層、圖片、WebGL 或軟體渲染偷偷代替失敗效果。若產品需要降級，明確說明原因、替代內容與影響，依使用者決定處理。
- SSR 只輸出容器；GPU 初始化放在瀏覽器生命週期。卸載清理 renderer、observer、事件和動畫。尊重 reduced-motion，第一幀完成後暫停；離開畫面或背景分頁時停止動畫。
- Shader 是獨立 canvas；對 DOM、Phaser sprite 或 Three.js scene 加後製需要實際 texture/frame bridge。選擇清楚的背景、覆蓋層或紋理輸入，保留宿主玩法與 UI。
- 設定 `disableTelemetry: true`，除非使用者要求使用上游遙測。保留授權聲明；MIT 不涵蓋線上付費 presets、website sections 或使用者雲端專案。
- 本機原始碼可直接查閱，執行仍需要 npm 依賴與可用 WebGPU 裝置。不要把 `upstream/`、封面、文件或建置工具整包放入網站 `public/` / `dist/`。

## 工具與來源

- `scripts/effects.py`：搜尋元件、顯示 props／原始碼位置、校驗上游檔案。Python 標準函式庫即可執行。
- `assets/integration/mountEffect.ts`：回報 GPU 狀態、控制 reduced-motion／可見性並清理資源。
- `assets/integration/GpuCanvas.tsx`：React wrapper，主產品內容保留在 DOM。
- [來源與版本](references/upstream.md)：固定 commit、授權與套件安裝方式。

例：`使用 $gpu-effect 替目前首頁加入緩慢流動的銀色金屬視覺，保留文字可讀性，並檢查手機效能。`
