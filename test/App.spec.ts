import { mount } from '@vue/test-utils'
import App from '../src/App.vue'
import { test, expect } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

test('初期表示', async () => {
  const wrapper = mount(App, {
    global: {
      plugins: [createTestingPinia()],
    },
  })
  expect(wrapper.text()).toContain("Migemo Tools")
})
