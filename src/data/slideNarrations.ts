// Slide narrations data structure
// Each slide has:
// - spokenText: What NoVo says out loud (conversational, for TTS)
// - displayText: Formatted text shown in the Text Output box (structured with headings)
// - audioUrl: Pre-generated audio file path (populated after TTS generation)

export interface SlideNarration {
  slide: number
  title: string
  spokenText: string
  displayText: string
  audioUrl?: string
}

export interface NarrationData {
  en: SlideNarration[]
  pt: SlideNarration[]
}

export const slideNarrations: NarrationData = {
  en: [
    // Slide 0: Cover/Welcome
    {
      slide: 0,
      title: "Welcome",
      spokenText: `Hello! I'm NoVo, the new personal assistant from Novocom AI. Just press the start button when you are ready and we can begin to go through the presentation.

It should not take longer than 5 minutes. You can also stop me and ask any questions you have at any time — just say my name "Novo" and I will listen to your question and do my best to answer it for you.

Whenever you are ready....`,
      displayText: `**Welcome to NoVo Travel Assistant**

• Press Start when ready
• Presentation takes approximately 5 minutes
• Say "Novo" anytime to ask a question
• I'll pause, listen, and answer before continuing`,
    },
    // Slide 1: The Problem
    {
      slide: 1,
      title: "The Problem",
      spokenText: `Let's talk about the fundamental problem we're solving. AI is not being used effectively in today's market.

Most people use AI superficially — they cut, paste, and move on. There's no real integration or thoughtful application.

Companies treat AI as an add-on feature, not as a genuine value driver. It's being bolted onto existing systems rather than thoughtfully integrated.

Developers focus too much on analytics and not enough on the human context — the real-world situations where people need help.

And people simply aren't informed about what AI can do for them.

The result? A perfect storm of missed opportunities. We're still stuck typing when we should be having natural conversations.

This is the gap NoVo is designed to fill.`,
      displayText: `**The Problem**
The fundamental issue is that AI is not being used effectively in today's market.

**How People Use AI Today:**
Most people use AI superficially — they simply cut, paste, and move on. There's no real integration or thoughtful application of the technology.

**How Companies Treat AI:**
Companies are treating AI as an add-on feature, not as a genuine value driver. It's being bolted onto existing systems rather than being thoughtfully integrated to create real value.

**The Developer Disconnect:**
AI developers are focusing too heavily on analytics and data, but not enough on the human context — the real-world situations where people need help and support.

**The Information Gap:**
People simply aren't informed about the potential uses of AI. They don't understand what's possible, which means they can't take advantage of the opportunities available to them.

**The Result:**
This creates a perfect storm of missed opportunities for improvement and poor integration with real-world services. We're still stuck waiting to free ourselves from the keyboard interface — we're literally typing away when we should be having natural conversations.

This is the gap NoVo is designed to fill. We recognize that travel is a context-rich, human experience that requires understanding, not just data processing. Our AI assistant engages naturally with travelers in the way they actually think and communicate.`,
    },
    // Slide 2: The Opportunity
    {
      slide: 2,
      title: "The Opportunity",
      spokenText: `So we've seen the problem — AI isn't being used effectively. But here's the opportunity.

Loneliness is one of the defining challenges of our time. It's a modern human condition, and people are increasingly turning to technology for connection and support.

And the data proves this: companion apps are by far the most popular category of AI applications. People don't just want tools — they want someone to talk to. Someone who understands them.

Recent advances in contextual AI — models like GPT-5, Claude, and Gemini — have changed everything. These models now understand context, tone, and intent. They can have real conversations.

This is exactly what NoVo is designed to be: not just a travel tool, but a travel companion. Someone who understands your needs, remembers your preferences, and is always there when you need help.`,
      displayText: `**The Opportunity**
Building on the problem we just discussed — there's a clear opportunity here.

**The Modern Human Condition:**
Loneliness is one of the defining challenges of our time. People are increasingly turning to technology for connection and support.

**What the Data Shows:**
Companion apps are by far the most popular category of AI applications. People don't just want tools — they want someone to talk to.

**Recent AI Advances:**
Models like GPT-5, Claude, and Gemini now understand context, tone, and intent — enabling real conversations, not just commands.

**NoVo's Opportunity:**
We're not building just a travel tool. We're building a travel companion — someone who understands your needs, remembers your preferences, and is always there when you need help.

**Why This Matters:**
AI can now provide genuine support and connection. NoVo fills the gap between impersonal tools and the human understanding travelers actually need.`,
    },
    // Slide 3: The Concept - NoVo Travel AI
    {
      slide: 3,
      title: "The Concept",
      spokenText: `So what exactly is NoVo?

NoVo is an AI-powered travel assistant that books rides, tracks flights, and translates speech in real-time.

Users simply speak to book and manage their trips — no complicated menus or forms. Just natural conversation.

We have integrated automatic translation between drivers and passengers, breaking down language barriers.

Everything is personalized travel support, delivered in natural language. It's like having a knowledgeable travel companion available 24/7.`,
      displayText: `**The Concept: NoVo Travel AI**

**What NoVo Does:**
AI-powered travel assistant that books rides, tracks flights, and translates speech in real-time.

**Conversational Interface:**
Users simply speak to book and manage trips — no complicated menus or forms.

**Real-Time Translation:**
Integrated automatic translation between driver and passenger, breaking down language barriers.

**Personalized Support:**
All travel assistance delivered in natural language — like having a knowledgeable travel companion 24/7.`,
    },
    // Slide 4: Leverage New Technology
    {
      slide: 4,
      title: "Leverage New Technology",
      spokenText: `Now let's talk about leveraging new technology.

These advances in AI are ideal for creating natural travel experiences that simulate genuine human interaction.

NoVo leverages these technological advancements to create a truly conversational travel assistant — one that understands what travelers actually need, not just what they literally ask for.

That's the key difference. We're not building a chatbot that responds to keywords. We're building a companion that understands context, intent, and the unspoken needs behind every request.`,
      displayText: `**Leverage New Technology Now**

**The Opportunity:**
Recent AI advances are ideal for creating natural travel experiences that simulate genuine human interaction.

**NoVo's Approach:**
We leverage these technological advancements to create a truly conversational travel assistant.

**The Key Difference:**
NoVo understands what travelers actually need — not just what they literally ask for.

**Beyond Keywords:**
We're not building a chatbot. We're building a companion that understands context, intent, and the unspoken needs behind every request.`,
    },
    // Slide 5: The Business Case
    {
      slide: 5,
      title: "The Business Case",
      spokenText: `Here's a critical insight about the business case.

A better system is needed so that a network of drivers can better serve their customers. When drivers can provide exceptional service through our AI-powered platform, customers will certainly use the app.

This creates a powerful flywheel effect: better service leads to more users, which attracts more drivers, which improves service further.

And here's the key — while we have the user's attention, we get to show them all the other ways NoVo can be useful for them. That's how we expand from a ride-booking app into a comprehensive travel companion.`,
      displayText: `**The Business Case**

**The Critical Insight:**
A better system is needed so that drivers can better serve their customers.

**The Flywheel Effect:**
• Better service → More users
• More users → More drivers
• More drivers → Even better service

**The Key Opportunity:**
While we have the user's attention, we show them all the other ways NoVo can be useful.

**The Result:**
We expand from ride-booking into a comprehensive travel companion.`,
    },
    // Slide 6: Our Timing is Perfect
    {
      slide: 6,
      title: "Our Timing is Perfect",
      spokenText: `The timing is perfect for NoVo.

These AI models are mature enough to deliver real value, yet the travel industry hasn't fully embraced them.

We're positioned to be first movers in contextual conversational AI for travel services.

This is that rare window where the technology is ready, the market need is clear, and the competition hasn't caught up yet. That's exactly when you want to be entering a market.`,
      displayText: `**Our Timing is Perfect**

**Technology Readiness:**
AI models are now mature enough to deliver real value.

**Market Gap:**
The travel industry hasn't fully embraced conversational AI yet.

**Our Position:**
First movers in contextual conversational AI for travel services.

**The Window:**
• Technology is ready ✓
• Market need is clear ✓
• Competition hasn't caught up ✓

This is exactly when you want to be entering a market.`,
    },
    // Slide 7: Investment Opportunity Summary (Financial Overview)
    {
      slide: 7,
      title: "Investment Opportunity",
      spokenText: `Let me summarize why NoVo is such a compelling investment opportunity.

We're following the Palantir playbook — the fastest-growing S&P 500 company with over 810 percent stock gains since early 2024.

Their key insight? Real value in AI comes from creating intuitive interfaces that allow people to actually interact with and benefit from AI systems.

That's exactly what we're building. NoVo is an emotionally intelligent travel assistant that combines breakthrough emotional understanding with practical travel features.

Our target market is the 1.9 trillion dollar global travel and lifestyle market.

We're entering at the inflection point when AI moves from impressive demonstrations to indispensable daily tools.

The investment thesis is simple: apply Palantir's winning formula to the travel market for significant value capture.`,
      displayText: `**Investment Opportunity: NoVo AI**

**The Palantir Playbook:**
Palantir = Fastest-growing S&P 500 company (810%+ gains since early 2024). Key insight: Real value is creating intuitive AI interfaces.

**Our Strategy:**
NoVo = Emotionally intelligent travel assistant combining Hume AI's emotional understanding with practical travel features.

**Target Market:** $1.9 trillion global travel and lifestyle market

**Timing:**
Entering at the inflection point when AI moves from demonstrations to indispensable daily tools.

**Key Differentiator:**
Emotional intelligence in a market where human connection matters most.

**Investment Thesis:**
Apply Palantir's winning AI interface formula to travel market = significant value capture opportunity.`,
    },
    // Slide 8: SEIS Bonus
    {
      slide: 8,
      title: "SEIS Bonus",
      spokenText: `For UK investors, we have an exciting tax advantage to share.

We will be applying for SEIS advanced assurance — that's the Seed Enterprise Investment Scheme.

This allows any UK tax-paying investor to deduct 50 percent of the amount they invest from their next tax bill.

So if you invest 10,000 pounds, you could reduce your tax bill by 5,000 pounds. It's a significant incentive that reduces your effective risk.

This makes early-stage investment in NoVo particularly attractive for UK-based investors.`,
      displayText: `**For UK Investors: SEIS Bonus**

**What is SEIS?**
Seed Enterprise Investment Scheme — a UK government program to encourage investment in early-stage companies.

**The Benefit:**
UK tax-paying investors can deduct 50% of their investment from their next tax bill.

**Example:**
• Invest £10,000
• Reduce tax bill by £5,000
• Effective risk significantly reduced

**Our Status:**
We will be applying for SEIS advanced assurance to qualify for this benefit.`,
    },
    // Slide 9: Roadmap
    {
      slide: 9,
      title: "Roadmap",
      spokenText: `Let me walk you through our development roadmap.

Phase 1, months 1 to 3: We focus on research, architecture, user interface design, and hiring key team members.

Phase 2, months 4 to 6: This is MVP development. We build payments, GPS integration, conduct initial testing, and start generating our first revenues.

Phase 3, months 7 to 12: We raise 500,000 pounds, obtain our TfL license, launch the beta version, add security features, and begin marketing.

Phase 4, months 12 to 24: We expand into Europe and focus on using the data collected from our user base to guide further application development.

This phased approach lets us validate at each stage before scaling.`,
      displayText: `**Roadmap**

**Phase 1 (Months 1-3):**
Research, architecture, User Interface design, hiring key team members.

**Phase 2 (Months 4-6):**
MVP development, payments integration, GPS, initial testing, first revenues.

**Phase 3 (Months 7-12):**
£500,000 raise, TfL license, beta version launch, security features, marketing.

**Phase 4 (Months 12-24):**
European expansion, focus on user data to guide application development.`,
    },
    // Slide 10: The Application and Next Steps
    {
      slide: 10,
      title: "Next Steps",
      spokenText: `So here's where we are and what we're looking for.

We are seeking an initial investment of 65,000 pounds.

These funds will go toward app development up to the MVP phase and building our driver network.

Our goal is to have an MVP application that is used daily and integrated into an existing business — proving real-world value.

The focus is on expanding the app's use beyond just car reservations into the full travel experience.

This round prepares the company for the next fundraising round at a much higher valuation.`,
      displayText: `**The Application and Next Steps**

**Investment Ask:** £65,000

**Use of Funds:**
• App development through MVP phase
• Building driver network
• Initial operations

**Immediate Goal:**
MVP application used daily, integrated into existing business, generating real revenue.

**Strategic Focus:**
Expand beyond car reservations to full travel experience.

**Outcome:**
Prepare company for next fundraising round at higher valuation.`,
    },
    // Slide 11: End/Thank You
    {
      slide: 11,
      title: "Thank You",
      spokenText: `Thank you so much for your time today. I'm excited about the possibility of working with you.

If you have any questions about NoVo, the investment opportunity, or anything else we've discussed, please feel free to ask me now — just say "Novo" and I'll be happy to help.

You can also reach out to our team directly for more information.

We look forward to making travel amazing together. Thank you!`,
      displayText: `**Thank You**

• Questions? Just say "Novo"
• Contact our team for more information
• We look forward to working with you!

**Contact:**
Novocom AI Limited
Jesus Rui & Wayne Harburn`,
    },
  ],
  pt: [
    // Slide 0: Cover/Welcome
    {
      slide: 0,
      title: "Bem-vindo",
      spokenText: `Olá! Sou a NoVo, a nova assistente pessoal da Novocom AI. Basta pressionar o botão iniciar quando estiver pronto e podemos começar a apresentação.

Não deve levar mais de 5 minutos. Você também pode me interromper e fazer qualquer pergunta a qualquer momento — basta dizer meu nome "Novo" e eu ouvirei sua pergunta e farei o meu melhor para respondê-la.

Quando estiver pronto....`,
      displayText: `**Bem-vindo ao NoVo Travel Assistant**

• Pressione Iniciar quando estiver pronto
• A apresentação leva aproximadamente 5 minutos
• Diga "Novo" a qualquer momento para fazer uma pergunta
• Vou pausar, ouvir e responder antes de continuar`,
    },
    // Slide 1: The Problem
    {
      slide: 1,
      title: "O Problema",
      spokenText: `Vamos falar sobre o problema fundamental que estamos resolvendo. A IA não está sendo usada de forma eficaz no mercado atual.

A maioria das pessoas usa a IA superficialmente — elas copiam, colam e seguem em frente. Não há integração real ou aplicação consciente.

As empresas tratam a IA como um recurso adicional, não como um verdadeiro gerador de valor. Está sendo anexada aos sistemas existentes em vez de ser integrada de forma consciente.

Os desenvolvedores focam demais em análises e não o suficiente no contexto humano — as situações do mundo real onde as pessoas precisam de ajuda.

E as pessoas simplesmente não estão informadas sobre o que a IA pode fazer por elas.

O resultado? Uma tempestade perfeita de oportunidades perdidas. Ainda estamos presos digitando quando deveríamos estar tendo conversas naturais.

Esta é a lacuna que a NoVo foi projetada para preencher.`,
      displayText: `**O Problema**
A questão fundamental é que a IA não está sendo usada de forma eficaz no mercado atual.

**Como as Pessoas Usam a IA Hoje:**
A maioria das pessoas usa a IA superficialmente — elas simplesmente copiam, colam e seguem em frente. Não há integração real ou aplicação consciente da tecnologia.

**Como as Empresas Tratam a IA:**
As empresas estão tratando a IA como um recurso adicional, não como um verdadeiro gerador de valor. Está sendo anexada aos sistemas existentes em vez de ser integrada de forma consciente para criar valor real.

**A Desconexão dos Desenvolvedores:**
Os desenvolvedores de IA estão focando muito em análises e dados, mas não o suficiente no contexto humano — as situações do mundo real onde as pessoas precisam de ajuda e suporte.

**A Lacuna de Informação:**
As pessoas simplesmente não estão informadas sobre os usos potenciais da IA. Elas não entendem o que é possível, o que significa que não podem aproveitar as oportunidades disponíveis.

**O Resultado:**
Isso cria uma tempestade perfeita de oportunidades perdidas para melhoria e má integração com serviços do mundo real. Ainda estamos presos esperando para nos libertar da interface do teclado — estamos literalmente digitando quando deveríamos estar tendo conversas naturais.

Esta é a lacuna que a NoVo foi projetada para preencher.`,
    },
    // Slide 2: The Opportunity
    {
      slide: 2,
      title: "A Oportunidade",
      spokenText: `Então vimos o problema — a IA não está sendo usada de forma eficaz. Mas aqui está a oportunidade.

A solidão é um dos desafios definidores do nosso tempo. É uma condição humana moderna, e as pessoas estão cada vez mais recorrendo à tecnologia para conexão e apoio.

E os dados provam isso: aplicativos de companhia são de longe a categoria mais popular de aplicações de IA. As pessoas não querem apenas ferramentas — elas querem alguém para conversar. Alguém que as entenda.

Avanços recentes em IA contextual — modelos como GPT-5, Claude e Gemini — mudaram tudo. Esses modelos agora entendem contexto, tom e intenção. Eles podem ter conversas reais.

É exatamente isso que a NoVo foi projetada para ser: não apenas uma ferramenta de viagem, mas uma companheira de viagem.`,
      displayText: `**A Oportunidade**
Baseando-se no problema que acabamos de discutir — há uma oportunidade clara aqui.

**A Condição Humana Moderna:**
A solidão é um dos desafios definidores do nosso tempo. As pessoas estão cada vez mais recorrendo à tecnologia para conexão e apoio.

**O Que os Dados Mostram:**
Aplicativos de companhia são de longe a categoria mais popular de aplicações de IA. As pessoas não querem apenas ferramentas — elas querem alguém para conversar.

**Avanços Recentes em IA:**
Modelos como GPT-5, Claude e Gemini agora entendem contexto, tom e intenção — permitindo conversas reais, não apenas comandos.

**A Oportunidade da NoVo:**
Não estamos construindo apenas uma ferramenta de viagem. Estamos construindo uma companheira de viagem.`,
    },
    // Slide 3: The Concept
    {
      slide: 3,
      title: "O Conceito",
      spokenText: `Então, o que exatamente é a NoVo?

A NoVo é uma assistente de viagem alimentada por IA que reserva corridas, rastreia voos e traduz fala em tempo real.

Os usuários simplesmente falam para reservar e gerenciar suas viagens — sem menus complicados ou formulários. Apenas conversa natural.

Temos tradução automática integrada entre motoristas e passageiros, quebrando barreiras linguísticas.

Tudo é suporte de viagem personalizado, entregue em linguagem natural. É como ter uma companheira de viagem experiente disponível 24 horas por dia, 7 dias por semana.`,
      displayText: `**O Conceito: NoVo Travel AI**

**O Que a NoVo Faz:**
Assistente de viagem alimentada por IA que reserva corridas, rastreia voos e traduz fala em tempo real.

**Interface Conversacional:**
Os usuários simplesmente falam para reservar e gerenciar viagens — sem menus complicados ou formulários.

**Tradução em Tempo Real:**
Tradução automática integrada entre motorista e passageiro, quebrando barreiras linguísticas.

**Suporte Personalizado:**
Todo o suporte de viagem entregue em linguagem natural — como ter uma companheira de viagem experiente 24/7.`,
    },
    // Slide 4: Leverage New Technology
    {
      slide: 4,
      title: "Aproveitando Nova Tecnologia",
      spokenText: `Agora vamos falar sobre aproveitar nova tecnologia.

Esses avanços em IA são ideais para criar experiências de viagem naturais que simulam interação humana genuína.

A NoVo aproveita esses avanços tecnológicos para criar uma assistente de viagem verdadeiramente conversacional — uma que entende o que os viajantes realmente precisam, não apenas o que eles literalmente pedem.

Essa é a diferença chave. Não estamos construindo um chatbot que responde a palavras-chave. Estamos construindo uma companheira que entende contexto, intenção e as necessidades não expressas por trás de cada solicitação.`,
      displayText: `**Aproveitando Nova Tecnologia Agora**

**A Oportunidade:**
Avanços recentes em IA são ideais para criar experiências de viagem naturais que simulam interação humana genuína.

**A Abordagem da NoVo:**
Aproveitamos esses avanços tecnológicos para criar uma assistente de viagem verdadeiramente conversacional.

**A Diferença Chave:**
A NoVo entende o que os viajantes realmente precisam — não apenas o que eles literalmente pedem.

**Além das Palavras-Chave:**
Não estamos construindo um chatbot. Estamos construindo uma companheira que entende contexto, intenção e as necessidades não expressas.`,
    },
    // Slide 5: The Business Case
    {
      slide: 5,
      title: "O Caso de Negócio",
      spokenText: `Aqui está uma visão crítica sobre o caso de negócio.

Um sistema melhor é necessário para que uma rede de motoristas possa atender melhor seus clientes. Quando os motoristas podem fornecer um serviço excepcional através da nossa plataforma alimentada por IA, os clientes certamente usarão o aplicativo.

Isso cria um poderoso efeito volante: melhor serviço leva a mais usuários, o que atrai mais motoristas, o que melhora ainda mais o serviço.

E aqui está a chave — enquanto temos a atenção do usuário, podemos mostrar a eles todas as outras maneiras que a NoVo pode ser útil. É assim que expandimos de um aplicativo de reserva de corridas para uma companheira de viagem abrangente.`,
      displayText: `**O Caso de Negócio**

**A Visão Crítica:**
Um sistema melhor é necessário para que os motoristas possam atender melhor seus clientes.

**O Efeito Volante:**
• Melhor serviço → Mais usuários
• Mais usuários → Mais motoristas
• Mais motoristas → Serviço ainda melhor

**A Oportunidade Chave:**
Enquanto temos a atenção do usuário, mostramos todas as outras maneiras que a NoVo pode ser útil.

**O Resultado:**
Expandimos de reserva de corridas para uma companheira de viagem abrangente.`,
    },
    // Slide 6: Our Timing is Perfect
    {
      slide: 6,
      title: "Nosso Timing é Perfeito",
      spokenText: `O timing é perfeito para a NoVo.

Esses modelos de IA são maduros o suficiente para entregar valor real, mas a indústria de viagens ainda não os abraçou completamente.

Estamos posicionados para ser pioneiros em IA conversacional contextual para serviços de viagem.

Esta é aquela janela rara onde a tecnologia está pronta, a necessidade do mercado é clara e a concorrência ainda não alcançou. É exatamente quando você quer estar entrando em um mercado.`,
      displayText: `**Nosso Timing é Perfeito**

**Prontidão Tecnológica:**
Os modelos de IA agora são maduros o suficiente para entregar valor real.

**Lacuna de Mercado:**
A indústria de viagens ainda não abraçou completamente a IA conversacional.

**Nossa Posição:**
Pioneiros em IA conversacional contextual para serviços de viagem.

**A Janela:**
• Tecnologia está pronta ✓
• Necessidade do mercado é clara ✓
• Concorrência não alcançou ✓

É exatamente quando você quer estar entrando em um mercado.`,
    },
    // Slide 7: Investment Opportunity
    {
      slide: 7,
      title: "Oportunidade de Investimento",
      spokenText: `Deixe-me resumir por que a NoVo é uma oportunidade de investimento tão atraente.

Estamos seguindo o manual da Palantir — a empresa de crescimento mais rápido do S&P 500 com mais de 810 por cento de ganhos em ações desde o início de 2024.

A visão chave deles? O valor real em IA vem da criação de interfaces intuitivas que permitem que as pessoas realmente interajam e se beneficiem dos sistemas de IA.

É exatamente isso que estamos construindo. A NoVo é uma assistente de viagem emocionalmente inteligente que combina compreensão emocional inovadora com recursos práticos de viagem.

Nosso mercado-alvo é o mercado global de viagens e estilo de vida de 1,9 trilhão de dólares.`,
      displayText: `**Oportunidade de Investimento: NoVo AI**

**O Manual da Palantir:**
Palantir = Empresa de crescimento mais rápido do S&P 500 (810%+ ganhos desde início de 2024). Visão chave: Valor real é criar interfaces de IA intuitivas.

**Nossa Estratégia:**
NoVo = Assistente de viagem emocionalmente inteligente combinando compreensão emocional da Hume AI com recursos práticos de viagem.

**Mercado-Alvo:** Mercado global de viagens e estilo de vida de $1,9 trilhão

**Timing:**
Entrando no ponto de inflexão quando a IA passa de demonstrações para ferramentas diárias indispensáveis.

**Diferenciador Chave:**
Inteligência emocional em um mercado onde conexão humana mais importa.`,
    },
    // Slide 8: SEIS Bonus
    {
      slide: 8,
      title: "Bônus SEIS",
      spokenText: `Para investidores do Reino Unido, temos uma vantagem fiscal emocionante para compartilhar.

Estaremos solicitando a garantia antecipada do SEIS — esse é o Esquema de Investimento em Empresas Semente.

Isso permite que qualquer investidor contribuinte do Reino Unido deduza 50 por cento do valor que investe da sua próxima conta de impostos.

Então, se você investir 10.000 libras, poderá reduzir sua conta de impostos em 5.000 libras. É um incentivo significativo que reduz seu risco efetivo.

Isso torna o investimento em estágio inicial na NoVo particularmente atraente para investidores baseados no Reino Unido.`,
      displayText: `**Para Investidores do Reino Unido: Bônus SEIS**

**O Que é SEIS?**
Esquema de Investimento em Empresas Semente — um programa do governo do Reino Unido para incentivar investimentos em empresas em estágio inicial.

**O Benefício:**
Investidores contribuintes do Reino Unido podem deduzir 50% do seu investimento da próxima conta de impostos.

**Exemplo:**
• Invista £10.000
• Reduza conta de impostos em £5.000
• Risco efetivo significativamente reduzido

**Nosso Status:**
Estaremos solicitando a garantia antecipada do SEIS para qualificar para este benefício.`,
    },
    // Slide 9: Roadmap
    {
      slide: 9,
      title: "Roteiro",
      spokenText: `Deixe-me guiá-lo pelo nosso roteiro de desenvolvimento.

Fase 1, meses 1 a 3: Focamos em pesquisa, arquitetura, design de interface do usuário e contratação de membros-chave da equipe.

Fase 2, meses 4 a 6: Este é o desenvolvimento do MVP. Construímos pagamentos, integração GPS, realizamos testes iniciais e começamos a gerar nossas primeiras receitas.

Fase 3, meses 7 a 12: Levantamos 500.000 libras, obtemos nossa licença TfL, lançamos a versão beta, adicionamos recursos de segurança e começamos o marketing.

Fase 4, meses 12 a 24: Expandimos para a Europa e focamos em usar os dados coletados da nossa base de usuários para guiar o desenvolvimento futuro do aplicativo.

Esta abordagem faseada nos permite validar em cada estágio antes de escalar.`,
      displayText: `**Roteiro**

**Fase 1 (Meses 1-3):**
Pesquisa, arquitetura, design de Interface do Usuário, contratação de membros-chave da equipe.

**Fase 2 (Meses 4-6):**
Desenvolvimento do MVP, integração de pagamentos, GPS, testes iniciais, primeiras receitas.

**Fase 3 (Meses 7-12):**
Captação de £500.000, licença TfL, lançamento da versão beta, recursos de segurança, marketing.

**Fase 4 (Meses 12-24):**
Expansão europeia, foco em dados de usuários para guiar desenvolvimento do aplicativo.`,
    },
    // Slide 10: Next Steps
    {
      slide: 10,
      title: "Próximos Passos",
      spokenText: `Então aqui está onde estamos e o que estamos procurando.

Estamos buscando um investimento inicial de 65.000 libras.

Esses fundos irão para o desenvolvimento do aplicativo até a fase MVP e construção da nossa rede de motoristas.

Nosso objetivo é ter um aplicativo MVP que seja usado diariamente e integrado a um negócio existente — provando valor no mundo real.

O foco é expandir o uso do aplicativo além de apenas reservas de carro para a experiência completa de viagem.

Esta rodada prepara a empresa para a próxima rodada de captação com uma avaliação muito mais alta.`,
      displayText: `**A Aplicação e Próximos Passos**

**Pedido de Investimento:** £65.000

**Uso dos Fundos:**
• Desenvolvimento do aplicativo até a fase MVP
• Construção da rede de motoristas
• Operações iniciais

**Objetivo Imediato:**
Aplicativo MVP usado diariamente, integrado a negócio existente, gerando receita real.

**Foco Estratégico:**
Expandir além de reservas de carro para experiência completa de viagem.

**Resultado:**
Preparar empresa para próxima rodada de captação com avaliação mais alta.`,
    },
    // Slide 11: Thank You
    {
      slide: 11,
      title: "Obrigado",
      spokenText: `Muito obrigada pelo seu tempo hoje. Estou animada com a possibilidade de trabalhar com você.

Se você tiver alguma pergunta sobre a NoVo, a oportunidade de investimento, ou qualquer outra coisa que discutimos, sinta-se à vontade para me perguntar agora — basta dizer "Novo" e ficarei feliz em ajudar.

Você também pode entrar em contato diretamente com nossa equipe para mais informações.

Esperamos tornar as viagens incríveis juntos. Obrigada!`,
      displayText: `**Obrigado**

• Perguntas? Basta dizer "Novo"
• Entre em contato com nossa equipe para mais informações
• Esperamos trabalhar com você!

**Contato:**
Novocom AI Limited
Jesus Rui & Wayne Harburn`,
    },
  ]
}

// Helper function to get narration for a specific slide
export function getNarration(language: 'en' | 'pt', slideNumber: number): SlideNarration | undefined {
  return slideNarrations[language].find(n => n.slide === slideNumber)
}

// Helper function to get all narrations for a language
export function getAllNarrations(language: 'en' | 'pt'): SlideNarration[] {
  return slideNarrations[language]
}

