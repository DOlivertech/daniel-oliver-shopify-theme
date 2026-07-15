# DO Racing — Shopify theme

A custom Online Store 2.0 theme for the Daniel Oliver Racing store. Dark ink base with pink, violet and cyan gradient accents, an animated starfield background, Unbounded display type, Space Grotesk body and Space Mono for eyebrows and prices. The design language is ported from danieloliverracing.com.

> **Part of the [Daniel Oliver Racing](https://github.com/DOlivertech/daniel-oliver-site) project.**
> The main site (Astro 5 + Decap CMS) lives in [DOlivertech/daniel-oliver-site](https://github.com/DOlivertech/daniel-oliver-site);
> this repo is the Shopify storefront theme that mirrors its look. Live site: <https://danieloliverracing.com>.

## File structure

```
assets/          theme.css, theme.js, galaxy.js, chibi-daniel.webp, favicon.png
config/          settings_schema.json, settings_data.json
layout/          theme.liquid, password.liquid
locales/         en.default.json
sections/        header, footer, hero, featured-collection,
                 main-product, main-collection, main-list-collections,
                 main-cart, main-page, main-404, main-search,
                 main-blog, main-article, main-password
snippets/        price.liquid, product-card.liquid
templates/       index.json, product.json, collection.json,
                 list-collections.json, cart.json, page.json,
                 404.json, search.json, blog.json, article.json,
                 password.liquid
```

## Install

### Option A — Upload a ZIP

From the folder that contains `daniel-oliver-shopify-theme`:

```bash
cd daniel-oliver-shopify-theme && zip -r ../do-racing-theme.zip assets config layout locales sections snippets templates
```

Then in the Shopify admin: Online Store, then Themes, then Add theme, then Upload ZIP file. Select `do-racing-theme.zip`.

### Option B — Connect from GitHub

Push this folder as its own repository, with the theme directories (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`) at the repository root. In the Shopify admin choose Add theme, then Connect from GitHub (this requires the Shopify GitHub app), and select the branch.

## Post-install checklist

1. Theme settings: set the logo, the social URLs, the main site URL and the footer motto.
2. Create a navigation menu with the handle `main-menu` for the header, and one with the handle `footer` for the footer links.
3. On the home page, open the theme editor and pick a collection for the Featured collection section.

## Notes

- `gift_card.liquid` and the classic customer-account templates are intentionally omitted. Shopify's hosted checkout and the new customer accounts cover those flows.
- The password (pre-launch) page is fully themed via `layout/password.liquid`, `templates/password.liquid` and `sections/main-password.liquid`.
- No external JavaScript libraries are used. All animation respects `prefers-reduced-motion`.
