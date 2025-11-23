<script setup>
  import {ref} from 'vue';
  import CreatePost from './components/bai4/CreatePost.vue';
  import PostList from './components/bai4/PostList.vue';

  const posts = ref([]);

  function addPost(post){
    posts.value.push(post);
  }
</script>

<template>
  <div>
    <h1>Ứng dụng Blog nhỏ với Vue.js</h1>
    <CreatePost @add-post="addPost"/>
    <PostList :posts="posts"/>
  </div>
</template>

<style scoped>
  #mini-app{
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
</style>
