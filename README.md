# Frontend Skill

Install one `frontend` skill for website design, product UI, React components, interaction states, scroll motion, GPU effects and browser verification. The skill chooses a workflow from the request and the project's stack.

把 Website、ReactSkills、GPU Effect、UI 轉場和後台介面的整合做法收在同一個入口。直接描述要做的事，`frontend` 會挑需要的流程。也可以保存你認可的設計，之後在相符的專案重用。

```sh
npx skills add Gavinzip/frontend-skill --skill frontend -a codex
```

Run this in your project. Add `-g` to install it for your Codex user. If you already have a customized `frontend` skill, review the install location before replacing it. Restart the Codex session if you installed the skill while it was open. Automatic invocation is enabled. You can also invoke `$frontend` directly.

- 「幫我做品牌首頁，捲動時要能控制影片前進和倒退。」
- 「修一下後台儲存按鈕，後端回傳成功後才顯示完成。」
- 「把這個我認可的互動做法存起來，下次同一個專案沿用。」

[SKILL.md](SKILL.md) is the entry point. The [workflow references](references/) and [Liquid Glass example](assets/liquid-glass-edge-refraction/integration.md) are included. Saving or searching local patterns uses Python 3.9 or newer. Specific React Bits components and third-party shader packages are obtained from their official sources when needed.

For projects that should explicitly prefer this workflow, add a line to the project's `AGENTS.md`.

```md
For website and app UI work, start with the frontend skill and use the references that match the request and the existing stack.
```
