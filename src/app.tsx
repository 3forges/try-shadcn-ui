import ContentLayout from './layouts/main.tsx'
import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { ApiProvider } from "@reduxjs/toolkit/query/react"
import { pestoApi } from './api/endpoints/'
import Router from "./navigation/router.tsx" // src/navigation/router.tsx

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <ApiProvider api={pestoApi}>
        <ContentLayout>
        <Router/>
        </ContentLayout>
      </ApiProvider>
    </>
  );
}
