const fs = require("node:fs");
const path = require("node:path");
const { withAppBuildGradle, withDangerousMod, withGradleProperties } = require("expo/config-plugins");

const LEGACY_DEFAULT = 'getDefaultProguardFile("proguard-android.txt")';
const OPTIMIZED_DEFAULT = 'getDefaultProguardFile("proguard-android-optimize.txt")';
const FULL_MODE_PROPERTY = "android.enableR8.fullMode";
const OPTIMIZED_RESOURCE_SHRINKING_PROPERTY = "android.r8.optimizedResourceShrinking";

function withOptimizedProguardDefault(config) {
  return withAppBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language !== "groovy") {
      throw new Error("Android release optimization plugin expects a Groovy app/build.gradle file.");
    }

    const original = modConfig.modResults.contents;
    const updated = original.replaceAll(LEGACY_DEFAULT, OPTIMIZED_DEFAULT);

    if (!updated.includes(OPTIMIZED_DEFAULT)) {
      throw new Error("Could not configure proguard-android-optimize.txt in android/app/build.gradle.");
    }
    if (updated.includes(LEGACY_DEFAULT)) {
      throw new Error("Legacy proguard-android.txt remains in android/app/build.gradle.");
    }

    modConfig.modResults.contents = updated;
    return modConfig;
  });
}

function withR8GradleProperties(config) {
  return withGradleProperties(config, (modConfig) => {
    const properties = modConfig.modResults.filter(
      (item) =>
        item.type !== "property" ||
        (item.key !== FULL_MODE_PROPERTY && item.key !== OPTIMIZED_RESOURCE_SHRINKING_PROPERTY),
    );

    // AGP 8 enables R8 full mode by default, so deliberately omit the legacy
    // compatibility opt-out. AGP 8.11 still needs this flag for the optimized
    // resource shrinker; AGP 9 enables it automatically.
    properties.push({
      type: "property",
      key: OPTIMIZED_RESOURCE_SHRINKING_PROPERTY,
      value: "true",
    });

    modConfig.modResults = properties;
    return modConfig;
  });
}

function withValidatedProjectProguardRules(config) {
  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const rulesPath = path.join(modConfig.modRequest.platformProjectRoot, "app", "proguard-rules.pro");
      const original = await fs.promises.readFile(rulesPath, "utf8");
      const updated = original.replaceAll("proguard-android.txt", "proguard-android-optimize.txt");

      const hasDontOptimize = updated
        .split(/\r?\n/)
        .some((line) => line.trim().startsWith("-dontoptimize"));
      if (hasDontOptimize) {
        throw new Error("An effective -dontoptimize directive remains in android/app/proguard-rules.pro.");
      }

      if (updated !== original) await fs.promises.writeFile(rulesPath, updated);
      return modConfig;
    },
  ]);
}

module.exports = function withAndroidReleaseOptimization(config) {
  config = withOptimizedProguardDefault(config);
  config = withR8GradleProperties(config);
  config = withValidatedProjectProguardRules(config);
  return config;
};
