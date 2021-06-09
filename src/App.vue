<template>
  <div id="app">
    <div class="demo">
      <div class="app-main" ref="parent" @touchmove.prevent="onMove">
        <ul class="img-list" first="0">
          <li
            v-for="(item, index) in topItem"
            :ref="`canvas${index}`"
            :key="JSON.stringify(item) + index"
            :style="{ backgroundColor: item.bg }"
            group="gpt"
            left="0"
            top="0"
            sel="0"
            check="0"
            orderCheck="0"
            pair="0"
            class="list-item"
            @touchstart.prevent="onStart"
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
            left="0"
            top="0"
            sel="0"
            check="0"
            orderCheck="0"
            pair="0"
            class="list-item"
            @touchstart.prevent="onStart"
          >
            <p class="txt">{{ item.text }}</p>
          </li>
        </ul>
        <!-- -->
        <canvas class="canvas" ref="canvas"></canvas>
        <canvas class="backCanvas" ref="backCanvas"></canvas>
      </div>
    </div>
    <!-- <router-view/> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// interface Item {
//   bg?: string
//   text?: string
// }
export default Vue.extend({
  data() {
    return {
      canvas: null as unknown as HTMLCanvasElement,
      backCanvas: null as unknown as HTMLCanvasElement,
      isBegin: false,
      curStart: null as unknown as HTMLElement,
      startX: null as unknown,
      startY: null as unknown,
      midX: null as unknown,
      midY: null as unknown,
      endX: null as unknown,
      endY: null as unknown,
      parent: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 0,
        offsetHeight: 0
      },
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
    this.setParent()
    this.setCanvas()
    this.setAttr()
  },
  methods: {
    setParent() {
      const parent = this.$refs['parent'] as HTMLElement
      this.parent = {
        offsetLeft: parent.offsetLeft,
        offsetTop: parent.offsetTop,
        offsetWidth: parent.offsetWidth,
        offsetHeight: parent.offsetHeight
      }
    },
    setCanvas() {
      this.canvas = this.$refs['canvas'] as HTMLCanvasElement
      this.backCanvas = this.$refs['backCanvas'] as HTMLCanvasElement
      this.canvas.width = this.parent.offsetWidth
      this.canvas.height = this.parent.offsetHeight
      this.backCanvas.width = this.parent.offsetWidth
      this.backCanvas.height = this.parent.offsetHeight
    },
    setAttr(): void {
      this.topItem.forEach((item, index) => {
        this.attr(`canvas${index}`)
      })
      this.bItem.forEach((item, index) => {
        this.attr(`b${index}`)
      })
    },
    attr(id: string) {
      const liArr: HTMLElement[] = this.$refs[id] as HTMLElement[]
      const li = liArr[0]
      const top = id.includes('canvas')
        ? li.offsetTop + li.offsetHeight
        : li.offsetTop
      li?.setAttribute('left', (li.offsetLeft + li.offsetWidth / 2).toString())
      li?.setAttribute('top', top.toString())
    },
    onStart(e: TouchEvent): void {
      const touches = e.touches
      if (touches.length > 1) {
        return
      }
      const cur = touches[0]
      const curElem = cur.target as HTMLElement
      const parent = curElem.parentElement as HTMLElement

      if (!parent?.className.includes('list-item')) {
        return
      }
      const pp = parent?.parentElement
      this.curStart = curElem
      this.isBegin = true
      pp?.setAttribute('first', '1')
      parent?.setAttribute('sel', '1')
      parent.className = 'list-item addStyle'
      this.startX = parent?.getAttribute('left')
      this.startY = parent?.getAttribute('top')
    },
    onMove(e: TouchEvent): void {
      var touch = e.touches[0]
      const cur = document.elementFromPoint(touch.clientX, touch.clientY)
      if (this.isBegin) {
        this.midX = touch.pageX - this.parent.offsetLeft
        this.midY = touch.pageY - this.parent.offsetTop
      }
      const parent = cur?.parentElement as HTMLElement
      const pp = parent?.parentElement as HTMLElement
      if (cur?.className.includes('app-main')) {
        console.log('在canvas外move')
        // 		if (part1.attr("first") == 0) {
        // 			part1.children("span").each(function (index, element) {
        // 				if ($(this).attr('check') == 0) {
        // 					$(this).attr("sel", "0").removeClass("addstyle");
        // 				};
        // 			});
        // 		};
        // 		if (part2.attr("first") == 0) {
        // 			part2.children("span").each(function (index, element) {
        // 				if ($(this).attr('check') == 0) {
        // 					$(this).attr("sel", "0").removeClass("addstyle");
        // 				};
        // 			});
        // 		};
      } else {
        if (parseInt(parent?.getAttribute('check') as string) === 0) {
          parent.className = 'list-item addStyle'
          parent.setAttribute('sel', '1')
          const list = pp.children //获取父级的所有子节点
          for (let i = 0; i < list.length; i++) {
            //循环
            const node = list[i]
            if (
              node.nodeType == 1 &&
              node != parent &&
              node.getAttribute('check') === '0'
            ) {
              //如果该节点是元素节点与不是这个节点本身
              node.className = 'list-item'
              node.setAttribute('sel', '0')
            }
          }
          if (parseInt(pp?.getAttribute('first') as string) === 1) {
            this.midX = parent.getAttribute('left')
            this.midY = parent.getAttribute('top')
          }
        }
      }
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
.app-main .canvas,
.app-main .backCanvas {
  position: absolute;
  left: 0;
  top: 0;
}
.app-main .canvas {
  z-index: -1;
}
.app-main .backCanvas {
  z-index: -2;
}
.list-item.addStyle {
  background-color: red !important;
}
</style>
