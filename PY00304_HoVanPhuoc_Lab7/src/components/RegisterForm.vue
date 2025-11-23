<template>
    <div class="row">
        <div class="col-md">
            <h3>Form Đăng nhập</h3>
            <form @submit.prevent="register">
                <div class="mb-3 mt-3">
                    <label>Họ tên:</label>
                    <input type="text" class="form-control" v-model="fullname" placeholder="Nhập tên">
                    <p v-if="emailError" style="color: red;">{{ nameError }}</p>
                </div>
                <div class="mb-3 mt-3">
                    <label>Email:</label>
                    <input type="text" class="form-control" v-model="email" placeholder="Nhập email">
                    <p v-if="emailError" style="color: red;">{{ emailError }}</p>
                </div>
                <div class="mb-3">
                    <label>Mật khẩu:</label>
                    <input type="password" class="form-control" v-model="password" placeholder="Nhập mật khẩu">
                    <p v-if="passwordError" style="color: red;">{{ passwordError }}</p>
                </div>
                <div class="mb-3">
                    <label class="form-label">Ngày sinh:</label>
                    <input type="date" class="form-control" v-model="dob">
                    <p v-if="dobError" style="color: red;">{{ dobError }}</p>
                </div>

                <div class="mb-3">
                    <label class="">Giới tính:</label>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" id="male" v-model="gender" value="Nam">
                        <label class="form-check-label" for="male">Nam</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" id="female" v-model="gender" value="Nữ">
                        <label class="form-check-label" for="female">Nữ</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" id="other" v-model="gender" value="Khác">
                        <label class="form-check-label" for="other">Khác</label>
                    </div>
                    <p v-if="genderError" style="color: red;">{{ genderError }}</p>
                </div>

                <div class="mb-3">
                    <label class="">Ngôn ngữ:</label>
                    <div class="form-check form-check-inline">
                        <input type="checkbox" class="form-check-input" id="vn" v-model="lang" value="Tiếng Việt"
                            checked>
                        <label class="form-check-label" for="vn">Tiếng Việt</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="checkbox" class="form-check-input" id="eng" v-model="lang" value="Tiếng Anh">
                        <label class="form-check-label" for="eng">Tiếng Anh</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="checkbox" class="form-check-input" id="jp" v-model="lang" value="Tiếng Nhật">
                        <label class="form-check-label" for="jp">Tiếng Nhật</label>
                    </div>
                    <p v-if="langError" style="color: red;">{{ langError }}</p>
                </div>
                <button type="submit" class="btn btn-primary">Đăng ký</button>
            </form>
        </div>

        <div class="col-md">
            <h3 class="mb-3">Thông tin đã đăng ký</h3>
            <p><strong>Họ tên: </strong>{{ fullname }}</p>
            <p><strong>Email: </strong>{{ email }}</p>
            <p><strong>Ngày sinh: </strong>{{ dob }}</p>
            <p><strong>Giới tính: </strong>{{ gender }}</p>
            <p><strong>Ngôn ngữ: </strong>{{ lang.toString() }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const fullname = ref('');
const email = ref('');
const password = ref('');
const dob = ref('');
const gender = ref('');
const lang = ref([]);

const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const dobError = ref('');
const genderError = ref('');
const langError = ref('');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = () => {
    // Reset thông điệp lỗi
    nameError.value = '';
    emailError.value = '';
    passwordError.value = '';
    dobError.value = '';
    genderError.value = '';
    langError.value = '';

    if (!fullname.value) {
        nameError.value = 'Họ tên là bắt buộc';
    }

    // Validate email
    if (!email.value) {
        emailError.value = 'Email là bắt buộc.';
    } else if (!emailRegex.test(email.value)) {
        emailError.value = 'Vui lòng nhập email hợp lệ.';
    }

    // Validate mật khẩu
    if (!password.value) {
        passwordError.value = 'Mật khẩu là bắt buộc.';
    }

    if (!dob.value) {
        dobError.value = 'Ngày sinh là bắt buộc';
    }

    if (!gender.value) {
        genderError.value = 'Giới tính là bắt buộc';
    }

    if (lang.value.length === 0) {
        langError.value = 'Ngôn ngữ là bắt buộc';
    }

    // Nếu không có lỗi, xử lý login
    if (!nameError.value && !emailError.value && !passwordError.value && !dobError.value) {
        Swal.fire({
            icon: "success",
            title: "Đăng ký thành công",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

const logout = () => {
    isLoggedIn.value = false;
    email.value = '';
    password.value = '';
    emailError.value = '';
    passwordError.value = '';
}
</script>

<style></style>