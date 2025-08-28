// Firebase Storage Service for Car Rental Platform
// This service handles file uploads, downloads, and management for car images and other files

import { initializeApp } from "firebase/app";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata,
  updateMetadata
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
  authDomain: "qareeb-aba0c.firebaseapp.com",
  databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
  projectId: "qareeb-aba0c",
  storageBucket: "qareeb-aba0c.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

class FirebaseStorageService {
  constructor() {
    this.storage = storage;
    console.log('🔥 Firebase Storage Service initialized');
  }

  // ==================== CAR IMAGES MANAGEMENT ====================

  // Upload car image
  async uploadCarImage(carId, file, imageType = 'main') {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Create file path
      const timestamp = Date.now();
      const fileName = `${carId}_${imageType}_${timestamp}.${file.name.split('.').pop()}`;
      const filePath = `cars/${carId}/images/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(this.storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Get metadata
      const metadata = await getMetadata(snapshot.ref);
      
      const result = {
        url: downloadURL,
        path: filePath,
        fileName: fileName,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      };

      console.log('✅ Car image uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error uploading car image:', error);
      throw error;
    }
  }

  // Upload multiple car images
  async uploadCarImages(carId, files) {
    try {
      const uploadPromises = files.map((file, index) => {
        const imageType = index === 0 ? 'main' : `additional_${index}`;
        return this.uploadCarImage(carId, file, imageType);
      });

      const results = await Promise.all(uploadPromises);
      console.log('✅ Multiple car images uploaded successfully');
      return results;
    } catch (error) {
      console.error('❌ Error uploading multiple car images:', error);
      throw error;
    }
  }

  // Upload car image with progress tracking
  async uploadCarImageWithProgress(carId, file, onProgress) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Create file path
      const timestamp = Date.now();
      const fileName = `${carId}_main_${timestamp}.${file.name.split('.').pop()}`;
      const filePath = `cars/${carId}/images/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(this.storage, filePath);
      
      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Track progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress, snapshot.state);
          }
        },
        (error) => {
          console.error('❌ Upload error:', error);
          throw error;
        },
        async () => {
          // Upload completed
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const metadata = await getMetadata(uploadTask.snapshot.ref);
          
          const result = {
            url: downloadURL,
            path: filePath,
            fileName: fileName,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated
          };

          console.log('✅ Car image uploaded with progress tracking:', result);
          return result;
        }
      );

      return uploadTask;
    } catch (error) {
      console.error('❌ Error uploading car image with progress:', error);
      throw error;
    }
  }

  // Get car image URL
  async getCarImageURL(imagePath) {
    try {
      const storageRef = ref(this.storage, imagePath);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error getting car image URL:', error);
      throw error;
    }
  }

  // Get all car images
  async getCarImages(carId) {
    try {
      const carImagesPath = `cars/${carId}/images`;
      const storageRef = ref(this.storage, carImagesPath);
      
      const result = await listAll(storageRef);
      
      const imagePromises = result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        return {
          url: downloadURL,
          path: itemRef.fullPath,
          fileName: itemRef.name,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated
        };
      });

      const images = await Promise.all(imagePromises);
      console.log('✅ Car images retrieved successfully');
      return images;
    } catch (error) {
      console.error('❌ Error getting car images:', error);
      throw error;
    }
  }

  // Delete car image
  async deleteCarImage(imagePath) {
    try {
      const storageRef = ref(this.storage, imagePath);
      await deleteObject(storageRef);
      console.log('✅ Car image deleted successfully:', imagePath);
    } catch (error) {
      console.error('❌ Error deleting car image:', error);
      throw error;
    }
  }

  // Delete all car images
  async deleteAllCarImages(carId) {
    try {
      const carImagesPath = `cars/${carId}/images`;
      const storageRef = ref(this.storage, carImagesPath);
      
      const result = await listAll(storageRef);
      
      const deletePromises = result.items.map(itemRef => deleteObject(itemRef));
      await Promise.all(deletePromises);
      
      console.log('✅ All car images deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting all car images:', error);
      throw error;
    }
  }

  // ==================== USER PROFILE IMAGES ====================

  // Upload user profile image
  async uploadUserProfileImage(userId, file) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const maxSize = 2 * 1024 * 1024; // 2MB for profile images
      if (file.size > maxSize) {
        throw new Error('Profile image size must be less than 2MB');
      }

      // Create file path
      const timestamp = Date.now();
      const fileName = `profile_${timestamp}.${file.name.split('.').pop()}`;
      const filePath = `users/${userId}/profile/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(this.storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Get metadata
      const metadata = await getMetadata(snapshot.ref);
      
      const result = {
        url: downloadURL,
        path: filePath,
        fileName: fileName,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      };

      console.log('✅ User profile image uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error uploading user profile image:', error);
      throw error;
    }
  }

  // Get user profile image URL
  async getUserProfileImageURL(userId) {
    try {
      const profilePath = `users/${userId}/profile`;
      const storageRef = ref(this.storage, profilePath);
      
      const result = await listAll(storageRef);
      
      if (result.items.length > 0) {
        const downloadURL = await getDownloadURL(result.items[0]);
        return downloadURL;
      }
      
      return null; // No profile image found
    } catch (error) {
      console.error('❌ Error getting user profile image URL:', error);
      throw error;
    }
  }

  // Delete user profile image
  async deleteUserProfileImage(userId) {
    try {
      const profilePath = `users/${userId}/profile`;
      const storageRef = ref(this.storage, profilePath);
      
      const result = await listAll(storageRef);
      
      if (result.items.length > 0) {
        await deleteObject(result.items[0]);
        console.log('✅ User profile image deleted successfully');
      }
    } catch (error) {
      console.error('❌ Error deleting user profile image:', error);
      throw error;
    }
  }

  // ==================== DOCUMENTS MANAGEMENT ====================

  // Upload document (license, insurance, etc.)
  async uploadDocument(userId, file, documentType) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file type (PDF, images)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed. Only PDF and images are supported');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB for documents
      if (file.size > maxSize) {
        throw new Error('Document size must be less than 10MB');
      }

      // Create file path
      const timestamp = Date.now();
      const fileName = `${documentType}_${timestamp}.${file.name.split('.').pop()}`;
      const filePath = `users/${userId}/documents/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(this.storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Get metadata
      const metadata = await getMetadata(snapshot.ref);
      
      const result = {
        url: downloadURL,
        path: filePath,
        fileName: fileName,
        documentType: documentType,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      };

      console.log('✅ Document uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      throw error;
    }
  }

  // Get user documents
  async getUserDocuments(userId) {
    try {
      const documentsPath = `users/${userId}/documents`;
      const storageRef = ref(this.storage, documentsPath);
      
      const result = await listAll(storageRef);
      
      const documentPromises = result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        return {
          url: downloadURL,
          path: itemRef.fullPath,
          fileName: itemRef.name,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated
        };
      });

      const documents = await Promise.all(documentPromises);
      console.log('✅ User documents retrieved successfully');
      return documents;
    } catch (error) {
      console.error('❌ Error getting user documents:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  // Generate thumbnail URL (for car images)
  async generateThumbnailURL(imagePath, width = 300, height = 200) {
    try {
      // Note: Firebase Storage doesn't generate thumbnails automatically
      // This is a placeholder for future implementation
      // You might want to use a cloud function or image processing service
      const storageRef = ref(this.storage, imagePath);
      const downloadURL = await getDownloadURL(storageRef);
      
      // For now, return the original URL
      // In a real implementation, you might:
      // 1. Use Firebase Functions to generate thumbnails
      // 2. Use a third-party service like Cloudinary
      // 3. Store pre-generated thumbnails
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Error generating thumbnail URL:', error);
      throw error;
    }
  }

  // Update file metadata
  async updateFileMetadata(filePath, metadata) {
    try {
      const storageRef = ref(this.storage, filePath);
      await updateMetadata(storageRef, metadata);
      console.log('✅ File metadata updated successfully');
    } catch (error) {
      console.error('❌ Error updating file metadata:', error);
      throw error;
    }
  }

  // Get file metadata
  async getFileMetadata(filePath) {
    try {
      const storageRef = ref(this.storage, filePath);
      const metadata = await getMetadata(storageRef);
      return metadata;
    } catch (error) {
      console.error('❌ Error getting file metadata:', error);
      throw error;
    }
  }

  // Check if file exists
  async fileExists(filePath) {
    try {
      const storageRef = ref(this.storage, filePath);
      await getMetadata(storageRef);
      return true;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return false;
      }
      throw error;
    }
  }

  // Get storage usage statistics
  async getStorageUsage() {
    try {
      // Note: Firebase Storage doesn't provide direct usage statistics
      // This would typically be done through Firebase Functions or Admin SDK
      // For now, return a placeholder
      return {
        totalFiles: 0,
        totalSize: 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('❌ Error getting storage usage:', error);
      throw error;
    }
  }

  // ==================== BATCH OPERATIONS ====================

  // Upload multiple files with progress
  async uploadMultipleFiles(files, basePath, onProgress) {
    try {
      const results = [];
      let completed = 0;

      for (const file of files) {
        try {
          const timestamp = Date.now();
          const fileName = `${file.name.split('.')[0]}_${timestamp}.${file.name.split('.').pop()}`;
          const filePath = `${basePath}/${fileName}`;
          
          const storageRef = ref(this.storage, filePath);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          results.push({
            url: downloadURL,
            path: filePath,
            fileName: fileName,
            originalName: file.name
          });

          completed++;
          if (onProgress) {
            onProgress(completed, files.length, results[results.length - 1]);
          }
        } catch (error) {
          console.error(`❌ Error uploading file ${file.name}:`, error);
          results.push({
            error: error.message,
            originalName: file.name
          });
        }
      }

      console.log('✅ Multiple files uploaded successfully');
      return results;
    } catch (error) {
      console.error('❌ Error uploading multiple files:', error);
      throw error;
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(filePaths) {
    try {
      const deletePromises = filePaths.map(filePath => {
        const storageRef = ref(this.storage, filePath);
        return deleteObject(storageRef);
      });

      await Promise.all(deletePromises);
      console.log('✅ Multiple files deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting multiple files:', error);
      throw error;
    }
  }

  // ==================== SECURITY AND VALIDATION ====================

  // Validate file type
  validateFileType(file, allowedTypes) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    return true;
  }

  // Validate file size
  validateFileSize(file, maxSize) {
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }
    return true;
  }

  // Generate secure file name
  generateSecureFileName(originalName, prefix = '') {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const secureName = `${prefix}${timestamp}_${randomString}.${extension}`;
    return secureName;
  }
}

// Create global instance
const firebaseStorageService = new FirebaseStorageService();

// Export for use in other files
export { firebaseStorageService, storage };
export default firebaseStorageService;
