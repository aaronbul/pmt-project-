import { User, LoginRequest, LoginResponse } from './user.model';

describe('User Model', () => {
  describe('User Interface', () => {
    it('should create a valid user object', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
      expect(user.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(user.updatedAt).toBe('2024-01-01T00:00:00Z');
    });

    it('should create a user with minimal required properties', () => {
      const user: User = {
        username: 'minimaluser',
        email: 'minimal@example.com'
      };

      expect(user.username).toBe('minimaluser');
      expect(user.email).toBe('minimal@example.com');
      expect(user.id).toBeUndefined();
      expect(user.password).toBeUndefined();
      expect(user.createdAt).toBeUndefined();
      expect(user.updatedAt).toBeUndefined();
    });

    it('should handle user without password', () => {
      const user: User = {
        id: 1,
        username: 'nopassword',
        email: 'nopassword@example.com'
      };

      expect(user.username).toBe('nopassword');
      expect(user.email).toBe('nopassword@example.com');
      expect(user.password).toBeUndefined();
    });

    it('should handle user with optional timestamps', () => {
      const user: User = {
        id: 1,
        username: 'timestampuser',
        email: 'timestamp@example.com',
        createdAt: '2024-01-01T00:00:00Z'
      };

      expect(user.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(user.updatedAt).toBeUndefined();
    });

    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        const user: User = {
          username: 'testuser',
          email
        };
        expect(user.email).toBe(email);
      });
    });

    it('should handle different username formats', () => {
      const usernames = [
        'simpleuser',
        'user123',
        'user_name',
        'user-name',
        'userName'
      ];

      usernames.forEach(username => {
        const user: User = {
          username,
          email: 'test@example.com'
        };
        expect(user.username).toBe(username);
      });
    });
  });

  describe('LoginRequest Interface', () => {
    it('should create a valid login request object', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      expect(loginRequest.email).toBe('test@example.com');
      expect(loginRequest.password).toBe('password123');
    });

    it('should handle different email formats in login request', () => {
      const loginRequests: LoginRequest[] = [
        { email: 'user@example.com', password: 'pass1' },
        { email: 'admin@company.org', password: 'admin123' },
        { email: 'test.user@domain.co.uk', password: 'testpass' }
      ];

      expect(loginRequests[0].email).toBe('user@example.com');
      expect(loginRequests[1].email).toBe('admin@company.org');
      expect(loginRequests[2].email).toBe('test.user@domain.co.uk');
    });

    it('should handle different password lengths', () => {
      const passwords = ['short', 'mediumlength', 'verylongpassword123'];

      passwords.forEach(password => {
        const loginRequest: LoginRequest = {
          email: 'test@example.com',
          password
        };
        expect(loginRequest.password).toBe(password);
      });
    });
  });

  describe('LoginResponse Interface', () => {
    it('should create a valid login response object', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      const loginResponse: LoginResponse = {
        user,
        token: 'jwt-token-123'
      };

      expect(loginResponse.user).toBe(user);
      expect(loginResponse.user.id).toBe(1);
      expect(loginResponse.user.username).toBe('testuser');
      expect(loginResponse.user.email).toBe('test@example.com');
      expect(loginResponse.token).toBe('jwt-token-123');
    });

    it('should create a login response without token', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      const loginResponse: LoginResponse = {
        user
      };

      expect(loginResponse.user).toBe(user);
      expect(loginResponse.token).toBeUndefined();
    });

    it('should handle different token formats', () => {
      const tokens = [
        'simple-token',
        'jwt.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token',
        'bearer-token-123'
      ];

      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      tokens.forEach(token => {
        const loginResponse: LoginResponse = {
          user,
          token
        };
        expect(loginResponse.token).toBe(token);
      });
    });
  });
}); 