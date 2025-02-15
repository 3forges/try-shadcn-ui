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


import { MarqueeDemoVertical } from "./MarqueeDemoVertical";




export function App() {
  /*
  const [count, setCount] = useState(0)
  const [shadCount, setShadCount] = useState(0)
  const { toast } = useToast()
  */


  return (
    <>
      <MarqueeDemoVertical />
    </>
  )
}
