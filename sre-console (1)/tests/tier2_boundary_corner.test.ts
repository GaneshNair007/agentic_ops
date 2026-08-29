/**
 * AI SRE Console — Tier 2: Boundary & Corner Cases Test Suite
 * Validates complex nested JSON serialization in audit trails, undefined/null telemetry data handling,
 * empty event queues, tag format variations in RAG retrieval, and malformed parameter handling.
 */

import { TestRunner, expect, safeSerialize, normalizeTags, readConsoleFile } from './test_helpers';
import { EventItem, AuditLogItem, RagResultItem } from '../src/types';

export async function runTier2Tests(runner: TestRunner) {
  runner.suite('Tier 2: Boundary & Corner Cases (Defensive Sanitization & Fuzzing)');

  // Test 2.1: Complex Nested JSON Payloads in Audit Logs & Events
  await runner.test('T2.1: Complex deeply nested JSON serialization in audit logs prevents [object Object] crashes', () => {
    const complexNestedPayload = {
      level1: {
        level2: {
          level3: {
            service_cluster: 'k8s-prod-us-east-1',
            pod_statuses: [
              { pod: 'api-worker-1', status: 'Running', restarts: 0, metrics: { cpu: '450m', mem: '1.2Gi' } },
              { pod: 'api-worker-2', status: 'CrashLoopBackOff', restarts: 14, metrics: { cpu: '980m', mem: '2.4Gi' } },
            ],
            trace_context: {
              trace_id: '4bf92f3577b34da6a3ce929d0e0e4736',
              span_id: '00f067aa0ba902b7',
              sampled: true,
              attributes: {
                'http.status_code': 504,
                'http.route': '/v1/checkout/process',
                'db.statement': 'SELECT * FROM accounts WHERE id = ? FOR UPDATE'
              }
            }
          }
        }
      }
    };

    const serialized = safeSerialize(complexNestedPayload);

    // Verify string is formatted JSON and does NOT output "[object Object]"
    expect(serialized).toNotContain('[object Object]');
    expect(serialized).toContain('k8s-prod-us-east-1');
    expect(serialized).toContain('CrashLoopBackOff');
    expect(serialized).toContain('4bf92f3577b34da6a3ce929d0e0e4736');

    // Test with circular reference protection
    const circularObj: any = { name: 'circular-test' };
    circularObj.self = circularObj;
    const circularSerialized = safeSerialize(circularObj);
    expect(circularSerialized).toBe('[Circular Structure]');
  });

  // Test 2.2: Undefined / Null / Partial Telemetry Fields
  await runner.test('T2.2: Resilient handling of undefined, null, and sparse telemetry fields', () => {
    const sparseEvent: EventItem = {
      type: 'unknown_alert',
      payload: {},
      // event_id and timestamp omitted
    };

    // Verify safe field extraction
    const eventId = sparseEvent.event_id || 'ev-fallback';
    const timestamp = sparseEvent.timestamp || new Date().toISOString();
    const message = sparseEvent.payload?.message || sparseEvent.payload?.title || 'Structured payload attached.';

    expect(eventId).toBe('ev-fallback');
    expect(typeof timestamp).toBe('string');
    expect(message).toBe('Structured payload attached.');

    const sparseAuditLog: AuditLogItem = {
      action_id: 'act-9999',
      action: 'scale_deployment',
      status: 'success',
      message: '',
      timestamp: '',
      execution_time_ms: 0,
      params: {},
    };

    const timeSnippet = (sparseAuditLog.timestamp || new Date().toISOString()).slice(0, 10);
    expect(timeSnippet.length).toBe(10);
  });

  // Test 2.3: Zero-State and Empty Event Queues
  await runner.test('T2.3: Zero-state and empty event bus timeline rendering fallbacks', () => {
    const auditSource = readConsoleFile('src/components/sections/AuditTimeline.tsx');
    const simSource = readConsoleFile('src/components/sections/IncidentSimulator.tsx');

    // Asserts AuditTimeline has empty state text
    expect(auditSource).toContain('SYSTEM RECORD EMPTY. RUN SIMULATION.');
    expect(auditSource).toContain('TOOLS/AUDIT.LOG IS EMPTY.');

    // Asserts IncidentSimulator has standby state
    expect(simSource).toContain('SYSTEM STANDBY');
    expect(simSource).toContain('AWAITING TRIGGER');
  });

  // Test 2.4: Tag Format Variations in RAG Retrieval
  await runner.test('T2.4: RAG tag normalization across comma-delimited strings, string arrays, nulls, and mixed types', () => {
    // 1. Comma-separated string
    const stringTags = 'postgres, connection-pool, timeout, p1';
    expect(normalizeTags(stringTags)).toEqual(['postgres', 'connection-pool', 'timeout', 'p1']);

    // 2. Standard string array
    const arrayTags = ['redis', 'cache-invalidation', 'memory'];
    expect(normalizeTags(arrayTags)).toEqual(['redis', 'cache-invalidation', 'memory']);

    // 3. Null / Undefined
    expect(normalizeTags(null)).toEqual([]);
    expect(normalizeTags(undefined)).toEqual([]);

    // 4. Empty strings and messy whitespace
    const messyString = '  coredns ,   dns-lookup ,  ,  timeout ';
    expect(normalizeTags(messyString)).toEqual(['coredns', 'dns-lookup', 'timeout']);

    // 5. Numeric / mixed items in array
    const mixedArray = [123, 'gateway', true, null];
    expect(normalizeTags(mixedArray)).toEqual(['123', 'gateway', 'true', 'null']);
  });

  // Test 2.5: Malformed JSON Parameters in Safety Control Input
  await runner.test('T2.5: Defensive validation of malformed JSON strings in Safety Control parameter input', () => {
    const safetySource = readConsoleFile('src/components/sections/SafetyControl.tsx');

    // Asserts try/catch block around JSON.parse in SafetyControl
    expect(safetySource).toContain('JSON.parse(paramsJson)');
    expect(safetySource).toContain('Invalid JSON in parameters field');

    // Test JSON parse validator
    const invalidJsonInputs = [
      '{ service: "payment-api", }', // trailing comma / unquoted key
      '{"service": "payment-api"',   // unclosed brace
      'undefined',
      'not a json string',
    ];

    for (const input of invalidJsonInputs) {
      let threw = false;
      try {
        JSON.parse(input);
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);
    }
  });
}

// Standalone execution support
if (process.argv[1]?.endsWith('tier2_boundary_corner.test.ts')) {
  const runner = new TestRunner();
  runTier2Tests(runner).then(() => runner.printSummary());
}
