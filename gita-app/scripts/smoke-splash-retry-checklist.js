#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const splashPath = path.join(projectRoot, "app", "splash.tsx");

function check(condition, label) {
  return { ok: Boolean(condition), label };
}

function printChecklist(results) {
  console.log("\nSplash Failure + Retry Smoke Checklist\n");
  for (const result of results) {
    console.log(`${result.ok ? "[x]" : "[ ]"} ${result.label}`);
  }

  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  console.log(`\nChecks passed: ${passed}/${total}`);

  if (passed !== total) {
    console.log("\nManual steps to complete:");
    console.log("1. Temporarily force an init failure in app/splash.tsx.");
    console.log("2. Launch app and confirm error state appears.");
    console.log("3. Tap Retry and confirm initialize() is re-invoked.");
    console.log("4. Tap Continue and confirm routing to /(tabs).");
    process.exitCode = 1;
  } else {
    console.log(
      "\nAll static checks passed. Run manual taps once on device/emulator.",
    );
  }
}

function run() {
  if (!fs.existsSync(splashPath)) {
    console.error("Could not find app/splash.tsx");
    process.exit(1);
  }

  const source = fs.readFileSync(splashPath, "utf8");

  const results = [
    check(
      source.includes("const [initError"),
      "Splash tracks initialization error state",
    ),
    check(
      source.includes("const initialize = React.useCallback"),
      "Splash has reusable initialize callback",
    ),
    check(
      source.includes("onPress={initialize}"),
      "Retry action is wired to initialize()",
    ),
    check(source.includes("Retry"), "Retry label is present"),
    check(source.includes("Continue"), "Continue fallback label is present"),
    check(
      source.includes('router.replace("/(tabs)")'),
      "Continue fallback routes to /(tabs)",
    ),
    check(
      source.includes("Initialization failed."),
      "Failure message is surfaced",
    ),
  ];

  printChecklist(results);
}

run();
