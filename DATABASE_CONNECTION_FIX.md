# إصلاح مشكلة الاتصال بقاعدة البيانات

## المشكلة
يظهر رسالة خطأ عند رفع الصور لأن الخادم غير متصل بقاعدة البيانات Firebase.

## الأسباب المحتملة
1. **Node.js غير مثبت** على النظام
2. **ملف `.env` غير موجود** (إعدادات Firebase)
3. **الخادم غير مشغل**
4. **مشاكل في إعدادات Firebase**

## الحلول

### الحل الأول: تثبيت Node.js (مطلوب)

#### خطوات تثبيت Node.js:

1. **تحميل Node.js**
   - اذهب إلى [https://nodejs.org/](https://nodejs.org/)
   - حمل النسخة LTS (الأكثر استقراراً)
   - اختر Windows Installer (.msi)

2. **تثبيت Node.js**
   - شغل ملف التثبيت
   - اتبع خطوات التثبيت (Next, Next, Install)
   - تأكد من تفعيل خيار "Add to PATH"

3. **التحقق من التثبيت**
   - افتح PowerShell جديد
   - اكتب: `node --version`
   - اكتب: `npm --version`
   - يجب أن تظهر أرقام الإصدارات

### الحل الثاني: إعداد Firebase

#### 1. إنشاء ملف `.env`

انسخ ملف `env.example` إلى `.env`:

```bash
copy env.example .env
```

#### 2. الحصول على بيانات Firebase

1. **اذهب إلى Firebase Console**
   - [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - اختر مشروعك: `qareeb-aba0c`

2. **إعداد Service Account**
   - اذهب إلى Project Settings (⚙️)
   - انتقل إلى تبويب "Service accounts"
   - انقر على "Generate new private key"
   - احفظ ملف JSON

3. **تعبئة ملف `.env`**
   - افتح ملف `.env`
   - املأ البيانات من ملف JSON المحفوظ:

```env
# Server Configuration
PORT=3000

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Firebase Configuration (من ملف JSON)
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@qareeb-aba0c.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40qareeb-aba0c.iam.gserviceaccount.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security
NODE_ENV=development
```

### الحل الثالث: تشغيل الخادم

#### 1. تثبيت التبعيات
```bash
npm install
```

#### 2. تشغيل الخادم
```bash
npm start
```

أو للتطوير:
```bash
npm run dev
```

#### 3. التحقق من عمل الخادم
- افتح المتصفح
- اذهب إلى: `http://localhost:3000`
- يجب أن ترى رسالة "Server is running"

### الحل الرابع: اختبار الاتصال

#### 1. اختبار Firebase
```bash
node test-firebase.js
```

#### 2. اختبار رفع الصور
- افتح `upload-booking-photos.html`
- اختر صور
- انقر على "رفع الصور"
- يجب أن تعمل بدون أخطاء

## الحل البديل: العمل بدون خادم (للاختبار)

إذا لم تستطع تشغيل الخادم، يمكنك استخدام الوضع التجريبي:

### 1. تحسين الوضع التجريبي
تم تحسين الكود ليعمل بدون خادم:
- الصور تُحفظ في localStorage
- رسائل نجاح تظهر للمستخدم
- يمكن اختبار الوظائف الأساسية

### 2. كيفية الاستخدام
1. افتح `upload-booking-photos.html`
2. اختر صور
3. املأ الوصف
4. انقر على "رفع الصور"
5. ستظهر رسالة "تم رفع الصور بنجاح (وضع الاختبار)"

## استكشاف الأخطاء

### إذا لم يعمل Node.js:
1. تأكد من تثبيت Node.js
2. أعد تشغيل PowerShell
3. تحقق من PATH

### إذا لم يعمل الخادم:
1. تحقق من ملف `.env`
2. تأكد من بيانات Firebase
3. تحقق من الأخطاء في Terminal

### إذا لم تعمل رفع الصور:
1. تأكد من تشغيل الخادم
2. تحقق من Console في المتصفح
3. جرب الوضع التجريبي

## ملاحظات مهمة

- **للاختبار**: استخدم الوضع التجريبي بدون خادم
- **للإنتاج**: تأكد من تشغيل الخادم وقاعدة البيانات
- **الأمان**: لا تشارك ملف `.env` مع أحد
- **النسخ الاحتياطي**: احتفظ بنسخة من بيانات Firebase

## الدعم

إذا استمرت المشكلة:
1. تحقق من Console في المتصفح
2. راجع رسائل الخطأ في Terminal
3. تأكد من إعدادات Firebase
4. جرب الوضع التجريبي أولاً
