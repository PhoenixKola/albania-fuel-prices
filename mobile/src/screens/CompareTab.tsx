import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import { useCompareModel } from "../hooks/useCompareModel";
import { formatShortDate } from "../hooks/useHomeMarket";
import type { FuelType } from "../types/fuel";
import { fuelLabel, getFuelPrice } from "../utils/fuel";
import { getFlagForCountry } from "../utils/countryFlag";
import CountrySearchModal from "../components/country/CountrySearchModal";
import ScreenTitle from "../components/ui/ScreenTitle";
import SegmentedControl from "../components/ui/SegmentedControl";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import VerdictCard from "../components/compare/VerdictCard";
import MarketLane from "../components/compare/MarketLane";
import CompareTrendCard from "../components/compare/CompareTrendCard";
import SavedComparisonsSheet from "../components/compare/SavedComparisonsSheet";
import { comparePalette, makeCompareStyles } from "../components/compare/compare.styles";
import { isTwoPaneCompare, makeCompareTabStyles } from "./CompareTab.styles";

const UNDO_MS = 6000;
const FREE_MAX_COMPARE = 3;

export default function CompareTab() {
  const ctx = useApp();
  const { theme, t } = ctx;
  const s = useMemo(() => makeCompareStyles(theme), [theme]);
  const p = useMemo(() => comparePalette(theme), [theme]);
  const layout = useMemo(() => makeCompareTabStyles(theme), [theme]);
  const reduce = theme.motion.reduced;
  const model = useCompareModel();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [setsOpen, setSetsOpen] = useState(false);
  const [removed, setRemoved] = useState<{ country: string; index: number } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }, []);

  const fuelName = fuelLabel(ctx.fuelType, t);
  const fuelItems = useMemo(
    () => [
      { value: "diesel" as FuelType, label: t.diesel },
      { value: "gasoline95" as FuelType, label: t.gasoline95 },
      { value: "lpg" as FuelType, label: t.lpg },
    ],
    [t]
  );

  const unpriced = useMemo(
    () => (ctx.data?.countries ?? []).filter((c) => getFuelPrice(c, ctx.fuelType) == null).map((c) => c.country),
    [ctx.data, ctx.fuelType]
  );

  const latest = useRef({ ctx, visible: model.visible });
  latest.current = { ctx, visible: model.visible };
  const onRemove = useCallback((country: string) => {
    const { ctx: c, visible } = latest.current;
    const index = c.compareCountries.indexOf(country);
    c.removeCompare(country);
    if (visible.includes(country)) {
      setRemoved({ country, index });
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setRemoved(null), UNDO_MS);
    }
  }, []);

  const undoRemove = () => {
    if (!removed) return;
    const current = ctx.compareCountries;
    if (!current.includes(removed.country) && current.length < ctx.maxCompare) {
      const next = [...current];
      next.splice(Math.min(removed.index, next.length), 0, removed.country);
      ctx.applyCompareSet(next);
    }
    setRemoved(null);
  };

  const applySet = (countries: string[]) => {
    const known = new Set(ctx.countries);
    const valid = Array.from(new Set(countries)).filter((c) => !ctx.data || known.has(c));
    setSetsOpen(false);
    if (!valid.length) {
      ctx.showToast(t.setUnavailable);
      return;
    }
    const applied = valid.slice(0, ctx.maxCompare);
    ctx.applyCompareSet(applied);
    if (applied.length < valid.length) ctx.showToast(t.setTrimmed(applied.length));
  };

  // Selection order, not price order, so each market keeps its colour and marker when the fuel changes.
  const trendCountries = useMemo(() => {
    const priced = new Set(model.lanes.filter((l) => l.eur != null).map((l) => l.country));
    return model.visible.filter((c) => priced.has(c));
  }, [model.lanes, model.visible]);
  const count = model.visible.length;
  const hasHidden = model.hidden.length > 0;
  const canAdd = count < ctx.maxCompare && !hasHidden;
  const canUnlock = !ctx.reward.unlocked && ctx.maxCompare <= FREE_MAX_COMPARE;

  const quickPicks = useMemo(() => {
    const picked = new Set(model.visible);
    const unpricedSet = new Set(unpriced);
    return Array.from(new Set([ctx.country, ...ctx.favorites]))
      .filter((c) => !picked.has(c) && !unpricedSet.has(c) && ctx.countries.includes(c))
      .slice(0, 6);
  }, [ctx.country, ctx.favorites, ctx.countries, model.visible, unpriced]);

  // ── Blocks ────────────────────────────────────────────────────────────────

  const status = ctx.data ? (
    <View style={s.statusRow}>
      <View style={[s.dot, { backgroundColor: ctx.error ? p.warn : p.accent }]} />
      <Text style={s.statusText}>
        {[t.pricesOf(formatShortDate(ctx.data.as_of, t)), ctx.error ? t.refreshFailed : null].filter(Boolean).join(" · ")}
      </Text>
      {ctx.error ? (
        <AnimatedPressable onPress={ctx.refreshAll} contentStyle={s.retry} haptic={false} reduceMotion={reduce} accessibilityLabel={t.tryAgain}>
          <Text style={s.retryText}>{t.tryAgain}</Text>
        </AnimatedPressable>
      ) : null}
    </View>
  ) : null;

  const fuelSelector = (
    <SegmentedControl theme={theme} value={ctx.fuelType} items={fuelItems} onChange={ctx.setFuelType} accessibilityLabel={t.selectFuel} />
  );

  const slot = canAdd ? (
    <AnimatedPressable onPress={() => setPickerOpen(true)} contentStyle={s.slot} reduceMotion={reduce} accessibilityLabel={`${t.addMarket}, ${t.marketsCount(count, ctx.maxCompare)}`}>
      <View style={s.slotIcon}><Ionicons name="add" size={22} color={p.accent} /></View>
      <View style={s.slotCopy}>
        <Text style={s.slotTitle}>{t.addMarket}</Text>
        <Text style={s.slotDetail}>{t.marketsCount(count, ctx.maxCompare)}</Text>
      </View>
    </AnimatedPressable>
  ) : !hasHidden && canUnlock ? (
    <AnimatedPressable
      onPress={() => ctx.openRewardModal(() => setPickerOpen(true))}
      contentStyle={[s.slot, s.slotLocked]}
      reduceMotion={reduce}
      accessibilityLabel={`${t.unlockMoreMarkets}, ${t.locked}`}
      accessibilityHint={t.unlockMoreDetail}
    >
      <View style={s.slotIcon}><Ionicons name="lock-closed-outline" size={20} color={p.accent} /></View>
      <View style={s.slotCopy}>
        <Text style={s.slotTitle}>{t.unlockMoreMarkets}</Text>
        <Text style={s.slotDetail}>{t.unlockMoreDetail}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={22} color={p.accent} />
    </AnimatedPressable>
  ) : !hasHidden ? (
    <View style={s.slot}>
      <View style={s.slotIcon}><Ionicons name="checkmark" size={20} color={p.inkSoft} /></View>
      <Text style={[s.slotDetail, { flex: 1 }]}>{t.allSlotsUsed(ctx.maxCompare)}</Text>
    </View>
  ) : null;

  const notices = (
    <>
      {removed ? (
        <View style={s.notice} accessibilityLiveRegion="polite">
          <View style={s.noticeRow}>
            <Ionicons name="trash-outline" size={18} color={p.inkSoft} />
            <Text style={s.noticeText}>{t.removedMarket(removed.country)}</Text>
          </View>
          <View style={s.noticeActions}>
            <AnimatedPressable onPress={undoRemove} contentStyle={s.secondaryButton} reduceMotion={reduce} accessibilityLabel={`${t.undo}, ${removed.country}`}>
              <Ionicons name="arrow-undo-outline" size={18} color={p.ink} />
              <Text style={s.secondaryText}>{t.undo}</Text>
            </AnimatedPressable>
          </View>
        </View>
      ) : null}
      {hasHidden ? (
        <View style={s.notice}>
          <View style={s.noticeRow}>
            <Ionicons name="eye-off-outline" size={18} color={p.inkSoft} />
            <Text style={s.noticeText}>{t.hiddenMarkets(model.hidden.length)}</Text>
          </View>
          <View style={s.noticeActions}>
            {canUnlock ? (
              <AnimatedPressable onPress={() => ctx.openRewardModal()} contentStyle={s.primaryButton} reduceMotion={reduce} accessibilityLabel={t.unlockMoreMarkets} accessibilityHint={t.unlockMoreDetail}>
                <Ionicons name="lock-open-outline" size={18} color={p.onAccent} />
                <Text style={s.primaryText}>{t.unlockMoreMarkets}</Text>
              </AnimatedPressable>
            ) : null}
            <AnimatedPressable onPress={() => ctx.applyCompareSet(model.visible)} contentStyle={s.secondaryButton} reduceMotion={reduce} accessibilityLabel={t.removeHidden}>
              <Text style={s.secondaryText}>{t.removeHidden}</Text>
            </AnimatedPressable>
          </View>
        </View>
      ) : null}
    </>
  );

  const board =
    count > 0 ? (
      <View style={s.board}>
        <View style={s.boardHeader}>
          <Text style={s.boardKicker} accessibilityRole="header">{t.selectedCountries}</Text>
          <Text style={s.boardCount}>{t.marketsCount(count, ctx.maxCompare)}</Text>
        </View>
        {model.lanes.map((lane, i) => (
          <MarketLane
            key={lane.country}
            lane={lane}
            order={lane.eur != null ? i + 1 : null}
            s={s}
            p={p}
            t={t}
            fuelName={fuelName}
            europeTotal={model.europeTotal}
            reduceMotion={reduce}
            fmt={model.fmt}
            fmtSigned={model.fmtSigned}
            onRemove={onRemove}
          />
        ))}
        {slot}
        {notices}
      </View>
    ) : null;

  const empty =
    count === 0 && ctx.data ? (
      <View style={s.state}>
        <View style={s.stateIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Ionicons name="git-compare-outline" size={26} color={p.accent} />
        </View>
        <Text style={s.stateTitle} accessibilityRole="header">{t.compareEmptyTitle}</Text>
        <Text style={s.stateBody}>{t.compareEmptyBody(ctx.maxCompare)}</Text>
        {quickPicks.length ? (
          <>
            <Text style={s.picksLabel}>{t.quickPicks}</Text>
            <View style={s.picks}>
              {quickPicks.map((c) => (
                <AnimatedPressable key={c} onPress={() => ctx.addCompare(c)} contentStyle={s.pick} reduceMotion={reduce} accessibilityLabel={`${t.addMarket}: ${c}`}>
                  <Text style={s.pickText}>{`${getFlagForCountry(c)} ${c}`.trim()}</Text>
                  <Ionicons name="add" size={18} color={p.accent} />
                </AnimatedPressable>
              ))}
            </View>
          </>
        ) : null}
        <AnimatedPressable onPress={() => setPickerOpen(true)} contentStyle={s.primaryButton} reduceMotion={reduce} accessibilityLabel={t.addMarket}>
          <Ionicons name="add" size={20} color={p.onAccent} />
          <Text style={s.primaryText}>{t.addMarket}</Text>
        </AnimatedPressable>
        {notices}
      </View>
    ) : null;

  const loadingOrError = !ctx.data ? (
    ctx.loading ? (
      <View style={s.deck} accessible accessibilityRole="progressbar" accessibilityLabel={t.loadingPrices}>
        <View style={[s.module, s.skeletonModule]}>
          <View style={[s.skeletonBar, { width: "40%" }]} />
          <View style={[s.skeletonBar, { width: "70%", height: 22 }]} />
          <View style={[s.skeletonBar, { width: "35%", height: 38 }]} />
        </View>
      </View>
    ) : (
      <View style={s.state}>
        <View style={s.stateIcon}><Ionicons name="cloud-offline-outline" size={26} color={p.accent} /></View>
        <Text style={s.stateTitle} accessibilityRole="header">{t.couldntLoad}</Text>
        <Text style={s.stateBody}>{t.dataUnavailable}</Text>
        <AnimatedPressable onPress={ctx.refreshAll} contentStyle={s.primaryButton} reduceMotion={reduce} accessibilityLabel={t.tryAgain}>
          <Ionicons name="refresh" size={19} color={p.onAccent} />
          <Text style={s.primaryText}>{t.tryAgain}</Text>
        </AnimatedPressable>
      </View>
    )
  ) : null;

  const verdict =
    ctx.data && count > 0 ? (
      <VerdictCard
        s={s}
        p={p}
        t={t}
        fuelName={fuelName}
        selectedCount={count}
        cheapest={model.cheapest}
        dearest={model.dearest}
        spreadEur={model.spreadEur}
        pricedCount={model.pricedCount}
        fmt={model.fmt}
      />
    ) : null;

  const trend = ctx.data ? (
    <CompareTrendCard
      s={s}
      p={p}
      t={t}
      trends={ctx.trends}
      countries={trendCountries}
      fuelType={ctx.fuelType}
      reduceMotion={reduce}
      fmt={model.fmt}
      fmtSigned={model.fmtSigned}
    />
  ) : null;

  const savedButton = ctx.data ? (
    <AnimatedPressable onPress={() => setSetsOpen(true)} contentStyle={s.secondaryButton} reduceMotion={reduce} accessibilityLabel={t.savedComparisons}>
      <Ionicons name="bookmarks-outline" size={19} color={p.ink} />
      <Text style={s.secondaryText}>{t.savedComparisons}</Text>
    </AnimatedPressable>
  ) : null;

  const refreshControl = <RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} tintColor={p.accent} colors={[p.accent]} />;

  const overlays = (
    <>
      <CountrySearchModal
        theme={theme}
        open={pickerOpen}
        title={t.addMarket}
        placeholder={t.searchPlaceholder}
        closeLabel={t.close}
        selectedLabel={t.selected}
        saveLabel={t.saveMarketA11y}
        unsaveLabel={t.unsaveMarketA11y}
        countries={ctx.countries}
        value=""
        favorites={ctx.favorites}
        onToggleFavorite={ctx.toggleFavorite}
        added={model.visible}
        addedLabel={t.added}
        unavailable={unpriced}
        unavailableLabel={t.fuelNotReported(fuelName)}
        emptyLabel={t.noCountryResults}
        onClose={() => setPickerOpen(false)}
        onSelect={(c) => {
          ctx.addCompare(c);
          setPickerOpen(false);
        }}
      />
      <SavedComparisonsSheet
        theme={theme}
        t={t}
        s={s}
        p={p}
        open={setsOpen}
        current={model.visible}
        onApply={applySet}
        onSaved={(name) => ctx.showToast(t.setSaved(name))}
        onClose={() => setSetsOpen(false)}
      />
    </>
  );

  if (isTwoPaneCompare(theme) && ctx.data && count > 0) {
    return (
      <View style={layout.screen}>
        <ScrollView contentContainerStyle={layout.wideContent} showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
          <ScreenTitle theme={theme} title={t.compareTitle} />
          {status}
          <View style={layout.panes}>
            <View style={layout.pane}>
              {fuelSelector}
              {verdict}
              {board}
              {savedButton}
            </View>
            <View style={layout.pane}>{trend}</View>
          </View>
        </ScrollView>
        {overlays}
      </View>
    );
  }

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={refreshControl}>
        <ScreenTitle theme={theme} title={t.compareTitle} />
        {status}
        {ctx.data ? fuelSelector : null}
        {loadingOrError}
        {verdict}
        {board}
        {empty}
        {trend}
        {savedButton}
      </ScrollView>
      {overlays}
    </View>
  );
}
