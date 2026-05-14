import { AppError } from '../../utils/errors';

describe('AppError', () => {
  it('should create error with default values', () => {
    const error = new AppError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should create error with custom status code', () => {
    const error = new AppError('Not found', 404);

    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should maintain proper prototype chain', () => {
    const error = new AppError('Test error');

    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('should be throwable', () => {
    expect(() => {
      throw new AppError('Test error', 400);
    }).toThrow(AppError);
  });

  it('should be catchable as Error', () => {
    try {
      throw new AppError('Test error', 500);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as AppError).statusCode).toBe(500);
    }
  });
});
