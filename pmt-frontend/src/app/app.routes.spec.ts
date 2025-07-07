import { routes } from './app.routes';

describe('App Routes', () => {
  it('should export routes', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should have root redirect', () => {
    const rootRoute = routes.find(route => route.path === '');
    expect(rootRoute).toBeDefined();
    expect(rootRoute?.redirectTo).toBe('/login');
  });

  it('should have login route', () => {
    const loginRoute = routes.find(route => route.path === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.loadComponent).toBeDefined();
  });

  it('should have register route', () => {
    const registerRoute = routes.find(route => route.path === 'register');
    expect(registerRoute).toBeDefined();
    expect(registerRoute?.loadComponent).toBeDefined();
  });

  it('should have dashboard route with children', () => {
    const dashboardRoute = routes.find(route => route.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.loadComponent).toBeDefined();
    expect(dashboardRoute?.children).toBeDefined();
    expect(Array.isArray(dashboardRoute?.children)).toBe(true);
  });

  it('should have dashboard children routes', () => {
    const dashboardRoute = routes.find(route => route.path === 'dashboard');
    const children = dashboardRoute?.children || [];
    
    expect(children.length).toBeGreaterThan(0);
    
    // Check for key child routes
    const projectRoutes = children.filter(route => route.path?.includes('projects'));
    const taskRoutes = children.filter(route => route.path?.includes('tasks'));
    const notificationRoutes = children.filter(route => route.path?.includes('notifications'));
    
    expect(projectRoutes.length).toBeGreaterThan(0);
    expect(taskRoutes.length).toBeGreaterThan(0);
    expect(notificationRoutes.length).toBeGreaterThan(0);
  });

  it('should have wildcard route', () => {
    const wildcardRoute = routes.find(route => route.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('/login');
  });

  it('should have valid route structure', () => {
    routes.forEach(route => {
      expect(route.path).toBeDefined();
      if (route.children) {
        expect(Array.isArray(route.children)).toBe(true);
        route.children.forEach(child => {
          expect(child.path).toBeDefined();
        });
      }
    });
  });

  it('should have lazy loaded components', () => {
    routes.forEach(route => {
      if (route.loadComponent) {
        expect(typeof route.loadComponent).toBe('function');
      }
      if (route.children) {
        route.children.forEach(child => {
          if (child.loadComponent) {
            expect(typeof child.loadComponent).toBe('function');
          }
        });
      }
    });
  });
}); 