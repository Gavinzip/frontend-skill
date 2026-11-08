# 自訂 Shader

先區分像素效果、合成關係和 props 控制；一般色彩／速度調整用現有元件，全新像素運算才建立 custom component。

此版本使用 `defineShader` + `<CustomShader>`，public entry 為 `shaders/std`。README 區分穩定的 WGSL 寫法與 experimental std primitives。GLSL/Shadertoy 不能直接當成 WGSL。

查閱本機 README 的 Custom components、`upstream/packages/core/src/std/index.ts` 和 `customShaders.ts`，以及 `gpu/contract.ts` 的 uniform、texture 與 pass 契約。React 掛載見 `upstream/packages/react/src/engine/CustomShader.tsx`。現成元件的 internal imports 不等於 application public API。

定義、props、互動驅動與 UI 分成可維護的檔案。統一 UV、色彩空間、時間單位、alpha blending；編譯 WGSL 後仍需驗證第一幀、props 更新和實際效果。外部紋理要確認 URL、CORS、載入完成和清理，不能靜默換成其他素材。
