<template>
  <div class="form-container">
    <!-- Alert Messages -->
    <div
      v-if="message"
      :class="`alert alert-dismissible fade show ${success ? 'alert-success' : 'alert-danger'}`"
      role="alert"
    >
      <i
        :class="`fas ${success ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`"
      ></i>
      {{ message }}
      <button
        type="button"
        class="btn-close"
        @click="message = ''"
        aria-label="Close"
      ></button>
    </div>

    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Title Input -->
      <div class="mb-4">
        <label for="title" class="form-label fw-semibold">
          <i class="fas fa-file-lines me-2 text-primary"></i>Tiêu đề bài viết
        </label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="form-control form-control-lg"
          placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
          required
        />
      </div>

      <!-- Image Upload Section -->
      <div class="mb-4">
        <label for="thumbnail" class="form-label fw-semibold">
          <i class="fas fa-image me-2 text-primary"></i>Ảnh minh họa
        </label>

        <!-- Upload Area -->
        <div
          class="upload-area"
          @click="triggerFileInput"
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
        >
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            class="d-none"
            accept="image/*"
            multiple
          />

          <div v-if="!selectedImages.length" class="upload-placeholder">
            <i class="fas fa-images fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Kéo thả ảnh vào đây hoặc click để chọn</h5>
            <p class="text-muted">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB mỗi ảnh)</p>
          </div>

          <!-- Image Preview Grid -->
          <div v-else class="image-preview-grid">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="image-preview-item"
            >
              <img
                :src="image.preview"
                :alt="`Preview ${index + 1}`"
                class="preview-image"
              />
              <div class="image-overlay">
                <button
                  type="button"
                  @click.stop="removeImage(index)"
                  class="btn btn-danger btn-sm"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button
                  type="button"
                  @click.stop="setMainImage(index)"
                  :class="`btn btn-sm ${image.isMain ? 'btn-warning' : 'btn-outline-warning'}`"
                >
                  <i class="fas fa-star"></i>
                </button>
              </div>
              <div v-if="image.isMain" class="main-badge">
                <i class="fas fa-star"></i> Ảnh chính
              </div>
            </div>

            <!-- Add More Button -->
            <div class="add-more-btn" @click="triggerFileInput">
              <i class="fas fa-plus fa-2x text-muted"></i>
              <p class="text-muted mb-0">Thêm ảnh</p>
            </div>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-3">
          <div class="progress">
            <div class="progress-bar" :style="`width: ${uploadProgress}%`">
              {{ uploadProgress }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Content Editor -->
      <div class="mb-4">
        <label class="form-label fw-semibold"> Nội dung bài viết </label>
        <div class="border rounded">
          <Ckeditor
            :editor="editor"
            v-model="content"
            :config="editorConfig"
            class="min-height-200"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          v-if="isEditing"
          type="button"
          class="btn btn-outline-secondary me-md-2"
          @click="cancelEdit"
        >
          <i class="fas fa-times me-2"></i>Hủy
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary me-md-2"
          @click="resetForm"
        >
          Làm mới
        </button>
        <button
          :disabled="isSubmitting"
          type="submit"
          class="btn btn-primary btn-lg px-4"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          <i
            v-else
            :class="`fas ${isEditing ? 'fa-save' : 'fa-paper-plane'} me-2`"
          ></i>
          {{
            isSubmitting
              ? isEditing
                ? "Đang cập nhật..."
                : "Đang đăng..."
              : isEditing
                ? "Cập nhật bài viết"
                : "Đăng bài viết"
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const title = ref("");
const content = ref("");
const selectedImages = ref([]);
const message = ref("");
const success = ref(true);
const isSubmitting = ref(false);
const uploadProgress = ref(0);
const fileInput = ref(null);
const editor = ClassicEditor;
const isEditing = ref(false);
const editingPostId = ref(null);

const props = defineProps({
  editPost: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["post-success", "cancel-edit"]);

const editorConfig = {
  language: "vi",
  licenseKey: "GPL",
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "blockQuote",
    "insertTable",
    "|",
    "undo",
    "redo",
  ],
};

// Watch for edit post prop changes
watch(
  () => props.editPost,
  (newPost) => {
    if (newPost) {
      isEditing.value = true;
      editingPostId.value = newPost.id;
      title.value = newPost.title;
      content.value = newPost.content;

      // Load existing images
      if (newPost.images && newPost.images.length > 0) {
        selectedImages.value = newPost.images.map((img, index) => ({
          file: null,
          preview: img.url,
          url: img.url,
          isMain: img.isMain || index === 0,
          uploaded: true,
        }));
      }
    }
  },
  { immediate: true }
);

function triggerFileInput() {
  fileInput.value.click();
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  processFiles(files);
}

function handleDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
}

function processFiles(files) {
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      if (file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        const reader = new FileReader();
        reader.onload = (e) => {
          selectedImages.value.push({
            file: file,
            preview: e.target.result,
            url: null,
            isMain: selectedImages.value.length === 0,
            uploaded: false,
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert(`File ${file.name} quá lớn. Vui lòng chọn ảnh dưới 5MB.`);
      }
    }
  });
}

function removeImage(index) {
  const wasMain = selectedImages.value[index].isMain;
  selectedImages.value.splice(index, 1);

  // Set new main image if removed image was main
  if (wasMain && selectedImages.value.length > 0) {
    selectedImages.value[0].isMain = true;
  }
}

function setMainImage(index) {
  selectedImages.value.forEach((img, i) => {
    img.isMain = i === index;
  });
}

async function uploadImages() {
  const uploadedImages = [];
  uploadProgress.value = 0;

  for (let i = 0; i < selectedImages.value.length; i++) {
    const imageData = selectedImages.value[i];

    if (imageData.uploaded) {
      // Already uploaded (editing mode)
      uploadedImages.push({
        url: imageData.url,
        isMain: imageData.isMain,
      });
    } else {
      // New image to upload
      try {
        const formData = new FormData();
        formData.append("image", imageData.file);

        const response = await fetch("https://sof308-json-server-production.up.railway.app/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          uploadedImages.push({
            url: result.url,
            isMain: imageData.isMain,
          });
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        // For demo, use base64 data URL
        uploadedImages.push({
          url: imageData.preview,
          isMain: imageData.isMain,
        });
      }
    }

    uploadProgress.value = Math.round(
      ((i + 1) / selectedImages.value.length) * 100
    );
  }

  return uploadedImages;
}

function generateId() {
  return Math.random().toString(36).substr(2, 4);
}

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  if (!title.value.trim() || !content.value.trim()) {
    message.value = "Vui lòng nhập đủ tiêu đề và nội dung!";
    success.value = false;
    return;
  }

  isSubmitting.value = true;

  try {
    // Upload images first
    const uploadedImages =
      selectedImages.value.length > 0 ? await uploadImages() : [];

    const post = {
      title: title.value,
      content: content.value,
      images: uploadedImages,
      thumbnail:
        uploadedImages.find((img) => img.isMain)?.url ||
        uploadedImages[0]?.url ||
        "",
      authorId: 2,
      createdAt: isEditing.value
        ? props.editPost.createdAt
        : new Date().toISOString(),
      updatedAt: isEditing.value ? new Date().toISOString() : undefined,
    };

    if (!isEditing.value) {
      post.id = generateId();
    }

    const url = isEditing.value
      ? `https://sof308-json-server-production.up.railway.app/posts/${editingPostId.value}`
      : "https://sof308-json-server-production.up.railway.app/posts";

    const method = isEditing.value ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (res.ok) {
      emit("post-success");
      message.value = isEditing.value
        ? "Cập nhật bài viết thành công!"
        : "Đăng bài thành công!";
      success.value = true;
      resetForm();
      setTimeout(() => (message.value = ""), 3000);
    } else {
      throw new Error("Failed to save post");
    }
  } catch (err) {
    message.value = "Có lỗi khi đăng bài!";
    success.value = false;
  }

  isSubmitting.value = false;
  uploadProgress.value = 0;
};

const resetForm = () => {
  title.value = "";
  content.value = "";
  selectedImages.value = [];
  uploadProgress.value = 0;
  if (fileInput.value) fileInput.value.value = "";
  isEditing.value = false;
  editingPostId.value = null;
};

const cancelEdit = () => {
  resetForm();
  emit("cancel-edit");
};
</script>

<style scoped>
.form-container {
  padding: 1rem;
}

.min-height-200 {
  min-height: 200px;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.upload-area.dragover {
  border-color: #007bff;
  background-color: #e3f2fd;
}

/* Image Preview Grid */
.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #dee2e6;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-item:hover .image-overlay {
  opacity: 1;
}

.main-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffc107, #ff8f00);
  color: white;
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.add-more-btn {
  aspect-ratio: 1;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-more-btn:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

/* Progress Bar */
.progress {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(135deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 0.5rem;
  }

  .upload-area {
    padding: 1rem;
    min-height: 150px;
  }

  .image-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
