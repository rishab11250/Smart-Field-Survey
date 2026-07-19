# 🧭 Smart Field Survey & Inspection App

A React Native mobile application built with Expo for logging field surveys and inspection records. It integrates hardware features like the Camera, Location (GPS), and Contacts with local draft states and a history log.

> ⚠️ **Important Data Notice:** All survey data, photo drafts, and logged histories are kept strictly in-memory (local state/cache). The app **does not store data permanently on the device's hard drive**. If you close or force-restart the app, all drafts and logged survey history records will be cleared.

---

## 🎨 Theme & UI
- **Cohesive Color Palette:** Warm off-white/beige base for outdoor readability, dark charcoal headers, and emerald green + terracotta accent styling.
- **Centered Layouts:** Fully aligned and centered bottom tab bar navigator for single-hand use.
- **Visual Striker Cards:** Cards featuring left-aligned priority flag colors (Low 🟢, Medium 🟠, High 🔴).

---

## 🚀 Try the App

You can run and test the app live:

### Option A: Install Standalone Build (Android APK)
If you want to try the app directly on your Android device without setting up a development environment, you can download the standalone `.apk` directly from the **GitHub Releases** page:
👉 **[Download Standalone APK (GitHub Releases)](https://github.com/rishab1125/Smart-Field-Survey/releases)**


### Option B: Run in Development Mode
1. **Clone the repo and install dependencies:**
   ```bash
   npm install
   ```
2. **Start the app server:**
   ```bash
   npx expo start
   ```
3. Scan the QR code displayed in the terminal using the **Expo Go** app (available on Android and iOS) to try it instantly on your device, or press `w` to run it in a web browser.

---

## 🚀 Features

### 📊 1. Dashboard
- Welcome screen with user details.
- Daily and total survey counters updating in real-time.
- Quick action buttons to open tools.
- Preview of the last 3 recent surveys.

### 📝 2. Create Survey
- Site Name, Client Name, and Description input fields.
- Priority pills selector (Low, Medium, High).
- Automatic draft saving.
- Visual badges showing attachment status (Photo 📷, GPS 📍, Contact 👤).

### 📷 3. Camera
- Permission request prompts.
- Live camera viewport with front/back camera toggling.
- Capture image overlay showing the exact timestamp.
- Retake, save, and confirm-before-delete actions.

### 📍 4. Location
- GPS coordinate fetching (Latitude, Longitude, and Accuracy).
- 3-second live timeout with a fallback to the last known position.
- Refresh location button and copy-to-clipboard coordinates trigger.

### 👤 5. Contacts
- Fetch device contacts list with pull-to-refresh.
- Real-time search filter and contact counter.
- Automatic avatar initial badges.
- Block actions for contacts missing phone numbers.

### 📋 6. Clipboard Manager & Saving
- Extract metadata (Survey ID, coordinates, contact numbers) from the draft.
- Paste clipboard contents directly into site notes.
- Save captured photos directly to the native phone gallery.

### 👁️ 7. Preview & Submission
- Read-only checklist of all input fields and attached assets.
- Back-edit routing to easily make modifications.
- Final submit action which clears the draft and saves to history.

### 📂 8. Survey History
- Expandable accordion cards displaying the complete survey details.
- Filter surveys by priority level and search by site name/ID.
- Fullscreen modal image viewer for inspection photos.
- Confirm-before-delete records deletion.

---

## 📂 Project Structure

```text
├── app/
│   ├── (drawer)/
│   │   ├── (tabs)/
│   │   │   ├── index.jsx          # Dashboard Screen
│   │   │   ├── create-survey.jsx  # New Survey Form
│   │   │   ├── history.jsx        # Survey History Log
│   │   │   └── profile.jsx        # Editable User Profile
│   │   ├── _layout.jsx            # Custom Navigation Drawer
│   │   ├── camera.jsx             # Camera Capture Utility
│   │   ├── clipboard.jsx          # Clipboard and Gallery Exporter
│   │   ├── contacts.jsx           # Contacts Directory Screen
│   │   ├── location.jsx           # GPS Location Tracker
│   │   ├── preview.jsx            # Preview Form Submission
│   │   └── settings.jsx           # Settings placeholder
│   ├── _layout.tsx                # Root layout wraps context
│   └── modal.tsx                  # Modal viewer
├── constants/
│   └── theme.ts                   # Colors, spacing, typography tokens
├── context/
│   └── SurveyContext.js           # Global State (Surveys, Drafts, Theme)
├── hooks/
│   ├── use-color-scheme.ts        # Dynamic theme listener hook
│   └── use-theme-color.ts         # Theme coloring helper hook
├── components/                    # Core UI components
├── README.md                      # Project documentation
└── app.json                       # Expo config settings
```
