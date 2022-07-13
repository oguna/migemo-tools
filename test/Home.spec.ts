import { mount } from '@vue/test-utils'
import Home from '../src/views/Home.vue'
import { test, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useMainStore } from '../src/store'
import { CompactDictionary } from 'jsmigemo'
import fs from 'fs'

test('初期表示', async () => {
  const wrapper = mount(Home, {
    global: {
      plugins: [createTestingPinia()],
    },
  })
  const store = useMainStore()
  store.dict = new CompactDictionary(fs.readFileSync('public/migemo-compact-dict').buffer)
  expect(wrapper.text()).toContain('Migemo検索を試せます')
  await wrapper.get("[data-test='query']").setValue("kensaku")
  expect(wrapper.text()).toContain("けんさく")
  expect(wrapper.text()).toContain("検索")
})
