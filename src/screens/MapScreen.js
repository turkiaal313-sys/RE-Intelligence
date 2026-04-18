import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { DISTRICTS } from '../data/districts';
import { BUSINESS_WEIGHTS, OVERLAY_MODES, CITY_VIEWS, getDisplayScore, getScoreColor, getTierInfo, CATEGORIES } from '../utils/scoring';
import { COLORS, APP_INFO, MANAGEMENT } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const mapRef = useRef(null);
  const [city, setCity] = useState('Riyadh');
  const [bizType, setBizType] = useState('Default');
  const [overlay, setOverlay] = useState('Full V&R');
  const [selectedId, setSelectedId] = useState(null);
  const [showBizPicker, setShowBizPicker] = useState(false);
  const [showOverlayPicker, setShowOverlayPicker] = useState(false);

  const weights = BUSINESS_WEIGHTS[bizType];
  const overlayKey = overlay === 'Full V&R' ? 'Full' : overlay;

  const districts = useMemo(() => {
    return DISTRICTS.filter(d => d.city === city).map(d => ({
      ...d,
      score: getDisplayScore(d, weights, overlayKey),
    }));
  }, [city, weights, overlayKey]);

  const selected = districts.find(d => d.id === selectedId);
  const cityView = CITY_VIEWS[city];

  const flyToCity = (c) => {
    setCity(c);
    setSelectedId(null);
    const cv = CITY_VIEWS[c];
    mapRef.current?.animateToRegion({
      latitude: cv.lat,
      longitude: cv.lng,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    }, 800);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{APP_INFO.fullName}</Text>
          <Text style={styles.headerSub}>{APP_INFO.tagline}</Text>
        </View>
        <View style={styles.headerBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
          <View style={styles.sarBadge}>
            <Text style={styles.sarText}>SAR</Text>
          </View>
        </View>
      </View>

      {/* City Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityBar} contentContainerStyle={styles.cityBarContent}>
        {Object.keys(CITY_VIEWS).map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.cityTab, city === c && styles.cityTabActive]}
            onPress={() => flyToCity(c)}
          >
            <Text style={[styles.cityTabText, city === c && styles.cityTabTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.separator} />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowBizPicker(!showBizPicker)}>
          <Ionicons name="business-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.filterText}>{bizType}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowOverlayPicker(!showOverlayPicker)}>
          <Ionicons name="layers-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.filterText}>{overlay}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Picker Dropdowns */}
      {showBizPicker && (
        <View style={styles.dropdown}>
          {Object.keys(BUSINESS_WEIGHTS).map(b => (
            <TouchableOpacity key={b} style={styles.dropdownItem} onPress={() => { setBizType(b); setShowBizPicker(false); }}>
              <Text style={[styles.dropdownText, bizType === b && styles.dropdownTextActive]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {showOverlayPicker && (
        <View style={styles.dropdown}>
          {OVERLAY_MODES.map(o => (
            <TouchableOpacity key={o} style={styles.dropdownItem} onPress={() => { setOverlay(o); setShowOverlayPicker(false); }}>
              <Text style={[styles.dropdownText, overlay === o && styles.dropdownTextActive]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: cityView.lat,
            longitude: cityView.lng,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          showsUserLocation={false}
          showsCompass={true}
          mapType="standard"
        >
          {districts.map(d => {
            const color = getScoreColor(d.score);
            const isSel = d.id === selectedId;
            return (
              <React.Fragment key={d.id}>
                <Circle
                  center={{ latitude: d.lat, longitude: d.lng }}
                  radius={1200}
                  fillColor={color + '20'}
                  strokeColor={color + '50'}
                  strokeWidth={1}
                />
                <Circle
                  center={{ latitude: d.lat, longitude: d.lng }}
                  radius={500}
                  fillColor={color + '40'}
                  strokeColor={color + '80'}
                  strokeWidth={2}
                />
                <Marker
                  coordinate={{ latitude: d.lat, longitude: d.lng }}
                  onPress={() => setSelectedId(d.id)}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View style={styles.markerWrap}>
                    <View style={[styles.markerCircle, { backgroundColor: color, borderColor: isSel ? COLORS.primary : '#fff', borderWidth: isSel ? 3 : 2 }]}>
                      <Text style={styles.markerScore}>{d.score}</Text>
                    </View>
                    <View style={[styles.markerLabel, { backgroundColor: isSel ? COLORS.primary : '#ffffffee', borderColor: isSel ? COLORS.primary : color }]}>
                      <Text style={[styles.markerName, { color: isSel ? '#fff' : COLORS.primary }]}>{d.name}</Text>
                    </View>
                  </View>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapView>

        {/* District Count */}
        <View style={styles.distCount}>
          <Text style={styles.distCountText}><Text style={{ fontWeight: '800', color: COLORS.primary, fontSize: 14 }}>{districts.length}</Text> districts in {city}</Text>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { l: 'Prime 80+', c: COLORS.prime },
            { l: 'Strong 65-79', c: COLORS.strong },
            { l: 'Moderate 50-64', c: COLORS.moderate },
            { l: 'Caution 35-49', c: COLORS.caution },
            { l: 'Avoid <35', c: COLORS.avoid },
          ].map(item => (
            <View key={item.l} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.c }]} />
              <Text style={styles.legendText}>{item.l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Drawer — Selected District */}
      {selected && (
        <ScrollView style={styles.drawer} showsVerticalScrollIndicator={false}>
          <View style={styles.drawerHandle}><View style={styles.drawerHandleBar} /></View>
          <View style={styles.drawerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.drawerName}>{selected.name}</Text>
              <Text style={styles.drawerCity}>{selected.city} · {bizType}</Text>
              <Text style={styles.drawerPop}>{selected.pop}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.drawerScore, { color: getScoreColor(selected.score) }]}>{selected.score}</Text>
              <View style={[styles.tierBadge, { backgroundColor: getTierInfo(selected.score).bg, borderColor: getTierInfo(selected.score).border }]}>
                <Text style={[styles.tierText, { color: getTierInfo(selected.score).color }]}>{getTierInfo(selected.score).label}</Text>
              </View>
            </View>
          </View>

          {/* Category Bars */}
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {CATEGORIES.map(cat => {
            const val = selected.s[cat.key];
            return (
              <View key={cat.key} style={styles.catRow}>
                <View style={styles.catHeader}>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={[styles.catValue, { color: getScoreColor(val) }]}>{val} <Text style={styles.catWeight}>{Math.round(weights[cat.key] * 100)}%</Text></Text>
                </View>
                <View style={styles.catBar}>
                  <View style={[styles.catFill, { width: `${val}%`, backgroundColor: getScoreColor(val) }]} />
                </View>
              </View>
            );
          })}

          {/* Key Indicators */}
          <Text style={styles.sectionTitle}>Key Indicators</Text>
          {selected.ind.map((ind, i) => (
            <View key={i} style={styles.indRow}>
              <View style={styles.indDot} />
              <Text style={styles.indText}>{ind}</Text>
            </View>
          ))}

          {/* Rich & Educated Signal */}
          <View style={styles.reSignal}>
            <Text style={styles.reTitle}>Rich & Educated Signal</Text>
            <View style={styles.reRow}>
              {[
                { label: 'WEALTH', value: selected.w },
                { label: 'EDUCATION', value: selected.e },
                { label: 'COMBINED', value: Math.round(selected.w * 0.65 + selected.e * 0.35) },
              ].map(item => (
                <View key={item.label} style={styles.reItem}>
                  <Text style={styles.reLabel}>{item.label}</Text>
                  <Text style={[styles.reValue, { color: getScoreColor(item.value) }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Management Contact */}
          <View style={styles.mgmt}>
            <Text style={styles.mgmtLabel}>Management</Text>
            <Text style={styles.mgmtName}>{MANAGEMENT.name}</Text>
            <Text style={styles.mgmtEmail}>{MANAGEMENT.email}</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  headerSub: { color: COLORS.textMuted, fontSize: 9, marginTop: 1 },
  headerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  liveText: { color: '#22c55e', fontSize: 9, fontWeight: '700' },
  sarBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4 },
  sarText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  cityBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border, maxHeight: 44 },
  cityBarContent: { paddingHorizontal: 12, alignItems: 'center', gap: 6 },
  cityTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  cityTabActive: { backgroundColor: COLORS.primary },
  cityTabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  cityTabTextActive: { color: '#fff' },
  separator: { width: 1, height: 20, backgroundColor: COLORS.border, marginHorizontal: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  filterText: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary },
  dropdown: { position: 'absolute', top: Platform.OS === 'ios' ? 140 : 120, right: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, zIndex: 100, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  dropdownText: { fontSize: 13, color: COLORS.text },
  dropdownTextActive: { fontWeight: '700', color: COLORS.primary },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  distCount: { position: 'absolute', top: 12, left: 12, backgroundColor: '#ffffffee', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  distCountText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  legend: { position: 'absolute', bottom: 12, left: 12, backgroundColor: '#ffffffee', borderRadius: 10, padding: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 10, color: COLORS.text, fontWeight: '500' },
  markerWrap: { alignItems: 'center' },
  markerCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  markerScore: { color: '#fff', fontSize: 14, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  markerLabel: { marginTop: 3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  markerName: { fontSize: 9, fontWeight: '700' },
  drawer: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: height * 0.55, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 },
  drawerHandle: { alignItems: 'center', paddingVertical: 8 },
  drawerHandleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  drawerName: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  drawerCity: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  drawerPop: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontStyle: 'italic' },
  drawerScore: { fontSize: 36, fontWeight: '900' },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, marginTop: 4 },
  tierText: { fontSize: 9, fontWeight: '700' },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 14, marginBottom: 8 },
  catRow: { marginBottom: 8 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  catLabel: { fontSize: 12, color: '#334155', fontWeight: '500' },
  catValue: { fontSize: 12, fontWeight: '700' },
  catWeight: { color: COLORS.textMuted, fontWeight: '400', fontSize: 10 },
  catBar: { height: 6, backgroundColor: COLORS.borderLight, borderRadius: 3, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: 3 },
  indRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  indDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#3b82f6' },
  indText: { fontSize: 12, color: '#334155' },
  reSignal: { marginTop: 14, padding: 12, backgroundColor: '#fffbeb', borderRadius: 10, borderWidth: 1, borderColor: '#fde68a' },
  reTitle: { fontSize: 11, fontWeight: '700', color: '#92400e', marginBottom: 8 },
  reRow: { flexDirection: 'row', gap: 20 },
  reItem: {},
  reLabel: { fontSize: 9, color: '#a16207', fontWeight: '600' },
  reValue: { fontSize: 22, fontWeight: '900' },
  mgmt: { marginTop: 14, padding: 12, backgroundColor: COLORS.borderLight, borderRadius: 10 },
  mgmtLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  mgmtName: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  mgmtEmail: { fontSize: 11, color: COLORS.textSecondary },
});
