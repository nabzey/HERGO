import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, ChevronLeft, CheckCircle, XCircle, Clock
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './NotificationsPage.module.css';

interface Notification {
  id: number;
  type: 'reservation' | 'confirmation' | 'reminder' | 'cancel' | 'update' | 'validation';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

import { useAuth } from '../../hooks/useAuth';

const NotificationsPage = () => {
  const { user } = useAuth();

  const userNotifications: Notification[] = [
    {
      id: 1,
      type: 'confirmation',
      title: 'Réservation confirmée !',
      message: 'Votre réservation pour Villa Sunset Paradise du 15 au 22 Mar 2026 a été confirmée.',
      date: 'Il y a 2 jours',
      read: false,
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Rappel de réservation',
      message: 'Votre voyage à Dakar commence dans 1 jour ! Voici les détails de votre arrivée.',
      date: 'Il y a 1 jour',
      read: false,
    },
    {
      id: 3,
      type: 'update',
      title: 'Mise à jour de votre réservation',
      message: 'L\'hôte a mis à jour les horaires de check-in pour votre réservation.',
      date: 'Il y a 3 jours',
      read: true,
    },
    {
      id: 4,
      type: 'cancel',
      title: 'Réservation annulée',
      message: 'Votre réservation pour Villa Azur Saly a été annulée le 18 Mar 2026.',
      date: 'Il y a 1 semaine',
      read: true,
    },
    {
      id: 5,
      type: 'reservation',
      title: 'Nouvelle réservation',
      message: 'Vous avez effectué une réservation pour Villa Ocean View du 02 au 05 Avr 2026.',
      date: 'Il y a 2 semaines',
      read: true,
    },
  ];

  const hostNotifications: Notification[] = [
    {
      id: 1,
      type: 'reservation',
      title: 'Nouvelle réservation',
      message: 'Vous avez reçu une nouvelle réservation pour La Maison des Artistes du 15 au 22 Mar 2026.',
      date: 'Il y a 2 jours',
      read: false,
    },
    {
      id: 2,
      type: 'confirmation',
      title: 'Paiement confirmé',
      message: 'Le paiement pour la réservation de Amadou Diallo a été confirmé.',
      date: 'Il y a 1 jour',
      read: false,
    },
    {
      id: 3,
      type: 'cancel',
      title: 'Réservation annulée',
      message: 'La réservation pour La Villa des Palmiers du 20 au 23 Mar 2026 a été annulée.',
      date: 'Il y a 3 jours',
      read: true,
    },
    {
      id: 4,
      type: 'update',
      title: 'Nouvel avis',
      message: 'Amadou Diallo a publié un avis sur La Maison des Artistes (4.8 ★).',
      date: 'Il y a 1 semaine',
      read: true,
    },
    {
      id: 5,
      type: 'validation',
      title: 'Logement validé',
      message: 'Votre logement Le Clos de la Corniche a été validé et est maintenant disponible.',
      date: 'Il y a 2 semaines',
      read: true,
    },
  ];

  const adminNotifications: Notification[] = [
    {
      id: 1,
      type: 'validation',
      title: 'Nouveau logement à valider',
      message: 'Fatou Seck a soumis un nouveau logement pour validation: La Villa Baobab.',
      date: 'Il y a 2 jours',
      read: false,
    },
    {
      id: 2,
      type: 'reservation',
      title: 'Nouvelle réservation',
      message: 'Amadou Diallo a réservé La Maison des Artistes du 15 au 22 Mar 2026.',
      date: 'Il y a 1 jour',
      read: false,
    },
    {
      id: 3,
      type: 'cancel',
      title: 'Réservation annulée',
      message: 'La réservation pour La Villa des Palmiers du 20 au 23 Mar 2026 a été annulée.',
      date: 'Il y a 3 jours',
      read: true,
    },
    {
      id: 4,
      type: 'update',
      title: 'Nouvel utilisateur',
      message: 'Ibrahima Ndiaye a créé un compte comme voyageur.',
      date: 'Il y a 1 semaine',
      read: true,
    },
    {
      id: 5,
      type: 'validation',
      title: 'Logement refusé',
      message: 'Le logement Résidence Almadies a été refusé par la modération.',
      date: 'Il y a 2 semaines',
      read: true,
    },
  ];

  const getNotifications = () => {
    if (user?.role === 'Hôte') {
      return hostNotifications;
    } else if (user?.role === 'Admin') {
      return adminNotifications;
    } else {
      return userNotifications;
    }
  };

  const [notifs, setNotifs] = useState<Notification[]>(getNotifications());
  const handleMarkAllRead = () => {
    setNotifs(notifs.map(notif => ({ ...notif, read: true })));

  };

  const handleMarkRead = (id: number) => {
    setNotifs(notifs.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifs.filter(notif => !notif.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle size={18} className={styles.iconSuccess} />;
      case 'cancel':
        return <XCircle size={18} className={styles.iconError} />;
      case 'reminder':
        return <Clock size={18} className={styles.iconWarning} />;
      case 'reservation':
      case 'update':
      case 'validation':
        return <Bell size={18} className={styles.iconInfo} />;
      default:
        return <Bell size={18} className={styles.iconInfo} />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'confirmation':
        return styles.bgSuccess;
      case 'cancel':
        return styles.bgError;
      case 'reminder':
        return styles.bgWarning;
      case 'reservation':
      case 'update':
      case 'validation':
        return styles.bgInfo;
      default:
        return styles.bgInfo;
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>
            <ChevronLeft size={14} /> Retour à l'accueil
          </Link>
          <h1 className={styles.title}>Notifications</h1>
          {unreadCount > 0 && (
            <button 
              className={styles.markAllBtn}
              onClick={handleMarkAllRead}
            >
              Marquer tout comme lu
            </button>
          )}
        </div>

        <div className={styles.notificationList}>
          {notifs.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={64} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>Aucune notification</h3>
              <p className={styles.emptyText}>
                Vous n'avez pas de notifications à afficher pour le moment.
              </p>
            </div>
          ) : (
            notifs.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notificationItem} ${
                  notif.read ? styles.notificationRead : styles.notificationUnread
                } ${getBgColor(notif.type)}`}
                onClick={() => handleMarkRead(notif.id)}
              >
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationIcon}>
                    {getIcon(notif.type)}
                  </div>
                  <div className={styles.notificationContent}>
                    <h4 className={styles.notificationTitle}>{notif.title}</h4>
                    <p className={styles.notificationMessage}>{notif.message}</p>
                    <div className={styles.notificationMeta}>
                      <span className={styles.notificationDate}>{notif.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;