<template>
  <section class="min-h-screen flex flex-col bg-black text-white">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div class="text-2xl font-bold text-white">FantaCoach AI ⚽</div>
      <router-link to="/dashboard" class="text-white hover:text-yellow-400">🔙 Dashboard</router-link>
    </nav>

    <!-- Titolo -->
    <div class="text-center p-6">
      <h1 class="text-3xl font-bold text-yellow-400 mb-2">⚽ Gestione Rosa Fantacalcio</h1>
      <p class="text-gray-400 mb-2">Puoi creare più rose e modificarle quando vuoi.</p>
    </div>

    <!-- Gestione Rose -->
    <div class="max-w-xl mx-auto space-y-4 mb-6 px-4">
      <div>
        <label class="block text-yellow-400 mb-2 font-semibold">📛 Nome Rosa</label>
        <input
          v-model="nomeSquadra"
          type="text"
          placeholder="Es. Real Pipponi"
          class="w-full p-3 rounded bg-gray-800 text-white border border-yellow-500 focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-gray-400 mb-2">📂 Rose Salvate</label>
        <select
          v-model="rosaSelezionata"
          @change="caricaRosa"
          class="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        >
          <option disabled value="">— Seleziona una rosa salvata —</option>
          <option v-for="rosa in roseSalvate" :key="rosa._id" :value="rosa._id">
            {{ rosa.nomeSquadra }}
          </option>
        </select>
      </div>

      <button
        @click="nuovaRosa"
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded mt-2"
      >
        ➕ Nuova Rosa
      </button>
    </div>

    <!-- Sezioni Ruoli -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      <div
        v-for="ruolo in ruoli"
        :key="ruolo.key"
        class="bg-gray-900 p-4 rounded border border-yellow-500"
      >
        <button
          @click="toggleSezione(ruolo.key)"
          class="w-full text-left font-bold text-lg text-yellow-400 flex justify-between items-center"
        >
          <span>{{ ruolo.icon }} {{ ruolo.label }}</span>
          <span>{{ sezioneAttiva === ruolo.key ? '🔽' : '▶️' }}</span>
        </button>

        <div v-if="sezioneAttiva === ruolo.key" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(g, i) in giocatori[ruolo.key]" :key="i" class="relative">
            <SearchGiocatore
              :placeholder="`${ruolo.labelSingolo} ${i + 1}`"
              :valore-iniziale="g?.nome || ''"
              :role="ruolo.key === 'portieri' ? 'POR' : ruolo.key === 'difensori' ? 'DIF' : ruolo.key === 'centrocampisti' ? 'CEN' : 'ATT'"
              @select="(player) => setGiocatore(ruolo.key, i, player)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottoni -->
    <div class="text-center mt-8 space-x-4 px-4">
      <button
        @click="salvaRosa"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded text-lg"
      >
        💾 Salva Rosa
      </button>
      <button
        @click="generaFormazione"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-lg"
      >
        🔮 Genera Formazione
      </button>
    </div>

    <div v-if="messaggio" class="text-center text-green-400 mt-4">{{ messaggio }}</div>
    <div v-if="errore" class="text-center text-red-500 mt-2">{{ errore }}</div>

    <footer class="bg-gray-900 py-4 text-center border-t border-yellow-500 text-yellow-400 mt-16">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchGiocatore from '@/components/SearchGiocatore.vue'

const router = useRouter()
const nomeSquadra = ref('')
const rosaSelezionata = ref('')
const roseSalvate = ref<any[]>([])
const sezioneAttiva = ref('')
const messaggio = ref('')
const errore = ref('')

const ruoli = [
  { key: 'portieri', label: 'Portieri', labelSingolo: 'Portiere', count: 3, icon: '🧤' },
  { key: 'difensori', label: 'Difensori', labelSingolo: 'Difensore', count: 8, icon: '🛡️' },
  { key: 'centrocampisti', label: 'Centrocampisti', labelSingolo: 'Centrocampista', count: 8, icon: '🧠' },
  { key: 'attaccanti', label: 'Attaccanti', labelSingolo: 'Attaccante', count: 6, icon: '🎯' }
] as const

type RuoloKey = typeof ruoli[number]['key']

const giocatori = reactive<Record<RuoloKey, any[]>>({
  portieri: Array(3).fill({ nome: '', ruolo: 'POR' }),
  difensori: Array(8).fill({ nome: '', ruolo: 'DIF' }),
  centrocampisti: Array(8).fill({ nome: '', ruolo: 'CEN' }),
  attaccanti: Array(6).fill({ nome: '', ruolo: 'ATT' })
})

function toggleSezione(ruolo: RuoloKey) {
  sezioneAttiva.value = sezioneAttiva.value === ruolo ? '' : ruolo
}

function setGiocatore(ruolo: RuoloKey, index: number, player: any) {
  giocatori[ruolo][index] = { nome: player.nome, ruolo: player.ruolo }
}

function nuovaRosa() {
  nomeSquadra.value = ''
  rosaSelezionata.value = ''
  ruoli.forEach(r => (giocatori[r.key] = Array(r.count).fill({ nome: '', ruolo: r.key.slice(0,3).toUpperCase() })))
}

async function salvaRosa() {
  errore.value = ''
  messaggio.value = ''

  const rosa = [
    ...giocatori.portieri,
    ...giocatori.difensori,
    ...giocatori.centrocampisti,
    ...giocatori.attaccanti
  ]

  try {
    const res = await fetch('http://localhost:3000/api/rosa/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        nomeSquadra: nomeSquadra.value,
        modulo: '4-3-3',
        titolari: rosa.slice(0, 11),
        panchina: rosa.slice(11)
      })
    })
    const data = await res.json()
    if (res.ok) {
      messaggio.value = data.message || '✅ Rosa salvata con successo!'
      await caricaTutteLeRose()
    } else {
      errore.value = data.errore || 'Errore nel salvataggio.'
    }
  } catch {
    errore.value = 'Errore di rete.'
  }
}

async function caricaTutteLeRose() {
  try {
    const res = await fetch('http://localhost:3000/api/rosa/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    const data = await res.json()
    if (res.ok && data.success) {
      roseSalvate.value = data.rose
    }
  } catch {
    console.error('Errore nel recupero delle rose')
  }
}

function caricaRosa() {
  const rosa = roseSalvate.value.find(r => r._id === rosaSelezionata.value)
  if (!rosa) return
  nomeSquadra.value = rosa.nomeSquadra
  giocatori.portieri = rosa.titolari.concat(rosa.panchina).filter(g => g.ruolo === 'POR')
  giocatori.difensori = rosa.titolari.concat(rosa.panchina).filter(g => g.ruolo === 'DIF')
  giocatori.centrocampisti = rosa.titolari.concat(rosa.panchina).filter(g => g.ruolo === 'CEN')
  giocatori.attaccanti = rosa.titolari.concat(rosa.panchina).filter(g => g.ruolo === 'ATT')
}

function generaFormazione() {
  router.push('/formazionepreview')
}

onMounted(() => {
  caricaTutteLeRose()
})
</script>
