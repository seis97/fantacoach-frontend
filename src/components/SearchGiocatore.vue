<template>
  <div class="relative w-full">
    <!-- Campo di ricerca -->
    <input
      v-model="query"
      @input="cercaGiocatore"
      :placeholder="placeholder || 'Cerca giocatore...'"
      class="w-full p-2 border border-yellow-400 bg-gray-900 text-white rounded"
    />

    <!-- Lista suggerimenti -->
    <ul
      v-if="suggestions.length > 0 && query"
      class="absolute z-10 w-full bg-gray-800 border border-yellow-400 rounded mt-1 max-h-60 overflow-y-auto"
    >
      <li
        v-for="(player, index) in suggestions"
        :key="index"
        @click="selezionaGiocatore(player)"
        class="p-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
      >
        ⚽ {{ player.nome }} — {{ player.ruolo }} ({{ player.squadra }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  placeholder: String,
  valoreIniziale: String,
  role: String // "POR", "DIF", "CEN", "ATT"
})
const emit = defineEmits(['select'])

const query = ref(props.valoreIniziale || '')
const suggestions = ref([])

async function cercaGiocatore() {
  if (query.value.length < 2) {
    suggestions.value = []
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    console.warn("⚠️ Nessun token trovato. L'utente non è loggato.")
    return
  }

  try {
    const url = `http://localhost:3000/api/search-player?query=${encodeURIComponent(query.value)}&role=${props.role}`
    console.log("🌍 [Frontend] Chiamata API:", url)

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    console.log("📡 [Frontend] Status:", res.status)

    const data = await res.json()
    console.log("📦 [Frontend] Risposta:", data)

    suggestions.value = data.success ? data.players : []
  } catch (err) {
    console.error("❌ Errore fetch giocatori:", err)
    suggestions.value = []
  }
}

function selezionaGiocatore(player) {
  emit('select', { nome: player.nome, ruolo: player.ruolo }) // passa oggetto al genitore
  query.value = player.nome // mostra solo il nome
  suggestions.value = [] // chiude lista
}

onMounted(() => {
  if (props.valoreIniziale) {
    query.value = props.valoreIniziale
  }
})
</script>
