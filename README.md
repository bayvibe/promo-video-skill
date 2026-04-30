# Promo Video Skill for Claude Code

一个 Claude Code 技能，输入一个网站 URL，自动提取品牌信息并生成宣传视频。

## 这是什么？

这是给 [Claude Code](https://claude.ai/code) 使用的技能（Skill）。你只需要给它一个网站链接，它会：

1. 自动抓取网站的品牌名、描述、主色调
2. 生成视频脚本供你确认
3. 使用 [Remotion](https://remotion.dev) 渲染出 1920×1080 的宣传视频

## 安装

在 Claude Code 中运行：

```
/skill-install https://github.com/bayvibe/promo-video-skill
```

## 使用

在 Claude Code 对话框中直接说：

> 帮我用 https://example.com 生成一个宣传视频

或者直接说"生成宣传视频"，技能会一步步引导你提供品牌信息。

## 本地开发

```bash
# 安装依赖
npm install

# 启动 Remotion Studio 预览
npm run dev

# 导出视频
npx remotion render PromoVideo out/promo.mp4
```

## 视频结构

每条视频包含 4 个场景：

- **Intro** — 品牌 Logo + 名称 + 标语
- **Feature** — 3 个核心卖点展示
- **Dashboard** — 产品界面模拟
- **CTA** — 行动号召 + 按钮

## 技术栈

- [Remotion](https://remotion.dev) — React 视频框架
- TypeScript
- Python（网站数据抓取）

## License

MIT
