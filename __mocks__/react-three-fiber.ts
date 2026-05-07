import React from 'react'

export const Canvas = ({ children }: { children?: React.ReactNode }) =>
  React.createElement('div', { 'data-testid': 'r3f-canvas' }, children)

export const useFrame = () => {}
export const useThree = () => ({})
export const extend = () => {}
export const useLoader = () => null
