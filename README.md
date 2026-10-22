This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Application structure

Application code is organized by feature, with app setup and reusable code kept separate:

```text
src/
  app/
    navigation/       # Root, customer-tab, delivery-tab navigation
  assets/
    fonts/
    images/
  features/
    account/
      components/     # Account sheets and reusable account UI
      screens/
    auth/
      components/
      screens/
    cart/
      screens/
    catalog/
      data/
      screens/
    delivery/
      screens/
    home/
      components/animations/
      screens/
    legal/
      screens/
    orders/
      components/
      screens/
    support/
      screens/
  shared/
    components/       # Reusable controls and shared transitions
    constants/        # Shared asset references
    i18n/             # Language preference, translation catalogs and localized controls
```

## Razorpay test checkout

The customer cart uses the Razorpay React Native SDK with a test-only payment
server. The server calculates prices in paise, creates Razorpay orders, verifies
the returned signature, and confirms/captures the payment. The Razorpay Key
Secret must only be configured on the server; never add it to the mobile app.
The server refuses live keys (`rzp_live_`) to prevent accidental live charges.

1. Copy `server/.env.example` to `server/.env` and fill in **test-mode**
   credentials from the Razorpay Dashboard. Keep `server/.env` private.
2. Install and start the server:

   ```sh
   npm install --prefix server
   npm --prefix server start
   ```

3. For Android (emulator or USB/Wi-Fi-connected device), forward the API port:

   ```sh
   adb reverse tcp:4001 tcp:4001
   ```

   The iOS simulator can reach the server at `http://localhost:4001`. For a
   physical iPhone or deployed server, set `PAYMENT_API_BASE_URL` in
   `src/features/cart/services/paymentApi.ts` to the server's reachable HTTPS
   URL. The app times out unreachable API requests after 15 seconds and shows
   a connection error instead of leaving the checkout spinner running forever.
4. After installing the native Razorpay SDK, rebuild the app. On iOS, run
   `bundle exec pod install` before rebuilding.

Sample catalog, order, and cart prices are treated as INR for this demo; the
server is the authority for the amount and product IDs. Update the server-side
catalog in `server/src/paymentDomain.js` whenever the cart catalog changes.
The cart includes two sample offers: `SAVE10` (₹10 off a ₹30 minimum) and
`FRESH15` (15% off, capped at ₹15, on a ₹40 minimum). Offer rules are enforced
again on the server when creating the Razorpay order, so the client cannot
change the discount or payment amount.
This prototype verifies a test payment but does not save an order or delivery.
Add customer authentication and persistent order storage before exposing the
payment API publicly.

Keep feature-specific screens, components, and data inside their feature. Put code in `shared/` only when it is reused across features. React Native entry points and native projects remain at the repository root.

## Adding a language

The language picker is backed by the registry in `src/shared/i18n/languages.ts` and the phrase catalogs in `src/shared/i18n/translations.ts`. To add a language, add its code and native name to `SUPPORTED_LANGUAGES`, then add translations for that code in `TRANSLATIONS`. English is the source text and is used as the fallback when a translation is not available. App labels and input placeholders use the shared localized controls; when adding UI text that is assembled dynamically, add its complete English phrase to each catalog.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
