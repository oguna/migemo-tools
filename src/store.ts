import { CompactDictionary } from 'jsmigemo'
import { defineStore } from 'pinia'
import { markRaw } from 'vue'

export const useMainStore = defineStore('main', {
    state: () => ({
        dict: null as null|CompactDictionary,
    }),
    actions: {
        loadDictionary() {
            fetch('migemo-compact-dict')
            .then(e => e.arrayBuffer())
            .then(e => this.dict = markRaw(new CompactDictionary(e)))
        }
    }
})