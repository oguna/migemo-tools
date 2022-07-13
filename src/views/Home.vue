<template>
  Migemoの実行に便利なツールをウェブ上で提供します。
  任意の辞書をアップロードしてMigemo検索を試せます。
  <br />
  <input type="file" @change="onChange" />
  <br />
  Migemo検索おためし
  <input data-test="query" type="text" v-model="query" />
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
      query: "",
      result: "loading..",
      migemo: null as null | Migemo,
    }
  },
  mounted() {
    this.migemo = new Migemo()
    this.result = ""
  },
  computed: {
    ...mapStores(useMainStore, ["dict"]),
  },
  watch: {
    query(e) {
      this.migemo?.setDict(this.mainStore.dict as CompactDictionary)
      if (this.migemo) {
        const regex = this.migemo.query(this.query)
        this.result = regex
      }
    }
  },
  methods: {
    onChange(event: Event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      if (files.length !== 1) {
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const dict = new CompactDictionary(reader.result as ArrayBuffer)
        this.migemo?.setDict(dict)
      }
      reader.readAsArrayBuffer(files[0])
    }
  }
})
</script>