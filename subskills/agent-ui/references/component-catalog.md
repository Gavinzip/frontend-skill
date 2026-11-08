# React Agent UI catalog

All paths below are local to this skill. Copy a selected primary file from `assets/react-source/` into the target application's `components/` directory, preserving the listed support files under the same relative paths. The source expects Tailwind CSS v4, the `@/*` alias, and `styles/tokens-and-keyframes.css` in the target global stylesheet.

| Component | Use it when the UI needs to… | Local source | Local support | Extra package |
| --- | --- | --- | --- | --- |
| Loading State | Show ongoing work with elapsed time and an animated loader. | `components/loading-state.tsx` | — | — |
| Thinking | Reveal stages of agent reasoning, research, steps, or coding. | `components/thinking.tsx` | — | — |
| Streaming Text | Stream an answer with citations, actions, and follow-up prompts. | `components/streaming-text.tsx` | — | — |
| Approval Card | Ask a sequence of explicit human-in-the-loop questions before acting. | `components/approval-card.tsx` | `atoms/Button.tsx`, `primitives/GlideMenu.tsx` | — |
| Tool Chips | Collapse tool calls, edits, and messages into an inspectable trace. | `components/tool-chips.tsx` | — | — |
| Task Rows | Show separate live states for queued/running/failed/completed tasks. | `components/task-rows.tsx` | — | — |
| Chat | Offer a tabbed agent conversation and a simple composer. | `components/chat.tsx` | — | — |
| Prompt Bar | Provide an advanced prompt input with source tags, slash commands, model choice, and dictation affordances. | `components/prompt-bar.tsx` | — | `glimm` |
| Recommendation Card | Present a suggestion, its confidence, alternatives, and an explicit acceptance action. | `components/recommendation-card.tsx` | `atoms/Button.tsx`, `atoms/EntityChip.tsx`, `atoms/ValuePill.tsx` | — |
| Context Cards | Explain the retrieved source chunks that informed the agent. | `components/context-cards.tsx` | — | — |
| Diff Table | Let a user inspect tabular AI edits before accepting them. | `components/diff-table.tsx` | `atoms/Button.tsx` | — |
| Records Table | Browse, sort, resize, filter, and select relationship/CRM records. | `components/records-table.tsx` | `primitives/GlideMenu.tsx` | — |
| Filter Table | Segment a task table by live status chips. | `components/filter-table.tsx` | — | — |
| Sidebar Nav | Move between workspace, chats, membership, and account actions. | `components/sidebar-nav.tsx` | `primitives/GlideMenu.tsx` | `@central-icons-react/round-outlined-radius-2-stroke-2` |
| Search | Filter command/action results immediately and show an empty state. | `components/search.tsx` | `primitives/GlideMenu.tsx` | — |
| Flowchart | Model a draggable trigger/condition workflow over a canvas. | `components/flowchart.tsx` | — | — |
| Insight Cards | Page through analytical agent findings with an interactive chart. | `components/insight-cards.tsx` | — | `liveline` |
| Code Block | Present source code or an applied/proposed unified diff with copy action. | `components/code-block.tsx` | — | — |
| Fine-tune Card | Adjust the layout and visual attributes of a generated component. | `components/fine-tune-card.tsx` | `primitives/GlideMenu.tsx` | — |
| Selection Actions | Turn selected text into a rewrite, question, or agent action. | `components/selection-actions.tsx` | `atoms/Button.tsx`, `atoms/Shimmer.tsx`, `atoms/StreamText.tsx` | `iconoir-react` |
| Agent Screen | Open a live agent screen, watch the stream, teach a task, or record it. | `components/agent-screen.tsx` | `atoms/Button.tsx` | — |

## Interaction-specific notes

`LoadingState` has Drive, Dots, Orbit, and Surfer modes. Surfer accepts only caller-provided local `videoSrc`; without it, the local source deliberately renders its “Provide a local videoSrc” state rather than contacting remote demo media.

`Thinking`, `StreamingText`, `ToolChips`, `TaskRows`, `Chat`, `ContextCards`, `DiffTable`, and `InsightCards` contain sample state and timers. Replace those samples with application data and actual loading/failure/completion states.

`ApprovalCard`, `RecommendationCard`, `DiffTable`, and `SelectionActions` are control surfaces: connect the selected response or acceptance to an explicit product action, not an implicit mutation.

`RecordsTable`, `SidebarNav`, `Search`, and `FineTuneCard` rely on `GlideMenu` for hover geometry. Preserve the support module rather than flattening it into each component.

`AgentScreen` defaults to an entirely local faux window. Pass a trusted, locally hosted image or video URL through `streamSrc` only when a real stream is available.
