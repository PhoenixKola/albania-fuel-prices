export const sq = {
  title: "Çmimet e Karburanteve në Europë",
  subtitleAsOf: (d: string) => `Data: ${d}`,
  subtitleLoading: "Po ngarkohen të dhënat…",
  region: (r: string) => `Rajoni: ${r}`,
  selectCountry: "Zgjidh një shtet",
  gasoline95: "Benzinë 95",
  diesel: "Naftë",
  lpg: "LPG",
  updated: (s: string) => `Marrë më: ${s}`,
  source: "Burimi",
  open: "Hap",
  refresh: "Rifresko",
  refreshing: "Po rifreskohet…",
  couldntLoad: "S’u arrit të ngarkohen të dhënat",
  tryAgain: "Provo përsëri",
  hint: "Mesatare kombëtare. Vlerat vijnë nga burimi dhe përditësohen automatikisht.",
  langEN: "EN",
  langSQ: "AL",

  currency: "Monedha",
  eurPerL: "EUR / L",
  allPerL: "ALL / L",
  exchangeRate: "Kursi (ALL për 1 EUR)",
  estimated: "Vlerësim",
  localEstimate: "Vlerësim lokal (Shqipëri)",
  pickCity: "Zgjidh qytetin",
  cityBias: "Rregullim",
  estimateNote: "Ky është një vlerësim për ndjesi më lokale (jo çmime zyrtare pike karburanti).",

  watchlist: "Të preferuarat",
  addToWatchlist: "Shto",
  remove: "Hiq",
  compare: "Krahaso",
  openCountry: "Hap",
  emptyWatchlist: "Shto shtete për krahasim të shpejtë.",

  rankings: "Renditje",
  cheapest: "Më të lirat",
  mostExpensive: "Më të shtrenjtat",
  fuelType: "Karburanti",

  tools: "Mjete të shpejta",
  tabFill: "Mbushje",
  tabBudget: "Buxhet",
  tabTrip: "Udhëtim",
  liters: "Litrat",
  cost: "Kosto",
  budget: "Buxhet",
  youGet: "Merr",
  distanceKm: "Distanca (km)",
  consumption: "Konsumi (L/100km)",
  litersNeeded: "Litrat e nevojshme",

  copy: "Kopjo",
  copied: "U kopjua",
  share: "Ndaj",
  shareTextTitle: "Përmbledhje çmimesh",
  currencyMode: "Monedha",
  currencyEUR: "EUR",
  currencyLocal: "Lokale",

  stationsNearbyTitle: "Stacione afër",
  stationsUseMyLocation: "Përdor vendndodhjen time",
  stationsGettingLocation: "Po merret vendndodhja…",
  stationsRadius: "Rrezja",
  stations2km: "2 km",
  stations5km: "5 km",
  stations10km: "10 km",
  stationsFound: (n: number) => `U gjetën ${n} stacione`,
  stationsOpen: "Hapur",
  stationsOpenNow: "Hapur tani",
  stationsClosed: "Mbyllur",
  stationsHoursUnknown: "Orari i panjohur",
  stationsRefresh: "Rifresko",
  stationsNone: "S’u gjetën pika karburanti afër.",
  stationsShowing: (shown: number, total: number) => `Po shfaqen ${shown} nga ${total}`,
  stationsShowMore: "Shfaq më shumë",
  stationsShowAll: "Shfaq të gjitha",
  stationsCollapse: "Mbyll",

  heroTitle: "Çmimet e karburantit në Shqipëri dhe Europë, të shpjeguara qartë",
  heroSubtitle:
    "Karburanti Sot i ndihmon drejtuesit të krahasojnë çmimet e karburantit, të vlerësojnë kostot e udhëtimit dhe të kuptojnë si ndryshojnë çmimet mes vendeve. Në vend që të shfaqë vetëm numra të papërpunuar, faqja shton kontekst për renditjet, diferencat e mundshme të kostos, efektet e kursit të këmbimit dhe rastet praktike të përdorimit.",
  heroLiveFallback: "Mjete live për çmime dhe krahasime mes vendeve",
  heroUpdatedAt: (s: string) => `Përditësuar ${s}`,

  editorialTitle: "Përmbledhja e çmimeve të sotme të karburantit",
  editorialEmpty:
    "Të dhënat e çmimeve për këtë krahasim janë përkohësisht të padisponueshme. Ky seksion normalisht ofron një përmbledhje editoriale që thekson cilat vende kanë karburantin më të lirë dhe më të shtrenjtë, së bashku me hendekun aktual të çmimeve në rajon.",
  editorialLead:
    "Kjo përmbledhje i kthen të dhënat aktuale sipas vendeve në një lexim të shpejtë të tregut. Qëllimi është të ndihmojë vizitorët të kuptojnë ku karburanti është relativisht më i lirë, ku është më i shtrenjtë dhe sa i madh është hendeku i çmimeve mes vendeve të shfaqura.",
  editorialCheapestPetrol: "Benzina më e lirë",
  editorialMostExpensivePetrol: "Benzina më e shtrenjtë",
  editorialPetrolSpread: "Diferenca e benzinës në vendet e listuara",
  editorialCheapestDiesel: "Nafta më e lirë",
  editorialMostExpensiveDiesel: "Nafta më e shtrenjtë",
  editorialDieselSpread: "Diferenca e naftës në vendet e listuara",
  notAvailable: "n/a",

  methodologyTitle: "Si mblidhen dhe interpretohen të dhënat",
  methodologyParagraph1:
    "Karburanti Sot shfaq informacion publik për çmimet e karburantit dhe e kthen atë në krahasime të thjeshta për drejtuesit dhe udhëtarët. Faqja synon të jetë praktike, por shpjegon edhe çfarë nënkuptojnë shifrat, si ndikojnë dallimet mes vendeve në planifikimin e udhëtimit dhe pse vlerësimet duhen parë si orientim dhe jo si garanci për një pikë ose rrugë të caktuar.",
  methodologyParagraph2:
    "Renditjet dhe krahasimet sipas vendeve ndërtohen nga dataset-et e karburantit të vëna në dispozicion të aplikacionit. Kur nevojiten konvertime valutore, faqja përdor një burim publik të kursit të këmbimit që vlerat të shfaqen më njëtrajtshëm mes rajoneve. Meqë tregu i karburantit ndryshon me kohën dhe burimet mund të përditësohen me ritme të ndryshme, shifrat duhen lexuar si vlerësimi më i mirë publik i momentit.",
  methodologyParagraph3:
    "Llogaritjet e udhëtimit janë vlerësime. Ato varen nga supozimet e itinerarit, lloji i karburantit i zgjedhur, të dhënat e çmimeve të shfaqura dhe çdo logjikë konvertimi valutor. Të dhënat për pikat afër mund të ndryshojnë gjithashtu për shkak të çmimeve lokale, taksave, promocioneve dhe kohës së raportimit.",
  methodologyFuelSource: "Burimi i karburantit",
  methodologyFxSource: "Burimi i kursit",
  methodologyUpdatePattern: "Modeli i përditësimit",
  methodologyFuelSourceDefault: "Burime publike të çmimeve të karburantit të përdorura nga aplikacioni",
  methodologyFxSourceDefault: "Burim publik i kursit të këmbimit i përdorur nga aplikacioni",
  methodologyUpdateFrequencyDefault: "Përditësimet varen nga burimet publike dhe cikli i rifreskimit të aplikacionit",

  faqTitle: "Pyetje të shpeshta",
  faqQ1: "Sa shpesh përditësohen çmimet e karburantit?",
  faqA1:
    "Frekuenca e përditësimit varet nga burimet publike të lidhura me faqen dhe cikli i rifreskimit të aplikacionit. Disa vlera mund të përditësohen më shpejt se të tjerat.",
  faqQ2: "A janë çmimet të sakta për çdo pikë karburanti?",
  faqA2:
    "Jo. Shifrat në nivel vendi ose rajoni duhen lexuar si vlerësime publike të tregut ose mesatare, përveç rasteve kur tregohet qartë një burim specifik për pikë.",
  faqQ3: "Pse çmimet e pikave afër mund të ndryshojnë nga mesatarja e vendit?",
  faqA3:
    "Taksat lokale, promocionet, konkurrenca, marka e pikës dhe koha e të dhënave mund të krijojnë diferenca mes çmimit të një pike dhe figurës më të gjerë të vendit.",
  faqQ4: "Si bëhet vlerësimi i kalkulatorit të udhëtimit?",
  faqA4:
    "Vlerësimi përdor distancën dhe supozimet e zgjedhura për karburantin, së bashku me çmimin e shfaqur dhe çdo konvertim valutor të nevojshëm.",
  faqQ5: "Cili kurs këmbimi përdoret?",
  faqA5:
    "Faqja përdor një burim publik të kursit të këmbimit kur krahasimi i çmimeve ose vlerësimi i udhëtimit kërkon konvertim mes monedhave.",
  faqQ6: "A e ruan faqja vendndodhjen time?",
  faqA6:
    "Përdorimi i vendndodhjes duhet të jetë opsional dhe vetëm kur nevojitet për funksionet e pikave afër. Nuk duhet të kërkohet për mjetet bazë të krahasimit mes vendeve.",

  watchlistGuidance:
    "Përdor listën e të preferuarave për të mbajtur një grup të vogël krahasimi me vendet që të interesojnë më shumë. Është e dobishme për krahasime të shpejta, por vlerat duhen parë si orientim i përgjithshëm i çmimit.",
  nearbyGuidance:
    "Pikat afër janë opsionale dhe shërbejnë si shtresë praktike lokale mbi krahasimin sipas vendeve. Disponueshmëria e pikave dhe të dhënat e orareve mund të jenë të paplota ose të ndryshme nga ajo që shfaqet në pompë.",
  rankingsGuidance:
    "Renditjet tregojnë nivelet relative të çmimeve të karburantit mes vendeve për llojin e zgjedhur të karburantit. Janë të dobishme për të dalluar shpejt ndryshimet e tregut, por çmimet lokale të pikave mund të ndryshojnë.",

  sourceUpdatedLabel: "Përditësuar",
  sourceCardSubtitle: "Informacion mbi burimin dhe si duhen interpretuar këto shifra të karburantit.",
  sourceCardInterpretationNote:
    "Shifrat në këtë faqe duhen lexuar si krahasim praktik i të dhënave publike të karburantit, jo si garanci për çmimin e saktë në çdo pikë. Pikat lokale, taksat, koha e raportimit dhe efekti i kursit të këmbimit mund të ndryshojnë rezultatin final.",
  sourceCardMethodologyNote:
    "Metodologjia: faqja krahason çmimet e karburantit në nivel vendi dhe i paraqet në një formë më të thjeshtë për planifikim udhëtimi, krahasim dhe vlerësim të kostove. Këto shifra janë më të dobishme si orientim tregu.",
  sourceUrlLabel: "URL",

  // Navigation & Footer
  navHome: "Kryefaqja",
  navStations: "Pikat",
  navCompare: "Krahaso",
  navRankings: "Renditje",
  navAbout: "Rreth nesh",
  navContact: "Kontakt",
  navGuides: "Guida",
  navPrivacy: "Politika e Privatësisë",
  navTerms: "Kushtet e Përdorimit",
  footerTagline: "Të dhëna të pavarura për çmimet e karburantit për drejtuesit dhe udhëtarët në Europë.",
  footerCopyright: (year: number) => `© ${year} Karburanti Sot. Të gjitha të drejtat e rezervuara.`,

  // About page
  aboutTitle: "Rreth Karburanti Sot",
  aboutIntro:
    "Karburanti Sot është një shërbim i pavarur informacioni për çmimet e karburantit që mbledh, krahason dhe shpjegon të dhënat publike të çmimeve të karburantit në Shqipëri dhe rajonin më të gjerë europian. Projekti u nis për t'u dhënë drejtuesve, udhëtarëve dhe atyre që udhëtojnë ndërkufitarisht një mënyrë të thjeshtë për të krahasuar kostot e karburantit pa pasur nevojë të vizitojnë shumë burime të veçanta të palëve të treta dhe industrisë.",
  aboutMissionTitle: "Misioni ynë",
  aboutMissionP1:
    "Çmimet e karburantit ndryshojnë ndjeshëm nga një vend në tjetrin në Europë, ndonjëherë me më shumë se 50 përqind për të njëjtin lloj karburanti. Këto diferenca kanë rëndësi: ndikojnë buxhetet familjare, planet e udhëtimit, kostot logjistike dhe vendimet e udhëtimit ndërkufitar.",
  aboutMissionP2:
    "Karburanti Sot i sjell së bashku këto informacione të shpërndara në një vend. Qëllimi nuk është thjesht të listojë numra, por të shtojë kontekst: cili vend është më i liri tani, sa i madh është hendeku i çmimeve, si duken efektet e kursit të këmbimit për udhëtarët që paguajnë në monedha të ndryshme dhe si krahasohen pikat afër me mesataren kombëtare.",
  aboutDataTitle: "Nga vijnë të dhënat",
  aboutDataP1:
    "Të dhënat e çmimeve të karburantit mblidhen nga burime publike të palëve të treta dhe mund të plotësohen me referenca zyrtare ose statistikore kur janë të disponueshme. Faqja i merr të dhënat në mënyrë programatike dhe i konverton në një format konsistent.",
  aboutDataP2:
    "Konvertimet e kursit të këmbimit përdorin një burim publik të dhënash FX në mënyrë që krahasimet mes vendeve me monedha të ndryshme të mbeten praktike. Të gjitha konvertimet janë të etiketuara qartë.",
  aboutDataP3:
    "Frekuenca e përditësimit varet nga sa shpesh burimet publikojnë të dhëna të reja. Disa vende raportojnë çdo javë, të tjerë më rrallë. Data e treguar në çdo faqe tregon kur të dhënat u rifreskuan për herë të fundit.",
  aboutEditorialTitle: "Qasja editoriale",
  aboutEditorialP1:
    "Çdo pikë e dhënave në faqe shoqërohet me kontekst editorial. Në vend që të shfaqë vetëm një tabelë me numra, faqja shpjegon çfarë nënkuptojnë numrat: cili vend ka benzinën më të lirë, sa i madh është hendeku i naftës dhe cilat faktorë — si taksat, subvencionet apo kushtet e tregut lokal — zakonisht i nxisin ato diferenca.",
  aboutEditorialP2:
    "Seksioni i metodologjisë në faqen kryesore shpjegon tubacionin e të dhënave në detaj, dhe FAQ mbulon pyetjet më të shpeshta rreth saktësisë, kohës së përditësimit dhe diferencës mes mesatareve kombëtare dhe çmimeve individuale të pikave.",
  aboutWhoTitle: "Kush e mirëmban këtë projekt",
  aboutWhoP1:
    "Karburanti Sot mirëmbahet nga një zhvillues i pavarur me bazë në Shqipëri. Projekti nuk është i lidhur me asnjë kompani karburanti, agjenci qeveritare apo rrjet reklamash. Faqja financohet përmes reklamave, gjë që e lejon të mbetet falas për të gjithë përdoruesit.",
  aboutWhoP2:
    "Nëse keni komente, korrigjime të dhënash apo pyetje bashkëpunimi, mund të kontaktoni mirëmbajtësin përmes faqes së kontaktit.",

  // Contact page
  contactTitle: "Na Kontaktoni",
  contactIntro:
    "Nëse keni një pyetje rreth të dhënave, dëshironi të raportoni një pasaktësi, apo keni një sugjerim për përmirësimin e faqes, mirëpresim mesazhin tuaj. Zakonisht përgjigjemi brenda disa ditëve pune.",
  contactEmailTitle: "Email",
  contactEmailValue: "fenixkola@gmail.com",
  contactEmailNote:
    "Kjo është mënyra më e mirë për të na kontaktuar për korrigjime të dhënash, komente apo pyetje të përgjithshme. Ju lutemi përfshini sa më shumë detaje që të mund t'ju ndihmojmë shpejt.",
  contactTopicsTitle: "Temat e zakonshme me të cilat mund t'ju ndihmojmë",
  contactTopic1: "Raportimi i një çmimi që duket i pasaktë ose i vjetëruar për një vend të caktuar",
  contactTopic2: "Pyetje rreth burimeve të të dhënave ose metodologjisë",
  contactTopic3: "Sugjerimi i një vendi ose veçorie të re",
  contactTopic4: "Raportimi i një problemi teknik me faqen e internetit ose aplikacionin celular",
  contactTopic5: "Pyetje bashkëpunimi ose licencimi të dhënash",
  contactResponseTitle: "Çfarë të prisni",
  contactResponseP1:
    "Ne lexojmë çdo mesazh. Për korrigjime të dhënash, verifikojmë raportin kundrejt burimeve tona përpara se të bëjmë ndryshime. Për kërkesat e veçorive, i shtojmë në një listë publike dhe i prioritizojmë bazuar në kërkesën e përdoruesve.",
  contactResponseP2:
    "Nëse pyetja juaj është urgjente — për shembull, nëse shfaqim informacion qartazi të gabuar — ju lutemi përmendeni këtë në rreshtin e temës dhe ne do ta prioritizojmë.",

  // Privacy page
  privacyTitle: "Politika e Privatësisë",
  privacyUpdated: "Përditësuar së fundi: Mars 2026",
  privacyIntro:
    "Kjo Politikë Privatësie përshkruan si Karburanti Sot (\"Shërbimi\") trajton informacionin kur përdorni faqen tonë të internetit dhe aplikacionet celulare. Jemi të përkushtuar ndaj transparencës rreth të dhënave që mbledhim dhe si përdoren.",
  privacyCollectTitle: "Çfarë të dhënash mbledhim",
  privacyCollectP1:
    "Nuk kërkojmë apo mbledhim informacion personal si emrin, adresën e emailit, numrin e telefonit apo vendndodhjen e saktë. Shërbimi funksionon pa kërkuar krijimin e një llogarie apo hyrjen.",
  privacyLocalTitle: "Të dhënat e ruajtura në pajisjen tuaj",
  privacyLocalP1:
    "Shërbimi ruan një numër të vogël preferencash lokalisht në pajisjen tuaj. Këto përfshijnë gjuhën e zgjedhur, vendin e preferuar, modalitetin e monedhës dhe preferencën e temës. Këto të dhëna nuk largohen kurrë nga pajisja juaj.",
  privacyFetchTitle: "Të dhënat që Shërbimi merr",
  privacyFetchP1:
    "Shërbimi merr të dhëna publike të çmimeve të karburantit dhe kurseve të këmbimit nga burime të largëta. Këto kërkesa rrjeti janë thirrje standarde HTTPS dhe nuk përmbajnë informacion personal.",
  privacyAdsTitle: "Reklamat",
  privacyAdsP1:
    "Shërbimi shfaq reklama përmes Google AdSense (web) dhe Google AdMob (celular). Këto shërbime reklamash të palëve të treta mund të mbledhin automatikisht informacion të caktuar të pajisjes dhe përdorimit, duke përfshirë:",
  privacyAdItem1: "Adresën IP (përdorur për komunikim rrjeti dhe targetim gjeografik të përafërt)",
  privacyAdItem2: "Informacion bazë të pajisjes si modeli, versioni i sistemit operativ dhe madhësia e ekranit",
  privacyAdItem3: "Të dhëna të performancës së reklamave dhe ndërveprimit (shfaqje, klikime)",
  privacyAdItem4: "Cookie-t ose identifikuesit e reklamave celulare, sipas cilësimeve të pajisjes dhe shfletuesit tuaj",
  privacyAdsP2:
    "Reklamat mund të përdorin cookie dhe identifikues të ngjashëm për reklama të personalizuara ose jo të personalizuara, në varësi të pëlqimit tuaj dhe kërkesave ligjore lokale. Për përdoruesit në EEA, MB dhe Zvicër, sinjalet e pëlqimit menaxhohen përmes një CMP të certifikuar ose Google Privacy & messaging flow (detajet e ofruesit dhe lidhjet mund të shtohen nga pronari i faqes). Mund të rivendosni ose kufizoni personalizimin e reklamave përmes cilësimeve të privatësisë së shfletuesit ose pajisjes tuaj.",
  privacyAnalyticsTitle: "Analitika",
  privacyAnalyticsP1:
    "Shërbimi nuk përdor një produkt analitike të veçantë për të ndjekur përdoruesit individualë. Çdo e dhënë përdorimi e mbledhur kufizohet në atë që SDK-të e reklamave mbledhin për qëllime matjeje.",
  privacySharingTitle: "Ndarja e të dhënave",
  privacySharingP1:
    "Ne nuk shesim të dhëna personale. Ofruesit e reklamave të palëve të treta mund të përpunojnë të dhënat e përshkruara më sipër për qëllim shpërndarjeje dhe matjeje reklamash.",
  privacySecurityTitle: "Siguria",
  privacySecurityP1:
    "Shërbimi nuk përdor llogari apo fjalëkalime. Shkarkon vetëm të dhëna publike dhe ruan vetëm preferenca lokale. I gjithë komunikimi i rrjetit përdor enkriptim HTTPS.",
  privacyChildrenTitle: "Privatësia e fëmijëve",
  privacyChildrenP1:
    "Shërbimi është i destinuar për një audiencë të përgjithshme. Nuk mbledh me vetëdije informacion personal nga fëmijë nën moshën 13 vjeç.",
  privacyChangesTitle: "Ndryshimet e kësaj politike",
  privacyChangesP1:
    "Mund ta përditësojmë këtë Politikë Privatësie herë pas here. Data \"Përditësuar së fundi\" në krye të kësaj faqeje do të rishikohet. Ju inkurajojmë ta rishikoni këtë faqe periodikisht.",
  privacyContactTitle: "Kontakti",
  privacyContactP1:
    "Nëse keni pyetje rreth kësaj Politike Privatësie, na kontaktoni në fenixkola@gmail.com.",

  // Terms page
  termsTitle: "Kushtet e Përdorimit",
  termsUpdated: "Përditësuar së fundi: Mars 2026",
  termsIntro:
    "Duke aksesuar dhe përdorur Karburanti Sot (\"Shërbimin\"), pranoni të jeni i lidhur me këto Kushte Përdorimi. Nëse nuk pajtoheni me ndonjë pjesë të këtyre kushteve, ju lutemi mos e përdorni Shërbimin.",
  termsServiceTitle: "Përshkrimi i Shërbimit",
  termsServiceP1:
    "Karburanti Sot është një shërbim falas dhe publik i krahasimit të çmimeve të karburantit. Mbledh të dhëna publike nga burime të palëve të treta dhe industriale në Europë, i konverton në format konsistent dhe i paraqet me kontekst editorial.",
  termsAccuracyTitle: "Saktësia e të dhënave dhe kufizimet",
  termsAccuracyP1:
    "Çmimet e karburantit të shfaqura janë nga dataset-e publike. Ndërsa bëjmë përpjekje të arsyeshme për saktësi dhe përditësim, nuk mund të garantojmë që çdo çmim përputhet me çmimin e saktë të pompës në çdo pikë.",
  termsAccuracyP2:
    "Shifrat në nivel vendi përfaqësojnë vlera orientuese nga dataset-et e disponueshme, jo çmime individuale pike. Taksat lokale, promocionet dhe vonesat e raportimit mund të krijojnë diferenca.",
  termsAccuracyP3:
    "Konvertimet e kursit të këmbimit bazohen në të dhëna publike FX dhe duhen trajtuar si vlerësime. Shërbimi nuk është një mjet këshillimi financiar.",
  termsUseTitle: "Përdorimi i pranueshëm",
  termsUseP1:
    "Mund ta përdorni Shërbimin për qëllime personale jo-komerciale si planifikim udhëtimi, krahasim çmimesh dhe informacion të përgjithshëm. Nuk lejohet përdorimi i mjeteve të automatizuara për të shkarkuar të dhënat në masë pa leje me shkrim.",
  termsIpTitle: "Pronësia intelektuale",
  termsIpP1:
    "Përmbajtja editoriale, dizajni, kodi dhe elementet vizuale të Shërbimit janë pronë e Karburanti Sot. Të dhënat e çmimeve të karburantit vijnë nga burime publike dhe mbeten subjekt i kushteve të atyre burimeve.",
  termsLinksTitle: "Lidhjet dhe shërbimet e palëve të treta",
  termsLinksP1:
    "Shërbimi mund të përmbajë lidhje me faqe të palëve të treta. Nuk jemi përgjegjës për përmbajtjen, saktësinë ose praktikat e privatësisë së faqeve të jashtme.",
  termsAdsTitle: "Reklamat",
  termsAdsP1:
    "Shërbimi financohet përmes reklamave të palëve të treta. Reklamat janë qartë të ndara nga përmbajtja editoriale dhe nuk ndikojnë në të dhënat e çmimeve.",
  termsLiabilityTitle: "Kufizimi i përgjegjësisë",
  termsLiabilityP1:
    "Shërbimi ofrohet \"siç është\" pa garanci të asnjë lloji. Karburanti Sot nuk do të jetë përgjegjës për asnjë dëm të drejtpërdrejtë, të tërthorti, rastësor ose pasues që rrjedh nga përdorimi i Shërbimit.",
  termsChangesTitle: "Ndryshimet e këtyre kushteve",
  termsChangesP1:
    "Mund t'i përditësojmë këto Kushte Përdorimi herë pas here. Përdorimi i vazhdueshëm pas ndryshimeve përbën pranim të kushteve të rishikuara.",
  termsContactTitle: "Kontakti",
  termsContactP1:
    "Nëse keni pyetje rreth këtyre Kushteve të Përdorimit, na kontaktoni në fenixkola@gmail.com.",

  // Guide navigation
  navMethodology: "Metodologjia",
  navHowPricesWork: "Si Funksionojnë Çmimet",
  navEuropeComparison: "Krahasimi Europian",
  navRoadTripGuide: "Guida e Udhëtimit",
  footerGuidesHeading: "Guida",

  // Stations page editorial
  stationsEditorialTitle: "Pse çmimet e pikave afër ndryshojnë nga mesataret kombëtare",
  stationsEditorialP1:
    "Mesataret kombëtare të çmimeve janë të dobishme si referencë tregu, por çmimi që paguani në pompë varet nga faktorë lokal. Pikat e pavarura mund të çmojnë më agresivisht se zinxhirët e markuar, vendet në qendër të qytetit shpesh kanë çmime më të larta dhe pikat e autostradave janë zakonisht më të shtrenjtat.",
  stationsEditorialP2:
    "Regjimi tatimor mund të ndryshojë edhe në nivel nën-kombëtar në disa vende. Taksat rajonale, taksat mjedisore lokale ose edhe koha e dorëzimit të fundit me shumicë mund të krijojnë hendekë mes mesatares kombëtare dhe numrit në ekranin e pompës.",
  stationsEditorialP3:
    "Përdorimi i mjetit të pikave afër së bashku me të dhënat e vendit në faqen kryesore ju jep një pamje makro dhe mikro. Pamja makro tregon ku qëndron karburanti në një vend; pamja mikro tregon çfarë po ngarkon pompa më e afërt.",
  stationsEditorialTipTitle: "Këshillë praktike",
  stationsEditorialTip:
    "Nëse jeni duke ngjitur afër një kufiri kombëtar, kontrolloni mesataret dhe pikat afër në të dyja anët. Në Ballkan veçanërisht, një devijim 10-minutësh mund të kursejë 10–20 centë për litër.",

  // Compare page editorial
  compareEditorialTitle: "Si të përdorni krahasimet mes vendeve në mënyrë efektive",
  compareEditorialP1:
    "Krahasimi i çmimeve mes vendeve nuk ka të bëjë vetëm me gjetjen e numrit më të ulët. Kurset e këmbimit, fuqia blerëse lokale, strukturat tatimore dhe even oraret e raportimit ndikojnë kuptimësinë e krahasimit.",
  compareEditorialP2:
    "Veçoria e listës së të preferuarave është dizajnuar për drejtuesit që kalojnë rregullisht kufij ose planifikojnë udhëtime në disa vende. Duke mbajtur një grup të vogël vendesh, mund të vini re shpejt kur hendekët e çmimeve zgjerohen ose ngushtohen.",
  compareEditorialP3:
    "Kur lexoni krahasimin, kushtojini vëmendje llojit të karburantit të zgjedhur. Nafta dhe benzina nuk levizin gjithmonë në të njëjtin drejtim. Disa vende e taksojnë naftën më lehtë, ndërsa të tjerë kanë barazuar ose përmbysur atë model.",
  compareEditorialTipTitle: "Këshillë ndërkufitare",
  compareEditorialTip:
    "Nëse po planifikoni një udhëtim mes disa vendeve, mbushni rezervuarin ku çmimet janë më të ulëta dhe mbani vetëm sa mjafton karburant në vendet e shtrenjta.",

  // Rankings page editorial
  rankingsEditorialTitle: "Kuptimi i renditjeve të çmimeve të karburantit në Europë",
  rankingsEditorialP1:
    "Çmimet e karburantit në Europë mbulojnë një gamë të gjerë. Në krye gjeni vende me taksa të larta — zakonisht Skandinavia dhe Europa Perëndimore — ndërsa në fund gjeni vende me taksa më të ulëta ose subvencione.",
  rankingsEditorialP2:
    "Taksa është faktori më i madh. Në shumë vende të BE, më shumë se gjysma e çmimit final përbehet nga akciza dhe TVSH.",
  rankingsEditorialP3:
    "Subvencionet dhe kontrollet e çmimeve funksionojnë në drejtim të kundërt. Disa vende kufizojnë çmimet me pakicë. Këto ndërhyrje janë shpesh të përkohshme.",
  rankingsEditorialP4:
    "Tabela e renditjes është më e dobishme kur e krahasoni me kohën. Një vend që leviz nga mesi në krye mund të jetë duke futur taksa të reja, ndërsa një vend që bie mund të jetë duke u përgjigjur me subvencione të përkohshme.",

  // Methodology page
  methodologyPageTitle: "Metodologjia: Si Mbledh dhe Paraqet Karburanti Sot të Dhënat e Çmimeve",
  methodologyPageIntro:
    "Transparenca rreth mbledhjes, përpunimit dhe shfaqjes së të dhënave është thelbësore. Kjo faqe shpjegon çdo hap të tubacionit të të dhënave.",
  methodologySourcesTitle: "Burimet e të dhënave",
  methodologySourcesP1:
    "Karburanti Sot merr të dhëna çmimesh nga burime publike të palëve të treta dhe mund të plotësojë mbulimin me referenca zyrtare ose statistikore kur janë të disponueshme.",
  methodologySourcesP2:
    "Burimet specifike mund të ndryshojnë me kohën ndërsa ofruesit përditësojnë formatet. Qëllimi është të ruhet një feed transparent, i përditësuar dhe i krahasueshëm.",
  methodologyProcessTitle: "Përpunimi i të dhënave",
  methodologyProcessP1:
    "Të dhënat normalizohen: çmimet shprehen për litër dhe EUR përdoret si referencë. Vlerat në monedhë lokale ruhen gjithashtu.",
  methodologyProcessP2:
    "Nuk aplikohen rregullime manuale. Numrat e shfaqur janë vlerat e raportuara nga burimi, të konvertuara nëse nevojitet.",
  methodologyFxTitle: "Konvertimet valutore",
  methodologyFxP1:
    "Kurset e këmbimit merren nga një API publik FX. Këto janë kurse indikative të mesit të tregut, jo kurse blerje/shitjeje bankare.",
  methodologyFxP2:
    "Kurset rifreskohen rregullisht, por një vonesë e vogël mes kursit të shfaqur dhe atij real është normale.",
  methodologyAccuracyTitle: "Saktësia dhe kufizimet",
  methodologyAccuracyP1:
    "Çmimet në nivel vendi përfaqësojnë vlera orientuese nga dataset-et e disponueshme. Nuk pasqyrojnë çmimin e saktë të çdo pike.",
  methodologyAccuracyP2:
    "Veçoria e pikave afër përdor burime të ndryshme të dhënash dhe mund të tregojë çmime më aktuale por më pak konsistente.",
  methodologyUpdateTitle: "Frekuenca e përditësimit",
  methodologyUpdateP1:
    "Të dhënat rifreskohen automatikisht bazuar në orarin e publikimit të burimeve. Data e përditësimit tregon saktësisht kur u morën të dhënat.",
  methodologyEditorialTitle: "Shtresa editoriale",
  methodologyEditorialP1:
    "Përtej të dhënave, faqja shton kontekst editorial. Përmbledhja ditore thekson vendet dhe diferencat. Guidat shpjegojnë tematika më të gjera.",
  methodologyEditorialP2:
    "Përmbajtja editoriale shkruhet nga njerëz dhe përditësohet kur ndryshojnë kushtet e tregut.",
  methodologyOpenTitle: "Qasja e hapur",
  methodologyOpenP1:
    "Të dhënat vijnë nga burime publike dhe nuk kufizohen pas një muri pagesash. Metodologjia synon transparencë.",

  // How Fuel Prices Work page
  howPricesTitle: "Si Funksionojnë Çmimet e Karburantit: Nga Nafta Bruto te Pompa",
  howPricesIntro:
    "Çmimet e karburantit ndjekin një zinxhir që nis me nxjerrjen e naftës bruto, kalon përmes rafinimit dhe shpërndarjes, dhe përfundon në pompë me taksa dhe marzhe.",
  howPricesCrudeTitle: "Nafta bruto: pika e nisjes",
  howPricesCrudeP1:
    "Çmimet globale të naftës bruto vendosin bazën. Nafta tregtohet si Brent (referenca europiane) dhe WTI (referenca amerikane).",
  howPricesCrudeP2:
    "Çmimet ndikhohen nga ngjarje gjeopolitike, vendime OPEC+, modelet e kërkesës, levizjet e monedhave dhe nivelet e inventarit.",
  howPricesRefiningTitle: "Rafinimi: kthimi i naftës bruto në benzinë dhe naftë",
  howPricesRefiningP1:
    "Nafta bruto përpunohet në rafineri në produkte: benzinë, naftë, kerozinë, LPG etj. Marzhi i rafinimit luhatet sipas kapacitetit dhe kërkesës sezonale.",
  howPricesRefiningP2:
    "Europa importon produkte të rafinuara si edhe naftë bruto, kështu që kapaciteti rafinues global mund të ndikojë çmimet europiane.",
  howPricesDistributionTitle: "Shpërndarja dhe shumica",
  howPricesDistributionP1:
    "Karburanti i rafinuar transportohet nga rafineri në depot rajonale dhe pastaj në pika përmes tubacioneve, kamionëve ose hekurudhave.",
  howPricesDistributionP2:
    "Çmimet me shumicë pasqyrojnë çmimin e produktit të rafinuar plus kostot e shpërndarjes plus një marzh të vogël.",
  howPricesTaxTitle: "Taksat: variabli më i madh mes vendeve",
  howPricesTaxP1:
    "Në shumicën e vendeve europiane, taksat përbëjnë 40–60% të çmimit final. Dy komponentët kryesor janë akciza dhe TVSH.",
  howPricesTaxP2:
    "Kjo është arsyeja kryesore pse i njëjti karburant mund të kushtojë €1.30/L në një vend dhe €1.90/L në një tjetër.",
  howPricesTaxP3:
    "Disa vende aplikojnë edhe taksa të veçanta: taksa karboni, kontribute për rezerva strategjike, ose mbingarkesa mirëmbajtjeje rrugore.",
  howPricesRetailTitle: "Marzhet e shitjes me pakicë",
  howPricesRetailP1:
    "Marzhi i shitjes me pakicë zakonisht është i vogël — disa centë për litër — por ndryshon sipas konkurrencës, vendndodhjes dhe markës.",
  howPricesRetailP2:
    "Kjo shpjegon pse mjeti i pikave afër mund të tregojë çmime të ndryshme nga mesatarja e vendit.",
  howPricesSeasonalTitle: "Modelet sezonale dhe të kërkesës",
  howPricesSeasonalP1:
    "Kërkesa për benzinë rritet në verë (sezoni i udhëtimit). Kërkesa për naftë tenton të rritet në dimër në vendet ku nafta përdoret edhe për ngrohje.",
  howPricesSeasonalP2:
    "Fundjavet e pushimeve dhe ngjarjet e mëdha të udhëtimit mund të krijojnë rritje afatshkurtra të kërkesës.",
  howPricesSummaryTitle: "Duke i bashkuar të gjitha",
  howPricesSummaryP1:
    "Çmimi i pompës është afërsisht: kosto naftë bruto + marzh rafinimi + kosto shpërndarja + akcizë + TVSH + marzh i shitjes me pakicë.",

  // Europe Fuel Comparison page
  europeCompTitle: "Çmimet e Karburantit në Europë: Guidë Krahasimi Vend për Vend",
  europeCompIntro:
    "Europa ka një nga variacionet më të gjera të çmimeve të karburantit. Kjo guidë shpjegon pse ekzistojnë dallimet dhe si t'i përdorni praktikisht.",
  europeCompWhyTitle: "Pse çmimet ndryshojnë kaq shumë",
  europeCompWhyP1:
    "Kosto bazë e karburantit është në përgjithësi e ngjashme sepse të gjithë mbështeten të tregjet globale. Dallimet vijnë nga taksat, kostot lokale të shpërndarjes dhe ndërhyrjet qeveritare.",
  europeCompWhyP2:
    "BE vendos norma minimale akcize, por çdo shtet anëtar zgjedh normën e vet sipër asaj baze. Vendet jashtë BE në Ballkan kanë edhe më shumë feksibilitet.",
  europeCompRegionsTitle: "Modelet rajonale",
  europeCompRegionsP1:
    "Vendet skandinave dhe të Europës Veriperëndimore (Hollandë, Finlandë, Danimarkë, Suedi, Norvegji) kanë çmimet më të larta.",
  europeCompRegionsP2:
    "Vendet e Europës Jugore (Spanjë, Portugali, Greqi) bien në mesin e rangut.",
  europeCompRegionsP3:
    "Vendet e Europës Qendrore dhe Lindore (Poloni, Hungari, Çeki, Rumani, Bullgari) kanë çmime më të ulëta.",
  europeCompRegionsP4:
    "Vendet e Ballkanit (Shqipëri, Kosovë, Maqedoni e Veriut, Serbi, Bosnjë, Mal i Zi) kanë shpesh çmimet më të ulëta, por me variacion mes tyre.",
  europeCompDieselVsPetrolTitle: "Nafta kundrejt benzinës",
  europeCompDieselVsPetrolP1:
    "Historikisht, shumë vende europiane e taksonin naftën më lehtë. Kjo prirje ka filluar të përmbyset për arsye mjedisore.",
  europeCompDieselVsPetrolP2:
    "Si rezultat, në disa vende nafta tani është më e shtrenjtë se benzina. Faqja e renditjeve ju lejon të shihni saktësisht ku qëndron çdo lloj karburanti.",
  europeCompLpgTitle: "LPG: alternativa e harruar",
  europeCompLpgP1:
    "Autogazi (LPG) është dukshëm më i lirë në vendet që e promovojnë, si Polonia, Turqia dhe Italia. Por disponueshmëria ndryshon shumë mes vendeve.",
  europeCompBorderTitle: "Efektet kufitare dhe strategjitë e mbushjeve",
  europeCompBorderP1:
    "Dallimet e çmimeve në kufij krijojnë mundësi praktike. Drejtuesit shpesh kalojnë kufirin për karburant më të lirë.",
  europeCompBorderP2:
    "Mjeti i krahasimit në këtë faqe është dizajnuar për t'i bërë strategjitë kufitare të dukshme.",
  europeCompExchangeTitle: "Efektet e kursit të këmbimit për udhëtarët",
  europeCompExchangeP1:
    "Nëse udhëtoni nga zona euro në një vend jo-euro, kursi i këmbimit shton një shtresë tjetër. Faqja tregon çmime në EUR dhe monedhë lokale.",
  europeCompSummaryTitle: "Si ta përdorni këtë informacion",
  europeCompSummaryP1:
    "Për udhëtarët ditore, krahasimi i vendeve dhe renditjet ju tregojnë ku të mbushni me çmim të ulët. Për të interesuarit në politikë energjie, të dhënat zbulojnë si zgjedhjet qeveritare ndikojnë drejtpërdrejt çfarë paguajnë drejtuesit.",

  // Road Trip Fuel Guide page
  roadTripTitle: "Guida e Kostos së Karburantit për Udhëtime: Si të Vlerësoni dhe Ulni Shpenzimet",
  roadTripIntro:
    "Po planifikoni një udhëtim me makinë? Karburanti është zakonisht një nga kostot variabël më të mëdha, dhe ia vlen ta vlerësoni paraprakisht.",
  roadTripCalcTitle: "Si funksionon kalkulatori i udhëtimit",
  roadTripCalcP1:
    "Kosto e vlerësuar: (distanca ÷ 100) × konsumi × çmimi për litër = kosto e vlerësuar.",
  roadTripCalcP2:
    "Mjeti i udhëtimit aplikon këtë formulë me çmimin e shfaqur. Për rrugë mes disa vendeve, vlerësoni çdo segment veç e veç.",
  roadTripConsumptionTitle: "Kuptimi i konsumit të karburantit",
  roadTripConsumptionP1:
    "Konsumi i makinës — në L/100km — është variabli më i rëndësishëm personal. Shifrat e prodhuesit janë optimiste. Konsumi real është 10–30% më i lartë.",
  roadTripConsumptionP2:
    "Faktorët që rrisin konsumin: shpejtësi e lartë, ndalesa të shpeshta, kondicioner, terreno kodrore, ngarkesë e rëndë, goma me presion të ulët.",
  roadTripConsumptionP3:
    "Për vlerësim realist, shtoni 15–20% figure së prodhuesit. Një makinë me 6.0 L/100km do të mesatarizojë 7.0–7.5 L/100km.",
  roadTripCrossBorderTitle: "Strategjia e mbushjeve ndërkufitare",
  roadTripCrossBorderP1:
    "Mbushni në vendin me çmimin më të ulët dhe mbani sa më pak karburant në vendet e shtrenjta.",
  roadTripCrossBorderP2:
    "P.sh. nëse udhëtoni nga Gjermania përmes Austrisë në Slloveni dhe Itali, mbushni para se të hyni në Itali ku çmimet janë zakonisht më të larta.",
  roadTripCrossBorderP3:
    "Kini parasysh se disa vende kanë kufizime ligjore për sa karburant mund të transportoni në enë portative.",
  roadTripPaymentTitle: "Këshilla pagese dhe valute",
  roadTripPaymentP1:
    "Shumica e pikave në Europë pranojnë karta kryesore. Disa pika rurale në Ballkan mund të jenë vetëm me para të gatshme.",
  roadTripPaymentP2:
    "Kur paguani me kartë në vend jo-euro, zgjidhni të paguani në monedhën lokale. Kursi i bankës suaj është pothuajse gjithmonë më i mirë.",
  roadTripSavingsTitle: "Këshilla praktike për ulje kostosh",
  roadTripSavingsP1:
    "Ngisni me shpejtësi të moderuar. Ulja nga 130 km/h në 110 km/h mund të ulë konsumin 15–20%.",
  roadTripSavingsP2:
    "Mbani shpejtësi të qëndrueshme. Përdorni kruiz kontrollin kur mundeni.",
  roadTripSavingsP3:
    "Kontrolloni presionin e gomave para udhëtimit.",
  roadTripSavingsP4:
    "Hiqni peshën dhe rezistencën e panevojshme: kutivbagazhi në çati, mbajtëse biçikletash.",
  roadTripSavingsP5:
    "Planifikoni ndalesat e mbushjeve duke përdorur të dhënat e renditjeve dhe krahasimit.",
  roadTripExampleTitle: "Shembull: vlerësimi i udhëtimit në Ballkan",
  roadTripExampleP1:
    "Supozoni se udhëtoni nga Tirana, Shqipëri në Selanik, Greqi — rreth 300 km. Makina konsunon 7.5 L/100km.",
  roadTripExampleP2:
    "Karburanti i nevojshëm: (300 ÷ 100) × 7.5 = 22.5 litëv. Me çmim nafte rreth €1.45/L, kosto vlerësohet rreth €32.60. Diferenca me Greqinë tregon pse njohja e çmimeve ndërkufitare ka rëndësi.",
  roadTripExampleP3:
    "Për udhëtime më të gjata, këto diferenca akumulohen. Një udhëtim 2,000 km përmes 5 vendeve mund të ketë diferenca €30–50.",
  roadTripSummaryTitle: "Përmbledhje",
  roadTripSummaryP1:
    "Vlerësimi i kostos së karburantit nuk është i komplikuar, por ndërgjegjësimi për dallimet ndërkufitare mund të kursejë para kuptimplota.",

  // 404 page
  notFoundTitle: "Faqja nuk u gjet",
  notFoundSubtitle: "404 — Kjo faqe nuk ekziston",
  notFoundMessage:
    "Faqja që kërkoni nuk është here. Mund të ketë qenë e lëvizur, ose mund të keni ndjekur një lidhje të pasaktë. Kthehu në faqen kryesore për të vazhduar krahasimin e çmimeve të karburantit.",
  notFoundButtonHome: "Kthehu në shtëpi",
} as const;