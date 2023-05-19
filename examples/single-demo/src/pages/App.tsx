import Loader from 'components/Loader'
import { useFeatureFlagsIsLoaded } from 'featureFlags'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components/macro'

import Index from './Index'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  min-height: 100vh;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 4rem 8px 16px 8px;
  `};
`
 
export default function App() {
  const isLoaded = useFeatureFlagsIsLoaded()
  return (
      <AppWrapper>
        <BodyWrapper>
          <Suspense fallback={<Loader />}>
            {isLoaded ? (
              <Routes>
                <Route path="index" element={<Index />} />
                <Route path="" element={<Index />} />
              </Routes>
            ) : (
              <Loader />
            )}
          </Suspense>
        </BodyWrapper>
      </AppWrapper>
  )
}
