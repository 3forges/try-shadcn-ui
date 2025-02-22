import {
    PestoProjectApiEntity,
  } from "../../../api/entities/PestoProjectApiEntity"/* from "../../features/PestoApi/Projects/pestoProjectSlice"*/
  
  import { FunctionalComponent, JSX } from 'preact'
  // import { Spinner } from "flowbite-react"
  import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"
  import { ProjectListCard } from "./card"
  import { pestoApi } from "../../../api/endpoints"
  const { useProjectDetailQuery } = pestoApi
  
  
  
  
  {//https://github.com/preactjs/preact-router/issues/405#issuecomment-927369168
    // <PestoProjectDetail path="/projects/:id" project={{_id: parseInt(":id"), name: "fake", description: "fake", git_ssh_uri: "faketoo"}}/>
  }
  interface PestoProjectDetailProps {
    project_id: PestoProjectApiEntity;
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
  
  export const PestoProjectDetail: FunctionalComponent<PestoProjectDetailProps> = ({ project_id }: PestoProjectDetailProps): JSX.Element => {
    console.log(`[PestoProjectDetail] - project_id: `, project_id)
    const defaultProjectDetails: PestoProjectApiEntity = {
      _id: `-1`,
      description: `bidon`,
      git_ssh_uri: `bidon`,
      name: `bidon`,
    }
    const {
      data: projectDetail,
      isError: projectDetailQueryIsError,
      isFetching: projectDetailQueryIsFetching,
      isLoading: projectDetailQueryIsLoading,
      isSuccess: projectDetailQueryIsSuccess,
      // isUninitialized: projectDetailQueryIsUninitialized,
      // requestId: projectDetailQueryRequestId
    } = useProjectDetailQuery({
      _id: `${project_id}`,
    });
    
    // const fetchedProject = await getProjectFromId(`${project_id}`);
  
    /* ----------------------- JSX ----------------------- */
    return (
      <div className="p-2">
        <h2>Project Details</h2>
        {/* ----------------------PROJECT DETAIL------------------- */}
  
              {projectDetailQueryIsLoading ? (
                                <Spinner className={``} aria-label="Loading..." />
                                ):(``)
                              }
              {projectDetailQueryIsFetching ? (
                                <Spinner className={``} aria-label="Fetching..." />
                                ):(``)
                              }
              {projectDetailQueryIsError ? (
                                <span id="badge-dismiss-red" class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-red-800 bg-red-100 rounded dark:bg-red-900 dark:text-red-300">
                                    The request to Pesto API failed with an error!
                                  <button type="button" class="inline-flex items-center p-1 ml-2 text-sm text-red-400 bg-transparent rounded-sm hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-300" data-dismiss-target="#badge-dismiss-red" aria-label="Remove">
                                    <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span class="sr-only">Remove badge</span>
                                  </button>
                                </span>
                                ):(``)
                              }
  
        <div className="p-2">
  
              {projectDetailQueryIsSuccess ? (
                    <ProjectListCard
                      project={projectDetail?projectDetail:defaultProjectDetails}
                      isEditModeOn={false}
                    />
                                ):(
                  <span id="badge-dismiss-yellow" class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-900 dark:text-yellow-300">
                    The Project Details API request did not successfully completed yet...
                    <button type="button" class="inline-flex items-center p-1 ml-2 text-sm text-yellow-400 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-300" data-dismiss-target="#badge-dismiss-yellow" aria-label="Remove">
                      <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span class="sr-only">Remove badge</span>
                    </button>
                  </span>
                                )
                              }
  
        </div>
      </div>
    )
  }
  
  // export default PestoProjectDetail