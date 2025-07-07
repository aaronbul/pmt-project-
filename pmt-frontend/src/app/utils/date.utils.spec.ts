import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = DateUtils.formatDate(date);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should format a date string correctly', () => {
      const dateString = '2024-01-15';
      const formatted = DateUtils.formatDate(dateString);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('isPast', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(DateUtils.isPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2030-01-01');
      expect(DateUtils.isPast(futureDate)).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date('2030-01-01');
      expect(DateUtils.isFuture(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(DateUtils.isFuture(pastDate)).toBe(false);
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate correct difference between dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-05');
      const difference = DateUtils.getDaysDifference(date1, date2);
      expect(difference).toBe(4);
    });

    it('should return 0 for same dates', () => {
      const date = new Date('2024-01-01');
      const difference = DateUtils.getDaysDifference(date, date);
      expect(difference).toBe(0);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(DateUtils.isToday(today)).toBe(true);
    });

    it('should return false for other dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateUtils.isToday(yesterday)).toBe(false);
    });
  });

  describe('parseISO', () => {
    it('should parse ISO date string correctly', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const parsed = DateUtils.parseISO(dateString);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(0); // January is 0
      expect(parsed.getDate()).toBe(15);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      const validDates = [
        '2024-01-15',
        '2024-01-15T10:30:00Z',
        '2024/01/15'
      ];

      validDates.forEach(date => {
        expect(DateUtils.isValidDate(date)).toBe(true);
      });
    });

    it('should return false for invalid dates', () => {
      const invalidDates = [
        'invalid-date',
        '2024-13-45',
        'not-a-date',
        ''
      ];

      invalidDates.forEach(date => {
        expect(DateUtils.isValidDate(date)).toBe(false);
      });
    });
  });
}); 