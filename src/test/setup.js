import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Global test setup
beforeEach(() => {
  // Clear any mocks between tests
  vi.clearAllMocks?.();
});
