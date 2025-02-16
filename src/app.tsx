import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
/**
 * 
 * ShadCN
 */
import { Button as ShadCnBtn } from "@/components/ui/button"
import { /*Terminal as ShadTerminal, */Alert as ShadAlert, AlertDescription as ShadAlertDescription, AlertTitle as ShadAlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-preact"

import { useToast } from "@/hooks/use-toast"

export function App() {
  const [count, setCount] = useState(0)
  const [shadCount, setShadCount] = useState(0)
  const { toast } = useToast()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p>
        Check out{' '}
        <a
          href="https://preactjs.com/guide/v10/getting-started#create-a-vite-powered-preact-app"
          target="_blank"
        >
          create-preact
        </a>
        , the official Preact + Vite starter
      </p>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
      <p>
        <ShadCnBtn onClick={() => setShadCount((shadCount) => shadCount + 1)}>
          This is my first shadcn-ui button
          shadCount is {shadCount}
        </ShadCnBtn>
      </p>
      <p>


        <ShadAlert>
          <Terminal className="h-4 w-4" />
          <ShadAlertTitle>A ShadCN Alert!</ShadAlertTitle>
          <ShadAlertDescription>
            This is the ShadCN alert description : You can add components and dependencies to your app using the cli.
          </ShadAlertDescription>
        </ShadAlert>
      </p>
        <ShadCnBtn
          onClick={() => {
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
            })
          }}
        >
          Show Toast
        </ShadCnBtn>
    </>
  )
}
