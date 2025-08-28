# حل مشكلة Identity Toolkit API في Firebase

## 🚨 المشكلة
عند محاولة إنشاء حساب جديد، يظهر الخطأ التالي:
```
خطأ في Firebase: Firebase: Error (auth/identity-toolkit-api-has-not-been-used-in-project-382655918338-before-or-it-is-disabled.-enable-it-by-visiting-https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=382655918338-then-retry.-if-you-enabled-this-api-recently,-wait-a-few-minutes-for-the-action-to-propagate-to-our-systems-and-retry.
```

## 🔍 السبب
**Identity Toolkit API** غير مفعل في مشروع Firebase. هذا API مطلوب لـ Firebase Authentication.

## 🛠️ الحلول السريعة

### الحل الأول: الرابط المباشر (الأسرع)
**اضغط على الرابط التالي مباشرة:**
```
https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=382655918338
```

### الحل الثاني: من Firebase Console
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك `qareeb-aba0c`
3. اذهب إلى **Authentication** في القائمة الجانبية
4. اضغط على **Sign-in method**
5. تأكد من تفعيل **Email/Password**

### الحل الثالث: من Google Cloud Console
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. اختر مشروعك
3. اذهب إلى **APIs & Services** > **Library**
4. ابحث عن **Identity Toolkit API**
5. اضغط على **Enable**

## ⏰ المدة المتوقعة
- **انتظر 5-10 دقائق** بعد تفعيل API
- قد تحتاج لإعادة تحميل الصفحة
- جرب التسجيل مرة أخرى

## 🧪 اختبار الحل

### 1. اختبار سريع
1. افتح `test-register-debug.html`
2. اضغط على "اختبار التسجيل"
3. إذا نجح، المشكلة محلولة

### 2. اختبار التسجيل الفعلي
1. اذهب إلى `register.html`
2. حاول إنشاء حساب جديد
3. يجب أن يعمل بدون أخطاء

## 📋 خطوات مفصلة

### تفعيل API من Google Cloud Console:

1. **الوصول إلى Google Cloud Console**
   - اذهب إلى: https://console.cloud.google.com/
   - تأكد من اختيار المشروع الصحيح

2. **البحث عن API**
   - اذهب إلى **APIs & Services** > **Library**
   - ابحث عن "Identity Toolkit API"
   - اضغط على النتيجة

3. **تفعيل API**
   - اضغط على زر **Enable**
   - انتظر رسالة التأكيد

4. **التحقق من التفعيل**
   - اذهب إلى **APIs & Services** > **Enabled APIs**
   - تأكد من وجود "Identity Toolkit API" في القائمة

### تفعيل من Firebase Console:

1. **الوصول إلى Firebase Console**
   - اذهب إلى: https://console.firebase.google.com/
   - اختر مشروعك

2. **الذهاب إلى Authentication**
   - اضغط على **Authentication** في القائمة الجانبية
   - اضغط على **Sign-in method**

3. **تفعيل Email/Password**
   - ابحث عن **Email/Password**
   - اضغط على **Edit**
   - تأكد من تفعيل **Enable**
   - اضغط **Save**

## 🔧 إعدادات إضافية

### تفعيل APIs أخرى مطلوبة:
قد تحتاج لتفعيل APIs إضافية:
- **Cloud Firestore API** (إذا كنت تستخدم Firestore)
- **Cloud Storage API** (إذا كنت تستخدم Storage)
- **Cloud Functions API** (إذا كنت تستخدم Functions)

### التحقق من قواعد الأمان:
1. اذهب إلى **Firestore Database** > **Rules**
2. تأكد من أن القواعد تسمح بالقراءة والكتابة للمستخدمين المصادق عليهم

## 🚨 استكشاف الأخطاء

### إذا لم يعمل بعد التفعيل:
1. **انتظر أكثر** - قد يستغرق 15-30 دقيقة
2. **أعد تحميل الصفحة**
3. **امسح cache المتصفح**
4. **جرب متصفح مختلف**

### إذا ظهر خطأ مختلف:
1. راجع Console المتصفح
2. استخدم `test-register-debug.html` للتشخيص
3. راجع دليل `REGISTER_ERROR_FIX_GUIDE.md`

## 📞 الدعم

### إذا استمرت المشكلة:
1. راجع [Firebase Documentation](https://firebase.google.com/docs/auth)
2. راجع [Google Cloud Console](https://console.cloud.google.com/)
3. تأكد من أن المشروع مفعل وليس في وضع التجربة

## ✅ التحقق من الحل

بعد تفعيل API، يجب أن تعمل:
- ✅ إنشاء حسابات جديدة
- ✅ تسجيل الدخول
- ✅ إعادة تعيين كلمة المرور
- ✅ جميع وظائف Authentication

## 📝 ملاحظات مهمة

1. **API مفعل عالمياً** - لا تحتاج لتفعيله لكل مستخدم
2. **مدة التفعيل** - قد تستغرق حتى 30 دقيقة
3. **لا حاجة لإعادة التفعيل** - مرة واحدة كافية
4. **مجاني** - لا توجد رسوم إضافية

## 🎯 النتيجة المتوقعة

بعد حل المشكلة:
- ✅ إنشاء حسابات بدون أخطاء
- ✅ رسائل خطأ واضحة
- ✅ نظام تسجيل يعمل بشكل كامل
- ✅ جميع وظائف Firebase Authentication متاحة

