<template>
  <div id="app">
    <navbar/>
    <div class="container">
      <sidebar/>
      <router-view/>
    </div>
  </div>
</template>

<script>
  import Navbar from './layout/Navbar'
  import Sidebar from './layout/Sidebar'

  export default {
    name: 'Layout',
    components: {
      Navbar,
      Sidebar
    },
    computed: {},
    methods: {}
  }
</script>

