<template>
    <bm-overlay
        ref="customOverlay"
        :class="{sample: true, active}"
        pane="labelPane"
        @draw="draw">
        <div v-text="text" @click="handleClick"></div>
    </bm-overlay>
</template>

<script>
import {BmOverlay} from 'vue-baidu-map'
export default {
   components: {
       BmOverlay
   },
   props: ['text', 'position', 'active'],
   watch: {
        position: {
            handler () {
                this.$refs.customOverlay.reload()
            },
            deep: true
        }
   },
   methods: {
        handleClick () {
            global.alert('Well done.')
        },
        draw ({el, BMap, map}) {
            const {lng, lat} = this.position
            const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
            el.style.left = pixel.x + 'px'
            el.style.top = pixel.y + 'px'
        }
   }
}
</script>

<style lang="stylus" scoped>
.sample {
  width: 120px;
  height: 40px;
  line-height: 40px;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  color: #fff;
  text-align: center;
  position: absolute;
  &.active {
    background: rgba(0,0,0,0.75);
    color: #fff; 
  }
}
</style>
