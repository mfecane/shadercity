let mouseDown = false
let mouseXprev = 0
let mouseYprev = 0
let mouseX = 0
let mouseY = 0
let speedX = 0
let speedY = 0

let scrollValue = 0.5
const scrollValueMin = 0
const scrollValueMax = 1
const scrollStep = 0.04
let scrollSpeed = 0

let inited = false

let targetScrollValue = 1

const MOVE_SPEED = 0.0002
const MOVE_DRAG = 0.01

const ACCELERATION = 0.02
const DRAG = 0.4
const SCROLL_THRESHOLD = 0.002

const handleMouseDown = function (e: MouseEvent) {
  if (e.target.nodeName === 'CANVAS') {
    mouseDown = true
    mouseXprev = e.screenX
    mouseYprev = e.screenY
    e.preventDefault()
    e.stopPropagation()
  }
}

const handleMouseUp = function (e) {
  mouseDown = false
  e.preventDefault()
  e.stopPropagation()
}

const handleMouseMove = function (e: MouseEvent) {
  if (e.target.nodeName === 'CANVAS' && mouseDown) {
    const speedFactor = MOVE_SPEED

    speedX += (e.screenX - mouseXprev) * speedFactor
    speedY += (e.screenY - mouseYprev) * speedFactor

    mouseXprev = e.screenX
    mouseYprev = e.screenY
    e.preventDefault()
    e.stopPropagation()
  }
}

const updateSpeed = function (speed: number) {
  if (Math.abs(speed) > MOVE_SPEED) {
    return (speed *= 1 - MOVE_DRAG)
  }
  return 0
}

const handleMouse = function () {
  if (!mouseDown) {
    speedX = updateSpeed(speedX)
    speedY = updateSpeed(speedY)
  }

  mouseX += speedX
  mouseY += speedY

  if (mouseX < -2000) mouseX = -2000
  if (mouseX > 2000) mouseX = 2000

  if (mouseY < -2000) mouseY = -2000
  if (mouseY > 2000) mouseY = 2000
}

const handleScroll = function (e: WheelEvent): void {
  if (e.target.nodeName === 'CANVAS') {
    const value = e.deltaY
    if (value > 0 && targetScrollValue < scrollValueMax) {
      targetScrollValue += scrollStep
    } else if (value < 0 && targetScrollValue > scrollValueMin) {
      targetScrollValue -= scrollStep
    }
    console.log('prevent')

    e.preventDefault()
    e.stopPropagation()
  }
}

const updateScroll = function () {
  if (Math.abs(scrollValue - targetScrollValue) < SCROLL_THRESHOLD) {
    scrollSpeed = 0
    return
  }

  const accel =
    (targetScrollValue - scrollValue) * ACCELERATION - scrollSpeed * DRAG
  scrollSpeed += accel
  scrollValue += scrollSpeed
}

export const getMouseControl = function (): [number, number, number] {
  return [mouseX, mouseY, scrollValue]
}

export const init = function (): void {
  if (!inited) {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('wheel', handleScroll)
    // window.addEventListener('scroll', (e) => {
    //   if (e.target.nodeName === 'CANVAS') {
    //     console.log('prevent')
    //     e.preventDefault()
    //     e.stopPropagation()
    //   }
    // })
    inited = true
    animate()
  }
}

const animate = function (): void {
  handleMouse()
  updateScroll()
  requestAnimationFrame(animate)
}
