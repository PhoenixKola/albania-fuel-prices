import type { Lang } from "../models/i18n";

export type EditorialTextSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PolicyDocument = {
  eyebrow: string;
  title: string;
  lede: string;
  updated: string;
  calloutLabel: string;
  callout: string;
  sections: EditorialTextSection[];
};

type EditorialCopy = {
  contents: string;
  liveData: string;
  source: string;
  lastUpdated: string;
  unavailable: string;
  about: {
    eyebrow: string;
    title: string;
    lede: string;
    status: string;
    metrics: [string, string, string];
    sections: EditorialTextSection[];
    methodCta: string;
    contactCta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lede: string;
    status: string;
    emailAction: string;
    sections: EditorialTextSection[];
    privacyCta: string;
    methodCta: string;
  };
  policies: Record<"privacy" | "terms" | "editorial" | "disclaimer", PolicyDocument>;
  country: {
    eyebrow: string;
    title: (country: string) => string;
    lede: (country: string) => string;
    currentPrices: (country: string) => string;
    currentIntro: string;
    loading: string;
    missing: (country: string) => string;
    eurReference: string;
    europeRank: string;
    europeAverage: string;
    versusAverage: string;
    thirtyDay: string;
    priceNow: string;
    localEstimate: string;
    trend: (country: string) => string;
    trendIntro: (country: string) => string;
    market: (country: string) => string;
    comparison: (country: string) => string;
    albaniaReference: string;
    travel: string;
    fuels: (country: string) => string;
    borders: string;
    limitations: string;
    faq: (country: string) => string;
    explore: string;
    openDashboard: (country: string) => string;
    dashboardCta: string;
    rankingsCta: string;
    compareCta: string;
    notFoundTitle: string;
    notFoundText: string;
    higher: (fuel: string, value: string) => string;
    lower: (fuel: string, value: string) => string;
    close: (fuel: string) => string;
    comparisonMissing: (fuel: string) => string;
    fresh: string;
    stale: string;
    dataUpdated: (date: string) => string;
  };
  report: {
    eyebrow: string;
    title: string;
    lede: (days: number) => string;
    fresh: string;
    stale: string;
    unavailableTitle: string;
    unavailableText: string;
    snapshot: string;
    daysObserved: string;
    marketsTracked: string;
    reportDate: string;
    methodology: string;
  };
};

const en: EditorialCopy = {
  contents: "On this page",
  liveData: "Live data",
  source: "Source",
  lastUpdated: "Last updated",
  unavailable: "Unavailable",
  about: {
    eyebrow: "Independent market intelligence",
    title: "Built for the decision before the next fill.",
    lede: "Karburanti Sot turns fragmented public fuel data into a calm, useful view of Albania and Europe—so drivers can compare with context, not guesswork.",
    status: "Independent · Tirana, Albania",
    metrics: ["Markets analysed", "Days of history", "Commercial influence"],
    methodCta: "Read our methodology",
    contactCta: "Send a correction",
    sections: [
      { id: "mission", title: "Why this exists", paragraphs: ["Fuel prices cross borders before drivers do. A difference that looks small per litre can materially change a household budget, a delivery route, or a long road trip. We built one place where those differences are visible and honestly explained.", "The product is for everyday drivers, commuters, logistics operators, and travellers. It favours useful comparisons and clear limitations over noise or false precision."] },
      { id: "process", title: "From public data to a useful signal", paragraphs: ["We collect country-level values from established public sources, normalise them to EUR per litre, preserve a daily historical record, and calculate rankings, spreads, movement, and volatility from that record.", "Country-level figures are references—not promises about the price at a particular pump. When a value is missing, stale, or too thin for a reliable calculation, we say so instead of filling the gap with an estimate."] },
      { id: "principles", title: "The standards behind every number", paragraphs: ["Our editorial and data work follows five practical rules."], bullets: ["Accuracy before speed: never manufacture a missing value.", "Transparent sourcing: show where the data came from and when it was refreshed.", "Original interpretation: commentary is written from the displayed evidence.", "Useful uncertainty: distinguish national references from station-level reality.", "Independence: coverage and conclusions are not sold to fuel companies or advertisers."] },
      { id: "corrections", title: "Corrections are part of the product", paragraphs: ["Reports are checked against the upstream source first. If our processing or presentation is wrong, we correct it. If the source itself appears wrong, we document the discrepancy and may suppress the affected value until it becomes trustworthy again.", "We do not change a number simply because it feels unexpected. Evidence—not expectation—drives corrections."] },
      { id: "independence", title: "A small, independent project", paragraphs: ["Karburanti Sot is maintained independently in Tirana and is not affiliated with a fuel retailer, government agency, or advertising network. Advertising may support the service in the future, but all visible ad placements are currently switched off.", "Questions, source concerns, and correction requests go directly to the project through the contact page."] },
    ],
  },
  contact: {
    eyebrow: "Direct line",
    title: "Tell us what needs attention.",
    lede: "Data correction, broken feature, source question, or a thoughtful idea—send the detail that lets us investigate properly.",
    status: "Human-reviewed inbox",
    emailAction: "Email the team",
    privacyCta: "Read privacy policy",
    methodCta: "Check methodology first",
    sections: [
      { id: "topics", title: "What we can help with", paragraphs: ["The inbox is intended for useful, specific conversations about the service."], bullets: ["Fuel-price or country-page corrections", "Questions about sources and methodology", "Accessibility or technical problems", "Feature ideas and practical feedback", "Editorial and partnership enquiries"] },
      { id: "correction", title: "Make a correction easy to verify", paragraphs: ["Include the country and fuel type, the value shown, the value you believe is correct, the date observed, and a credible source link or document. Screenshots can help explain display problems, but a source is more useful for verifying a price."] },
      { id: "response", title: "What happens next", paragraphs: ["We aim to answer ordinary messages within two to three business days. Clear data issues are prioritised and normally investigated within one business day.", "Every correction is checked against the upstream record before the site is changed. Feature suggestions are reviewed for usefulness, accessibility, and feasibility; we may not be able to reply individually to every idea."] },
      { id: "privacy", title: "Send only what is needed", paragraphs: ["Do not include passwords, payment details, precise location history, or other sensitive information. Email is used only to understand and respond to your request, subject to the Privacy Policy."] },
    ],
  },
  policies: {
    privacy: {
      eyebrow: "Privacy dossier",
      title: "Privacy, in plain language.",
      lede: "Karburanti Sot works without an account and is designed to keep personal-data collection to a minimum.",
      updated: "Effective 6 September 2026",
      calloutLabel: "Current advertising status",
      callout: "Visible advertising is currently disabled. AdSense verification code remains installed so advertising can be enabled later under this policy and applicable consent requirements.",
      sections: [
        { id: "collection", title: "Information we collect", paragraphs: ["We do not ask for your name, phone number, account credentials, or payment information. The service can be used without registration.", "Standard technical requests may expose information such as IP address, browser type, device type, and requested URL to hosting and data providers as part of delivering the website and preventing abuse."] },
        { id: "local-storage", title: "Settings stored on your device", paragraphs: ["Country, fuel, currency, theme, watchlist, game progress, and similar preferences are stored in your browser. They are not an account and normally remain on that device until you clear site data."] },
        { id: "location", title: "Location and nearby stations", paragraphs: ["The station finder requests device location only after you choose to use it. Coordinates are used to request nearby map data and calculate distance. Permission can be denied or withdrawn through your browser; the rest of the service remains available."] },
        { id: "external-data", title: "External data services", paragraphs: ["The website fetches fuel, exchange-rate, map, and related public data from third-party services. Those providers receive the network information required to answer the request and apply their own privacy terms."] },
        { id: "advertising", title: "Advertising and consent", paragraphs: ["No ad slots are currently displayed. Google AdSense verification metadata and a script remain present so the publisher identity can be verified and advertising can be restored later.", "If advertising is enabled, Google and its partners may use cookies or device identifiers. Where consent is required—including the EEA, United Kingdom, and Switzerland—an appropriate consent mechanism must be shown before optional advertising storage is used."] },
        { id: "sharing", title: "Sharing, security, and retention", paragraphs: ["We do not sell personal information. Technical providers process the minimum information needed to operate the service. Reasonable safeguards are used, but no internet service can guarantee absolute security.", "Local preferences remain until you remove them. Support emails are retained only as long as reasonably needed to resolve the request and maintain a correction record."] },
        { id: "rights", title: "Choices, children, and changes", paragraphs: ["You can clear local storage, refuse location access, and use browser controls for cookies. The service is not directed at children under 13 and does not knowingly collect their personal information.", "Material policy changes will be reflected by revising the effective date. Questions or requests can be sent to fenixkola@gmail.com."] },
      ],
    },
    terms: {
      eyebrow: "Service terms",
      title: "Use the signal. Verify the stop.",
      lede: "These terms define the limits of a free, country-level fuel information and planning service.",
      updated: "Effective 6 September 2026",
      calloutLabel: "Essential limitation",
      callout: "Displayed prices are informational country references, not binding station quotes. Verify the current local price before making a purchase or route decision.",
      sections: [
        { id: "service", title: "The service", paragraphs: ["Karburanti Sot collects public fuel-price data, presents comparisons and historical analysis, helps locate stations, and provides planning calculators. Access is free and no account is required."] },
        { id: "accuracy", title: "Accuracy and availability", paragraphs: ["We work to keep information accurate and current but cannot guarantee completeness, uninterrupted access, or an exact station-level price. Sources can publish late, change format, or contain errors.", "Converted currency values and trip calculations are estimates. They may differ from card rates, cash rates, vehicle performance, route conditions, and the final amount paid."] },
        { id: "acceptable-use", title: "Acceptable use", paragraphs: ["You may use the service for personal and ordinary business planning. You may not disrupt the service, bypass security, misrepresent its data as guaranteed, or systematically extract and republish substantial parts without permission."] },
        { id: "ownership", title: "Content and third parties", paragraphs: ["Original design, commentary, and software remain protected by applicable intellectual-property law. Source data belongs to its respective providers.", "External links and services are provided for convenience. We do not control their availability, accuracy, terms, or privacy practices."] },
        { id: "advertising", title: "Advertising", paragraphs: ["Visible advertising is currently disabled. If enabled later, advertising will be visually separated from editorial content and will not determine coverage, ranking, or conclusions."] },
        { id: "liability", title: "No warranty and limitation of liability", paragraphs: ["The service is provided “as is” and “as available.” To the fullest extent permitted by law, Karburanti Sot and its operator are not liable for loss resulting from reliance on displayed prices, estimates, route decisions, service interruption, or third-party information."] },
        { id: "changes", title: "Changes and contact", paragraphs: ["These terms may be revised as the service changes. Continued use after an update means the revised terms apply.", "Questions about these terms can be sent to fenixkola@gmail.com or through the contact page."] },
      ],
    },
    editorial: {
      eyebrow: "Editorial standards",
      title: "Evidence first. Context second. Influence never.",
      lede: "This policy explains how price data, generated analysis, guides, and corrections are produced and maintained.",
      updated: "Reviewed 6 September 2026",
      calloutLabel: "Independence pledge",
      callout: "No fuel retailer, government agency, data provider, or advertiser can purchase favourable coverage, ranking, or interpretation.",
      sections: [
        { id: "mission", title: "Editorial mission", paragraphs: ["We turn public fuel data into accurate, transparent, and practical information for drivers. Commentary must help a real decision and remain understandable to a general audience."] },
        { id: "sources", title: "Source standards", paragraphs: ["Fuel values come from identified public third-party sources and are normalised consistently. We do not invent prices, accept sponsored values, or conceal a missing reading.", "Exchange-rate conversions use public indicative rates and are labelled as estimates. The Methodology page documents the processing and calculations."] },
        { id: "analysis", title: "Analysis and automation", paragraphs: ["Rankings, ranges, movement, spread, and volatility are calculated from the stored daily record. Generated narrative must be traceable to those figures and is reviewed through build-time checks.", "We distinguish measured observations from interpretation and do not present a trend as a forecast."] },
        { id: "independence", title: "Commercial independence", paragraphs: ["Visible advertising is currently disabled. If it returns, it will remain separated from editorial material and cannot influence which countries appear or what the data says.", "We do not accept sponsored articles, paid placement, or native advertising disguised as analysis."] },
        { id: "accuracy", title: "Accuracy and proportion", paragraphs: ["Country values are described as reference figures, never guaranteed pump prices. Claims must be supported by the displayed data or a reliable public source, and uncertainty must be made clear."] },
        { id: "updates", title: "Updates and corrections", paragraphs: ["Data refreshes when upstream information becomes available. Time-sensitive guides are reviewed when market conditions, law, or source coverage materially changes.", "Correction reports are verified against evidence. Confirmed errors are fixed; material editorial corrections are not silently erased."] },
        { id: "scope", title: "Coverage and contact", paragraphs: ["Coverage focuses on petrol, diesel, LPG, transport costs, and practical travel context for Albania, the Balkans, and Europe. Country availability follows trustworthy public data, not commercial relationships.", "Questions about accuracy or this policy can be sent to fenixkola@gmail.com."] },
      ],
    },
    disclaimer: {
      eyebrow: "Important limitations",
      title: "A reference for planning—not a promise at the pump.",
      lede: "Understand where the numbers are useful, where they can differ, and what you should verify independently.",
      updated: "Reviewed 6 September 2026",
      calloutLabel: "Before you act",
      callout: "Check the station’s current price, opening status, route conditions, and applicable payment or exchange rate before relying on a calculation.",
      sections: [
        { id: "prices", title: "Fuel prices are informational", paragraphs: ["Displayed values are public country-level references. They are not the exact price at every station or time. Brand, local competition, promotion, tax, delivery timing, and location can create meaningful differences."] },
        { id: "advice", title: "No financial or commercial advice", paragraphs: ["Nothing on this website is financial, investment, or commercial advice. Currency conversions are indicative and are not bank or trading rates. Calculators are planning estimates based on the information supplied."] },
        { id: "timeliness", title: "Accuracy and timeliness", paragraphs: ["We make reasonable efforts to maintain the data but cannot guarantee accuracy, completeness, or timeliness. The displayed update time reflects the dataset, not verification at every pump.", "Fuel markets can move rapidly. Confirm current conditions before a long or cross-border journey."] },
        { id: "liability", title: "Limitation of liability", paragraphs: ["To the fullest extent permitted by law, Karburanti Sot, its operator, and contributors are not liable for loss, damage, injury, or expense arising from reliance on prices, comparisons, calculations, station information, route decisions, data errors, or interrupted availability.", "The service is supplied “as is” and “as available,” without express or implied warranty."] },
        { id: "third-parties", title: "Third-party services", paragraphs: ["Links, public data, maps, exchange rates, and future advertising may be supplied by third parties. We do not control or endorse their content, availability, or practices. Visible ads are currently disabled, although publisher-verification technology remains installed."] },
        { id: "stations", title: "Nearby station information", paragraphs: ["Station names, locations, hours, and availability can be incomplete or outdated. Location is used only after permission. Never rely solely on the finder to determine whether a station is open or stocks a particular fuel."] },
        { id: "changes", title: "Changes and contact", paragraphs: ["This disclaimer may change with the service. The reviewed date records the latest revision.", "Questions can be sent to fenixkola@gmail.com or through the contact page."] },
      ],
    },
  },
  country: {
    eyebrow: "Country market briefing",
    title: (country) => `${country} fuel prices, decoded.`,
    lede: (country) => `A live reference for petrol, diesel, and LPG in ${country}, placed against Europe and Albania with the context a driver actually needs.`,
    currentPrices: (country) => `Current ${country} fuel prices`,
    currentIntro: "Country-level reference values, normalised for fair comparison.",
    loading: "Loading the latest market reading…",
    missing: (country) => `The latest public dataset does not contain a complete price reading for ${country}. The market guide remains available below without inventing a value.`,
    eurReference: "EUR per litre reference",
    europeRank: "Europe rank",
    europeAverage: "Europe average",
    versusAverage: "vs Europe",
    thirtyDay: "30-day move",
    priceNow: "Selected price",
    localEstimate: "Local estimate",
    trend: (country) => `${country} price movement`,
    trendIntro: (country) => `Switch fuel type to read the latest available trend for ${country}. The chart is backed by the same daily history as the market report.`,
    market: (country) => `How the ${country} market works`,
    comparison: (country) => `How ${country} compares with Albania`,
    albaniaReference: "Albania as the reference market",
    travel: "Routes and driving relevance",
    fuels: (country) => `Reading petrol, diesel, and LPG in ${country}`,
    borders: "Border and refuelling strategy",
    limitations: "Coverage, source, and limitations",
    faq: (country) => `${country} fuel-price questions`,
    explore: "Continue with live tools",
    openDashboard: (country) => `Open ${country} in the live cockpit`,
    dashboardCta: "Open dashboard",
    rankingsCta: "View rankings",
    compareCta: "Compare countries",
    notFoundTitle: "Country briefing not found",
    notFoundText: "This country address does not match a supported market briefing.",
    higher: (fuel, value) => `${fuel} is ${value} EUR/L higher than Albania.`,
    lower: (fuel, value) => `${fuel} is ${value} EUR/L lower than Albania.`,
    close: (fuel) => `${fuel} is currently almost level with Albania.`,
    comparisonMissing: (fuel) => `${fuel}: comparison unavailable because one reading is missing.`,
    fresh: "Current dataset",
    stale: "Stale dataset",
    dataUpdated: (date) => `Updated ${date}`,
  },
  report: {
    eyebrow: "Daily diesel intelligence",
    title: "The European fuel market, in one decisive view.",
    lede: (days) => `A focused diesel briefing computed from ${days} days of our own observations—rankings, movement, range, and volatility without the noise.`,
    fresh: "Dataset current",
    stale: "Dataset needs refresh",
    unavailableTitle: "Market report unavailable",
    unavailableText: "There is not enough reliable history to compute today’s report. Please check again after the next data update.",
    snapshot: "Report snapshot",
    daysObserved: "Days observed",
    marketsTracked: "Markets analysed",
    reportDate: "Report date",
    methodology: "How the report is calculated",
  },
};

const sq: EditorialCopy = {
  ...en,
  contents: "Në këtë faqe",
  liveData: "Të dhëna live",
  source: "Burimi",
  lastUpdated: "Përditësimi i fundit",
  unavailable: "Nuk disponohet",
  about: {
    eyebrow: "Inteligjencë e pavarur tregu",
    title: "Ndërtuar për vendimin para furnizimit tjetër.",
    lede: "Karburanti Sot i kthen të dhënat publike të shpërndara në një pamje të qartë dhe të dobishme për Shqipërinë dhe Evropën—që shoferët të krahasojnë me kontekst, jo me hamendje.",
    status: "I pavarur · Tiranë, Shqipëri",
    metrics: ["Tregje të analizuara", "Ditë histori", "Ndikim tregtar"],
    methodCta: "Lexo metodologjinë",
    contactCta: "Dërgo një korrigjim",
    sections: [
      { id: "mission", title: "Pse ekziston", paragraphs: ["Çmimet e karburantit kalojnë kufijtë para shoferëve. Një diferencë e vogël për litër mund të ndryshojë buxhetin familjar, një rrugë shpërndarjeje ose një udhëtim të gjatë. Krijuam një vend ku këto diferenca shihen dhe shpjegohen ndershmërisht.", "Produkti është për shoferë të përditshëm, udhëtarë, operatorë transporti dhe njerëz që kalojnë kufijtë. Ai vendos krahasimin e dobishëm dhe kufizimet e qarta mbi zhurmën dhe saktësinë e rreme."] },
      { id: "process", title: "Nga të dhënat publike te sinjali i dobishëm", paragraphs: ["Mbledhim vlera në nivel shteti nga burime publike, i normalizojmë në EUR për litër, ruajmë historikun ditor dhe llogarisim renditjet, diferencat, lëvizjen dhe paqëndrueshmërinë.", "Shifrat kombëtare janë referenca—jo premtime për një pompë të caktuar. Kur një vlerë mungon, është e vjetruar ose e pamjaftueshme, e themi qartë në vend që ta sajojmë."] },
      { id: "principles", title: "Standardet pas çdo shifre", paragraphs: ["Puna jonë ndjek pesë rregulla praktike."], bullets: ["Saktësia para shpejtësisë: asnjë vlerë e munguar nuk sajohet.", "Burime transparente: tregojmë origjinën dhe kohën e përditësimit.", "Interpretim origjinal: komentet bazohen në provat e paraqitura.", "Pasiguri e dobishme: dallojmë referencën kombëtare nga realiteti i pikës së karburantit.", "Pavarësi: mbulimi dhe përfundimet nuk u shiten kompanive apo reklamuesve."] },
      { id: "corrections", title: "Korrigjimet janë pjesë e produktit", paragraphs: ["Raportimet verifikohen fillimisht me burimin. Nëse gabimi është në përpunimin ose paraqitjen tonë, e korrigjojmë. Nëse burimi duket i pasaktë, dokumentojmë mospërputhjen dhe mund ta fshehim vlerën derisa të bëhet e besueshme.", "Nuk ndryshojmë një numër vetëm sepse duket i pazakontë. Korrigjimin e drejton prova, jo pritshmëria."] },
      { id: "independence", title: "Një projekt i vogël dhe i pavarur", paragraphs: ["Karburanti Sot mirëmbahet në mënyrë të pavarur në Tiranë dhe nuk është i lidhur me kompani karburanti, agjenci qeveritare apo rrjet reklamash. Reklamat mund ta mbështesin shërbimin në të ardhmen, por aktualisht të gjitha hapësirat e dukshme janë çaktivizuar.", "Pyetjet, shqetësimet për burimet dhe kërkesat për korrigjim shkojnë drejtpërdrejt te projekti përmes faqes së kontaktit."] },
    ],
  },
  contact: {
    eyebrow: "Lidhje e drejtpërdrejtë",
    title: "Na trego çfarë kërkon vëmendje.",
    lede: "Korrigjim të dhënash, problem teknik, pyetje për burimin apo një ide me vlerë—dërgo detajet që na lejojnë ta hetojmë siç duhet.",
    status: "Kuti postare e shqyrtuar nga njeriu",
    emailAction: "Dërgo email",
    privacyCta: "Lexo privatësinë",
    methodCta: "Kontrollo metodologjinë",
    sections: [
      { id: "topics", title: "Për çfarë mund të ndihmojmë", paragraphs: ["Kontakti është për biseda konkrete dhe të dobishme rreth shërbimit."], bullets: ["Korrigjime çmimesh ose faqesh shteti", "Pyetje për burimet dhe metodologjinë", "Probleme aksesueshmërie ose teknike", "Ide funksionesh dhe komente praktike", "Pyetje editoriale ose bashkëpunimi"] },
      { id: "correction", title: "Bëje korrigjimin të verifikueshëm", paragraphs: ["Përfshi shtetin dhe llojin e karburantit, vlerën e shfaqur, vlerën që mendon se është e saktë, datën dhe një burim të besueshëm. Pamjet e ekranit ndihmojnë për problemet vizuale; një burim ndihmon më shumë për verifikimin e çmimit."] },
      { id: "response", title: "Çfarë ndodh më pas", paragraphs: ["Synojmë t’u përgjigjemi mesazheve të zakonshme brenda dy deri në tre ditësh pune. Problemet e qarta me të dhënat marrin përparësi dhe zakonisht hetohen brenda një dite pune.", "Çdo korrigjim kontrollohet me burimin para se faqja të ndryshohet. Idetë vlerësohen për dobinë, aksesueshmërinë dhe realizueshmërinë."] },
      { id: "privacy", title: "Dërgo vetëm atë që nevojitet", paragraphs: ["Mos përfshi fjalëkalime, të dhëna pagese, histori të saktë vendndodhjeje ose informacion tjetër sensitiv. Email-i përdoret vetëm për ta kuptuar dhe trajtuar kërkesën sipas Politikës së Privatësisë."] },
    ],
  },
  policies: {
    privacy: {
      eyebrow: "Dosja e privatësisë", title: "Privatësia, me fjalë të qarta.", lede: "Karburanti Sot funksionon pa llogari dhe është projektuar të mbledhë sa më pak të dhëna personale.", updated: "Në fuqi nga 6 shtator 2026", calloutLabel: "Statusi aktual i reklamave", callout: "Reklamat e dukshme janë të çaktivizuara. Kodi i verifikimit AdSense mbetet i instaluar që reklamat të mund të aktivizohen më vonë vetëm sipas kësaj politike dhe kërkesave për pëlqim.",
      sections: [
        { id: "collection", title: "Informacioni që mbledhim", paragraphs: ["Nuk kërkojmë emër, numër telefoni, kredenciale llogarie apo informacion pagese. Shërbimi përdoret pa regjistrim.", "Kërkesat teknike standarde mund t’u ekspozojnë ofruesve të hostimit dhe të dhënave adresën IP, llojin e shfletuesit, pajisjen dhe URL-në e kërkuar për të ofruar shërbimin dhe parandaluar abuzimin."] },
        { id: "local-storage", title: "Preferencat në pajisjen tënde", paragraphs: ["Shteti, karburanti, monedha, tema, lista e ndjekjes dhe progresi i lojërave ruhen në shfletues. Ato nuk janë llogari dhe zakonisht mbeten në atë pajisje derisa të pastrosh të dhënat."] },
        { id: "location", title: "Vendndodhja dhe pikat afër", paragraphs: ["Gjetësi i pikave kërkon vendndodhjen vetëm pasi zgjedh ta përdorësh. Koordinatat përdoren për të kërkuar të dhëna harte dhe llogaritur largësinë. Leja mund të refuzohet ose hiqet; pjesa tjetër vazhdon të punojë."] },
        { id: "external-data", title: "Shërbimet e jashtme të të dhënave", paragraphs: ["Faqja merr të dhëna publike për karburantin, kursin e këmbimit, hartat dhe shërbime të lidhura. Ofruesit marrin informacionin e rrjetit që nevojitet për t’iu përgjigjur kërkesës dhe zbatojnë politikat e tyre."] },
        { id: "advertising", title: "Reklamat dhe pëlqimi", paragraphs: ["Aktualisht nuk shfaqet asnjë hapësirë reklame. Metadata dhe skripti i verifikimit Google AdSense mbeten që identiteti i publikuesit të verifikohet dhe reklamat të rikthehen më vonë.", "Nëse reklamat aktivizohen, Google dhe partnerët mund të përdorin cookie ose identifikues pajisjeje. Aty ku kërkohet pëlqim, mekanizmi përkatës duhet të shfaqet para ruajtjes opsionale reklamuese."] },
        { id: "sharing", title: "Ndarja, siguria dhe ruajtja", paragraphs: ["Nuk shesim informacion personal. Ofruesit teknikë përpunojnë minimumin e nevojshëm. Përdorim masa të arsyeshme sigurie, por asnjë shërbim online nuk garanton siguri absolute.", "Preferencat lokale mbeten derisa t’i heqësh. Email-et e mbështetjes ruhen vetëm për aq kohë sa duhet për zgjidhjen dhe regjistrin e korrigjimeve."] },
        { id: "rights", title: "Zgjedhjet, fëmijët dhe ndryshimet", paragraphs: ["Mund të pastrosh ruajtjen lokale, të refuzosh vendndodhjen dhe të përdorësh kontrollet e shfletuesit për cookie-t. Shërbimi nuk u drejtohet fëmijëve nën 13 vjeç dhe nuk mbledh me vetëdije të dhënat e tyre.", "Ndryshimet materiale pasqyrohen duke rishikuar datën e hyrjes në fuqi. Pyetjet mund të dërgohen në fenixkola@gmail.com."] },
      ],
    },
    terms: {
      eyebrow: "Kushtet e shërbimit", title: "Përdor sinjalin. Verifiko ndalesën.", lede: "Këto kushte përcaktojnë kufijtë e një shërbimi falas për informacion dhe planifikim karburanti në nivel shteti.", updated: "Në fuqi nga 6 shtator 2026", calloutLabel: "Kufizim thelbësor", callout: "Çmimet janë referenca informuese kombëtare, jo oferta detyruese të pikave. Verifiko çmimin lokal para blerjes ose vendimit për rrugën.",
      sections: [
        { id: "service", title: "Shërbimi", paragraphs: ["Karburanti Sot mbledh të dhëna publike, paraqet krahasime dhe histori, ndihmon në gjetjen e pikave dhe ofron llogaritës planifikimi. Përdorimi është falas dhe pa llogari."] },
        { id: "accuracy", title: "Saktësia dhe disponueshmëria", paragraphs: ["Përpiqemi ta mbajmë informacionin të saktë, por nuk garantojmë plotësi, akses të pandërprerë apo çmim të saktë për një pikë. Burimet mund të vonohen, ndryshojnë format ose gabojnë.", "Konvertimet dhe llogaritjet e udhëtimit janë vlerësime dhe mund të ndryshojnë nga kursi real, konsumi i mjetit, rruga dhe shuma e paguar."] },
        { id: "acceptable-use", title: "Përdorimi i pranueshëm", paragraphs: ["Shërbimin mund ta përdorësh për planifikim personal dhe të zakonshëm biznesi. Nuk lejohet ndërprerja e shërbimit, anashkalimi i sigurisë, paraqitja e të dhënave si të garantuara apo ripublikimi sistematik i pjesëve të mëdha pa leje."] },
        { id: "ownership", title: "Përmbajtja dhe palët e treta", paragraphs: ["Dizajni, komentet dhe programi origjinal mbrohen nga ligji. Të dhënat burimore u përkasin ofruesve përkatës.", "Lidhjet dhe shërbimet e jashtme ofrohen për lehtësi; nuk kontrollojmë saktësinë, kushtet apo privatësinë e tyre."] },
        { id: "advertising", title: "Reklamat", paragraphs: ["Reklamat e dukshme janë të çaktivizuara. Nëse aktivizohen më vonë, do të ndahen qartë nga përmbajtja dhe nuk do të ndikojnë mbulimin, renditjen apo përfundimet."] },
        { id: "liability", title: "Pa garanci dhe kufizim përgjegjësie", paragraphs: ["Shërbimi ofrohet “siç është” dhe “sipas disponueshmërisë”. Në masën e lejuar nga ligji, Karburanti Sot dhe operatori nuk përgjigjen për humbje nga mbështetja te çmimet, llogaritjet, vendimet e rrugës, ndërprerjet apo të dhënat e palëve të treta."] },
        { id: "changes", title: "Ndryshimet dhe kontakti", paragraphs: ["Kushtet mund të rishikohen bashkë me shërbimin. Përdorimi pas përditësimit nënkupton zbatimin e versionit të ri.", "Pyetjet mund të dërgohen në fenixkola@gmail.com ose përmes faqes së kontaktit."] },
      ],
    },
    editorial: {
      eyebrow: "Standardet editoriale", title: "Prova e para. Konteksti më pas. Ndikimi kurrë.", lede: "Kjo politikë shpjegon si prodhohen dhe mirëmbahen të dhënat, analizat e gjeneruara, udhëzuesit dhe korrigjimet.", updated: "Rishikuar më 6 shtator 2026", calloutLabel: "Premtimi i pavarësisë", callout: "Asnjë kompani karburanti, agjenci, ofrues të dhënash apo reklamues nuk mund të blejë trajtim, renditje ose interpretim të favorshëm.",
      sections: [
        { id: "mission", title: "Misioni editorial", paragraphs: ["I kthejmë të dhënat publike në informacion të saktë, transparent dhe praktik për shoferët. Komenti duhet të ndihmojë një vendim real dhe të kuptohet nga publiku i gjerë."] },
        { id: "sources", title: "Standardet e burimeve", paragraphs: ["Vlerat vijnë nga burime publike të identifikuara dhe normalizohen njësoj. Nuk sajojmë çmime, nuk pranojmë vlera të sponsorizuara dhe nuk fshehim mungesat.", "Konvertimet përdorin kurse publike orientuese dhe etiketohen si vlerësime. Metodologjia dokumenton përpunimin."] },
        { id: "analysis", title: "Analiza dhe automatizimi", paragraphs: ["Renditjet, intervalet, lëvizja dhe paqëndrueshmëria llogariten nga historiku ditor. Teksti i gjeneruar duhet të jetë i gjurmueshëm te këto shifra dhe kontrollohet gjatë ndërtimit.", "Dallojmë matjen nga interpretimi dhe nuk e paraqesim trendin si parashikim."] },
        { id: "independence", title: "Pavarësia tregtare", paragraphs: ["Reklamat e dukshme janë të çaktivizuara. Nëse rikthehen, mbeten të ndara dhe nuk ndikojnë vendet apo përfundimet.", "Nuk pranojmë artikuj të sponsorizuar, vendosje me pagesë apo reklama të maskuara si analizë."] },
        { id: "accuracy", title: "Saktësia dhe proporcioni", paragraphs: ["Vlerat kombëtare quhen referenca, jo çmime të garantuara. Pretendimet duhet të mbështeten nga të dhënat ose një burim publik i besueshëm dhe pasiguria duhet të jetë e qartë."] },
        { id: "updates", title: "Përditësimet dhe korrigjimet", paragraphs: ["Të dhënat rifreskohen kur burimi publikon. Udhëzuesit rishikohen kur tregu, ligji apo mbulimi ndryshon ndjeshëm.", "Raportet e gabimeve verifikohen. Gabimet e konfirmuara ndreqen dhe korrigjimet materiale nuk fshihen në heshtje."] },
        { id: "scope", title: "Fusha dhe kontakti", paragraphs: ["Mbulimi fokusohet te benzina, nafta, LPG-ja, kostot e transportit dhe konteksti praktik për Shqipërinë, Ballkanin dhe Evropën. Disponueshmëria varet nga të dhëna publike të besueshme.", "Pyetjet mund të dërgohen në fenixkola@gmail.com."] },
      ],
    },
    disclaimer: {
      eyebrow: "Kufizime të rëndësishme", title: "Referencë për planifikim—jo premtim në pompë.", lede: "Kupto ku vlejnë shifrat, ku mund të ndryshojnë dhe çfarë duhet të verifikosh vetë.", updated: "Rishikuar më 6 shtator 2026", calloutLabel: "Para se të veprosh", callout: "Kontrollo çmimin aktual të pikës, orarin, kushtet e rrugës dhe kursin apo mënyrën e pagesës para se të mbështetesh te një llogaritje.",
      sections: [
        { id: "prices", title: "Çmimet janë informuese", paragraphs: ["Vlerat janë referenca publike në nivel shteti. Nuk janë çmimi i saktë në çdo pikë apo orë. Marka, konkurrenca, promocioni, taksat, furnizimi dhe vendndodhja mund të krijojnë diferenca."] },
        { id: "advice", title: "Jo këshillë financiare apo tregtare", paragraphs: ["Asgjë në këtë faqe nuk është këshillë financiare, investimi apo tregtare. Konvertimet janë orientuese dhe llogaritësit janë vlerësime planifikimi sipas të dhënave të dhëna."] },
        { id: "timeliness", title: "Saktësia dhe koha", paragraphs: ["Bëjmë përpjekje të arsyeshme, por nuk garantojmë saktësi, plotësi apo aktualitet. Koha e përditësimit i përket dataset-it, jo kontrollit në çdo pompë.", "Tregjet mund të lëvizin shpejt. Konfirmo kushtet para një udhëtimi të gjatë ose ndërkufitar."] },
        { id: "liability", title: "Kufizimi i përgjegjësisë", paragraphs: ["Në masën e lejuar nga ligji, Karburanti Sot, operatori dhe kontribuesit nuk përgjigjen për humbje, dëm, lëndim apo shpenzim nga mbështetja te çmimet, krahasimet, pikat, rrugët, gabimet apo ndërprerjet.", "Shërbimi jepet “siç është” dhe “sipas disponueshmërisë”, pa garanci të shprehur ose të nënkuptuar."] },
        { id: "third-parties", title: "Shërbimet e palëve të treta", paragraphs: ["Lidhjet, të dhënat publike, hartat, kurset dhe reklamat e ardhshme mund të ofrohen nga palë të treta. Nuk kontrollojmë përmbajtjen apo praktikat e tyre. Reklamat e dukshme janë të çaktivizuara, por teknologjia e verifikimit mbetet."] },
        { id: "stations", title: "Informacioni për pikat afër", paragraphs: ["Emrat, vendet, oraret dhe disponueshmëria mund të jenë të paplota ose të vjetruara. Vendndodhja përdoret vetëm me leje. Mos u mbështet vetëm te gjetësi për të vendosur nëse një pikë është hapur apo ka një karburant."] },
        { id: "changes", title: "Ndryshimet dhe kontakti", paragraphs: ["Ky mohim mund të ndryshojë bashkë me shërbimin. Data e rishikimit tregon versionin e fundit.", "Pyetjet mund të dërgohen në fenixkola@gmail.com ose përmes faqes së kontaktit."] },
      ],
    },
  },
  country: {
    ...en.country,
    eyebrow: "Raport i tregut kombëtar",
    title: (country) => `Çmimet e karburantit në ${country}, të shpjeguara.`,
    lede: (country) => `Referencë live për benzinën, naftën dhe LPG-në në ${country}, krahasuar me Evropën dhe Shqipërinë me kontekst praktik për shoferin.`,
    currentPrices: (country) => `Çmimet aktuale në ${country}`,
    currentIntro: "Vlera reference në nivel shteti, të normalizuara për krahasim të drejtë.",
    loading: "Po ngarkohet leximi i fundit…",
    missing: (country) => `Të dhënat e fundit publike nuk përmbajnë lexim të plotë për ${country}. Udhëzuesi mbetet i disponueshëm pa sajuar një vlerë.`,
    eurReference: "Referencë EUR për litër",
    europeRank: "Renditja në Evropë",
    europeAverage: "Mesatarja evropiane",
    versusAverage: "kundrejt Evropës",
    thirtyDay: "Lëvizja 30-ditore",
    priceNow: "Çmimi i zgjedhur",
    localEstimate: "Vlerësim lokal",
    trend: (country) => `Lëvizja e çmimeve në ${country}`,
    trendIntro: (country) => `Ndrysho llojin e karburantit për të parë trendin e fundit në ${country}. Grafiku përdor të njëjtin historik ditor si raporti i tregut.`,
    market: (country) => `Si funksionon tregu në ${country}`,
    comparison: (country) => `Si krahasohet ${country} me Shqipërinë`,
    albaniaReference: "Shqipëria si treg reference",
    travel: "Rrugët dhe rëndësia për drejtimin",
    fuels: (country) => `Si të lexosh benzinën, naftën dhe LPG-në në ${country}`,
    borders: "Strategjia e kufirit dhe furnizimit",
    limitations: "Mbulimi, burimi dhe kufizimet",
    faq: (country) => `Pyetje për çmimet në ${country}`,
    explore: "Vazhdo me mjetet live",
    openDashboard: (country) => `Hap ${country} në panelin live`,
    dashboardCta: "Hap panelin",
    rankingsCta: "Shiko renditjet",
    compareCta: "Krahaso shtetet",
    notFoundTitle: "Raporti i shtetit nuk u gjet",
    notFoundText: "Kjo adresë nuk përputhet me një treg të mbështetur.",
    higher: (fuel, value) => `${fuel} është ${value} EUR/L më shtrenjtë se në Shqipëri.`,
    lower: (fuel, value) => `${fuel} është ${value} EUR/L më lirë se në Shqipëri.`,
    close: (fuel) => `${fuel} është pothuajse në të njëjtin nivel me Shqipërinë.`,
    comparisonMissing: (fuel) => `${fuel}: krahasimi nuk disponohet sepse mungon një vlerë.`,
    fresh: "Të dhëna aktuale",
    stale: "Të dhëna të vjetruara",
    dataUpdated: (date) => `Përditësuar ${date}`,
  },
  report: {
    eyebrow: "Inteligjencë ditore për naftën",
    title: "Tregu evropian i karburantit, në një pamje vendimtare.",
    lede: (days) => `Raport i fokusuar për naftën, llogaritur nga ${days} ditë vrojtimesh—renditje, lëvizje, interval dhe paqëndrueshmëri pa zhurmë.`,
    fresh: "Të dhëna aktuale",
    stale: "Të dhënat kërkojnë rifreskim",
    unavailableTitle: "Raporti i tregut nuk disponohet",
    unavailableText: "Nuk ka histori të mjaftueshme të besueshme për raportin e sotëm. Kontrollo sërish pas përditësimit tjetër.",
    snapshot: "Pamja e raportit",
    daysObserved: "Ditë të vrojtuara",
    marketsTracked: "Tregje të analizuara",
    reportDate: "Data e raportit",
    methodology: "Si llogaritet raporti",
  },
};

export const editorialCopy: Record<Lang, EditorialCopy> = { en, sq };
