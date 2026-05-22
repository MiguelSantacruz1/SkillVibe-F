import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { notificationApi } from '../services/api';
import type { NotificationDTO } from '../services/api';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: NotificationDTO[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchUnread = async () => {
    try {
      const { data } = await notificationApi.getUnread();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    if (!user) {
      if (stompClient) {
        stompClient.deactivate();
        setStompClient(null);
      }
      setNotifications([]);
      return;
    }

    // Initial fetch
    fetchUnread();

    const token = localStorage.getItem('skillvibes_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'https://skillvibe-b-production.up.railway.app';
    const socket = new SockJS(`${baseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (_str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      client.subscribe('/user/queue/notifications', (message) => {
        const notif: NotificationDTO = JSON.parse(message.body);
        setNotifications((prev) => [notif, ...prev]);
        toast.success(notif.message, {
          icon: '🔔',
          position: 'top-right',
        });
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [user]);

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
