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
  pt: []
}

// Helper function to get narration for a specific slide
export function getNarration(language: 'en' | 'pt', slideNumber: number): SlideNarration | undefined {
  return slideNarrations[language].find(n => n.slide === slideNumber)
}

// Helper function to get all narrations for a language
export function getAllNarrations(language: 'en' | 'pt'): SlideNarration[] {
  return slideNarrations[language]
}

