<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to TimeKeeper Auctions</h1>
        <p class="hero-description">
          Discover rare and luxury watches from collectors across Britain.
          Buy, sell, and trade timepieces with fellow enthusiasts.
        </p>
        <div class="hero-actions">
          <router-link to="/search" class="btn btn-primary btn-large">
            Browse Collection
          </router-link>
          <router-link 
            v-if="isLoggedIn" 
            to="/item" 
            class="btn btn-secondary btn-large"
          >
            List Your Watch
          </router-link>
          <router-link 
            v-else 
            to="/login" 
            class="btn btn-secondary btn-large"
          >
            Join Today
          </router-link>
        </div>
      </div>
      <!-- <div class="hero-image">
        <img src="/hero-watch.jpg" alt="Luxury Watch Collection" />
      </div> -->
    </div>

    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose TimeKeeper?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">✅</div>
            <h3>Verified Authenticity</h3>
            <p>Every watch is carefully vetted by our team of experts to ensure authenticity and quality.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Secure Transactions</h3>
            <p>Safe and secure payment processing with buyer protection and escrow services.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🇬🇧</div>
            <h3>UK Community</h3>
            <p>Connect with watch collectors and enthusiasts from across the United Kingdom.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Market Insights</h3>
            <p>Access real-time market data and trends to make informed buying decisions.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="brands-section">
      <div class="container">
        <h2 class="section-title">Featured Brands</h2>
        <div class="brand-logos">
          <div class="brand">Rolex</div>
          <div class="brand">Omega</div>
          <div class="brand">Patek Philippe</div>
          <div class="brand">Cartier</div>
          <div class="brand">TAG Heuer</div>
          <div class="brand">Breitling</div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="container">
        <h2>Ready to Start Your Collection?</h2>
        <p>Join thousands of collectors in the TimeKeeper community</p>
        <router-link 
          v-if="!isLoggedIn" 
          to="/login" 
          class="btn btn-primary btn-large"
        >
          Get Started Today
        </router-link>
        <router-link 
          v-else 
          to="/item" 
          class="btn btn-primary btn-large"
        >
          List Your First Watch
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('session_token')
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  colour: white;
  padding: 5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: centre;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-section, .brands-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: centre;
  font-size: 2.5rem;
  colour: #2c3e50;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: centre;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  colour: #2c3e50;
  margin-bottom: 1rem;
}

.brand-logos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.brand {
  background: white;
  padding: 2rem 1rem;
  border-radius: 12px;
  text-align: centre;
  font-weight: 600;
  colour: #2c3e50;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.brand:hover {
  transform: translateY(-2px);
}

.cta-section {
  background: linear-gradient(45deg, #f4d03f, #f7dc6f);
  padding: 5rem 0;
  text-align: centre;
  colour: #1a1a2e;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
}

.btn-primary {
  background: linear-gradient(45deg, #f4d03f, #f7dc6f);
  colour: #1a1a2e;
}

.btn-secondary {
  background: transparent;
  colour: white;
  border: 2px solid white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>