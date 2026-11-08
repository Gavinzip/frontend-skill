# 來源與版本

- 來源：[shader-effects-inc/shaders](https://github.com/shader-effects-inc/shaders)。
- 固定 commit：`935f71a7789f0e07811dfe6fd0d8f707e9848238`，取得日期 2026-10-07。
- 原始碼套件：`shaders` 4.0.0；workspace core／framework packages 1.7.0。
- 授權：MIT，Copyright (c) 2026 Shader Effects Inc.；完整原文保留於 `upstream/LICENSE`。
- 原始碼保留：713 個檔案、199 個元件資料夾，含元件封面、GPU engine、std、plain JS、React/Vue/Svelte/Solid、partner、CLI 和建置設定。
- 排除：Git metadata、GitHub workflow、上游 tests／vitest 設定、node_modules、dist。上游 README 的測試命令因此不適用於這份裁切來源；這些排除不是刪除使用者既有檔案。
- [upstream-files.json](upstream-files.json) 記錄每個來源檔案的 SHA-256；`python3 scripts/effects.py verify` 核對本機內容。

`component-index.json` 使用 AST 與 npm 4.0.0 registry 建立，199 個名稱與描述、來源明寫的 category 均已核對。shape 的 category／共用 props 由引擎生成，不能只掃字串推測。索引不取代來源，角色為 null 的個別 utility 直接查看其實作。

新專案可以安裝 npm `shaders@4.0.0`。source 的 framework index 與 wrappers 在 build 時生成，不能把未 build 的工作區路徑直接當成 npm package。若要從 source 重建，先複製到專案的獨立開發目錄，沿用 `pnpm-lock.yaml` 和 workspace，Node `22.20.x`、pnpm `10.0.0`，使用 `pnpm lib:build`；不要直接改技能的 upstream snapshot。重建完成需再驗證 bundle 和 GPU。

本技能沒有登入或修改 shaders.com 帳號、安裝 MCP、同步雲端 preset、部署網站或 push。線上設計工具／Pro presets／網站 sections 受平台條款管轄，沒有包含在開源快照中。
