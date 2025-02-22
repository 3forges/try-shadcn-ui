import { useContext, useState } from "preact/hooks"

import {
    PestoContentTypeApiEntity,
} from "../../../api/entities/PestoContentTypeApiEntity"/* from "../../features/PestoApi/ContentTypes/pestoContentTypeSlice"*/

/**
 * Surgery flowbite-react -> shadcn-ui
 */
// import { Spinner, Alert, Toast, Button, Modal } from "flowbite-react"
// import { Modal } from "flowbite-react"

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

import { BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon, Plus as LuPlus, BellIcon, SaveAll as LuSaveAll } from 'lucide-react'
import { ContentTypeListCard } from "./card"
import { pestoApi } from "../../../api/endpoints"
import { IPestoContentTypeContext, PestoContentTypeContext, PestoContentTypeContextProvider } from "./ContentTypeContext"
import { PestoContentTypeContextEntityUtils } from "./utils/ContentTypeContextUtils"
import { JSX } from "preact/jsx-runtime"
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
    // import { toast } from "sonner"
    const showCreateContentTypeSuccessToast = (createdContentTypeResponseData: any) => {
        toast("ContentType has been created", {
            description: `ContentType ${JSON.stringify(createdContentTypeResponseData, null, 4)} successfully created.`,
            action: {
              label: "Success",
              icon: <LuSuccessIcon className="h-5 w-5" />,
              onClick: () => console.log(`ContentType ${JSON.stringify(createdContentTypeResponseData, null, 4)} successfully created.`),
            },
          })
    }
    const showCreateContentTypeFailureToast = (pestoContentTypeContext: IPestoContentTypeContext, errorTryingToCreateContentType: any) => {
        toast("ContentType creation Error!", {
            description: `ContentType ${JSON.stringify(errorTryingToCreateContentType, null, 4)} successfully created.`,
            action: {
              label: "Success",
              icon: <LuErrorIcon className="h-5 w-5" />,
              onClick: () => console.log(`An error was encountered while trying to create the ${`${pestoContentTypeContext?.contentTypeContextEntity.name}`} content type: .`),
            },
          })
    }
    return (
        <>
            {isContentTypeCreationPending && (
                <Spinner className={``} aria-label="Creating Content Type..." />
            ) || (
                    <></>
                )}
            {hasSuccessfullyCreatedContentType && showCreateContentTypeSuccessToast(createdContentTypeResponseData) }

            {didContentTypeCreationThrowError && showCreateContentTypeFailureToast(pestoContentTypeContext, errorTryingToCreateContentType)}
            


            <div class="m-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div class="sm:col-span-2 inline-flex shadow-sm">
                    <Button
                        variant={"secondary"}
                        onClick={async () => {
                            console.log(`JBL DEBUG OPEN CREATE NEW CONTENT TYPE MODAL`)
                            setOpenCreateContentTypeModal(true);
                        }}
                        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:z-10 focus:outline-none text-white bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:enabled:hover:bg-cyan-700 dark:focus:ring-cyan-800 rounded-lg focus:ring-2"
                    >
                        <LuPlus />
                    </Button>
                </div>
            </div>

            {
                <Dialog 
                 open={openCreateContentTypeModal}
                 modal={true}
                 onOpenChange={async () => {
                    /**
                     * 
                     */
                    console.log(`JBL DEBUG [onOpenChange] openCreateContentTypeModal=[${openCreateContentTypeModal}]`)
                    setOpenCreateContentTypeModal(openCreateContentTypeModal!)
                 }}
                >
                    {
                    // <DialogTrigger>Open</DialogTrigger>
                    }
                    
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>New ContentType</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                        </DialogHeader>
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
                    </DialogContent>
                    </Dialog>

                /*
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
                        variant={"ghost"}
                        onClick={() => {
                            console.log(` >> CLICK CANCEL CREATE CONTENT TYPE: `)
                            setOpenCreateContentTypeModal(false)
                        }}

                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
                */
            }
            
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
            <Alert className={`m-5`}>
                <Spinner aria-label="Loading..." className={`rounded bg-cyan-300 text-yellow-300 p-1 ml-2 mr-2`} />
                <AlertTitle>Loading ...</AlertTitle>
                <AlertDescription>
                    Loading <code>Pesto Content Types</code> ...
                </AlertDescription>
            </Alert>

        </div>
        )

    }
    if (isError) {
        return (<div>
            <Alert>Something went wrong while trying to fetch Pesto Content Types !</Alert>
        </div>)
    }
    const showItemsLoadedSuccessToast = () => {
        toast("Pesto ContentType Items loaded successfully", {
            description: `Pesto ContentType Items loaded successfully.`,
            action: {
              label: "Success",
              icon: <BellIcon className="h-5 w-5" />,
              onClick: () => console.log(`Pesto ContentType Items loaded successfully.`),
            },
          })
    }
    /* ----------------------- JSX ----------------------- */
    return (
        <>
            {isSuccess && showItemsLoadedSuccessToast() }
            
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
