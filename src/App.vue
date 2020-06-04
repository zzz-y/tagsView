<template>
  <el-container id="app">
    <navbar/>
    <el-main class="container">
      <sidebar/>
      <el-main class="main">
        <tags-view/>
        <router-view/>
      </el-main>
    </el-main>
  </el-container>
</template>

<script>
import Navbar from './layout/Navbar'
import Sidebar from './layout/Sidebar'
import tagsView from './layout/TagsView'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    tagsView
  },
  computed: {},
  methods: {}
}
</script>

