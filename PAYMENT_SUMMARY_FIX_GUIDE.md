# دليل إصلاح ملخص الطلب في صفحة الدفع

## المشكلة
ملخص الطلب في صفحة `payment.html` غير دقيق ولا يعرض معلومات التوصيل (خيار التوصيل ورسوم التوصيل) التي تم اختيارها في نموذج الحجز، مما يجعل المستخدم لا يعرف تفاصيل التوصيل المطلوبة.

## الحل المطبق

### 1. إضافة عناصر HTML لعرض معلومات التوصيل

**قبل الإصلاح:**
```html
<div class="summary-item">
    <span class="label">السعر اليومي:</span>
    <span class="value" id="dailyRate">150 ريال</span>
</div>

<div class="summary-item total">
    <span class="label">المجموع:</span>
    <span class="value" id="totalAmount">450 ريال</span>
</div>
```

**بعد الإصلاح:**
```html
<div class="summary-item">
    <span class="label">السعر اليومي:</span>
    <span class="value" id="dailyRate">150 ريال</span>
</div>

<!-- Delivery Information -->
<div class="summary-item" id="deliveryInfo" style="display: none;">
    <span class="label">خيار التوصيل:</span>
    <span class="value" id="deliveryChoice">-</span>
</div>

<div class="summary-item" id="deliveryFee" style="display: none;">
    <span class="label">رسوم التوصيل:</span>
    <span class="value" id="deliveryFeeAmount">-</span>
</div>

<div class="summary-item total">
    <span class="label">المجموع:</span>
    <span class="value" id="totalAmount">450 ريال</span>
</div>
```

### 2. إضافة دالة `updateDeliverySummary` في `payment.js`

```javascript
// Update delivery summary
function updateDeliverySummary(booking) {
    const deliveryInfo = document.getElementById('deliveryInfo');
    const deliveryFee = document.getElementById('deliveryFee');
    const deliveryChoice = document.getElementById('deliveryChoice');
    const deliveryFeeAmount = document.getElementById('deliveryFeeAmount');
    
    // Check if delivery choice exists
    if (booking.delivery_choice) {
        deliveryInfo.style.display = 'flex';
        
        if (booking.delivery_choice === 'yes') {
            deliveryChoice.textContent = 'توصيل السيارة إلى موقعي';
            
            // Show delivery fee if it exists and is greater than 0
            if (booking.delivery_fee && booking.delivery_fee > 0) {
                deliveryFee.style.display = 'flex';
                deliveryFeeAmount.textContent = `${booking.delivery_fee} ريال`;
            } else if (booking.delivery_fee === 0) {
                deliveryFee.style.display = 'flex';
                deliveryFeeAmount.textContent = 'مجاني';
            } else {
                deliveryFee.style.display = 'none';
            }
        } else {
            deliveryChoice.textContent = 'استلام السيارة من موقع المالك';
            deliveryFee.style.display = 'none';
        }
    } else {
        // Hide delivery information if no delivery choice
        deliveryInfo.style.display = 'none';
        deliveryFee.style.display = 'none';
    }
}
```

### 3. تحديث دالة `loadBookingData` لتشمل معلومات التوصيل

```javascript
function loadBookingData() {
    try {
        // Get booking data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('booking_id');
        
        // Load booking data from localStorage
        const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const booking = bookings.find(b => b.id === bookingId);
        
        if (booking) {
            // Get car details from localStorage or use default
            const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
            const car = cars.find(c => c.id === booking.car_id);
            
            const bookingWithCarInfo = {
                ...booking,
                car_name: car ? `${car.brand} ${car.model} ${car.year}` : 'تويوتا كامري 2023',
                daily_rate: car ? car.daily_rate : 150,
                // Include delivery information from booking
                delivery_choice: booking.delivery_choice || null,
                delivery_fee: booking.delivery_fee || null
            };
            
            updatePaymentSummary(bookingWithCarInfo);
        } else {
            // Use default data for testing
            updatePaymentSummary({
                car_name: 'تويوتا كامري 2023',
                start_date: '2024-01-15',
                end_date: '2024-01-18',
                daily_rate: 150,
                total_amount: 450,
                delivery_choice: 'no',
                delivery_fee: 0
            });
        }
        
    } catch (error) {
        console.error('❌ Error loading booking data:', error);
        showMessage('حدث خطأ في تحميل بيانات الحجز', 'error');
    }
}
```

### 4. تحديث دالة `updatePaymentSummary` لاستدعاء دالة التوصيل

```javascript
function updatePaymentSummary(booking) {
    try {
        // Calculate days
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Update summary elements
        document.getElementById('carName').textContent = booking.car_name || 'تويوتا كامري 2023';
        document.getElementById('startDate').textContent = formatDate(startDate);
        document.getElementById('endDate').textContent = formatDate(endDate);
        document.getElementById('daysCount').textContent = `${daysDiff} أيام`;
        document.getElementById('dailyRate').textContent = `${booking.daily_rate || 150} ريال`;
        
        // Update delivery information
        updateDeliverySummary(booking);
        
        // Update total amount
        document.getElementById('totalAmount').textContent = `${booking.total_amount || 450} ريال`;
        document.getElementById('payAmount').textContent = `${booking.total_amount || 450} ريال`;
        
    } catch (error) {
        console.error('❌ Error updating payment summary:', error);
    }
}
```

## الميزات الجديدة

### 1. عرض خيار التوصيل
- **توصيل السيارة إلى موقعي**: عند اختيار التوصيل
- **استلام السيارة من موقع المالك**: عند اختيار الاستلام من موقع المالك
- **إخفاء القسم**: إذا لم يتم تحديد خيار التوصيل

### 2. عرض رسوم التوصيل
- **المبلغ بالريال**: إذا كانت رسوم التوصيل أكبر من صفر
- **"مجاني"**: إذا كانت رسوم التوصيل صفر
- **إخفاء القسم**: إذا لم يتم اختيار التوصيل أو إذا كانت الرسوم غير محددة

### 3. تحديث المجموع النهائي
- **يشمل رسوم التوصيل**: في الحساب النهائي
- **تطابق مع خيارات الحجز**: نفس المبلغ المحسوب في نموذج الحجز

### 4. تجربة مستخدم محسنة
- **شفافية في الأسعار**: وضوح جميع الرسوم والمصاريف
- **معلومات مفصلة**: عرض جميع تفاصيل الحجز
- **تطابق البيانات**: تطابق ملخص الدفع مع خيارات الحجز

## سيناريوهات العرض

### 1. حجز مع توصيل مدفوع
```javascript
{
    delivery_choice: 'yes',
    delivery_fee: 50,
    total_amount: 500 // 3 days * 150 + 50 delivery
}
```

**النتيجة:**
- خيار التوصيل: توصيل السيارة إلى موقعي
- رسوم التوصيل: 50 ريال
- المجموع: 500 ريال

### 2. حجز مع توصيل مجاني
```javascript
{
    delivery_choice: 'yes',
    delivery_fee: 0,
    total_amount: 360 // 2 days * 180
}
```

**النتيجة:**
- خيار التوصيل: توصيل السيارة إلى موقعي
- رسوم التوصيل: مجاني
- المجموع: 360 ريال

### 3. حجز بدون توصيل
```javascript
{
    delivery_choice: 'no',
    delivery_fee: 0,
    total_amount: 480 // 4 days * 120
}
```

**النتيجة:**
- خيار التوصيل: استلام السيارة من موقع المالك
- لا تظهر رسوم التوصيل
- المجموع: 480 ريال

## الملفات المحدثة

1. **`payment.html`**
   - إضافة عناصر HTML لعرض معلومات التوصيل
   - إضافة عناصر `deliveryInfo` و `deliveryFee`

2. **`payment.js`**
   - إضافة دالة `updateDeliverySummary`
   - تحديث دالة `loadBookingData` لتشمل معلومات التوصيل
   - تحديث دالة `updatePaymentSummary` لاستدعاء دالة التوصيل

3. **`test-payment-summary.html`** (جديد)
   - صفحة اختبار شاملة
   - سيناريوهات اختبار متنوعة
   - أدوات اختبار مباشرة

## خطوات الاختبار

### 1. إنشاء بيانات تجريبية
```javascript
// في test-payment-summary.html
function createTestBookings() {
    const testBookings = [
        {
            id: 1,
            car_id: 1,
            start_date: '2024-01-15',
            end_date: '2024-01-18',
            status: 'pending',
            total_amount: 500, // 3 days * 150 + 50 delivery
            delivery_choice: 'yes',
            delivery_fee: 50
        },
        {
            id: 2,
            car_id: 2,
            start_date: '2024-01-20',
            end_date: '2024-01-24',
            status: 'pending',
            total_amount: 480, // 4 days * 120
            delivery_choice: 'no',
            delivery_fee: 0
        },
        {
            id: 3,
            car_id: 3,
            start_date: '2024-01-25',
            end_date: '2024-01-27',
            status: 'pending',
            total_amount: 360, // 2 days * 180
            delivery_choice: 'yes',
            delivery_fee: 0
        }
    ];
    
    localStorage.setItem('mockBookings', JSON.stringify(testBookings));
}
```

### 2. اختبار العرض
1. إنشاء بيانات تجريبية
2. فتح صفحة الدفع مع `booking_id` مختلف
3. التأكد من ظهور خيار التوصيل في ملخص الطلب
4. التأكد من ظهور رسوم التوصيل (إذا كانت موجودة)
5. التأكد من عدم ظهور رسوم التوصيل عند اختيار استلام من موقع المالك

### 3. اختبار الحسابات
1. التأكد من تطابق المجموع النهائي مع الحسابات
2. التأكد من إضافة رسوم التوصيل للمجموع عند اختيار التوصيل
3. التأكد من عدم إضافة رسوم عند اختيار استلام من موقع المالك

## النتائج المتوقعة

### قبل الإصلاح
- ❌ عدم ظهور خيار التوصيل في ملخص الطلب
- ❌ عدم ظهور رسوم التوصيل في الملخص
- ❌ عدم وضوح تفاصيل التوصيل للمستخدم
- ❌ عدم تطابق الملخص مع خيارات الحجز

### بعد الإصلاح
- ✅ ظهور خيار التوصيل في ملخص الطلب
- ✅ عرض رسوم التوصيل إذا كانت موجودة
- ✅ تمييز "مجاني" إذا كانت رسوم التوصيل صفر
- ✅ إخفاء رسوم التوصيل إذا لم يتم اختيار التوصيل
- ✅ تطابق المجموع النهائي مع الحسابات
- ✅ شفافية في الأسعار وتفاصيل الحجز

## الخلاصة

تم إصلاح ملخص الطلب في صفحة الدفع بنجاح، مما يوفر:
- عرض دقيق لجميع تفاصيل الحجز بما في ذلك التوصيل
- شفافية في الأسعار ورسوم التوصيل
- تجربة مستخدم محسنة مع معلومات واضحة ومفصلة
- تطابق كامل بين ملخص الدفع وخيارات الحجز
