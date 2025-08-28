# 🔥 Firebase Storage Implementation Guide

## نظرة عامة

تم تنفيذ Firebase Storage لتوفير نظام تخزين سحابي شامل لإدارة ملفات منصة تأجير السيارات. يتضمن النظام إدارة صور السيارات، صور الملفات الشخصية، والمستندات مع ميزات متقدمة مثل تتبع التقدم والتحقق من صحة الملفات.

## 📁 الملفات المطلوبة

### الملفات الأساسية
- `firebase-storage-service.js` - الخدمة الرئيسية لإدارة Firebase Storage
- `storage-examples.js` - أمثلة شاملة لاستخدام الخدمة
- `test-storage.html` - صفحة اختبار تفاعلية
- `FIREBASE_STORAGE_README.md` - هذا الدليل

### الملفات المرتبطة
- `package.json` - يحتوي على تبعية Firebase
- `firebase-config.js` - إعدادات Firebase الأساسية

## 🚀 الإعداد والتثبيت

### 1. تثبيت Firebase
```bash
npm install firebase
```

### 2. إعداد Firebase Storage
1. انتقل إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك أو أنشئ مشروعاً جديداً
3. في القائمة الجانبية، اختر "Storage"
4. انقر على "Get started"
5. اختر موقع التخزين (يفضل أقرب موقع للمستخدمين)
6. اختر قواعد الأمان (ابدأ بـ "test mode" للتطوير)

### 3. تكوين قواعد الأمان
```javascript
// قواعد أمان أساسية للتطوير
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}

// قواعد أمان للإنتاج
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // صور السيارات - قراءة للجميع، كتابة للمصادقين
    match /cars/{carId}/images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // صور الملفات الشخصية - قراءة وكتابة للمالك فقط
    match /users/{userId}/profile/{imageId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // المستندات - قراءة وكتابة للمالك فقط
    match /users/{userId}/documents/{documentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📋 هيكل التخزين

```
firebase-storage/
├── cars/
│   └── {carId}/
│       └── images/
│           ├── {carId}_main_{timestamp}.jpg
│           ├── {carId}_additional_1_{timestamp}.jpg
│           └── {carId}_additional_2_{timestamp}.jpg
├── users/
│   └── {userId}/
│       ├── profile/
│       │   └── profile_{timestamp}.jpg
│       └── documents/
│           ├── license_{timestamp}.pdf
│           ├── insurance_{timestamp}.pdf
│           └── registration_{timestamp}.pdf
└── temp/
    └── uploads/
        └── {tempFiles}
```

## 🔧 استخدام الخدمة

### استيراد الخدمة
```javascript
import firebaseStorageService from './firebase-storage-service.js';
```

### 1. إدارة صور السيارات

#### رفع صورة سيارة واحدة
```javascript
const file = fileInput.files[0]; // من input file
const carId = 'car123';
const imageType = 'main'; // 'main' أو 'additional'

try {
  const result = await firebaseStorageService.uploadCarImage(carId, file, imageType);
  console.log('تم رفع الصورة:', result);
  // result يحتوي على: url, path, fileName, size, contentType, timeCreated, updated
} catch (error) {
  console.error('خطأ في رفع الصورة:', error);
}
```

#### رفع عدة صور للسيارة
```javascript
const files = Array.from(fileInput.files);
const carId = 'car123';

try {
  const results = await firebaseStorageService.uploadCarImages(carId, files);
  console.log('تم رفع الصور:', results);
} catch (error) {
  console.error('خطأ في رفع الصور:', error);
}
```

#### رفع مع تتبع التقدم
```javascript
const file = fileInput.files[0];
const carId = 'car123';

const uploadTask = await firebaseStorageService.uploadCarImageWithProgress(
  carId, 
  file, 
  (progress, state) => {
    console.log(`التقدم: ${progress.toFixed(2)}% - الحالة: ${state}`);
    
    // تحديث شريط التقدم في الواجهة
    if (state === 'running') {
      updateProgressBar(progress);
    } else if (state === 'success') {
      showSuccessMessage('تم رفع الصورة بنجاح!');
    }
  }
);
```

#### استرجاع صور السيارة
```javascript
const carId = 'car123';

try {
  const images = await firebaseStorageService.getCarImages(carId);
  console.log('صور السيارة:', images);
  
  // عرض الصور في الواجهة
  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.url;
    imgElement.alt = 'صورة السيارة';
    document.getElementById('gallery').appendChild(imgElement);
  });
} catch (error) {
  console.error('خطأ في استرجاع الصور:', error);
}
```

#### حذف صورة سيارة
```javascript
const imagePath = 'cars/car123/images/car123_main_1234567890.jpg';

try {
  await firebaseStorageService.deleteCarImage(imagePath);
  console.log('تم حذف الصورة بنجاح');
} catch (error) {
  console.error('خطأ في حذف الصورة:', error);
}
```

#### حذف جميع صور السيارة
```javascript
const carId = 'car123';

try {
  await firebaseStorageService.deleteAllCarImages(carId);
  console.log('تم حذف جميع صور السيارة بنجاح');
} catch (error) {
  console.error('خطأ في حذف الصور:', error);
}
```

### 2. إدارة صور الملف الشخصي

#### رفع صورة الملف الشخصي
```javascript
const file = fileInput.files[0];
const userId = 'user123';

try {
  const result = await firebaseStorageService.uploadUserProfileImage(userId, file);
  console.log('تم رفع صورة الملف الشخصي:', result);
} catch (error) {
  console.error('خطأ في رفع صورة الملف الشخصي:', error);
}
```

#### استرجاع صورة الملف الشخصي
```javascript
const userId = 'user123';

try {
  const imageURL = await firebaseStorageService.getUserProfileImageURL(userId);
  if (imageURL) {
    document.getElementById('profileImage').src = imageURL;
  } else {
    // استخدام صورة افتراضية
    document.getElementById('profileImage').src = '/default-profile.jpg';
  }
} catch (error) {
  console.error('خطأ في استرجاع صورة الملف الشخصي:', error);
}
```

#### حذف صورة الملف الشخصي
```javascript
const userId = 'user123';

try {
  await firebaseStorageService.deleteUserProfileImage(userId);
  console.log('تم حذف صورة الملف الشخصي بنجاح');
} catch (error) {
  console.error('خطأ في حذف صورة الملف الشخصي:', error);
}
```

### 3. إدارة المستندات

#### رفع مستند
```javascript
const file = fileInput.files[0];
const userId = 'user123';
const documentType = 'license'; // 'license', 'insurance', 'registration', 'other'

try {
  const result = await firebaseStorageService.uploadDocument(userId, file, documentType);
  console.log('تم رفع المستند:', result);
} catch (error) {
  console.error('خطأ في رفع المستند:', error);
}
```

#### استرجاع مستندات المستخدم
```javascript
const userId = 'user123';

try {
  const documents = await firebaseStorageService.getUserDocuments(userId);
  console.log('مستندات المستخدم:', documents);
  
  // عرض المستندات في الواجهة
  documents.forEach(doc => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.textContent = doc.fileName;
    link.target = '_blank';
    document.getElementById('documentsList').appendChild(link);
  });
} catch (error) {
  console.error('خطأ في استرجاع المستندات:', error);
}
```

### 4. الوظائف المساعدة

#### تحديث بيانات الملف
```javascript
const filePath = 'cars/car123/images/car123_main_1234567890.jpg';
const metadata = {
  customMetadata: {
    'car-brand': 'تويوتا',
    'car-model': 'كامري',
    'uploaded-by': 'user123',
    'image-type': 'main'
  }
};

try {
  await firebaseStorageService.updateFileMetadata(filePath, metadata);
  console.log('تم تحديث بيانات الملف بنجاح');
} catch (error) {
  console.error('خطأ في تحديث بيانات الملف:', error);
}
```

#### التحقق من وجود الملف
```javascript
const filePath = 'cars/car123/images/car123_main_1234567890.jpg';

try {
  const exists = await firebaseStorageService.fileExists(filePath);
  if (exists) {
    console.log('الملف موجود');
  } else {
    console.log('الملف غير موجود');
  }
} catch (error) {
  console.error('خطأ في التحقق من وجود الملف:', error);
}
```

#### الحصول على بيانات الملف
```javascript
const filePath = 'cars/car123/images/car123_main_1234567890.jpg';

try {
  const metadata = await firebaseStorageService.getFileMetadata(filePath);
  console.log('بيانات الملف:', metadata);
} catch (error) {
  console.error('خطأ في الحصول على بيانات الملف:', error);
}
```

## 🎯 أمثلة متقدمة

### سير العمل الكامل لإدارة صور السيارة
```javascript
async function completeCarImageWorkflow(carId) {
  try {
    console.log('🚀 بدء سير العمل الكامل...');
    
    // 1. رفع الصورة الرئيسية
    const mainImage = fileInput.files[0];
    const mainImageResult = await firebaseStorageService.uploadCarImage(carId, mainImage, 'main');
    console.log('✅ تم رفع الصورة الرئيسية:', mainImageResult);
    
    // 2. رفع الصور الإضافية
    const additionalFiles = Array.from(fileInput.files).slice(1);
    const additionalResults = await firebaseStorageService.uploadCarImages(carId, additionalFiles);
    console.log('✅ تم رفع الصور الإضافية:', additionalResults);
    
    // 3. استرجاع جميع الصور
    const allImages = await firebaseStorageService.getCarImages(carId);
    console.log('✅ تم استرجاع جميع الصور:', allImages);
    
    // 4. تحديث البيانات الوصفية للصورة الرئيسية
    const metadata = {
      customMetadata: {
        'car-brand': 'تويوتا',
        'car-model': 'كامري',
        'image-type': 'main'
      }
    };
    await firebaseStorageService.updateFileMetadata(mainImageResult.path, metadata);
    console.log('✅ تم تحديث البيانات الوصفية');
    
    // 5. التحقق من وجود الصور
    const mainImageExists = await firebaseStorageService.fileExists(mainImageResult.path);
    console.log('✅ الصورة الرئيسية موجودة:', mainImageExists);
    
    return {
      mainImage: mainImageResult,
      additionalImages: additionalResults,
      allImages: allImages,
      mainImageExists: mainImageExists
    };
  } catch (error) {
    console.error('❌ خطأ في سير العمل:', error);
    throw error;
  }
}
```

### معالجة ملفات متعددة مع تتبع التقدم
```javascript
async function handleMultipleFileUpload(files, carId) {
  const results = [];
  let completed = 0;
  
  for (const file of files) {
    try {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        console.error(`الملف ${file.name} ليس صورة`);
        continue;
      }
      
      // التحقق من حجم الملف (5MB حد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        console.error(`الملف ${file.name} كبير جداً (الحد الأقصى 5MB)`);
        continue;
      }
      
      // رفع الملف مع تتبع التقدم
      const uploadTask = await firebaseStorageService.uploadCarImageWithProgress(
        carId, 
        file, 
        (progress, state) => {
          console.log(`جاري رفع ${file.name}: ${progress.toFixed(2)}% - ${state}`);
          updateProgressBar(progress, file.name);
        }
      );
      
      results.push({ file: file.name, success: true, task: uploadTask });
    } catch (error) {
      console.error(`فشل في رفع ${file.name}:`, error);
      results.push({ file: file.name, success: false, error: error.message });
    }
    
    completed++;
    updateOverallProgress(completed, files.length);
  }
  
  return results;
}
```

### عرض معرض الصور
```javascript
async function displayCarImageGallery(carId, containerElement) {
  try {
    // استرجاع جميع صور السيارة
    const images = await firebaseStorageService.getCarImages(carId);
    
    if (images.length === 0) {
      containerElement.innerHTML = '<p>لا توجد صور متاحة لهذه السيارة</p>';
      return;
    }
    
    // إنشاء معرض الصور
    let galleryHTML = '<div class="car-image-gallery">';
    
    images.forEach((image, index) => {
      const isMain = index === 0;
      galleryHTML += `
        <div class="car-image ${isMain ? 'main-image' : 'additional-image'}">
          <img src="${image.url}" alt="صورة السيارة ${index + 1}" />
          <div class="image-info">
            <span>الحجم: ${(image.size / 1024 / 1024).toFixed(2)} MB</span>
            <button onclick="deleteCarImage('${image.path}')">حذف</button>
          </div>
        </div>
      `;
    });
    
    galleryHTML += '</div>';
    containerElement.innerHTML = galleryHTML;
    
    console.log('✅ تم عرض صور السيارة بنجاح');
  } catch (error) {
    console.error('❌ خطأ في عرض صور السيارة:', error);
    containerElement.innerHTML = '<p>خطأ في تحميل صور السيارة</p>';
  }
}
```

## 🔒 الأمان والتحقق من صحة البيانات

### التحقق من نوع الملف
```javascript
function validateFileType(file, allowedTypes) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`نوع الملف ${file.type} غير مسموح به. الأنواع المسموحة: ${allowedTypes.join(', ')}`);
  }
  return true;
}

// استخدام
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
validateFileType(file, allowedImageTypes);
```

### التحقق من حجم الملف
```javascript
function validateFileSize(file, maxSize) {
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw new Error(`حجم الملف يجب أن يكون أقل من ${maxSizeMB}MB`);
  }
  return true;
}

// استخدام
const maxSize = 5 * 1024 * 1024; // 5MB
validateFileSize(file, maxSize);
```

### إنشاء اسم ملف آمن
```javascript
function generateSecureFileName(originalName, prefix = '') {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const secureName = `${prefix}${timestamp}_${randomString}.${extension}`;
  return secureName;
}

// استخدام
const secureName = generateSecureFileName('car_image.jpg', 'car_');
// النتيجة: car_1234567890_abc123def456.jpg
```

## 📊 إحصائيات وأداء

### تتبع استخدام التخزين
```javascript
async function getStorageStatistics() {
  try {
    const usage = await firebaseStorageService.getStorageUsage();
    console.log('إحصائيات التخزين:', usage);
    
    // عرض الإحصائيات في الواجهة
    document.getElementById('totalFiles').textContent = usage.totalFiles;
    document.getElementById('totalSize').textContent = `${(usage.totalSize / 1024 / 1024).toFixed(2)} MB`;
    document.getElementById('lastUpdated').textContent = usage.lastUpdated.toLocaleString();
  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات التخزين:', error);
  }
}
```

### تحسين الأداء
1. **ضغط الصور**: استخدم مكتبات مثل `browser-image-compression` لضغط الصور قبل الرفع
2. **التخزين المؤقت**: استخدم `localStorage` أو `sessionStorage` لتخزين روابط الصور مؤقتاً
3. **التحميل التدريجي**: استخدم `lazy loading` للصور
4. **التحميل المتوازي**: رفع عدة ملفات في نفس الوقت باستخدام `Promise.all`

## 🧪 الاختبار

### تشغيل صفحة الاختبار
1. افتح `test-storage.html` في المتصفح
2. اختبر جميع الوظائف المتاحة
3. تحقق من النتائج في وحدة التحكم

### اختبار الوظائف برمجياً
```javascript
// اختبار رفع صورة
async function testImageUpload() {
  const file = new File(['test image data'], 'test.jpg', { type: 'image/jpeg' });
  const result = await firebaseStorageService.uploadCarImage('test-car', file, 'main');
  console.assert(result.url, 'يجب أن يحتوي النتيجة على رابط URL');
  console.assert(result.path, 'يجب أن يحتوي النتيجة على مسار الملف');
}

// اختبار حذف صورة
async function testImageDeletion() {
  const imagePath = 'cars/test-car/images/test.jpg';
  await firebaseStorageService.deleteCarImage(imagePath);
  const exists = await firebaseStorageService.fileExists(imagePath);
  console.assert(!exists, 'يجب أن يكون الملف محذوفاً');
}
```

## 🚨 معالجة الأخطاء

### أنواع الأخطاء الشائعة
```javascript
try {
  await firebaseStorageService.uploadCarImage(carId, file, 'main');
} catch (error) {
  switch (error.code) {
    case 'storage/unauthorized':
      console.error('غير مصرح بالوصول');
      break;
    case 'storage/canceled':
      console.error('تم إلغاء العملية');
      break;
    case 'storage/unknown':
      console.error('خطأ غير معروف');
      break;
    case 'storage/invalid-checksum':
      console.error('خطأ في التحقق من سلامة الملف');
      break;
    case 'storage/retry-limit-exceeded':
      console.error('تم تجاوز حد المحاولات');
      break;
    case 'storage/invalid-format':
      console.error('تنسيق ملف غير صالح');
      break;
    case 'storage/invalid-url':
      console.error('رابط URL غير صالح');
      break;
    default:
      console.error('خطأ آخر:', error.message);
  }
}
```

### استراتيجيات إعادة المحاولة
```javascript
async function uploadWithRetry(file, carId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await firebaseStorageService.uploadCarImage(carId, file, 'main');
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(`محاولة ${attempt} فشلت، إعادة المحاولة...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // تأخير متزايد
    }
  }
}
```

## 📱 التكامل مع الواجهة الأمامية

### مثال على مكون React
```jsx
import React, { useState } from 'react';
import firebaseStorageService from './firebase-storage-service.js';

function CarImageUpload({ carId }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);

  const handleFileUpload = async (files) => {
    setUploading(true);
    setProgress(0);

    try {
      const results = await firebaseStorageService.uploadCarImages(
        carId, 
        Array.from(files),
        (progress) => setProgress(progress)
      );
      
      setImages(prev => [...prev, ...results]);
      setUploading(false);
    } catch (error) {
      console.error('خطأ في رفع الصور:', error);
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={(e) => handleFileUpload(e.target.files)}
        disabled={uploading}
      />
      
      {uploading && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
          <span>{progress.toFixed(1)}%</span>
        </div>
      )}
      
      <div className="image-gallery">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image.url} alt={`صورة ${index + 1}`} />
            <button onClick={() => deleteImage(image.path)}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### مثال على مكون Vue
```vue
<template>
  <div class="car-image-upload">
    <input 
      type="file" 
      multiple 
      accept="image/*" 
      @change="handleFileUpload"
      :disabled="uploading"
    />
    
    <div v-if="uploading" class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      />
      <span>{{ progress.toFixed(1) }}%</span>
    </div>
    
    <div class="image-gallery">
      <div 
        v-for="(image, index) in images" 
        :key="index" 
        class="image-item"
      >
        <img :src="image.url" :alt="`صورة ${index + 1}`" />
        <button @click="deleteImage(image.path)">حذف</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebaseStorageService from './firebase-storage-service.js';

export default {
  name: 'CarImageUpload',
  props: {
    carId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      uploading: false,
      progress: 0,
      images: []
    };
  },
  methods: {
    async handleFileUpload(event) {
      this.uploading = true;
      this.progress = 0;

      try {
        const results = await firebaseStorageService.uploadCarImages(
          this.carId,
          Array.from(event.target.files),
          (progress) => this.progress = progress
        );
        
        this.images.push(...results);
        this.uploading = false;
      } catch (error) {
        console.error('خطأ في رفع الصور:', error);
        this.uploading = false;
      }
    },
    
    async deleteImage(imagePath) {
      try {
        await firebaseStorageService.deleteCarImage(imagePath);
        this.images = this.images.filter(img => img.path !== imagePath);
      } catch (error) {
        console.error('خطأ في حذف الصورة:', error);
      }
    }
  }
};
</script>
```

## 🔄 التحديثات والصيانة

### إضافة ميزات جديدة
1. **معالجة الصور**: إضافة دعم لإنشاء صور مصغرة
2. **التخزين المؤقت**: تحسين الأداء عبر التخزين المؤقت
3. **النسخ الاحتياطي**: إضافة نظام نسخ احتياطي تلقائي
4. **التشفير**: إضافة تشفير للملفات الحساسة

### مراقبة الأداء
```javascript
// إضافة مراقبة الأداء
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('firebase-storage')) {
      console.log('أداء Firebase Storage:', entry);
    }
  }
});

performanceObserver.observe({ entryTypes: ['measure'] });
```

## 📞 الدعم والمساعدة

### موارد إضافية
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Storage Best Practices](https://firebase.google.com/docs/storage/use-cases)

### استكشاف الأخطاء
1. تحقق من قواعد الأمان في Firebase Console
2. تأكد من تكوين Firebase بشكل صحيح
3. تحقق من صلاحيات المستخدم
4. راجع سجلات الأخطاء في وحدة التحكم

### الاتصال
للمساعدة والدعم التقني، يرجى التواصل مع فريق التطوير.

---

**ملاحظة**: هذا الدليل مصمم خصيصاً لمنصة تأجير السيارات ويجب تعديله حسب احتياجات مشروعك المحددة.
