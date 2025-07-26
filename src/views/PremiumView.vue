<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 border-b border-yellow-500 bg-gray-900">
      <div class="text-2xl font-bold text-white">FantaCoach AI ⚽</div>
      <div class="space-x-4">
        <router-link to="/dashboard" class="text-white hover:text-yellow-400">Dashboard</router-link>
        <router-link to="/premium" class="text-yellow-400 font-semibold">Premium</router-link>
        <button @click="logout" class="text-red-400 hover:text-red-600">Logout</button>
      </div>
    </nav>

    <!-- Banner scorrevole -->
    <div class="overflow-hidden bg-yellow-500 text-black py-2">
      <div class="whitespace-nowrap animate-marquee text-md font-semibold">
        🎁 Solo per i primi 50 utenti: Premium in offerta a 4,99€! Affrettati! 🎁
      </div>
    </div>

    <!-- Contenuto -->
    <main class="flex-1 flex flex-col justify-center items-center px-6 py-16">
      <div class="bg-gray-900 p-10 rounded-xl shadow-lg border border-yellow-500 w-full max-w-2xl text-center">
        <h1 class="text-4xl font-bold text-yellow-400 mb-4">💎 Passa a Premium</h1>
        <p class="text-gray-300 mb-6 text-lg">Sblocca tutte le funzionalità avanzate:</p>
        <ul class="text-left text-yellow-300 space-y-2 text-md mb-6">
          <li>⚡ Formazioni AI avanzate</li>
          <li>📊 Statistiche dettagliate</li>
          <li>🧠 Consigli su misura</li>
          <li>🔓 Accesso completo senza limiti</li>
        </ul>
        <button
          @click="vaiAStripe"
          class="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          🔥 Attiva Premium a 4,99€
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center border-t border-yellow-500 text-yellow-400">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const DEV_EMAIL = 'premium@premium.com'; // 👈 CAMBIA CON LA TUA EMAIL DEV

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica JWT
    const email = payload.email;
    const premium = payload.premium;

    const isDev = email === DEV_EMAIL;

    if (premium || isDev) {
      router.push('/dashboard'); // 🔁 Vai alla dashboard se sei Premium o Dev
    }
  } catch (err) {
    console.error('Token non valido', err);
    router.push('/login');
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('premium');
  router.push('/login');
};

const vaiAStripe = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert('Errore durante il checkout');
    }
  } catch (err) {
    console.error(err);
    alert('Errore di rete');
  }
};
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.animate-marquee {
  display: inline-block;
  animation: marquee 15s linear infinite;
}
</style>
