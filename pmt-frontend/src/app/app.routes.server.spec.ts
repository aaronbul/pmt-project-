import { serverRoutes } from './app.routes.server';
import { RenderMode } from '@angular/ssr';

describe('App Routes Server', () => {
  it('should export server routes', () => {
    expect(serverRoutes).toBeDefined();
    expect(Array.isArray(serverRoutes)).toBe(true);
  });

  it('should have catch-all route', () => {
    expect(serverRoutes.length).toBeGreaterThan(0);
    const catchAllRoute = serverRoutes.find(route => route.path === '**');
    expect(catchAllRoute).toBeDefined();
  });

  it('should use prerender mode', () => {
    const catchAllRoute = serverRoutes.find(route => route.path === '**');
    expect(catchAllRoute?.renderMode).toBe(RenderMode.Prerender);
  });

  it('should have valid route structure', () => {
    serverRoutes.forEach(route => {
      expect(route.path).toBeDefined();
      expect(route.renderMode).toBeDefined();
    });
  });
}); 