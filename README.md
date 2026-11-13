# Feliz aniversário

Site estático de uma carta de aniversário — envelope animado e carta — para o domínio [feliz-aniversario.zurmely.com](https://feliz-aniversario.zurmely.com).

GitHub Pages serve os arquivos da raiz de `main`. Não há passo de build.

**Versão atual dos assets:** `20251113-v2` (query `?v=20251113-v2` em CSS, JS, SVG). Ao publicar mudanças, atualize esse sufixo em `index.html`, `styles.css` (url do pinguim) e nas meta tags de cache já estão no HTML.

## Como editar o texto

**Todo o conteúdo visível está em [`content.js`](content.js).** Nomes, data, parágrafos da carta e assinatura. Não é preciso mexer em HTML, CSS nem no restante do JavaScript.

1. Abra `content.js`.
2. Troque os campos (há comentários em português em cada um).
3. Recarregue a página.

## Arquivos

| Arquivo        | Função                                      |
| -------------- | ------------------------------------------- |
| `content.js`   | Texto da carta (edite só este)              |
| `index.html`   | Estrutura da página                         |
| `styles.css`   | Visual roxo / lilás                         |
| `app.js`       | Envelope, confete e chuva de pinguins       |
| `CNAME`        | Domínio `feliz-aniversario.zurmely.com`     |
| `.nojekyll`    | Impede o Jekyll de processar o site         |
