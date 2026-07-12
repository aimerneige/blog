# AimerNeige Blog Style

## Project Shape

This is a Hugo/PaperMod personal technical blog with bilingual support. The content lives mainly under `content/post/**`; Chinese posts end in `.zh.md`, English posts end in `.en.md`, and paired posts usually share slug, date, categories, tags, and cover metadata.

Frontmatter commonly includes:

```yaml
---
title: "..."
date: 2024-01-01T00:00:00+08:00
draft: true
ShowToc: true
description: "..."
categories: [Linux]
tags: [tools]
cover:
    image: "images/example.webp"
    alt: "Example"
    relative: false
---
```

The blog uses code fences, footnotes, Markdown links, images, and Hugo shortcodes such as `{{< notice warning >}}`. Treat these as structural content, not prose clutter.

## Author Voice

The default voice is direct, practical, and personal. Most posts answer a concrete question: how to install something, configure something, fix a broken system, or record a technical note. The writing can be blunt and occasionally playful, especially in rant or personal posts. Do not neutralize that into corporate documentation.

Common article shapes:

- **Tutorial**: warning or scope note, prerequisites, install/config steps, verification, known issues, references.
- **Troubleshooting**: symptom, assumptions, dangerous-command warning, commands, expected result, recovery notes.
- **Technical concept note**: short preface, concept sections, examples, pitfalls, references.
- **Personal essay**: concrete memory or scene, present-day contrast, reflective question, optional date/location close.

Open directly. Good openings name the situation, problem, or scope. Avoid generic background such as "随着技术的发展" unless the user explicitly wants a broad essay.

## Chinese Prose

Keep Chinese technical prose natural but not over-polished. The blog often uses words like "使用", "本文", "这里", "直接", and "如果"; do not mechanically replace them just because a generic style guide prefers shorter words. Titles commonly use "如何...", "在 X 中...", "使用 X...".

Prefer:

- Concrete problem statements over broad introductions.
- Step-by-step lists for actual operations.
- Short warnings in blockquotes or `notice` shortcodes when commands are risky.
- "已知问题" and "参考链接" sections when they help readers act.
- Personal judgment when it comes from the author's experience.

Avoid:

- Repeating a paragraph's conclusion in a final abstract sentence.
- Ending with a generic life lesson or future outlook.
- "首先、其次、最后" unless it is a real ordered procedure.
- "不是 X，而是 Y" and similar contrast frames when a direct sentence works.
- "值得注意的是", "综上所述", "可以看出" as empty signposts.
- Decorative quotation marks used only for emphasis.

Use Chinese punctuation in Chinese prose. Add spaces between Chinese and Latin text where the project style needs readability, for example `Go 语言`, `PaperMod 博客`, and `Windows 10`. Do not use em dashes or en dashes.

## English Prose

English posts are usually concise tutorials. Improve obvious grammar, spelling, and unnatural phrasing when asked to optimize, but keep the simple, hands-on tone. Do not turn a post into sales copy.

Prefer:

- "Run this command", "Edit this file", "Use `lsblk` to check".
- Clear warnings for destructive commands.
- Specific assumptions, such as disk names, OS versions, paths, or package names.
- Plain verbs such as "use", "run", "edit", "copy", "mount", and "reboot".

Avoid:

- AI-like transitions: "Let's dive in", "In conclusion", "It is worth noting".
- Overstated claims: "robust", "seamless", "game-changing", "unlock".
- Dramatic fragments and rhetorical suspense.
- Decorative emoji in technical prose. Keep existing emoji in page titles or navigation unless asked to remove them.

## Structure And Formatting

Respect the existing structure around the target file. Existing posts use both `#` and `##` headings under a frontmatter title; do not normalize heading levels across the repository unless asked.

Keep lists when they are operational:

- Setup requirements.
- Ordered install steps.
- Configuration keys and values.
- Known issues.
- Reference links.

Consider converting lists to prose only when they are abstract commentary, repeated summaries, or AI-looking point lists with no scanning value.

Keep code blocks exact unless there is a factual or safety reason to change them. If a command is dangerous, add or preserve a warning instead of hiding the command. Do not invent successful command output.

## Accuracy Rules

Technical accuracy outranks style. Version numbers, current product behavior, prices, release status, package names, and external URLs can go stale; verify them in the current turn when the task depends on them, or add a date boundary such as "截至当时" or "at the time of writing".

For commands that modify disks, bootloaders, system packages, EFI partitions, Docker state, or remote servers, keep the risk visible. A casual tone is acceptable, but readers must understand when data loss or service impact is possible.

For personal experience, keep only what is supported by the author's existing posts or user-provided material. If the source material does not say the author tried something, do not write "我试过".

## Bilingual Rules

For paired zh/en posts:

- Keep frontmatter metadata aligned unless one language has a deliberate difference.
- Preserve product names, commands, paths, and config keys exactly.
- Translate meaning, not sentence order.
- Keep English technical terms in Chinese when that is the normal name, but avoid unnecessary English when a stable Chinese term exists.
- Fix obvious English mistakes during translation or polish, but do not erase the author's concise tutorial rhythm.

## Final Check

Before delivering:

- Confirm Hugo frontmatter is still valid YAML.
- Confirm code fences and shortcodes are still paired.
- Confirm headings still match the article's flow.
- Confirm commands, file paths, links, and images were not accidentally changed.
- Remove generic AI-style summaries, empty transitions, and em/en dashes.
