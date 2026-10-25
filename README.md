# VyuhaAero Systems Website

The official VyuhaAero Systems website: a React + Vite single-page site, deployed to GitHub Pages, with content managed through [Pages CMS](https://pagescms.org).

## Editing content (no code needed)

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
2. The first time, install the Pages CMS GitHub App on the **VyuhaAero** organisation and give it access to this repository.
3. Open **VyuhaAero/website** (branch `main`). The sidebar lists:
   - **Updates (news)**: add, edit or unpublish news posts. Tick *Draft* to hide a post.
   - **Site, hero, film, careers and contact**: headline, introduction, launch film, join-us text, email and social links.
   - **What we build**, **How we work**, **Roadmap**, **People**: the matching home-page sections.
4. Save. Each save is a commit to `main`; GitHub Actions rebuilds the site and it is live in about a minute or two.

Images and videos uploaded through the CMS are stored in `public/media/`. Keep product content at name-and-status level: no specifications, performance figures or test results until they are measured and approved for release.

## Where content lives

| Path | What it holds |
| --- | --- |
| `content/site.json` | Hero, statement, who we are, film, careers, contact |
| `content/capabilities.json` | Capability areas and programmes |
| `content/principles.json` | How we work |
| `content/roadmap.json` | Roadmap phases |
| `content/team.json` | People |
| `content/updates/*.md` | News posts (YAML front matter + Markdown) |
| `public/media/` | Images, the launch film and its poster |
| `.pages.yml` | Pages CMS configuration (fields and labels) |

## Development

Requires Node.js 22 or later.

```bash
npm ci
npm run dev
```

Create a production build with `npm run build`. The `main` branch is built and deployed to GitHub Pages by `.github/workflows/pages.yml`.

Pages use hash routes (`#/updates/<slug>`), so the site works on GitHub Pages without server rewrites.
