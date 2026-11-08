# Frontend Skill

Install one `frontend` skill for website design, product UI, React components, interaction states, scroll motion, GPU effects and browser verification. The skill opens the relevant bundled subskills according to the request and the project's stack.

把 Website、ReactSkills、GPU Effect、UI 轉場和後台介面的整合做法收在同一個入口。直接描述要做的事，`frontend` 會挑需要的流程。也可以保存你認可的設計，之後在相符的專案重用。

```sh
npx skills add Gavinzip/frontend-skill --skill frontend -a codex
```

Run this in your project. Add `-g` to install it for your Codex user. If you already have a customized `frontend` skill, review the install location before replacing it. Restart the Codex session if you installed the skill while it was open. Automatic invocation is enabled. You can also invoke `$frontend` directly.

- 「幫我做品牌首頁，捲動時要能控制影片前進和倒退。」
- 「修一下後台儲存按鈕，後端回傳成功後才顯示完成。」
- 「把這個我認可的互動做法存起來，下次同一個專案沿用。」

[SKILL.md](SKILL.md) is the entry point. Its routing table links to every bundled subskill and tells the agent when to use it. The [Liquid Glass example](assets/liquid-glass-edge-refraction/integration.md) and design library tool are also included. Saving or searching local patterns uses Python 3.9 or newer.

| Included subskills | Examples and tools |
| --- | --- |
| [Website](subskills/website/SKILL.md), [Website 3D](subskills/website-3d/SKILL.md), [img2threejs](subskills/img2threejs/SKILL.md) | Scroll video recipes, React PRISM source, scene template and procedural modeling scripts |
| [ReactSkills](subskills/react-skills/SKILL.md), [UI Transitions](subskills/ui-transitions/SKILL.md), [Amicro](subskills/amicro-micro-transitions/SKILL.md) | Official React Bits registry lookup, an original async action example and MIT Amicro button examples |
| [GPU Effect](subskills/gpu-effect/SKILL.md), [Hairline Animations](subskills/hairline-animations/SKILL.md) | Pinned shader source and lookup, integration code, illustration catalog and local gallery |
| [Agent UI](subskills/agent-ui/SKILL.md), [Back-end UI](subskills/back-end-ui/SKILL.md) | Local React primitives and lookup, admin shell and feature design patterns |
| [Lieflat Charts](subskills/lieflat-charts/SKILL.md) | Chart and report templates and scripts under the included PolyForm Noncommercial terms |

React Bits components come from the [official registry](https://reactbits.dev/get-started/mcp) when needed. The packaged UI Transitions example is independently authored. It links to transitions.dev for exact references. Bundled third-party source retains its original notices. Target apps install any framework or runtime packages their chosen examples require.

For projects that should explicitly prefer this workflow, add a line to the project's `AGENTS.md`.

```md
For website and app UI work, start with the frontend skill and use the references that match the request and the existing stack.
```
