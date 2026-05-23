<template>
     <div class="sideBar">
        <div v-for="(item, index) in sidebarItems" :key="index" 
             class="sideBar-list" 
             :class="{ cur: item.active }" 
             @click="handleSidebarClick(item)">
          <div class="icon" :class="item.iconClass"></div>
          <p>{{ item.name }}</p>
        </div>
      </div>
 </template>
 <script>
 export default {
   data() {
     return {
       sidebarItems: [
         { name: '总览', iconClass: '', active: true, path: '/equipment' },
         { name: '塔吊', iconClass: 'icon1', active: false, path: '/equipment/tower-crane' },
         { name: '升降机', iconClass: 'icon2', active: false, path: '/equipment/lift' },
         { name: '塔吊可视化', iconClass: 'icon3', active: false, path: '/equipment/visualization' },
         { name: '深基坑', iconClass: 'icon4', active: false, path: '/equipment/foundation' },
         { name: '图标5', iconClass: 'icon5', active: false, path: '/equipment/icon5' },
         { name: '图标6', iconClass: 'icon6', active: false, path: '/equipment/icon6' },
         { name: '图标7', iconClass: 'icon7', active: false, path: '/equipment/icon7' },
         { name: '图标8', iconClass: 'icon8', active: false, path: '/equipment/icon8' },
         { name: '图标9', iconClass: 'icon9', active: false, path: '/equipment/icon9' },
         { name: '图标10', iconClass: 'icon10', active: false, path: '/equipment/icon10' },
         { name: '图标11', iconClass: 'icon11', active: false, path: '/equipment/icon11' },
         { name: '图标12', iconClass: 'icon12', active: false, path: '/equipment/icon12' }
       ],      
     }
   },
   watch: {
     '$route': {
       immediate: true,
       handler(to) {
         this.updateActiveItem(to.path);
       }
     }
   },
   methods: {
     updateActiveItem(path) {
       this.sidebarItems.forEach(item => {
         item.active = item.path === path;
       });
     },
     handleSidebarClick(clickedItem) {
        if (this.$route.path !== clickedItem.path) {
          this.$router.push(clickedItem.path);
        }
        this.sidebarItems.forEach(item => {
          item.active = item === clickedItem;
        });
      }
   }
 }
 </script>
 