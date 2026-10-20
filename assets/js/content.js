/* Textos editáveis do site. Mude aqui sem mexer no resto do código. */
window.CTL_CONTENT = {
  cta: window.CTL_CTA_URL || "#",

  /* Diagnóstico (página inicial). Cada resposta: [texto, pontos de 0 a 3]. */
  questions: [
    {q:"De onde vem o dinheiro que paga suas contas hoje?",a:[["De várias fontes",0],["De duas fontes",1],["Quase tudo de uma só",2],["Tudo de uma fonte só",3]],pain:"Quase tudo o que entra depende de uma fonte só."},
    {q:"Se essa renda parasse de entrar, por quanto tempo as contas ficariam em dia?",a:[["Mais de um ano",0],["De seis meses a um ano",1],["De dois a cinco meses",2],["Menos de dois meses",3]],pain:"Sem a renda de hoje, as contas apertariam rápido."},
    {q:"O que descreve você agora?",a:[["Já vivo de um projeto meu",0],["Tenho um projeto paralelo",1],["Faço outras coisas e quero criar algo meu",2],["Ainda não comecei nada meu",3]],pain:"Você ainda não tem um projeto seu no ar."},
    {q:"Você quer aprender a criar uma solução, mesmo sem pensar em vender agora?",a:[["Já crio",0],["Sim, e já tentei",1],["Sim, mas não sei como",2],["Sim, e isso ficou para depois",3]],pain:"Você quer criar, mas ainda não tem o caminho."},
    {q:"Você já começou algum projeto e parou no meio?",a:[["Não, costumo terminar",0],["Uma vez",1],["Duas ou três vezes",2],["Já perdi a conta",3]],pain:"Algumas ideias ficaram pelo caminho."},
    {q:"O que mais faz você adiar um projeto seu?",a:[["Nada, já estou fazendo",0],["Falta de tempo",2],["Não sei qual é o primeiro passo",3],["Medo de gastar tempo e dinheiro à toa",3]],pain:"Falta de tempo ou medo de errar te deixam parado."},
    {q:"Há quanto tempo você pensa em começar algo seu?",a:[["Já comecei",0],["Há alguns meses",1],["Há mais de um ano",2],["Faz tempo, e nunca sai do papel",3]],pain:"Começar algo seu está ficando para depois há muito tempo."},
    {q:"Você já usou IA para construir alguma coisa?",a:[["Sim, e ficou no ar",0],["Testei um pouco",1],["Quase nunca",2],["Nunca",3]],pain:"A IA ainda não é uma ferramenta que você usa para criar."},
    {q:"Qual parte parece mais difícil hoje?",a:[["Já estou construindo",0],["Escolher qual ideia seguir",1],["Criar a primeira versão",2],["Não sei por onde começar",3]],pain:"Você precisa de um caminho claro, passo a passo."},
    {q:"Mostrar o que você fez para pessoas de verdade…",a:[["Já faço",0],["Faço se tiver um roteiro",1],["Evito",2],["Nem pensei nisso",3]],pain:"Mostrar para gente de verdade ainda trava você."},
    {q:"Se daqui a um ano estiver tudo igual, como você se sente?",a:[["Bem, estou satisfeito",0],["Um pouco incomodado",1],["Frustrado",2],["Com vontade de ter começado antes",3]],pain:"Você não quer chegar daqui a um ano na mesma."}
  ],
  results:[
    {max:11,level:"Tem espaço para começar",title:"Bom momento para criar com calma.",body:"Nada aqui grita urgência. O risco é outro: deixar a ideia só na cabeça.",read:"Você tem folga para aprender sem apertar o que já faz. O primeiro passo é escolher um problema que você já entende — no emprego, por conta própria ou só para criar."},
    {max:22,level:"A vontade já existe",title:"Dá para sair da vontade e dar o primeiro passo.",body:"Você já sabe que quer algo seu. Falta ordem, não intenção.",read:"A ideia existe, o caminho não. Uma hora por dia, na ordem, tira isso do “um dia” e põe a primeira versão no ar. Vender pode ser depois."},
    {max:33,level:"Está na hora de um caminho",title:"Adiar o que é seu já pesa.",body:"Faz sentido querer outra opção. Você não precisa largar o que faz hoje.",read:"Quase tudo ainda depende de uma rotina só, e o projeto seu não saiu. O diagnóstico é este: você precisa de um passo a passo, não de mais um plano na gaveta."}
  ],

  /* Números com fonte. Revise antes de publicar: esses dados mudam. */
  stats:[
    {n:30,unit:" mi",body:"de brasileiros trabalham em funções com alguma exposição à IA generativa. Quase 30% de quem tem emprego.",source:"FGV Ibre, 3º tri de 2025, via Olhar Digital",url:"https://olhardigital.com.br/2026/04/19/inteligencia-artificial/ia-ja-reduz-emprego-e-renda-de-jovens-brasileiros-diz-estudo/"},
    {n:152,unit:" mil",body:"demissões no setor de tecnologia em 2026, até junho. A IA foi citada como motivo em cerca de 61% delas.",source:"TrueUp e TradingPlatforms, via Hardware.com.br",url:"https://www.hardware.com.br/noticias/demissoes-tecnologia-2026-ia/amp/"},
    {n:40,unit:"%",body:"dos empregos em países emergentes devem ser afetados pela IA, segundo o FMI. Em países ricos, até 60%.",source:"FMI, jan/2024, via CNN Brasil",url:"https://www.cnnbrasil.com.br/internacional/inteligencia-artificial-deve-afetar-40-dos-empregos-no-mundo-diz-fmi/"}
  ],

  /* Caminho sem prazo (seção "Renda extra hoje"). at = posição na linha, de 0 a 100. own = altura da barra "Seu projeto" (0 a 1, só ilustração).
     milestones = conquistas que acendem quando o caminho passa daquele ponto. Ícones: launch, chat, coin, home, key. */
  horizon:{
    stops:[
      {at:0,label:"Hoje",title:"Ainda não tem um projeto seu.",body:"O que existe hoje é a rotina que você já conhece. Um projeto seu ainda não está no ar — e isso dá para mudar.",own:0},
      {at:33,label:"No ar",title:"Algo seu no ar.",body:"A primeira versão já existe e você já começou a vender. Agora você sabe o que funciona e o que mudar.",own:.1},
      {at:66,label:"Renda extra",title:"Uma renda extra.",body:"Um dinheiro a mais que entra por algo que você construiu. Para respirar no fim do mês e parar de contar os dias até o pagamento.",own:.32},
      {at:100,label:"Liberdade",title:"Mais liberdade para escolher.",body:"Mais tempo com quem você ama. Estar nos momentos da família sem pedir permissão. Trabalhar porque quer, não porque não tem outra opção.",own:.62}
    ],
    milestones:[
      {at:14,icon:"launch",label:"Primeira versão no ar"},
      {at:26,icon:"chat",label:"Conversas com clientes"},
      {at:66,icon:"coin",label:"Renda extra entrando"},
      {at:82,icon:"home",label:"Mais tempo com a família"},
      {at:100,icon:"key",label:"Liberdade para escolher"}
    ]
  },

  /* O que aparece atrás da porta, no fim do jogo do crachá. Um grupo para cada caminho.
     Ícones: coin, home, launch, key, shield, idea, star, growth, learn. */
  doorItems:{
    fora:[
      {icon:"heart",label:"Uma solução que ajuda pessoas"},
      {icon:"coin",label:"Renda extra"},
      {icon:"home",label:"Tempo com a família"},
      {icon:"launch",label:"Seu produto no ar"},
      {icon:"key",label:"Liberdade para escolher"},
      {icon:"people",label:"Gente que agradece pelo que você criou"}
    ],
    dentro:[
      {icon:"heart",label:"Uma solução que ajuda colegas e clientes"},
      {icon:"idea",label:"Uma ideia sua saindo do papel"},
      {icon:"star",label:"Um projeto com o seu nome"},
      {icon:"growth",label:"Mais chances de crescer"},
      {icon:"learn",label:"Aprender a criar com IA"},
      {icon:"people",label:"Menos trabalho chato para o time"}
    ]
  },

  /* Vitrine "Em qualquer área, o problema vira uma solução": exemplos de SaaS (não são casos reais; valores ilustrativos).
     ui = qual solução desenhada aparece no celular: gym, care, edu, crm, salon, cash, build, menu, help, auto, custom. */
  areas:[
    {area:"Academia",ui:"gym",who:"Personal trainer",problem:"Quem começa a treinar não sabe o que fazer em cada dia e desiste.",name:"Série do Dia",color:"#C4511A",tagline:"O treino do dia, exercício por exercício, no celular.",features:["Treino do dia","Séries e cargas","Quem treinou na semana"],money:"Assinatura de R$39 por mês, por aluno"},
    {area:"Saúde",ui:"care",who:"Técnica de enfermagem",problem:"Famílias se perdem nos horários de remédio de um idoso em casa.",name:"CuidaBem",color:"#1F8B78",tagline:"Remédios, rotina e alertas para quem cuida de um idoso.",features:["Agenda de remédios","Alerta para a família","Histórico do dia"],money:"Assinatura de R$19 por mês, por família"},
    {area:"Mães",ui:"baby",who:"Mãe que já passou por noites sem dormir",problem:"Mães de primeira viagem não sabem a hora certa de colocar o bebê para dormir.",name:"Soninho",color:"#4B4FA8",tagline:"Registra o sono do bebê e avisa a hora da próxima soneca.",features:["Registro de sono","Aviso da próxima soneca","Resumo da semana"],money:"Assinatura de R$19 por mês, por família"},
    {area:"Educação",ui:"edu",who:"Professora",problem:"Crianças travam na matemática e os pais não sabem ajudar.",name:"Lição Leve",color:"#5B5BD6",tagline:"Reforço de matemática em fases curtas, como um jogo.",features:["Exercícios por fase","Pontos e conquistas","Relatório para os pais"],money:"Assinatura de R$24 por mês, por aluno"},
    {area:"Vendas",ui:"crm",who:"Vendedor de loja",problem:"Lojistas perdem clientes porque esquecem de responder.",name:"Funil Fácil",color:"#D9692B",tagline:"Todos os clientes da loja em um funil simples.",features:["Funil de clientes","Lembrete de retorno","Vendas do mês"],money:"Assinatura de R$49 por mês, por loja"},
    {area:"Beleza",ui:"salon",who:"Cabeleireira",problem:"Clientes esquecem horários e o salão fica com buracos na agenda.",name:"Agenda Bela",color:"#C04E78",tagline:"Agenda online com lembrete automático para a cliente.",features:["Agendamento online","Lembrete automático","Lista de espera"],money:"Assinatura de R$39 por mês, por salão"},
    {area:"Administrativo",ui:"cash",who:"Assistente administrativo",problem:"Pequenas empresas não sabem quanto entra e quanto sai.",name:"Caixa Claro",color:"#2E4A6E",tagline:"O caixa da empresa em uma tela, sem planilha.",features:["Entradas e saídas","Saldo na hora","Resumo do mês"],money:"Assinatura de R$29 por mês, por empresa"},
    {area:"Construção",ui:"build",who:"Mestre de obras",problem:"Quem vai reformar não faz ideia de quanto vai gastar.",name:"Orça Obra",color:"#B4761C",tagline:"Orçamento de reforma em segundos, direto no celular.",features:["Cálculo por cômodo","Padrão de acabamento","Orçamento para enviar"],money:"Assinatura de R$19 por mês, por profissional"},
    {area:"Alimentação",ui:"menu",who:"Cozinheira",problem:"Famílias sem tempo não sabem o que fazer para o jantar.",name:"Cardápio da Semana",color:"#3E8A3A",tagline:"Cardápio da semana e lista de compras prontos.",features:["Cardápio semanal","Lista de compras","Receitas rápidas"],money:"Assinatura de R$15 por mês, por família"},
    {area:"Tecnologia",ui:"help",who:"Analista de suporte",problem:"Pessoas mais velhas se perdem no celular e não têm a quem pedir.",name:"Ajuda Digital",color:"#2563A8",tagline:"Um botão para chamar alguém que ajuda, na hora.",features:["Botão de ajuda","Chamada com atendente","Aulas curtas"],money:"Assinatura de R$29 por mês, por pessoa"},
    {area:"Dentro da empresa",ui:"auto",who:"Qualquer cargo",problem:"A equipe perde horas toda semana montando o mesmo relatório.",name:"Relatório Automático",color:"#17150F",tagline:"O relatório da semana se monta sozinho, com IA.",features:["Dados juntos","Relatório pronto às 8h","Alerta de números fora do normal"],money:"Gera valor para a empresa: horas da equipe de volta",intra:true},
    {area:"Outra área",ui:"custom",who:"Você",problem:"Alguém perto de você tem um problema que você entende bem.",name:"A sua solução",color:"#C9A04A",tagline:"Escreva o problema e veja a sua solução ganhar forma.",features:["Você escolhe o problema","A IA ajuda a montar","A gente mostra cada passo"],money:"Nos dias 1 e 2, a gente encontra o seu"}
  ],

  /* Toque para marcar. */
  checklist:[
    "Todas as minhas contas dependem de um salário.",
    "Tenho vontade de criar algo meu, mas não sei o quê.",
    "Chego cansado e não sobra energia para começar.",
    "Já comecei um projeto e parei no meio.",
    "Nunca usei IA para criar nada."
  ],

  /* Trilha do que a gente entrega. scene = desenho animado do passo (access, idea, offer, build, show, improve, launch).
     action = texto do botão que "faz" o passo; done = o que aparece depois. */
  days:[
    {day:"Dias 1 e 2",short:"1",phase:"Ideia",scene:"idea",url:"ferramenta de IA",title:"Usamos ferramentas para amadurecer a sua ideia.",body:"Você entra e já tem o método. Não precisa chegar com uma ideia pronta. Com IA e um roteiro simples, a gente transforma o que você já sabe em uma ideia clara: para quem é e qual problema resolve.",action:"Organizar minhas ideias com IA",done:"Suas ideias soltas viraram uma ideia clara.",out:"Uma ideia escolhida"},
    {day:"Dia 3",short:"2",phase:"Oferta",scene:"offer",url:"documento",title:"Escrevemos a sua oferta.",body:"Uma frase que qualquer pessoa entende em segundos: para quem é, o que resolve e por que vale a pena.",action:"Escrever minha oferta",done:"Sua oferta cabe em uma frase.",out:"A frase da sua oferta"},
    {day:"Dia 4",short:"3",phase:"Construir",scene:"build",url:"ferramenta de IA",title:"Construímos a sua solução do zero, com IA.",body:"Não precisa saber programar nem entender de tecnologia. Você descreve a solução, a ferramenta de IA monta e a gente mostra cada clique.",action:"Construir com IA",done:"A primeira versão ficou pronta, sem uma linha de código.",out:"A primeira versão"},
    {day:"Dia 5",short:"4",phase:"Mostrar",scene:"show",url:"mensagens",title:"Mostramos para gente de verdade.",body:"Você envia para pessoas que não são seus amigos nem parentes e anota o que respondem. A gente te dá o roteiro da conversa.",action:"Enviar para 5 pessoas",done:"As respostas chegaram. Agora você sabe o que pensam.",out:"Respostas reais"},
    {day:"Dia 6",short:"5",phase:"Melhorar",scene:"improve",url:"anotações",title:"Melhoramos com o que você ouviu.",body:"Juntos, decidimos o que manter, o que ajustar e o que cortar. Sem achismo: com base nas respostas.",action:"Aplicar as melhorias",done:"Sua ideia ficou mais forte.",out:"Uma versão melhor"},
    {day:"Dia 7",short:"6",phase:"No ar",scene:"launch",url:"seuprojeto.com.br",title:"Colocamos o seu projeto no ar.",body:"Você termina com algo seu publicado, com link para mandar para quem quiser.",action:"Colocar no ar",done:"Está no ar. Agora falta levar até quem precisa.",out:"Algo seu no ar"},
    {day:"Dia 7 em diante",short:"7",phase:"Clientes",scene:"distribute",url:"seus canais",title:"Levamos o seu produto até os clientes.",body:"Não adianta construir sem ter clientes. A gente ensina onde encontrar as primeiras pessoas, o que dizer e como começar a vender toda semana, com ou sem anúncio.",action:"Distribuir meu produto",done:"Seu produto saiu da gaveta. Você começa a vender.",out:"Um plano para começar a vender"}
  ],

  /* O que vem no CTL (bloco de preço). value = valor de cada entrega. A soma deve bater com o "De" do preço. */
  includes:[
    {label:"Bônus, não o produto principal: módulo de páginas para empresas, para se pagar antes de lançar a solução.",pitch:true},
    {label:"Aulas curtas e materiais para cada um dos 7 dias",value:197},
    {label:"Ferramentas de IA e roteiro para amadurecer a sua ideia",value:97},
    {label:"Passo a passo para construir a sua solução com IA, sem programar",value:197},
    {label:"Como distribuir o produto e encontrar os primeiros clientes",value:197},
    {label:"Roteiro para começar a vender",value:67},
    {label:"Guia para abrir a sua empresa do jeito mais barato e fácil",value:97},
    {label:"Planilha financeira para ver se a conta fecha",value:48},
    {label:"Novos ciclos para continuar depois dos 7 dias",value:97}
  ],

  audienceIn:["Quer aprender a criar — vender pode ser depois.","Tem uma hora por dia, mesmo sem saber programar.","Quer um projeto seu, no emprego ou fora dele.","Aceita fazer o passo, não só assistir aula."],
  audienceOut:["Procura dinheiro rápido ou fórmula mágica.","Quer que alguém faça no seu lugar.","Só quer assistir aula, sem colocar a mão.","Está esperando o momento perfeito."],

  /* Tabuleiro: cada casa aparece antes da seção indicada (before = seletor CSS).
     kind: "chance" (carta dourada, oportunidade) ou "real" (carta vermelha, realidade). */
  board:[
    {before:".numbers",title:"A largada",kind:"real",card:"Carta Realidade",text:"{nome}, a IA já muda o jeito de criar. O que você faz agora?",
      choice:[{t:"Fico só olhando",bad:true,msg:"<b>Volte 2 casas.</b> Quem só assiste fica para trás."},{t:"Aprendo a construir com IA",msg:"<b>Boa, {nome}.</b> Avance. Quem constrói não fica para trás."}]},
    {before:".check",title:"O espelho",kind:"chance",card:"Carta Oportunidade",text:"Seja honesto com você. Saber onde está é o primeiro passo para sair."},
    {before:"#futuro",title:"O horizonte",kind:"real",card:"Carta Decisão",text:"São 21h. Você tem uma hora livre. O que faz com ela?",
      choice:[{t:"Deixo para depois",bad:true,msg:"<b>Volte 1 casa.</b> A hora livre passa e nada muda."},{t:"Construo algo meu",msg:"<b>Avance.</b> Uma hora por dia muda o ano inteiro."}]},
    {before:"#como-funciona",title:"O atalho",kind:"chance",card:"Carta Atalho",text:"Você não precisa programar. A IA escreve o código. Avance três casas."},
    {before:"#areas",title:"Os dados",kind:"chance",card:"Carta Oportunidade",text:"Qualquer área vira solução. Jogue os dados e veja a sua."},
    {before:"#grana",title:"A grana",kind:"chance",card:"Carta Prêmio",text:"Salário cai uma vez por mês. Assinatura pinga todo mês, de cada cliente."},
    {before:"#quem-criou",title:"Quem já jogou",kind:"real",card:"Carta Realidade",text:"Ninguém nasce sabendo. Quem criou o CTL também começou de crachá."},
    {before:".fit",title:"A bifurcação",kind:"real",card:"Carta Escolha",text:"A estrada se divide aqui, {nome}. Para que lado você vai?",fork:true},
    {before:"#entrega",title:"O prêmio",kind:"chance",card:"Carta Prêmio",text:"{nome}, a sua caixa de prêmio está logo abaixo. Abra."},
    {before:"#duvidas",title:"As regras",kind:"real",card:"Regras do jogo",text:"Antes de jogar, leia as regras. Sem letra miúda."}
  ],
  /* Desvio da bifurcação: dúvidas e respostas */
  forkDoubts:[
    {q:"Não tenho tempo",a:"Uma hora por dia basta. Dá para fazer depois do trabalho, sem largar nada."},
    {q:"Não sei programar",a:"Ninguém aqui programa. Você descreve o que quer, a IA constrói e a gente te guia."},
    {q:"E se eu perder dinheiro?",a:"Em 7 dias você pede reembolso e devolvemos tudo. É o direito do consumidor em compra pela internet."}
  ],
  /* A conta da recorrência (simulação, não é promessa) */
  grana:{
    prices:[19,29,49,97,197], price:197, clients:1, max:1000
  },


  /* Relatos recebidos. Formato: {quote:"...", name:"...", context:"..."} */
  testimonials: [
    {quote:"Se eu pudesse, compraria 2x de novo. Sensacional. Eu sou manicure, quase não entendo de computador e ainda assim consegui criar uma agenda automatizada e controle de estoque para minhas clientes conseguirem marcar e ver o que tem disponível.",name:"Maria L.",context:"Manicure"},
    {quote:"Entrega o que promete! Tive uma ótima experiência e me ajudou muito no meu trabalho. Você me livrou de um burnout. Eu consegui criar em menos de 7 dias. Seria perfeito a área de membros com um modo escuro.",name:"Sandra S.",context:"Criou em menos de 7 dias"},
    {quote:"Eu entrei faz 2 semanas. Já consegui os primeiros usuários, apesar de não serem muitos. Já estou melhorando o projeto para ficar mais redondo. Já estou construindo uma recorrência pensando no longo prazo.",name:"André F.",context:"Entrou há 2 semanas"},
    {quote:"Criei meu app para organizar as consultas e o acompanhamento das pacientes da minha esposa. Ela tá amando. Tá surreal o negócio. Jamais imaginaria que eu conseguiria chegar a algo nesse padrão. Obrigado de verdade.",name:"Welington R.",context:"Solução para as pacientes da esposa"}
  ]
};
