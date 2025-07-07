package com.codesolutions.pmt.repository;

import com.codesolutions.pmt.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Récupérer les notifications d'un utilisateur
     */
    List<Notification> findByUserId(Long userId);

    /**
     * Récupérer les notifications non lues d'un utilisateur
     */
    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    /**
     * Récupérer les notifications d'un projet
     */
    List<Notification> findByRelatedEntityTypeAndRelatedEntityId(String relatedEntityType, Long relatedEntityId);

    /**
     * Compter les notifications non lues d'un utilisateur
     */
    long countByUserIdAndIsReadFalse(Long userId);

    /**
     * Récupérer les notifications par type
     */
    List<Notification> findByType(String type);

    /**
     * Récupérer les notifications d'un utilisateur par type
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.type = :type")
    List<Notification> findByUserIdAndType(@Param("userId") Long userId, @Param("type") String type);

    /**
     * Récupérer les notifications récentes d'un utilisateur (limitées)
     */
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findRecentByUserId(@Param("userId") Long userId);
} 