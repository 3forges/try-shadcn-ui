/**
 * External imports
 */
import { KeyRound as LuKeyRound, SaveAll as LuSaveAll, BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon, BellIcon, Plus as LuPlus } from 'lucide-react';
import { TargetedEvent } from 'preact/compat';
import { useContext, useState, useEffect } from 'preact/hooks';
import { toast } from 'sonner';
/**
 * Shadcn-ui imported components
 */
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"
import { Input as TextInput } from "@/components/ui/input"

/**
 * Internal imports
 */
import { useProjectListQuery, useUpdateContentTypeMutation } from '@/api/endpoints';
import { PestoProjectApiEntity } from '@/api/entities/PestoProjectApiEntity';
import { FrontmatterInput } from './FrontmatterInput';
import { PestoContentTypeContext, FrontmatterField } from '../ContentTypeContext';
import { PestoContentTypeContextEntityUtils } from '../utils/ContentTypeContextUtils';

interface ContentTypeListCardEditModeOnProps {
  //contentType: PestoContentTypeApiEntity
  setIsEditModeOnHook: Function
  showButtons?: boolean
  showTitle?: boolean
  showGeneratedFields?: boolean
}


export function ContentTypeCardEditModeOn({ setIsEditModeOnHook, showButtons = true, showTitle = true, showGeneratedFields = true }: ContentTypeListCardEditModeOnProps): JSX.Element {

  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeCard] - [pestoContentTypeContext] is null or undefined!`)
  }
  /**
   * frontmatterFieldList : 
   * So that's the list of fields in frontmatter
   * for each field there is a component including
   * one input for the name, and one select for the
   * type chosen among string, boolean, or number (date and image are not supported yet, I start very simple)
   * - 
   * Its inital value will be set by transforming the
   * FrontMatter Type retrieved from database in the
   * form of a typescript interface...
   */
  let initialFrontmatterFieldInputListArr = []
  for (let index = 0; index < pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition.length; index++) {
    const fmField = pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition[index];
    initialFrontmatterFieldInputListArr.push(<FrontmatterInput field_index={index} name={fmField.name} fmType={fmField.fmType} />)
  }
  console.log(`[ContentTypeCardEditModeOn] - [initialFrontmatterFieldInputListArr] =`, initialFrontmatterFieldInputListArr)
  const [frontmatterFieldInputList, setFrontmatterFieldInputList] = useState<any[]>(initialFrontmatterFieldInputListArr);


  /**
   * 
   * @param event 
   * 
   * Ref. notes:
   * Interesting about [event.persist()] - any hook that sets a state, provokes interferences with an event handler, cf. https://stackoverflow.com/questions/58106099/react-onclick-not-firing-on-first-click-second-click-behaves-as-expected-simpl
   */
  const handleAddFrontMatterFieldInput = (event: { target: { value: any; }; } | any) => {
    // const handleAddFrontMatterFieldInput = () => {
    event.persist();
    console.log(` handleAddFrontMatterFieldInput - begin call `)

    const newfmField: FrontmatterField = {
      name: "Default field name",
      fmType: "fmUnSelectedType"
    }
    console.log(` handleAddFrontMatterFieldInput - [pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition] BEFORE adding new field: `, JSON.stringify(pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition, null, 4))
    // const newfrontmatterFieldListArr = [...frontmatterFieldList]
    const newfrontmatterFieldListArr = [
      ...pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition
    ]
    newfrontmatterFieldListArr.push(newfmField)
    // .concat();
    // setFrontmatterFieldList(newfrontmatterFieldListArr);
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      frontmatter_definition: newfrontmatterFieldListArr
    })
    // console.log(` handleAddFrontMatterFieldInput - frontmatterFieldList AFTER adding new field: `, frontmatterFieldList)
    console.log(` handleAddFrontMatterFieldInput - [pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition] AFTER adding new field: `, JSON.stringify(pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition, null, 4))


    const newfrontmatterFieldInputListArr = [...frontmatterFieldInputList]
    newfrontmatterFieldInputListArr.push(<FrontmatterInput field_index={pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition.length} />)
    setFrontmatterFieldInputList(newfrontmatterFieldInputListArr);
  };
  /**
   * +++++++++++++++++++++++++++++++++++++++++
   * +++++++++++++++++++++++++++++++++++++++++
   * +++++++++++++++++++++++++++++++++++++++++
   * Event handlers to update state variables:
   * +++++++++++++++++++++++++++++++++++++++++
   * +++++++++++++++++++++++++++++++++++++++++
   * +++++++++++++++++++++++++++++++++++++++++
   **/
  const handleNameChange = (event: { target: { value: any; }; } | any) => {
    // event.persist();
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      name: event.target.value
    });
  };
  const handleDescChange = (event: TargetedEvent<HTMLSelectElement, Event> | any) => {
    console.log(` handleDescChange -> event.target = [${event.target}]`)
    console.log(` handleDescChange -> event.target = `, event.target)
    console.log(` handleDescChange -> event.currentTarget = `, event.currentTarget)
    console.log(` handleDescChange -> event.target.value = `, event.target?.value)
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      description: event.target.value
    });
  };

  /**
   * Here a problem: one handler for the onChange of all of the array of Frontmatter fields? 
   * @param event 
   */

  const handleProjectIdChange = (event: TargetedEvent<HTMLSelectElement, Event> | any) => {
    console.log(` handleProjectIdChange -> event.target = [${event.target}]`)
    console.log(` handleProjectIdChange -> event.target = `, event.target)
    console.log(` handleProjectIdChange -> event.currentTarget = `, event.currentTarget)
    console.log(` handleProjectIdChange -> event.target.value = `, event.target?.value)
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      project_id: event.target?.value
    });
  };
  const { data: pestoProjectListData = [], isLoading, isError, isUninitialized, isSuccess } = useProjectListQuery()
  if (isLoading || isUninitialized) {
    return (<div>
      <Alert className={`m-5`}><Spinner aria-label="Loading..." className={`rounded bg-cyan-300 text-yellow-300 p-1 ml-2 mr-2`} />Loading <code>Pesto Content Types</code> ...</Alert>
    </div>
    )

  }
  if (isError) {
    return (<div>
      <Alert>something went wrong fetching Pesto Projects for Content Type {`${pestoContentTypeContext.contentTypeContextEntity.name}`} !</Alert>
    </div>)
  }

  const showProjectsItemsLoadedFailureToast = () => {
    toast("An Error occured trying to load Projects ...", {
      description: `An Error occured trying to load Projects ...`,
      action: {
        label: "Error",
        icon: <LuErrorIcon className="h-5 w-5" />,
        onClick: () => console.log(`An Error occured trying to load Projects ...`),
      },
    })
  }
  useEffect(() => {
    /**
     * 
     */
    
    showProjectsItemsLoadedFailureToast()
  }, [isError]);

  const [
    updateContentType,
    {
      data: updatedContentType,
      isLoading: updatingContentType,
      /* isUninitialized,*/
      /* isSuccess */
      isSuccess: contentTypeUpdateSuccess,
      isError: contentTypeUpdateError
    }
  ] = useUpdateContentTypeMutation();

  const isInExistingProjectsIDs = (project_id: string, fetchedPestoProjectListData: PestoProjectApiEntity[]): boolean => {
    const existingProjectsIds: string[] = []
    fetchedPestoProjectListData.forEach((project: PestoProjectApiEntity) => {
      existingProjectsIds.push(`${project._id}`)
    })

    let toReturn: boolean = false;
    for (let index = 0; index < existingProjectsIds.length; index++) {
      if (existingProjectsIds[index] == project_id) {
        return true
      }
    }
    // throw new Error(`[ContentTypeCardEditModeOn] - [isInExistingProjectsIDs] - Not implemented exception`)
    return toReturn;
  }

  /**
   * This method initializes the [project_id]
   * property of a Pesto
   */
  const initContextDependencies = (fetchedPestoProjectListData: PestoProjectApiEntity[]) => {
    if (fetchedPestoProjectListData.length == 0) {
      throw new Error(`[ContentTypeCardEditModeOn] - [initContextDependencies] - there are zero existing project, wo it is impossible to set a default project ID for the Context - [PestoContentType.name] = [${pestoContentTypeContext.contentTypeContextEntity.name}]`)
    }
    const isContextProjectIdAnExistingProjectsID = isInExistingProjectsIDs(`${pestoContentTypeContext.contentTypeContextEntity.project_id}`, fetchedPestoProjectListData)
    if (!isContextProjectIdAnExistingProjectsID) {
      console.log(`[ContentTypeCardEditModeOn] - [initContextDependencies] - restting [project_id] of the context, its value is [${pestoContentTypeContext.contentTypeContextEntity.project_id}], and it will be reset to [${fetchedPestoProjectListData[0]._id}]`)
      pestoContentTypeContext.setContentTypeContextEntity({
        ...pestoContentTypeContext.contentTypeContextEntity,
        project_id: `${fetchedPestoProjectListData[0]._id}`
      })
    }
  }

  const showProjectsItemsLoadedSuccessToast = () => {
    toast("Projects have successfully been loaded.", {
      description: `Projects have successfully been loaded.`,
      action: {
        label: "Success",
        icon: <BellIcon className="h-5 w-5" />,
        onClick: () => console.log(`Projects have successfully been loaded.`),
      },
    })
  }

  useEffect(() => {
    /**
     * 
     */
    initContextDependencies(pestoProjectListData)
    showProjectsItemsLoadedSuccessToast()
  }, [isSuccess]);
  const showContentTypeUpdatedSuccessToast = () => {
    toast("Content-Type successfully updated", {
      description: `Content-Type [${updatedContentType?.name}], of id [${updatedContentType?._id}] has successfully been updated.`,
      action: {
        label: "Success",
        icon: <BellIcon className="h-5 w-5" />,
        onClick: () => console.log(`Content-Type has successfully been updated.`),
      },
    })
  }
  
  useEffect(() => {
    showContentTypeUpdatedSuccessToast()
  }, [contentTypeUpdateSuccess])

  const showContentTypeUpdateErrorToast = () => {
    toast("Content-Type Update Error!", {
      description: `An Error occured trying to update Content-Type [${pestoContentTypeContext.contentTypeContextEntity.name}], of id [${pestoContentTypeContext.contentTypeContextEntity._id}] !`,
      action: {
        label: "Error",
        icon: <LuErrorIcon className="h-5 w-5" />,
        onClick: () => console.log(`Content-Type has successfully been updated.`),
      },
    })
  }
  
  useEffect(() => {
    showContentTypeUpdateErrorToast()
  }, [contentTypeUpdateError])
  

  return (
    <>
      <section class="bg-cyan-500 dark:bg-cyan-300  rounded-lg">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          {showTitle ? (<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Content Type</h2>) : (<></>)}
          <form action="#">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                {showGeneratedFields ? (
                  <>
                    <div class="flex justify-between items-center mb-5 text-gray-500">
                      <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                        <LuKeyRound className={`mx-2`} />
                        {pestoContentTypeContext.contentTypeContextEntity._id}
                      </span>
                      <span class="text-sm">Created at: {pestoContentTypeContext.contentTypeContextEntity.createdAt}</span>
                    </div>
                  </>
                ) : (
                  <>
                  </>
                )
                }



              </div>

              <div class="sm:col-span-2">
                <label for={`input_name_${pestoContentTypeContext.contentTypeContextEntity._id}`} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <TextInput
                  type="text"
                  name="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                  required={true}
                  id={`input_name_${pestoContentTypeContext.contentTypeContextEntity._id}`}
                  value={pestoContentTypeContext.contentTypeContextEntity.name || "Type product name"}
                  onChange={handleNameChange}
                />
              </div>




              <div class="sm:col-span-2">
                <label for="project_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project</label>
                <select
                  onChange={handleProjectIdChange}
                  id="project_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >

                  {(isLoading || isUninitialized) ? (
                    <div>
                      <Alert className={`m-5`}><Spinner aria-label="Loading..." className={`rounded bg-cyan-300 text-yellow-300 p-1 ml-2 mr-2`} />Loading <code>Pesto Content Types</code> ...</Alert>
                    </div>

                  ) : (
                    <></>
                  )
                  }
                  {
                    // TODO: if there are  projects created
                    /**
                     * Then we must have an error preventing
                     * the user from trying to create a pesto
                     * content type:
                     * otherwise, it is not possible to 
                     * display a drop down list of projects you can select
                     * 
                     * - 
                     * Note 1. 
                     * The (pestoProjectListData[0]._id !== `0`)
                     * condition below does not make sense anymore
                     * --
                     */
                  }
                  {pestoProjectListData &&
                    pestoProjectListData[0] &&
                    pestoProjectListData[0]._id !== `0` &&
                    pestoProjectListData.map((project: PestoProjectApiEntity, index: number) => {
                      return (
                        <option
                          value={`${project._id}`}
                          selected={(`${project._id}` == `${pestoContentTypeContext.contentTypeContextEntity.project_id}`)}
                        >{`${project.name} (ID: ${project._id})`}
                        </option>
                      )
                    }
                    )}

                </select>
              </div>
              <div class="sm:col-span-2">
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea
                  id="description"
                  rows={8}
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                  onChange={handleDescChange}
                >{pestoContentTypeContext.contentTypeContextEntity.description}</textarea>
              </div>

              <hr class="sm:col-span-2" />

              <h4 class="sm:col-span-2 mb-4 text-md font-bold text-gray-900 dark:text-white">Frontmatter</h4>
              <div class="sm:col-span-2 inline-flex shadow-sm">
                <button
                  type="button"
                  onClick={handleAddFrontMatterFieldInput}
                  class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <LuPlus />
                </button>
              </div>

              {
                frontmatterFieldInputList
              }

              <hr class="sm:col-span-2" />
            </div>
            {showButtons ?
              (
                <>
                  <Button
                    className={`mt-2`}
                    type="submit"
                    onClick={async () => {
                      console.log(` >> CLICK UPDATE: `)
                      // const id: any = `${contentType._id}`
                      // const name: any = await document.getElementById(`input_name_${contentType._id}`)
                      // const project_id: any = await document.getElementById(`input_project_id_${contentType._id}`)
                      // const frontmatter_definition: any = await document.getElementById(`input_frontmatter_definition_${contentType._id}`)
                      // const desc: any = await document.getElementById(`input_description_${contentType._id}`)

                      // const created: any = `${contentType.createdAt}`
                      // console.log(` Content Type Edit - id = [${id}]`)
                      // console.log(` Content Type Edit - name = [${name.value}]`)
                      // console.log(` Content Type Edit - desc = [${desc.value}]`)
                      // console.log(` Content Type Edit - project_id = [${project_id.value}]`)
                      // console.log(` Content Type Edit - frontmatter_definition = [${frontmatter_definition.value}]`)
                      // console.log(` Content Type Edit - created = [${created}]`)
                      // const V: any = document.getElementById(`${inputValue["_id"]+"__v"}`)
                      /*const editedContentType: PestoContentTypeApiEntity = {
                        _id: editedContentType,
                        name: name.value,
                        description: desc.value,
                        project_id: project_id.value,
                        frontmatter_definition: frontmatter_definition.value,
                        createdAt: created,
                        // __v: Math.floor(V.value*1),
                      }*/
                      console.log("editedContentType: ", pestoContentTypeContext.contentTypeContextEntity)
                      await updateContentType({
                        _id: `${pestoContentTypeContext.contentTypeContextEntity._id}`,
                        name: pestoContentTypeContext.contentTypeContextEntity.name,
                        description: pestoContentTypeContext.contentTypeContextEntity.description,
                        project_id: pestoContentTypeContext.contentTypeContextEntity.project_id,
                        frontmatter_definition: PestoContentTypeContextEntityUtils.convertContextToApiEntity(pestoContentTypeContext.contentTypeContextEntity).frontmatter_definition,
                        createdAt: pestoContentTypeContext.contentTypeContextEntity.createdAt,
                      })
                      await setIsEditModeOnHook(false);
                      console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
                      console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
                      console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
                      console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - !`)
                      // console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseData = [${JSON.stringify(updatedContentTypeResponseData, null, 4)}]`)
                      // console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsError = [${JSON.stringify(updatedContentTypeResponseIsError, null, 4)}]`)
                      // console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsFetching = [${JSON.stringify(updatedContentTypeResponseIsFetching, null, 4)}]`)
                      // console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsLoading = [${JSON.stringify(updatedContentTypeResponseIsLoading, null, 4)}]`)
                      // console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsSuccess = [${JSON.stringify(updatedContentTypeResponseIsSuccess, null, 4)}]`)
                      // console.log(` REDUX RTK - dans [ContentTypeCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsUninitialized = [${JSON.stringify(updatedContentTypeResponseIsUninitialized, null, 4)}]`)

                      console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
                      console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
                      console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)

                    }}
                  >
                    <LuSaveAll />

                    Update

                    {updatingContentType && (
                      <Spinner className={``} aria-label="Updating project..." />
                    ) || (
                        <span></span>
                      )}

                  </Button>

                </>
              ) : (
                <>

                </>
              )
            }


          </form>
        </div>
      </section>
    </>
  )

}
