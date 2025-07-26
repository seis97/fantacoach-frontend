<template>
  <div class="flex flex-col min-h-screen bg-gray-950 text-white">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900">
      <div class="text-2xl font-bold text-white">📋 Anteprima Formazione</div>
      <router-link to="/dashboard" class="text-white hover:text-yellow-400">🔙 Torna alla Dashboard</router-link>
    </nav>

    <!-- Scelta Modulo -->
    <div class="flex justify-center my-4">
      <select v-model="modulo" class="bg-gray-800 text-white px-4 py-2 rounded border border-yellow-400">
        <option value="4-4-2">4-4-2</option>
        <option value="4-3-3">4-3-3</option>
        <option value="3-5-2">3-5-2</option>
      </select>
    </div>

    <!-- Campo + Panchinari -->
    <div class="flex flex-col md:flex-row px-6 gap-6">
      <!-- Campo da calcio -->
      <div class="relative w-full md:w-3/4 aspect-square bg-black rounded overflow-hidden">
        <img src="../assets/27_campo16colori.jpg" alt="Campo" class="w-full h-full object-cover" />

        <!-- Posizionamento giocatori -->
        <div
          v-for="(pos, index) in posizioniModulo[modulo]"
          :key="index"
          class="absolute bg-yellow-400 text-black font-bold text-xs text-center px-2 py-1 rounded-full border border-black shadow"
          :style="{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }"
        >
          {{ titolari[index] || '??' }}
        </div>
      </div>

      <!-- Panchinari -->
      <div class="w-full md:w-1/4 bg-gray-900 p-4 rounded border border-yellow-400">
        <h3 class="text-xl font-bold text-yellow-400 mb-4">🪑 Panchina</h3>
        <ul class="space-y-2">
          <li v-for="(player, idx) in panchinari" :key="idx" class="bg-gray-800 p-2 rounded text-sm">
            {{ player }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const modulo = ref('4-4-2')

// Esempio statico di formazione (titolari + panchina)
const titolari = [
  'Maignan', 'Theo H.', 'Bastoni', 'Scalvini', 'Di Lorenzo',
  'Chiesa', 'Barella', 'Frattesi', 'Zaccagni',
  'Immobile', 'Retegui'
]

const panchinari = [
  'Meret', 'Buongiorno', 'Locatelli', 'Pellegrini',
  'Berardi', 'Gnonto', 'Belotti'
]

// Posizioni top/left per ogni modulo
const posizioniModulo = {
  '4-4-2': [
    { top: '90%', left: '50%' }, // Portiere
    { top: '75%', left: '15%' }, { top: '75%', left: '35%' },
    { top: '75%', left: '65%' }, { top: '75%', left: '85%' }, // Difensori
    { top: '55%', left: '15%' }, { top: '55%', left: '35%' },
    { top: '55%', left: '65%' }, { top: '55%', left: '85%' }, // Centrocampisti
    { top: '30%', left: '35%' }, { top: '30%', left: '65%' }  // Attaccanti
  ],
  '4-3-3': [
    { top: '90%', left: '50%' },
    { top: '75%', left: '15%' }, { top: '75%', left: '35%' },
    { top: '75%', left: '65%' }, { top: '75%', left: '85%' },
    { top: '55%', left: '30%' }, { top: '55%', left: '50%' }, { top: '55%', left: '70%' },
    { top: '30%', left: '20%' }, { top: '30%', left: '50%' }, { top: '30%', left: '80%' }
  ],
  '3-5-2': [
    { top: '90%', left: '50%' },
    { top: '75%', left: '25%' }, { top: '75%', left: '50%' }, { top: '75%', left: '75%' },
    { top: '55%', left: '15%' }, { top: '55%', left: '35%' },
    { top: '55%', left: '50%' },
    { top: '55%', left: '65%' }, { top: '55%', left: '85%' },
    { top: '30%', left: '40%' }, { top: '30%', left: '60%' }
  ]
}
</script>

<style scoped>
.absolute {
  z-index: 10;
}
</style>
