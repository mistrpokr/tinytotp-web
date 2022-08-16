<script setup>
import { ref, computed, reactive, onMounted } from "vue";

/* Data */
const connectStatus = ref(false);
const displayKeyStatus = ref(false);

const accounts = reactive([]);
const totpSeed = ref(0);

/* Computed */
const connectStatusString = computed(() =>
  connectStatus.value ? "Disconnected" : "Connected"
);
const connectCmdString = computed(() =>
  connectStatus.value ? "Disconnect" : "Connect"
);

/* Methods */
function toggleConnectionStatus() {
  connectStatus.value = !connectStatus.value;
}
function downloadToDevice() {
  console.log("Downloading data to tinyTOTP device...");
}
function toggleDisplayKeyStatus() {
  displayKeyStatus.value = !displayKeyStatus.value;
}
function keyDisplayString(account) {
  if (!displayKeyStatus.value) {
    return "*****";
  } else {
    return account.key;
  }
}
function fakeTOTP(key) {
  let code = Math.floor(Math.random() * 1000000);
  return ("000000" + code + "0").slice(-7, -1);
}

/* Lifecycle Hooks */
onMounted(() => {
  console.log("Starting Application");

  let timer = setInterval(() => {
    totpSeed.value += 1;
  }, 1000);

  for (let _ = 0; _ < 3; _++) {
    accounts.push({
      id: _,
      service: `Service #${_}`,
      key: `${btoa(Math.random()).slice(-8, -1)}`,
    });
  }
});
</script>

<template>
  <div>
    <h1>tinyTOTP</h1>

    <div class="card">
      <h3>
        Device status:
        <b>{{ connectStatusString }}</b>
      </h3>

      <button @click="toggleConnectionStatus">
        {{ connectCmdString }}
      </button>
      <button @click="downloadToDevice">Download</button>
    </div>

    <div class="card" v-for="a in accounts" :key="a.id">
      <div class="card-header">{{ a.service }}</div>
      <hr />
      <div class="card-body">
        <div>
          Key:
          <a href="#!" @click="toggleDisplayKeyStatus">
            {{ keyDisplayString(a) }}
          </a>
        </div>
        <div>
          Code:
          {{ fakeTOTP(totpSeed) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  color: bisque;
}

button {
  margin: 0 10px;
}

hr {
  border-top: 3px solid #bbb;
  border-radius: 5px;
  // width: 120%;
}
.card {
  background-color: darkslategray;
  border-radius: 10px;
  margin: 20px 0;
}

.card-header {
  font-weight: bolder;
  font-size: larger;
}
</style>
