/**
 * AI SRE Console — E2E Test Suite Helpers & Framework Utilities
 * Provides assertion primitives, AST/DOM scanners, mock data fixtures, and contract validators.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const CONSOLE_ROOT = path.resolve(__dirname, '..');

// ANSI terminal styling
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

export class TestRunner {
  private results: TestResult[] = [];
  private currentSuite = 'Default Suite';

  suite(name: string) {
    this.currentSuite = name;
    console.log(`\n${colors.bright}${colors.cyan}▶ Suite: ${name}${colors.reset}`);
  }

  async test(name: string, fn: () => void | Promise<void>) {
    const start = Date.now();
    try {
      await fn();
      const durationMs = Date.now() - start;
      this.results.push({ suite: this.currentSuite, name, passed: true, durationMs });
      console.log(`  ${colors.green}✔ PASS${colors.reset} ${name} ${colors.dim}(${durationMs}ms)${colors.reset}`);
    } catch (err: any) {
      const durationMs = Date.now() - start;
      const errorMsg = err?.stack || err?.message || String(err);
      this.results.push({ suite: this.currentSuite, name, passed: false, error: errorMsg, durationMs });
      console.log(`  ${colors.red}✖ FAIL${colors.reset} ${name} ${colors.dim}(${durationMs}ms)${colors.reset}`);
      console.log(`    ${colors.red}${errorMsg}${colors.reset}`);
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const duration = this.results.reduce((acc, r) => acc + r.durationMs, 0);
    return { total, passed, failed, duration };
  }

  printSummary() {
    const { total, passed, failed, duration } = this.getSummary();
    console.log(`\n${colors.bright}------------------------------------------------------------${colors.reset}`);
    console.log(`${colors.bright}Test Summary:${colors.reset}`);
    console.log(`  Total Tests:    ${total}`);
    console.log(`  ${colors.green}Passed:${colors.reset}         ${passed}`);
    console.log(`  ${failed > 0 ? colors.red : colors.dim}Failed:${colors.reset}         ${failed}`);
    console.log(`  Duration:       ${duration}ms`);
    console.log(`${colors.bright}------------------------------------------------------------${colors.reset}`);
    if (failed > 0) {
      console.log(`${colors.bgRed}${colors.white} FAILED SUITES EXIST ${colors.reset}\n`);
    } else {
      console.log(`${colors.bgGreen}${colors.white} ALL TESTS PASSED SUCCESSFULLY ${colors.reset}\n`);
    }
  }
}

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected: any) {
      const actStr = JSON.stringify(actual);
      const expStr = JSON.stringify(expected);
      if (actStr !== expStr) {
        throw new Error(`Expected:\n${expStr}\nReceived:\n${actStr}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, but received: ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, but received: ${JSON.stringify(actual)}`);
      }
    },
    toContain(sub: string | any) {
      if (typeof actual === 'string') {
        if (!actual.includes(sub)) {
          throw new Error(`Expected string to contain "${sub}", but it was not found.`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(sub)) {
          throw new Error(`Expected array to contain item ${JSON.stringify(sub)}, but it was not found.`);
        }
      } else {
        throw new Error(`toContain called on non-string/non-array: ${typeof actual}`);
      }
    },
    toNotContain(sub: string) {
      if (typeof actual === 'string' && actual.includes(sub)) {
        throw new Error(`Expected string NOT to contain "${sub}", but found it.`);
      }
    },
    toBeGreaterThan(num: number) {
      if (!(actual > num)) {
        throw new Error(`Expected ${actual} to be greater than ${num}`);
      }
    },
    toBeGreaterThanOrEqual(num: number) {
      if (!(actual >= num)) {
        throw new Error(`Expected ${actual} to be >= ${num}`);
      }
    },
    toBeLessThan(num: number) {
      if (!(actual < num)) {
        throw new Error(`Expected ${actual} to be less than ${num}`);
      }
    },
    toMatch(regex: RegExp) {
      if (!regex.test(String(actual))) {
        throw new Error(`Expected "${actual}" to match regex ${regex}`);
      }
    },
    toBeCloseTo(expected: number, precision: number = 2) {
      const diff = Math.abs(actual - expected);
      const tolerance = Math.pow(10, -precision) / 2;
      if (diff > tolerance) {
        throw new Error(`Expected ${actual} to be close to ${expected} within precision ${precision}`);
      }
    },
    toBeInstanceOf(cls: any) {
      if (!(actual instanceof cls)) {
        throw new Error(`Expected instance of ${cls.name}`);
      }
    }
  };
}

/**
 * Reads file relative to sre-console (1) root
 */
export function readConsoleFile(relPath: string): string {
  const target = path.resolve(CONSOLE_ROOT, relPath);
  if (!fs.existsSync(target)) {
    throw new Error(`File not found: ${target}`);
  }
  return fs.readFileSync(target, 'utf-8');
}

/**
 * Scans directories recursively for source files matching extensions
 */
export function scanSourceFiles(dir: string, extensions: string[] = ['.tsx', '.ts', '.css', '.html']): string[] {
  const result: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
      result.push(...scanSourceFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      result.push(fullPath);
    }
  }
  return result;
}

/**
 * Safe object stringifier enforcing zero `[object Object]` crashes
 */
export function safeSerialize(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return '[Circular Structure]';
    }
  }
  return String(val);
}

/**
 * Normalizes RAG tags from either array, string, or undefined
 */
export function normalizeTags(tags: any): string[] {
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}
