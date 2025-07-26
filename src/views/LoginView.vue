<template>
  <DefaultLayout>
    <div class="max-w-md mx-auto bg-white text-black p-8 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-yellow-600 mb-4 text-center">Accedi a FantaCoach</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-gray-700 font-semibold">Email</label>
          <input v-model="email" id="email" type="email" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-semibold">Password</label>
          <input v-model="password" id="password" type="password" required class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
        </div>

        <button type="submit" class="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">Accedi</button>
      </form>

      <p v-if="errore" class="mt-4 text-red-600 text-center">❌ {{ errore }}</p>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';

const email = ref('');
const password = ref('');
const errore = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/login', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('premium', data.premium);
      router.push('/dashboard');
    } else {
      errore.value = data.errore;
    }
  } catch (err) {
    errore.value = 'Errore di rete. Riprova.';
  }
};
</script>
