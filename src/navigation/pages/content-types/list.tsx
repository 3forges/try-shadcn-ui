import { useContext, useState } from "preact/hooks"

import {
  PestoContentTypeApiEntity,
} from "../../../api/entities/PestoContentTypeApiEntity"/* from "../../features/PestoApi/ContentTypes/pestoContentTypeSlice"*/
import { Spinner, Alert, Toast, Button, Modal } from "flowbite-react"
// import {  } from "flowbite-react";
// import { HiCheck, HiExclamation, HiX } from 'react-icons/hi';
/// import { HiCheck, HiExclamation, HiX } from 'flowbite-react';
// import { Highlighter, HandIcon, EyeOffIcon, EyeIcon, HopIcon, BellIcon } from 'lucide-react'
import { BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon, Plus as LuPlus, BellIcon, SaveAll as LuSaveAll } from 'lucide-react'
import { ContentTypeListCard } from "./card"
import { pestoApi } from "../../../api/endpoints"
import { PestoContentTypeContext, PestoContentTypeContextProvider } from "../components/ContentType/ContentTypeContext"
import { PestoContentTypeContextEntityUtils } from "../components/ContentType/utils/ContentTypeContextUtils"
const { useContentTypeListQuery, useCreateNewContentTypeMutation } = pestoApi

export interface CreateContentTypeModalProps {
  // modalId: string
}
export function CreateContentTypeModal(/* {modalId}: CreateContentTypeModalProps */): JSX.Element {
  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeListCard] - [pestoContentTypeContext] is null or undefined!`)
  }
  const [openCreateContentTypeModal, setOpenCreateContentTypeModal] = useState(false);
  const [
    createContentType,
    {
      data: createdContentTypeResponseData,
      isError: didContentTypeCreationThrowError,
      error: errorTryingToCreateContentType,
      isLoading: isContentTypeCreationPending,
      isSuccess: hasSuccessfullyCreatedContentType
    }
  ] = useCreateNewContentTypeMutation();
  return (
    <>
      {isContentTypeCreationPending && (
        <Spinner aria-label="Creating Content Type..." />
      ) || (
          <></>
      )}
      {hasSuccessfullyCreatedContentType && (
        <>
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <LuSuccessIcon className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">ContentType {JSON.stringify(createdContentTypeResponseData, null, 4)} successfully created.</div>
            <Toast.Toggle />
          </Toast>
          <span>
            {// 
              `${JSON.stringify(createdContentTypeResponseData, null, 4)}`
            }
          </span>
        </>
      ) || (
        <></>
      )}

      {didContentTypeCreationThrowError && (
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                  <LuErrorIcon className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">An error was encountered while trying to create the {`${pestoContentTypeContext?.contentTypeContextEntity.name}`} content type:</div>
                <div className="ml-3 text-sm font-normal">
                  <pre>
                    {errorTryingToCreateContentType?errorTryingToCreateContentType:(<></>)}
                  </pre>
                </div>
                <Toast.Toggle />
              </Toast>
            ) || (
                <></>
            )}


      <div class="m-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2 inline-flex shadow-sm">
              <button
                type="button"
                onClick={() => setOpenCreateContentTypeModal(true)}
                class="py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:z-10 focus:outline-none text-white bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:enabled:hover:bg-cyan-700 dark:focus:ring-cyan-800 rounded-lg focus:ring-2"
              >
                <LuPlus />
              </button>
              </div>
      </div>
      <Modal show={openCreateContentTypeModal} onClose={() => setOpenCreateContentTypeModal(false)}>
        <Modal.Header>New ContentType</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          
              <div>
                <ContentTypeListCard
                  showButtons={false}
                  showTitle={false}
                  showGeneratedFields={false}
                  isEditModeOn={true}
                />
              </div>
              
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
           onClick={async () => {
            console.log(` >> CLICK CREATE CONTENT TYPE: `)
            console.log("ContentType to create: [pestoContentTypeContext.contentTypeContextEntity]=", pestoContentTypeContext.contentTypeContextEntity)
            console.log("ContentType to create: [JSON payload]=", JSON.stringify({
              v_name: pestoContentTypeContext.contentTypeContextEntity.name,
              v_description: pestoContentTypeContext.contentTypeContextEntity.description,
              v_project_id: pestoContentTypeContext.contentTypeContextEntity.project_id,
              v_frontmatter_definition: PestoContentTypeContextEntityUtils.convertContextToApiEntity(pestoContentTypeContext.contentTypeContextEntity).frontmatter_definition,
            }, null, 4))

            // await setIsEditModeOnHook(false);
            await createContentType({
              v_name: pestoContentTypeContext.contentTypeContextEntity.name,
              v_description: pestoContentTypeContext.contentTypeContextEntity.description,
              v_project_id: pestoContentTypeContext.contentTypeContextEntity.project_id,
              v_frontmatter_definition: PestoContentTypeContextEntityUtils.convertContextToApiEntity(pestoContentTypeContext.contentTypeContextEntity).frontmatter_definition,
            })

            console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
            console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
            console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
            console.log(` REDUX RTK - dans [CreateContentTypeModal] - APRES[useCreateNewContentTypeMutation] - !`)
            // console.log(` REDUX RTK - dans [CreateContentTypeModal] - APRES[useCreateNewContentTypeMutation] - createdContentTypeResponseData = [${JSON.stringify(createdContentTypeResponseData, null, 4)}]`)
            // console.log(` REDUX RTK - dans [CreateContentTypeModal] - APRES[useCreateNewContentTypeMutation] - didContentTypeCreationThrowError = [${JSON.stringify(didContentTypeCreationThrowError, null, 4)}]`)
            // console.log(` REDUX RTK - dans [CreateContentTypeModal] - APRES[useCreateNewContentTypeMutation] - isContentTypeCreationPending = [${JSON.stringify(isContentTypeCreationPending, null, 4)}]`)
            // console.log(` REDUX RTK - dans [CreateContentTypeModal] - APRES[useCreateNewContentTypeMutation] - hasSuccessfullyCreatedContentType = [${JSON.stringify(hasSuccessfullyCreatedContentType, null, 4)}]`)
            console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
            console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
            console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)

            await setOpenCreateContentTypeModal(false)
           }}
          >
          <LuSaveAll className={`mr-2`} />
          Save</Button>
          <Button
           color="gray"
           onClick={() => {
            console.log(` >> CLICK CANCEL CREATE CONTENT TYPE: `)
            setOpenCreateContentTypeModal(false)
           }}

          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
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
export function PestoContentTypeList(): JSX.Element {
  

  const { data: pestoContentTypeListData = [], isLoading, isError, isUninitialized, isSuccess } = useContentTypeListQuery()

  if (isLoading || isUninitialized) {
    return (<div>
      <Alert className={`m-5`}><Spinner aria-label="Loading..." className={`rounded bg-cyan-300 text-yellow-300 p-1 ml-2 mr-2`} />Loading <code>Pesto Content Types</code> ...</Alert>
    </div>
    )

  }
  if (isError) {
    return (<div>
      <Alert>Something went wrong while trying to fetch Pesto Content Types !</Alert>
    </div>)
  }

  /* ----------------------- JSX ----------------------- */
  return (
    <>
      
    {isSuccess ? (
        <Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            {//<HiCheck className="h-5 w-5" />
            }
            <BellIcon className="h-5 w-5" />
            {//Highlighter, HandIcon, EyeOffIcon, EyeIcon, HopIcon, 
            }
          </div>
          <div className="ml-3 text-sm font-normal">Pesto ContentType Items loaded successfully.</div>
          <Toast.Toggle />
        </Toast>
        
      ): (
        <></>
      )
    }
    <div>
    <PestoContentTypeContextProvider contentTypeApiEntity={{
      _id: 0,
      name: `Type the name of the new content type`,
      description: `Type the description of the new content type`,
      frontmatter_definition: `export interface defaultFrontmatterName {

      }
      `,
      project_id: `0`,
      createdAt: ``,
      __v: 0
    }}>
      <CreateContentTypeModal />
    </PestoContentTypeContextProvider>
      <hr style="margin:10px" />

      {/* ----------------------PAGINATION------------------- */}


      {/* ----------------------CONTENT TYPES LIST------------------- */}
      <div className="content-types">
        {pestoContentTypeListData &&
          pestoContentTypeListData[0] &&
          pestoContentTypeListData[0]._id !== 0 &&
          pestoContentTypeListData.map((contentType: PestoContentTypeApiEntity, index: number) => {
            console.log(`Inside PestoContentTypeList.tsx - pestoContentTypeListData.map( - contentType: [${contentType.name}]`)
            return (
              <PestoContentTypeContextProvider contentTypeApiEntity={contentType}>
              <div>
                <span>ContentType # {index}</span>
                <ContentTypeListCard
                  isEditModeOn={false}
                />
              </div>
              </PestoContentTypeContextProvider>
            )
          }
          )}
      </div>
    </div>
    
    </>
  )
}
