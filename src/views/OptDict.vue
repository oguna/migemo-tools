<template>
検索対象の文章に含まれる単語のみを辞書に含めることで、辞書のサイズを小さくします。
<br />
<textarea v-model="text" rows="10" style="width: 100%"></textarea>
<br />
{{info}}
<button @click="start">生成</button>
<button @click="download">ダウンロード</button>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { Migemo, CompactDictionary, BitList, CompactDictionaryBuilder, LOUDSTrie } from 'jsmigemo'

export default defineComponent({
  data () {
    return {
        migemo: null as null|Migemo,
        text: "吾輩は猫である。名前はまだ無い。",
        words: [] as string[],
        keys: [] as string[],
        ab: null as null|ArrayBuffer,
        info: ""
    }
  },
  mounted() {
    fetch('/migemo-tools/migemo-compact-dict')
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
      if (this.migemo===null) {
        return
      }
      // 文章に含まれる単語IDを列挙
      const wordList = new BitList(this.migemo!.dict!.valueTrie.size()+1)
      for (let i=0; i<this.text.length; i++) {
        const prefixList = this.commonPrefixSearch(this.text.substring(i), this.migemo.dict!.valueTrie as any)
        for (const e of prefixList) {
          wordList.set(e, true)
        }
      }
      // 辞書に格納している単語IDを列挙
      const storedWordList = new BitList(this.migemo!.dict!.valueTrie.size()+1)
      for (const e of this.migemo!.dict!.mapping) {
        storedWordList.set(e, true)
      }
      // 文章に含まれる単語IDと辞書に格納している単語IDの重複を、列挙
      const newWordList = new BitList(this.migemo!.dict!.valueTrie.size()+1)
      for (let i=0; i<wordList.size; i++) {
        if (wordList.get(i) && storedWordList.get(i)) {
          newWordList.set(i, true)
        }
      }
      // 新しい辞書に格納する単語を文字列で列挙
      const newWordDict = new Map<number,string>()
      for (let i=0; i<newWordList.size; i++) {
        if (newWordList.get(i)) {
          const word = this.migemo!.dict!.valueTrie.reverseLookup(i)
          newWordDict.set(i, word)
        }
      }
      // 見出し語の単語リストを列挙
      const newDict = new Map<string, string[]>()
      for (let i=0; i<this.migemo.dict!.mapping.length; i++) {
        if (newWordList.get(this.migemo.dict!.mapping[i])) {
          const startPos = this.migemo.dict!.mappingBitVector.select(i+1, true)
          const keyIndex = this.migemo.dict!.mappingBitVector.rank(startPos+1, false)
          const key = this.migemo.dict!.keyTrie.reverseLookup(keyIndex)
          const value = newWordDict.get(this.migemo.dict!.mapping[i])!
          if (newDict.has(key)) {
            newDict.get(key)!.push(value)
          } else {
            newDict.set(key, [value])
          }
        }
      }
      // 辞書を生成
      const newCompactDict = CompactDictionaryBuilder.build(newDict)
      this.ab = newCompactDict
      this.info = `辞書サイズ: ${newCompactDict.byteLength}バイト`
    },
    commonPrefixSearch(key: string, trie: LOUDSTrie): number[] {
      const prefixList = []
      let nodeIndex = 1
      for (let i = 0; i < key.length; i++) {
        const c = key.charCodeAt(i)
        nodeIndex = trie.traverse(nodeIndex, c)
        if (nodeIndex == -1) {
            break
        }
        prefixList.push(nodeIndex)
      }
      return prefixList
    },
    download() {
      if (this.ab) {
        const blob = new Blob([this.ab], {"type": "application/octet-stream"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = 'migemo-compact-dict'
        a.href = url
        a.target = "_blank"
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      } else {
        window.alert("先に辞書を生成して下さい。")
      }
    }
  },
})
</script>