<template>
  <div>
    <Navbar />
    <div class="container py-5 search-container">
      <h1 class="mb-4 text-primary">Tìm Kiếm</h1>
      <p v-if="!query" class="text-muted">Vui lòng nhập một từ khóa tìm kiếm.</p>
      <p v-else class="mb-4">Hiển thị kết quả cho: <strong>{{ query }}</strong></p>

      <div class="search-bar mb-5">
        <form class="d-flex" role="search" @submit.prevent="handleSearch">
          <input v-model="searchQuery" class="form-control search-input me-2" type="search" :placeholder="'Tìm kiếm ' + (query || '...')" />
          <button type="submit" class="btn btn-brown">Tìm</button>
        </form>
      </div>

      <div v-if="!query" class="text-center text-muted">
        <p>Không có từ khóa tìm kiếm được cung cấp. Vui lòng sử dụng thanh tìm kiếm ở trên.</p>
      </div>
      <div v-else>
        <div v-if="loading" class="text-center p-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p>Đang tìm kiếm...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else-if="results.length === 0" class="text-center text-muted p-5">
          <h5>Không tìm thấy kết quả</h5>
          <p>Không có kết quả nào phù hợp với "{{ query }}". Vui lòng thử lại với từ khóa khác.</p>
        </div>
        <div v-else class="results-grid">
          <div v-for="result in results" :key="result.id" class="card result-card shadow-sm">
            <img v-if="result.imageUrl" :src="result.imageUrl" class="card-img-top result-img" :alt="result.title">
            <div class="card-body">
              <h5 class="card-title">{{ result.title }}</h5>
              <p class="card-text text-muted">{{ result.excerpt }}</p>
              <router-link :to="result.link" class="btn btn-outline-brown btn-sm">Xem thêm</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const route = useRoute()
const router = useRouter()
const query = ref(route.query.q || '')
const searchQuery = ref(route.query.q || '')
const loading = ref(false)
const error = ref(null)
const results = ref([])

const performSearch = () => {
  if (!query.value.trim()) {
    results.value = []
    return
  }

  loading.value = true
  error.value = null

  // Simulate search results using data from db.json - in a real app, this would fetch from an API
  setTimeout(() => {
    const searchTerm = query.value.toLowerCase()
    const postsData = [
      { id: '0317', title: 'Giải mã ngôn ngữ cơ thể của mèo: Hướng dẫn cho người mới bắt đầu', excerpt: 'Cái vẫy đuôi đó là dấu hiệu của sự yêu thương hay khó chịu? Chúng tôi phân tích các tín hiệu tinh tế trong giao tiếp của mèo để giúp bạn hiểu rõ hơn về người bạn lông xù của mình.', imageUrl: 'https://thumbs.dreamstime.com/b/british-shorthair-cat-unhappy-closeup-looking-directly-camera-its-ears-different-directions-british-shorthair-cat-105552563.jpg', link: '/posts/0317', category: 'Hành vi mèo' },
      { id: '8503', title: 'Hướng dẫn chải lông cho mèo lông dài', excerpt: 'Lông rối và bết có thể là cơn ác mộng. Hãy làm theo các mẹo chải lông chuyên nghiệp để giữ cho bộ lông mèo của bạn luôn khỏe mạnh, bóng mượt và không bị rối.', imageUrl: 'https://thumbs.dreamstime.com/b/close-up-image-gray-british-shorthair-cat-being-gently-brushed-s-adorable-slightly-grumpy-expression-adds-touch-humor-330312217.jpg', link: '/posts/8503', category: 'Chải lông & Chăm sóc' },
      { id: 'd311', title: 'Những nguy hiểm trong nhà đối với mèo mà bạn có thể bỏ qua', excerpt: 'Ngôi nhà của bạn nên là nơi an toàn cho mèo, nhưng có những nguy hiểm tiềm ẩn ngay trước mắt. Tìm hiểu những loại cây, thực phẩm và vật dụng cần tránh xa mèo của bạn.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNci0H5vBHBJTrOW8gLZg9mW4mVu2tv1Sfeg&s', link: '/posts/d311', category: 'Sức khỏe mèo' },
      { id: 'cca3', title: 'Chọn thức ăn tốt nhất cho mèo già', excerpt: 'Khi mèo già đi, nhu cầu dinh dưỡng của chúng thay đổi. Hãy cùng tìm hiểu loại thức ăn phù hợp và cách hỗ trợ sức khỏe cho mèo ở tuổi xế chiều.', imageUrl: 'https://media.istockphoto.com/id/1134929565/photo/hungry-cat-at-home-kitchen.jpg?s=612x612&w=0&k=20&c=Dhcn-O8metlHbHDasLeQnMGBuLgm5NIgIyjcpq05nZA=', link: '/posts/cca3', category: 'Sức khỏe mèo' },
      { id: '61ca', title: 'Giống mèo: Maine Coon hùng vĩ', excerpt: 'Được biết đến như những \'gã khổng lồ hiền lành\' của thế giới mèo, Maine Coon vừa thân thiện vừa to lớn. Khám phá lịch sử và đặc điểm của giống mèo tuyệt vời này.', imageUrl: 'https://i.ytimg.com/vi/kqiW9413jfM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB5i_lX0cDyruvTMv4f9AVPuOzhdg', link: '/posts/61ca', category: 'Giống mèo nổi bật' },
      { id: 'da71', title: 'Tại sao mèo thích hộp? Khoa học đằng sau sự ngớ ngẩn', excerpt: 'Đó là một sự thật phổ quát: nếu vừa vặn, mèo sẽ ngồi vào đó. Nhưng tại sao mèo lại cuồng nhiệt với việc chui vào hộp đến vậy? Chúng tôi khám phá những lý do an toàn, theo bản năng.', imageUrl: 'https://media.istockphoto.com/id/545462228/photo/cat-playing-peek-a-boo-in-a-box.jpg?s=612x612&w=0&k=20&c=QlBKIL5t35Fj694ihunakEMK6M9GMs5CRwHCUNPPTeA=', link: '/posts/da71', category: 'Hành vi mèo' },
      { id: '92f0', title: '5 Dấu hiệu mèo của bạn đang hạnh phúc', excerpt: 'Bạn có biết mèo thể hiện sự hạnh phúc như thế nào không? Dưới đây là 5 dấu hiệu dễ nhận biết.', imageUrl: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg', link: '/posts/92f0', category: 'Hành vi mèo' },
      { id: '8b2c', title: 'Cách tắm cho mèo mà không bị cào', excerpt: 'Tắm cho mèo là thử thách với nhiều người. Hãy thử các mẹo sau để mọi việc dễ dàng hơn.', imageUrl: 'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg', link: '/posts/8b2c', category: 'Chải lông & Chăm sóc' },
      { id: 'ed72', title: 'Những loại cây an toàn cho mèo trong nhà', excerpt: 'Không phải loại cây nào cũng an toàn cho mèo. Dưới đây là một số gợi ý bạn có thể yên tâm trồng.', imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuEFZ7nRypKnikMdQF2jLhFNPiu9gGamY8d8N_xRR7g5F9FxSq5Yhw1pUjkdyNjlUOJCzJ8mtU29YC6rZ1klNUbwOnZeGboMVYd0VxB1UkLs1JKLudCtIQ6Ve0UVSN00PyAkIfgjBwKFs/s1600/IMG_4080.jpeg', link: '/posts/ed72', category: 'Sức khỏe mèo' },
      { id: '5ceb', title: 'Tại sao mèo thích ngủ trên laptop?', excerpt: 'Laptop là nơi yêu thích của nhiều chú mèo. Lý do là gì?', imageUrl: 'https://compote.slate.com/images/8a5bf959-9321-4a83-b960-dad1120144ac.jpeg?width=1200&rect=1560x1040&offset=0x0', link: '/posts/5ceb', category: 'Hành vi mèo' },
      { id: '73a9', title: 'Mèo có thực sự nhớ tên của mình không?', excerpt: 'Nhiều nghiên cứu cho thấy mèo có thể nhận ra tên gọi của mình. Nhưng chúng có phản hồi không?', imageUrl: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg', link: '/posts/73a9', category: 'Hành vi mèo' },
      { id: '3fd6', title: 'Làm sao để mèo không cào đồ đạc trong nhà?', excerpt: 'Cào là bản năng của mèo, nhưng bạn có thể hướng dẫn chúng cào đúng chỗ.', imageUrl: 'https://cdn.pixabay.com/photo/2015/03/27/13/16/cat-694730_1280.jpg', link: '/posts/3fd6', category: 'Chải lông & Chăm sóc' },
      { id: 'a18c', title: 'Top 3 giống mèo phù hợp với người mới nuôi', excerpt: 'Bạn mới nuôi mèo? Dưới đây là 3 giống mèo dễ chăm sóc và thân thiện.', imageUrl: 'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg', link: '/posts/a18c', category: 'Giống mèo nổi bật' },
      { id: 'd9e2', title: 'Mèo có thể ăn cá sống không?', excerpt: 'Cá sống không phải là lựa chọn tốt cho mèo. Tìm hiểu lý do tại sao.', imageUrl: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg', link: '/posts/d9e2', category: 'Sức khỏe mèo' },
      { id: '719e', title: 'Cách làm đồ chơi đơn giản cho mèo từ vải vụn', excerpt: 'Bạn có thể tự làm đồ chơi cho mèo từ những mảnh vải không dùng đến.', imageUrl: 'https://meowyjanes.com/wp-content/uploads/2022/12/Meowy-Janes-Cats-Playing-Photos_4.jpg', link: '/posts/719e', category: 'Vui nhộn & Dễ thương' },
      { id: 'ebb6', title: 'Tại sao mèo thích ngồi trong hộp nhỏ?', excerpt: 'Dù hộp nhỏ đến đâu, mèo vẫn cố gắng chui vào. Đó là bản năng hay chỉ là trò vui?', imageUrl: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg', link: '/posts/ebb6', category: 'Hành vi mèo' }
    ]

    results.value = postsData.filter(item => 
      item.title.toLowerCase().includes(searchTerm) || 
      item.excerpt.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    )
    
    if (results.value.length === 0) {
      error.value = null
    }
    loading.value = false
  }, 1000)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    query.value = searchQuery.value
    performSearch()
  }
}

onMounted(() => {
  if (query.value) {
    performSearch()
  }
})

watch(() => route.query.q, (newQuery) => {
  query.value = newQuery || ''
  searchQuery.value = newQuery || ''
  performSearch()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

.search-container {
  background-color: #fff8f0;
  min-height: 100vh;
  font-family: 'Quicksand', Arial, sans-serif;
}

.text-primary {
  color: #a67c52 !important;
}

.text-muted {
  color: #8d6843 !important;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  min-width: 250px;
  font-size: 1em;
  border-radius: 6px;
  border: 1.5px solid #e0c9b3;
  background: #fff;
  color: #a67c52;
}

.search-input:focus {
  border-color: #a67c52;
  box-shadow: 0 0 0 0.1rem #ffd6c0;
  outline: none;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 6px;
  min-width: 90px;
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
  transition: background 0.2s, color 0.2s;
}

.btn-outline-brown:hover,
.btn-outline-brown:focus {
  background-color: #a67c52;
  color: #fff;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.result-card {
  border: 1px solid #ffd6c0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.result-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #a67c52;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem;
  color: #8d6843;
  margin-bottom: 1rem;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
  color: #a67c52;
}

.btn, .search-input {
  cursor: pointer;
}

.btn:hover, .search-input:hover {
  cursor: pointer;
}
</style>
