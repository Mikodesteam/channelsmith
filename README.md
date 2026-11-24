<p align="center">
  <img src="assets/logo.png" width="72" alt="Channelsmith logo">
</p>

<h1 align="center">Channelsmith</h1>

<p align="center">
  <b>Self-hosted documentary video studio for YouTube.</b><br>
  Research with cited sources → fact-checked script → maps, documents and licensed footage → voiceover → render → YouTube.<br>
  A person approves every upload.
</p>

<p align="center">
  <a href="https://channelsmith-demo.mikodes.com/"><b>▶ Live demo</b></a> ·
  <a href="https://channelsmith.mikodes.com/docs/"><b>Docs</b></a> ·
  <a href="https://channelsmith.mikodes.com/"><b>Website</b></a> ·
  <a href="https://store.mikodes.com/p/channelsmith/"><b>Get the full source code</b></a>
</p>

<p align="center">
  <img alt="Node.js 22" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Hono" src="https://img.shields.io/badge/Hono-server-E36002">
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-111">
</p>

<p align="center">
  <img src="assets/hero.gif" width="100%" alt="Channelsmith episode workspace">
</p>

> **This repository is a showcase.** It holds screenshots, documentation pointers and a few
> real excerpts from the code. The full application (server, studio, renderer, admin console,
> Docker files, tests and docs) is sold as source code at
> **[store.mikodes.com/p/channelsmith](https://store.mikodes.com/p/channelsmith/)**:
> one payment, instant ZIP download, free setup help.

---

## What it does

Channelsmith takes a topic and makes a 10–20 minute documentary or explainer episode for a YouTube channel in **nine steps**, each one you can review and edit:

| # | Step | What happens |
|---|------|--------------|
| 1 | **Research** | Claude searches and reads the web. Every fact is tied to a numbered source that was really retrieved; anything without a source moves into a list of gaps. |
| 2 | **Script** | Retention-structured outline (hook, promise, chapters, payoff) and a narration script whose paragraphs cite the facts. |
| 3 | **Fact check** | The script is checked against the dossier before any voice or render money is spent. |
| 4 | **Visuals** | A per-chapter storyboard: maps, documents, quote cards, timelines, comparisons. |
| 5 | **Footage** | Licensed clips from Pexels, Pixabay and Wikimedia Commons, with credits written for you. |
| 6 | **Render** | Voiceover with word timings (ElevenLabs), then a long render with its own Chrome frame renderer and ffmpeg. |
| 7 | **Package** | Three titles, a description with chapters and credits, tags and three thumbnails. |
| 8 | **Shorts** | Vertical Shorts cut from every long video. |
| 9 | **Publish** | YouTube upload with captions, schedule, playlist and the synthetic-content disclosure, after a person ticks “I watched the video and approve this upload”. |

## Screens

<p align="center"><img src="assets/research.png" width="49%" alt="Research dossier with numbered sources"> <img src="assets/factcheck.png" width="49%" alt="Fact check"></p>
<p align="center"><img src="assets/scenes.png" width="49%" alt="Documentary scenes: map, document, footage, quote, timeline, compare"> <img src="assets/package.png" width="49%" alt="Titles, description and thumbnails"></p>
<p align="center"><img src="assets/publish.png" width="49%" alt="Originality check and approval before upload"> <img src="assets/console.png" width="49%" alt="Operator console"></p>

## Features

- **Channels with a channel bible**: niche, audience, language, tone, style pack, topics to avoid, sign-off. Every episode inherits it.
- **Idea Lab**: video ideas with hook, angle and three title variants; approved ideas feed the queue.
- **Ten documentary style packs** with a film look, plus a scene editor.
- **Natural Earth maps**: pins, routes and places rendered offline.
- **Originality report**: eight self-checks against YouTube's published policies (a self-check, not a guarantee).
- **Content calendar, pipeline board and an autopilot that always stops at review.**
- **Workspaces, team roles, brand kits and client review links.**
- **Credits, plans and Stripe billing** if you sell the studio to creators.
- **Operator console**: settings, limits, keys, team and audit without touching code.
- **REST API, signed webhooks, MCP server and an episode CLI.**
- **Backups, restore, upgrade check, Docker.**

## Tech stack

| Layer | Technology |
|-------|------------|
| Server | Node.js 22, TypeScript, Hono, better-sqlite3, Zod |
| Studio | React 19, Vite |
| AI | Anthropic Claude (with web search and fetch), ElevenLabs |
| Render | puppeteer-core (Chrome) + ffmpeg |
| Footage | Pexels, Pixabay, Wikimedia Commons |
| Deploy | Docker or Ubuntu VPS |

## A look at the code

A real excerpt is in [`snippets/clean-dossier.ts`](snippets/clean-dossier.ts): the function that removes every source Claude did not actually retrieve, renumbers the rest and moves unsupported facts into the list of gaps. This is why a Channelsmith script cannot cite a page nobody read.

## Requirements (full version)

- Node.js 22.12+, Google Chrome or Chromium, ffmpeg and ffprobe
- A Linux VPS or Docker host with HTTPS
- Your own API keys: Anthropic, ElevenLabs, Pexels and/or Pixabay (free)
- For public YouTube uploads: a Google Cloud project with the YouTube API (Google keeps uploads private until it audits your project)

Not included: hosting, API usage costs, any audience or revenue. No text-to-video model, no AI avatars and no reuse of other creators' videos.

## Get the full source code

<p align="center">
  <a href="https://store.mikodes.com/p/channelsmith/"><img src="https://img.shields.io/badge/Get%20the%20full%20source%20code-store.mikodes.com-4F2BFF?style=for-the-badge" alt="Get the full source code"></a>
</p>

One payment, full licence, instant ZIP download and free setup help.
Questions: [mikodes.com/support](https://mikodes.com/support).

---

<p align="center">
  Made by <a href="https://mikodes.com"><b>MIKODES</b></a> · <a href="https://github.com/Mikodesteam">more projects</a>
</p>
