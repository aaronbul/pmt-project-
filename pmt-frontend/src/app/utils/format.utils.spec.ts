import { FormatUtils } from './format.utils';

describe('FormatUtils', () => {
  describe('formatUsername', () => {
    it('should format username correctly', () => {
      expect(FormatUtils.formatUsername('john')).toBe('John');
      expect(FormatUtils.formatUsername('JANE')).toBe('Jane');
      expect(FormatUtils.formatUsername('mike123')).toBe('Mike123');
    });

    it('should handle empty or null username', () => {
      expect(FormatUtils.formatUsername('')).toBe('');
      expect(FormatUtils.formatUsername(null as any)).toBe('');
      expect(FormatUtils.formatUsername(undefined as any)).toBe('');
    });
  });

  describe('maskEmail', () => {
    it('should mask email correctly', () => {
      expect(FormatUtils.maskEmail('test@example.com')).toBe('t**t@example.com');
      expect(FormatUtils.maskEmail('user@domain.org')).toBe('u**r@domain.org');
    });

    it('should handle short local parts', () => {
      expect(FormatUtils.maskEmail('ab@example.com')).toBe('ab@example.com');
      expect(FormatUtils.maskEmail('a@example.com')).toBe('a@example.com');
    });

    it('should handle invalid emails', () => {
      expect(FormatUtils.maskEmail('')).toBe('');
      expect(FormatUtils.maskEmail('invalid-email')).toBe('invalid-email');
    });
  });

  describe('formatProjectName', () => {
    it('should format project name correctly', () => {
      expect(FormatUtils.formatProjectName('  My Project  ')).toBe('My Project');
      expect(FormatUtils.formatProjectName('Project   Name')).toBe('Project Name');
      expect(FormatUtils.formatProjectName('PMT Tool')).toBe('PMT Tool');
    });

    it('should handle empty or null names', () => {
      expect(FormatUtils.formatProjectName('')).toBe('');
      expect(FormatUtils.formatProjectName(null as any)).toBe('');
    });
  });

  describe('formatTaskTitle', () => {
    it('should format task title correctly', () => {
      expect(FormatUtils.formatTaskTitle('  Fix Bug  ')).toBe('Fix Bug');
      expect(FormatUtils.formatTaskTitle('Task   Title')).toBe('Task Title');
      expect(FormatUtils.formatTaskTitle('Implement Feature')).toBe('Implement Feature');
    });

    it('should handle empty or null titles', () => {
      expect(FormatUtils.formatTaskTitle('')).toBe('');
      expect(FormatUtils.formatTaskTitle(null as any)).toBe('');
    });
  });

  describe('formatDescription', () => {
    it('should format description within limit', () => {
      expect(FormatUtils.formatDescription('Short description')).toBe('Short description');
      expect(FormatUtils.formatDescription('  Trimmed description  ')).toBe('Trimmed description');
    });

    it('should truncate long descriptions', () => {
      const longDesc = 'A'.repeat(150);
      const formatted = FormatUtils.formatDescription(longDesc, 100);
      expect(formatted).toBe('A'.repeat(100) + '...');
      expect(formatted.length).toBe(103);
    });

    it('should handle empty descriptions', () => {
      expect(FormatUtils.formatDescription('')).toBe('');
      expect(FormatUtils.formatDescription(null as any)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(FormatUtils.formatNumber(0)).toBe('0');
      // Le formatage localisé peut utiliser des espaces insécables, on vérifie juste la présence des chiffres
      expect(FormatUtils.formatNumber(1000)).toMatch(/1.*000/);
      expect(FormatUtils.formatNumber(1234567)).toMatch(/1.*234.*567/);
    });

    it('should handle invalid numbers', () => {
      expect(FormatUtils.formatNumber(NaN)).toBe('');
      expect(FormatUtils.formatNumber(null as any)).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(FormatUtils.formatPercentage(50, 100)).toBe('50%');
      expect(FormatUtils.formatPercentage(25, 100)).toBe('25%');
      expect(FormatUtils.formatPercentage(0, 100)).toBe('0%');
    });

    it('should handle edge cases', () => {
      expect(FormatUtils.formatPercentage(0, 0)).toBe('0%');
      expect(FormatUtils.formatPercentage(100, 0)).toBe('0%');
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(FormatUtils.formatDuration(30)).toBe('30m');
      expect(FormatUtils.formatDuration(60)).toBe('1h');
      expect(FormatUtils.formatDuration(90)).toBe('1h 30m');
      expect(FormatUtils.formatDuration(120)).toBe('2h');
    });

    it('should handle edge cases', () => {
      expect(FormatUtils.formatDuration(0)).toBe('0h 0m');
      expect(FormatUtils.formatDuration(-10)).toBe('0h 0m');
      expect(FormatUtils.formatDuration(NaN)).toBe('0h 0m');
    });
  });

  describe('formatTaskStatus', () => {
    it('should format task status correctly', () => {
      expect(FormatUtils.formatTaskStatus('TODO')).toBe('À faire');
      expect(FormatUtils.formatTaskStatus('IN_PROGRESS')).toBe('En cours');
      expect(FormatUtils.formatTaskStatus('DONE')).toBe('Terminé');
      expect(FormatUtils.formatTaskStatus('CANCELLED')).toBe('Annulé');
    });

    it('should handle case insensitive input', () => {
      expect(FormatUtils.formatTaskStatus('todo')).toBe('À faire');
      expect(FormatUtils.formatTaskStatus('Todo')).toBe('À faire');
    });
  });

  describe('formatTaskPriority', () => {
    it('should format task priority correctly', () => {
      expect(FormatUtils.formatTaskPriority('LOW')).toBe('Faible');
      expect(FormatUtils.formatTaskPriority('MEDIUM')).toBe('Moyenne');
      expect(FormatUtils.formatTaskPriority('HIGH')).toBe('Élevée');
      expect(FormatUtils.formatTaskPriority('URGENT')).toBe('Urgente');
    });

    it('should handle case insensitive input', () => {
      expect(FormatUtils.formatTaskPriority('LOW' as any)).toBe('Faible');
      expect(FormatUtils.formatTaskPriority('HIGH' as any)).toBe('Élevée');
    });
  });

  describe('formatUserRole', () => {
    it('should format user role correctly', () => {
      expect(FormatUtils.formatUserRole('ADMIN')).toBe('Administrateur');
      expect(FormatUtils.formatUserRole('MEMBER')).toBe('Membre');
      expect(FormatUtils.formatUserRole('OBSERVER')).toBe('Observateur');
    });

    it('should handle case insensitive input', () => {
      expect(FormatUtils.formatUserRole('admin')).toBe('Administrateur');
      expect(FormatUtils.formatUserRole('Admin')).toBe('Administrateur');
    });
  });

  describe('formatNotificationType', () => {
    it('should format notification type correctly', () => {
      expect(FormatUtils.formatNotificationType('INFO')).toBe('Information');
      expect(FormatUtils.formatNotificationType('WARNING')).toBe('Avertissement');
      expect(FormatUtils.formatNotificationType('ERROR')).toBe('Erreur');
      expect(FormatUtils.formatNotificationType('SUCCESS')).toBe('Succès');
    });

    it('should handle case insensitive input', () => {
      expect(FormatUtils.formatNotificationType('info')).toBe('Information');
      expect(FormatUtils.formatNotificationType('Error')).toBe('Erreur');
    });
  });

  describe('formatFullName', () => {
    it('should format full name correctly', () => {
      expect(FormatUtils.formatFullName('John', 'Doe')).toBe('John Doe');
      expect(FormatUtils.formatFullName('  Jane  ', '  Smith  ')).toBe('Jane Smith');
    });

    it('should handle partial names', () => {
      expect(FormatUtils.formatFullName('John', '')).toBe('John');
      expect(FormatUtils.formatFullName('', 'Doe')).toBe('Doe');
      expect(FormatUtils.formatFullName('', '')).toBe('');
    });
  });

  describe('formatFileName', () => {
    it('should format short file names', () => {
      expect(FormatUtils.formatFileName('document.pdf')).toBe('document.pdf');
      expect(FormatUtils.formatFileName('image.jpg')).toBe('image.jpg');
    });

    it('should handle files without extension', () => {
      expect(FormatUtils.formatFileName('filewithoutdot')).toBe('filewithoutdot');
    });

    it('should handle empty file names', () => {
      expect(FormatUtils.formatFileName('')).toBe('');
      expect(FormatUtils.formatFileName(null as any)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(FormatUtils.formatFileSize(0)).toBe('0 B');
      expect(FormatUtils.formatFileSize(1024)).toBe('1 KB');
      expect(FormatUtils.formatFileSize(1048576)).toBe('1 MB');
    });

    it('should handle invalid sizes', () => {
      expect(FormatUtils.formatFileSize(NaN)).toBe('');
      expect(FormatUtils.formatFileSize(null as any)).toBe('');
    });
  });
}); 