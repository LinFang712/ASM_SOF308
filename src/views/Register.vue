<template>
  <div class="register-bg">
    <Navbar />

    <section class="container register-center-container py-5">
      <div class="register-flex-row d-flex justify-content-center align-items-center">
        <!-- Register card FIRST -->
        <div class="register-card-col">
          <div ref="formCard" class="register-card card p-4 shadow-sm border-0">
            <div class="text-center mb-4">
              <img
                src="../../public/logo.png"
                alt="Cat Icon"
                width="96"
                class="mb-2"
              />
              <h2 class="fw-bold mb-1" style="color: #a67c52">Meow! Đăng ký tài khoản</h2>
              <div class="text-muted small">
                <span style="font-size: 1.2em;">🐾</span> Tham gia cộng đồng CatBase!
              </div>
            </div>
            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" v-model="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" v-model="username" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label d-block">Gender</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="gender" value="Male" id="genderMale" />
                  <label class="form-check-label" for="genderMale">Male</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="gender" value="Female" id="genderFemale" />
                  <label class="form-check-label" for="genderFemale">Female</label>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label">Date of Birth</label>
                <input type="date" v-model="dob" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-brown w-100 fw-bold">Đăng ký</button>
            </form>
            <div class="text-center mt-3">
              <span class="text-muted small">Đã có tài khoản?</span>
              <router-link to="/login" class="ms-1 link-accent">Đăng nhập</router-link>
            </div>
          </div>
        </div>
        <!-- Cat image SECOND -->
        <div class="cat-img-col d-none d-lg-flex align-items-stretch">
          <img
            ref="catImg"
            :style="{ height: cardHeight + 'px' }"
            src="https://i.pinimg.com/736x/ec/7e/37/ec7e374590a3d76f08365956cc655f5e.jpg?auto=compress&fit=crop&w=500&q=80"
            alt="Cute Cat"
            class="side-cat-img"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'

const email = ref('')
const username = ref('')
const password = ref('')
const gender = ref('')
const dob = ref('')

const formCard = ref(null)
const catImg = ref(null)
const cardHeight = ref(0)

const setCardHeight = () => {
  nextTick(() => {
    if (formCard.value) {
      cardHeight.value = formCard.value.offsetHeight
    }
  })
}

// Update height on mount, resize, and when form data changes
onMounted(() => {
  setCardHeight()
  window.addEventListener('resize', setCardHeight)
})

// Watch for changes in form fields to update height if needed
watch([email, username, password, gender, dob], setCardHeight)

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

.register-bg {
  min-height: 100vh;
  background: 
    linear-gradient(rgba(255, 248, 240, 0.93), rgba(255, 248, 240, 0.93)),
    url('https://www.shutterstock.com/image-photo/ginger-cat-looking-camera-lounges-600nw-2532742995.jpg?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  font-family: 'Quicksand', Arial, sans-serif;
  position: relative;
}

.register-center-container {
  margin-top: 4vh;
  margin-bottom: 8vh;
}

.register-flex-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  min-height: 500px;
}

.cat-img-col,
.register-card-col {
  padding: 0;
  display: flex;
  align-items: stretch;
}

.side-cat-img {
  width: 340px;
  min-width: 240px;
  object-fit: cover;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0 8px 32px 0 rgba(166, 124, 82, 0.10);
  background: #fff8f0;
  display: block;
  /* height is set dynamically */
}

.register-card {
  background: #fdf6f0cc;
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
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

@media (max-width: 991.98px) {
  .register-flex-row {
    flex-direction: column;
    align-items: center;
    min-height: unset;
  }
  .cat-img-col {
    display: none !important;
  }
  .register-card {
    border-radius: 2rem !important;
    border-top-left-radius: 2rem !important;
    border-bottom-left-radius: 2rem !important;
    border-top-right-radius: 2rem !important;
    border-bottom-right-radius: 2rem !important;
  }
}
</style>
