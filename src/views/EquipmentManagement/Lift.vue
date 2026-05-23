<template>
  <div class="main">
    <div class="main-left width-170" style="overflow: hidden; overflow-y: auto;">
      <SideNav />
    </div>
    <div class="main-center other2">
      <Box></Box>
    </div>
    <div class="main-right width-520">
      <Box></Box>
      <Box style="flex: 2.9;"></Box>
    </div>
  </div>
</template>

<script>
import SideNav from './SideNav.vue';
import Box from '@/components/box.vue'
export default {
  components: {
    Box,
    SideNav
  },
  name: 'Lift',
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>