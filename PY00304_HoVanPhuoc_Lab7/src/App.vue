<script setup>
import Ranking from './components/Ranking.vue';
import SeasonRender from './components/SeasonRender.vue';
import ListRender from './components/ListRender.vue';
import Bai4 from './components/Bai4.vue';
</script>

<template>
  <div class="container">
    <h1>Bài 1</h1>
    <Ranking/>
    <hr>
    <h1>Bài 2</h1>
    <season-render/>
    <hr>
    <h1>Bài 3</h1>
    <list-render/>
    <hr>
    <h1>Bài 4</h1>
    <bai-4/>
    <hr>
  </div>
</template>

<style scoped></style>
