<template>
  <div class="about-page-bg">
    <Navbar />

    <!-- Header Section -->
    <header class="container text-center py-5">
      <h1 class="display-4 fw-bold">Chào mừng đến với CatBase Stories</h1>
      <p class="lead text-muted col-lg-8 mx-auto">
        Một góc ấm cúng trên internet dành cho những người yêu mèo, người kể chuyện và bất kỳ ai tin vào sức mạnh của việc chia sẻ những khoảnh khắc chân thực.
      </p>
      <div class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <a href="/register" class="btn btn-brown btn-lg">Bắt đầu viết ngay hôm nay</a>
        <a href="/blog" class="btn btn-outline-brown btn-lg">Khám phá câu chuyện</a>
        <a href="/about" class="btn btn-brown-light btn-lg">Tìm hiểu thêm</a>
      </div>
    </header>

    <!-- Introduction Section -->
    <div class="container my-5">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <h2 class="fw-bold mb-3">CatBase là gì?</h2>
          <p>
            CatBase không chỉ là một blog; đó là một cộng đồng được xây dựng trên nền tảng của những trải nghiệm chung. Chúng tôi tin rằng mọi người đều có một câu chuyện đáng để kể—dù đó là một cuộc phiêu lưu lớn, một suy ngẫm yên lặng, hay một câu chuyện hài hước về người bạn mèo của bạn.
          </p>
          <p class="mb-4">
            Nền tảng của chúng tôi cung cấp một không gian đẹp, đơn giản và truyền cảm hứng để bạn viết, chia sẻ và kết nối với những người khác, những người trân trọng nghệ thuật kể chuyện và niềm vui mà mèo mang lại cho cuộc sống của chúng ta.
          </p>
        </div>
        <div class="col-lg-6">
          <img src="https://whatyourcatwants.com/wp-content/uploads/2020/09/Big_Fat_Red_Cat-Wikimedia-Commons-1500x800.jpg" alt="Mèo vui vẻ" class="img-fluid rounded-4 shadow-lg" />
        </div>
      </div>
    </div>

    <!-- Our Values Section -->
    <section class="container my-5 py-5 bg-white rounded-4 shadow-sm">
        <div class="text-center mb-5">
            <h2 class="fw-bold">Giá trị cốt lõi của chúng tôi</h2>
            <p class="lead text-muted">Những nguyên tắc dẫn dắt cộng đồng của chúng tôi.</p>
        </div>
        <div class="row text-center g-4">
            <div class="col-md-4">
                <div class="p-3">
                    <i class="bi bi-heart-fill fs-1 text-danger mb-3"></i>
                    <h4 class="fw-semibold">Đồng cảm</h4>
                    <p class="text-muted">Chúng tôi lắng nghe và kết nối với lòng tử tế, tạo ra một không gian hỗ trợ cho tất cả các tiếng nói.</p>
                </div>
            </div>
            <div class="col-md-4">
                 <div class="p-3">
                    <i class="bi bi-shield-check fs-1 text-success mb-3"></i>
                    <h4 class="fw-semibold">Chân thực</h4>
                    <p class="text-muted">Hãy chia sẻ con người thật của bạn. Chúng tôi tôn vinh những câu chuyện chân thành và những suy ngẫm trung thực.</p>
                </div>
            </div>
            <div class="col-md-4">
                 <div class="p-3">
                    <i class="bi bi-lightbulb-fill fs-1 text-warning mb-3"></i>
                    <h4 class="fw-semibold">Sáng tạo</h4>
                    <p class="text-muted">Chúng tôi truyền cảm hứng cho sự sáng tạo và cung cấp các công cụ để kể chuyện một cách đẹp đẽ.</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Meet the Team Section -->
    <div class="container my-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold">Gặp gỡ đội ngũ của chúng tôi</h2>
            <p class="lead text-muted">Những người đứng sau CatBase, tận tâm với cộng đồng của chúng tôi.</p>
        </div>
        <div class="row g-4 justify-content-center">
            <!-- Team Member Card 1 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_101" alt="Quản Trị Mèo" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Quản Trị Mèo</h5>
                        <p class="text-primary fw-semibold mb-2">Người sáng lập & Quản trị viên</p>
                        <p class="card-text text-muted small">Người có tầm nhìn đã khởi đầu tất cả, đảm bảo nền tảng hoạt động trơn tru cho mọi người.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 2 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_201" alt="Anya Volkov" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Anya Volkov</h5>
                        <p class="text-primary fw-semibold mb-2">Tác giả chính & Kỹ thuật viên thú y</p>
                        <p class="card-text text-muted small">Chuyên gia của chúng tôi về sức khỏe mèo, cung cấp lời khuyên đáng tin cậy và những câu chuyện ấm lòng.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 3 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_202" alt="Liam Gallagher" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Liam Gallagher</h5>
                        <p class="text-primary fw-semibold mb-2">Chuyên gia cộng đồng & Chải lông</p>
                        <p class="card-text text-muted small">Gương mặt thân thiện của cộng đồng chúng tôi và người phụ trách mọi thứ liên quan đến chải lông.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 4 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_203" alt="Mia Chen" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Mia Chen</h5>
                        <p class="text-primary fw-semibold mb-2">Người quản lý nội dung</p>
                        <p class="card-text text-muted small">Mang những câu chuyện về mèo hay nhất đến ánh đèn sân khấu và giữ nội dung của chúng tôi luôn mới mẻ và truyền cảm hứng.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 5 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_204" alt="Oscar Nguyen" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Oscar Nguyen</h5>
                        <p class="text-primary fw-semibold mb-2">Trưởng nhóm kỹ thuật</p>
                        <p class="card-text text-muted small">Đảm bảo CatBase hoạt động trơn tru và an toàn cho tất cả người dùng, mỗi ngày.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 6 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_205" alt="Sophie Tran" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Sophie Tran</h5>
                        <p class="text-primary fw-semibold mb-2">Quản lý cộng đồng</p>
                        <p class="card-text text-muted small">Kết nối các thành viên, tổ chức sự kiện và xây dựng một môi trường thân thiện cho tất cả.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Final CTA -->
    <section class="container my-5">
      <div class="text-center bg-white p-5 rounded-4 shadow-sm">
        <h2 class="fw-bold">Sẵn sàng chia sẻ câu chuyện của bạn?</h2>
        <p class="lead text-muted col-lg-8 mx-auto">
          Tham gia cộng đồng ngày càng phát triển của những nhà văn đam mê và những người yêu mèo. Chương tiếp theo của bạn bắt đầu từ đây.
        </p>
        <a href="/register" class="btn btn-brown btn-lg mt-3 me-2">
            <i class="bi bi-pencil-square me-2"></i>Tạo bài viết đầu tiên của bạn
        </a>
        <a href="/blog" class="btn btn-outline-brown btn-lg mt-3 me-2">
            <i class="bi bi-book me-2"></i>Đọc câu chuyện
        </a>
        <a href="/about" class="btn btn-brown-light btn-lg mt-3">
            <i class="bi bi-info-circle me-2"></i>Về chúng tôi
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>

<style scoped>
.about-page-bg {
    background-color: #fff8f0;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 6px;
  min-width: 120px;
}
.btn-brown:hover,
.btn-brown:focus {
  background-color: #8d6843;
  color: #fff;
}

.btn-outline-brown {
  background-color: transparent;
  border: 2px solid #a67c52;
  color: #a67c52;
  font-weight: 600;
  border-radius: 6px;
  min-width: 120px;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-brown:hover,
.btn-outline-brown:focus {
  background-color: #a67c52;
  color: #fff;
}

.btn-brown-light {
  background-color: #ffd6c0;
  border: none;
  color: #a67c52;
  font-weight: 600;
  border-radius: 6px;
  min-width: 120px;
  transition: background 0.2s, color 0.2s;
}
.btn-brown-light:hover,
.btn-brown-light:focus {
  background-color: #ffe5d1;
  color: #a67c52;
}

.hover-lift {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.rounded-4 {
    border-radius: 1rem !important;
}
</style>
