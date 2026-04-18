import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DISTRICTS } from '../data/districts';
import { BUSINESS_WEIGHTS, OVERLAY_MODES, CITY_VIEWS, getDisplayScore, getScoreColor, getTierInfo, CATEGORIES } from '../utils/scoring';
import { COLORS, APP_INFO, MANAGEMENT } from '../utils/constants';

export default function CardsScreen() {
  const [city, setCity] = useState('Riyadh');
  const [bizType, setBizType] = useState('Default');
  const [overlay, setOverlay] = useState('Full V&R');
  const [selectedId, setSelectedId] = useState(null);

  const weights = BUSINESS_WEIGHTS[bizType];
  const overlayKey = overlay === 'Full V&R' ? 'Full' : overlay;

  const districts = useMemo(() => {
    return DISTRICTS.filter(d => d.city === city)
      .map(d => ({ ...d, score: getDisplayScore(d, weights, overlayKey) }))
      .sort((a, b) => b.score - a.score);
  }, [city, weights, overlayKey]);

  const selected = districts.find(d => d.id === selectedId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{APP_INFO.fullName}</Text>
        <Text style={styles.headerSub}>{APP_INFO.tagline}</Text>
      </View>

      {/* City Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityBar} contentContainerStyle={{ paddingHorizontal: 12, gap: 6, alignItems: 'center' }}>
        {Object.keys(CITY_VIEWS).map(c => (
          <TouchableOpacity key={c} style={[styles.cityTab, city === c && styles.cityTabActive]} onPress={() => { setCity(c); setSelectedId(null); }}>
            <Text style={[styles.cityTabText, city === c && styles.cityTabTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Row */}
        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {Object.keys(BUSINESS_WEIGHTS).map(b => (
              <TouchableOpacity key={b} style={[styles.chip, bizType === b && styles.chipActive]} onPress={() => setBizType(b)}>
                <Text style={[styles.chipText, bizType === b && styles.chipTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {[
            { l: 'Prime', c: COLORS.prime }, { l: 'Strong', c: COLORS.strong },
            { l: 'Moderate', c: COLORS.moderate }, { l: 'Caution', c: COLORS.caution },
            { l: 'Avoid', c: COLORS.avoid },
          ].map(x => (
            <View key={x.l} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: x.c }]} />
              <Text style={styles.legendText}>{x.l}</Text>
            </View>
          ))}
        </View>

        {/* District Count */}
        <Text style={styles.countText}>{districts.length} districts scored in {city}</Text>

        {/* Cards Grid */}
        <View style={styles.grid}>
          {districts.map(d => {
            const color = getScoreColor(d.score);
            const tier = getTierInfo(d.score);
            const isSel = d.id === selectedId;
            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.card, { borderColor: isSel ? COLORS.primary : color + '44' }, isSel && styles.cardSel]}
                onPress={() => setSelectedId(d.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardCity}>{d.city}</Text>
                <Text style={styles.cardName}>{d.name}</Text>
                <Text style={styles.cardPop} numberOfLines={2}>{d.pop}</Text>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={[styles.cardScore, { color }]}>{d.score}</Text>
                    <View style={[styles.cardTier, { backgroundColor: tier.bg, borderColor: tier.border }]}>
                      <Text style={[styles.cardTierText, { color: tier.color }]}>{tier.label}</Text>
                    </View>
                  </View>
                </View>
                {/* Mini category bars */}
                <View style={styles.miniBars}>
                  {CATEGORIES.map(cat => (
                    <View key={cat.key} style={styles.miniBar}>
                      <View style={[styles.miniFill, { width: `${d.s[cat.key]}%`, backgroundColor: cat.color }]} />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ranking */}
        <View style={styles.rankingCard}>
          <Text style={styles.rankingTitle}>District Ranking — {city}</Text>
          {districts.map((d, i) => {
            const color = getScoreColor(d.score);
            return (
              <View key={d.id} style={styles.rankRow}>
                <View style={styles.rankNum}><Text style={styles.rankNumText}>{i + 1}</Text></View>
                <Text style={styles.rankName} numberOfLines={1}>{d.name}</Text>
                <View style={styles.rankBar}>
                  <View style={[styles.rankFill, { width: `${d.score}%`, backgroundColor: color }]} />
                </View>
                <Text style={[styles.rankScore, { color }]}>{d.score}</Text>
              </View>
            );
          })}
        </View>

        {/* Selected Detail */}
        {selected && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailName}>{selected.name}</Text>
                <Text style={styles.detailCity}>{selected.city} · {bizType}</Text>
              </View>
              <Text style={[styles.detailScore, { color: getScoreColor(selected.score) }]}>{selected.score}</Text>
            </View>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {CATEGORIES.map(cat => {
              const val = selected.s[cat.key];
              return (
                <View key={cat.key} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={{ fontSize: 12, color: '#334155' }}>{cat.label}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: getScoreColor(val) }}>{val}</Text>
                  </View>
                  <View style={{ height: 5, backgroundColor: COLORS.borderLight, borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${val}%`, backgroundColor: getScoreColor(val), borderRadius: 3 }} />
                  </View>
                </View>
              );
            })}
            <Text style={styles.sectionTitle}>Key Indicators</Text>
            {selected.ind.map((ind, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#3b82f6' }} />
                <Text style={{ fontSize: 12, color: '#334155' }}>{ind}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  headerSub: { color: COLORS.textMuted, fontSize: 9, marginTop: 1 },
  cityBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border, maxHeight: 44 },
  cityTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  cityTabActive: { backgroundColor: COLORS.primary },
  cityTabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  cityTabTextActive: { color: '#fff' },
  content: { flex: 1, paddingHorizontal: 16 },
  filters: { marginTop: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: '#fff' },
  legendRow: { flexDirection: 'row', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 10, color: COLORS.textSecondary },
  countText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginTop: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, padding: 12 },
  cardSel: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardCity: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardName: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
  cardPop: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, lineHeight: 14 },
  cardBottom: { marginTop: 10 },
  cardScore: { fontSize: 28, fontWeight: '900' },
  cardTier: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, alignSelf: 'flex-start', marginTop: 4 },
  cardTierText: { fontSize: 8, fontWeight: '700' },
  miniBars: { flexDirection: 'row', gap: 2, marginTop: 10 },
  miniBar: { flex: 1, height: 3, backgroundColor: COLORS.borderLight, borderRadius: 2, overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: 2 },
  rankingCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16 },
  rankingTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  rankNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  rankNumText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary },
  rankName: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.primary },
  rankBar: { width: 80, height: 5, backgroundColor: COLORS.borderLight, borderRadius: 3, overflow: 'hidden' },
  rankFill: { height: '100%', borderRadius: 3 },
  rankScore: { fontSize: 13, fontWeight: '800', width: 30, textAlign: 'right' },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  detailName: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  detailCity: { fontSize: 12, color: COLORS.textSecondary },
  detailScore: { fontSize: 36, fontWeight: '900' },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 14, marginBottom: 8 },
});
