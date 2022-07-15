import { mount } from '@vue/test-utils'
import Benchmark from '../src/views/Benchmark.vue'
import { test, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useMainStore } from '../src/store'
import { CompactDictionary } from 'jsmigemo'
import fs from 'fs'

test('初期表示', async () => {
  const wrapper = mount(Benchmark, {
    global: {
      plugins: [createTestingPinia()],
    },
  })
  const store = useMainStore()
  store.dict = new CompactDictionary(fs.readFileSync('public/migemo-compact-dict').buffer)
  await wrapper.get("[data-test='start']").trigger("click")
  expect(wrapper.text()).toContain('1回あたり')
})
