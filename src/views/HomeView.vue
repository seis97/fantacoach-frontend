<template>
  <section class="bg-gray-950 text-white min-h-screen">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 border-b border-gray-800">
      <div class="text-2xl font-bold text-white-400">FantaCoach AI ⚽</div>
      <div class="space-x-4">
        <router-link to="/login" class="text-white hover:text-yellow-400">Login</router-link>
        <router-link to="/register" class="text-white hover:text-yellow-400">Registrati</router-link>
        <router-link to="/dashboard" class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold">Entra ora</router-link>
      </div>
    </nav>

    <!-- Hero -->
    <div class="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center">
      <div class="md:w-1/2 text-center md:text-left">
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          L'AI che ti fa vincere <span class="text-yellow-400">il Fantacalcio</span>
        </h1>
        <p class="text-gray-400 text-lg mb-8">
          Formazioni ideali, consigli intelligenti, gestione squadre e tanto altro. Tutto in un'unica piattaforma.
        </p>
        <router-link
          to="/register"
          class="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition">
          Inizia Gratis
        </router-link>
      </div>
      <div class="md:w-1/2 mt-12 md:mt-0">
        <img
          src="https://www.occhiosportivo.it/wp-content/uploads/2023/05/fantacalcio-serie-a-tim-b6c0bbaf-5f01-4d30-978f-3334d799a151.png"
          alt="fantacoach ai"
          class="rounded-lg shadow-lg border-4 border-yellow-400"
        />
      </div>
    </div>

    <!-- Features -->
    <div class="bg-gray-900 py-16">
      <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 class="text-2xl font-bold mb-2 text-yellow-400">⚡ Formazioni AI</h3>
          <p class="text-gray-400">La formazione ottimale ogni giornata, calcolata con dati aggiornati e algoritmi intelligenti.</p>
        </div>
        <div>
          <h3 class="text-2xl font-bold mb-2 text-yellow-400">📊 Statistiche Live</h3>
          <p class="text-gray-400">Tutte le performance dei tuoi giocatori a portata di clic, in tempo reale.</p>
        </div>
        <div>
          <h3 class="text-2xl font-bold mb-2 text-yellow-400">🎯 Consigli Personalizzati</h3>
          <p class="text-gray-400">Suggerimenti su misura per la tua squadra, per avere sempre un vantaggio sugli avversari.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>

