<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const API = "https://fantacoach-backend.onrender.com";
const loading = ref<"none" | "monthly" | "lifetime">("none");

function getToken(): string | null {
  return localStorage.getItem("token");
}

function isStandalonePWA(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    (window.navigator as any).standalone === true
  );
}

async function goToStripe(path: "/api/checkout/monthly" | "/api/checkout/lifetime") {
  const token = getToken();
  if (!token) {
    alert("Devi effettuare l'accesso per procedere all'acquisto.");
    return;
  }
  try {
    const { data } = await axios.post(
      `${API}${path}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!data?.url) {
      throw new Error("URL di checkout non ricevuto dal server.");
    }

    if (isStandalonePWA()) {
      window.location.href = data.url;
    } else {
      window.location.assign(data.url);
    }
  } catch (err: any) {
    console.error("Checkout error:", err);
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.errore ||
      err?.message ||
      "Errore di connessione durante il checkout.";
    alert(msg);
  } finally {
    loading.value = "none";
  }
}

async function goMonthly() {
  if (loading.value !== "none") return;
  loading.value = "monthly";
  await goToStripe("/api/checkout/monthly");
}

async function goLifetime() {
  if (loading.value !== "none") return;
  loading.value = "lifetime";
  await goToStripe("/api/checkout/lifetime");
}
</script>

<template>
  <div class="premium">
    <h1>Diventa Premium</h1>
    <p>Sblocca tutte le funzionalità di FantaCoach AI senza limiti 🚀</p>

    <div class="premium-actions">
      <button class="btn" :disabled="loading !== 'none'" @click="goMonthly">
        {{ loading === 'monthly' ? 'Reindirizzamento...' : 'Abbonati mensile (1,99€)' }}
      </button>

      <button class="btn" :disabled="loading !== 'none'" @click="goLifetime">
        {{ loading === 'lifetime' ? 'Reindirizzamento...' : 'Premium a vita (4,99€)' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.premium {
  text-align: center;
  padding: 2rem;
}
.premium-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.btn {
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #ffd700;
  color: #111;
  transition: 0.2s;
}
.btn:hover:not([disabled]) {
  background: #ffcc00;
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
