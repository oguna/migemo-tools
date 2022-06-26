<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<header>
  <h1>
  Migemo Tools
  </h1>
  <div>
  <ul class="nav">
    <li><router-link to="/">ホーム</router-link></li>
    <li><router-link to="gen-dict">辞書の生成</router-link></li>
    <li><router-link to="view-dict">辞書の閲覧</router-link></li>
    <li><router-link to="opt-dict">辞書の最適化</router-link></li>
    <li><router-link to="benchmark">検索時間計測</router-link></li>
    <li><router-link to="gen-regex">正規表現の生成</router-link></li>
  </ul>
</div>
</header>
<main>
  <router-view></router-view>
</main>
</template>

<style>
.nav {
  display: inline-flex;
  list-style: none;
  padding: 0;
}
.nav li {
  padding-left: 0.5em;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
