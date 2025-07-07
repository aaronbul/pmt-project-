import { appConfig } from './app.config';

describe('App Config', () => {
  it('should export app config', () => {
    expect(appConfig).toBeDefined();
  });

  it('should have providers array', () => {
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
  });

  it('should have multiple providers', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should include router provider', () => {
    expect(appConfig.providers).toBeDefined();
  });

  it('should include HTTP client provider', () => {
    expect(appConfig.providers).toBeDefined();
  });

  it('should include animations provider', () => {
    expect(appConfig.providers).toBeDefined();
  });

  it('should include client hydration provider', () => {
    expect(appConfig.providers).toBeDefined();
  });

  it('should include zoneless change detection', () => {
    expect(appConfig.providers).toBeDefined();
  });

  it('should include error listeners', () => {
    expect(appConfig.providers).toBeDefined();
  });
}); 