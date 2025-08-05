

<template>
  <section class="bg-gray-950 text-white min-h-screen">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 border-b border-gray-800">
      <div class="text-2xl font-bold text-white-400">FantaCoach AI ⚽</div>
      <div class="space-x-4">
        <router-link to="/register" class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold">Registrati</router-link>
        <router-link to="/dashboard" class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold">Entra ora</router-link>
      </div>
    </nav>

    <!-- Hero + Form -->
    <div class="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center">
      <!-- Testo a sinistra -->
      <div class="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Unisciti a <span class="text-yellow-400">FantaCoach AI</span> e domina il Fantacalcio
        </h1>
        <p class="text-gray-400 text-lg">
          🔥Registrati gratuitamente e sfrutta la potenza dell'intelligenza artificiale per creare la formazione perfetta ogni giornata!🔥
        </p>
      </div>

      <!-- Form a destra -->
      <div class="md:w-1/2 bg-gray-900 text-black p-8 rounded-lg shadow-xl border-2 border-yellow-500 w-full max-w-md md:ml-10">
        <h2 class="text-3xl font-bold text-yellow-600 mb-4 text-center"> Registrati a FantaCoach </h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="email" class="block text-gray-700 font-semibold">Email</label>
            <input v-model="email" id="email" type="email" required
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
          </div>

          <div>
            <label for="password" class="block text-gray-700 font-semibold">Password</label>
            <input v-model="password" id="password" type="password" required
              class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
          </div>

          <button type="submit"
            class="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
            Registrati
          </button>
        </form>

        <p v-if="successo" class="mt-4 text-green-600 text-center">✅ Registrazione completata! Ora puoi accedere.</p>
        <p v-if="errore" class="mt-4 text-red-600 text-center">❌ {{ errore }}</p>

        <p class="mt-6 text-yellow-400 text-center text-xl animate-pulse">✨ Entra nel futuro del Fantacalcio ✨</p>
      </div>
    </div>

    <!-- Banner -->
    <div class="bg-gray-900 py-6">
      <div class="overflow-hidden bg-yellow-500 text-black py-3 border-t-2 border-yellow-400 rounded-md mx-6">
        <div class="whitespace-nowrap animate-marquee text-center font-semibold text-lg">
          ⚽ Entra anche tu a far parte della novità del fantacalcio, sfrutta l'intelligenza artificiale per vincere le prossime partite! ⚽
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errore = ref('');
const successo = ref(false);
const router = useRouter();

const handleRegister = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const data = await res.json();

    if (res.ok) {
      successo.value = true;
      errore.value = '';

      // ✅ LOGIN automatico dopo registrazione
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('premium', loginData.premium);
        router.push('/dashboard');
      } else {
        errore.value = 'Registrazione completata ma login fallito.';
      }

    } else {
      errore.value = data.errore;
    }

  } catch (err) {
    errore.value = 'Errore di rete. Riprova.';
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
