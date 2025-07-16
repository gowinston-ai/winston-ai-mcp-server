// Test setup file
import dotenv from 'dotenv';

// Set test environment
process.env.NODE_ENV = 'test';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default test API key if not provided
if (!process.env.WINSTONAI_API_KEY) {
  process.env.WINSTONAI_API_KEY = 'test_api_key_for_testing';
}

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock process.exit to prevent tests from exiting
const originalExit = process.exit;
process.exit = jest.fn() as any; 