import { ValidationUtils } from './validation.utils';

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'admin@company.com'
      ];

      validEmails.forEach(email => {
        expect(ValidationUtils.isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        '',
        'test@example'
      ];

      invalidEmails.forEach(email => {
        expect(ValidationUtils.isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      const validUsernames = [
        'user123',
        'test_user',
        'admin',
        'john_doe'
      ];

      validUsernames.forEach(username => {
        expect(ValidationUtils.isValidUsername(username)).toBe(true);
      });
    });

    it('should reject invalid usernames', () => {
      const invalidUsernames = [
        'ab', // too short
        'verylongusername123456789', // too long
        'user-name', // contains hyphen
        'user.name', // contains dot
        'user name', // contains space
        '',
        'user@name' // contains special character
      ];

      invalidUsernames.forEach(username => {
        expect(ValidationUtils.isValidUsername(username)).toBe(false);
      });
    });
  });

  describe('isValidPassword', () => {
    it('should validate passwords with 6 or more characters', () => {
      const validPasswords = [
        'password',
        '123456',
        'pass123'
      ];

      validPasswords.forEach(password => {
        expect(ValidationUtils.isValidPassword(password)).toBe(true);
      });
    });

    it('should reject passwords with less than 6 characters', () => {
      const invalidPasswords = [
        '12345',
        'pass',
        'abc',
        ''
      ];

      invalidPasswords.forEach(password => {
        expect(ValidationUtils.isValidPassword(password)).toBe(false);
      });
    });
  });

  describe('isValidTitle', () => {
    it('should validate correct titles', () => {
      const validTitles = [
        'Project Title',
        'Task Name',
        'A'
      ];

      validTitles.forEach(title => {
        expect(ValidationUtils.isValidTitle(title)).toBe(true);
      });
    });

    it('should reject invalid titles', () => {
      const invalidTitles = [
        '', // empty
        '   ', // only spaces
        'A'.repeat(101) // too long
      ];

      invalidTitles.forEach(title => {
        expect(ValidationUtils.isValidTitle(title)).toBe(false);
      });
    });
  });

  describe('isValidId', () => {
    it('should validate positive integers', () => {
      const validIds = [1, 2, 100, 999999];

      validIds.forEach(id => {
        expect(ValidationUtils.isValidId(id)).toBe(true);
      });
    });

    it('should reject invalid ids', () => {
      const invalidIds = [0, -1, -100, 1.5, NaN];

      invalidIds.forEach(id => {
        expect(ValidationUtils.isValidId(id)).toBe(false);
      });
    });
  });

  describe('isNotEmpty', () => {
    it('should validate non-empty strings', () => {
      const validStrings = ['test', 'hello world', '123', 'a'];

      validStrings.forEach(str => {
        expect(ValidationUtils.isNotEmpty(str)).toBe(true);
      });
    });

    it('should reject empty strings', () => {
      const invalidStrings = ['', '   ', '\t', '\n'];

      invalidStrings.forEach(str => {
        expect(ValidationUtils.isNotEmpty(str)).toBe(false);
      });
    });
  });
}); 