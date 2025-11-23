<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" href="#">VIBLO</a>
        <ul class="navbar-nav me-auto ms-3">
          <li class="nav-item"><a class="nav-link" href="#">Bài Viết</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Câu Hỏi</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Thảo Luận</a></li>
        </ul>
        <form class="d-flex me-3">
          <input class="form-control" type="search" placeholder="Tìm kiếm trên Viblo" />
        </form>
        <a href="#" class="btn btn-outline-primary btn-sm">Đăng nhập</a>
        <a href="#" class="btn btn-outline-primary btn-sm">Đăng ký</a>
      </div>
    </nav>

    <!-- Banner -->
    <div class="banner">
      🎉 Viblo May Fest đã khép lại. Cảm ơn các bạn đã đồng hành cùng chúng tôi trong sứ mệnh lan
      tỏa tri thức Việt!
    </div>

    <!-- Content -->
    <div class="container mt-4">
      <div class="row">
        <!-- Left Column -->
        <div class="col-lg-8">
          <div class="post-card">
            <div class="post-title">🚀 Viblo Mayfest 2025 | Công bố kết quả CHÍNH THỨC</div>
            <div class="post-meta">
              Viblo Team · 2 giờ trước · <span class="badge bg-primary">Announcement</span>
            </div>
          </div>

          <div class="post-card">
            <div class="post-title">📚 Học viên Pro nhận offer ANZ sau chuỗi bài tập!</div>
            <div class="post-meta">
              EngineerPro · 5 giờ trước · <span class="badge bg-secondary">Tag1</span>
              <span class="badge bg-secondary">Career</span>
            </div>
          </div>

          <div class="post-card">
            <div class="post-title">🔐 Keycloak API Document</div>
            <div class="post-meta">
              Minh Phạm · 7 giờ trước · <span class="badge bg-secondary">OAuth</span>
            </div>
          </div>

          <!-- Phân trang -->
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">...</a></li>
              <li class="page-item"><a class="page-link" href="#">2074</a></li>
            </ul>
          </nav>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
          <div class="sidebar-box">
            <h6 class="fw-bold mb-3">📌 Câu hỏi mới nhất</h6>
            <p class="mb-1">Cách sử dụng ransackable_scopes trong ROR?</p>
            <small class="text-muted">7 giờ trước · 10 lượt xem</small>
            <hr />
            <p class="mb-1">Chạy docker với nextjs app bị lỗi</p>
            <small class="text-muted">3 giờ trước · 90 lượt xem</small>
          </div>

          <div class="sidebar-box">
            <h6 class="fw-bold mb-3">🏆 Các tác giả hàng đầu</h6>

            <div class="d-flex align-items-center mb-2">
              <img src="https://i.pravatar.cc/36?img=1" class="author-img me-2" />
              <div>
                <div class="fw-bold">Minh Monem</div>
                <small>4.6K 🌟 · 351.7K 👁️</small>
              </div>
            </div>

            <div class="d-flex align-items-center mb-2">
              <img src="https://i.pravatar.cc/36?img=2" class="author-img me-2" />
              <div>
                <div class="fw-bold">Viblo Algorithm</div>
                <small>11.4K 🌟 · 1.8M 👁️</small>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <img src="https://i.pravatar.cc/36?img=3" class="author-img me-2" />
              <div>
                <div class="fw-bold">Quang Binh Trương</div>
                <small>136 🌟 · 1.0K 👁️</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer mt-5">
      <div class="container">
        <div class="row text-start">
          <div class="col-md-2">
            <div class="title">Tài nguyên</div>
            <a href="#">Bài viết</a>
            <a href="#">Câu hỏi</a>
            <a href="#">Videos</a>
            <a href="#">Thảo luận</a>
            <a href="#">Công cụ</a>
          </div>
          <div class="col-md-2">
            <div class="title">Tổ chức</div>
            <a href="#">Tech Talk</a>
            <a href="#">Sự kiện</a>
            <a href="#">Machine Learning</a>
          </div>
          <div class="col-md-2">
            <div class="title">Dịch vụ</div>
            <a href="#">Viblo</a>
            <a href="#">Viblo Code</a>
            <a href="#">Viblo CV</a>
            <a href="#">Viblo CTF</a>
            <a href="#">Viblo Partner</a>
          </div>
          <div class="col-md-3">
            <div class="title">Ứng dụng di động</div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              width="120"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/App_Store_%28iOS%29.svg"
              width="100"
            />
          </div>
          <div class="col-md-3">
            <div class="title">Liên kết</div>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Github</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Tạm thời chưa cần xử lý logic, sẽ thêm sau
</script>

<style scoped>
body {
  background-color: #f9f9f9;
  font-family: 'Segoe UI', sans-serif;
}
.banner {
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}
.post-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
.post-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.post-meta {
  font-size: 0.85rem;
  color: #555;
}
.footer {
  background: #0b1c3a;
  color: #ccc;
  padding: 40px 0;
  font-size: 0.9rem;
}
.footer a {
  color: #ccc;
  text-decoration: none;
  display: block;
  margin-bottom: 6px;
}
.footer .title {
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}
.author-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.pagination .page-link {
  color: #333;
}
.sidebar-box {
  background: white;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>
