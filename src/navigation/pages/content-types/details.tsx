
import { FunctionalComponent, JSX } from 'preact'
// import { Spinner } from "flowbite-react"
import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"

import { ContentTypeCard } from "./card/ContentTypeCard"
import { pestoApi } from "../../../api/endpoints"
import { PestoContentTypeContextProvider } from "./ContentTypeContext"
const {
    useContentTypeDetailQuery,/*
    useProjectListQuery,*/
} = pestoApi




{//https://github.com/preactjs/preact-router/issues/405#issuecomment-927369168
    // <PestoContentTypeDetail path="/projects/:id" project={{_id: parseInt(":id"), name: "fake", description: "fake", git_ssh_uri: "faketoo"}}/>
}
interface PestoContentTypeDetailProps {
    // contentType: PestoContentTypeApiEntity;
    content_type_id_param: string
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

export const PestoContentTypeDetail: FunctionalComponent<PestoContentTypeDetailProps> = ({ content_type_id_param }: PestoContentTypeDetailProps): JSX.Element => {
    console.log(`[PestoContentTypeDetail] - content_type_id_param: `, content_type_id_param)
    const {
        data: contentTypeDetail,
        isError: contentTypeDetailQueryIsError,
        isFetching: contentTypeDetailQueryIsFetching,
        isLoading: contentTypeDetailQueryIsLoading,
        isSuccess: contentTypeDetailQueryIsSuccess,
        // isUninitialized: contentTypeDetailQueryIsUninitialized,
        // requestId: contentTypeDetailQueryRequestId
    } = useContentTypeDetailQuery({
        _id: `${content_type_id_param}`,
    });

    /*
    const {
      data: project,
      isError: projectQueryIsError,
      isFetching: projectQueryIsFetching,
      isLoading: projectQueryIsLoading,
      isSuccess: projectQueryIsSuccess,
      // isUninitialized: projectQueryIsUninitialized,
      // requestId: projectQueryRequestId
    } = useProjectListQuery({
      _id: `${contentTypeDetail?.project_id}`,
    });
    */

    // const fetchedContentType = await getContentTypeFromId(`${project_id}`);

    /* ----------------------- JSX ----------------------- */
    return (
        <div className="p-2">
            <h2>ContentType Details Its Here</h2>
            {/* ----------------------PROJECT DETAIL------------------- */}

            {contentTypeDetailQueryIsLoading ? (
                <Spinner aria-label="Loading..." />
            ) : (``)
            }
            {contentTypeDetailQueryIsFetching ? (
                <Spinner aria-label="Fetching..." />
            ) : (``)
            }
            {contentTypeDetailQueryIsError ? (
                <span id="badge-dismiss-red" class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-red-800 bg-red-100 rounded dark:bg-red-900 dark:text-red-300">
                    The request to Pesto API failed with an error!
                    <button type="button" class="inline-flex items-center p-1 ml-2 text-sm text-red-400 bg-transparent rounded-sm hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-300" data-dismiss-target="#badge-dismiss-red" aria-label="Remove">
                        <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Remove badge</span>
                    </button>
                </span>
            ) : (``)
            }

            <div className="p-2">

                {contentTypeDetailQueryIsSuccess ? (
                    <PestoContentTypeContextProvider contentTypeApiEntity={contentTypeDetail}>
                        <ContentTypeCard

                            isEditModeOn={false}
                        />
                    </PestoContentTypeContextProvider>

                ) : (
                    <span id="badge-dismiss-yellow" class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        The ContentType Details API request did not successfully completed yet...
                        <button type="button" class="inline-flex items-center p-1 ml-2 text-sm text-yellow-400 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-300" data-dismiss-target="#badge-dismiss-yellow" aria-label="Remove">
                            <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
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

// export default PestoContentTypeDetail