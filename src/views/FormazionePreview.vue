<template>
  <section class="min-h-screen bg-black text-white flex flex-col">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div class="text-2xl font-bold text-white">FantaCoach AI ⚽</div>
      <router-link to="/dashboard" class="text-white hover:text-yellow-400">🔙 Dashboard</router-link>
    </nav>

    <!-- Titolo -->
    <div class="text-center p-6">
      <h1 class="text-3xl font-bold text-yellow-400">📋 Formazione Generata</h1>
      <p class="text-gray-400 mt-2">Questa è la tua formazione ideale generata dall'intelligenza artificiale.</p>
    </div>

    <!-- Bottone genera -->
    <div class="text-center mb-4">
      <button @click="generaFormazioneAI" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-lg">
        🔮 Genera Formazione AI
      </button>
    </div>

    <div v-if="errore" class="text-center text-red-500 mt-2">{{ errore }}</div>

    <!-- Selezione rosa -->
    <div class="p-4 text-white text-center">
      <h2 class="text-xl font-semibold mb-2">🔽 Seleziona una delle tue rose</h2>
      <select v-model="rosaSelezionata" @change="caricaRosa" class="bg-gray-900 border border-yellow-400 p-2 rounded text-white">
        <option disabled value="">-- Scegli la tua rosa --</option>
        <option v-for="r in roseDisponibili" :key="r._id" :value="r.nomeSquadra">{{ r.nomeSquadra }}</option>
      </select>
    </div>

    <!-- Campo da calcio -->
    <div class="flex flex-col md:flex-row gap-6 px-4 pb-10">
      <!-- Campo -->
      <div class="relative w-full md:w-3/4 aspect-[16/9] rounded-2xl shadow-xl overflow-hidden border border-yellow-400">
        <img :src="campo" alt="Campo da calcio" class="absolute inset-0 w-full h-full object-cover" />

        <!-- Giocatori sul campo -->
        <div
          v-for="(player, index) in formazione"
          :key="index"
          :style="getPositionStyle(modulo, index)"
          class="absolute text-center text-xs md:text-sm font-bold bg-yellow-500 text-black rounded-full px-2 py-1 shadow-md whitespace-nowrap"
        >
          {{ player }}
        </div>
      </div>

      <!-- Panchina -->
      <div class="w-full md:w-1/4 bg-gray-900 p-4 rounded-xl shadow-xl">
        <h2 class="text-lg font-semibold mb-2 text-yellow-400">Panchina</h2>
        <ul class="space-y-2">
          <li v-for="(p, i) in panchina" :key="i" class="bg-gray-800 p-2 rounded-md text-sm truncate">
            {{ p }}
          </li>
        </ul>
      </div>
    </div>

    <footer class="bg-gray-900 py-4 text-center border-t border-yellow-500 text-yellow-400 mt-auto">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import campo from '@/assets/campo.jpg'

const router = useRouter()
const rosaSelezionata = ref('')
const roseDisponibili = ref([])
const modulo = ref('')
const formazione = ref<string[]>([])
const panchina = ref<string[]>([])
const errore = ref('')

// Mappa posizioni
const moduli = {
  '4-3-3': [
    { top: '90%', left: '50%' },
    { top: '70%', left: '15%' },
    { top: '70%', left: '35%' },
    { top: '70%', left: '65%' },
    { top: '70%', left: '85%' },
    { top: '50%', left: '25%' },
    { top: '50%', left: '50%' },
    { top: '50%', left: '75%' },
    { top: '30%', left: '20%' },
    { top: '25%', left: '50%' },
    { top: '30%', left: '80%' },
  ],
  '4-4-2': [
    { top: '90%', left: '50%' },
    { top: '70%', left: '15%' },
    { top: '70%', left: '35%' },
    { top: '70%', left: '65%' },
    { top: '70%', left: '85%' },
    { top: '50%', left: '20%' },
    { top: '50%', left: '40%' },
    { top: '50%', left: '60%' },
    { top: '50%', left: '80%' },
    { top: '25%', left: '40%' },
    { top: '25%', left: '60%' },
  ],
}

function getPositionStyle(moduloStr: string, index: number) {
  const positions = moduli[moduloStr]
  if (!positions || !positions[index]) return { display: 'none' }
  return {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    ...positions[index],
  }
}

// Caricamento rose utente
// Caricamento rose utente
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  try {
    const res = await fetch('http://localhost:3000/api/rosa/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (data.success) {
      roseDisponibili.value = data.rose
    } else {
      errore.value = '⚠️ Nessuna rosa trovata.'
    }
  } catch {
    errore.value = 'Errore di rete.'
  }
})


// Carica la rosa selezionata
const caricaRosa = async () => {
  const token = localStorage.getItem('token')
  if (!token || !rosaSelezionata.value) return

  try {
    const res = await fetch(`http://localhost:3000/api/rosa/me?nomeRosa=${encodeURIComponent(rosaSelezionata.value)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      modulo.value = data.rosa.modulo
      formazione.value = data.rosa.titolari
      panchina.value = data.rosa.panchina
    } else {
      errore.value = data.errore || 'Errore caricamento rosa.'
    }
  } catch {
    errore.value = 'Errore rete nel caricamento rosa.'
  }
}

// Genera la formazione AI
async function generaFormazioneAI() {
  errore.value = ''
  try {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    const res = await fetch('http://localhost:3000/api/formazionepreview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ squadra: [...formazione.value, ...panchina.value] }),
    })
    const data = await res.json()

    if (res.ok) {
      formazione.value = data.formazione
      // opzionalmente aggiorna anche il modulo
      modulo.value = '4-3-3' // ← se vuoi modificarlo dinamicamente
    } else {
      errore.value = data.errore || 'Errore generazione formazione.'
    }
  } catch {
    errore.value = 'Errore rete nella generazione.'
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  .truncate {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
