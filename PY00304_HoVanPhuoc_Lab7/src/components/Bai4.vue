<template>
    <div class="row">
        <form @submit.prevent="submitForm" class="col-sm-4">
            <h3>Thêm học sinh</h3>
            <div class="my-3">
                <label for="name">Họ tên</label>
                <input type="text" class="form-control" v-model="student.name" id="name" required>
            </div>
            <div class="mb-3">
                <label for="score">Điểm</label>
                <input type="number" min="0" max="10" step="0.1" class="form-control" v-model="student.score" id="score"
                    required>
            </div>
            <div class="mb-3">
                <label for="dob">Ngày sinh</label>
                <input type="date" class="form-control" v-model="student.dob" id="dob" required>
            </div>
            <button type="submit" class="btn btn-success">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
        </form>
        <div class="col-sm">
            <h3>Danh sách học sinh</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Họ và tên</th>
                        <th scope="col">Điểm</th>
                        <th scope="col">Ngày sinh</th>
                        <th colspan="2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in students" :key="index" @dblclick="editStudent(index)">
                        <td>{{ student.name }}</td>
                        <td>{{ student.score }}</td>
                        <td>{{ student.dob }}</td>
                        <td><button class="btn btn-danger" @click="deleteStudent(index)">Xóa</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const students = ref([
    { name: 'Nguyễn Văn B', score: '8', dob: '2006-01-01' },
    { name: 'Nguyễn Văn A', score: '9', dob: '2006-05-15' }
]);

const student = ref({
    name: '',
    score: '',
    dob: ''
});

const isEditing = ref(false);
const editingIndex = ref(-1);

function submitForm() {
    if (isEditing.value) {
        students.value[editingIndex.value] = { ...student.value };
        isEditing.value = false;
        editingIndex.value = -1;
    } else {
        students.value.push({ ...student.value });
    }
    resetForm();
}

function editStudent(index) {
    student.value = { ...students.value[index] };
    isEditing.value = true;
    editingIndex.value = index;
}

function deleteStudent(index) {
    students.value.splice(index, 1);
}

function resetForm() {
    student.value = {
        name: '',
        score: '',
        dob: ''
    };
}

</script>

<style></style>