# دليل نظام الإشعارات في لوحة التحكم - Dashboard Notifications Guide

## الميزة الجديدة
تم إضافة نظام إشعارات متكامل إلى صفحة `renter-dashboard.html` لعرض وإدارة جميع الإشعارات الخاصة بالمستخدم.

## الملفات المحدثة

### 1. `renter-dashboard.html` (محدث)
- **إضافة قسم الإشعارات**: في أعلى الصفحة بعد الإحصائيات
- **أزرار إدارة الإشعارات**: تعيين الكل كمقروء ومسح الكل
- **حالة فارغة**: عندما لا توجد إشعارات

### 2. `renter-dashboard.js` (محدث)
- **تحميل الإشعارات**: من localStorage
- **عرض الإشعارات**: في قائمة منظمة
- **إدارة الإشعارات**: تعيين كمقروء، حذف، مسح الكل
- **حساب الوقت**: عرض الوقت بتنسيق "منذ..."

### 3. `styles.css` (محدث)
- **تصميم قسم الإشعارات**: CSS شامل
- **تصميم متجاوب**: للجوال والأجهزة اللوحية
- **ألوان مختلفة**: لكل نوع إشعار

### 4. `test-dashboard-notifications.html` (جديد)
- **صفحة اختبار شاملة**: لاختبار جميع وظائف الإشعارات
- **إدارة البيانات**: إضافة ومسح الإشعارات
- **عرض المعلومات**: حالة الإشعارات الحالية

## الميزات المضافة

### 1. عرض الإشعارات
```javascript
// Load notifications
function loadNotifications() {
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Filter notifications for current user
        const userNotifications = notifications.filter(notification => 
            notification.user_id === userData.id || notification.user_id === 'all'
        );
        
        displayNotifications(userNotifications);
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        displayNotifications([]);
    }
}
```

### 2. إنشاء عنصر الإشعار
```javascript
// Create notification item
function createNotificationItem(notification) {
    const isUnread = !notification.read;
    const iconClass = getNotificationIconClass(notification.type);
    const timeAgo = getTimeAgo(notification.created_at);
    
    return `
        <div class="notification-item ${isUnread ? 'unread' : ''}" data-notification-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-meta">
                    <span class="notification-time">${timeAgo}</span>
                    <div class="notification-actions">
                        ${notification.link ? `
                            <button class="btn-view" onclick="viewNotification('${notification.link}')">
                                <i class="fas fa-eye"></i>
                                عرض
                            </button>
                        ` : ''}
                        ${isUnread ? `
                            <button class="btn-mark-read" onclick="markAsRead(${notification.id})">
                                <i class="fas fa-check"></i>
                                مقروء
                            </button>
                        ` : ''}
                        <button class="btn-delete" onclick="deleteNotification(${notification.id})">
                            <i class="fas fa-trash"></i>
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
```

### 3. إدارة الإشعارات
```javascript
// Mark notification as read
function markAsRead(notificationId) {
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Update UI
            const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.classList.remove('unread');
                const markReadBtn = notificationElement.querySelector('.btn-mark-read');
                if (markReadBtn) {
                    markReadBtn.remove();
                }
            }
            
            showMessage('تم تعيين الإشعار كمقروء', 'success');
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
        showMessage('حدث خطأ في تحديث الإشعار', 'error');
    }
}

// Mark all notifications as read
function markAllAsRead() {
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Mark all user notifications as read
        notifications.forEach(notification => {
            if (notification.user_id === userData.id || notification.user_id === 'all') {
                notification.read = true;
            }
        });
        
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Update UI
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(item => {
            item.classList.remove('unread');
            const markReadBtn = item.querySelector('.btn-mark-read');
            if (markReadBtn) {
                markReadBtn.remove();
            }
        });
        
        showMessage('تم تعيين جميع الإشعارات كمقروءة', 'success');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        showMessage('حدث خطأ في تحديث الإشعارات', 'error');
    }
}
```

## التصميم والواجهة

### 1. هيكل HTML
```html
<!-- Notifications Section -->
<div class="notifications-section">
    <div class="notifications-header">
        <h2><i class="fas fa-bell"></i> الإشعارات</h2>
        <div class="notifications-actions">
            <button class="btn btn-outline btn-sm" onclick="markAllAsRead()">
                <i class="fas fa-check-double"></i>
                تعيين الكل كمقروء
            </button>
            <button class="btn btn-outline btn-sm" onclick="clearAllNotifications()">
                <i class="fas fa-trash"></i>
                مسح الكل
            </button>
        </div>
    </div>
    
    <div class="notifications-container" id="notificationsContainer">
        <!-- Notifications will be loaded here -->
    </div>
    
    <div class="no-notifications" id="noNotifications" style="display: none;">
        <div class="no-notifications-icon">
            <i class="far fa-bell-slash"></i>
        </div>
        <h3>لا توجد إشعارات جديدة</h3>
        <p>ستظهر هنا الإشعارات الجديدة عند وصولها</p>
    </div>
</div>
```

### 2. تصميم CSS
```css
.notifications-section {
    background: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    margin-bottom: 15px;
    transition: all 0.3s ease;
    position: relative;
}

.notification-item.unread {
    background: #f8f9ff;
    border-color: #667eea;
}

.notification-item.unread::before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #667eea;
    border-radius: 0 12px 12px 0;
}

.notification-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.notification-icon.success {
    background: #e8f5e8;
    color: #27ae60;
}

.notification-icon.info {
    background: #e3f2fd;
    color: #2196f3;
}

.notification-icon.warning {
    background: #fff3cd;
    color: #ffc107;
}

.notification-icon.error {
    background: #f8d7da;
    color: #dc3545;
}
```

## أنواع الإشعارات

### 1. أنواع الإشعارات المدعومة
- **`booking`**: إشعارات الحجز (أيقونة تقويم)
- **`success`**: إشعارات النجاح (أيقونة صح)
- **`info`**: إشعارات معلوماتية (أيقونة معلومات)
- **`warning`**: إشعارات تحذيرية (أيقونة تحذير)
- **`error`**: إشعارات الأخطاء (أيقونة خطأ)
- **`payment`**: إشعارات الدفع (أيقونة بطاقة ائتمان)
- **`car`**: إشعارات السيارات (أيقونة سيارة)
- **`system`**: إشعارات النظام (أيقونة إعدادات)

### 2. هيكل بيانات الإشعار
```javascript
{
    id: 1,
    user_id: 1, // أو 'all' للإشعارات العامة
    type: 'booking',
    title: 'حجز جديد',
    message: 'تم إنشاء حجز جديد لسيارة تويوتا كامري 2023 في الرياض',
    link: 'my-bookings.html', // رابط للانتقال للمصدر
    read: false, // حالة القراءة
    created_at: '2024-01-15T10:30:00.000Z' // وقت الإنشاء
}
```

## الميزات التفاعلية

### 1. إدارة الإشعارات
- **تعيين كمقروء**: إزالة علامة "غير مقروء" من إشعار واحد
- **تعيين الكل كمقروء**: تعيين جميع الإشعارات كمقروءة
- **حذف فردي**: حذف إشعار واحد
- **مسح الكل**: حذف جميع الإشعارات

### 2. عرض المعلومات
- **عنوان الإشعار**: عنوان واضح ومختصر
- **رسالة الإشعار**: تفاصيل الإشعار
- **وقت الإشعار**: بتنسيق "منذ..." (الآن، منذ 5 دقائق، منذ ساعة، إلخ)
- **أيقونة النوع**: لون وأيقونة مميزة لكل نوع

### 3. الروابط والانتقالات
- **عرض المصدر**: الانتقال لصفحة المصدر (إذا كان متوفراً)
- **روابط ذكية**: روابط للصفحات المناسبة

## كيفية الاختبار

### 1. اختبار الوظيفة الأساسية
1. **افتح `test-dashboard-notifications.html`**
2. **اضغط على "إضافة إشعارات تجريبية"**
3. **اضغط على "اختبار لوحة التحكم"**
4. **لاحظ قسم الإشعارات في أعلى الصفحة**

### 2. اختبار إدارة الإشعارات
1. **اضغط على "مقروء"** لإشعار غير مقروء
2. **اضغط على "حذف"** لحذف إشعار واحد
3. **اضغط على "تعيين الكل كمقروء"** لتعيين جميع الإشعارات
4. **اضغط على "مسح الكل"** لحذف جميع الإشعارات

### 3. اختبار الروابط
1. **اضغط على "عرض"** في الإشعارات التي تحتوي على روابط
2. **تحقق من الانتقال** للصفحة المناسبة

### 4. اختبار التصميم المتجاوب
1. **غيّر حجم النافذة** أو استخدم أدوات المطور
2. **تحقق من تكيف الإشعارات** مع الشاشات الصغيرة
3. **اختبر على الجوال** إذا أمكن

## الفوائد

### 1. تجربة مستخدم محسنة
- **معلومات فورية**: عرض الإشعارات المهمة مباشرة
- **سهولة الوصول**: إدارة الإشعارات من لوحة التحكم
- **تنظيم جيد**: ترتيب الإشعارات حسب الأحدث

### 2. إدارة فعالة
- **تحكم كامل**: في جميع الإشعارات
- **إجراءات سريعة**: تعيين كمقروء وحذف بنقرة واحدة
- **تنظيف سهل**: مسح جميع الإشعارات دفعة واحدة

### 3. تصميم احترافي
- **ألوان مميزة**: لكل نوع إشعار
- **أيقونات واضحة**: سهلة الفهم
- **تصميم متجاوب**: لجميع الأجهزة

### 4. وظائف متقدمة
- **حساب الوقت**: عرض الوقت بتنسيق ذكي
- **روابط ذكية**: للانتقال للمصدر
- **حالة القراءة**: تمييز الإشعارات الجديدة

## الخلاصة

تم إضافة نظام الإشعارات بنجاح:

1. ✅ **قسم إشعارات متكامل**: في لوحة التحكم
2. ✅ **إدارة شاملة**: تعيين كمقروء، حذف، مسح الكل
3. ✅ **أنواع متعددة**: إشعارات مختلفة بألوان مميزة
4. ✅ **روابط ذكية**: للانتقال للمصدر
5. ✅ **حساب الوقت**: عرض الوقت بتنسيق "منذ..."
6. ✅ **تصميم متجاوب**: لجميع الأجهزة
7. ✅ **حالة فارغة**: عندما لا توجد إشعارات
8. ✅ **رسائل تأكيد**: لجميع العمليات

### النتيجة النهائية:
الآن المستخدمون يمكنهم إدارة إشعاراتهم بسهولة من لوحة التحكم مع واجهة احترافية وميزات متقدمة! 🔔✨

**للاختبار**: افتح `test-dashboard-notifications.html` واختبر جميع ميزات نظام الإشعارات.
