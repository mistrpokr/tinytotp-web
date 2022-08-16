<script setup>
import { ref, computed, reactive, onMounted } from "vue";

/* Data */
const connectStatus = ref(false);
const displayKeyStatus = ref(false);

const accounts = reactive([]);

/* Computed */
const connectStatusString = computed(() =>
  connectStatus.value ? "Disconnected" : "Connected"
);
const connectCmdString = computed(() =>
  connectStatus.value ? "Disconnect" : "Connect"
);
const keyDisplayString = computed(() => {
  if (!displayKeyStatus) {
    return;
  }
});

onMounted(() => {
  console.log("Starting Application");

  for (let _ = 0; _ < 3; _++) {
    accounts.push({
      id: _,
      service: `Service #${Math.floor(Math.random())}`,
      key: `${btoa(Math.random())}`,
    });
  }

  console.log(accounts);
});

/* Methods */
function toggleConnectionStatus() {
  connectStatus.value = !connectStatus.value;
}
function downloadToDevice() {
  console.log("Downloading data to tinyTOTP device...");
}
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
      <div class="card-header">Account</div>
      <hr />
      <div class="card-body">
        <div>
          Key:
          <a href="#"> ***** </a>
        </div>
        <div>Code: *****</div>
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
