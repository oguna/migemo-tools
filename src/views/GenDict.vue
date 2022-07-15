<template>
  辞書を生成します。
  <p>
    「見出し」に続いて空白の後、「単語」を1行で入力して下さい。
    1つの見出しに複数の単語がある場合、単語同士を空白で区切って下さい。
    1行につき1見出しを入力して下さい。
  </p>
  <br />
  <textarea v-model="query" rows="10" style="width: 100%"></textarea>
  <br />
  <button data-test="start" @click="start">生成</button>
  <button data-test="download" @click="download">ダウンロード</button>
  <br />
  {{ result }}
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { CompactDictionaryBuilder, Migemo } from 'jsmigemo'

export default defineComponent({
  data() {
    return {
      query: `あいちけん 愛知県
あおもりけん 青森県
あきたけん 秋田県
いしかわけん 石川県
いばらきけん 茨城県
いわてけん 岩手県
えひめけん 愛媛県
おおいたけん 大分県
おおさかふ 大阪府
おかやまけん 岡山県
おきなわけん 沖縄県`,
      result: "",
      migemo: null as null | Migemo,
      generatedDict: null as null | ArrayBuffer
    }
  },
  methods: {
    start() {
      const lines = this.query.split('\n')
      const dict = new Map<string, string[]>()
      let num_words = 0
      for (const line of lines) {
        const columns = line.split(/\s+/)
        const key = columns[0].trim()
        const values = columns.slice(1)
        num_words += values.length
        dict.set(key, values)
      }
      const ab = CompactDictionaryBuilder.build(dict)
      this.result = "ファイルサイズ: " + ab.byteLength + "bytes"
      this.result += "\n見出し数: " + dict.size
      this.result += "\n単語数: " + num_words
      this.generatedDict = ab
    },
    download() {
      const blob = new Blob([this.generatedDict!], { "type": "application/octet-stream" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = 'migemo-compact-dict'
      a.href = url
      a.target = "_blank"
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }
  }
})
</script>