<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <Navbar />

    <main class="px-4 md:px-8 py-10">
      <slot /> <!-- Qui va il contenuto della pagina -->
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
</script>
