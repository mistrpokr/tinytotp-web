<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import Account from "@/others/Account";

const ACCOUNTS_NUM = 10;
/* Data */
const connectStatus = ref(false);

const accounts = reactive({ value: [] });
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
  return Math.floor(accounts.value.length / entriesPerPage.value);
});

/* Methods */
function toggleConnectionStatus() {
  connectStatus.value = !connectStatus.value;
}
function downloadToDevice() {
  console.log("Downloading data to tinyTOTP device...");
}
function pageAccounts(page) {
  return accounts.value.slice(
    page * entriesPerPage.value,
    (page + 1) * entriesPerPage.value
  );
}
function keyDisplayString(account) {
  if (!account.showKey) {
    return "Hidden";
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
    accounts.value.push(
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
  <div class="q-ma-md">
    <!-- Device Interactions -->
    <div class="row q-my-xs">
      <q-card bordered class="fit">
        <q-card-section>
          <h6>Overview</h6>
          <b>Disconnected</b>
          <br />
          <q-btn> Connect </q-btn>
        </q-card-section>
      </q-card>
    </div>
    <!-- TOTP Service Cards -->
    <div class="row q-my-xs q-col-gutter-x-md q-col-gutter-y-lg">
      <div class="col-6" v-for="a in pageAccounts(page)" :key="a.id">
        <q-card bordered class="fit card-wrapped">
          <q-card-section>
            <div class="text-h6">{{ a.service }}</div>
            <!-- <div class="text-subtitle2">by John Doe</div> -->
          </q-card-section>

          <q-separator inset />

          <q-card-section>
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
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
</style>
