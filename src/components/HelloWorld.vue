<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);

const originalObj = { a: 3 };
const testObj = ref(originalObj);
</script>

<template>
  <h1>{{ "Prop goes here" }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>testObj: {{ testObj }}</p>
  </div>

  <table>
    <th>
      <tr>
        3
      </tr>
      <tr>
        34
      </tr>
      <tr>
        34
      </tr>
    </th>
  </table>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
