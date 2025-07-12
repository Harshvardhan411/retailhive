import { logAction } from './logger';

describe('logAction', () => {
  it('logs the action and details to the console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logAction('Test Action', { foo: 'bar' });
    expect(spy).toHaveBeenCalledWith('[LOG] Test Action', { foo: 'bar' });
    spy.mockRestore();
  });

  it('logs the action with no details', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logAction('Test Action');
    expect(spy).toHaveBeenCalledWith('[LOG] Test Action', '');
    spy.mockRestore();
  });
}); 