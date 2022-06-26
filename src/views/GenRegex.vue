<template>
テキストエリアに入力した単語の一覧に一致する正規表現を生成します。
<br />
<textarea v-model="query" rows="10" style="width: 100%"></textarea>
<br />
<button @click="start">生成</button>
<br />
{{result}}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TernaryRegexGenerator } from 'jsmigemo'

export default defineComponent({
  data () {
    return {
        query: "あいう\nあいえ\nい",
        result: "",
    }
  },
  methods: {
    start() {
      const regexgen = new TernaryRegexGenerator("|", "(", ")", "[", "]", "")
      const lines = this.query.split("\n")
      for (const line of lines) {
        regexgen.add(line.trim())
      }
      this.result = regexgen.generate()
    }
  }
})
</script>