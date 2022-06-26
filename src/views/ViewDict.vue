<template>
辞書を閲覧します。
<br />
<input type="text" v-model="query" />
<button @click="start">検索</button>
<button @click="reverseSearch">逆引き</button>
<br />
{{hits}}件の一致した単語が見つかりました<br />
{{result}}
<br />
{{b.length}}件の前方一致した見出し語が見つかりました。
<br />
<span v-for="e,i in b" :key="e">{{e}}[{{c[i]}}]&nbsp;</span>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { Migemo, CompactDictionary } from 'jsmigemo'

export default defineComponent({
  data () {
    return {
        query: "けんさく",
        result: "",
        migemo: null as null|Migemo,
        hits: 0,
        b: [] as string[],
        c: [] as number[]
    }
  },
  mounted() {
    fetch('migemo-compact-dict')
    .then(e => e.arrayBuffer())
    .then(e => {
        const dict = new CompactDictionary(e)
        const migemo = new Migemo()
        migemo.setDict(dict)
        this.migemo = markRaw(migemo)
    })
  },
  methods: {
    start() {
      if (this.migemo === null) {
        this.result = "辞書を読み込み中です"
        this.hits = 0
        return
      }
      const a = []
      for (const e of this.migemo.dict!.search(this.query)) {
          a.push(e)
      }
      const b = []
      const c = []
      const keyIndex = this.migemo.dict!.keyTrie.lookup(this.query)
      if (keyIndex > 1) {
        for (const i of this.migemo.dict!.keyTrie.predictiveSearch(keyIndex)) {
          if (this.migemo.dict!.hasMappingBitList.get(i)) {
            const valueStartPos = this.migemo.dict!.mappingBitVector.select(i, false);
            const valueEndPos = this.migemo.dict!.mappingBitVector.nextClearBit(valueStartPos + 1);
            const size = valueEndPos - valueStartPos - 1;
            b.push(this.migemo.dict!.keyTrie.reverseLookup(i))
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
      if (this.migemo === null) {
        return
      }
      const valueIndex = this.migemo.dict!.valueTrie.lookup(this.query)
      const keys = []
      if (valueIndex > 1) {
        for (let i = 0; i<this.migemo.dict!.mapping.length; i++) {
          if (this.migemo.dict!.mapping[i]===valueIndex) {
            const startPos = this.migemo.dict!.mappingBitVector.select(i+1, true)
            const keyIndex = this.migemo.dict!.mappingBitVector.rank(startPos+1, false)
            const key = this.migemo.dict!.keyTrie.reverseLookup(keyIndex)
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