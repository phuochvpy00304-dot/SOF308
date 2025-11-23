<template>
    <div class="card">
        <img :src="item.image" class="card-img-top" :alt="`Hình ảnh ${index + 1}`">
        <div class="card-body d-flex flex-column justify-content-between">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-text">{{ item.content }}</p>
            <button class="btn btn-info">Xem chi tiết</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['item', 'index']);
</script>

<style scoped>
img {
    width: 414px;
    height: 276px;
}

.card-body {
    height: 185px;
}
</style>