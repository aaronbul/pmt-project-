export class ValidationUtils {
  /**
   * Valide une adresse email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un nom d'utilisateur (3-20 caractères, alphanumérique et underscore)
   */
  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Valide un mot de passe (minimum 6 caractères)
   */
  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * Valide un mot de passe fort (minimum 8 caractères, avec majuscule, minuscule, chiffre)
   */
  static isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Valide un titre de projet ou de tâche (non vide, max 100 caractères)
   */
  static isValidTitle(title: string): boolean {
    return title.trim().length > 0 && title.trim().length <= 100;
  }

  /**
   * Valide une description (max 500 caractères)
   */
  static isValidDescription(description: string): boolean {
    return description.length <= 500;
  }

  /**
   * Valide un nom de projet (non vide, max 50 caractères)
   */
  static isValidProjectName(name: string): boolean {
    return name.trim().length > 0 && name.trim().length <= 50;
  }

  /**
   * Valide une date de début de projet (doit être dans le futur ou aujourd'hui)
   */
  static isValidProjectStartDate(date: string): boolean {
    const startDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return startDate >= today;
  }

  /**
   * Valide une date d'échéance de tâche (doit être dans le futur)
   */
  static isValidTaskDueDate(date: string): boolean {
    const dueDate = new Date(date);
    const now = new Date();
    return dueDate > now;
  }

  /**
   * Valide un ID numérique
   */
  static isValidId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }

  /**
   * Valide un statut de tâche
   */
  static isValidTaskStatus(status: string): boolean {
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
    return validStatuses.includes(status.toUpperCase());
  }

  /**
   * Valide une priorité de tâche
   */
  static isValidTaskPriority(priority: string): boolean {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    return validPriorities.includes(priority.toUpperCase());
  }

  /**
   * Valide un rôle d'utilisateur
   */
  static isValidUserRole(role: string): boolean {
    const validRoles = ['ADMIN', 'MEMBER', 'OBSERVER'];
    return validRoles.includes(role.toUpperCase());
  }

  /**
   * Valide un type de notification
   */
  static isValidNotificationType(type: string): boolean {
    const validTypes = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'];
    return validTypes.includes(type.toUpperCase());
  }

  /**
   * Valide une chaîne non vide
   */
  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  /**
   * Valide une longueur de chaîne
   */
  static hasValidLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }

  /**
   * Valide un nombre positif
   */
  static isPositiveNumber(value: number): boolean {
    return typeof value === 'number' && value > 0;
  }

  /**
   * Valide un nombre dans une plage
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return typeof value === 'number' && value >= min && value <= max;
  }
} 