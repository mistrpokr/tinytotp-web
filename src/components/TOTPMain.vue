<script setup>
/*
 * The majority of WebSerial code are taken from this detailed tutorial:
 * https://web.dev/serial/
 *
 */

import { ref, computed, reactive, onMounted } from "vue";
import Account from "@/others/Account";

const ACCOUNTS_NUM = 10;
let port = undefined;
let reader,
  writer,
  textDecoder,
  textEncoder,
  readableStreamClosed,
  writableStreamClosed;
let portPromise;
let keepReading = false;

/* Data */
const connectStatus = ref(false);

const accounts = reactive({ value: [] });
const page = ref(0);
const entriesPerPage = ref(3);
const totpSeed = ref(0);
const totpSecondsLeft = ref(0);

/* Computed */
const connectStatusString = computed(() =>
  connectStatus.value ? "Connected" : "Disconnected"
);
const connectCmdString = computed(() =>
  connectStatus.value ? "Disconnect" : "Connect"
);
const pageCount = computed(() => {
  return Math.floor(accounts.value.length / entriesPerPage.value);
});
const totpStepProgress = computed(() => {
  return totpSecondsLeft.value / 30;
});

/* Methods */
function editConnection() {
  if (connectStatus.value == false) {
    /* Connect */
    portPromise = connectAndListen();
  } else {
    /* Disconnect */
    disconnect();
  }
  connectStatus.value = !connectStatus.value;
}

async function connectAndListen() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });

  textDecoder = new TextDecoderStream();
  readableStreamClosed = port.readable.pipeTo(textDecoder.writable);

  reader = textDecoder.readable.getReader();

  keepReading = true;
  while (port.readable && keepReading) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // reader.cancel() has been called.
          break;
        }
        // value is a Uint8Array.
        console.log(value);
      }
    } catch (error) {
      // Handle error...
    } finally {
      // Allow the serial port to be closed later.
      console.log("Releasing lock");
      reader.releaseLock();
    }
  }
}

async function disconnect() {
  console.log("Stop reading...");
  keepReading = false;

  reader.cancel();
  await readableStreamClosed.catch(() => {
    /* Error */
  });
  writer.close();
  await writableStreamClosed;

  await port.close();
}

async function downloadToDevice() {
  console.log("Downloading data to tinyTOTP device...");

  textEncoder = new TextEncoderStream();
  writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

  writer = textEncoder.writable.getWriter();

  let payload = `?time=${Math.floor(
    Date.now() / 1000
  )}&service=GitHub,hello&service=Weibo,1234;\n`;

  await writer.write(payload);
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

  // Start timer
  let timer = setInterval(() => {
    totpSeed.value += 1;
    totpSecondsLeft.value = Math.floor(Date.now() / 1000) % 30;
    // console.log(totpSecondsLeft.value);
  }, 1000);
});
</script>

<template>
  <div class="q-ma-md">
    <!-- Device Interactions -->
    <div class="row q-my-xs">
      <q-card bordered class="fit">
        <q-card-section>
          <h6>Overview</h6>
          <b>Status: {{ connectStatusString }}</b>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="q-gutter-sm">
            <q-btn color="primary" @click="editConnection">
              {{ connectCmdString }}
            </q-btn>
            <q-btn color="secondary" @click="downloadToDevice">Download</q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row">
      <q-linear-progress
        :value="totpStepProgress"
        :animation-speed="0"
        class="q-mt-md"
      />
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
