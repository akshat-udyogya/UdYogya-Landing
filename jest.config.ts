import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  passWithNoTests: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        moduleResolution: 'node',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.(png|jpg|svg|gif)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@react-three/fiber$': '<rootDir>/__mocks__/react-three-fiber.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
export default config
