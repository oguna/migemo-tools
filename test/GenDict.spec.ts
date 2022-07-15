import { mount } from '@vue/test-utils'
import GenDict from '../src/views/GenDict.vue'
import { test, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useMainStore } from '../src/store'
import { CompactDictionary } from 'jsmigemo'
import fs from 'fs'

test('初期表示', async () => {
  const wrapper = mount(GenDict, {
    global: {
      plugins: [createTestingPinia()],
    },
  })
  const store = useMainStore()
  store.dict = new CompactDictionary(fs.readFileSync('public/migemo-compact-dict').buffer)
  await wrapper.get("[data-test='start']").trigger("click")
  expect(wrapper.text()).toContain("ファイルサイズ: 229bytes")
})
