<template>
  <div class="min-h-screen flex flex-col items-center justify-between bg-gray-900 text-white p-6">

    <!-- Barra promo fissa -->
    <div class="w-full bg-yellow-500 text-black font-bold py-2 text-center mb-6 rounded-lg shadow-md">
      🎉 Solo per i primi 50 utenti: Premium a Vita a 4,99€ per sempre! 🎉
    </div>

    <!-- Pulsanti navigazione -->
    <div class="flex space-x-4 mb-6">
      <button 
        @click="goHome"
        class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl transition">
        🏠 Home
      </button>
      <button 
        @click="goDashboard"
        class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl transition">
        📊 Dashboard
      </button>
    </div>

    <h1 class="text-3xl font-bold mb-8 text-center">Passa a Premium</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      <!-- Card Premium Lifetime -->
      <div class="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between">
        <h2 class="text-2xl font-bold mb-4">Premium a Vita</h2>
        <p class="text-4xl font-extrabold mb-4">€4,99</p>
        <p class="text-gray-300 mb-6">Un unico pagamento per sempre.</p>
        <button 
          @click="checkoutLifetime"
          class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition">
          Attiva Premium a Vita
        </button>
      </div>

      <!-- Card Premium Mensile -->
      <div class="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between">
        <h2 class="text-2xl font-bold mb-4">Premium Mensile</h2>
        <p class="text-4xl font-extrabold mb-4">€1,99 <span class="text-lg">/mese</span></p>
        <p class="text-gray-300 mb-6">Paghi solo quando ti serve.</p>
        <button 
          @click="checkoutMonthly"
          class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition">
          Attiva Premium Mensile
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-gray-400 text-sm text-center">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = "http://localhost:3000"  // 👉 cambia con dominio backend in produzione

// Navigazione
const goHome = () => {
  router.push("/")       // route Home
}
const goDashboard = () => {
  router.push("/dashboard")  // route Dashboard
}

// Checkout Lifetime
const checkoutLifetime = async () => {
  try {
    const res = await fetch(`${API_URL}/api/checkout/lifetime`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      console.error("❌ Errore checkout Lifetime:", data)
      alert("Errore nel checkout Premium a Vita")
    }
  } catch (err) {
    console.error("❌ Errore rete Lifetime:", err)
    alert("Errore di connessione al server")
  }
}

// Checkout Mensile
const checkoutMonthly = async () => {
  try {
    const res = await fetch(`${API_URL}/api/checkout/monthly`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      console.error("❌ Errore checkout Mensile:", data)
      alert("Errore nel checkout Premium Mensile")
    }
  } catch (err) {
    console.error("❌ Errore rete Mensile:", err)
    alert("Errore di connessione al server")
  }
}
</script>
