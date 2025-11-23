<template>
  <div class="container mt-5">
    <h1 class="text-center">Kiến thức sức khỏe cộng đồng</h1>
    <div class="row">
        <div class="col-sm-4 mb-4" v-for="(item, index) in items" :key="index">
            <Card :item="item" :index="index"/>
        </div>
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue';
import img1 from '../assets/images/img1.png';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';

const items = ([
    { title: '8 loại rau củ quả giàu canxi', content: 'Canxi là...', image: img1 },
    { title: 'Các loại gia vị tốt cho sức khỏe', content: 'Một số loại...', image: img2 },
    { title: '9 loại đậu bổ dưỡng nên dùng nhiều', content: 'Đậu lăng...', image: img3 },
]);
</script>

<style scoped>
    
</style>