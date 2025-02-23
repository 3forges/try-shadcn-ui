/**
 * External imports
 */
import { JSX } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner"
import { BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon } from 'lucide-react';
/**
 * Shadcn-ui imported components
 */
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
/**
 * Internal imports
 */
import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"
import { useDeleteContentTypeMutation } from "../../../../api/endpoints"
import { ContentTypeCardEditModeOn } from "./ContentTypeCardEditModeOn";
import { ContentTypeCardEditModeOff } from "./ContentTypeCardEditModeOff";
import { IPestoContentTypeContext, PestoContentTypeContext } from "../ContentTypeContext";
















export interface ContentTypeListCardProps {
  // contentType: PestoContentTypeApiEntity
  isEditModeOn?: boolean
  showButtons?: boolean
  showTitle?: boolean
  showGeneratedFields?: boolean
}


/**
 * RENDER Content-Type To Content-Type-CARD
 * @param props
 *  Content-Type: PestoContentTypeApiEntity => data to render
 *
 *  callback: FUNCTION  => (optional) parent javascript for buttons
 * @returns Content-Type-CARD + BUTTONS (optional)
 */
export function ContentTypeCard({isEditModeOn: p_isEditModeOn = false, showButtons = true, showTitle = true, showGeneratedFields = true}: ContentTypeListCardProps): JSX.Element {
  const [isEditModeOn, setIsEditModeOn] = useState<boolean>(p_isEditModeOn || false);
  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeCard] - [pestoContentTypeContext] is null or undefined!`)
  }
  
  const [deleteContentType, {
    data: deletedContentType,
    isError: didDeletionThrowError,
    isSuccess: hasSuccessfullyDeletedContentType,
    isLoading: isDeletingContentType,
  }] = useDeleteContentTypeMutation();
  const showDeletionSuccessToast = () => {
    const contentTypeName = pestoContentTypeContext.contentTypeContextEntity.name;
    const contentTypeID = pestoContentTypeContext.contentTypeContextEntity._id;
    toast(`ContentType [${contentTypeName}] has successfully been deleted.`, {
        description: `Pesto Content Type [${contentTypeName}], of ID [${contentTypeID}], has sucessfully been deleted.`,
        action: {
          label: "Success",
          icon: <LuSuccessIcon className="h-5 w-5" />,
          onClick: () => console.log(`Pesto Content Type [${contentTypeName}], of ID [${contentTypeID}], has sucessfully been deleted.`),
        },
      })
  }
  useEffect (() => {
    showDeletionSuccessToast()
  }, [hasSuccessfullyDeletedContentType])
const showDeletionFailureToast = () => {
  const contentTypeName = pestoContentTypeContext.contentTypeContextEntity.name;
  const contentTypeID = pestoContentTypeContext.contentTypeContextEntity._id;
  toast(`Error deleting the  [${contentTypeName}] content type!`, {
      description: `An error was encountered while trying to delete the [${contentTypeName}] content type, of ID [${contentTypeID}] !`,
      action: {
        label: "Error",
        icon: <LuErrorIcon className="h-5 w-5" />,
        onClick: () => console.log(`An error was encountered while trying to delete the [${contentTypeName}] content type, of ID [${contentTypeID}] !`),
      },
    })
}
useEffect (() => {
  showDeletionFailureToast()
}, [didDeletionThrowError])
  return (
    <>
      {// READONLY MODE
      }
      <Card className={`p-2`}>
        <CardHeader>
            <CardTitle>ContentType List Card</CardTitle>
            <CardDescription>ContentType Details</CardDescription>
        </CardHeader>
        <CardContent>
        {isEditModeOn && (
           <ContentTypeCardEditModeOn setIsEditModeOnHook={setIsEditModeOn} showButtons={showButtons} showTitle={showTitle} showGeneratedFields={showGeneratedFields} />
         ) || (
           <ContentTypeCardEditModeOff />
         )
        }


            {showButtons?
             (
              <>
        <div class="grid grid-cols-2 gap-2 z-0 p-3">
          <Button
              variant={"secondary"}
            onClick={async () => {
              console.log(`Passage en mode Édition`)
              await setIsEditModeOn(true)
            }}
          >
            Edit
          </Button>
          <a href={`/content-type/${pestoContentTypeContext?.contentTypeContextEntity._id}`}
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={async () => {
              console.log(`Passage en mode Édition - Detail Page`)
              await setIsEditModeOn(true)
            }}
          >
            Edit with Detail Page

          </a>
          <Button
              variant={"ghost"}
            onClick={async () => {
              await deleteContentType({
                _id: `${pestoContentTypeContext?.contentTypeContextEntity._id}`
              })
              // await dispatch(DeleteContentTypeById(`${project._id}`))
            }}
          >

            Remove
            {isDeletingContentType && (
              <Spinner className={``} aria-label="Deleting Content Type..." />
            ) || (
                <></>
              )}
          </Button>

          <a href={`/project/${pestoContentTypeContext?.contentTypeContextEntity._id}/content-mgmt`}
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={async () => {
              console.log(`Passage en mode Édition - Detail Page`)
              await setIsEditModeOn(true)
            }}
          >
            ContentType's content management

          </a>
        </div>
              </>
             ):(
              <>
              
              </>
             )
             }
        </CardContent>
        <CardFooter>
            <p>Pesto @Copyleft 2025</p>
        </CardFooter>
        </Card>

    </>
  )
}
