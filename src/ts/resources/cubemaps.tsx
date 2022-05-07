import posX01 from 'assets/Yokohama3/posx.jpg'
import negX01 from 'assets/Yokohama3/negx.jpg'
import posY01 from 'assets/Yokohama3/posy.jpg'
import negY01 from 'assets/Yokohama3/negy.jpg'
import posZ01 from 'assets/Yokohama3/posz.jpg'
import negZ01 from 'assets/Yokohama3/negz.jpg'

import posX02 from 'assets/Yokohama/posx.jpg'
import negX02 from 'assets/Yokohama/negx.jpg'
import posY02 from 'assets/Yokohama/posy.jpg'
import negY02 from 'assets/Yokohama/negy.jpg'
import posZ02 from 'assets/Yokohama/posz.jpg'
import negZ02 from 'assets/Yokohama/negz.jpg'

import posX03 from 'assets/Vasa/posx.jpg'
import negX03 from 'assets/Vasa/negx.jpg'
import posY03 from 'assets/Vasa/posy.jpg'
import negY03 from 'assets/Vasa/negy.jpg'
import posZ03 from 'assets/Vasa/posz.jpg'
import negZ03 from 'assets/Vasa/negz.jpg'

import posX04 from 'assets/Stairs/posx.jpg'
import negX04 from 'assets/Stairs/negx.jpg'
import posY04 from 'assets/Stairs/posy.jpg'
import negY04 from 'assets/Stairs/negy.jpg'
import posZ04 from 'assets/Stairs/posz.jpg'
import negZ04 from 'assets/Stairs/negz.jpg'

import posX05 from 'assets/chu/posx.jpg'
import negX05 from 'assets/chu/negx.jpg'
import posY05 from 'assets/chu/posy.jpg'
import negY05 from 'assets/chu/negy.jpg'
import posZ05 from 'assets/chu/posz.jpg'
import negZ05 from 'assets/chu/negz.jpg'

export type Cubemap = {
  posX: string
  negX: string
  posY: string
  negY: string
  posZ: string
  negZ: string
}

export const cubemaps: Cubemap[] = [
  {
    posX: posX01,
    negX: negX01,
    posY: posY01,
    negY: negY01,
    posZ: posZ01,
    negZ: negZ01,
  },
  {
    posX: posX02,
    negX: negX02,
    posY: posY02,
    negY: negY02,
    posZ: posZ02,
    negZ: negZ02,
  },
  {
    posX: posX03,
    negX: negX03,
    posY: posY03,
    negY: negY03,
    posZ: posZ03,
    negZ: negZ03,
  },
  {
    posX: posX04,
    negX: negX04,
    posY: posY04,
    negY: negY04,
    posZ: posZ04,
    negZ: negZ04,
  },
  {
    posX: posX05,
    negX: negX05,
    posY: posY05,
    negY: negY05,
    posZ: posZ05,
    negZ: negZ05,
  },
]

