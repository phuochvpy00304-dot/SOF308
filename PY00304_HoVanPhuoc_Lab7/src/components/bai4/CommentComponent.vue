<template>
  <div class="col-sm-4 m-5">
    <h2>Bình luận bài viết</h2>
    <div class="card">
        <img src="./eat-clean.png" alt="">
        <div class="card-body">
            <h3 class="card-title">8 loại rau củ quả giàu canxi</h3>
            <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, dolorum? Fugiat accusantium delectus ut, aliquid odio voluptate ipsum commodi amet sapiente! Magnam odio consectetur debitis officia? Fuga suscipit unde hic!</p>
        </div>
    </div>
    <form @submit.prevent="submitComment">
        <div class="mt-3">
            <textarea v-model="commentText" cols="60" rows="10" placeholder="Nhập bình luận của bạn" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-success">Gửi bình luận</button>
    </form>

    <div class="mt-3" v-if="comments.length">
        <h5>Danh sách các bình luận</h5>
        <ul style="list-style-type: circle;">
            <li v-for="(comment, index) in comments" :key="index">
                <p><strong>{{comment.name}}</strong>: {{comment.text}}</p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
const props = defineProps(['username']);

const commentText = ref('');

const comments = ref([]);

function submitComment() {
    if(commentText.value){
        comments.value.push({
            name: props.username,
            text: commentText.value
        });

        commentText.value = '';
    }
}
</script>

<style>

</style>