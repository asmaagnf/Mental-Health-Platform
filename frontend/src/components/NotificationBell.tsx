import { useState, useEffect } from 'react';
import { Bell, BellDot, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: string;
  relatedEntityId: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get current user ID
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userId = user?.id;

  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8020/api/notifications/user/${userId}`);
      setNotifications(response.data);
      
      // Count unread notifications
      const unread = response.data.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`http://localhost:8020/api/notifications/${notificationId}/mark-as-read`);
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:8020/api/notifications/user/${userId}/mark-all-read`);
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling (fetch every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        {unreadCount > 0 ? (
          <BellDot className="h-5 w-5 text-gray-600" />
        ) : (
          <Bell className="h-5 w-5 text-gray-600" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-medium text-gray-900">Notifications</h3>
            <button 
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    markAsRead(notification.id);
                    // You might want to navigate to the relevant page here
                  }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          
        <div className="px-4 py-2 border-t border-gray-200 text-center bg-gray-50">
  {user.role === 'PATIENT' ? (
    <Link 
      to="/patient/notifications" 
      className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
      onClick={() => setIsOpen(false)}
    >
      View all notifications <ChevronRight className="h-4 w-4 ml-1" />
    </Link>
  ) : user.role === 'THERAPIST' ? (
    <Link 
      to="/therapist/notifications" 
      className="text-sm text-green-600 hover:text-green-800 flex items-center justify-center"
      onClick={() => setIsOpen(false)}
    >
      View therapist notifications <ChevronRight className="h-4 w-4 ml-1" />
    </Link>
  ) : null}
</div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;