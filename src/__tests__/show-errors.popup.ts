import { DevErrorHandler } from '../dev-error-handler';

describe('DevErrorHandler', () => {
  test('when calling with no config, should set default', () => {
    const errorHandler = new DevErrorHandler();
    expect((errorHandler as any).config.appendToElement).toBe('body');
  });
});
