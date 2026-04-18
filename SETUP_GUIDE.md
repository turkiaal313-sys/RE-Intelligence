# RE Intelligence App — Setup & Deployment Guide

## Quick Start

1. Install dependencies:
   ```bash
   cd RE_App
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with Expo Go app on your phone to preview instantly.

## Google Maps API Key

For the map to work on iOS and Android, you need a Google Maps API key:

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Create an API key under Credentials
5. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `app.json` (both iOS and Android sections)

## Build for App Store & Google Play

This app uses Expo Application Services (EAS) for building:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Build for iOS (requires Apple Developer Account - $99/year):
   ```bash
   eas build --platform ios
   ```

4. Build for Android (requires Google Play Developer Account - $25 one-time):
   ```bash
   eas build --platform android
   ```

5. Submit to stores:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## Project Structure

```
RE_App/
  App.js                    — Main entry, tab navigation
  app.json                  — Expo config, app name, API keys
  package.json              — Dependencies
  src/
    screens/
      MapScreen.js          — Interactive map with scored districts
      CardsScreen.js        — Card grid view with ranking
      AboutScreen.js        — App description, features, management info
    data/
      districts.js          — All 210 districts (30 per city x 7 cities)
    utils/
      scoring.js            — V&R scoring engine, weights, colors, tiers
      constants.js          — App info, management details, color palette
```

## Daily Growth

New districts are added daily via the scheduled Cowork task. To manually add districts:
1. Add entries to `src/data/districts.js`
2. Each entry needs: id, city, name, lat, lng, s:{mh,wc,ei,hl,ed}, w, e, pop, ind
3. Rebuild and push update

## Management

- Name: Tur
- Email: t-ii@windowslive.com
