# دليل إضافة خيارات التوصيل في نموذج الحجز

## المشكلة
المستأجر لا يمكنه اختيار التوصيل أو عدم التوصيل في نموذج الحجز، مما يحد من مرونة الخدمة ويجعل المستخدم لا يعرف إذا كان يمكنه اختيار طريقة استلام السيارة.

## الحل المطبق

### 1. إضافة قسم HTML في نموذج الحجز

**قبل الإضافة:**
```html
<div class="form-group">
    <label for="returnLocation">
        <i class="fas fa-map-marker-alt"></i>
        موقع الإرجاع
    </label>
    <input type="text" id="returnLocation" name="returnLocation" placeholder="موقع إرجاع السيارة" required>
</div>

<div class="form-group">
    <label for="renterNotes">
        <i class="fas fa-comment"></i>
        ملاحظات إضافية
    </label>
    <textarea id="renterNotes" name="renterNotes" rows="3" placeholder="أي ملاحظات إضافية..."></textarea>
</div>
```

**بعد الإضافة:**
```html
<div class="form-group">
    <label for="returnLocation">
        <i class="fas fa-map-marker-alt"></i>
        موقع الإرجاع
    </label>
    <input type="text" id="returnLocation" name="returnLocation" placeholder="موقع إرجاع السيارة" required>
</div>

<!-- Delivery Option -->
<div class="delivery-option-section" id="deliveryOptionSection" style="display: none;">
    <h3>خيارات التوصيل</h3>
    <div class="delivery-options">
        <div class="delivery-option">
            <input type="radio" id="noDelivery" name="deliveryChoice" value="no" checked>
            <label for="noDelivery">
                <i class="fas fa-times-circle"></i>
                <span>استلام السيارة من موقع المالك</span>
            </label>
        </div>
        <div class="delivery-option" id="deliveryOption">
            <input type="radio" id="withDelivery" name="deliveryChoice" value="yes">
            <label for="withDelivery">
                <i class="fas fa-check-circle"></i>
                <span>توصيل السيارة إلى موقعي</span>
                <span class="delivery-fee-display" id="deliveryFeeDisplay"></span>
            </label>
        </div>
    </div>
    <div class="delivery-note-display" id="deliveryNoteDisplay"></div>
</div>

<div class="form-group">
    <label for="renterNotes">
        <i class="fas fa-comment"></i>
        ملاحظات إضافية
    </label>
    <textarea id="renterNotes" name="renterNotes" rows="3" placeholder="أي ملاحظات إضافية..."></textarea>
</div>
```

### 2. إضافة CSS لتصميم خيارات التوصيل

```css
/* Delivery Option Section in Booking Form */
.delivery-option-section {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid #e9ecef;
}

.delivery-option-section h3 {
    margin-bottom: 1rem;
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.delivery-option-section h3::before {
    content: '\f48e';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    color: #667eea;
}

.delivery-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.delivery-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
}

.delivery-option:hover {
    border-color: #667eea;
    background: #f8fafc;
}

.delivery-option input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: #667eea;
    cursor: pointer;
}

.delivery-option label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex: 1;
    margin: 0;
    font-weight: 500;
    color: #374151;
}

.delivery-fee-display {
    background: #eff6ff;
    color: #1e40af;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-right: auto;
}

.delivery-note-display {
    background: #fef3c7;
    color: #92400e;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-style: italic;
    line-height: 1.4;
    margin-top: 10px;
    border: 1px solid #fde68a;
}

/* Selected delivery option styling */
.delivery-option.selected {
    border-color: #667eea;
    background: #eff6ff;
}
```

### 3. إضافة دوال JavaScript لإدارة خيارات التوصيل

**تحديث دالة `updateCarInfo`:**
```javascript
function updateCarInfo(car) {
    // ... existing code ...
    
    // Update delivery service information
    updateDeliveryService(car);
    
    // Setup delivery options in booking form
    setupDeliveryOptions(car);
}
```

**إضافة دالة `setupDeliveryOptions`:**
```javascript
function setupDeliveryOptions(car) {
    const deliveryOptionSection = document.getElementById('deliveryOptionSection');
    const deliveryOption = document.getElementById('deliveryOption');
    const deliveryFeeDisplay = document.getElementById('deliveryFeeDisplay');
    const deliveryNoteDisplay = document.getElementById('deliveryNoteDisplay');
    
    if (!deliveryOptionSection) {
        console.error('Delivery option section not found');
        return;
    }
    
    const deliveryService = car.delivery_service || false;
    const deliveryFee = car.delivery_fee || null;
    const deliveryNote = car.delivery_note || null;
    
    if (deliveryService) {
        // Show delivery options section
        deliveryOptionSection.style.display = 'block';
        
        // Update delivery fee display
        if (deliveryFee !== null) {
            const feeText = deliveryFee === 0 ? 'مجاني' : `${deliveryFee} ريال`;
            deliveryFeeDisplay.textContent = `(${feeText})`;
            deliveryFeeDisplay.style.display = 'inline';
        } else {
            deliveryFeeDisplay.style.display = 'none';
        }
        
        // Update delivery note display
        if (deliveryNote) {
            deliveryNoteDisplay.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>${deliveryNote}</span>
            `;
            deliveryNoteDisplay.style.display = 'block';
        } else {
            deliveryNoteDisplay.style.display = 'none';
        }
        
        // Add event listeners for delivery options
        setupDeliveryOptionListeners();
        
    } else {
        // Hide delivery options section if service is not available
        deliveryOptionSection.style.display = 'none';
    }
}
```

**إضافة دالة `setupDeliveryOptionListeners`:**
```javascript
function setupDeliveryOptionListeners() {
    const deliveryOptions = document.querySelectorAll('input[name="deliveryChoice"]');
    const deliveryOptionElements = document.querySelectorAll('.delivery-option');
    
    deliveryOptions.forEach((option, index) => {
        option.addEventListener('change', function() {
            // Update visual selection
            deliveryOptionElements.forEach(el => el.classList.remove('selected'));
            if (this.checked) {
                deliveryOptionElements[index].classList.add('selected');
            }
            
            // Update booking summary
            updateBookingSummary();
        });
    });
    
    // Add click listeners to option containers
    deliveryOptionElements.forEach((element, index) => {
        element.addEventListener('click', function() {
            deliveryOptions[index].checked = true;
            deliveryOptions[index].dispatchEvent(new Event('change'));
        });
    });
}
```

### 4. تحديث دالة `updateBookingSummary` لتشمل رسوم التوصيل

```javascript
function updateBookingSummary() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const dailyRate = 150; // Mock daily rate
    const deposit = 500; // Mock deposit
    
    // Get delivery choice
    const deliveryChoice = document.querySelector('input[name="deliveryChoice"]:checked')?.value || 'no';
    const deliveryFee = getDeliveryFee();
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (days > 0) {
            const basePrice = days * dailyRate;
            const totalPrice = deliveryChoice === 'yes' ? basePrice + deliveryFee : basePrice;
            
            document.getElementById('totalDays').textContent = days;
            document.getElementById('totalPrice').textContent = `${totalPrice} ريال`;
            document.getElementById('depositAmount').textContent = `${deposit} ريال`;
            
            // Update delivery fee display in summary if delivery is selected
            updateDeliveryFeeInSummary(deliveryChoice, deliveryFee);
        } else {
            document.getElementById('totalDays').textContent = '0';
            document.getElementById('totalPrice').textContent = '0 ريال';
            updateDeliveryFeeInSummary('no', 0);
        }
    } else {
        document.getElementById('totalDays').textContent = '0';
        document.getElementById('totalPrice').textContent = '0 ريال';
        updateDeliveryFeeInSummary('no', 0);
    }
}
```

**إضافة دالة `getDeliveryFee`:**
```javascript
function getDeliveryFee() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (carId) {
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const car = cars.find(c => c.id == carId);
        return car?.delivery_fee || 0;
    }
    
    return 0;
}
```

**إضافة دالة `updateDeliveryFeeInSummary`:**
```javascript
function updateDeliveryFeeInSummary(deliveryChoice, deliveryFee) {
    let summaryHTML = `
        <div class="summary-item">
            <span>عدد الأيام:</span>
            <span id="totalDays">0</span>
        </div>
    `;
    
    if (deliveryChoice === 'yes' && deliveryFee > 0) {
        summaryHTML += `
            <div class="summary-item">
                <span>رسوم التوصيل:</span>
                <span>${deliveryFee} ريال</span>
            </div>
        `;
    }
    
    summaryHTML += `
        <div class="summary-item">
            <span>السعر الإجمالي:</span>
            <span id="totalPrice">0 ريال</span>
        </div>
        <div class="summary-item">
            <span>الوديعة:</span>
            <span id="depositAmount">0 ريال</span>
        </div>
    `;
    
    const bookingSummary = document.querySelector('.booking-summary');
    if (bookingSummary) {
        const summaryContent = bookingSummary.querySelector('h3').nextElementSibling;
        if (summaryContent) {
            summaryContent.innerHTML = summaryHTML;
        }
    }
}
```

### 5. تحديث دالة `calculateTotalAmount` لتشمل رسوم التوصيل

```javascript
function calculateTotalAmount(startDate, endDate, deliveryChoice = 'no') {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const baseAmount = days * 150; // 150 SAR per day
    
    // Add delivery fee if delivery is chosen
    if (deliveryChoice === 'yes') {
        const deliveryFee = getDeliveryFee();
        return baseAmount + deliveryFee;
    }
    
    return baseAmount;
}
```

### 6. تحديث دالة `handleBookingSubmission` لتشمل خيار التوصيل

```javascript
async function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        car_id: new URLSearchParams(window.location.search).get('id'),
        start_date: formData.get('startDate'),
        end_date: formData.get('endDate'),
        pickup_location: formData.get('pickupLocation'),
        return_location: formData.get('returnLocation'),
        renter_notes: formData.get('renterNotes'),
        delivery_choice: formData.get('deliveryChoice') || 'no'
    };
    
    // ... validation code ...
    
    // Mock successful booking
    const mockBooking = {
        id: Date.now(),
        car_id: bookingData.car_id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        status: 'pending',
        total_amount: calculateTotalAmount(bookingData.start_date, bookingData.end_date, bookingData.delivery_choice),
        deposit_amount: 500,
        delivery_choice: bookingData.delivery_choice,
        delivery_fee: bookingData.delivery_choice === 'yes' ? getDeliveryFee() : 0
    };
    
    // ... rest of the function ...
}
```

## الميزات الجديدة

### 1. خيارات التوصيل الواضحة
- **خيار 1**: استلام السيارة من موقع المالك (افتراضي)
- **خيار 2**: توصيل السيارة إلى موقعي (مع رسوم)

### 2. عرض الرسوم والملاحظات
- عرض رسوم التوصيل مع الخيار
- عرض ملاحظات المالك حول التوصيل
- تمييز "مجاني" إذا كانت الرسوم صفر

### 3. تحديث السعر الإجمالي
- حساب السعر الأساسي (عدد الأيام × السعر اليومي)
- إضافة رسوم التوصيل إذا تم اختيار التوصيل
- عرض رسوم التوصيل في ملخص الحجز

### 4. تفاعل المستخدم
- نقاط راديو واضحة مع أيقونات
- تحديث فوري للسعر عند تغيير الخيار
- تصميم متجاوب وجميل

### 5. حفظ البيانات
- حفظ خيار التوصيل في بيانات الحجز
- حفظ رسوم التوصيل في بيانات الحجز
- ربط البيانات مع صفحة الدفع

## سيناريوهات العرض

### 1. خدمة التوصيل متاحة مع رسوم
```javascript
{
    delivery_service: true,
    delivery_fee: 50,
    delivery_note: 'التوصيل متاح في جميع أنحاء الرياض مع رسوم إضافية'
}
```

**النتيجة:**
- ظهور قسم خيارات التوصيل
- عرض رسوم التوصيل: (50 ريال)
- عرض ملاحظات التوصيل
- إضافة 50 ريال للسعر الإجمالي عند اختيار التوصيل

### 2. خدمة التوصيل متاحة مجاناً
```javascript
{
    delivery_service: true,
    delivery_fee: 0,
    delivery_note: 'التوصيل مجاني في مدينة الدمام'
}
```

**النتيجة:**
- ظهور قسم خيارات التوصيل
- عرض رسوم التوصيل: (مجاني)
- عرض ملاحظات التوصيل
- عدم إضافة أي رسوم للسعر الإجمالي

### 3. خدمة التوصيل غير متاحة
```javascript
{
    delivery_service: false,
    delivery_fee: null,
    delivery_note: null
}
```

**النتيجة:**
- عدم ظهور قسم خيارات التوصيل
- عدم إضافة أي رسوم للسعر الإجمالي

## الملفات المحدثة

1. **`car-details.html`**
   - إضافة قسم خيارات التوصيل في نموذج الحجز
   - إضافة عناصر لعرض الرسوم والملاحظات

2. **`car-details.js`**
   - إضافة دالة `setupDeliveryOptions`
   - إضافة دالة `setupDeliveryOptionListeners`
   - تحديث دالة `updateBookingSummary`
   - إضافة دالة `getDeliveryFee`
   - إضافة دالة `updateDeliveryFeeInSummary`
   - تحديث دالة `calculateTotalAmount`
   - تحديث دالة `handleBookingSubmission`

3. **`styles.css`**
   - إضافة CSS لقسم خيارات التوصيل
   - إضافة أنماط للخيارات والرسوم والملاحظات
   - إضافة تأثيرات التفاعل

4. **`test-delivery-choice.html`** (جديد)
   - صفحة اختبار شاملة
   - سيناريوهات اختبار متنوعة
   - أدوات اختبار مباشرة

## خطوات الاختبار

### 1. إنشاء بيانات تجريبية
```javascript
// في test-delivery-choice.html
function createTestData() {
    const testCars = [
        {
            id: 1,
            // ... car details
            delivery_service: true,
            delivery_fee: 50,
            delivery_note: 'التوصيل متاح في جميع أنحاء الرياض'
        },
        {
            id: 2,
            // ... car details
            delivery_service: false
        },
        {
            id: 3,
            // ... car details
            delivery_service: true,
            delivery_fee: 0,
            delivery_note: 'التوصيل مجاني'
        }
    ];
    
    localStorage.setItem('mockCars', JSON.stringify(testCars));
}
```

### 2. اختبار العرض
1. إنشاء بيانات تجريبية
2. فتح صفحة تفاصيل السيارة
3. التأكد من ظهور قسم خيارات التوصيل (إذا كانت الخدمة متاحة)
4. التأكد من عرض الرسوم والملاحظات

### 3. اختبار التفاعل
1. اختيار خيارات التوصيل المختلفة
2. التأكد من تحديث السعر الإجمالي
3. التأكد من ظهور رسوم التوصيل في ملخص الحجز
4. جرب إدخال تواريخ الحجز وتأكد من الحساب الصحيح

### 4. اختبار الحجز
1. املأ نموذج الحجز بالكامل
2. اختر خيار التوصيل المطلوب
3. اضغط "احجز السيارة"
4. تأكد من حفظ خيار التوصيل في بيانات الحجز

## النتائج المتوقعة

### قبل الإضافة
- ❌ عدم ظهور خيارات التوصيل في نموذج الحجز
- ❌ المستأجر لا يمكنه اختيار طريقة استلام السيارة
- ❌ عدم حساب رسوم التوصيل في السعر الإجمالي
- ❌ عدم حفظ خيار التوصيل في بيانات الحجز

### بعد الإضافة
- ✅ ظهور قسم خيارات التوصيل واضح
- ✅ خيارين: استلام من موقع المالك أو توصيل إلى موقعي
- ✅ عرض رسوم التوصيل مع الخيار
- ✅ حساب رسوم التوصيل في السعر الإجمالي
- ✅ عرض رسوم التوصيل في ملخص الحجز
- ✅ حفظ خيار التوصيل في بيانات الحجز
- ✅ تصميم جميل ومتجاوب

## الخلاصة

تم إضافة خيارات التوصيل في نموذج الحجز بنجاح، مما يوفر:
- مرونة في اختيار طريقة استلام السيارة
- شفافية في عرض الرسوم والملاحظات
- تحديث فوري للسعر الإجمالي
- تجربة مستخدم محسنة ومتجاوبة
- حفظ كامل لبيانات خيار التوصيل
