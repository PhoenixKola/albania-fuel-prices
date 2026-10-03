# KARBURANTI SOT — WEB DNSE HERO IMPLEMENTATION PROMPT

## Objective

Implement **one focused hero-only DNSE redesign** for the existing **Karburanti Sot / Albania Fuel Prices WEB application**.

The website is already substantially built and working. This is **not** a full redesign, architecture rewrite, or broad polish pass.

The goal is to turn the first viewport into a genuinely memorable, futuristic, dimensional experience while preserving the real product below it.

The signature premise is:

> # THE FUEL BECOMES THE JOURNEY

The visitor should understand the core idea even without reading the copy:

> A fuel pulse leaves the pump, transforms into the road, crosses market/price points, and resolves into the real interactive roadside price board.

This is a **Domain-Native Signature Experience (DNSE)**. It must express what Karburanti Sot actually does. Do not create a generic “3D fuel pump next to headline” hero.

---

# ABSOLUTE WORKFLOW RULES

## DO NOT COMMIT / PUSH / DEPLOY

For this task:

- **DO NOT run `git commit`**
- **DO NOT run `git push`**
- **DO NOT create a tag/release**
- **DO NOT deploy**
- leave all intended changes in the working tree for owner review

At the end, report only:

1. files changed
2. packages added/removed
3. what was implemented
4. responsive behavior
5. reduced-motion/fallback behavior
6. quick checks run
7. known limitations or visual decisions needing review
8. current `git status`

---

# DO NOT WASTE HOURS TESTING

This is deliberately a **fast, focused implementation pass**.

The owner will perform the detailed visual review afterward.

Do not run a giant regression matrix, full Playwright suite, every route, or exhaustive screenshot campaign.

After implementation, do only sensible quick checks:

```text
implementation
→ npm run lint
→ npm run build:vite
→ quick visual sanity check around ~390px
→ quick visual sanity check around ~768px
→ quick visual sanity check around ~1366px
→ stop and report
```

Run the full `npm run build` only if the change touches prerender behavior or if `build:vite` reveals a reason to verify the full pipeline.

Do not run `npm run test:browser` unless a concrete issue requires it.

---

# INSPECT THE CURRENT IMPLEMENTATION FIRST

Before editing, inspect at minimum:

- `web/src/pages/HomePage.tsx`
- `web/src/components/content/HeroIntro.tsx`
- `web/src/styles/home-signature.css`
- `web/src/styles/home.css`
- `web/src/locales/en.ts`
- `web/src/locales/sq.ts`
- `web/src/locales/index.ts`
- current theme handling
- current `HomeHeroModel`
- current market/country selector
- current fuel selector
- current price/freshness/source logic
- `web/package.json`
- Vite/prerender setup

The existing hero already carries real product value. Preserve:

- selected market/country
- selected fuel type
- real current/reference price
- Europe ranking
- difference from European average
- 7-day movement
- freshness/date
- provenance/source
- country selector
- petrol/diesel/LPG selector
- trip calculator CTA
- stations CTA
- compare/rankings quick links

**Do not replace real values with fake cinematic numbers.**

---

# CURRENT PRODUCT TRUTH

Karburanti Sot is an independent practical fuel-price and travel-cost utility.

It helps users:

- compare petrol, diesel and LPG prices
- compare Albania with European markets
- understand data freshness
- calculate trip fuel costs
- compare countries
- find fuel stations
- inspect rankings and market movement

The hero concept must therefore connect:

```text
FUEL
→ PRICE
→ MARKET
→ ROAD
→ TRIP DECISION
```

The experience should make the existing “journey starts here” idea physically believable.

---

# SIGNATURE HERO CONCEPT

## “THE FUEL BECOMES THE JOURNEY”

This is the hero's entire premise.

A visitor lands on the homepage.

A high-quality dimensional fuel/nozzle environment appears.

A small fuel-energy pulse forms.

It leaves the nozzle.

The same flow channel transforms into a road.

The road moves through market/price points.

The selected market locks in.

That spatial market marker then resolves into the existing interactive **Roadside Price Board**.

The cinematic scene must hand off seamlessly into useful real DOM controls.

Do not make the 3D scene an unrelated background.

---

# DESKTOP OPENING CHOREOGRAPHY

Target roughly **1.8–2.8 seconds** total.

Do not artificially delay usable content.

The text/CTA may begin becoming interactive while the final visual settles.

## Scene 1 — Fuel source

The opening should feel premium and restrained.

Visual direction:

- graphite / dark technical material
- restrained metallic detail
- deep Karburanti green
- small warm amber fuel-energy accent
- physically motivated light
- real depth
- no generic glow blobs
- no cyberpunk HUD spam
- no spinning globe

A stylized fuel nozzle/pump assembly comes into focus.

A small liquid/energy pulse forms at the nozzle.

This should read as **fuel/energy**, not as a random neon sphere.

---

## Scene 2 — Flow becomes road

The pulse leaves the nozzle through a short dimensional channel.

The key DNSE moment:

> **the same channel physically changes into the road**

Possible transformation:

```text
fuel hose / flow channel
→ flattens
→ widens
→ lane edges resolve
→ center markings appear
→ road extends into perspective
```

Do not crossfade from one unrelated asset to another.

Object continuity is essential.

---

## Scene 3 — Market / price points

The road extends into depth.

A small number of real market markers rise from the route.

Do not create a huge literal Google-map experience.

The visual should feel like a premium travel instrument.

Where practical, use real current project data for visible labels.

Possible selected/contextual markers:

```text
AL
€X.XXX/L

XK
€X.XXX/L

GR
€X.XXX/L
```

Rules:

- never fabricate live prices
- never imply station-level precision
- preserve the existing national-reference framing
- keep provenance/date truth visible
- use only markets available in the current dataset
- do not overfill the scene with every European country

The selected market should be the clear destination.

---

## Scene 4 — Market becomes the real price board

The fuel pulse reaches the selected market.

The road/marker aligns toward the camera.

The selected marker transforms into the existing `homeRoadBoard`.

Suggested continuity:

```text
market marker rises
→ gains dimensional panel depth
→ country identity resolves
→ fuel rows materialize
→ ranking / average / 7-day indicators settle
→ date + source become readable
```

The final interactive board should be real accessible DOM.

Do not put critical controls only inside WebGL.

---

# FINAL DESKTOP HERO STATE

After the opening, the hero becomes calm.

Suggested structure:

```text
LEFT / FOREGROUND
- eyebrow/freshness
- headline
- short supporting copy
- primary CTA
- secondary CTA
- quick links
- scope/disclaimer

CENTER / RIGHT
- dimensional route/fuel scene
- real interactive Roadside Price Board
```

The opening may briefly feel more immersive/full-stage before resolving to this usable composition.

Do not preserve the current exact grid if that prevents the scene from feeling exceptional.

But keep the rest of the homepage below the hero essentially untouched.

---

# LIVE BOARD INTERACTION AFTER THE INTRO

The existing price board is useful and should remain useful.

Changing market or fuel should create a **small physical consequence**.

## Market change

Suggested response:

```text
old marker disengages
→ route alignment shifts
→ new marker locks in
→ board values resolve
```

Keep it fast.

Do not replay the entire opening.

## Fuel-type change

Use one restrained response such as:

- pulse/material hue shifts slightly
- selected fuel row mechanically locks in
- one price/value settle
- route illumination responds once

Again: product speed wins over animation.

---

# POINTER RESPONSE

After settle, fine-pointer devices may get subtle physical response.

Allowed:

- tiny camera/parallax movement
- small road-depth shift
- subtle material reflection
- active marker reacting fractionally

Avoid:

- whole hero following the cursor
- float/bob loops
- card tilt everywhere
- orbiting objects
- cursor particles
- giant pointer-following glow

This should feel like a physical instrument, not an animation playground.

---

# CTA RELATIONSHIP

The hero's primary CTA is the trip calculator.

On hover/focus:

- illuminate the road ahead slightly
- move the fuel pulse a small distance forward
- reveal a restrained destination/route cue

The interaction should imply:

> “Turn this price into your real trip cost.”

For the stations CTA, a single roadside/station marker may wake up.

Keep both effects brief.

---

# VISUAL DIRECTION

Target:

- premium automotive/travel instrumentation
- cinematic roadside depth
- precise physical material
- strong typography
- clean information hierarchy
- real data as part of the visual language
- physically motivated lighting
- restrained, deliberate motion

Avoid:

- crypto/Web3 aesthetics
- sci-fi dashboard noise
- neon city scenes
- giant glass cards
- floating cards
- hologram clichés
- fake gauges
- fake analytics
- random particles
- lens-flare overload
- decorative radial/circular gradient blobs
- rotating pump model with no narrative
- giant 3D Europe globe
- generic map with glowing dots

The final result must still feel unmistakably like **Karburanti Sot**.

---

# REMOVE THE CURRENT GENERIC HERO BACKGROUND FILLER

The current hero uses decorative radial/repeating-radial treatment.

For this hero redesign, remove/replace that decorative treatment.

Atmosphere should come from:

- actual depth
- road geometry
- physical material
- real 3D lighting
- type/composition
- meaningful fuel/route illumination

Do not replace the radial pattern with another generic glow orb.

---

# TECHNOLOGY

You are explicitly allowed to add libraries if the concept needs them.

Strong candidate stack:

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `gsap` if timeline choreography is materially better with it

Use only what is actually useful.

Recommended architecture is hybrid:

```text
WEBGL / R3F
- nozzle / fuel pulse
- route transformation
- market depth
- physical lighting

DOM
- headline/copy
- CTAs
- price board
- country selector
- fuel selector
- freshness/source
```

Do not move accessible product UI into canvas unnecessarily.

Do not reject the design because the repo currently has no WebGL dependency.

Also do not introduce a massive 3D stack merely to tick a “3D” box.

---

# 3D ASSET RULE

If a custom asset is required, acceptable approaches include:

- simple procedural Three.js geometry
- optimized GLB/glTF
- deliberately modeled nozzle/pump element
- lightweight baked material

Do not download a random low-quality stock gas pump and make it the centerpiece.

If external assets are used:

- verify licensing
- document attribution if required
- optimize geometry/textures
- do not ship huge assets

The choreography/premise matters more than mesh complexity.

---

# PERFORMANCE

This is still a utility website.

Required:

- keep text/CTA fast
- lazy/defer expensive 3D code when practical
- cap DPR if necessary
- stop/pause scene activity when hero leaves the viewport
- prefer demand-driven rendering after settle
- keep textures/models disciplined
- avoid heavy postprocessing
- avoid continuous expensive shaders
- no large unnecessary video fallback
- avoid layout shift
- keep the board interactive even if the scene has not fully loaded

WebGL must enhance the product, not dominate page weight.

---

# PRERENDER / SEO SAFETY

The web project has a custom Vite/prerender/static HTML pipeline.

Do not break it.

Preserve:

- meaningful static H1
- supporting copy
- real CTA links
- SEO metadata
- prerender generation
- route architecture

The 3D scene is progressive enhancement.

Do not require browser/WebGL APIs during Node prerender.

Safely isolate client-only behavior.

---

# RESPONSIVENESS IS MANDATORY

This is part of the implementation.

Do not build the desktop scene and simply shrink it.

Quickly validate approximately:

- **390px mobile**
- **768px tablet**
- **1366px desktop**

A 1440/1920 sanity glance is fine if convenient, but do not turn it into a large testing pass.

---

# WEB — DESKTOP

At desktop widths:

- show the full fuel → road → market transformation
- use meaningful depth
- board remains large and practical
- headline remains prominent
- scene must not cover navigation or CTA hit areas
- no horizontal overflow
- no giant empty cinematic viewport
- final state should feel like a premium instrument, not a game

---

# WEB — TABLET

Tablet gets an intentional composition.

Possible direction:

```text
copy / actions above
↓
shortened route scene
↓
full usable price board
```

Requirements:

- fewer market markers
- reduced camera travel
- less pointer dependence
- no clipped board
- intentional portrait/landscape behavior

---

# WEB — MOBILE

The responsive web homepage must also work beautifully around 390px.

Do not try to render the full desktop scene at tiny scale.

Suggested mobile choreography:

```text
fuel pulse forms
→ short flow line
→ line becomes a road
→ selected market marker rises
→ board resolves
```

Target around **1–1.5 seconds**.

Priorities:

1. title
2. primary CTA
3. selected market + price
4. concise signature animation
5. usable fuel/country controls
6. freshness/source

No hover dependency.

No excessive hero height.

No page-level horizontal overflow.

---

# REDUCED MOTION

Respect `prefers-reduced-motion`.

Reduced-motion users should immediately receive the resolved hero:

- final road/nozzle composition
- price board visible
- text/CTA visible
- no long camera travel
- no racing pulse
- no parallax
- all information usable

Do not hide the hero.

---

# WEBGL FAILURE / LOW-CAPABILITY FALLBACK

If WebGL/model loading fails:

- preserve the real DOM hero
- show a prepared static/2D route/nozzle composition or simple SVG/CSS alternative
- keep board/selectors/CTAs fully usable

A 3D failure must never break fuel-price access.

---

# THEMES

Preserve light and dark mode.

## Dark

Think:

- night-road instrumentation
- graphite
- emerald route/fuel energy
- warm off-white text
- restrained amber accents

## Light

Do not merely invert.

Think:

- daylight roadside/technical surface
- warm pale material
- dark ink
- deep green accents
- physical shadows/depth

Tune 3D lighting/materials intentionally for both.

---

# LOCALIZATION

Preserve both English and Albanian.

Do not hardcode new customer-facing strings in the component.

Add any required strings to the established locale system.

Do not degrade current translation parity.

---

# ACCESSIBILITY

Required:

- semantic H1 remains
- real links remain links
- price board stays keyboard accessible
- fuel buttons retain correct pressed/selected semantics
- country selector remains accessible
- scene itself should be decorative unless it exposes a real control
- no essential information conveyed only through 3D motion
- focus states remain visible
- reduced-motion path remains fully usable

---

# OUT OF SCOPE

Do not redesign:

- FuelPulse section
- travel links
- decision rail
- calculator
- story/editorial section
- transparency/source section
- footer
- compare page
- rankings
- stations
- navigation architecture
- ingestion/data model

Only touch those areas if a tiny compatibility fix is required for the new hero.

---

# FAIL CONDITIONS

The task is **not complete** if the result is merely:

- the current hero plus a spinning gas pump
- the current board with stronger shadow
- one 3D object floating beside copy
- generic parallax
- a glowing Europe map
- a particle field
- a cinematic intro disconnected from the real board
- a desktop-only effect that breaks at tablet/mobile
- a WebGL demo that harms load time
- fake data
- inaccessible canvas controls
- broken prerender
- a hero that cannot function when motion/WebGL is unavailable

The success test is:

> Can someone describe the hero as “the fuel becomes the road, moves through markets, and becomes the real price board”?

If yes, the concept is present.

If they can only say “it has cool 3D,” it is not finished.

---

# FINAL REPORT

Stop after the focused implementation and quick checks.

Report:

```text
WEB DNSE HERO COMPLETE

Files changed:
...

Packages:
...

Implemented:
...

Responsive:
- 390:
- 768:
- 1366:

Reduced motion / fallback:
...

Checks:
- lint:
- build:vite:
- quick visual sanity:

Known items for owner visual review:
...

git status:
...
```

Do not commit or push.
