# KARBURANTI SOT — NATIVE MOBILE DNSE HOME IMPLEMENTATION PROMPT

## Objective

Implement **one focused DNSE opening/home upgrade** for the existing native **Karburanti Sot Expo / React Native app**.

This is the MOBILE counterpart to the web concept:

> # THE FUEL BECOMES THE JOURNEY

However:

> **Do NOT copy the web hero into the app.**

The native app currently opens directly into useful market data via `FuelDeck`, `HomeActions`, saved markets, and `MarketPulse`.

That utility-first structure is good.

The job is to add a **short, native, touch-friendly signature opening/home stage** that makes the app feel distinctive and premium, then hands immediately into the existing `FuelDeck`.

The mobile experience should communicate:

> A fuel pulse becomes the road and arrives at the selected market — then the real price data takes over.

This must feel designed specifically for iOS/Android.

---

# ABSOLUTE WORKFLOW RULES

## DO NOT COMMIT / PUSH / DEPLOY / BUILD A RELEASE

For this task:

- **DO NOT run `git commit`**
- **DO NOT run `git push`**
- **DO NOT create a tag/release**
- **DO NOT run an EAS production build**
- **DO NOT submit anything to stores**
- leave all intended changes in the working tree for owner review

At the end, report:

1. files changed
2. packages added/removed
3. what was implemented
4. phone/tablet behavior
5. light/dark behavior
6. reduced-motion behavior
7. quick checks run
8. known limitations
9. current `git status`

---

# DO NOT WASTE HOURS TESTING

This is one focused visual implementation.

The owner will do the real visual testing afterward.

Do **not** run broad device farms, complete platform matrices, long EAS builds, or unrelated regression suites.

After implementation, do only:

```text
implementation
→ npx tsc --noEmit
→ quick Expo/local sanity check if available
→ inspect one normal phone layout
→ inspect one small-phone/large-text risk area if readily possible
→ inspect one tablet layout if readily possible
→ stop and report
```

If there is no emulator/device available, do not burn time trying to create a full test environment.

Report that visual runtime verification is pending owner review.

---

# INSPECT THE CURRENT MOBILE APP FIRST

Before editing, inspect at minimum:

- `mobile/src/screens/HomeTab.tsx`
- `mobile/src/screens/HomeTab.styles.ts`
- `mobile/src/components/home/FuelDeck.tsx`
- `mobile/src/components/home/HomeActions.tsx`
- `mobile/src/components/home/SavedMarketsRail.tsx`
- `mobile/src/components/home/MarketPulse.tsx`
- `mobile/src/components/home/PriceNumeral.tsx`
- `mobile/src/components/home/homePalette.ts`
- `mobile/src/theme/theme.ts`
- `mobile/src/context/AppContext.tsx`
- `mobile/src/hooks/useHomeMarket.ts`
- `mobile/src/i18n/index.ts`
- `mobile/package.json`

Understand the current responsive metrics:

- `isSmall`
- `isTablet`
- `isLandscape`
- `isLargeText`
- `isXLText`
- `maxContentWidth`
- reduced-motion support

Preserve them.

---

# CURRENT MOBILE PRODUCT TRUTH

The app is not a marketing website.

The user opens it to get useful information quickly.

Current home hierarchy is roughly:

```text
brand / reward chip
→ FuelDeck
→ actions
→ saved markets
→ MarketPulse
→ source/sync
```

This is good.

Do not insert a huge decorative intro that makes a user scroll past useful fuel data every time.

The DNSE layer should make the app feel alive while respecting frequent-use behavior.

---

# MOBILE DNSE CONCEPT

# “FUEL PULSE → ROAD → YOUR MARKET”

The mobile version is a **compact cinematic instrument**, not a mini WebGL website.

Use a short scene at the top of Home that visually links the brand to the market data below.

Core sequence:

```text
fuel pulse forms
→ moves through a short flow channel
→ channel transforms into road
→ selected market marker locks in
→ road visually connects into FuelDeck
→ live price becomes dominant
```

The key idea is continuity:

> the animation should feel as though it delivers the current market price into the existing `FuelDeck`.

---

# IMPORTANT: DO NOT FORCE HEAVY WEBGL INTO REACT NATIVE

The web version may justify R3F/Three.js.

The native mobile app should prioritize:

- fast launch
- battery
- smooth scrolling
- simple dependencies
- native touch response
- reliability across iOS/Android

Prefer:

- React Native `Animated`
- `react-native-svg` — already installed
- `expo-linear-gradient` where physically justified
- existing theme/motion system
- existing haptics
- optional `react-native-reanimated` only if it materially simplifies/smooths the choreography

Do not add Expo GL / Three.js / native WebGL unless you prove it is clearly worth the complexity and does not destabilize Expo 54.

A convincing **2.5D perspective/SVG/native animation** is preferred over a fragile heavy 3D stack.

The mobile concept still needs depth, choreography and physicality — just achieved natively.

---

# FIRST-LAUNCH VS REPEAT-LAUNCH BEHAVIOR

This app may be opened frequently.

Do not replay a long cinematic sequence every time the user returns to Home.

Preferred behavior:

## First meaningful app/home appearance

Play the full signature sequence once.

Target approximately:

**0.9–1.4 seconds**

## Subsequent returns during the same session

Use either:

- immediate resolved state
- or a tiny 150–250ms settle

Do not repeatedly interrupt the user.

If a simple session/local flag is needed, keep it lightweight.

Do not create complicated persistence just for the animation.

---

# MOBILE OPENING CHOREOGRAPHY

## Stage 1 — pulse

At the top of the Home screen, under/around the brand row, create a compact cinematic stage.

A small fuel-energy pulse appears.

Visual direction:

- deep graphite/ink surface in dark mode
- warm technical paper/road surface in light mode
- teal/emerald Karburanti accent
- restrained amber energy highlight
- physical line/road depth
- no glow blob background

The pulse should feel integrated into the app's current palette.

---

## Stage 2 — flow channel becomes road

A short line grows from the pulse.

The important transformation:

```text
fuel flow line
→ lane edges resolve
→ center lane marking appears
→ perspective widens
→ now it reads as a road
```

This can be done with:

- SVG paths
- clipping/masks
- perspective transforms
- animated stroke
- native views

Do not simply crossfade two illustrations.

The viewer should perceive one thing becoming the other.

---

## Stage 3 — selected market locks in

At the end of the road, the current selected market appears.

Use real current context:

- country flag
- market name
- selected fuel
- selected current price if available

Example conceptual marker:

```text
🇦🇱
Albania
Diesel
€X.XXX/L
```

Use the existing `ctx.country`, `ctx.fuelType`, and `useHomeMarket()` values.

Never hardcode fake prices.

If data is loading, show a designed loading/resolved skeleton state instead of fabricated values.

---

## Stage 4 — handoff into FuelDeck

The market marker then visually travels/aligns downward into the existing `FuelDeck`.

The best version makes it feel as if the scene **delivers the current price into the deck**.

Possible sequence:

```text
market marker settles
→ road terminus aligns with deck
→ deck module wakes
→ PriceNumeral resolves
→ scene becomes quiet
```

Do not fully rewrite `FuelDeck` unless needed.

Prefer evolving its entry relationship and perhaps one top-edge/route motif.

The existing market controls and price interaction remain the real app.

---

# HOME LAYOUT AFTER THE ANIMATION

Once settled, the app must remain compact.

Recommended mobile order:

```text
brand / reward
signature road stage
FuelDeck
HomeActions
SavedMarkets
MarketPulse
source/sync
```

The signature stage should not make the user scroll an extra screen before seeing the price.

Aim for roughly:

- **120–180pt height** on ordinary phones after settle
- smaller on compact phones
- intentionally larger/more spatial on tablets if it improves balance

If a stronger integration makes the signature stage partially overlap/merge with the top of `FuelDeck`, that is welcome.

---

# COUNTRY CHANGE RESPONSE

When the user changes the selected market:

Do not replay the full launch animation.

Use a short transition:

```text
old market marker releases
→ road endpoint shifts
→ new flag/market locks in
→ FuelDeck performs its existing fade/price update
```

Target roughly **180–300ms**.

Keep current data interactions immediate.

Use existing haptics where appropriate.

Do not trigger haptics continuously during animation.

---

# FUEL-TYPE CHANGE RESPONSE

When Petrol/Diesel/LPG changes:

Use one tiny physical response:

- accent/pulse hue changes subtly, OR
- one lane segment lights, OR
- the marker's fuel label locks in, OR
- a short fuel pulse travels into the deck

Do not replay the whole road animation.

Do not delay price update.

---

# TOUCH INTERACTION

The mobile scene should not require hover.

Possible touch behavior after settle:

- a short tap on the market marker opens the same country-selection flow, if this mapping is intuitive and accessible
- or keep the scene non-interactive and let `FuelDeck` remain the primary control

Do not invent duplicate controls unless they clearly improve usability.

If the scene has a tappable object, it needs:

- proper accessibility role
- label
- 44pt-ish target
- pressed feedback

---

# HAPTICS

Haptics may reinforce **one or two meaningful moments**.

Examples:

- very light selection haptic when market locks in after a user-initiated country change
- light haptic when a fuel choice locks

Do not fire haptics during automatic launch choreography.

Do not make the opening vibrate the phone.

---

# VISUAL DIRECTION

Target:

- premium travel/fuel instrument
- minimal roadside depth
- strong number typography
- crisp lane/route geometry
- tactile physicality
- restrained material
- high contrast
- clean mobile information density

Avoid:

- fake 3D floating phone mockups
- spinning gas pump
- giant globe
- neon cyberpunk
- glass card stack
- particle rain
- random parallax
- blurred radial orbs
- gradient blobs
- fake speedometers
- fake analytics
- large decorative illustration that pushes the real price below the fold

The app should still feel like a **tool**, just one with a memorable identity.

---

# LIGHT MODE

Current light palette is warm/paper-like.

Use it.

Think:

- warm roadside/technical paper
- dark ink
- deep teal
- restrained physical shadows
- road/lane geometry
- no washed-out teal-on-white
- no generic pastel gradients

---

# DARK MODE

Think:

- deep road/night ink
- graphite
- teal route illumination
- warm bright numeric text
- restrained amber highlight
- physical dark surfaces

Do not make everything glow.

---

# RESPONSIVENESS / DEVICE ADAPTATION IS MANDATORY

This is part of the implementation.

The app already has thoughtful metrics. Use them.

Handle:

## Small phones

For `theme.m.isSmall`:

- shorten the road stage
- reduce decorative depth
- keep price visible quickly
- avoid large top whitespace
- no clipped flag/price marker
- keep `FuelDeck` readable

## Normal phones

This is the primary experience.

The complete compact choreography should be visible and smooth.

## Large text / accessibility font scaling

For `isLargeText` / `isXLText`:

- do not overlay text on moving geometry
- allow market marker labels to wrap/stack
- shrink/remove decorative labels before shrinking user text
- never clip live price
- keep interactive controls reachable

## Landscape phones

Do not let the signature stage consume most vertical height.

Use a compact horizontal variant or reduce it substantially.

## Tablets

The existing app can become two-column.

The DNSE stage should adapt intentionally:

Possible tablet direction:

```text
left:
FuelDeck + actions

right/top:
larger road/market scene integrated with MarketPulse
```

OR retain the current two-column logic and give the signature stage a wider, more cinematic route above both columns.

Choose whichever fits the existing architecture with less disruption.

Do not simply stretch the phone animation to 1000px.

---

# REDUCED MOTION

The app already exposes `theme.motion.reduced`.

Use it.

Reduced-motion behavior:

- render the final resolved road/market composition immediately
- do not run long stroke/camera transitions
- no parallax
- no repeated pulsing
- keep all real price data/control behavior unchanged

The resolved still state should still look intentional.

---

# PERFORMANCE

Native performance matters more than showing off.

Required:

- avoid JS animation loops that constantly re-render React trees
- prefer native-driver-compatible transforms/opacity where possible
- SVG path animation should remain lightweight
- stop animation once settled
- no perpetual high-frequency effects
- no giant raster sequences
- no large 3D assets unless absolutely justified
- preserve smooth ScrollView behavior
- avoid memory-heavy hidden layers
- avoid battery-draining continuous animation

Once the opening is finished, the app should essentially return to normal low-cost UI behavior.

---

# DATA / OFFLINE / LOADING SAFETY

The signature experience must handle:

- data available
- loading
- cached data
- refresh failure
- no selected price
- local-currency unavailable path
- offline/cached usage if supported by current context

Never show fabricated values to make the scene prettier.

If current price is unavailable:

- marker can show the market/fuel
- price area should use the established not-reported/loading language
- the visual should still resolve gracefully

Do not block the existing error card or retry flow.

---

# LOCALIZATION

Preserve both English and Albanian.

Add any new customer-facing strings through `mobile/src/i18n/index.ts`.

Do not hardcode visible copy.

Keep labels concise enough for mobile.

---

# ACCESSIBILITY

Do not sacrifice accessibility for spectacle.

Required:

- screen-reader users can still reach the real FuelDeck immediately
- decorative scene can be `accessible={false}` if it conveys no unique action
- if market marker becomes a control, expose proper role/label/state
- large text remains usable
- reduced motion works
- contrast remains strong
- no essential meaning exists only in animation
- no tiny touch targets

Consider announcing nothing during the automatic intro; avoid noisy accessibility output.

---

# DO NOT BREAK EXISTING HOME FEATURES

Preserve:

- country switching
- favourites
- fuel switching
- price alert
- share
- compare
- saved markets
- market pulse
- refresh
- data source/sync
- reward/extras behavior
- ads behavior
- current navigation

Do not redesign the entire Home tab.

Do not change business logic unless required for clean integration.

---

# SUGGESTED COMPONENT APPROACH

A clean implementation may introduce something like:

```text
mobile/src/components/home/FuelJourneyIntro.tsx
mobile/src/components/home/FuelJourneyIntro.styles.ts
```

Possible props:

```text
theme
country
flag
fuelType
fuelName
price
loading
onSettled?
```

Then `HomeTab` remains the orchestrator.

Do not force this exact API if the existing architecture suggests something cleaner.

---

# FAIL CONDITIONS

The task is not complete if:

- it is just a logo animation
- it is a mini copy of the desktop WebGL hero
- it adds a huge illustration above the real price
- it replays a long animation every time Home appears
- it uses fake price data
- it breaks small phones
- it breaks tablet two-column logic
- it clips under large accessibility text
- it runs perpetual animation after settle
- it significantly hurts scroll performance
- it requires hover
- it looks like generic fintech/crypto
- the signature idea cannot be described as “fuel becomes the road and arrives at my market”

The result should feel:

> **fast enough for a utility app, distinctive enough to remember.**

---

# FINAL QUICK CHECK

After implementation:

```bash
cd mobile
npx tsc --noEmit
```

If a local Expo runtime is already available, do one quick sanity launch.

Do not spend hours repairing unrelated environment/emulator issues.

Visually sanity-check when possible:

- small/normal phone
- tablet or wide layout
- light
- dark
- reduced motion

Then stop.

---

# FINAL REPORT

Return:

```text
MOBILE DNSE HOME COMPLETE

Files changed:
...

Packages:
...

Implemented:
...

Phone behavior:
...

Tablet behavior:
...

Large text / landscape:
...

Light / dark:
...

Reduced motion:
...

Checks:
- TypeScript:
- quick runtime sanity:

Known items for owner visual review:
...

git status:
...
```

Do not commit, push, deploy, or create an EAS release.
