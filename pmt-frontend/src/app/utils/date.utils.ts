export class DateUtils {
  /**
   * Formate une date en format français
   */
  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formate une date avec l'heure
   */
  static formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Vérifie si une date est dans le passé
   */
  static isPast(date: Date | string): boolean {
    const d = new Date(date);
    const now = new Date();
    return d < now;
  }

  /**
   * Vérifie si une date est dans le futur
   */
  static isFuture(date: Date | string): boolean {
    const d = new Date(date);
    const now = new Date();
    return d > now;
  }

  /**
   * Calcule la différence en jours entre deux dates
   */
  static getDaysDifference(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Vérifie si une date est aujourd'hui
   */
  static isToday(date: Date | string): boolean {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  /**
   * Convertit une chaîne ISO en objet Date
   */
  static parseISO(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Vérifie si une chaîne est une date valide
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
} 