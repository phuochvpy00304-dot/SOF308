<template>
    <div>
        <LoginComponent v-if="!isLoggedIn" @loggedIn="handleLoginSuccess" />

        <CommentComponent v-else :username="loggedInUser" />
    </div>
</template>

<script setup>
import LoginComponent from './LoginComponent.vue';
import CommentComponent from './CommentComponent.vue';

import { ref } from 'vue';

const isLoggedIn = ref(false);
const loggedInUser = ref('');

function handleLoginSuccess(username) {
    loggedInUser.value = username;
    isLoggedIn.value = true;
}
</script>

<style></style>