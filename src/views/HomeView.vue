
<template>
  <div class="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
    <!-- Titolo -->
    <h1 class="text-3xl md:text-5xl font-bold text-center mb-6">
      Benvenuto su <span class="text-yellow-400">FantaCoach AI</span>
    </h1>

    <!-- Sottotitolo -->
    <p class="text-lg text-gray-300 text-center mb-10 max-w-xl">
      Inserisci la tua rosa e lascia che l’intelligenza artificiale generi per te la formazione ideale.
    </p>

    <!-- Pulsanti -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Registrati -->
      <router-link
        to="/register"
        class="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold py-3 px-8 rounded-xl text-center transition"
      >
        Registrati
      </router-link>

      <!-- Entra ora -->
      <router-link
        to="/login"
        class="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold py-3 px-8 rounded-xl text-center transition"
      >
        Entra ora
      </router-link>
    </div>
  </div>
</template>