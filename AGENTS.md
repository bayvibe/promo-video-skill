# Promo Video Skill (Remotion)

Generate a promotional video from a website URL or user-provided brand information.

## Two Paths

### Path A: User provided a website URL

When the user gives you a URL:

1. Run `python generate_promo.py --source <url>` to generate `src/data/brand.json` and `src/data/script.json`
2. **Immediately show the user the generated script** — present a clean summary:
   ```
   品牌名: xxx
   Tagline: xxx
   主色调: #xxx
   场景规划:
     1. Intro (3s) — 品牌Logo + 名称 + tagline
     2. Feature (5s) — 功能1 / 功能2 / 功能3
     3. Dashboard (4s) — 产品界面展示
     4. CTA (3s) — "xxx" + 按钮
   ```
3. Ask: "确认这个脚本，还是需要调整？"
4. After confirmation, run `npm run dev` and tell user to preview at `http://localhost:3000`

### Path B: User provided nothing

When the user just says "generate a video" / "make a promo" without specifics, ask the following questions (one message, all at once):

1. **品牌名是什么？**（或者你要推广的产品/项目名）
2. **一句话描述你的产品**（用作 tagline）
3. **有品牌色吗？**（没有的话我会帮你选）
4. **想突出哪几个卖点？**（最多3个）
5. **有网站 URL 吗？**（有的话我可以自动抓取信息）

Once the user answers, directly write `src/data/brand.json` and `src/data/script.json` based on their answers. Then show the script summary and confirm.

## After Confirmation

1. Run `npm run dev` to start Remotion Studio
2. Tell user to preview at `http://localhost:3000`
3. To export: `npx remotion render PromoVideo out/promo.mp4`

## Design Guidelines

### 视觉原则
- **填满画面，减少留白** — 中间场景（Feature / Dashboard）用 `flex: 1` 或全宽布局撑满 1920×1080 画布，避免大片空白
- **避免模板化重复版式** — 同一条视频里不要反复使用"左大标题 + 右卡片/mockup + 底部字幕"的骨架。每条视频至少使用 3 种明显不同的构图：例如满版标题、斜向 ticker、中心轴构图、拼贴式卡片、杂志式分栏、全屏产品界面、代码 overlay、时间线/路径式构图。
- **同视频卡片圆角必须一致** — 每条视频定义一个 `CARD_RADIUS` token，所有卡片、面板、mockup 容器、feature blocks 使用同一个值。不要同一条视频里一会儿直角、一会儿 12px、一会儿 34px。
- **卡片不是默认答案** — Feature 场景可以用错位拼贴、纵深层叠、ticker、节点图、编辑器面板、产品截图裁切等方式表达；不要默认三等宽卡片横排。
- **结尾页必须换一种收束方式** — CTA/Ending 不要默认复用前面场景的左标题右卡片或左标题左按钮。优先使用居中 lockup、海报式排版、环绕式信息块、全屏 typographic close。
- **主色调取自网站 CTA 按钮** — 品牌色必须从 button/a 元素的 inline style 提取渐变色，不是随机 CSS 颜色
- **全局字幕** — 每个场景底部居中显示字幕条（药丸形半透明背景），字号 32px，padding 18px 48px，弹簧动画入场。
- **只支持 URL 输入** — SVG 模式已移除，只接受网站 URL 作为数据源

### 抓取规则
- 品牌名优先用 `og:site_name`，其次 title tag（取 `-` 或 `|` 分隔的第一段）
- Tagline 优先用 `og:description`，截断到 80 字符以内
- 品牌色优先提取 button/CTA 元素 inline style 中的 gradient 颜色
- Feature 标题过滤长度 < 45 字符，跳过过长的句子
- 检测网站 light/dark 主题，自动匹配背景色和文字色

### 数据校验清单
生成数据后，检查以下问题再给用户确认：
- 品牌名是否简短干净（不是完整 HTML title）
- Tagline 是否 < 80 字符
- 主色调是否来自 CTA 按钮（不是随机色）
- Feature 是否恰好 3 个，标题简短有力
- 各场景文字在 1920×1080 画布上是否可读

### 视觉自检清单
1. 运行 `npm run lint`
2. 用 `npx remotion compositions src/index.ts` 确认 composition 存在、时长正确
3. 每个主要场景至少导出 1 张 still，自查布局
4. 检查关键帧：无裁切、无遮挡、字幕居中、卡片圆角统一、至少 3 种版式、安全区 ≥ 64px
5. 确认 `http://localhost:3000` 可打开

## File Structure

```
src/
├── Root.tsx              # Remotion composition registration
├── PromoVideo.tsx        # Main video orchestrator
├── scenes/
│   ├── Scene01_Intro.tsx     # Logo + 品牌名 + tagline
│   ├── Scene02_Feature.tsx   # 三卡片等宽横排弹入
│   ├── Scene03_Dashboard.tsx # 全宽产品界面模拟
│   └── Scene04_CTA.tsx       # 行动号召 + 按钮
└── data/
    ├── script.json       # 视频脚本（文案、时序）
    └── brand.json        # 品牌数据（颜色、字体、Logo）
```

## Data Format

### brand.json
```json
{
  "name": "Brand Name",
  "tagline": "One line description",
  "colors": {
    "primary": "#3E4E33",
    "secondary": "#687058",
    "background": "#FFFFFF",
    "surface": "#F8FAFC",
    "text": "#0F172A",
    "textSecondary": "#64748B",
    "accent": "#3E4E33"
  },
  "font": "Inter, sans-serif",
  "logoUrl": "",
  "features": [
    { "title": "Feature 1", "description": "Short desc" },
    { "title": "Feature 2", "description": "Short desc" },
    { "title": "Feature 3", "description": "Short desc" }
  ],
  "cta": {
    "headline": "Ready to get started?",
    "buttonText": "Get Started Free",
    "url": "https://example.com"
  }
}
```

### script.json
```json
{
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "scenes": [
    { "id": "intro", "duration": 90, "headline": "", "subtext": "", "subtitle": "" },
    { "id": "feature", "duration": 150, "headline": "", "subtitle": "", "items": [] },
    { "id": "dashboard", "duration": 120, "headline": "", "subtitle": "" },
    { "id": "cta", "duration": 90, "headline": "", "buttonText": "", "subtitle": "" }
  ]
}
```

## Customization

- Edit `src/data/brand.json` to change colors, fonts, logo, brand name
- Edit `src/data/script.json` to change scene copy and timing
- Edit scene components in `src/scenes/` for layout/animation changes
