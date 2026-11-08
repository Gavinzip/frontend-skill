# 效果選擇

本機有 199 個元件資料夾，包含 generators、filters、shapes、layout 和控制節點；不應把全部稱為獨立動畫。透過 `scripts/effects.py` 查詢，避免從名稱猜 props。

| 畫面用途 | 先查看的元件 | 注意 |
| --- | --- | --- |
| 柔和背景 | FlowingGradient、MeshGradient、Aurora、ChromaFlow | 控制色差與速度，主文字保持 DOM 排版。 |
| 金屬高光 | LiquidMetal、Chrome、BrushedMetal、Holographic | LiquidMetal 是 shapeEffect；確認 shape、scale 與背景關係。 |
| 玻璃折射 | Glass、FlutedGlass、GlassTiles、Crystal | 確認來源層與嵌套方式，避免對透明畫布加 filter。 |
| 游標互動 | CursorRipples、CursorTrail、GridDistortion | 觸控裝置沒有持續 hover，依操作設計觸控語意。 |
| 故障復古 | Glitch、CRTScreen、Pixelate、Dither、Ascii | 作用於真正的來源；持續閃爍不適合作為預設閱讀背景。 |
| 粒子煙霧 | Particles、ParticleField、ParticleFlow、Smoke、Fog、Nebula | 先量測 GPU/frame 成本，再增加層數與面積。 |
| 轉場 | NoiseDissolve、RippleWipe、BlockDissolve、PagePeel、Shatter | 由真實狀態或切換進度驅動，確認進度 prop、children 和 mask。 |

generator 產生像素；filter 修改輸入，通常包住來源；shapeEffect 畫特定形狀。索引用 TypeScript AST 核對來源的名稱、描述和角色，並從同版套件的實際 registry 取得生成的 category、props 和子節點需求；合成行為仍以原始碼為準。

```tsx
import { Shader, FlowingGradient, CursorRipples } from 'shaders/react';

<Shader disableTelemetry style={{ width: '100%', height: 360 }}
  onUnavailable={(reason) => reportGpuUnavailable(reason)}>
  <CursorRipples intensity={0.15}>
    <FlowingGradient speed={0.25} />
  </CursorRipples>
</Shader>
```

`reportGpuUnavailable` 是宿主的狀態回報函式，需實作。效果不接受 pointer 時設 `pointer-events: none`，避免擋住按鈕。
