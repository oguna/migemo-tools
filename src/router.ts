import {createRouter, createWebHashHistory} from 'vue-router'

import Home from './views/Home.vue'
import GenDict from './views/GenDict.vue'
import ViewDict from './views/ViewDict.vue'
import OptDict from './views/OptDict.vue'
import Benchmark from './views/Benchmark.vue'
import GenRegex from './views/GenRegex.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
    { path: '/', component: Home},
    { path: '/gen-dict', component: GenDict},
    { path: '/view-dict', component: ViewDict},
    { path: '/opt-dict', component: OptDict},
    { path: '/benchmark', component: Benchmark},
    { path: '/gen-regex', component: GenRegex},
    ]
})

export default router