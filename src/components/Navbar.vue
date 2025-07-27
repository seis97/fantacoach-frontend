<template>
  <nav class="w-full flex justify-end items-center p-4 gap-4 bg-gray-900 text-white shadow-md">
    <span
      v-if="isPremium"
      class="bg-yellow-400 text-green-900 px-2 py-1 rounded-lg text-sm"
    >
      ✨ Premium
    </span>

    <template v-if="isLoggedIn">
      <button
        @click="logout"
        class="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
      >
        🔓 Logout
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const isPremium = ref(false)

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token')
  isPremium.value = localStorage.getItem('premium') === 'true'
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('premium')
  isLoggedIn.value = false
  isPremium.value = false
  router.push('/login')
}
</script>

