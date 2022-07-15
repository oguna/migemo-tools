<template>
  辞書を閲覧します。
  <br />
  <input type="text" v-model="query" />
  <button data-test="search" @click="start">検索</button>
  <button data-test="reverse-search" @click="reverseSearch">逆引き</button>
  <br />
  {{ hits }}件の一致した単語が見つかりました<br />
  {{ result }}
  <br />
  {{ b.length }}件の前方一致した見出し語が見つかりました。
  <br />
  <span v-for="e, i in b" :key="e">{{ e }}[{{ c[i] }}]&nbsp;</span>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { Migemo, CompactDictionary } from 'jsmigemo'
import { useMainStore } from '../store'
import { mapState, mapStores } from 'pinia'

export default defineComponent({
  data() {
    return {
      query: "けんさく",
      result: "",
      migemo: null as null | Migemo,
      hits: 0,
      b: [] as string[],
      c: [] as number[]
    }
  },
  computed: {
    ...mapStores(useMainStore, ["dict"]),
  },
  methods: {
    start() {
      const dict = this.mainStore.dict as CompactDictionary
      const a = []
      for (const e of dict.search(this.query)) {
        a.push(e)
      }
      const b = []
      const c = []
      const keyIndex = dict.keyTrie.lookup(this.query)
      if (keyIndex > 1) {
        for (const i of dict.keyTrie.predictiveSearch(keyIndex)) {
          if (dict.hasMappingBitList.get(i)) {
            const valueStartPos = dict.mappingBitVector.select(i, false);
            const valueEndPos = dict.mappingBitVector.nextClearBit(valueStartPos + 1);
            const size = valueEndPos - valueStartPos - 1;
            b.push(dict.keyTrie.reverseLookup(i))
            c.push(size)
          }
        }
      }
      this.result = a.join(", ")
      this.hits = a.length
      this.b = b
      this.c = c
    },
    reverseSearch() {
      const dict = this.mainStore.dict as CompactDictionary
      const valueIndex = dict.valueTrie.lookup(this.query)
      const keys = []
      if (valueIndex > 1) {
        for (let i = 0; i < dict.mapping.length; i++) {
          if (dict.mapping[i] === valueIndex) {
            const startPos = dict.mappingBitVector.select(i + 1, true)
            const keyIndex = dict.mappingBitVector.rank(startPos + 1, false)
            const key = dict.keyTrie.reverseLookup(keyIndex)
            keys.push(key)
          }
        }
      }
      this.result = keys.length + "件の見出し語が見つかりました。" + keys.join(', ')
      this.hits = 0
      this.b = []
      this.c = []
    }
  },
})
</script>