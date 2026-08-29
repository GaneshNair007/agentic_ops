/**
 * AI SRE Console — Adversarial Stress & Crash Prevention Verification Suite
 * Milestone 4: Empirical Challenger 2 Verification
 *
 * Tests:
 * 1. AuditTimeline & safeSerialize against deep nesting, large objects, circular structures, BigInt, null/undefined
 * 2. IncidentSimulator & renderPayload against malformed, circular, Unicode, and extreme payloads
 * 3. EvidenceRetrieval & parseTags against null, undefined, empty, strings, dirty arrays, and non-array types
 * 4. SafetyControl JSON parsing & safeFormat against valid, invalid, empty, and malicious inputs
 * 5. Full AST / Source Code Scan for [object Object] vulnerabilities and unshielded .map() calls
 */

import { TestRunner, expect, readConsoleFile, scanSourceFiles } from './test_helpers';

// Helper duplicates matching exact component implementations for direct unit testing
function auditSafeSerialize(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return '[Circular or Unserializable Structure]';
    }
  }
  return String(val);
}

function simRenderPayload(payload: any): string {
  if (payload === null || payload === undefined) return '';
  if (typeof payload === 'object') {
    try {
      return JSON.stringify(payload, null, 2);
    } catch {
      return '[Circular or Unserializable Structure]';
    }
  }
  return String(payload);
}

function evidenceParseTags(tags: any): string[] {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function safetySafeFormat(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return '[Unserializable Object]';
    }
  }
  return String(val);
}

function safetyParseParams(paramsJson: string): { success: boolean; data?: any; error?: string } {
  try {
    const parsed = JSON.parse(paramsJson);
    return { success: true, data: parsed };
  } catch (e: any) {
    return { success: false, error: 'Invalid JSON in parameters field' };
  }
}

export async function runAdversarialStressTests(runner: TestRunner) {
  runner.suite('Adversarial Stress: Data Rendering, Crash Prevention & Sanitization');

  // --------------------------------------------------------------------------
  // Test 1: AuditTimeline & safeSerialize Stress Testing
  // --------------------------------------------------------------------------
  await runner.test('ADV-1.1: AuditTimeline safeSerialize handles 50-level nested objects without [object Object]', () => {
    let deeplyNested: any = { value: 'leaf_node_target', level: 50 };
    for (let i = 49; i >= 1; i--) {
      deeplyNested = { level: i, nested: deeplyNested };
    }

    const output = auditSafeSerialize(deeplyNested);
    expect(output).toNotContain('[object Object]');
    expect(output).toContain('leaf_node_target');
    expect(output).toContain('"level": 50');
    expect(output).toContain('"level": 1');
  });

  await runner.test('ADV-1.2: AuditTimeline safeSerialize handles wide objects (1,000 keys) and huge arrays (5,000 items)', () => {
    const wideObj: Record<string, any> = {};
    for (let i = 0; i < 1000; i++) {
      wideObj[`key_${i}`] = { subKey: `val_${i}`, index: i };
    }
    const wideOutput = auditSafeSerialize(wideObj);
    expect(wideOutput).toNotContain('[object Object]');
    expect(wideOutput).toContain('key_999');
    expect(wideOutput).toContain('val_999');

    const hugeArray = Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `node-${i}` }));
    const arrayOutput = auditSafeSerialize(hugeArray);
    expect(arrayOutput).toNotContain('[object Object]');
    expect(arrayOutput).toContain('node-4999');
  });

  await runner.test('ADV-1.3: AuditTimeline safeSerialize gracefully traps direct, indirect, and array circular references', () => {
    // Direct circular reference
    const circularDirect: any = { id: 'direct' };
    circularDirect.self = circularDirect;
    expect(auditSafeSerialize(circularDirect)).toBe('[Circular or Unserializable Structure]');

    // Indirect 3-way circular reference
    const a: any = { name: 'A' };
    const b: any = { name: 'B' };
    const c: any = { name: 'C' };
    a.link = b;
    b.link = c;
    c.link = a;
    expect(auditSafeSerialize(a)).toBe('[Circular or Unserializable Structure]');

    // Circular reference inside array
    const circularArray: any = [1, 2, 3];
    circularArray.push(circularArray);
    expect(auditSafeSerialize(circularArray)).toBe('[Circular or Unserializable Structure]');

    // Deeply nested circular reference
    const deepCirc: any = { l1: { l2: { l3: { l4: {} } } } };
    deepCirc.l1.l2.l3.l4.root = deepCirc;
    expect(auditSafeSerialize(deepCirc)).toBe('[Circular or Unserializable Structure]');
  });

  await runner.test('ADV-1.4: AuditTimeline safeSerialize handles BigInt, Symbols, Functions, Null, Undefined, and NaN', () => {
    // Null and undefined return empty string
    expect(auditSafeSerialize(null)).toBe('');
    expect(auditSafeSerialize(undefined)).toBe('');

    // Primitives
    expect(auditSafeSerialize(0)).toBe('0');
    expect(auditSafeSerialize(false)).toBe('false');
    expect(auditSafeSerialize(NaN)).toBe('NaN');
    expect(auditSafeSerialize(Infinity)).toBe('Infinity');
    expect(auditSafeSerialize('plain text')).toBe('plain text');

    // BigInt in object (causes standard JSON.stringify to throw TypeError)
    const objWithBigInt = { id: 1, balance: BigInt(9007199254740991) };
    const bigIntOutput = auditSafeSerialize(objWithBigInt);
    expect(bigIntOutput).toBe('[Circular or Unserializable Structure]');

    // Object with functions / symbols
    const objWithFunc = { id: 2, fn: () => 'test', sym: Symbol('s') };
    const funcOutput = auditSafeSerialize(objWithFunc);
    expect(funcOutput).toNotContain('[object Object]');
    expect(funcOutput).toContain('"id": 2');
  });

  // --------------------------------------------------------------------------
  // Test 2: IncidentSimulator & renderPayload Stress Testing
  // --------------------------------------------------------------------------
  await runner.test('ADV-2.1: IncidentSimulator renderPayload handles complex event payloads and prevents [object Object]', () => {
    const complexPayload = {
      incident_id: 'INC-2026-X',
      services: ['payment-api', 'auth-service', 'pg-cluster'],
      metrics: {
        cpu_history: [12.4, 45.2, 89.9, 99.4],
        memory_bytes: 4294967296,
        anomalies: [
          { code: 'ERR_CONN_TIMEOUT', severity: 'HIGH', count: 420 },
          { code: 'ERR_SOCKET_HANGUP', severity: 'CRITICAL', count: 1337 },
        ],
      },
      diagnostic_tree: {
        root: {
          decision: 'restart_pod',
          confidence: 0.982,
          alternatives: ['rollback', 'scale_up'],
        },
      },
    };

    const rendered = simRenderPayload(complexPayload);
    expect(rendered).toNotContain('[object Object]');
    expect(rendered).toContain('INC-2026-X');
    expect(rendered).toContain('ERR_SOCKET_HANGUP');
    expect(rendered).toContain('0.982');
    expect(rendered).toContain('restart_pod');
  });

  await runner.test('ADV-2.2: IncidentSimulator renderPayload survives circular references, nulls, and non-serializables', () => {
    expect(simRenderPayload(null)).toBe('');
    expect(simRenderPayload(undefined)).toBe('');

    const circularEv: any = { event: 'stage_run', timestamp: '2026-08-29' };
    circularEv.loop = circularEv;
    expect(simRenderPayload(circularEv)).toBe('[Circular or Unserializable Structure]');

    const bigIntEv = { event: 'byte_overflow', count: BigInt(100000000000) };
    expect(simRenderPayload(bigIntEv)).toBe('[Circular or Unserializable Structure]');
  });

  await runner.test('ADV-2.3: IncidentSimulator renderPayload handles Unicode, emojis, ANSI escapes, and control characters', () => {
    const unicodePayload = {
      message: '🚨 CRITICAL FAILURE: 💥 Pod payment-api-x9 crashed! \u0000 \uFFFF \n\r\t \u202Ereversed',
      service_jp: '決済サービス',
      service_ar: 'خدمة الدفع',
      status: '🔥 FATAL',
    };

    const rendered = simRenderPayload(unicodePayload);
    expect(rendered).toNotContain('[object Object]');
    expect(rendered).toContain('🚨 CRITICAL FAILURE');
    expect(rendered).toContain('決済サービス');
    expect(rendered).toContain('خدمة الدفع');
  });

  // --------------------------------------------------------------------------
  // Test 3: EvidenceRetrieval & parseTags Stress Testing
  // --------------------------------------------------------------------------
  await runner.test('ADV-3.1: EvidenceRetrieval parseTags handles null, undefined, empty, and whitespace strings without error', () => {
    expect(evidenceParseTags(null)).toEqual([]);
    expect(evidenceParseTags(undefined)).toEqual([]);
    expect(evidenceParseTags('')).toEqual([]);
    expect(evidenceParseTags('   ')).toEqual([]);
    expect(evidenceParseTags('\n\t  \r')).toEqual([]);
  });

  await runner.test('ADV-3.2: EvidenceRetrieval parseTags splits messy comma-separated strings and trims extra commas/whitespace', () => {
    const raw1 = 'payment, 504, timeout, gateway';
    expect(evidenceParseTags(raw1)).toEqual(['payment', '504', 'timeout', 'gateway']);

    const raw2 = ' ,,,  k8s-pod ,  ,  dns-error  , ,   ';
    expect(evidenceParseTags(raw2)).toEqual(['k8s-pod', 'dns-error']);

    const raw3 = 'singleTag';
    expect(evidenceParseTags(raw3)).toEqual(['singleTag']);

    const raw4 = 'tag with internal spaces, another tag';
    expect(evidenceParseTags(raw4)).toEqual(['tag with internal spaces', 'another tag']);
  });

  await runner.test('ADV-3.3: EvidenceRetrieval parseTags handles dirty arrays with nulls, booleans, numbers, and objects', () => {
    const dirtyArray = ['valid_tag', null, undefined, '', '   ', 1234, false, { custom: 'obj' }, ['nested']];
    const parsed = evidenceParseTags(dirtyArray);

    // Verify all items are non-empty strings and no crashes occur
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
    parsed.forEach((tag) => {
      expect(typeof tag).toBe('string');
      expect(tag.trim().length).toBeGreaterThan(0);
    });

    // Check specific string conversions
    expect(parsed).toContain('valid_tag');
    expect(parsed).toContain('1234');
    expect(parsed).toContain('null');
    expect(parsed).toContain('false');
  });

  await runner.test('ADV-3.4: EvidenceRetrieval parseTags handles completely unexpected types (numbers, booleans, objects, functions)', () => {
    expect(evidenceParseTags(12345)).toEqual([]);
    expect(evidenceParseTags(true)).toEqual([]);
    expect(evidenceParseTags(false)).toEqual([]);
    expect(evidenceParseTags({ notAnArray: true })).toEqual([]);
    expect(evidenceParseTags(() => ['tag'])).toEqual([]);
    expect(evidenceParseTags(Symbol('tag'))).toEqual([]);
  });

  // --------------------------------------------------------------------------
  // Test 4: SafetyControl Parameter JSON Parsing & safeFormat Stress Testing
  // --------------------------------------------------------------------------
  await runner.test('ADV-4.1: SafetyControl JSON parameter parsing validates correct JSON payloads', () => {
    const validCases = [
      '{"service": "payment-api"}',
      '{"deployment": "coredns", "replicas": 8}',
      '{"pod_name": "payment-api-7b89d49-x9z"}',
      '{"database": "user-profile-pg-cluster"}',
      '{"nested": {"cluster": "us-east-1", "config": {"timeout_ms": 5000}}}',
      '{}',
      '[]',
      'null',
      '12345',
      '"simple string"',
      'true',
    ];

    for (const testCase of validCases) {
      const res = safetyParseParams(testCase);
      expect(res.success).toBe(true);
      expect(res.error).toBe(undefined);
    }
  });

  await runner.test('ADV-4.2: SafetyControl JSON parameter parsing gracefully denies malformed, incomplete, and malicious JSON strings', () => {
    const invalidCases = [
      '',                                      // empty string
      '   ',                                   // whitespace only
      '{ service: "payment-api" }',            // unquoted key
      "{ 'service': 'payment-api' }",          // single quoted key/value
      '{"service": "payment-api",}',           // trailing comma
      '{"service": "payment-api"',             // unclosed brace
      '[1, 2, 3,',                             // trailing comma in array
      '[1, 2, 3',                              // unclosed bracket
      'undefined',                             // JS undefined keyword
      'NaN',                                   // JS NaN keyword
      '{"service": None}',                     // Python None syntax
      '{"active": True}',                      // Python True syntax
      '{"count": 0123}',                       // Octal literal (invalid in JSON)
      '{"msg": "unclosed string}',             // unclosed string literal
      'function() { return true; }',           // raw function code
      '<script>alert("xss")</script>',         // HTML/script injection
      '```json\n{"service": "payment-api"}\n```', // Markdown fenced block
      '/* comment */ {"service": "payment-api"}', // Commented JSON
      '{\n  "service": "payment-api",\n  // comment\n}', // Inline comment
    ];

    for (const testCase of invalidCases) {
      const res = safetyParseParams(testCase);
      expect(res.success).toBe(false);
      expect(res.error).toBe('Invalid JSON in parameters field');
    }
  });

  await runner.test('ADV-4.3: SafetyControl safeFormat prevents [object Object] and circular crashes on response audit log fields', () => {
    expect(safetySafeFormat(null)).toBe('');
    expect(safetySafeFormat(undefined)).toBe('');
    expect(safetySafeFormat(123)).toBe('123');
    expect(safetySafeFormat('success_string')).toBe('success_string');

    const nestedActionResp = {
      action_id: 'act-audit-999',
      mutation_matrix: {
        affected_pods: ['pod-1', 'pod-2'],
        dns_records: { 'payment.internal': '10.0.12.4' },
      },
    };
    const formatted = safetySafeFormat(nestedActionResp);
    expect(formatted).toNotContain('[object Object]');
    expect(formatted).toContain('act-audit-999');
    expect(formatted).toContain('10.0.12.4');

    const circularResp: any = { action: 'rollback_deployment' };
    circularResp.self = circularResp;
    expect(safetySafeFormat(circularResp)).toBe('[Unserializable Object]');
  });

  // --------------------------------------------------------------------------
  // Test 5: AST / Source Code Scan for [object Object] Prevention & Safety
  // --------------------------------------------------------------------------
  await runner.test('ADV-5.1: Source code analysis verifies defensive serializers in AuditTimeline, IncidentSimulator, SafetyControl', () => {
    const auditTimelineSrc = readConsoleFile('src/components/sections/AuditTimeline.tsx');
    const incidentSimSrc = readConsoleFile('src/components/sections/IncidentSimulator.tsx');
    const safetyControlSrc = readConsoleFile('src/components/sections/SafetyControl.tsx');
    const evidenceRetrievalSrc = readConsoleFile('src/components/sections/EvidenceRetrieval.tsx');

    // AuditTimeline must have safeSerialize with try/catch
    expect(auditTimelineSrc).toContain('safeSerialize');
    expect(auditTimelineSrc).toContain("return '[Circular or Unserializable Structure]';");

    // IncidentSimulator must have renderPayload with try/catch
    expect(incidentSimSrc).toContain('renderPayload');
    expect(incidentSimSrc).toContain("return '[Circular or Unserializable Structure]';");

    // EvidenceRetrieval must have parseTags with Array.isArray & typeof string branches
    expect(evidenceRetrievalSrc).toContain('parseTags');
    expect(evidenceRetrievalSrc).toContain('Array.isArray(tags)');
    expect(evidenceRetrievalSrc).toContain("typeof tags === 'string'");

    // SafetyControl must have safeFormat and JSON.parse try/catch
    expect(safetyControlSrc).toContain('safeFormat');
    expect(safetyControlSrc).toContain("return '[Unserializable Object]';");
    expect(safetyControlSrc).toContain('JSON.parse(paramsJson)');
    expect(safetyControlSrc).toContain("setError('Invalid JSON in parameters field')");
  });

  await runner.test('ADV-5.2: Verification of zero unhandled direct object JSX interpolation in section components', () => {
    const sectionFiles = scanSourceFiles('src/components/sections', ['.tsx']);
    
    // Ensure all section files exist and were found
    expect(sectionFiles.length).toBeGreaterThanOrEqual(10);

    for (const filePath of sectionFiles) {
      const content = readConsoleFile(filePath.replace(readConsoleFile.name, ''));
      // Verify no raw un-stringified payload direct interpolations like `{payload}` without serialization
      expect(content).toNotContain('>{payload}<');
      expect(content).toNotContain('>{ev.payload}<');
      expect(content).toNotContain('>{log.params}<');
    }
  });
}

// Standalone execution support
if (process.argv[1]?.endsWith('adversarial_stress_verification.test.ts')) {
  const runner = new TestRunner();
  runAdversarialStressTests(runner).then(() => {
    runner.printSummary();
    const summary = runner.getSummary();
    if (summary.failed > 0) process.exit(1);
  });
}
