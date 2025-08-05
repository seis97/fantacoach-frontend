 <template>
  <section class="min-h-screen bg-gray-950 text-white">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900">
      <div class="text-2xl font-bold text-white-400">📊 FantaCoach AI - Dashboard</div>
      <router-link to="/" class="text-sm text-white hover:text-yellow-400">🏠 Torna alla Home</router-link>
    </nav>

    <!-- Dashboard Content -->
    <div class="max-w-6xl mx-auto px-6 py-16">
      <h1 class="text-4xl font-bold text-yellow-400 mb-6 text-center">🎯 Benvenuto nella tua Dashboard</h1>
      <p class="text-gray-400 text-center mb-12">Accedi alle funzionalità intelligenti, visualizza la formazione consigliata e gestisci le tue squadre.</p>

      <!-- Box funzionalità -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <router-link to="/formazionepreview" class="block bg-gray-900 p-6 rounded-lg border border-yellow-500 shadow-lg hover:scale-105 transition">
          <h2 class="text-xl font-semibold text-white-400 mb-2">⚙️ Genera Formazione AI</h2>
          <p class="text-gray-400 text-sm">Crea la formazione ideale basata sulle statistiche aggiornate.</p>
          <p class="mt-4 text-yellow-400 hover:underline">Vai alla funzione</p>
        </router-link>

        <router-link to="/inserisci-squadra" class="block bg-gray-900 p-6 rounded-lg border border-yellow-500 shadow-lg hover:scale-105 transition">
  <h2 class="text-xl font-semibold text-white-400 mb-2">📁 Gestione Squadre</h2>
  <p class="text-gray-400 text-sm">Salva e modifica le tue rose, tieni tutto sotto controllo.</p>
  <p class="mt-4 text-yellow-400 hover:underline">Vai alla funzione</p>
</router-link>


        <router-link to="/premium" class="block bg-gray-900 p-6 rounded-lg border border-yellow-500 shadow-lg hover:scale-105 transition">
          <h2 class="text-xl font-semibold text-white-400 mb-2">🔐 Premium Access</h2>
          <p class="text-gray-400 text-sm">Sblocca tutte le funzionalità con un piano Premium.</p>
          <p class="mt-4 text-yellow-400 hover:underline">Attiva ora</p>
        </router-link>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-4 text-center border-t border-yellow-500 text-yellow-400 mt-8">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  }
});
</script>

