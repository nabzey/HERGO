import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell, ChevronLeft, CheckCircle, XCircle, Clock
} from 'lucide-react';
import VoyageurLayout from '../../components/VoyageurLayout';
import { notificationsApi } from '../../core/api/api';
import styles from './NotificationsPage.module.css';

interface Notification {
  id: number;
  type: 'reservation' | 'confirmation' | 'reminder' | 'cancel' | 'update' | 'validation';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface ApiNotification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  lu: boolean;
}

const mapNotification = (notification: ApiNotification): Notification => ({
  id: notification.id,
  type: 'update',
  title: notification.type || 'Notification',
  message: notification.message,
  date: new Date(notification.createdAt).toLocaleDateString('fr-FR'),
  read: notification.lu,
});

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsApi.getAll() as ApiNotification[];
        setNotifs(data.map(mapNotification));
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifs(notifs.map(notif => ({ ...notif, read: true })));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du marquage des notifications');
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifs(notifs.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du marquage de la notification');
    }
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

  if (loading) {
    return (
      <VoyageurLayout>
        <div className={styles.inner}>
          <p>Chargement des notifications...</p>
        </div>
      </VoyageurLayout>
    );
  }

  return (
    <VoyageurLayout>
      <div className={styles.inner}>
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
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
    </VoyageurLayout>
  );
};

export default NotificationsPage;
