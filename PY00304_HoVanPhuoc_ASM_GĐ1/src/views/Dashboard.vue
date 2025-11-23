<template>
  <div>
    <h2 class="mb-4 fw-bold">🎛️ Bảng Điều Khiển Quản Trị</h2>

    <!-- Thống kê tổng -->
    <div class="row g-4 mb-5">
      <div class="col-md-3" v-for="card in stats" :key="card.title">
        <div class="card text-white bg-gradient h-100" :class="card.bg">
          <div class="card-body">
            <h6 class="card-title text-uppercase small">{{ card.title }}</h6>
            <p class="display-6 fw-bold">{{ card.count }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card shadow">
          <div class="card-header fw-bold">Tổng số bài viết theo tháng</div>
          <div class="card-body">
            <BarChart :data="postChartData" :chart-options="chartOptions" />
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card shadow">
          <div class="card-header fw-bold">Tỉ lệ người dùng theo vai trò</div>
          <div class="card-body">
            <DoughnutChart :data="userChartData" :chart-options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(...registerables)

const BarChart = Bar
const DoughnutChart = Doughnut

const stats = [
  { title: 'Người dùng', count: 123, bg: 'bg-success' },
  { title: 'Bài viết', count: 45, bg: 'bg-primary' },
  { title: 'Bình luận', count: 210, bg: 'bg-warning' },
  { title: 'Câu hỏi QnA', count: 17, bg: 'bg-danger' },
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
  },
}

const postChartData = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
  datasets: [
    {
      label: 'Bài viết',
      backgroundColor: '#0d6efd',
      data: [10, 18, 17],
    },
  ],
}

const userChartData = {
  labels: ['Admin', 'User'],
  datasets: [
    {
      label: 'Tỉ lệ vai trò',
      data: [5, 118],
      backgroundColor: ['#198754', '#0d6efd'],
    },
  ],
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.card-body {
  min-height: 180px;
}
</style>
