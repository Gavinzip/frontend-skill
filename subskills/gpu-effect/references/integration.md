# 整合方式

## 依賴

固定 npm 套件為 `shaders@4.0.0`。沿用專案 package manager 和 lockfile；有其他版本時先確認相容性。安裝不代表可以自動登入雲端、同步專案或安裝 MCP。

```bash
npm install --save-exact shaders@4.0.0
```

需要 registry 或既有快取；本機 source snapshot 不等於預先安裝依賴。套件對應 React 18/19、Vue 3.5+、Svelte 5、Solid 1.8+，以固定版本 package.json 為準。完整 source 建置要求見 [來源](upstream.md)。

使用 `shaders/react`、`shaders/vue`、`shaders/svelte`、`shaders/solid` 或 `shaders/js`。Workspace 內部的 `shaders-core` 和 `@coreroot` imports 不能直接貼進一般應用；元件 index.ts 依賴整個引擎。

## React

宣告式效果用 `<Shader>` 和具名元件，保留 GPU 不可用回報。Next.js 需 client boundary，GPU 初始化放在 effect。

需要 pause/resume 時，將 `assets/integration/` 的三個檔案複製到同一個 feature 資料夾。它們分離生命週期、React wrapper 和合成資料：

```tsx
import { GpuCanvas } from './effects/GpuCanvas';
import { calmGradient } from './effects/presets';
<GpuCanvas preset={calmGradient} ariaLabel="流動漸層" />
```

失敗時 wrapper 顯示簡短狀態並記錄原因，不替換成 CSS 圖案。依產品接 `onStatus`。preset identity 變動會重建；一般數值調整透過 controller.update，避免逐幀掛載。

此 wrapper 使用 `shaders/js`，會引入完整 registry；少數效果可優先採框架具名元件，但仍需實測 bundle，不能從 import 形式推斷 tree-shaking。

## JavaScript 與遊戲

`mountEffect` 立即回傳 controller；`ready` 等待初始化，`destroy()` 在初始化期間也可呼叫。顯式設定 CSS 大小，背景用獨立 canvas，玩法／碰撞／HUD 留在原引擎。

```ts
const effect = mountEffect(canvas, calmGradient, {
  onStatus: status => updateEffectStatus(status),
});
effect.update('background', { colorB: '#6b7280' });
// scene / 頁面卸載
effect.destroy();
```

若要對場景本身扭曲，需真正的 texture/frame bridge，量測 copy 成本、色彩空間與裝置相容性。

## 效能與狀態

- 確認容器非 0、HTTPS/localhost secure context、adapter/device 可用，再判斷 shader。
- 第一幀由 onReady 確認；createShader 回傳不代表出圖。terminal error 要回報，上游 device-loss recovery 後也需重新確認狀態。
- 量測 canvas 數量、layers、texture、DPR 與每幀 upload。不要假造通用 DPR prop；以版本 API 或宿主尺寸控制。
- 可讀文字、tab 順序和關鍵資訊放在 DOM。離開畫面、隱藏分頁和 reduced-motion 時停止動畫；卸載清理所有資源。
- wrapper 設定 disableTelemetry。上游 Preview/雲端 token 可能需網路，不是本機原始碼的自動替代路徑。
