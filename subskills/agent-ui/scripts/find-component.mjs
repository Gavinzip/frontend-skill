import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(skillRoot, "assets/component-manifest.json"), "utf8"));
const query = process.argv.slice(2).join(" ").trim().toLowerCase();
const aliases = {
  "載入": ["loading", "progress"], "加载": ["loading", "progress"], "進度": ["loading", "progress"], "进度": ["loading", "progress"],
  "思考": ["thinking", "reasoning", "trace"], "推理": ["thinking", "reasoning", "trace"],
  "串流": ["stream", "response"], "流式": ["stream", "response"], "回答": ["stream", "answer"],
  "審批": ["approval", "human-in-the-loop"], "审批": ["approval", "human-in-the-loop"], "批准": ["approval", "confirm"], "確認": ["approval", "confirm"], "确认": ["approval", "confirm"],
  "審核": ["approval", "human-in-the-loop"], "审核": ["approval", "human-in-the-loop"],
  "工具": ["tools", "tool calls"], "任務": ["tasks", "status"], "任务": ["tasks", "status"],
  "聊天": ["chat", "conversation"], "對話": ["chat", "conversation"], "对话": ["chat", "conversation"],
  "提示": ["prompt", "composer"], "輸入": ["prompt", "composer"], "输入": ["prompt", "composer"],
  "推薦": ["recommendation", "suggestion"], "推荐": ["recommendation", "suggestion"],
  "上下文": ["context", "retrieval"], "檢索": ["context", "retrieval"], "检索": ["context", "retrieval"], "知識": ["context", "knowledge"], "知识": ["context", "knowledge"],
  "差異": ["diff", "changes"], "差异": ["diff", "changes"], "資料表": ["records", "table"], "数据表": ["records", "table"], "紀錄": ["records", "grid"], "记录": ["records", "grid"],
  "篩選": ["filter", "status"], "筛选": ["filter", "status"], "側邊欄": ["sidebar", "navigation"], "侧边栏": ["sidebar", "navigation"], "導覽": ["sidebar", "navigation"], "导航": ["sidebar", "navigation"],
  "搜尋": ["search", "command"], "搜索": ["search", "command"], "流程圖": ["flowchart", "workflow"], "流程图": ["flowchart", "workflow"], "工作流": ["flowchart", "workflow"],
  "洞察": ["insights", "analytics"], "分析": ["insights", "analytics"], "圖表": ["insights", "chart"], "图表": ["insights", "chart"],
  "程式碼": ["code", "diff"], "代码": ["code", "diff"], "微調": ["fine tune", "inspector"], "微调": ["fine tune", "inspector"],
  "選取": ["selection", "rewrite"], "选取": ["selection", "rewrite"], "改寫": ["selection", "rewrite"], "改写": ["selection", "rewrite"],
  "螢幕": ["agent screen", "stream"], "屏幕": ["agent screen", "stream"], "錄製": ["agent screen", "record"], "录制": ["agent screen", "record"]
};

if (!query) {
  console.error('Usage: node scripts/find-component.mjs "describe the desired agent UI"');
  process.exitCode = 1;
} else {
  const terms = new Set(query.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []);
  for (const [phrase, expansions] of Object.entries(aliases)) {
    if (query.includes(phrase)) for (const term of expansions) terms.add(term);
  }
  const ranked = manifest.components
    .map((component) => {
      const haystack = [component.id, component.title, component.summary, ...component.keywords].join(" ").toLowerCase();
      const score = [...terms].reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { component, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.component.title.localeCompare(b.component.title))
    .slice(0, 5);

  if (!ranked.length) {
    console.log("No exact local match. Read references/component-catalog.md and compose a small custom surface from the closest primitives.");
  } else {
    for (const { component, score } of ranked) {
      console.log(`\n${component.title} — score ${score}`);
      console.log(component.summary);
      console.log(`source: ${component.source}`);
      console.log(`local support: ${component.localSupport.length ? component.localSupport.join(", ") : "none"}`);
      console.log(`npm packages: ${component.packages.length ? component.packages.join(", ") : "none"}`);
    }
  }
}
