<template>
  <div id="app">
    <div class="demo">
      <div class="app-main">
        <ul class="img-list">
          <li
            v-for="(item, index) in topItem"
            :ref="`canvas${index}`"
            :key="JSON.stringify(item) + index"
            :style="{ backgroundColor: item.bg }"
            group="gpt"
            :left="item.left"
            :top="item.top"
            :sel="item.sel"
            :check="item.check"
            class="list-item"
            @touchstart.stop.prevent="onStart"
          >
            <canvas class="img-canvas" width="100%" height="100%"></canvas>
          </li>
        </ul>
        <ul class="txt-list">
          <li
            v-for="(item, index) in bItem"
            :key="JSON.stringify(item) + index"
            :ref="`b${index}`"
            group="gpb"
            :left="item.left"
            :top="item.top"
            :sel="item.sel"
            :check="item.check"
            class="list-item"
          >
            <p class="txt">{{ item.text }}</p>
          </li>
        </ul>
        <!-- -->
        <canvas class="canvas"></canvas>
        <canvas class="backcanvas"></canvas>
      </div>
    </div>
    <!-- <router-view/> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      topItem: [
        {
          bg: 'antiquewhite'
        },
        {
          bg: 'aqua'
        },
        {
          bg: 'cadetblue'
        },
        {
          bg: 'tan'
        }
      ],
      bItem: [
        {
          text: 'A.Nice to meet you, too'
        },
        {
          text: 'B.Nice to meet you, too'
        },
        {
          text: 'C.Nice to meet you, too'
        },
        {
          text: 'D.Nice to meet you, too'
        }
      ]
    }
  },
  mounted() {
    this.setAttr()
  },
  methods: {
    setAttr(): void {
      this.topItem.forEach((item, index) => {
        const liArr: HTMLElement[] = this.$refs[
          `canvas${index}`
        ] as HTMLElement[]
        const li = liArr[0]
        this.$set(item, 'left', li.offsetLeft + li.offsetWidth / 2)
        this.$set(item, 'top', li.offsetTop + li.offsetHeight)
        this.$set(item, 'sel', 0)
        this.$set(item, 'check', 0)
      })
      this.bItem.forEach((item, index) => {
        const liArr: HTMLElement[] = this.$refs[`b${index}`] as HTMLElement[]
        const li = liArr[0]
        this.$set(item, 'left', li.offsetLeft + li.offsetWidth / 2)
        this.$set(item, 'top', li.offsetTop)
        this.$set(item, 'sel', 0)
        this.$set(item, 'check', 0)
      })
    },
    onStart(e: TouchEvent): void {
      console.log('e: ', e)
    }
  }
})
</script>
<style lang="scss">
.app-main {
  position: relative;
}
.app-main ul {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-main ul li {
  flex: 1;
  margin: 0 5px;
  height: 100px;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-main ul.txt-list {
  margin-top: 50px;
}
.app-main ul.txt-list li {
  white-space: pre-wrap;
  background-color: #f0f0f0;
  padding: 10px;
}
.app-main ul.txt-list li .txt {
  line-height: 30px;
  font-size: 16px;
  color: #666;
  display: block;
}
.app-main .frontCanvas,
.app-main .backCanvas {
  position: absolute;
  left: 0;
  top: 0;
}
.app-main .frontCanvas {
  z-index: -1;
}
.app-main .backCanvas {
  z-index: -2;
}
</style>
