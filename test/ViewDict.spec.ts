import { mount } from '@vue/test-utils'
import ViewDict from '../src/views/ViewDict.vue'
import { test, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useMainStore } from '../src/store'
import { CompactDictionary } from 'jsmigemo'
import fs from 'fs'

test('初期表示', async () => {
  const wrapper = mount(ViewDict, {
    global: {
      plugins: [createTestingPinia()],
    },
  })
  const store = useMainStore()
  store.dict = new CompactDictionary(fs.readFileSync('public/migemo-compact-dict').buffer)
  await wrapper.get("[data-test='search']").trigger("click")
  expect(wrapper.text()).toContain("検索")
  await wrapper.get("input").setValue("検索")
  await wrapper.get("[data-test='reverse-search']").trigger("click")
  expect(wrapper.text()).toContain("けんさく")
})
