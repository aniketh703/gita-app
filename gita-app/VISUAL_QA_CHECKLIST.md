# Visual QA Validation Checklist

## Overview

This checklist validates all 5 fixes applied to the Gita app. Run through each scenario on iOS simulator or Android emulator (or physical device).

---

## Test 1: Home Tab Navigation (CRITICAL)

**File affected:** `app/(tabs)/_layout.tsx` (line 40)  
**Change:** Home tab href changed from "/" to "/(tabs)"

### Steps:

1. Launch the app
2. From any tab (Chapters, Search, Journal), tap the **Home** tab in bottom navigation
3. Observe the screen transition

### Expected Result:

✅ Home screen loads immediately  
✅ No splash screen or initialization flow appears  
✅ Smooth, instant tab transition with no loading delay

### If Failed:

❌ Splash screen appears after tapping Home  
❌ Screen shows onboarding/init flow  
→ This would indicate the route fix didn't apply correctly

---

## Test 2: Onboarding Preferences Sync (CRITICAL)

**Files affected:** `src/screens/onboarding/OnboardingNavigator.tsx`, `src/context/PreferencesContext.tsx`  
**Change:** Added sync of font size & theme to PreferencesContext after onboarding completes

### Steps:

1. **Clear app data** to reset onboarding state:
   - iOS: Settings → Gita app → Offload App → Reinstall
   - Android: Settings → Apps → Gita → Clear Data
2. Launch app → complete onboarding flow to Step 7 (Appearance)
3. In Step 7, select:
   - Font size: **Large**
   - Theme: **Dark** (or any non-default)
4. Complete onboarding and reach Home screen
5. Go to **Settings** tab
6. Verify font size and theme match your selections

### Expected Result:

✅ Font size is noticeably **larger** throughout app  
✅ Theme is **dark mode** (if selected)  
✅ Change persists when you navigate away and back

### If Failed:

❌ Font appears normal size despite selecting "Large"  
❌ Theme is still light even though you selected dark  
❌ Settings show different values than onboarding choices  
→ This would indicate the sync hook isn't working

---

## Test 3: Duplicate UI Elements Fixed (MEDIUM)

**Files affected:** `src/screens/onboarding/OnboardingStep3.tsx`, `src/screens/onboarding/OnboardingStep4.tsx`  
**Changes:**

- Removed duplicate check icon in goal selection (Step 3)
- Removed duplicate "Continue" button text in content display (Step 4)

### Steps (Onboarding only):

1. Clear app data and relaunch
2. Navigate to Step 3 (goal selection)
3. Tap any goal option (e.g., "Read 1 sloka daily")
4. Observe the selected goal card

### Expected Result (Step 3):

✅ A **single white check icon** appears in the accent-colored circle  
✅ Icon is crisp and not overlapping/stacked

### Steps (Onboarding Step 4):

5. Tap "Continue" to move to Step 4 (content display)
6. Select at least one checkbox (e.g., English)
7. Look at the **Continue button** at the bottom

### Expected Result (Step 4):

✅ Button shows **"Continue"** text only **once**  
✅ Text is not duplicated or stacked  
✅ Arrow icon is present and clean

### If Failed:

❌ Multiple overlapping check icons visible in Step 3  
❌ "Continue" text appears twice in Step 4 button  
→ This indicates duplicate removal didn't apply

---

## Test 4: Verse Count Accuracy (MEDIUM)

**Files affected:** Multiple (7 files updated with 597 verses)  
**Change:** Corrected all copy/logic to reflect actual verse count (597 verses in dataset)

### Steps:

1. From Home screen, look at the card text
2. Go to **Settings** → scroll down to "About"
3. Check the verse count displayed
4. Go to **Search** tab → look at placeholder text
5. Go to **Chapters** → check the book summary

### Expected Result:

✅ Home card shows **"18 Chapters • 597 Verses"**  
✅ Settings about section shows **"18 chapters, 597 verses"**  
✅ Search placeholder shows **"Search through 597 verses"**  
✅ Chapters summary shows **"18 chapters • 597 verses"**  
✅ All references consistently say **597** (not 700, 701, or 719)

### If Failed:

❌ Home shows "701 Verses" or "700 Verses"  
❌ Settings still shows "719 verse entries"  
❌ Inconsistent numbers across screens  
→ This would indicate verse count updates didn't apply uniformly

---

## Test 5: Daily Verse Cycling Works (Related to Test 4)

**Files affected:** `src/store/appStore.ts`, `app/welcome.tsx`  
**Change:** Updated daily verse modulo from 700 to 597

### Steps:

1. Open Home screen and note the "Daily Verse" displayed
2. Remember the verse title/content
3. Navigate away and back to Home (or wait until next day)
4. Check if a different verse appears

### Expected Result:

✅ Daily verse cycles smoothly through all 597 verses  
✅ No "verse not found" errors in console  
✅ Verse content loads correctly

### If Failed:

❌ Console shows errors like "Cannot read property of undefined verse"  
❌ Same verse always displays  
❌ App crashes when loading daily verse  
→ This would indicate the modulo change has a runtime issue

---

## Test 6: (Bonus) Lint Cleanup Verification

**Files affected:** `src/screens/onboarding/OnboardingStep3Signature.tsx`, `src/store/appStore.ts`  
**Changes:** Removed unused variables, fixed apostrophe escape

### Steps:

1. Open VS Code's **Problems** panel (Ctrl/Cmd + Shift + P → "Problems")
2. Check for any errors in the changed files

### Expected Result:

✅ No red error squigles in modified files  
✅ No "unused variable" warnings in lint output  
✅ No apostrophe escape issues

### If Failed:

❌ Red errors appear in the Problems panel  
→ Indicates lint fixes didn't fully apply

---

## Summary Table

| Fix                   | File                         | Test Scenario                                   | Pass? |
| --------------------- | ---------------------------- | ----------------------------------------------- | ----- |
| Home route fix        | `app/(tabs)/_layout.tsx`     | Tap Home tab → instant load                     | [ ]   |
| Onboarding sync       | `OnboardingNavigator.tsx`    | Complete onboarding → Settings shows font/theme | [ ]   |
| Duplicate UI Step 3   | `OnboardingStep3.tsx`        | Select goal → single check icon                 | [ ]   |
| Duplicate UI Step 4   | `OnboardingStep4.tsx`        | Select content → single "Continue" text         | [ ]   |
| Verse count (7 files) | Multiple                     | Check all screens show 597 verses consistently  | [ ]   |
| Daily verse cycle     | `appStore.ts`, `welcome.tsx` | Home/Welcome daily verse loads correctly        | [ ]   |

---

## Running the App

### Start the dev server:

```bash
cd "c:\Users\Ani\OneDrive\Desktop\gita app\gita-app"
npm start
```

If port 8081 is in use, you can:

- Press `a` to open Android emulator, or
- Press `i` to open iOS simulator, or
- Use a custom port: `npm start -- --port 8082`

### On Physical Device:

- Scan the QR code with Expo Go app (iOS/Android)
- Or run `npm run android` / `npm run ios` for production build

---

## Notes for Testing

1. **Clear App Data Between Tests:** For onboarding tests, you must clear the app's local storage to reset onboarding state.
2. **Device/Simulator Must Match Code:** Ensure you're running against the latest code with all 5 fixes applied.
3. **Check Console:** Open dev tools (shake device → open debugger) to watch for any runtime errors during transitions.
4. **Responsiveness Testing:** If possible, test on multiple device sizes (small phone, tablet, notched display) for Test 6 (remaining responsiveness issues).

---

## Issue Escalation

If any test **FAILS**, note:

- Device type and OS version
- Which test failed
- Screenshot or video of the issue
- Console error messages (if any)

Then file a bug with the exact details.
