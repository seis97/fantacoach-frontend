<template>
  <div class="relative">
    <input
      type="text"
      v-model="query"
      :placeholder="placeholder"
      class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-yellow-500 outline-none"
      @input="onInput"
    />

    <!-- Lista suggerimenti -->
    <ul
      v-if="showSuggestions && suggestions.length"
      class="absolute w-full bg-gray-900 border border-gray-700 rounded mt-1 z-50 max-h-60 overflow-y-auto"
    >
      <li
        v-for="(player, index) in suggestions"
        :key="index"
        @click="selectPlayer(player)"
        class="px-3 py-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
      >
        {{ player.nome }} <span class="text-gray-400">({{ player.squadra }} - {{ player.ruolo }})</span>
      </li>
    </ul>

    <!-- Nessun risultato -->
    <div
      v-if="showSuggestions && !suggestions.length && query.length >= 2"
      class="absolute w-full bg-gray-900 border border-gray-700 rounded mt-1 z-50 p-2 text-gray-400 text-sm"
    >
      Nessun giocatore trovato
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: String,
  valoreIniziale: String,
  role: String
})

const emit = defineEmits(['select'])

const query = ref(props.valoreIniziale || '')
const suggestions = ref([])
const showSuggestions = ref(false)
let debounceTimeout = null

function onInput() {
  clearTimeout(debounceTimeout)
  if (query.value.trim().length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  debounceTimeout = setTimeout(searchPlayers, 400)
}

async function searchPlayers() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/search-player?query=${encodeURIComponent(query.value)}&role=${props.role || ''}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const data = await res.json()
    if (data.success) {
      suggestions.value = data.players || []
      showSuggestions.value = true
    } else {
      suggestions.value = []
      showSuggestions.value = true
    }
  } catch (err) {
    console.error('Errore ricerca giocatori:', err)
    suggestions.value = []
    showSuggestions.value = true
  }
}

function selectPlayer(player) {
  query.value = player.nome
  showSuggestions.value = false
  emit('select', player)
}
</script>

<style scoped>
/* Scrollbar sottile */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}
</style>
