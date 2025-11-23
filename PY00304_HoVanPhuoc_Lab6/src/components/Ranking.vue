<script setup>
    import { ref, computed } from 'vue';

    const pts = ref(0.0);

    const getRank = computed(() => {
        switch(true){
            case pts.value < 5:  return "Yếu";
            case pts.value < 6.5:  return "Trung bình";
            case pts.value < 8.0:  return "Khá";
            case pts.value < 9.0:  return "Giỏi";
            default:  return "Xuất sắc";
        }
    });
</script>

<template>
  <div class="container">
    <h1>Nhập điểm của bạn</h1>
    <input type="number" min="0" max="10" step="0.5" v-model="pts">
    <p class="text-lg">{{ getRank }}</p>
  </div>
</template>

<style>

</style>