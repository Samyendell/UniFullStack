<template>
    <div class="watch-home">
        <!-- Header -->
        <header class="hero-section">
            <div class="container">
                <nav class="navbar">
                    <div class="logo">
                        <h1>⌚ TimeKeeper Auctions</h1>
                    </div>
                    <div class="nav-links">
                        <router-link v-if="!isLoggedIn" to="/login" class="btn btn-outline">Login</router-link>
                        <button v-else @click="logout" class="btn btn-outline">Logout</button>
                    </div>
                </nav>
                
                <div class="hero-content">
                    <h2 class="hero-title">Discover Exceptional Timepieces</h2>
                    <p class="hero-subtitle">
                        Bid on luxury watches from renowned Swiss manufacturers, vintage collectibles, and modern masterpieces
                    </p>
                    
                    <div v-if="isLoggedIn" class="hero-actions logged-in">
                        <p class="welcome-message">Welcome back, collector!</p>
                        <div class="action-buttons">
                            <button class="btn btn-primary">Browse Auctions</button>
                            <button class="btn btn-secondary">My Dashboard</button>
                        </div>
                    </div>
                    
                    <div v-else class="hero-actions">
                        <router-link to="/login" class="btn btn-primary">Start Bidding</router-link>
                        <button class="btn btn-secondary">View Collection</button>
                    </div>
                </div>
            </div>
        </header>
        
        <!-- Features Section -->
        <section class="features">
            <div class="container">
                <h3>Why Choose TimeKeeper Auctions?</h3>
                <div class="features-grid">
                    <div class="feature">
                        <div class="feature-icon">🏆</div>
                        <h4>Authentic Timepieces</h4>
                        <p>Every watch is authenticated by our expert horologists</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔍</div>
                        <h4>Detailed Provenance</h4>
                        <p>Complete history and documentation for each piece</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🚚</div>
                        <h4>Secure Shipping</h4>
                        <p>Insured worldwide delivery with premium packaging</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Brands Section -->
        <section class="brands">
            <div class="container">
                <h3>Featured Brands</h3>
                <div class="brand-logos">
                    <div class="brand">Rolex</div>
                    <div class="brand">Omega</div>
                    <div class="brand">Patek Philippe</div>
                    <div class="brand">Cartier</div>
                    <div class="brand">TAG Heuer</div>
                    <div class="brand">Breitling</div>
                </div>
            </div>
        </section>
        
        <!-- CTA Section -->
        <section class="cta-section" v-if="!isLoggedIn">
            <div class="container">
                <h3>Ready to Start Your Collection?</h3>
                <p>Join millions of watch buyers in our auctions</p>
                <router-link to="/login" class="btn btn-primary btn-large">Join TimeKeeper Today</router-link>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'Home',
    computed: {
        isLoggedIn() {
            return localStorage.getItem('session_token') !== null;
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('session_token');
            this.$forceUpdate();
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.watch-home {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #2c3e50;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header & Hero */
.hero-section {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: white;
    min-height: 100vh;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
}

.logo h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #f4d03f;
}

.hero-content {
    text-align: center;
    padding: 4rem 0;
    margin-top: 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 3rem;
    color: #bdc3c7;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-actions {
    margin-top: 2rem;
}

.hero-actions.logged-in {
    text-align: center;
}

.welcome-message {
    font-size: 1.2rem;
    color: #f4d03f;
    margin-bottom: 1.5rem;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.8rem 2rem;
    margin: 0.5rem;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-primary {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    color: #1a1a2e;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(244, 208, 63, 0.3);
}

.btn-secondary {
    background: transparent;
    color: #f4d03f;
    border: 2px solid #f4d03f;
}

.btn-secondary:hover {
    background: #f4d03f;
    color: #1a1a2e;
}

.btn-outline {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.6rem 1.5rem;
}

.btn-outline:hover {
    background: white;
    color: #1a1a2e;
}

.btn-large {
    padding: 1.2rem 3rem;
    font-size: 1.1rem;
}

/* Features Section */
.features {
    padding: 5rem 0;
    background: #f8f9fa;
}

.features h3 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #2c3e50;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.feature:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature h4 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.feature p {
    color: #7f8c8d;
    line-height: 1.6;
}

/* Brands Section */
.brands {
    padding: 4rem 0;
    background: #2c3e50;
    color: white;
}

.brands h3 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #f4d03f;
}

.brand-logos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2rem;
    text-align: center;
}

.brand {
    font-size: 1.3rem;
    font-weight: 600;
    padding: 1.5rem;
    background: rgba(244, 208, 63, 0.1);
    border: 2px solid #f4d03f;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.brand:hover {
    background: #f4d03f;
    color: #2c3e50;
}

/* CTA Section */
.cta-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: white;
    text-align: center;
}

.cta-section h3 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #f4d03f;
}

.cta-section p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #bdc3c7;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .brand-logos {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>