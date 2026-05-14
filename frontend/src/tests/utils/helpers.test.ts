import { describe, it, expect } from 'vitest';

// 简单的工具函数示例
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(100)).toBe('¥100.00');
      expect(formatPrice(99.9)).toBe('¥99.90');
      expect(formatPrice(0)).toBe('¥0.00');
      expect(formatPrice(1234.56)).toBe('¥1234.56');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-05-14');
      const formatted = formatDate(date);
      expect(formatted).toContain('2026');
      expect(formatted).toContain('5');
      expect(formatted).toContain('14');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a long text that needs to be truncated';
      expect(truncateText(text, 20)).toBe('This is a long text ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncateText(text, 20)).toBe('Short');
    });

    it('should handle exact length', () => {
      const text = 'Exactly 20 chars!!';
      expect(truncateText(text, 18)).toBe('Exactly 20 chars!!');
    });
  });
});
