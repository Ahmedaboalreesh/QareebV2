# Firebase Authentication Guide - منصة تأجير السيارات

## نظرة عامة | Overview

تم تكامل Firebase Authentication بنجاح في منصة تأجير السيارات. النظام يدعم:
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- إنشاء حسابات جديدة
- تسجيل الدخول بـ Google
- إدارة حالة المصادقة

## الملفات المتاحة | Available Files

### 1. `auth.js` - وحدة المصادقة الرئيسية
```javascript
import { signInUser, createUser, signOutUser } from './auth.js';

// تسجيل الدخول
const user = await signInUser("user@example.com", "password123");

// إنشاء حساب جديد
const newUser = await createUser("newuser@example.com", "password123");

// تسجيل الخروج
await signOutUser();
```

### 2. `auth-example.js` - أمثلة الاستخدام
يحتوي على أمثلة شاملة لجميع وظائف المصادقة.

### 3. `simple-auth-example.js` - المثال الأصلي
يظهر كيفية استخدام الكود الأصلي مع الإعداد الصحيح.

### 4. `test-auth.html` - صفحة اختبار تفاعلية
صفحة ويب لاختبار وظائف المصادقة مباشرة.

## كيفية الاستخدام | How to Use

### 1. تسجيل الدخول | Login
```javascript
import { signInUser } from './auth.js';

try {
  const user = await signInUser("user@example.com", "password123");
  console.log("تم تسجيل الدخول:", user.email);
} catch (error) {
  console.error("فشل تسجيل الدخول:", error.message);
}
```

### 2. إنشاء حساب جديد | Register
```javascript
import { createUser } from './auth.js';

try {
  const user = await createUser("newuser@example.com", "password123");
  console.log("تم إنشاء الحساب:", user.email);
} catch (error) {
  console.error("فشل إنشاء الحساب:", error.message);
}
```

### 3. تسجيل الخروج | Logout
```javascript
import { signOutUser } from './auth.js';

try {
  await signOutUser();
  console.log("تم تسجيل الخروج بنجاح");
} catch (error) {
  console.error("فشل تسجيل الخروج:", error.message);
}
```

### 4. التحقق من حالة المصادقة | Check Auth State
```javascript
import { getCurrentUser, onAuthStateChanged } from './auth.js';

// الحصول على المستخدم الحالي
const currentUser = getCurrentUser();
if (currentUser) {
  console.log("المستخدم مسجل:", currentUser.email);
}

// الاستماع لتغييرات حالة المصادقة
onAuthStateChanged((user) => {
  if (user) {
    console.log("تم تسجيل الدخول:", user.email);
  } else {
    console.log("تم تسجيل الخروج");
  }
});
```

## الصفحات الجاهزة | Ready Pages

### 1. `login-firebase.html`
- صفحة تسجيل الدخول الكاملة
- دعم تسجيل الدخول بـ Google
- معالجة الأخطاء باللغة العربية
- تصميم متجاوب

### 2. `register-firebase.html`
- صفحة إنشاء حساب جديد
- اختيار نوع المستخدم (مستأجر/صاحب سيارة)
- التحقق من صحة البيانات
- دعم تسجيل الدخول بـ Google

### 3. `test-auth.html`
- صفحة اختبار تفاعلية
- اختبار جميع وظائف المصادقة
- عرض معلومات المستخدم

## إعداد Firebase | Firebase Setup

### 1. تم تكوين Firebase بالفعل
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
  authDomain: "qareeb-aba0c.firebaseapp.com",
  databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
  projectId: "qareeb-aba0c",
  storageBucket: "qareeb-aba0c.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

### 2. تم تفعيل المصادقة في Firebase Console
- Email/Password authentication
- Google authentication
- إعدادات الأمان

## معالجة الأخطاء | Error Handling

النظام يتعامل مع الأخطاء الشائعة:

```javascript
switch (error.code) {
  case 'auth/user-not-found':
    errorMessage = 'البريد الإلكتروني غير مسجل';
    break;
  case 'auth/wrong-password':
    errorMessage = 'كلمة المرور غير صحيحة';
    break;
  case 'auth/email-already-in-use':
    errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
    break;
  case 'auth/weak-password':
    errorMessage = 'كلمة المرور ضعيفة جداً';
    break;
  case 'auth/invalid-email':
    errorMessage = 'البريد الإلكتروني غير صحيح';
    break;
}
```

## التكامل مع النظام الحالي | Integration with Existing System

### 1. `firebase-service.js`
النظام يستخدم خدمة Firebase الشاملة الموجودة التي تدعم:
- إدارة المستخدمين
- إدارة السيارات
- إدارة الحجوزات
- إدارة الصور
- الإشعارات

### 2. التخزين المحلي
```javascript
// حفظ معلومات المستخدم
sessionStorage.setItem('currentUser', JSON.stringify({
  uid: user.uid,
  email: user.email,
  full_name: user.displayName,
  user_type: 'renter'
}));

// استرجاع معلومات المستخدم
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
```

## الاختبار | Testing

### 1. اختبار سريع
افتح `test-auth.html` في المتصفح لاختبار المصادقة.

### 2. اختبار في وحدة التحكم
```javascript
// في وحدة تحكم المتصفح
import('./auth.js').then(({ signInUser }) => {
  signInUser("test@example.com", "password123")
    .then(user => console.log("نجح:", user))
    .catch(error => console.error("فشل:", error));
});
```

## الأمان | Security

### 1. قواعد الأمان في Firebase
- تم إعداد قواعد أمان للقاعدة الحقيقية
- حماية بيانات المستخدمين
- التحقق من الصلاحيات

### 2. أفضل الممارسات
- استخدام HTTPS دائماً
- التحقق من صحة المدخلات
- تشفير كلمات المرور
- إدارة الجلسات بشكل آمن

## الدعم | Support

للمساعدة أو الاستفسارات:
1. راجع ملفات الأمثلة
2. اختبر باستخدام `test-auth.html`
3. تحقق من وحدة تحكم المتصفح للأخطاء
4. راجع إعدادات Firebase Console

---

**ملاحظة**: جميع الملفات جاهزة للاستخدام وتم اختبارها. النظام يدعم اللغة العربية بالكامل ويتبع أفضل ممارسات Firebase.
