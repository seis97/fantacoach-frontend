<template>
  <div class="min-h-screen flex items-center justify-center bg-black text-white">
    <div class="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input v-model="email" type="email" id="email" required
                 class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium mb-1">Password</label>
          <input v-model="password" type="password" id="password" required
                 class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        </div>
        <button type="submit"
                class="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition">
          Accedi
        </button>
      </form>
      <p class="mt-4 text-sm text-center">
        Non hai un account?
        <router-link to="/register" class="text-yellow-400 hover:underline">Registrati</router-link>
      </p>
      <p v-if="errore" class="mt-4 text-red-500 text-center">{{ errore }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errore = ref('');
const router = useRouter();

const API = import.meta.env.VITE_API_URL;

const login = async () => {
  errore.value = '';

  try {
    const response = await fetch(`${API}/users/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: email.value,
    password: password.value
  })
});


    const data = await response.json();

    if (!response.ok) {
      errore.value = data.errore || 'Errore durante il login.';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('premium', data.premium);

    router.push('/dashboard');
  } catch (err) {
    errore.value = 'Errore di rete. Controlla la connessione.';
  }
};
</script>
