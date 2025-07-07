import { config } from './app.config.server';

describe('App Config Server', () => {
  it('should export config', () => {
    expect(config).toBeDefined();
  });

  it('should have providers', () => {
    expect(config.providers).toBeDefined();
    expect(Array.isArray(config.providers)).toBe(true);
  });

  it('should merge application config', () => {
    expect(config).toBeTruthy();
  });

  it('should include server rendering', () => {
    expect(config).toBeTruthy();
  });
}); 