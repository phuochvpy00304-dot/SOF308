<template>
  <div class="container">
    <h3>Nhập tháng</h3>
    <input type="number" step="1" v-model="month">
    <p v-if="month < 1 || month > 12" class="text-danger">Vui lòng nhập từ tháng 1 đến 12 !</p>
    <p v-else-if="month <= 3" style="color: pink;">Mùa xuân</p>
    <p v-else-if="month <= 6" class="text-warning">Mùa hè</p>
    <p v-else-if="month <= 9" style="color: brown;">Mùa thu</p>
    <p v-else style="color: turquoise;">Mùa đông</p>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const month = ref(1);
</script>

<style>

</style>