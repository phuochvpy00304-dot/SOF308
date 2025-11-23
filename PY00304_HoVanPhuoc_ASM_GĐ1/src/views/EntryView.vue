<template>
    <div class="container">
        <Form @student-created="addStudent"></Form>
        <Table :students="students"></Table>
        <div class="input-group mb-3 w-25">
            <input type="text" placeholder="Nhập tên sinh viên để xóa" class="form-control" v-model="deletingName">
            <button class="btn btn-danger" @click.prevent="doDelete">Xóa</button>
        </div>
    </div>
</template>

<script setup>
import { ref , reactive } from 'vue';
import Table from '@/components/Table.vue';
import Form from '@/components/Form.vue';

const students = reactive(JSON.parse(localStorage.getItem('students')) || [
    { name: "An", age: 20, gpa: 8.5 },
    { name: "Bình", age: 22, gpa: 9.0 },
    { name: "Chi", age: 19, gpa: 7.5 }
]);

localStorage.setItem('students', JSON.stringify(students));

const deletingName = ref('');

function addStudent(stud){
    let student = {
        name: stud.name,
        age: Number(stud.age),
        gpa: Number(stud.gpa),
    }

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
}

function doDelete(){
    students.forEach((stud, index) => {
        if(stud.name === deletingName.value){
            students.splice(index, 1);
        }
    });
    localStorage.setItem('students', JSON.stringify(students));
    deletingName.value = '';
}
</script>

<style></style>