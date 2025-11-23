<template>
    <div class="container">
        <div class="input-group my-3 w-25">
            <input type="text" placeholder="Nhập tên sinh viên để xóa" class="form-control" v-model="filter">
            <button class="btn btn-info" @click.prevent="doFilter">Lọc</button>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" v-html="header"></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(student, index) in displayStudents" :key="index">
                    <td v-html="student.name"></td>
                    <td v-html="student.age"></td>
                    <td v-html="student.gpa"></td>
                    <td><button class="btn btn-outline-info" @click.prevent="doNotify(student)">Gửi thông báo</button></td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const students = JSON.parse(localStorage.getItem('students'));

const displayStudents = ref([]);

const headers = Object.keys(students.at(0));

const filter = ref('');

function doFilter() {
    displayStudents.value = students.filter((stud) => stud.name === filter.value);
}

function doNotify(student) {
    alert(`Thông báo cho sinh viên ${student.name}, DTB là ${student.gpa}`);
}
</script>

<style></style>