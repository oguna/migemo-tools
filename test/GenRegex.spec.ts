import { mount } from '@vue/test-utils'
import GenRegex from '../src/views/GenRegex.vue'
import { test, expect } from 'vitest'

test('初期表示', async () => {
  const wrapper = mount(GenRegex, {})
  await wrapper.get("button").trigger("click")
  expect(wrapper.text()).toContain("(い|あい[うえ])")
})
