# 液態玻璃邊緣折射

將 [glass-refraction.mjs](glass-refraction.mjs) 和 [glass-refraction.css](glass-refraction.css) 放進目標專案，並隨程式保留 [MIT 授權告示](LICENSE)。可用原生 DOM 接上，也可在 React、Vue 或其他框架的掛載與卸載階段呼叫。

在現有玻璃浮層的元素上掛載。浮層需有半透明底色，且後面要有可看出彎折的線條或紋理。保持文字、按鈕與焦點管理由產品元件控制。選擇一塊小型浮層驗證，再依實際背景決定是否值得套用。

載入 `glass-refraction.css`。把產品原本的模糊值放在 `--glass-refraction-base`，原本的 tint 繼續由產品樣式處理。用下面的選擇器寫法可確保只有啟用後才在原本的模糊後加上 SVG。

```css
.settings-popover {
  --glass-refraction-base: blur(3px) saturate(120%);
  border-radius: 20px;
}
.settings-popover:not([data-glass-refraction="active"]) {
  backdrop-filter: var(--glass-refraction-base);
}
```

```js
import { attachGlassRefraction } from "./glass-refraction.mjs";

const popoverElement = document.querySelector(".settings-popover");
const lens = attachGlassRefraction(popoverElement, {
  edgeWidth: 23,
  strength: 27,
  dispersion: 0.12,
});

lens.setEnabled(true);
// 關閉比較時呼叫 lens.setEnabled(false)。
// 浮層卸載時呼叫 lens.destroy()。
```

- `edgeWidth` 控制邊緣折射的寬度。`strength` 是最大取樣位移，單位為 CSS 像素，會隨狹小的邊緣縮減。`dispersion` 調整紅藍通道的差異，設成 `0` 時只做一次位移。
- `onStatus` 回報 `off`、`preparing`、`active`、`unsupported`、`preference`、`geometry` 或 `error`。只有 `active` 會加上濾鏡。比較介面可以用這些值解釋毛玻璃保留的原因。
- 元件在尺寸變動時會更新貼圖。若只改主題圓角而尺寸沒變，呼叫 `lens.refresh()`。目前支援直角、以 px 定義的圓形角和常見膠囊形。百分比圓角、橢圓角、跨過中線的不對稱大圓角會回報 `geometry`。
- 模組以 Chromium 為啟用範圍，並檢查 SVG URL 能否用於 `backdrop-filter`。減少透明度、強制色彩、貼圖失敗或幾何超出範圍時會移除折射，沿用產品的基礎樣式。貼圖是模組自己用 Canvas 生成的 `data:` PNG，接入時先核對 CSP 的 `img-src`。遇到 CSP 限制，應依專案政策決定是否改用相容的貼圖來源。

Canvas 負責產生位移貼圖。SVG 的 `feDisplacementMap` 使用這張貼圖取樣實際頁面的背景，中央維持原位。開啟色散時分別位移紅、綠、藍三個通道，再將它們合成。產品的文字和互動控制仍由瀏覽器在濾鏡上方正常繪製。

比較時先固定底色與模糊值，切換後看邊緣的線條是否彎折、文字是否清楚。遇到有濾鏡、透明度或遮罩的祖先時，檢查實際取樣範圍。正式整合時依產品流程驗證尺寸、主題、鍵盤互動與效能。

- [CSS Filter Effects 規格](https://drafts.csswg.org/filter-effects-1/#feDisplacementMapElement)
- [MDN backdrop-filter 與取樣邊界](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter#backdrop_root)
