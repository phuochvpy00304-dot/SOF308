<template>
    <h1>{{ greeting }}</h1>

    <button :title="buttonTitle" @click="changeGreeting">Click để thay đổi</button>
  </template>

  <script>
    export default {
        data(){
            return {
                greeting: 'Xin chào bạn',
                buttonTitle: 'Nhấp để thay đổi lời chào'
            }
        },
        methods: {
            changeGreeting(){
                this.greeting   = 'Hello, World';
                this.buttonTitle = 'Lời chào mới đã được cập nhật';
            }
        }
    }
</script>
  
  <style scoped>
    h1{color: red;}
  </style>