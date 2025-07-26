<template>
  <section class="min-h-screen flex flex-col bg-black text-white">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div class="text-2xl font-bold text-white">FantaCoach AI ⚽</div>
      <router-link to="/dashboard" class="text-white hover:text-yellow-400">🔙 Dashboard</router-link>
    </nav>

    <!-- Titolo -->
    <div class="text-center p-8">
      <h1 class="text-3xl font-bold text-yellow-400 mb-2">⚽ Inserisci la tua rosa ufficiale</h1>
      <div v-if="isDev" class="text-yellow-400 text-sm mb-4">👨‍💻 DEV MODE ATTIVO (accesso forzato)</div>
      <p class="text-gray-400 mb-6">Clicca sui ruoli per espandere le sezioni e inserire i tuoi giocatori.</p>
    </div>

    <!-- Nome Squadra -->
    <div class="max-w-md mx-auto mb-10">
      <label class="block text-yellow-400 text-sm font-semibold mb-2">📛 Nome Squadra</label>
      <input
        v-model="nomeSquadra"
        type="text"
        placeholder="Es. Real Pipponi"
        class="w-full p-3 rounded bg-gray-800 text-white border border-yellow-500 focus:outline-none"
      />
    </div>

    <!-- Sezioni ruoli disposte 2x2 -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
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

        <div v-if="sezioneAttiva === ruolo.key" class="text-sm text-gray-400 mt-2 mb-2">
          Suggerimenti: {{ suggeriti[ruolo.key].join(', ') }}
        </div>

        <div v-if="sezioneAttiva === ruolo.key" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(g, i) in giocatori[ruolo.key]" :key="i" class="relative">
            <input
              v-model="giocatori[ruolo.key][i]"
              type="text"
              :placeholder="`${ruolo.labelSingolo} ${i + 1}`"
              @input="filterGiocatori(ruolo.key, i)"
              class="w-full p-2 rounded bg-gray-800 text-white border border-yellow-500 focus:outline-none"
            />
            <ul
              v-if="suggestions[ruolo.key] && suggestions[ruolo.key][i]?.length"
              class="absolute z-10 bg-gray-900 text-white border border-yellow-500 rounded mt-1 max-h-40 overflow-y-auto w-full"
            >
              <li
                v-for="(s, j) in suggestions[ruolo.key][i]"
                :key="j"
                @click="selectSuggestion(ruolo.key, i, s)"
                class="p-2 hover:bg-yellow-600 cursor-pointer"
              >
                {{ s }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottoni azioni -->
    <div class="text-center mt-12 space-x-4">
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

    <!-- Messaggi -->
    <div v-if="errore" class="text-red-500 text-center mt-4">{{ errore }}</div>

    <div
      v-if="formazione.length"
      class="mt-6 bg-gray-900 p-6 rounded border border-yellow-400 max-w-xl mx-auto"
    >
      <h3 class="text-yellow-400 font-bold mb-2 text-lg">✅ Formazione Generata:</h3>
      <ul class="list-disc list-inside text-white space-y-1">
        <li v-for="(g, i) in formazione" :key="i">{{ g }}</li>
      </ul>
    </div>

    <div v-if="messaggioSalvato" class="text-green-400 text-center mt-6">✅ Rosa salvata con successo!</div>

    <!-- Footer -->
    <footer class="bg-gray-900 py-4 text-center border-t border-yellow-500 text-yellow-400 mt-16">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ruoli = [
  { key: 'portieri', label: 'Portieri', labelSingolo: 'Portiere', count: 3, icon: '🧤' },
  { key: 'difensori', label: 'Difensori', labelSingolo: 'Difensore', count: 8, icon: '🛡️' },
  { key: 'centrocampisti', label: 'Centrocampisti', labelSingolo: 'Centrocampista', count: 8, icon: '🧠' },
  { key: 'attaccanti', label: 'Attaccanti', labelSingolo: 'Attaccante', count: 6, icon: '🎯' }
] as const

type RuoloKey = typeof ruoli[number]['key']

const nomeSquadra = ref('')
const sezioneAttiva = ref('')
const formazione = ref<string[]>([])
const errore = ref('')
const messaggioSalvato = ref('')
const isPremium = ref(false)
const isDev = ref(false)
const DEV_EMAIL = 'premium@premium.com'
const FREE_LIMIT = 2

const suggeriti: Record<RuoloKey, string[]> = {
  portieri: ['Maignan', 'Donnarumma', 'Szczesny'],
  difensori: ['Di Lorenzo', 'Scalvini', 'Theo Hernandez', 'Bastoni', 'Buongiorno'],
  centrocampisti: ['Locatelli', 'Barella', 'Frattesi', 'Zaccagni', 'Pellegrini'],
  attaccanti: ['Chiesa', 'Retegui', 'Belotti', 'Immobile', 'Gnonto']
}

const giocatori = reactive<Record<RuoloKey, string[]>>({
  portieri: Array(3).fill(''),
  difensori: Array(8).fill(''),
  centrocampisti: Array(8).fill(''),
  attaccanti: Array(6).fill('')
})

const suggestions = reactive<Record<RuoloKey, string[][]>>({
  portieri: Array(3).fill([]),
  difensori: Array(8).fill([]),
  centrocampisti: Array(8).fill([]),
  attaccanti: Array(6).fill([])
})

const tuttiIGiocatori = [
  'Maignan', 'Donnarumma', 'Szczesny', 'Di Lorenzo', 'Scalvini', 'Theo Hernandez',
  'Bastoni', 'Buongiorno', 'Locatelli', 'Barella', 'Frattesi', 'Zaccagni',
  'Berardi', 'Chiesa', 'Retegui', 'Belotti', 'Immobile', 'Gnonto', 'Pellegrini'
]

const toggleSezione = (ruolo: RuoloKey) => {
  sezioneAttiva.value = sezioneAttiva.value === ruolo ? '' : ruolo
}

const filterGiocatori = (ruolo: RuoloKey, index: number) => {
  const query = giocatori[ruolo][index].toLowerCase()
  suggestions[ruolo][index] = query
    ? tuttiIGiocatori.filter(n => n.toLowerCase().includes(query) && !Object.values(giocatori).flat().includes(n)).slice(0, 5)
    : []
}

const selectSuggestion = (ruolo: RuoloKey, index: number, nome: string) => {
  giocatori[ruolo][index] = nome
  suggestions[ruolo][index] = []
}

const salvaRosa = async () => {
  errore.value = ''
  messaggioSalvato.value = ''

  if (!nomeSquadra.value.trim()) {
    errore.value = '❗ Inserisci un nome per la tua squadra.'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/squadra', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ nomeSquadra: nomeSquadra.value, giocatori })
    })
    const data = await res.json()
    if (res.ok) {
      messaggioSalvato.value = '✅ Rosa salvata con successo!'
    } else {
      errore.value = data.errore || 'Errore nel salvataggio.'
    }
  } catch {
    errore.value = 'Errore di rete.'
  }
}

const generaFormazione = async () => {
  errore.value = ''
  formazione.value = []

  const squadra = [...giocatori.portieri, ...giocatori.difensori, ...giocatori.centrocampisti, ...giocatori.attaccanti]

  if (!nomeSquadra.value.trim()) {
    errore.value = '❗ Inserisci un nome per la tua squadra.'
    return
  }
  if (squadra.includes('')) {
    errore.value = '🚫 Compila tutti i campi prima di generare la formazione.'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/formazione-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ squadra, nomeSquadra: nomeSquadra.value })
    })
    const data = await res.json()
    if (res.ok) {
      formazione.value = data.formazione
    } else {
      errore.value = data.errore || 'Errore nella generazione.'
    }
  } catch {
    errore.value = 'Errore di rete.'
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const email = payload.email
    const premium = payload.premium

    isDev.value = email === DEV_EMAIL
    isPremium.value = premium || isDev.value

    if (!isPremium.value && !isDev.value) {
      let freeUsages = parseInt(localStorage.getItem('freeUsages') || '')
      if (!freeUsages && freeUsages !== 0) {
        freeUsages = FREE_LIMIT
      }
      if (freeUsages > 0) {
        freeUsages--
        localStorage.setItem('freeUsages', freeUsages.toString())
      } else {
        return router.push('/premium')
      }
    }
  } catch {
    return router.push('/login')
  }
})
</script>

