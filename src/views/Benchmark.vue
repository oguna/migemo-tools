<template>
  検索時間を確認します。
  <p>
    繰り返し回数を調整して、処理時間の合計が10ms以上になるようにして下さい。
  </p>
  <br />
  検索ワード<input type="text" v-model="query" />
  <br />
  繰り返し回数<input type="number" v-model="repeat" />
  <br />
  <button data-test="start" @click="start">開始</button>
  <br />
  {{ result }}
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { Migemo, CompactDictionary } from 'jsmigemo'
import { useMainStore } from '../store'
import { mapState, mapStores } from 'pinia'

export default defineComponent({
  data() {
    return {
      query: "kensaku",
      result: "",
      repeat: 10,
    }
  },
  computed: {
    ...mapStores(useMainStore, ["dict"]),
  },
  mounted() {
  },
  methods: {
    start() {
      const migemo = new Migemo()
      migemo.setDict(this.mainStore.dict as CompactDictionary)
      const start = performance.now()
      for (let i = 0; i < this.repeat; i++) {
        const _ = migemo.query(this.query)
      }
      const end = performance.now()
      this.result = String(this.repeat) + "回で " + String(end - start) + " [ms]\n" + "1回あたり " + String((end - start) / this.repeat) + " [ms]"
    }
  },
})
</script>