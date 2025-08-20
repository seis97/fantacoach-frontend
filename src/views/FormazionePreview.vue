<template>
  <section class="min-h-screen bg-black text-white flex flex-col">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div class="text-2xl font-bold text-white">FantaCoach AI ⚽</div>
      <div class="flex items-center gap-3">
        <router-link to="/inserisci-squadra" class="text-white hover:text-yellow-400">✏️ Modifica Rosa</router-link>
        <router-link to="/dashboard" class="text-white hover:text-yellow-400">📊 Dashboard</router-link>
      </div>
    </nav>

    <div class="px-6 py-5 max-w-6xl w-full mx-auto">
      <!-- Banner prove gratuite -->
      <div
        v-if="!me?.premium && freeGenerationsLeft !== null"
        class="bg-yellow-500 text-black rounded-xl p-4 mb-6 flex items-center justify-between"
      >
        <div class="font-semibold">
          🎁 Prova gratuita: ti restano
          <b>{{ freeGenerationsLeft }}</b>
          {{ freeGenerationsLeft === 1 ? 'generazione' : 'generazioni' }}.
        </div>
        <button @click="goPremium" class="underline font-semibold">Vai a Premium →</button>
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-yellow-400">📋 Formazione</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-400">Modulo:</span>
          <span class="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-white font-semibold">
            {{ modulo || '—' }}
          </span>
        </div>
      </div>

      <!-- Campo da calcio -->
      <div class="w-full flex justify-center mb-6">
        <div class="relative w-full max-w-5xl aspect-[3/2] rounded-2xl overflow-hidden ring-2 ring-white/60">
          <!-- prato con strisce -->
          <div class="absolute inset-0" :style="pitchBg"></div>

          <!-- linee del campo -->
          <div class="absolute inset-3 rounded-2xl border-4 border-white/70"></div>
          <!-- cerchio centrocampo -->
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/70"
            style="width: 180px; height: 180px;"
          ></div>
          <!-- dischetto centrocampo -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          <!-- area piccola + rigore + area grande (porta in basso) -->
          <div class="absolute left-1/2 bottom-3 -translate-x-1/2 w-[220px] h-[60px] border-4 border-white/70"></div>
          <div class="absolute left-1/2 bottom-3 -translate-x-1/2 w-[360px] h-[120px] border-4 border-white/70"></div>
          <div class="absolute left-1/2 bottom-[130px] -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
          <!-- specchiate in alto -->
          <div class="absolute left-1/2 top-3 -translate-x-1/2 w-[220px] h-[60px] border-4 border-white/70"></div>
          <div class="absolute left-1/2 top-3 -translate-x-1/2 w-[360px] h-[120px] border-4 border-white/70"></div>
          <div class="absolute left-1/2 top-[130px] -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>

          <!-- Righe giocatori: ATT (alto), CEN, DIF, POR (basso) -->
          <div class="absolute left-0 right-0" :style="{ top: rows.attY }">
            <div class="flex justify-center gap-3 px-3 flex-wrap">
              <div
                v-for="(n, i) in att"
                :key="'att-'+i"
                class="px-3 py-1 rounded-full shadow-md border font-semibold text-sm
                       bg-gray-800 text-white border-gray-700"
              >
                {{ n }}
              </div>
            </div>
          </div>

          <div class="absolute left-0 right-0" :style="{ top: rows.midY }">
            <div class="flex justify-center gap-3 px-3 flex-wrap">
              <div
                v-for="(n, i) in mid"
                :key="'mid-'+i"
                class="px-3 py-1 rounded-full shadow-md border font-semibold text-sm
                       bg-gray-800 text-white border-gray-700"
              >
                {{ n }}
              </div>
            </div>
          </div>

          <div class="absolute left-0 right-0" :style="{ top: rows.defY }">
            <div class="flex justify-center gap-3 px-3 flex-wrap">
              <div
                v-for="(n, i) in def"
                :key="'def-'+i"
                class="px-3 py-1 rounded-full shadow-md border font-semibold text-sm
                       bg-gray-800 text-white border-gray-700"
              >
                {{ n }}
              </div>
            </div>
          </div>

          <div class="absolute left-0 right-0" :style="{ top: rows.gkY }">
            <div class="flex justify-center px-3">
              <div
                v-for="(n, i) in gk"
                :key="'gk-'+i"
                class="px-3 py-1 rounded-full shadow-md border font-semibold text-sm
                       bg-yellow-500 text-black border-yellow-400"
              >
                {{ n }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste (fallback/ricontrollo) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 class="text-lg font-bold mb-3">🟡 Titolari</h2>
          <ul class="space-y-2 list-disc list-inside">
            <li v-for="(n, i) in titolari" :key="'tit-' + i" class="text-gray-100">
              {{ n }}
            </li>
            <li v-if="!titolari.length" class="text-gray-400">Nessun titolare disponibile.</li>
          </ul>
        </div>

        <div class="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 class="text-lg font-bold mb-3">⚫ Panchina</h2>
          <ul class="space-y-2 list-disc list-inside">
            <li v-for="(n, i) in panchina" :key="'pan-' + i" class="text-gray-300">
              {{ n }}
            </li>
            <li v-if="!panchina.length" class="text-gray-400">Nessuna panchina disponibile.</li>
          </ul>
        </div>
      </div>

      <!-- Azioni -->
      <div class="flex flex-wrap items-center gap-3 mt-6">
        <button
          @click="rigenera"
          :disabled="loading || (!me?.premium && (freeGenerationsLeft ?? 0) <= 0) || !rosaId"
          class="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                 text-white font-semibold px-5 py-3 rounded-xl"
        >
          <span v-if="loading">⏳ Rigenerazione…</span>
          <span v-else>🔄 Rigenera Formazione</span>
        </button>

        <button
          @click="goPremium"
          class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-3 rounded-2xl"
        >
          ⭐ Passa a Premium
        </button>
      </div>
    </div>

    <!-- MODAL limite raggiunto -->
    <div v-if="limitModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70" @click="limitModalOpen=false"></div>
      <div class="relative bg-gray-900 border border-yellow-500 rounded-2xl p-6 w-[95%] max-w-md shadow-xl">
        <h3 class="text-xl font-bold text-yellow-400 mb-2">Hai finito le generazioni gratuite</h3>
        <p class="text-gray-300 mb-5">
          Per continuare a generare la formazione, passa al <b>Premium</b>.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="limitModalOpen=false"
            class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >Annulla</button>
          <button
            @click="goPremium"
            class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg"
          >Vai a Premium →</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-auto bg-gray-900 py-4 text-center border-t border-yellow-500 text-gray-400 text-sm">
      © 2025 FantaCoach AI — Tutti i diritti riservati ⚽
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Usa proxy Vite? metti '' e chiama /api/...
const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'
const api = (p: string) => `${BASE.replace(/\/$/, '')}${p}`
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` })

// Stato utente / prove
const me = ref<any>(null)
const freeGenerationsLeft = ref<number | null>(null)

// Dati formazione
const modulo = ref<string>('4-3-3')
const titolari = ref<string[]>([])
const panchina = ref<string[]>([])
const rosaId = ref<string>('')

const loading = ref(false)
const limitModalOpen = ref(false)

// Pitch background (strisce)
const pitchBg = computed(() => ({
  background: 'repeating-linear-gradient(90deg, #166534, #166534 24px, #15803d 24px, #15803d 48px)'
}))

const rows = {
  attY: '12%',  // linea attaccanti (alto)
  midY: '34%',
  defY: '62%',
  gkY:  '84%'
}

// Parse modulo "4-3-3" -> [4,3,3]
function parseModulo(m: string): [number, number, number] {
  const parts = String(m || '').split('-').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x))
  if (parts.length === 3) return [parts[0], parts[1], parts[2]]
  return [4, 3, 3]
}

// Suddividi i titolari assumendo: 1 GK, poi D, M, A
const gk = ref<string[]>([])
const def = ref<string[]>([])
const mid = ref<string[]>([])
const att = ref<string[]>([])

function splitByModule() {
  const [d, m, a] = parseModulo(modulo.value)
  const arr = Array.isArray(titolari.value) ? titolari.value.slice() : []
  if (!arr.length) { gk.value = []; def.value = []; mid.value = []; att.value = []; return }

  const hasGk = arr.length >= 1
  gk.value = hasGk ? [arr[0]] : []
  let idx = hasGk ? 1 : 0

  def.value = arr.slice(idx, idx + d); idx += d
  mid.value = arr.slice(idx, idx + m); idx += m
  att.value = arr.slice(idx, idx + a)
}

watch([titolari, modulo], splitByModule, { deep: true })

const goPremium = () => router.push('/premium')

async function loadMe() {
  try {
    const r = await fetch(api('/api/me'), { headers: { ...authHeader() } })
    const d = await r.json()
    if (d?.success) {
      me.value = d.me
      freeGenerationsLeft.value = d.freeGenerationsLeft
    }
  } catch (e) {
    console.error('me error', e)
  }
}

async function loadInitialRosa() {
  // 1) prova a leggere da query/params
  const qid = (route.query.id as string) || (route.params as any).id || ''
  if (qid) {
    rosaId.value = qid
  } else {
    // 2) prendi l'ultima rosa aggiornata
    try {
      const res = await fetch(api('/api/rosa/all'), { headers: { ...authHeader() } })
      const d = await res.json()
      if (res.ok && d?.success && Array.isArray(d.rose) && d.rose.length) {
        const r = d.rose[0]
        rosaId.value = r._id
        // Mostra già l'ultima formazione salvata
        modulo.value = r.modulo || modulo.value
        titolari.value = Array.isArray(r.titolari) ? r.titolari : []
        panchina.value = Array.isArray(r.panchina) ? r.panchina : []
      }
    } catch (e) {
      console.error('load all roses error', e)
    }
  }

  // Se abbiamo un id ma nessuna lista caricata, prova a fetchare la singola rosa dalla lista
  if (rosaId.value && titolari.value.length === 0 && panchina.value.length === 0) {
    try {
      const res = await fetch(api('/api/rosa/all'), { headers: { ...authHeader() } })
      const d = await res.json()
      if (res.ok && d?.success && Array.isArray(d.rose)) {
        const found = d.rose.find((x: any) => String(x._id) === String(rosaId.value))
        if (found) {
          modulo.value = found.modulo || modulo.value
          titolari.value = Array.isArray(found.titolari) ? found.titolari : []
          panchina.value = Array.isArray(found.panchina) ? found.panchina : []
        }
      }
    } catch (e) { /* ignore */ }
  }

  splitByModule()
}

async function rigenera() {
  if (!rosaId.value) {
    alert('Rosa non trovata.')
    return
  }

  // Pre-blocco UX: se non premium e finite → apri modal
  if (!me.value?.premium && (freeGenerationsLeft.value ?? 0) <= 0) {
    limitModalOpen.value = true
    return
  }

  loading.value = true
  try {
    const res = await fetch(api(`/api/rosa/formazione/genera/${rosaId.value}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({})
    })

    if (res.status === 402) {
      // backend: { errore:'FREE_LIMIT_REACHED', redirect:'/premium' }
      limitModalOpen.value = true
      return
    }

    const data = await res.json()

    if (res.ok && data?.success) {
      modulo.value = data.modulo || modulo.value
      titolari.value = Array.isArray(data.titolari) ? data.titolari : []
      panchina.value = Array.isArray(data.panchina) ? data.panchina : []
      splitByModule()

      // Aggiorna contatore prove (se non premium)
      if (typeof data.freeGenerationsLeft !== 'undefined' && data.freeGenerationsLeft !== null) {
        freeGenerationsLeft.value = data.freeGenerationsLeft
      }
    } else {
      alert(data?.errore || 'Errore nella rigenerazione')
    }
  } catch (e) {
    console.error('rigenera error', e)
    alert('Errore di connessione al server')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadMe()
  await loadInitialRosa()
})
</script>

<style scoped>
/* Usiamo Tailwind per quasi tutto */
</style>
