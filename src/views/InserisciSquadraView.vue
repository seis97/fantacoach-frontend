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

    <!-- Banner prove gratuite -->
    <div v-if="!me?.premium && freeGenerationsLeft !== null" class="max-w-5xl mx-auto px-4 w-full">
      <div class="bg-yellow-500 text-black rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div class="font-semibold">
          🎁 Prova subito gratuitamente, prima di passare al Premium!
          <span class="ml-1">Ti restano <b>{{ freeGenerationsLeft }}</b> {{ freeGenerationsLeft === 1 ? 'generazione' : 'generazioni' }}.</span>
        </div>
        <button @click="router.push('/premium')" class="underline font-semibold">Vai a Premium →</button>
      </div>
    </div>

    <!-- Gestione Rose -->
    <div class="max-w-xl mx-auto space-y-4 mb-6 px-4">
      <div>
        <label class="block text-yellow-400 mb-2 font-semibold">📛 Nome Rosa</label>
        <input
          v-model="nomeSquadra"
          type="text"
          placeholder="Es. FC Bombazza"
          class="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        />
      </div>

      <div>
        <label class="block text-yellow-400 mb-2 font-semibold">📦 Carica una rosa salvata</label>
        <select
          v-model="rosaSelezionata"
          @change="caricaRosa"
          class="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        >
          <option disabled value="">— Seleziona una rosa salvata —</option>
          <option v-for="rosa in roseSalvate" :key="rosa._id" :value="rosa.nomeSquadra">
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

    <!-- Sezioni Ruoli (collassabili singole, niente espandi/chiudi tutto) -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      <div
        v-for="ruolo in ruoli"
        :key="ruolo.key"
        class="bg-gray-900 rounded border border-yellow-500"
      >
        <!-- Header cliccabile -->
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-3"
          @click="toggle(ruolo.key)"
        >
          <div class="flex items-center gap-3">
            <span
              class="inline-block transition-transform"
              :class="expanded[ruolo.key] ? 'rotate-90' : ''"
            >▶</span>
            <h2 class="text-xl font-bold text-yellow-400">{{ ruolo.label }}</h2>
          </div>
          <span class="text-sm text-gray-400">
            {{ filledCount(ruolo.key) }}/{{ ruolo.slots }} inseriti
          </span>
        </button>

        <!-- Contenuto collassabile -->
        <div v-show="expanded[ruolo.key]" class="px-4 pb-4 pt-1 border-t border-gray-800 space-y-2">
          <div
            v-for="(g, i) in giocatori[ruolo.key]"
            :key="ruolo.key + '-' + i"
            class="relative"
          >
            <input
              v-model="giocatori[ruolo.key][i].nome"
              @input="onType(ruolo.key, i)"
              @focus="openSuggestions(ruolo.key, i)"
              @blur="closeSuggestions(ruolo.key, i)"
              type="text"
              class="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
              :placeholder="ruolo.placeholder + ' #' + (i + 1)"
            />

            <!-- Spinner -->
            <div v-if="isLoading[keyFor(ruolo.key, i)]" class="absolute right-3 top-3 text-yellow-400 animate-pulse">⏳</div>

            <!-- Dropdown suggerimenti -->
            <ul
              v-if="suggestOpen[keyFor(ruolo.key, i)]"
              class="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-md border border-gray-700 bg-gray-900 text-sm"
            >
              <li
                v-for="s in suggestMap[keyFor(ruolo.key, i)]"
                :key="s.nome + (s.squadra || '')"
                @mousedown.prevent="!s._warning && chooseSuggestion(ruolo.key, i, s)"
                class="px-3 py-2 hover:bg-gray-800 cursor-pointer"
                :class="s._warning ? 'opacity-80 cursor-not-allowed text-yellow-400' : ''"
              >
                {{ s.nome }}
                <span class="text-gray-400" v-if="!s._warning && (s.ruolo || s.squadra)">
                  ({{ s.ruolo || '—' }}<span v-if="s.squadra"> — {{ s.squadra }}</span>)
                </span>
              </li>
            </ul>
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
        :disabled="loadingGenerate || (!me?.premium && (freeGenerationsLeft ?? 0) <= 0)"
        class="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded text-lg"
      >
        <span v-if="loadingGenerate">⏳ Generazione in corso…</span>
        <span v-else>🔮 Genera Formazione</span>
      </button>
    </div>

    <div v-if="messaggio" class="text-center text-green-400 mt-4">{{ messaggio }}</div>
    <div v-if="errore" class="text-center text-red-500 mt-2">{{ errore }}</div>

    <footer class="bg-gray-900 py-4 text-center border-t border-yellow-500 
      mt-12 text-gray-400 text-sm">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nomeSquadra = ref('')
const rosaSelezionata = ref('')
const roseSalvate = ref<any[]>([])
const messaggio = ref('')
const errore = ref('')

const me = ref<any>(null)
const freeGenerationsLeft = ref<number|null>(null)
const loadingGenerate = ref(false)

const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'
const api = (path: string) => `${BASE.replace(/\/$/, '')}${path}`
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` })

type RuoloKey = 'portieri' | 'difensori' | 'centrocampisti' | 'attaccanti'
const ruoli: Array<{ key: RuoloKey; label: string; slots: number; placeholder: string }> = [
  { key: 'portieri', label: '🧤 Portieri', slots: 3, placeholder: 'Portiere' },
  { key: 'difensori', label: '🛡️ Difensori', slots: 8, placeholder: 'Difensore' },
  { key: 'centrocampisti', label: '🎯 Centrocampisti', slots: 8, placeholder: 'Centrocampista' },
  { key: 'attaccanti', label: '⚡ Attaccanti', slots: 6, placeholder: 'Attaccante' },
]

function emptySlots(n: number) {
  return Array.from({ length: n }, () => ({ nome: '' }))
}

const giocatori = reactive<Record<RuoloKey, Array<{ nome: string }>>>({
  portieri: emptySlots(3),
  difensori: emptySlots(8),
  centrocampisti: emptySlots(8),
  attaccanti: emptySlots(6),
})

// Collassabili (singoli)
const expanded = reactive<Record<RuoloKey, boolean>>({
  portieri: false,
  difensori: false,
  centrocampisti: false,
  attaccanti: false,
})
function toggle(key: RuoloKey) { expanded[key] = !expanded[key] }

function filledCount(role: RuoloKey) {
  return (giocatori[role] || []).filter(x => x.nome && x.nome.trim().length > 0).length
}

function keyFor(role: RuoloKey, idx: number) {
  return `${role}-${idx}`
}

function normalizeLoaded(arr: any[], expected: number) {
  const names = (arr || []).map((x: any) => (typeof x === 'string' ? x : (x?.nome || ''))).filter(Boolean)
  const padded = [...names, ...Array.from({ length: Math.max(0, expected - names.length) }, () => '')]
  return padded.slice(0, expected).map(n => ({ nome: n }))
}

function nuovaRosa() {
  nomeSquadra.value = ''
  rosaSelezionata.value = ''
  giocatori.portieri = emptySlots(3)
  giocatori.difensori = emptySlots(8)
  giocatori.centrocampisti = emptySlots(8)
  giocatori.attaccanti = emptySlots(6)
}

async function salvaRosa() {
  errore.value = ''
  messaggio.value = ''

  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')
  if (!nomeSquadra.value.trim()) {
    errore.value = 'Inserisci un nome rosa.'
    return
  }

  const body = {
    nomeSquadra: nomeSquadra.value.trim(),
    portieri: giocatori.portieri.filter(g => g.nome?.trim()).map(g => ({ nome: g.nome.trim(), ruolo: 'POR' })),
    difensori: giocatori.difensori.filter(g => g.nome?.trim()).map(g => ({ nome: g.nome.trim(), ruolo: 'DIF' })),
    centrocampisti: giocatori.centrocampisti.filter(g => g.nome?.trim()).map(g => ({ nome: g.nome.trim(), ruolo: 'CEN' })),
    attaccanti: giocatori.attaccanti.filter(g => g.nome?.trim()).map(g => ({ nome: g.nome.trim(), ruolo: 'ATT' }))
  }

  try {
    const res = await fetch(api('/api/rosa/save'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (res.ok && data.success) {
      messaggio.value = '✅ Rosa salvata con successo!'
      await caricaTutteLeRose()
      rosaSelezionata.value = nomeSquadra.value
    } else {
      errore.value = data.errore || 'Errore nel salvataggio.'
    }
  } catch {
    errore.value = 'Errore di rete.'
  }
}

async function caricaTutteLeRose() {
  try {
    const res = await fetch(api('/api/rosa/all'), { headers: { ...authHeader() } })
    const data = await res.json()
    roseSalvate.value = (res.ok && data.success) ? (data.rose || []) : []
  } catch {
    roseSalvate.value = []
  }
}

async function caricaRosa() {
  errore.value = ''
  messaggio.value = ''

  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')
  if (!rosaSelezionata.value) return

  try {
    const res = await fetch(api(`/api/rosa/me?nomeRosa=${encodeURIComponent(rosaSelezionata.value)}`), {
      headers: { ...authHeader() }
    })
    const data = await res.json()
    if (res.ok && data.success && data.rosa) {
      const r = data.rosa
      nomeSquadra.value = r.nomeSquadra || nomeSquadra.value

      giocatori.portieri = normalizeLoaded(r.portieri, 3)
      giocatori.difensori = normalizeLoaded(r.difensori, 8)
      giocatori.centrocampisti = normalizeLoaded(r.centrocampisti, 8)
      giocatori.attaccanti  = normalizeLoaded(r.attaccanti, 6)

      messaggio.value = '✅ Rosa caricata.'
    } else {
      errore.value = data.errore || 'Errore caricamento rosa.'
    }
  } catch {
    errore.value = 'Errore rete nel caricamento rosa.'
  }
}

/* =========================
   GENERAZIONE
   ========================= */
function generaFormazione() {
  errore.value = ''
  messaggio.value = ''

  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  if (!me.value?.premium && ((freeGenerationsLeft.value ?? 0) <= 0)) {
    router.push('/premium')
    return
  }

  if (!rosaSelezionata.value) {
    errore.value = 'Seleziona o salva una rosa prima.'
    return
  }

  loadingGenerate.value = true
  ;(async () => {
    try {
      // trova ID della rosa selezionata
      let rosaId = ''
      const found = (roseSalvate.value || []).find((r: any) => r?.nomeSquadra === rosaSelezionata.value)
      if (found && found._id) {
        rosaId = String(found._id)
      } else {
        const resMe = await fetch(api(`/api/rosa/me?nomeRosa=${encodeURIComponent(rosaSelezionata.value)}`), { headers: { ...authHeader() } })
        const dMe = await resMe.json()
        if (resMe.ok && dMe?.success && dMe.rosa?._id) {
          rosaId = String(dMe.rosa._id)
        }
      }

      if (!rosaId) {
        errore.value = 'Rosa non trovata. Salva la rosa e riprova.'
        loadingGenerate.value = false
        return
      }

      const res = await fetch(api(`/api/rosa/formazione/genera/${rosaId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({})
      })

      if (res.status === 402) {
        const err = await res.json().catch(() => ({}))
        router.push(err.redirect || '/premium')
        return
      }

      const data = await res.json()
      if (res.ok && data?.success) {
        if (typeof data.freeGenerationsLeft !== 'undefined' && data.freeGenerationsLeft !== null) {
          freeGenerationsLeft.value = data.freeGenerationsLeft
        }
        router.push('/formazionepreview')
      } else {
        errore.value = data?.errore || 'Errore nella generazione.'
      }
    } catch (e) {
      console.error('generate error', e)
      errore.value = 'Errore di connessione al server.'
    } finally {
      loadingGenerate.value = false
    }
  })()
}

/* =========================
   AUTOCOMPLETE GIOCATORI
   ========================= */
const suggestMap = ref<Record<string, Array<{ nome: string; ruolo?: string; squadra?: string; _warning?: boolean }>>>({})
const suggestOpen = ref<Record<string, boolean>>({})
const debounceTimers = ref<Record<string, any>>({})
const isLoading = ref<Record<string, boolean>>({})

async function fetchSuggestions(query: string): Promise<{ list: any[]; warning: string }> {
  try {
    const res = await fetch(api(`/api/search-player?query=${encodeURIComponent(query)}`), {
      headers: { ...authHeader() }
    })
    const data = await res.json()

    if (res.ok && data?.success && Array.isArray(data.players)) {
      return { list: data.players, warning: '' }
    }
    if (data && data.code === 429) {
      return { list: [], warning: 'Limite suggerimenti raggiunto. Riprova tra poco.' }
    }
    return { list: [], warning: data?.errore || 'Errore ricerca giocatori.' }
  } catch {
    return { list: [], warning: 'Problema di rete nella ricerca.' }
  }
}

/* v-model + ricerca suggerimenti */
function onType(role: RuoloKey, idx: number) {
  const value = giocatori[role][idx].nome || ''
  const k = keyFor(role, idx)

  clearTimeout(debounceTimers.value[k])

  if (!value || value.trim().length < 2) {
    suggestMap.value[k] = []
    suggestOpen.value[k] = false
    isLoading.value[k] = false
    return
  }

  isLoading.value[k] = true
  debounceTimers.value[k] = setTimeout(async () => {
    const { list, warning } = await fetchSuggestions(value)
    isLoading.value[k] = false

    if (list && list.length) {
      suggestMap.value[k] = list
      suggestOpen.value[k] = true
      return
    }

    if (warning) {
      suggestMap.value[k] = [{ nome: `⚠ ${warning}`, _warning: true }]
      suggestOpen.value[k] = true
    } else {
      suggestMap.value[k] = []
      suggestOpen.value[k] = false
    }
  }, 350)
}

function openSuggestions(role: RuoloKey, idx: number) {
  const k = keyFor(role, idx)
  suggestOpen.value[k] = (suggestMap.value[k]?.length || 0) > 0
}

function chooseSuggestion(role: RuoloKey, idx: number, s: any) {
  if (s._warning) return
  giocatori[role][idx].nome = s.nome
  const k = keyFor(role, idx)
  suggestOpen.value[k] = false
}

function closeSuggestions(role: RuoloKey, idx: number) {
  const k = keyFor(role, idx)
  setTimeout(() => (suggestOpen.value[k] = false), 150)
}

onMounted(async () => {
  try {
    await caricaTutteLeRose()
    const r = await fetch(api('/api/me'), { headers: { ...authHeader() } })
    const d = await r.json()
    if (d?.success) { me.value = d.me; freeGenerationsLeft.value = d.freeGenerationsLeft }
  } catch (e) { console.error('me load error', e) }
})
</script>
