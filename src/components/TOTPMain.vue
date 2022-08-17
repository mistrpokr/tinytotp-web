<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import Account from "@/others/Account.js";

const ACCOUNTS_NUM = 10;
/* Data */
const connectStatus = ref(false);

const accounts = reactive([]);
const page = ref(0);
const entriesPerPage = ref(3);
const totpSeed = ref(0);

/* Computed */
const connectStatusString = computed(() =>
  connectStatus.value ? "Disconnected" : "Connected"
);
const connectCmdString = computed(() =>
  connectStatus.value ? "Disconnect" : "Connect"
);
const pageCount = computed(() => {
  return Math.floor(accounts.length / entriesPerPage.value);
});

/* Methods */
function toggleConnectionStatus() {
  connectStatus.value = !connectStatus.value;
}
function downloadToDevice() {
  console.log("Downloading data to tinyTOTP device...");
}
function pageAccounts(page) {
  return this.accounts.slice(
    page * entriesPerPage.value,
    (page + 1) * entriesPerPage.value
  );
}
function keyDisplayString(account) {
  if (!account.showKey) {
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
    totpSeed.value += 5;
  }, 5000);

  // Create some dummy accounts
  for (let _ = 0; _ < ACCOUNTS_NUM; _++) {
    accounts.push(
      new Account(
        _,
        `Service #${_}`,
        `${btoa(Math.random()).slice(-8, -1)}`,
        false
      )
    );
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
      <div>
        <button @click="page = page === 0 ? 0 : page - 1">Previous Page</button>
        <button @click="page = page >= pageCount ? pageCount : page + 1">
          Next Page ({{ page + 1 }} of {{ pageCount + 1 }})
        </button>
      </div>
    </div>

    <div class="card" v-for="a in pageAccounts(page)" :key="a.id">
      <div class="card-header">{{ a.service }}</div>
      <hr />
      <div class="card-body">
        <div>
          Key:
          <a href="#!" @click="a.toggleShowKey()">
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
  margin: 4px 10px;
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
