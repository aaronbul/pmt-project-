import { App } from './app';

describe('App', () => {
  let component: App;

  beforeEach(() => {
    component = new App();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title property', () => {
    expect((component as any).title).toBe('pmt-frontend');
  });

  it('should have correct selector', () => {
    expect(component.constructor.name).toBe('App2');
  });

  it('should be a component', () => {
    expect(component).toBeInstanceOf(App);
  });
}); 