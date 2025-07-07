export class FormatUtils {
  /**
   * Formate un nom d'utilisateur pour l'affichage
   */
  static formatUsername(username: string): string {
    if (!username) return '';
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  }

  /**
   * Formate un email pour masquer partiellement
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;
    
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Formate un nom de projet pour l'affichage
   */
  static formatProjectName(name: string): string {
    if (!name) return '';
    return name.trim().replace(/\s+/g, ' ');
  }

  /**
   * Formate un titre de tâche pour l'affichage
   */
  static formatTaskTitle(title: string): string {
    if (!title) return '';
    return title.trim().replace(/\s+/g, ' ');
  }

  /**
   * Formate une description pour l'affichage (tronque si trop longue)
   */
  static formatDescription(description: string, maxLength: number = 100): string {
    if (!description) return '';
    
    const trimmed = description.trim();
    if (trimmed.length <= maxLength) return trimmed;
    
    return trimmed.substring(0, maxLength) + '...';
  }

  /**
   * Formate un nombre pour l'affichage
   */
  static formatNumber(num: number): string {
    if (num === 0) return '0';
    if (!num || isNaN(num)) return '';
    
    return num.toLocaleString('fr-FR');
  }

  /**
   * Formate un pourcentage
   */
  static formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    if (!value || !total || isNaN(value) || isNaN(total)) return '0%';
    
    const percentage = (value / total) * 100;
    return `${Math.round(percentage)}%`;
  }

  /**
   * Formate une durée en heures et minutes
   */
  static formatDuration(minutes: number): string {
    if (!minutes || isNaN(minutes) || minutes < 0) return '0h 0m';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    
    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Formate un statut de tâche pour l'affichage
   */
  static formatTaskStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'TODO': 'À faire',
      'IN_PROGRESS': 'En cours',
      'DONE': 'Terminé',
      'CANCELLED': 'Annulé'
    };
    
    return statusMap[status.toUpperCase()] || status;
  }

  /**
   * Formate une priorité de tâche pour l'affichage
   */
  static formatTaskPriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'LOW': 'Faible',
      'MEDIUM': 'Moyenne',
      'HIGH': 'Élevée',
      'URGENT': 'Urgente'
    };
    
    return priorityMap[priority.toUpperCase()] || priority;
  }

  /**
   * Formate un rôle d'utilisateur pour l'affichage
   */
  static formatUserRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'MEMBER': 'Membre',
      'OBSERVER': 'Observateur'
    };
    
    return roleMap[role.toUpperCase()] || role;
  }

  /**
   * Formate un type de notification pour l'affichage
   */
  static formatNotificationType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'INFO': 'Information',
      'WARNING': 'Avertissement',
      'ERROR': 'Erreur',
      'SUCCESS': 'Succès'
    };
    
    return typeMap[type.toUpperCase()] || type;
  }

  /**
   * Formate un nom complet à partir du prénom et nom
   */
  static formatFullName(firstName: string, lastName: string): string {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    if (!first && !last) return '';
    if (!first) return last;
    if (!last) return first;
    
    return `${first} ${last}`;
  }

  /**
   * Formate un nom de fichier pour l'affichage
   */
  static formatFileName(fileName: string, maxLength: number = 30): string {
    if (!fileName) return '';
    
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    
    if (!extension || nameWithoutExt.length <= 10) return fileName;
    
    const truncatedName = nameWithoutExt.substring(0, 10);
    return `${truncatedName}...${extension}`;
  }

  /**
   * Formate une taille de fichier
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (!bytes || isNaN(bytes)) return '';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
} 