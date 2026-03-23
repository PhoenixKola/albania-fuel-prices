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
    "Të dhënat e çmimeve nuk janë ende të disponueshme. Sapo të lidhen rreshtat e çmimeve sipas vendeve, kjo pjesë do t'i kthejë numrat live në një përmbledhje të shkurtër editoriale me përfundime të dobishme.",
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

  sourceUpdatedLabel: "Përditësuar",
  sourceCardSubtitle: "Informacion mbi burimin dhe si duhen interpretuar këto shifra të karburantit.",
  sourceCardInterpretationNote:
    "Shifrat në këtë faqe duhen lexuar si krahasim praktik i të dhënave publike të karburantit, jo si garanci për çmimin e saktë në çdo pikë. Pikat lokale, taksat, koha e raportimit dhe efekti i kursit të këmbimit mund të ndryshojnë rezultatin final.",
  sourceCardMethodologyNote:
    "Metodologjia: faqja krahason çmimet e karburantit në nivel vendi dhe i paraqet në një formë më të thjeshtë për planifikim udhëtimi, krahasim dhe vlerësim të kostove. Këto shifra janë më të dobishme si orientim tregu.",
  sourceUrlLabel: "URL",
} as const;