<template>
    <div class="single-item">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading item details...</p>
      </div>
  
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="loadItem" class="btn btn-retry">Try Again</button>
      </div>
  
      <div v-else-if="item" class="item-container">
        <!-- Item Header -->
        <div class="item-header">
          <h1>{{ item.title }}</h1>
          <div class="item-meta">
            <span class="category">{{ item.category }}</span>
            <span class="seller">Sold by: {{ item.seller_name || 'Anonymous' }}</span>
          </div>
        </div>
  
        <!-- Main Content Grid -->
        <div class="item-content">
          <!-- Image Section -->
          <div class="item-image">
            <img :src="getImageUrl(item.image)" :alt="item.title" />
          </div>
  
          <!-- Item Details -->
          <div class="item-details">
            <div class="price-section">
              <div class="current-bid">
                <span class="label">Current Bid:</span>
                <span class="amount">{{ formatPrice(item.highest_bid || item.reserve) }}</span>
              </div>
              <div class="reserve-price" v-if="item.reserve">
                <span class="label">Reserve Price:</span>
                <span class="amount">{{ formatPrice(item.reserve) }}</span>
              </div>
            </div>
  
            <!-- Auction Status -->
            <div class="auction-status">
              <div class="time-remaining">
                <span class="label">Time Remaining:</span>
                <span class="time">{{ getTimeRemaining(item.bidding_close) }}</span>
              </div>
              <div class="total-bids">
                <span class="label">Total Bids:</span>
                <span class="count">{{ bidHistory.length }}</span>
              </div>
            </div>
  
            <!-- Bidding Section -->
            <div class="bidding-section" v-if="isAuctionActive && isLoggedIn && !isOwnItem">
              <h3>Place Your Bid</h3>
              <div class="bid-form">
                <input 
                  type="number" 
                  v-model="newBid" 
                  :min="minimumBid"
                  :step="0.01"
                  placeholder="Enter your bid amount"
                  class="bid-input"
                />
                <button @click="placeBid" :disabled="bidLoading" class="btn btn-primary">
                  {{ bidLoading ? 'Placing Bid...' : 'Place Bid' }}
                </button>
              </div>
              <p class="min-bid-note">Minimum bid: {{ formatPrice(minimumBid) }}</p>
            </div>
  
            <!-- Not Logged In Message -->
            <div v-else-if="isAuctionActive && !isLoggedIn" class="login-prompt">
              <p>Please <router-link to="/login">log in</router-link> to place a bid</p>
            </div>
  
            <!-- Own Item Message -->
            <div v-else-if="isOwnItem" class="own-item">
              <p>This is your item - you cannot bid on it</p>
            </div>
  
            <!-- Auction Closed -->
            <div v-else class="auction-closed">
              <p>This auction has ended</p>
            </div>
          </div>
        </div>
  
        <!-- Description -->
        <div class="item-description">
          <h3>Description</h3>
          <p>{{ item.description || 'No description provided' }}</p>
        </div>
  
        <!-- Bid History -->
        <div class="bid-history">
          <h3>Bid History</h3>
          <div v-if="bidHistory.length === 0" class="no-bids">
            <p>No bids yet. Be the first!</p>
          </div>
          <div v-else class="bid-list">
            <div 
              v-for="bid in bidHistory" 
              :key="bid.id"
              class="bid-item"
            >
              <span class="bid-amount">{{ formatPrice(bid.amount) }}</span>
              <span class="bid-time">{{ formatDateTime(bid.timestamp) }}</span>
              <span class="bidder">{{ bid.bidder_name || 'Anonymous' }}</span>
            </div>
          </div>
        </div>
  
        <!-- Questions Section -->
        <div class="questions-section">
          <h3>Questions & Answers</h3>
          
          <!-- Ask Question Form -->
          <div class="ask-question" v-if="isLoggedIn && !isOwnItem">
            <h4>Ask a Question</h4>
            <div class="question-form">
              <textarea 
                v-model="newQuestion" 
                placeholder="Type your question here..."
                rows="3"
                class="question-input"
              ></textarea>
              <button @click="askQuestion" :disabled="questionLoading" class="btn btn-primary">
                {{ questionLoading ? 'Submitting...' : 'Ask Question' }}
              </button>
            </div>
          </div>
  
          <!-- Questions List -->
          <div class="questions-list">
            <div v-if="questions.length === 0" class="no-questions">
              <p>No questions yet</p>
            </div>
            <div v-else>
              <div 
                v-for="question in questions" 
                :key="question.id"
                class="question-item"
              >
                <div class="question">
                  <p><strong>Q:</strong> {{ question.question }}</p>
                  <small>Asked {{ formatDateTime(question.timestamp) }}</small>
                </div>
                
                <!-- Answer -->
                <div v-if="question.answer" class="answer">
                  <p><strong>A:</strong> {{ question.answer }}</p>
                </div>
  
                <!-- Answer Form (for seller) -->
                <div v-else-if="isOwnItem" class="answer-form">
                  <textarea 
                    v-model="answerText[question.id]" 
                    placeholder="Type your answer..."
                    rows="2"
                    class="answer-input"
                  ></textarea>
                  <button @click="answerQuestion(question.id)" class="btn btn-small">
                    Answer
                  </button>
                </div>
  
                <div v-else class="no-answer">
                  <em>No answer yet</em>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
  
      <div v-else class="not-found">
        <h1>Item Not Found</h1>
        <p>The item you're looking for doesn't exist or has been removed.</p>
        <router-link to="/search" class="btn btn-primary">Browse Items</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { coreService } from '../../services/coreService'
  import { questionService } from '../../services/questionService'
  import { formatPrice, formatDateTime, getTimeRemaining } from '../../utils/utils'
  
  export default {
    name: 'SingleItem',
    data() {
      return {
        item: null,
        bidHistory: [],
        questions: [],
        loading: true,
        error: null,
        newBid: '',
        newQuestion: '',
        answerText: {},
        bidLoading: false,
        questionLoading: false
      }
    },
    computed: {
      itemId() {
        return this.$route.params.id
      },
      isLoggedIn() {
        return !!localStorage.getItem('session_token')
      },
      currentUserId() {
        return localStorage.getItem('user_id')
      },
      isOwnItem() {
        return this.item && this.currentUserId && this.item.seller_id === parseInt(this.currentUserId)
      },
      isAuctionActive() {
        return this.item && new Date(this.item.bidding_close) > new Date()
      },
      minimumBid() {
        if (!this.item) return 0
        const currentHighest = this.item.highest_bid || this.item.reserve || 0
        return currentHighest + 1 // Minimum increment of £1
      }
    },
    async created() {
      await this.loadItem()
      await this.loadBidHistory()
      await this.loadQuestions()
    },
    methods: {
      async loadItem() {
        this.loading = true
        this.error = null
  
        try {
          this.item = await coreService.getSingleItem(this.itemId)
        } catch (error) {
          this.error = error || 'Failed to load item'
        } finally {
          this.loading = false
        }
      },
  
      async loadBidHistory() {
        try {
          this.bidHistory = await coreService.getBidHistory(this.itemId)
        } catch (error) {
          console.error('Failed to load bid history:', error)
          this.bidHistory = []
        }
      },
  
      async loadQuestions() {
        try {
          this.questions = await questionService.getQuestions(this.itemId)
        } catch (error) {
          console.error('Failed to load questions:', error)
          this.questions = []
        }
      },
  
      async placeBid() {
        if (!this.newBid || this.newBid < this.minimumBid) {
          alert(`Minimum bid is ${this.formatPrice(this.minimumBid)}`)
          return
        }
  
        this.bidLoading = true
  
        try {
          await coreService.placeBid(this.itemId, { amount: parseFloat(this.newBid) })
          
          // Reload data
          await this.loadItem()
          await this.loadBidHistory()
          
          this.newBid = ''
          alert('Bid placed successfully!')
        } catch (error) {
          alert(error || 'Failed to place bid')
        } finally {
          this.bidLoading = false
        }
      },
  
      async askQuestion() {
        if (!this.newQuestion.trim()) {
          alert('Please enter a question')
          return
        }
  
        this.questionLoading = true
  
        try {
          await questionService.askQuestion(this.itemId, { question: this.newQuestion })
          
          await this.loadQuestions()
          this.newQuestion = ''
          alert('Question submitted successfully!')
        } catch (error) {
          alert(error || 'Failed to submit question')
        } finally {
          this.questionLoading = false
        }
      },
  
      async answerQuestion(questionId) {
        const answer = this.answerText[questionId]
        if (!answer?.trim()) {
          alert('Please enter an answer')
          return
        }
  
        try {
          await questionService.answerQuestion(questionId, { answer })
          
          await this.loadQuestions()
          this.$delete(this.answerText, questionId)
          alert('Answer submitted successfully!')
        } catch (error) {
          alert(error || 'Failed to submit answer')
        }
      },
  
      formatPrice,
      formatDateTime,
      getTimeRemaining,
  
      getImageUrl(imagePath) {
        if (!imagePath) return '/placeholder-watch.jpg'
        if (imagePath.startsWith('http')) return imagePath
        return `${process.env.VUE_APP_BASE_URL || ''}${imagePath}`
      }
    }
  }
  </script>
  
  <style scoped>
  .single-item {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .loading {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #f4d03f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    text-align: center;
    padding: 2rem;
    colour: #d63384;
  }
  
  .item-header {
    margin-bottom: 2rem;
  }
  
  .item-header h1 {
    font-size: 2.5rem;
    colour: #2c3e50;
    margin-bottom: 1rem;
  }
  
  .item-meta {
    display: flex;
    gap: 2rem;
    colour: #6c757d;
  }
  
  .category {
    background: #f8f9fa;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
  }
  
  .item-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .item-image img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  
  .item-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .price-section {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    padding: 2rem;
    border-radius: 12px;
    colour: #1a1a2e;
  }
  
  .current-bid, .reserve-price {
    display: flex;
    justify-content: space-between;
    align-items: centre;
  }
  
  .current-bid {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  .auction-status {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  .time-remaining, .total-bids {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .bidding-section {
    background: white;
    border: 2px solid #f4d03f;
    padding: 2rem;
    border-radius: 12px;
  }
  
  .bid-form {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .bid-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .min-bid-note {
    font-size: 0.875rem;
    colour: #6c757d;
    margin: 0;
  }
  
  .login-prompt, .own-item, .auction-closed {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: centre;
    colour: #6c757d;
  }
  
  .item-description, .bid-history, .questions-section {
    margin-bottom: 3rem;
  }
  
  .item-description h3, .bid-history h3, .questions-section h3 {
    colour: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .no-bids, .no-questions {
    text-align: centre;
    padding: 2rem;
    colour: #6c757d;
  }
  
  .bid-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bid-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .bid-amount {
    font-weight: 700;
    colour: #28a745;
  }
  
  .questions-list {
    margin-top: 2rem;
  }
  
  .question-item {
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    background: white;
  }
  
  .question {
    margin-bottom: 1rem;
  }
  
  .answer {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #f4d03f;
  }
  
  .question-form, .answer-form {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .question-input, .answer-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-family: inherit;
    resize: vertical;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  
  .btn-primary {
    background: linear-gradient(45deg, #f4d03f, #f7dc6f);
    colour: #1a1a2e;
  }
  
  .btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .not-found {
    text-align: centre;
    padding: 4rem 2rem;
  }
  
  @media (max-width: 768px) {
    .single-item {
      padding: 1rem;
    }
    
    .item-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .item-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .bid-form, .question-form, .answer-form {
      flex-direction: column;
    }
    
    .bid-item {
      grid-template-columns: 1fr;
      text-align: centre;
    }
  }
  </style>