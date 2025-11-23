<template>
    <div class="my-3">
        <h2 class="mb-3">Danh sách sinh viên</h2>
        <div class="input-group mb-3 w-25">
            <input type="number" min="0" max="10" step="1" placeholder="Lọc sinh viên" class="form-control" v-model="filter">
            <button class="btn btn-info" @click.prevent="doFilter">Lọc</button>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" v-html="header"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(student, index) in displayStudents" :key="index">
                    <td v-html="student.name"></td>
                    <td v-html="student.age"></td>
                    <td v-html="student.gpa"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    students: Array
});

const displayStudents = ref(props.students);

const headers = Object.keys(props.students.at(0));

const filter = ref('');
function doFilter(){
    displayStudents.value = props.students.filter((stud) => stud.gpa >= filter.value);
}
</script>

<style></style>