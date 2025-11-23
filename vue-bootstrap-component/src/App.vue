<script setup>
import Table from './components/Table.vue';
const headers = ['Tên', 'Tuổi', 'Điểm trung bình'];
const students = [
    { name: "An", age: 20, gpa: 8.5 },
    { name: "Bình", age: 22, gpa: 9.0 },
    { name: "Chi", age: 19, gpa: 7.5 }
];

const editBtn = {btnTitle: 'Edit', btnClass: 'btn btn-primary', emitFn: 'editing'};

function edit(student){
  alert(student.name);
}
</script>
<template>
  <Table :row-counter="false" :headers="headers" :items="students" :actions="[editBtn]" @editing="edit" class="table-bordered"></Table>
</template>

<style scoped>

</style>
