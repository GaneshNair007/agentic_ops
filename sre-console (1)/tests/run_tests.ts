/**
 * AI SRE Console (Palomino Redesign) — Master E2E Automated Test Runner
 * Executes all 4 Tiers of automated test suites:
 *   - Tier 1: Feature Coverage & Palomino Aesthetic Conformance
 *   - Tier 2: Boundary & Corner Cases (Defensive Sanitization & Fuzzing)
 *   - Tier 3: Cross-Feature State & Workflow Integration
 *   - Tier 4: Real-World SRE Scenario Simulations
 *
 * Usage:
 *   npx tsx tests/run_tests.ts
 */

import { TestRunner, colors } from './test_helpers';
import { runTier1Tests } from './tier1_feature_coverage.test';
import { runTier2Tests } from './tier2_boundary_corner.test';
import { runTier3Tests } from './tier3_cross_feature.test';
import { runTier4Tests } from './tier4_real_world_sre.test';
import { runAdversarialStressTests } from './adversarial_stress_verification.test';
import { runTier6Tests } from './tier6_hero_portal_responsiveness.test';

async function main() {
  console.log(`${colors.bright}${colors.magenta}`);
  console.log(`======================================================================`);
  console.log(`  AI SRE CONSOLE (PALOMINO REDESIGN) — E2E TEST SUITE RUNNER`);
  console.log(`======================================================================${colors.reset}`);
  console.log(`${colors.dim}Target: sre-console (1) | Timestamp: ${new Date().toISOString()}${colors.reset}\n`);

  const runner = new TestRunner();

  try {
    // Tier 1: Feature Coverage & Aesthetic Conformance
    await runTier1Tests(runner);

    // Tier 2: Boundary & Corner Cases
    await runTier2Tests(runner);

    // Tier 3: Cross-Feature State & Workflow Integration
    await runTier3Tests(runner);

    // Tier 4: Real-World SRE Scenario Simulations
    await runTier4Tests(runner);

    // Tier 5: Adversarial Stress & Crash Prevention
    await runAdversarialStressTests(runner);

    // Tier 6: Portal Hero Animations & Responsive Typography
    await runTier6Tests(runner);

    runner.printSummary();

    const summary = runner.getSummary();
    if (summary.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (globalErr: any) {
    console.error(`\n${colors.red}${colors.bright}[FATAL TEST RUNNER ERROR]${colors.reset}`, globalErr);
    process.exit(1);
  }
}

main();
