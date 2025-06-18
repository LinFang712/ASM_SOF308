<template>
  <div class="container py-5">
    <h1>Giới thiệu về CatBase</h1>
    <p>
      CatBase là một nền tảng blog cá nhân nơi bạn có thể chia sẻ những câu chuyện, trải nghiệm và cảm xúc của mình với cộng đồng. Chúng tôi tin rằng mỗi người đều có những khoảnh khắc đáng nhớ và bài học quý giá để lan tỏa.
    </p>
    <div class="row mt-4">
      <div class="col-md-6">
        <h4>Sứ mệnh</h4>
        <p>
          Mang đến không gian an toàn, thân thiện để mọi người tự do viết, đọc và kết nối qua những dòng nhật ký, bài viết và cảm xúc thật.
        </p>
      </div>
      <div class="col-md-6">
        <h4>Đội ngũ phát triển</h4>
        <ul>
          <li>Nguyễn Văn A - Founder & Developer</li>
          <li>Trần Thị B - UI/UX Designer</li>
          <li>Lê Văn C - Content & Community</li>
        </ul>
      </div>
    </div>
    <div class="mt-4">
      <h4>Liên hệ</h4>
      <p>
        Email: <a href="mailto:catbase@example.com">catbase@example.com</a><br />
        Facebook: <a href="https://facebook.com/catbase" target="_blank">facebook.com/catbase</a>
      </p>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for static content
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h4 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

p {
  line-height: 1.6;
}

ul {
  padding-left: 1.2rem;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>