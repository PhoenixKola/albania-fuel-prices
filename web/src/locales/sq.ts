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
  navPrivacy: "Politika e Privatësisë",
  navTerms: "Kushtet e Përdorimit",
  footerTagline: "Të dhëna të pavarura për çmimet e karburantit për drejtuesit dhe udhëtarët në Europë.",
  footerCopyright: (year: number) => `© ${year} Karburanti Sot. Të gjitha të drejtat e rezervuara.`,

  // About page
  aboutTitle: "Rreth Karburanti Sot",
  aboutIntro:
    "Karburanti Sot është një shërbim i pavarur informacioni për çmimet e karburantit që mbledh, krahason dhe shpjegon të dhënat publike të çmimeve të karburantit në Shqipëri dhe rajonin më të gjerë europian. Projekti u nis për t'u dhënë drejtuesve, udhëtarëve dhe atyre që udhëtojnë ndërkufitarisht një mënyrë të thjeshtë për të krahasuar kostot e karburantit pa pasur nevojë të vizitojnë dhjetëra burime të ndryshme qeveritare apo industriale.",
  aboutMissionTitle: "Misioni ynë",
  aboutMissionP1:
    "Çmimet e karburantit ndryshojnë ndjeshëm nga një vend në tjetrin në Europë, ndonjëherë me më shumë se 50 përqind për të njëjtin lloj karburanti. Këto diferenca kanë rëndësi: ndikojnë buxhetet familjare, planet e udhëtimit, kostot logjistike dhe vendimet e udhëtimit ndërkufitar.",
  aboutMissionP2:
    "Karburanti Sot i sjell së bashku këto informacione të shpërndara në një vend. Qëllimi nuk është thjesht të listojë numra, por të shtojë kontekst: cili vend është më i liri tani, sa i madh është hendeku i çmimeve, si duken efektet e kursit të këmbimit për udhëtarët që paguajnë në monedha të ndryshme dhe si krahasohen pikat afër me mesataren kombëtare.",
  aboutDataTitle: "Nga vijnë të dhënat",
  aboutDataP1:
    "Çmimet e shfaqura në këtë faqe vijnë nga burime të dhënash publike duke përfshirë agjenci qeveritare të energjisë, zyra statistikash zyrtare dhe dataset-e të njohura industriale. Faqja i merr të dhënat në mënyrë programatike dhe i konverton në një format konsistent.",
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
    "Ne nuk marrim identifikuesin tuaj personal të reklamave drejtpërdrejt. Mund të rivendosni ose kufizoni personalizimin e reklamave përmes cilësimeve të privatësisë së shfletuesit ose pajisjes tuaj.",
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
    "Karburanti Sot është një shërbim falas dhe publik i krahasimit të çmimeve të karburantit. Mbledh të dhëna publike nga burime qeveritare dhe industriale në Europë, i konverton në format konsistent dhe i paraqet me kontekst editorial.",
  termsAccuracyTitle: "Saktësia e të dhënave dhe kufizimet",
  termsAccuracyP1:
    "Çmimet e karburantit të shfaqura janë nga dataset-e publike. Ndërsa bëjmë përpjekje të arsyeshme për saktësi dhe përditësim, nuk mund të garantojmë që çdo çmim përputhet me çmimin e saktë të pompës në çdo pikë.",
  termsAccuracyP2:
    "Shifrat në nivel vendi përfaqësojnë mesatare kombëtare ose vlera zyrtare të raportuara, jo çmime individuale pike. Taksat lokale, promocionet dhe vonesat e raportimit mund të krijojnë diferenca.",
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

  // 404 page
  notFoundTitle: "Faqja nuk u gjet",
  notFoundSubtitle: "404 — Kjo faqe nuk ekziston",
  notFoundMessage:
    "Faqja që kërkoni nuk është here. Mund të ketë qenë e lëvizur, ose mund të keni ndjekur një lidhje të pasaktë. Kthehu në faqen kryesore për të vazhduar krahasimin e çmimeve të karburantit.",
  notFoundButtonHome: "Kthehu në shtëpi",
} as const;