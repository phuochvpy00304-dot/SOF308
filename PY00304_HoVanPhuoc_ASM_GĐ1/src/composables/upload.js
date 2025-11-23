import { ref } from 'vue';

export function useFileUpload() {
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const uploadError = ref(null);

  // Validate file
  function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP)');
    }
    
    if (file.size > maxSize) {
      throw new Error('File quá lớn. Vui lòng chọn file dưới 5MB');
    }
    
    return true;
  }

  // Convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Upload single file
  async function uploadFile(file) {
    try {
      validateFile(file);
      isUploading.value = true;
      uploadError.value = null;
      uploadProgress.value = 0;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10;
        }
      }, 100);

      // Convert to base64 for demo (in production, upload to server)
      const base64 = await fileToBase64(file);
      
      // Simulate server response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      uploadProgress.value = 100;
      
      // For demo, return base64. In production, return server URL
      return {
        url: base64,
        filename: file.name,
        size: file.size,
        type: file.type
      };
      
    } catch (error) {
      uploadError.value = error.message;
      throw error;
    } finally {
      isUploading.value = false;
      setTimeout(() => {
        uploadProgress.value = 0;
      }, 2000);
    }
  }

  // Upload multiple files
  async function uploadFiles(files) {
    const results = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i]);
        results.push(result);
        uploadProgress.value = Math.round(((i + 1) / totalFiles) * 100);
      } catch (error) {
        console.error(`Error uploading file ${files[i].name}:`, error);
        results.push({ error: error.message, filename: files[i].name });
      }
    }
    
    return results;
  }

  // Generate thumbnail
  function generateThumbnail(file, maxWidth = 300, maxHeight = 300) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Reset upload state
  function resetUpload() {
    uploadProgress.value = 0;
    isUploading.value = false;
    uploadError.value = null;
  }

  return {
    uploadProgress,
    isUploading,
    uploadError,
    uploadFile,
    uploadFiles,
    generateThumbnail,
    validateFile,
    fileToBase64,
    resetUpload
  };
}

// Image utilities
export function useImageUtils() {
  // Get image dimensions
  function getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // Compress image
  function compressImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Create image preview URL
  function createPreviewUrl(file) {
    return URL.createObjectURL(file);
  }

  // Revoke preview URL
  function revokePreviewUrl(url) {
    URL.revokeObjectURL(url);
  }

  return {
    getImageDimensions,
    compressImage,
    createPreviewUrl,
    revokePreviewUrl
  };
}
