import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, APP_INFO, MANAGEMENT } from '../utils/constants';
import { DATA_SOURCES } from '../utils/scoring';
import { DISTRICTS } from '../data/districts';

export default function AboutScreen() {
  const cityCount = [...new Set(DISTRICTS.map(d => d.city))].length;
  const districtCount = DISTRICTS.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Ionicons name="analytics" size={36} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{APP_INFO.fullName}</Text>
          <Text style={styles.heroVersion}>Version {APP_INFO.version}</Text>
        </View>

        {/* What It Does */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is RE Intelligence?</Text>
          <Text style={styles.bodyText}>
            RE Intelligence is an institutional-grade location intelligence platform that helps business owners, investors, and developers make data-driven go/no-go investment decisions at the district and street level.
          </Text>
          <Text style={styles.bodyText}>
            Using our proprietary V&R Milestone methodology, we score every district across {cityCount} global cities on 38 indicators drawn from 4 locked institutional data sources. Each district receives a composite score (0-100) across 5 weighted categories, giving you a clear picture of where to invest — and where to avoid.
          </Text>
          <Text style={styles.bodyText}>
            Whether you're opening a retail shop, a luxury boutique, a corporate office, or a tech startup, RE Intelligence adjusts its scoring weights to match your specific business type, so you always get recommendations tailored to your needs.
          </Text>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {[
            { icon: 'map', title: 'Interactive Map View', desc: 'Real street-level maps with scored district overlays, heat zones, and satellite/terrain toggle' },
            { icon: 'grid', title: 'Card Dashboard', desc: 'Browse and compare districts in a ranked card grid with instant visual scoring' },
            { icon: 'business', title: 'Business-Type Weights', desc: 'Switch between Retail, Office, Luxury, Tech, and Default weight profiles to see how scores shift for your use case' },
            { icon: 'school', title: 'Rich & Educated Signal', desc: '20-indicator sub-index combining 13 wealth and 7 education metrics for demographic intelligence' },
            { icon: 'trending-up', title: 'Daily Growth', desc: 'New districts added every day — our coverage expands continuously to give you more data points' },
            { icon: 'shield-checkmark', title: '7 V&R Gates', desc: 'Every score passes through 7 validation & reliability checkpoints before it reaches you' },
          ].map((feat, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={feat.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{districtCount}</Text>
            <Text style={styles.statLabel}>Districts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{cityCount}</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>38</Text>
            <Text style={styles.statLabel}>Indicators</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>Sources</Text>
          </View>
        </View>

        {/* Locked Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sources (Locked)</Text>
          {DATA_SOURCES.map(src => (
            <View key={src.name} style={styles.sourceRow}>
              <View style={[styles.sourceDot, { backgroundColor: src.color }]} />
              <Text style={styles.sourceName}>{src.name}</Text>
              <Text style={styles.sourceCount}>{src.count} indicators</Text>
            </View>
          ))}
          <View style={styles.sourceTotal}>
            <Text style={styles.sourceTotalLabel}>Total</Text>
            <Text style={styles.sourceTotalNum}>38 indicators</Text>
          </View>
        </View>

        {/* 5 Scoring Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scoring Categories</Text>
          {[
            { label: 'Market Health & Risk', pct: '20%', color: '#6366f1' },
            { label: 'Wealth & Capital Flow', pct: '20%', color: '#8b5cf6' },
            { label: 'Economic & Social Infrastructure', pct: '25%', color: '#3b82f6' },
            { label: 'Hyperlocal Signals', pct: '25%', color: '#14b8a6' },
            { label: 'Education & Human Capital', pct: '10%', color: '#f59e0b' },
          ].map(cat => (
            <View key={cat.label} style={styles.catRow}>
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              <Text style={styles.catLabel}>{cat.label}</Text>
              <Text style={styles.catPct}>{cat.pct}</Text>
            </View>
          ))}
        </View>

        {/* Management */}
        <View style={styles.mgmtCard}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.mgmtRow}>
            <View style={styles.mgmtAvatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.mgmtName}>{MANAGEMENT.name}</Text>
              <Text style={styles.mgmtRole}>{MANAGEMENT.role}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${MANAGEMENT.email}`)}>
                <Text style={styles.mgmtEmail}>{MANAGEMENT.email}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Currency */}
        <View style={styles.currencyBox}>
          <Text style={styles.currencyLabel}>Base Currency</Text>
          <Text style={styles.currencyValue}>SAR (Saudi Riyal)</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 14 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 16 },
  hero: { alignItems: 'center', paddingVertical: 28 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  heroVersion: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  bodyText: { fontSize: 14, color: '#334155', lineHeight: 21, marginBottom: 10 },
  featureRow: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  featureIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  featureDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  sourceDot: { width: 8, height: 8, borderRadius: 2, marginRight: 8 },
  sourceName: { flex: 1, fontSize: 13, color: '#334155' },
  sourceCount: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  sourceTotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  sourceTotalLabel: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  sourceTotalNum: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  catDot: { width: 8, height: 8, borderRadius: 2, marginRight: 8 },
  catLabel: { flex: 1, fontSize: 13, color: '#334155' },
  catPct: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  mgmtCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  mgmtRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mgmtAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  mgmtName: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  mgmtRole: { fontSize: 12, color: COLORS.textSecondary },
  mgmtEmail: { fontSize: 12, color: '#3b82f6', marginTop: 2 },
  currencyBox: { backgroundColor: COLORS.accent + '22', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.accent },
  currencyLabel: { fontSize: 10, fontWeight: '700', color: '#a16207', textTransform: 'uppercase' },
  currencyValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
});
