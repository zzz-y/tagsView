<template>
  <el-aside width="4rem" class="sidebar">
    <router-link v-for="route in permission_routes"
                 :key="route.path" :to="route.path">
      {{route.name}}
    </router-link>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'sidebar',
  created () {
    this.$store.dispatch('permission/generateRoutes', ['admin'])
  },
  computed: {
    ...mapGetters([
      'permission_routes'
    ]),
  }
}
</script>

<style scoped>

</style>
