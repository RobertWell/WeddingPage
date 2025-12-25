# Tailwind 主題與色彩系統

這個專案改為**用 Tailwind 顏色 token + CSS 變數**控制主題，集中管理在 `index.html` 的 Tailwind 設定與 `THEME_PALETTES`。

## 色彩 token 的核心概念

- Tailwind 在 `<script>tailwind.config = {...}</script>` 中定義 `colors.primary / accent / ink / muted / border`。
- 這些 token 使用 CSS 變數（例如 `rgb(var(--color-primary) / <alpha-value>)`）。
- 主題切換只需要更新 `:root` 的 CSS 變數，Tailwind 類別就會自動套用新顏色（包含 `--leaf-pattern` / `--leaf-pattern-secondary` 裝飾圖樣）。

## 主題定義的位置

- `index.html` 中的 `THEME_PALETTES` 為唯一來源（single source of truth）。
- 每個主題是一個物件，鍵值對應 `--color-*`、`--leaf-pattern` 與 `--leaf-pattern-secondary`。

```js
const THEME_PALETTES = {
  spring: {
    "color-primary": "34 139 92",
    "color-accent": "214 180 138",
    ...
    "leaf-pattern": "url(\"data:image/svg+xml,...\")",
    "leaf-pattern-secondary": "url(\"data:image/svg+xml,...\")",
  },
};
```

## 主題切換的流程

1. `applyTheme(themeName)` 取得 `THEME_PALETTES[themeName]`。
2. 將 palette 內容寫入 `document.documentElement.style.setProperty('--color-*', value)`。
3. Tailwind 依據 CSS 變數自動更新 UI 顏色。

## 新增主題的步驟

1. 在 `THEME_PALETTES` 新增一個主題（例如 `dusk`）。
2. 加入對應的 `data-theme-button="dusk"` 按鈕。
3. 不需新增 CSS class，也不需改 Tailwind config（裝飾圖樣可同步替換）。

## 設計上的優點

- 顏色系統集中在一處，容易管理。
- 不會在 CSS 中到處分散主題 class。
- Tailwind utilities 可直接使用 `text-primary`、`bg-accent`、`border-border`。
