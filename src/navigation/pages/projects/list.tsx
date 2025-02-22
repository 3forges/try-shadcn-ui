import { useState } from "preact/hooks"

import {
  PestoProjectApiEntity,
} from "../../../api/entities/PestoProjectApiEntity"/* from "../../features/PestoApi/Projects/pestoProjectSlice"*/

/**
 * Surgery flowbite-react -> shadcn-ui
*/
//import { Dropdown } from "flowbite-react"
import { ComboBoxResponsive as Dropdown } from "./searchFilterDropdown"
// import { Dropdown, Spinner, TextInput, Alert, Toast } from "flowbite-react"
import { Input as TextInput } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// import { toast } from "@/components/ui/sonner"
import { toast } from "sonner"


import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"



import { BellIcon, CheckIcon as LuSuccessIcon, BugIcon as LuErrorIcon } from 'lucide-react'
//import { BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon, Plus as LuPlus, BellIcon, SaveAll as LuSaveAll } from 'lucide-react'

import { pestoApi } from "../../../api/endpoints/"
// import { ProjectListCard } from "../components/ContentType/ContentTypeListCard"
import { ProjectListCard } from "./card"
import { JSX } from "preact/jsx-runtime"
const { useProjectListQuery } = pestoApi

interface Filter {
  target: number
  value: string
  filterfunction: Function
}

/**
 * PROJECT MAIN COMPONENT
 *
 * LIST PROJECT / CREATE PROJECT
 *
 *  PROVIDE CREATE PROJECT FORM
 *
 *  PROVIDE LIST WITH OPTIONAL BUTTONS (EDIT|REMOVE)
 * @returns PROJECT USER INTERFACE MANAGEMENT
 */
export function PestoProjectList(): JSX.Element {
  const [filter, SetFilter] = useState({ target: 0, value: "" })
  const { data: pestoProjectListData = [], isLoading, isError, isUninitialized, isSuccess } = useProjectListQuery()

  if (isLoading || isUninitialized) {
    return (<div>
      <Alert className={`m-5`}><Spinner aria-label="Loading..." className={`rounded bg-cyan-300 text-yellow-300 p-1 ml-2 mr-2`} />Loading <code>Pesto Content Types</code> ...</Alert>
    </div>
    )

  }

//  if (isSuccess) {
//    return (
//      <>
//      <Toast>
//        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
//          {//<HiCheck className="h-5 w-5" />
//          }
//          <BellIcon className="h-5 w-5" />
//          {//Highlighter, HandIcon, EyeOffIcon, EyeIcon, HopIcon, 
//          }
//        </div>
//        <div className="ml-3 text-sm font-normal">Pesto Project Items loaded successfully.</div>
//        <Toast.Toggle />
//      </Toast>
//      </>
//    )
//  }

  if (isError) {
    return (<div>
      <Alert>something went wrong !</Alert>
    </div>)
  }

  
  // if (filter.value !== "" && requestOutput.length > 0) {
  // requestOutput = requestOutput.filter(filters[filter.target].filterfunction)
  // }
  const showProjectsListLoadedSuccessToast = () => {
    
    toast(`Pesto Project Items loaded successfully.`, {
        description: `Pesto Project Items loaded successfully.`,
        action: {
          label: "Success",
          icon: <LuSuccessIcon className="h-5 w-5" />,
          onClick: () => console.log(`Pesto Project Items loaded successfully.`),
        },
      })
  }
const showProjectsListLoadedFailureToast = (projectData: PestoProjectApiEntity) => {
  const projectName = projectData.name;
  toast(`Error deleting the  [${projectName}] project.`, {
      description: `An error was encountered while trying to delete the  [${projectName}] project.`,
      action: {
        label: "Error",
        icon: <LuErrorIcon className="h-5 w-5" />,
        onClick: () => console.log(`An error was encountered while trying to delete the project.`),
      },
    })
}
  /* ----------------------- JSX ----------------------- */
  return (
    <>
      {isSuccess ? showProjectsListLoadedSuccessToast(): (<></>)}
    <div>

      <hr style="margin:10px" />
      {/* ----------------------FILTRE------------------- */}
      <div className="flex max-w-md flex-row gap-4 m-4">
        <Dropdown />
        <TextInput
          id="filter"
          placeholder="Enter your filter value"
          type="text"
          onChange={(e: any) =>
            SetFilter({ target: filter.target, value: e.target.value })
          }
        />

      </div>
      {/* ----------------------PAGINATION------------------- */}


      {/* ----------------------PROJECT LIST------------------- */}
      <div className="projects">
        {pestoProjectListData &&
          pestoProjectListData[0] &&
          pestoProjectListData[0]._id !== `0` &&
          pestoProjectListData.map((project: PestoProjectApiEntity, index: number) => {
            return (
              <div>
                <span>Project # {index}</span>
                <ProjectListCard
                  project={project}
                  isEditModeOn={false}
                />
              </div>
            )
          }
          )}
      </div>
    </div>
    
    </>
  )
}
