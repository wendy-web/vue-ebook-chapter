<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  var fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
</script>

<style lang="scss" scope>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #333;
}
</style>
