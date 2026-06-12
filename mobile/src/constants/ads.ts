export const ADS_ENABLED = true;

const PROD_AD_UNITS = {
  banner: "ca-app-pub-2653462201538649/5444199958",
  interstitial: "ca-app-pub-2653462201538649/5721527391",
  rewarded: "ca-app-pub-2653462201538649/2269367545"
};

const TEST_AD_UNITS = {
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917"
};

export const AD_UNITS = __DEV__ ? TEST_AD_UNITS : PROD_AD_UNITS;
