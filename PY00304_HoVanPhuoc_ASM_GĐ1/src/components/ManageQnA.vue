<template>
  <div>
    <h3>Manage Q&A</h3>
    <table class="table table-bordered mt-3">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Câu hỏi</th>
          <th>Hỏi bởi</th>
          <th>Số câu trả lời</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="qna in qnaList" :key="qna.id">
          <td>{{ qna.id }}</td>
          <td>{{ qna.question }}</td>
          <td>{{ qna.asked_by }}</td>
          <td>{{ qna.answers }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2">Edit</button>
            <button class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const qnaList = [
  { id: 1, question: 'How to use Vue 3?', asked_by: 'user4', answers: 2 },
  { id: 2, question: 'Bootstrap vs Tailwind?', asked_by: 'user5', answers: 3 },
]
</script>
