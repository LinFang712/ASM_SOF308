<template>
  <div class="login-bg">
    <Navbar />

    <section class="container login-center-container py-5">
      <div class="login-flex-row d-flex justify-content-center align-items-center">
        <!-- Cat image (hidden on small screens) -->
        <div class="cat-img-col d-none d-lg-block">
          <img
            :style="{ height: cardHeight + 'px' }"
            src="https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="Cute Cat"
            class="side-cat-img"
          />
        </div>
        <!-- Login card -->
        <div class="login-card-col">
          <div ref="loginCard" class="login-card card p-4 shadow-sm border-0">
            <div class="text-center mb-4">
              <img
                src="../../public/logo.png"
                alt="Cat Icon"
                width="96"
                class="mb-2"
              />
              <h2 class="fw-bold mb-1" style="color: #a67c52">Meowww! Chào mừng trở lại!</h2>
              <div class="text-muted small">
                <span style="font-size: 1.2em;">🐾</span> Đăng nhập để khám phá CatBase
              </div>
            </div>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  class="form-control"
                  required
                  autocomplete="email"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  class="form-control"
                  required
                  autocomplete="current-password"
                />
              </div>
              <button
                type="submit"
                class="btn btn-brown w-100 fw-bold"
                :disabled="isLoggingIn"
              >
                <span
                  v-if="isLoggingIn"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ isLoggingIn ? ' Đang xử lý...' : 'Đăng nhập' }}
              </button>
            </form>
            <div
              v-if="errorMessage"
              class="mt-3 alert alert-danger p-2 text-center"
            >
              {{ errorMessage }}
            </div>
            <div class="text-center mt-3">
              <span class="text-muted small">Chưa có tài khoản?</span>
              <router-link
                to="/register"
                class="ms-1 link-accent"
                >Đăng ký ngay</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const email = ref('admin@purrfectposts.com');
const password = ref('123123123');
const errorMessage = ref('');
const isLoggingIn = ref(false);
const router = useRouter();

const loginCard = ref(null);
const cardHeight = ref(0);

const setCardHeight = () => {
  nextTick(() => {
    if (loginCard.value) {
      cardHeight.value = loginCard.value.offsetHeight;
    }
  });
};

onMounted(() => {
  setCardHeight();
  window.addEventListener('resize', setCardHeight);
});

// Watch for changes in form fields to update height if needed
watch([email, password, errorMessage, isLoggingIn], setCardHeight);

const login = async () => {
  if (isLoggingIn.value) return;
  isLoggingIn.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get('http://localhost:3001/users', {
      params: { email: email.value }
    });

    if (response.data.length > 0) {
      const user = response.data[0];
      if (user.passwordHash === password.value) {
        const loggedInUser = {
          _id: user._id,
          displayName: user.profile?.displayName || user.email.split('@')[0],
          email: user.email,
          role: user.role,
          profile: user.profile
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        window.dispatchEvent(new Event('user-logged-in'));
        await router.push('/');
      } else {
        errorMessage.value = 'Email hoặc mật khẩu không đúng.';
      }
    } else {
      errorMessage.value = 'Email hoặc mật khẩu không đúng.';
    }
  } catch (error) {
    errorMessage.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    console.error('Login Error:', error);
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

.login-bg {
  min-height: 100vh;
  background: 
    linear-gradient(rgba(255, 248, 240, 0.93), rgba(255, 248, 240, 0.93)),
    url('https://www.shutterstock.com/image-photo/ginger-cat-looking-camera-lounges-600nw-2532742995.jpg?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  font-family: 'Quicksand', Arial, sans-serif;
  position: relative;
}

.login-center-container {
  margin-top: 8vh;
  margin-bottom: 4vh;
}

.login-flex-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  min-height: 500px;
}

.cat-img-col,
.login-card-col {
  padding: 0;
  display: flex;
  align-items: stretch;
}

.side-cat-img {
  width: 340px;
  min-width: 240px;
  object-fit: cover;
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 8px 32px 0 rgba(166, 124, 82, 0.10);
  background: #fff8f0;
  display: block;
  /* height is set dynamically */
}

.login-card {
  background: #fdf6f0cc;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px 0 rgba(166, 124, 82, 0.12);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  transition: background 0.2s;
}
.btn-brown:hover,
.btn-brown:focus {
  background-color: #8d6843;
  color: #fff;
}

.link-accent {
  color: #6ec1e4;
  text-decoration: underline;
}
.link-accent:hover {
  color: #a67c52;
  text-decoration: underline;
}

.form-label {
  color: #a67c52;
  font-weight: 600;
}

footer.container {
  margin-top: 2rem !important;
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

@media (max-width: 991.98px) {
  .login-flex-row {
    flex-direction: column;
    align-items: center;
    min-height: unset;
  }
  .cat-img-col {
    display: none !important;
  }
  .login-card {
    border-radius: 2rem !important;
    border-top-left-radius: 2rem !important;
    border-bottom-left-radius: 2rem !important;
    border-top-right-radius: 2rem !important;
    border-bottom-right-radius: 2rem !important;
  }
}
</style>
