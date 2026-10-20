# CTL — Construa. Teste. Lance.

Site estático em HTML, CSS e JavaScript puro, sem dependências.

- `/` abre o diagnóstico de 8 perguntas.
- `/desafio/` é a landing do desafio de 7 dias, com o jogo do crachá no topo.

## Rodar no computador

Precisa do Node.js 18 ou mais novo.

```bash
npm run dev
```

Abra `http://127.0.0.1:3000`. Para outra porta: `PORT=8080 npm run dev`.

Os caminhos são relativos, então dá para publicar a pasta inteira em qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, Hostinger etc.).

## Antes de publicar

1. **Link de inscrição:** já está o checkout da Kiwify em `assets/js/config.js`. Todos os botões de compra usam esse endereço, e as UTMs do anúncio são repassadas do quiz para a landing e para o checkout.
2. **Confira:** `npm run check` avisa se falta arquivo ou se o link ainda está vazio.
3. **Valores dos entregáveis:** cada item do preço tem um valor em `includes` (`assets/js/content.js`) e a soma aparece como "Valor de tudo". Mantenha a soma igual ao "De" do preço.
4. **Preço:** a página nunca mostra o valor antes da seção de entrega (#entrega). Todos os botões levam para lá; só o botão do card de preço vai para o checkout. O valor aparece como 12x de R$15,20. Se mudar, edite `desafio/index.html` (classe `price-now` e `price-today`).
5. **Preço "de R$997":** só mantenha se esse valor foi cobrado de verdade antes. Preço de referência inventado é propaganda enganosa (CDC).
6. **Números:** os dados da seção "O trabalho está mudando rápido" mudam com o tempo. Revise as fontes em `assets/js/content.js`.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Perguntas, resultados, números, checklist, 7 dias, lista do preço, "é para você" | `assets/js/content.js` |
| Textos fixos da landing (título, jogo, dúvidas, fundador) | `desafio/index.html` |
| Textos do diagnóstico | `assets/js/quiz.js` |
| Cores e fontes | `assets/css/base.css` (variáveis no topo) |
| Visual da landing e do jogo | `assets/css/landing.css` |
| Lógica do jogo do crachá | `assets/js/game.js` |

## Depoimentos

A seção só aparece quando `testimonials` em `assets/js/content.js` tiver relatos **reais e autorizados por escrito**:

```js
testimonials: [
  { quote: "O que a pessoa disse, nas palavras dela.", name: "Nome", context: "Turma de outubro" }
]
```

## O jogo do crachá

Três passos, sem atacar o emprego:

1. A pessoa passa o crachá da empresa na catraca e o acesso é liberado. A mensagem é que ele paga as contas, mas abre uma porta só.
2. Ela escreve o nome e escolhe onde quer construir o segundo crachá: **um projeto próprio** (fora do expediente) ou **uma ideia nova dentro da empresa**. O crachá da empresa vai para o canto e continua na cena.
3. Ela passa o seu crachá, e uma porta se abre com oportunidades para pegar. Os itens mudam conforme o caminho escolhido (edite em `doorItems`, no `assets/js/content.js`).

Funciona com o dedo, com o mouse e também só com os botões (teclado e leitor de tela). Com "reduzir movimento" ativado no aparelho, as animações ficam mínimas. A empresa do crachá é fictícia de propósito.
