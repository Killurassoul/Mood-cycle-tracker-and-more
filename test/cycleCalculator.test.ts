import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCycleStatus } from '../src/services/cycleCalculator';
import { CycleRecord } from '../src/types';

test('calculateCycleStatus handles default cycle when no cycles recorded', () => {
  const result = calculateCycleStatus([], 28, 5, new Date('2026-11-09'));
  assert.equal(result.totalCycleLength, 28);
  assert.equal(result.averageCycleLength, 28);
  assert.equal(result.averagePeriodLength, 5);
  assert.ok(result.nextPeriodDate);
  assert.ok(result.ovulationDate);
});

test('calculateCycleStatus correctly calculates menstrual phase on day 2', () => {
  const cycles: CycleRecord[] = [
    {
      id: 'c-1',
      startDate: '2026-11-08',
      periodDuration: 5,
      cycleDuration: 28
    }
  ];
  const result = calculateCycleStatus(cycles, 28, 5, new Date('2026-11-09'));
  assert.equal(result.currentDayOfCycle, 2);
  assert.equal(result.phase, 'menstrual');
});

test('calculateCycleStatus correctly detects delayed period', () => {
  const cycles: CycleRecord[] = [
    {
      id: 'c-old',
      startDate: '2026-10-01',
      periodDuration: 5,
      cycleDuration: 28
    }
  ];
  // 39 days later -> delayed
  const result = calculateCycleStatus(cycles, 28, 5, new Date('2026-11-09'));
  assert.equal(result.isDelayed, true);
  assert.ok(result.daysDelayed > 0);
});
