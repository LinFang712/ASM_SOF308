<template>
  <div class="about-page-bg">
    <Navbar />

    <!-- Header Section -->
    <header class="container text-center py-5">
      <h1 class="display-4 fw-bold">Welcome to CatBase Stories</h1>
      <p class="lead text-muted col-lg-8 mx-auto">
        A cozy corner of the internet for cat lovers, storytellers, and anyone who believes in the power of sharing authentic moments.
      </p>
      <div class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <a href="/register" class="btn btn-brown btn-lg">Start Writing Today</a>
        <a href="/blog" class="btn btn-outline-brown btn-lg">Explore Stories</a>
        <a href="/about" class="btn btn-brown-light btn-lg">Learn More</a>
      </div>
    </header>

    <!-- Introduction Section -->
    <div class="container my-5">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <h2 class="fw-bold mb-3">What is CatBase?</h2>
          <p>
            CatBase is more than just a blog; it's a community built on the foundation of shared experiences. We believe everyone has a story worth telling—whether it's a grand adventure, a quiet reflection, or a funny anecdote about your feline friend.
          </p>
          <p class="mb-4">
            Our platform provides a beautiful, simple, and inspiring space for you to write, share, and connect with others who appreciate the art of storytelling and the joy cats bring into our lives.
          </p>
        </div>
        <div class="col-lg-6">
          <img src="https://whatyourcatwants.com/wp-content/uploads/2020/09/Big_Fat_Red_Cat-Wikimedia-Commons-1500x800.jpg" alt="Happy Cat" class="img-fluid rounded-4 shadow-lg" />
        </div>
      </div>
    </div>

    <!-- Our Values Section -->
    <section class="container my-5 py-5 bg-white rounded-4 shadow-sm">
        <div class="text-center mb-5">
            <h2 class="fw-bold">Our Core Values</h2>
            <p class="lead text-muted">The principles that guide our community.</p>
        </div>
        <div class="row text-center g-4">
            <div class="col-md-4">
                <div class="p-3">
                    <i class="bi bi-heart-fill fs-1 text-danger mb-3"></i>
                    <h4 class="fw-semibold">Empathy</h4>
                    <p class="text-muted">We listen and connect with kindness, creating a supportive space for all voices.</p>
                </div>
            </div>
            <div class="col-md-4">
                 <div class="p-3">
                    <i class="bi bi-shield-check fs-1 text-success mb-3"></i>
                    <h4 class="fw-semibold">Authenticity</h4>
                    <p class="text-muted">Share your true self. We celebrate genuine stories and honest reflections.</p>
                </div>
            </div>
            <div class="col-md-4">
                 <div class="p-3">
                    <i class="bi bi-lightbulb-fill fs-1 text-warning mb-3"></i>
                    <h4 class="fw-semibold">Creativity</h4>
                    <p class="text-muted">We inspire creativity and provide the tools for beautiful storytelling.</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Meet the Team Section -->
    <div class="container my-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold">Meet Our Team</h2>
            <p class="lead text-muted">The people behind CatBase, dedicated to our community.</p>
        </div>
        <div class="row g-4 justify-content-center">
            <!-- Team Member Card 1 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_101" alt="The Catmin" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">The Catmin</h5>
                        <p class="text-primary fw-semibold mb-2">Founder & Admin</p>
                        <p class="card-text text-muted small">The visionary who started it all, ensuring the platform runs smoothly for everyone.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 2 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_201" alt="Anya Volkov" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Anya Volkov</h5>
                        <p class="text-primary fw-semibold mb-2">Lead Author & Vet Tech</p>
                        <p class="card-text text-muted small">Our expert on feline health, providing trusted advice and heartwarming stories.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 3 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_202" alt="Liam Gallagher" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Liam Gallagher</h5>
                        <p class="text-primary fw-semibold mb-2">Community & Grooming Expert</p>
                        <p class="card-text text-muted small">The friendly face of our community and our go-to for all things grooming.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 4 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_203" alt="Mia Chen" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Mia Chen</h5>
                        <p class="text-primary fw-semibold mb-2">Content Curator</p>
                        <p class="card-text text-muted small">Brings the best cat stories to the spotlight and keeps our content fresh and inspiring.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 5 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_204" alt="Oscar Nguyen" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Oscar Nguyen</h5>
                        <p class="text-primary fw-semibold mb-2">Tech Lead</p>
                        <p class="card-text text-muted small">Ensures CatBase runs smoothly and securely for all users, every day.</p>
                    </div>
                </div>
            </div>
            <!-- Team Member Card 6 -->
            <div class="col-lg-4 col-md-6">
                <div class="card border-0 text-center h-100 shadow-sm hover-lift">
                    <div class="card-body p-4">
                        <img src="https://i.pravatar.cc/150?u=user_205" alt="Sophie Tran" class="rounded-circle mb-3" width="100" height="100" />
                        <h5 class="card-title fw-bold mb-1">Sophie Tran</h5>
                        <p class="text-primary fw-semibold mb-2">Community Manager</p>
                        <p class="card-text text-muted small">Connects members, organizes events, and fosters a welcoming environment for all.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Final CTA -->
    <section class="container my-5">
      <div class="text-center bg-white p-5 rounded-4 shadow-sm">
        <h2 class="fw-bold">Ready to Share Your Story?</h2>
        <p class="lead text-muted col-lg-8 mx-auto">
          Join a growing community of passionate writers and cat enthusiasts. Your next chapter starts here.
        </p>
        <a href="/register" class="btn btn-brown btn-lg mt-3 me-2">
            <i class="bi bi-pencil-square me-2"></i>Create Your First Post
        </a>
        <a href="/blog" class="btn btn-outline-brown btn-lg mt-3 me-2">
            <i class="bi bi-book me-2"></i>Read Stories
        </a>
        <a href="/about" class="btn btn-brown-light btn-lg mt-3">
            <i class="bi bi-info-circle me-2"></i>About Us
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
