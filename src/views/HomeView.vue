<template>
  <section class="bg-gray-950 text-white min-h-screen">
    <!-- Navbar -->
    <nav class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-4 border-b border-gray-800 text-center sm:text-left">
      <div class="text-2xl font-bold text-white">FantaCoach AI ⚽</div>
      <div class="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 mt-2 sm:mt-0">
        <router-link to="/login" class="text-white hover:text-yellow-400">Login</router-link>
        <router-link to="/register" class="text-white hover:text-yellow-400">Registrati</router-link>
        <router-link
          to="/dashboard"
          class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold">
          Entra ora
        </router-link>
      </div>
    </nav>

    <!-- Hero -->
    <div class="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center text-center md:text-left">
      <div class="md:w-1/2">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          L'AI che ti fa vincere <span class="text-yellow-400">il Fantacalcio</span>
        </h1>
        <p class="text-gray-400 text-base sm:text-lg mb-8">
          Formazioni ideali, consigli intelligenti, gestione squadre e tanto altro. Tutto in un'unica piattaforma.
        </p>
        <router-link
          to="/register"
          class="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition">
          Inizia Gratis
        </router-link>
      </div>
      <div class="md:w-1/2 mt-10 md:mt-0">
        <img
          src="https://www.occhiosportivo.it/wp-content/uploads/2023/05/fantacalcio-serie-a-tim-b6c0bbaf-5f01-4d30-978f-3334d799a151.png"
          alt="fantacoach ai"
          class="rounded-lg shadow-lg border-4 border-yellow-400 w-full max-w-sm mx-auto md:max-w-full"
        />
      </div>
    </div>

    <!-- Features -->
    <div class="bg-gray-900 py-12 px-4">
      <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 class="text-xl sm:text-2xl font-bold mb-2 text-yellow-400">⚡ Formazioni AI</h3>
          <p class="text-gray-400 text-sm sm:text-base">
            La formazione ottimale ogni giornata, calcolata con dati aggiornati e algoritmi intelligenti.
          </p>
        </div>
        <div>
          <h3 class="text-xl sm:text-2xl font-bold mb-2 text-yellow-400">📊 Statistiche Live</h3>
          <p class="text-gray-400 text-sm sm:text-base">
            Tutte le performance dei tuoi giocatori a portata di clic, in tempo reale.
          </p>
        </div>
        <div>
          <h3 class="text-xl sm:text-2xl font-bold mb-2 text-yellow-400">🎯 Consigli Personalizzati</h3>
          <p class="text-gray-400 text-sm sm:text-base">
            Suggerimenti su misura per la tua squadra, per avere sempre un vantaggio sugli avversari.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
