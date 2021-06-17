<template>
  <div id="app">
    <div class="demo">
      <div
        class="app-main"
        ref="parent"
        @touchmove.prevent="onMove"
        @touchend.prevent="onEnd"
      >
        <ul class="img-list" first="0" ref="top">
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
            class="list-item"
            @touchstart.prevent="onStart"
          >
            <canvas class="img-canvas" width="100%" height="100%"></canvas>
          </li>
        </ul>
        <ul class="txt-list" first="0" ref="bottom">
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
interface DataKey {
  selTop: string
  selBottom: string
  countTop: string
  countBottom: string
}
export default Vue.extend({
  data() {
    return {
      countTop: 0,
      countBottom: 0,
      pairSet: 0,
      pair: 0,
      orderCheck: [] as boolean[],
      orderPair: [] as (string | null)[],
      mx: [] as number[],
      my: [] as number[],
      ms: [] as number[],
      pairL: [] as number[],
      pairR: [] as number[],
      canvas: null as unknown as HTMLCanvasElement,
      cContext: null as unknown as CanvasRenderingContext2D,
      bContext: null as unknown as CanvasRenderingContext2D,
      backCanvas: null as unknown as HTMLCanvasElement,
      linewidth: 2,
      linestyle: '#0C6',
      isBegin: false,
      top: null as unknown as HTMLElement,
      bottom: null as unknown as HTMLElement,
      selTop: null as unknown as HTMLElement,
      selBottom: null as unknown as HTMLElement,
      curStart: null as unknown as HTMLElement,
      lastX: null as unknown as number,
      lastY: null as unknown as number,
      startX: null as unknown as number,
      startY: null as unknown as number,
      midX: null as unknown as number,
      midY: null as unknown as number,
      endX: null as unknown as number,
      endY: null as unknown as number,
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
      this.top = this.$refs['top'] as HTMLElement
      this.bottom = this.$refs['bottom'] as HTMLElement
    },
    setCanvas() {
      this.canvas = this.$refs['canvas'] as HTMLCanvasElement
      this.backCanvas = this.$refs['backCanvas'] as HTMLCanvasElement
      this.cContext = this.canvas.getContext('2d') as CanvasRenderingContext2D
      this.bContext = this.backCanvas.getContext(
        '2d'
      ) as CanvasRenderingContext2D
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
    onStart(e: TouchEvent) {
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
      this.countTop = 0
      this.countBottom = 0
      const pp = parent?.parentElement
      this.curStart = parent
      const li = [...(this.top.children as unknown as HTMLElement[])]
      li.push(...(this.bottom.children as unknown as HTMLElement[]))
      console.log('li: ', li, this.bottom)
      li.forEach((item, index) => {
        if (item.className.indexOf('addstyle') > -1) {
          item.setAttribute('orderCheck', '1')
          this.$set(this.orderPair, index, item.getAttribute('pair'))
        } else {
          item.setAttribute('orderCheck', '0')
          this.$set(this.orderPair, index, null)
        }
      })

      this.isBegin = true
      this.pairSet =
        (this.curStart.getAttribute('pair') as unknown as number) * 2
      pp?.setAttribute('first', '1')
      parent?.setAttribute('sel', '1')
      parent.className =
        parent.getAttribute('check') == '0' ? 'list-item addStyle' : 'list-item'
      this.startX = parent?.getAttribute('left') as unknown as number
      this.startY = parent?.getAttribute('top') as unknown as number
    },
    onMove(e: TouchEvent) {
      var touch = e.touches[0]
      const cur = document.elementFromPoint(touch.clientX, touch.clientY)
      if (this.isBegin) {
        this.midX = touch.pageX - this.parent.offsetLeft
        this.midY = touch.pageY - this.parent.offsetTop
        const parent = cur?.parentElement as HTMLElement
        const pp = parent?.parentElement as HTMLElement
        if (cur?.className.includes('app-main')) {
          this.setMovePP(this.top)
          this.setMovePP(this.bottom)
        } else {
          if (parseInt(parent?.getAttribute('check') as string) === 0) {
            const list = pp.children //获取父级的所有子节点
            for (let i = 0; i < list.length; i++) {
              const node = list[i]
              if (node.nodeType == 1 && node.getAttribute('check') === '0') {
                //如果该节点是元素节点与不是这个节点本身
                node.className = 'list-item'
                node.setAttribute('sel', '0')
              }
            }
            parent.className = 'list-item addStyle'
            parent.setAttribute('sel', '1')
            if (parseInt(pp?.getAttribute('first') as string) === 1) {
              this.startX = parent.getAttribute('left') as unknown as number
              this.startY = parent.getAttribute('top') as unknown as number
            }
          }
        }
        this.backstrockline()
      }
    },
    onEnd(e: TouchEvent) {
      var touch = e.changedTouches[0]
      console.log('touch: ', e)
      const cur = document.elementFromPoint(touch.clientX, touch.clientY)
      if (this.isBegin) {
        const parent = cur?.parentElement as HTMLElement
        const pp = parent?.parentElement as HTMLElement
        if (cur?.className.includes('app-main')) {
          console.log(111111)
        } else {
          if (pp.getAttribute('first') === '0') {
            if (parent.getAttribute('check') === '0') {
              if (this.curStart.getAttribute('check') === '1') {
                this.setEndPP(this.top, 'selTop', 'countTop')
                this.setEndPP(this.bottom, 'selBottom', 'countBottom')
                if (this.countTop == 1 && this.countBottom == 1) {
                  this.mx.push(
                    this.selTop.getAttribute('left') as unknown as number
                  )
                  this.my.push(
                    this.selTop.getAttribute('top') as unknown as number
                  )
                  this.ms.push(0)
                  this.selTop.setAttribute('pair', this.pair.toString())
                  this.pairL.push(this.pair)
                  this.mx.push(
                    this.selBottom.getAttribute('left') as unknown as number
                  )
                  this.my.push(
                    this.selBottom.getAttribute('top') as unknown as number
                  )
                  this.ms.push(1)
                  this.selBottom.setAttribute('pair', this.pair.toString())
                  this.pairR.push(this.pair)
                  this.pair++
                  this.top.setAttribute('first', '1')
                  this.bottom.setAttribute('first', '0')

                  const readline = this.pairSet / 2
                  this.setPEnd(this.top, readline)
                  this.setPEnd(this.bottom, readline)
                  this.strockline2()
                } else {
                  console.log(222222)
                  const li = (
                    this.top.children as unknown as HTMLElement[]
                  ).concat(this.bottom.children as unknown as HTMLElement[])
                  li.forEach((item, index) => {
                    item.setAttribute('sel', '0')
                    if (item.getAttribute('orderCheck') === '1') {
                      item.setAttribute('check', '1')
                      item.setAttribute('pair', this.orderPair[index] as string)
                      item.className = 'list-item addStyle'
                    } else {
                      item.setAttribute('check', '0')
                      item.className = 'list-item'
                      item.removeAttribute('pair')
                    }
                  })
                }
              } else {
                console.log(333333)
              }
            } else {
              console.log(444444)
            }
          } else {
            console.log(555555)
          }
        }
      }
    },
    setMovePP(arr: HTMLElement) {
      if (arr.getAttribute('first') === '0') {
        const children = arr.children as unknown as HTMLElement[]
        children.forEach(item => {
          if (item.getAttribute('check') === '0') {
            item.setAttribute('sel', '0')
            item.className = 'list-item'
          }
        })
      }
    },
    setEndPP<K extends keyof DataKey>(arr: HTMLElement, selId: K, countId: K) {
      const children = arr.children as unknown as HTMLElement[]
      children.forEach(item => {
        if (item.getAttribute('sel') === '1') {
          item.setAttribute('sel', '0')
          item.setAttribute('check', '1')
          this.$set(this, selId, item)
          let count = this[countId] as number
          this.$set(this, countId, count++)
        }
      })
    },
    setPEnd(arr: HTMLElement, readline: number) {
      const children = arr.children as unknown as HTMLElement[]
      for (let item of children) {
        if ((item.getAttribute('pair') as unknown as number) !== readline) {
          continue
        }
        item.className = 'list-item'
        item.setAttribute('check', '0')
        item.removeAttribute('pair')
      }
    },
    backstrockline() {
      //绘制
      this.bContext.clearRect(
        0,
        0,
        this.parent.offsetWidth,
        this.parent.offsetHeight
      )
      this.bContext.save()
      this.bContext.beginPath()
      this.bContext.lineWidth = this.linewidth
      this.bContext.moveTo(this.startX, this.startY)
      this.bContext.lineTo(this.midX, this.midY)
      this.bContext.strokeStyle = this.linestyle
      this.bContext.stroke()
      this.bContext.restore()
    },
    strockline2() {
      //绘制方法
      this.cContext.clearRect(
        0,
        0,
        this.parent.offsetWidth,
        this.parent.offsetHeight
      ) //整个画布清除
      this.cContext.save()
      this.cContext.beginPath()
      this.cContext.lineWidth = this.linewidth
      const clearLine = this.pairSet
      for (let i = 0; i < this.ms.length; i++) {
        //遍历绘制
        if (clearLine == i) {
          this.mx[i] = null as unknown as number
          this.my[i] = null as unknown as number
        }
        if (clearLine + 1 == i) {
          this.mx[i] = null as unknown as number
          this.my[i] = null as unknown as number
        }
        this.lastX = this.mx[i]
        this.lastY = this.my[i]
        if (this.ms[i] == 0) {
          this.cContext.moveTo(this.lastX, this.lastY)
        } else {
          this.cContext.lineTo(this.lastX, this.lastY)
        }
      }
      this.cContext.strokeStyle = this.linestyle
      this.cContext.stroke()
      // this.cContext.restore()
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
