# Feliz aniversário

Site estático de uma carta de aniversário — envelope, carta e pote de memórias — para o domínio [feliz-aniversario.zurmely.com](https://feliz-aniversario.zurmely.com).

GitHub Pages serve os arquivos da raiz de `main`. Não há passo de build.

## Como editar o texto

**Todo o conteúdo visível está em [`content.js`](content.js).** Nomes, data, parágrafos da carta, assinatura e os recadinhos do pote. Não é preciso mexer em HTML, CSS nem no restante do JavaScript.

1. Abra `content.js`.
2. Troque os campos (há comentários em português em cada um).
3. Deixe `avisoPlaceholder` vazio (`""`) quando a carta real estiver pronta — a faixa amarela some.
4. Recarregue a página.

## Arquivos

| Arquivo        | Função                                      |
| -------------- | ------------------------------------------- |
| `content.js`   | Texto da carta (edite só este)              |
| `index.html`   | Estrutura da página                         |
| `styles.css`   | Visual roxo / lilás                         |
| `app.js`       | Envelope, confete e pote de memórias        |
| `CNAME`        | Domínio `feliz-aniversario.zurmely.com`     |
| `.nojekyll`    | Impede o Jekyll de processar o site         |
