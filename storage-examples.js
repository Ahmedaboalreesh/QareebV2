// Firebase Storage Examples
// Comprehensive examples for using Firebase Storage with car images and other files

import firebaseStorageService from './firebase-storage-service.js';

// ==================== CAR IMAGES EXAMPLES ====================

// Example 1: Upload a single car image
async function uploadCarImageExample() {
  try {
    // Simulate file input (in real app, this would come from file input)
    const file = new File(['car image data'], 'car1.jpg', { type: 'image/jpeg' });
    const carId = 'car123';
    
    const result = await firebaseStorageService.uploadCarImage(carId, file, 'main');
    console.log('✅ Car image uploaded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error uploading car image:', error);
  }
}

// Example 2: Upload multiple car images
async function uploadMultipleCarImagesExample() {
  try {
    // Simulate multiple file inputs
    const files = [
      new File(['main image'], 'main.jpg', { type: 'image/jpeg' }),
      new File(['interior image'], 'interior.jpg', { type: 'image/jpeg' }),
      new File(['exterior image'], 'exterior.jpg', { type: 'image/jpeg' })
    ];
    const carId = 'car123';
    
    const results = await firebaseStorageService.uploadCarImages(carId, files);
    console.log('✅ Multiple car images uploaded:', results);
    return results;
  } catch (error) {
    console.error('❌ Error uploading multiple car images:', error);
  }
}

// Example 3: Upload car image with progress tracking
async function uploadCarImageWithProgressExample() {
  try {
    const file = new File(['car image data'], 'car1.jpg', { type: 'image/jpeg' });
    const carId = 'car123';
    
    const uploadTask = await firebaseStorageService.uploadCarImageWithProgress(
      carId, 
      file, 
      (progress, state) => {
        console.log(`Upload progress: ${progress.toFixed(2)}% - State: ${state}`);
        
        // Update UI progress bar
        if (state === 'running') {
          // Update progress bar
          console.log(`Progress: ${progress.toFixed(2)}%`);
        } else if (state === 'success') {
          console.log('Upload completed successfully!');
        }
      }
    );
    
    return uploadTask;
  } catch (error) {
    console.error('❌ Error uploading car image with progress:', error);
  }
}

// Example 4: Get car image URL
async function getCarImageURLExample() {
  try {
    const imagePath = 'cars/car123/images/car123_main_1234567890.jpg';
    const imageURL = await firebaseStorageService.getCarImageURL(imagePath);
    console.log('✅ Car image URL:', imageURL);
    return imageURL;
  } catch (error) {
    console.error('❌ Error getting car image URL:', error);
  }
}

// Example 5: Get all car images
async function getCarImagesExample() {
  try {
    const carId = 'car123';
    const images = await firebaseStorageService.getCarImages(carId);
    console.log('✅ Car images retrieved:', images);
    return images;
  } catch (error) {
    console.error('❌ Error getting car images:', error);
  }
}

// Example 6: Delete car image
async function deleteCarImageExample() {
  try {
    const imagePath = 'cars/car123/images/car123_main_1234567890.jpg';
    await firebaseStorageService.deleteCarImage(imagePath);
    console.log('✅ Car image deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting car image:', error);
  }
}

// Example 7: Delete all car images
async function deleteAllCarImagesExample() {
  try {
    const carId = 'car123';
    await firebaseStorageService.deleteAllCarImages(carId);
    console.log('✅ All car images deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting all car images:', error);
  }
}

// ==================== USER PROFILE IMAGES EXAMPLES ====================

// Example 8: Upload user profile image
async function uploadUserProfileImageExample() {
  try {
    const file = new File(['profile image data'], 'profile.jpg', { type: 'image/jpeg' });
    const userId = 'user123';
    
    const result = await firebaseStorageService.uploadUserProfileImage(userId, file);
    console.log('✅ User profile image uploaded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error uploading user profile image:', error);
  }
}

// Example 9: Get user profile image URL
async function getUserProfileImageURLExample() {
  try {
    const userId = 'user123';
    const profileImageURL = await firebaseStorageService.getUserProfileImageURL(userId);
    console.log('✅ User profile image URL:', profileImageURL);
    return profileImageURL;
  } catch (error) {
    console.error('❌ Error getting user profile image URL:', error);
  }
}

// Example 10: Delete user profile image
async function deleteUserProfileImageExample() {
  try {
    const userId = 'user123';
    await firebaseStorageService.deleteUserProfileImage(userId);
    console.log('✅ User profile image deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting user profile image:', error);
  }
}

// ==================== DOCUMENTS EXAMPLES ====================

// Example 11: Upload document
async function uploadDocumentExample() {
  try {
    const file = new File(['license document'], 'license.pdf', { type: 'application/pdf' });
    const userId = 'user123';
    const documentType = 'license';
    
    const result = await firebaseStorageService.uploadDocument(userId, file, documentType);
    console.log('✅ Document uploaded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error uploading document:', error);
  }
}

// Example 12: Get user documents
async function getUserDocumentsExample() {
  try {
    const userId = 'user123';
    const documents = await firebaseStorageService.getUserDocuments(userId);
    console.log('✅ User documents retrieved:', documents);
    return documents;
  } catch (error) {
    console.error('❌ Error getting user documents:', error);
  }
}

// ==================== UTILITY EXAMPLES ====================

// Example 13: Generate thumbnail URL
async function generateThumbnailURLExample() {
  try {
    const imagePath = 'cars/car123/images/car123_main_1234567890.jpg';
    const thumbnailURL = await firebaseStorageService.generateThumbnailURL(imagePath, 300, 200);
    console.log('✅ Thumbnail URL generated:', thumbnailURL);
    return thumbnailURL;
  } catch (error) {
    console.error('❌ Error generating thumbnail URL:', error);
  }
}

// Example 14: Update file metadata
async function updateFileMetadataExample() {
  try {
    const filePath = 'cars/car123/images/car123_main_1234567890.jpg';
    const metadata = {
      customMetadata: {
        'car-brand': 'تويوتا',
        'car-model': 'كامري',
        'uploaded-by': 'user123'
      }
    };
    
    await firebaseStorageService.updateFileMetadata(filePath, metadata);
    console.log('✅ File metadata updated successfully');
  } catch (error) {
    console.error('❌ Error updating file metadata:', error);
  }
}

// Example 15: Get file metadata
async function getFileMetadataExample() {
  try {
    const filePath = 'cars/car123/images/car123_main_1234567890.jpg';
    const metadata = await firebaseStorageService.getFileMetadata(filePath);
    console.log('✅ File metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('❌ Error getting file metadata:', error);
  }
}

// Example 16: Check if file exists
async function fileExistsExample() {
  try {
    const filePath = 'cars/car123/images/car123_main_1234567890.jpg';
    const exists = await firebaseStorageService.fileExists(filePath);
    console.log('✅ File exists:', exists);
    return exists;
  } catch (error) {
    console.error('❌ Error checking file existence:', error);
  }
}

// Example 17: Get storage usage
async function getStorageUsageExample() {
  try {
    const usage = await firebaseStorageService.getStorageUsage();
    console.log('✅ Storage usage:', usage);
    return usage;
  } catch (error) {
    console.error('❌ Error getting storage usage:', error);
  }
}

// ==================== BATCH OPERATIONS EXAMPLES ====================

// Example 18: Upload multiple files with progress
async function uploadMultipleFilesExample() {
  try {
    const files = [
      new File(['file1'], 'file1.jpg', { type: 'image/jpeg' }),
      new File(['file2'], 'file2.jpg', { type: 'image/jpeg' }),
      new File(['file3'], 'file3.jpg', { type: 'image/jpeg' })
    ];
    const basePath = 'cars/car123/images';
    
    const results = await firebaseStorageService.uploadMultipleFiles(
      files, 
      basePath, 
      (completed, total, lastResult) => {
        const progress = (completed / total) * 100;
        console.log(`Batch upload progress: ${progress.toFixed(2)}%`);
        console.log('Last uploaded file:', lastResult);
      }
    );
    
    console.log('✅ Multiple files uploaded:', results);
    return results;
  } catch (error) {
    console.error('❌ Error uploading multiple files:', error);
  }
}

// Example 19: Delete multiple files
async function deleteMultipleFilesExample() {
  try {
    const filePaths = [
      'cars/car123/images/car123_main_1234567890.jpg',
      'cars/car123/images/car123_additional_1_1234567891.jpg',
      'cars/car123/images/car123_additional_2_1234567892.jpg'
    ];
    
    await firebaseStorageService.deleteMultipleFiles(filePaths);
    console.log('✅ Multiple files deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting multiple files:', error);
  }
}

// ==================== VALIDATION EXAMPLES ====================

// Example 20: Validate file type
async function validateFileTypeExample() {
  try {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    firebaseStorageService.validateFileType(file, allowedTypes);
    console.log('✅ File type validation passed');
  } catch (error) {
    console.error('❌ File type validation failed:', error.message);
  }
}

// Example 21: Validate file size
async function validateFileSizeExample() {
  try {
    const file = new File(['test data'], 'test.jpg', { type: 'image/jpeg' });
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    firebaseStorageService.validateFileSize(file, maxSize);
    console.log('✅ File size validation passed');
  } catch (error) {
    console.error('❌ File size validation failed:', error.message);
  }
}

// Example 22: Generate secure file name
async function generateSecureFileNameExample() {
  try {
    const originalName = 'car_image.jpg';
    const prefix = 'car_';
    
    const secureName = firebaseStorageService.generateSecureFileName(originalName, prefix);
    console.log('✅ Secure file name generated:', secureName);
    return secureName;
  } catch (error) {
    console.error('❌ Error generating secure file name:', error);
  }
}

// ==================== COMPLETE WORKFLOW EXAMPLE ====================

// Example 23: Complete car image management workflow
async function completeCarImageWorkflowExample() {
  try {
    console.log('🚀 Starting complete car image workflow...');
    
    const carId = 'car123';
    
    // 1. Upload main car image
    const mainImage = new File(['main car image'], 'main.jpg', { type: 'image/jpeg' });
    const mainImageResult = await firebaseStorageService.uploadCarImage(carId, mainImage, 'main');
    console.log('✅ Main image uploaded:', mainImageResult);
    
    // 2. Upload additional car images
    const additionalImages = [
      new File(['interior image'], 'interior.jpg', { type: 'image/jpeg' }),
      new File(['exterior image'], 'exterior.jpg', { type: 'image/jpeg' }),
      new File(['engine image'], 'engine.jpg', { type: 'image/jpeg' })
    ];
    
    const additionalResults = await firebaseStorageService.uploadCarImages(carId, additionalImages);
    console.log('✅ Additional images uploaded:', additionalResults);
    
    // 3. Get all car images
    const allImages = await firebaseStorageService.getCarImages(carId);
    console.log('✅ All car images retrieved:', allImages);
    
    // 4. Update metadata for main image
    const metadata = {
      customMetadata: {
        'car-brand': 'تويوتا',
        'car-model': 'كامري',
        'image-type': 'main'
      }
    };
    
    await firebaseStorageService.updateFileMetadata(mainImageResult.path, metadata);
    console.log('✅ Main image metadata updated');
    
    // 5. Generate thumbnail URL
    const thumbnailURL = await firebaseStorageService.generateThumbnailURL(mainImageResult.path);
    console.log('✅ Thumbnail URL generated:', thumbnailURL);
    
    // 6. Check if images exist
    const mainImageExists = await firebaseStorageService.fileExists(mainImageResult.path);
    console.log('✅ Main image exists:', mainImageExists);
    
    const result = {
      mainImage: mainImageResult,
      additionalImages: additionalResults,
      allImages: allImages,
      thumbnailURL: thumbnailURL,
      mainImageExists: mainImageExists
    };
    
    console.log('✅ Complete car image workflow finished successfully!');
    return result;
  } catch (error) {
    console.error('❌ Error in complete car image workflow:', error);
  }
}

// ==================== REAL-WORLD USAGE EXAMPLES ====================

// Example 24: Handle file input from HTML
async function handleFileInputExample(fileInput) {
  try {
    const files = Array.from(fileInput.files);
    const carId = 'car123';
    
    if (files.length === 0) {
      console.log('No files selected');
      return;
    }
    
    // Validate files
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        console.error(`File ${file.name} is not an image`);
        continue;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        console.error(`File ${file.name} is too large (max 5MB)`);
        continue;
      }
    }
    
    // Upload files with progress
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageType = i === 0 ? 'main' : `additional_${i}`;
      
      try {
        const uploadTask = await firebaseStorageService.uploadCarImageWithProgress(
          carId, 
          file, 
          (progress, state) => {
            console.log(`Uploading ${file.name}: ${progress.toFixed(2)}% - ${state}`);
            
            // Update UI progress
            updateProgressBar(progress, file.name);
          }
        );
        
        results.push({ file: file.name, success: true, task: uploadTask });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        results.push({ file: file.name, success: false, error: error.message });
      }
    }
    
    console.log('✅ File upload results:', results);
    return results;
  } catch (error) {
    console.error('❌ Error handling file input:', error);
  }
}

// Example 25: Display car images in UI
async function displayCarImagesExample(carId, containerElement) {
  try {
    // Get all car images
    const images = await firebaseStorageService.getCarImages(carId);
    
    if (images.length === 0) {
      containerElement.innerHTML = '<p>لا توجد صور متاحة لهذه السيارة</p>';
      return;
    }
    
    // Create image gallery
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
    
    console.log('✅ Car images displayed successfully');
  } catch (error) {
    console.error('❌ Error displaying car images:', error);
    containerElement.innerHTML = '<p>خطأ في تحميل صور السيارة</p>';
  }
}

// Example 26: Update progress bar (UI helper)
function updateProgressBar(progress, fileName) {
  // This would update your UI progress bar
  console.log(`Progress for ${fileName}: ${progress.toFixed(2)}%`);
  
  // Example UI update:
  // const progressBar = document.getElementById('upload-progress');
  // const progressText = document.getElementById('upload-progress-text');
  // progressBar.style.width = `${progress}%`;
  // progressText.textContent = `جاري رفع ${fileName}: ${progress.toFixed(2)}%`;
}

// Export all examples
export {
  uploadCarImageExample,
  uploadMultipleCarImagesExample,
  uploadCarImageWithProgressExample,
  getCarImageURLExample,
  getCarImagesExample,
  deleteCarImageExample,
  deleteAllCarImagesExample,
  uploadUserProfileImageExample,
  getUserProfileImageURLExample,
  deleteUserProfileImageExample,
  uploadDocumentExample,
  getUserDocumentsExample,
  generateThumbnailURLExample,
  updateFileMetadataExample,
  getFileMetadataExample,
  fileExistsExample,
  getStorageUsageExample,
  uploadMultipleFilesExample,
  deleteMultipleFilesExample,
  validateFileTypeExample,
  validateFileSizeExample,
  generateSecureFileNameExample,
  completeCarImageWorkflowExample,
  handleFileInputExample,
  displayCarImagesExample
};
