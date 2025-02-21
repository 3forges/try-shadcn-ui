import { useContext, useEffect, useState } from "preact/hooks";

import { Input as TextInput } from "@/components/ui/input"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  


// import { Spinner } from "flowbite-react"
import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"

import { KeyRound as LuKeyRound, SaveAll as LuSaveAll, BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon, BellIcon, Plus as LuPlus } from 'lucide-react';
import { useDeleteContentTypeMutation, useProjectListQuery, useUpdateContentTypeMutation } from "../../../api/endpoints"
import { PestoProjectApiEntity } from "../../../api/entities/PestoProjectApiEntity";
import { JSX, TargetedEvent } from "preact/compat";
import { fmBooleanType, fmNumberType, fmStringType, fmUnSelectedType, PestoContentTypeContextEntityUtils } from "./utils/ContentTypeContextUtils";
import { FrontmatterField, FrontMatterFieldType, IPestoContentTypeContext } from "./ContentTypeContext";

/**
 * Context imports
 */

import { PestoContentTypeContext } from './ContentTypeContext'

interface ContentTypeListCardProps {
  // contentType: PestoContentTypeApiEntity
  isEditModeOn?: boolean
  showButtons?: boolean
  showTitle?: boolean
  showGeneratedFields?: boolean
}
interface ContentTypeListCardEditModeOnProps {
  //contentType: PestoContentTypeApiEntity
  setIsEditModeOnHook: Function
  showButtons?: boolean
  showTitle?: boolean
  showGeneratedFields?: boolean
  //setContentTypeHook: Function
}

export interface FrontmatterInputProps {
  field_index: number,
  name?: string,
  fmType?: FrontMatterFieldType,
  // setFrontmatterFieldListState: FrontmatterField[],
  // setFrontmatterFieldListHook: Function
}
export function FrontmatterInput({ field_index, name: p_name = "", fmType: p_fmType = "fmUnSelectedType"/*, setFrontmatterFieldListState, setFrontmatterFieldListHook*/ }: FrontmatterInputProps): JSX.Element {
  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeListCard] - [pestoContentTypeContext] is null or undefined!`)
  }
  // const [field_index_in_array, setField_index_in_array] = useState<number>(field_index)
  const [name, setName] = useState<string>(p_name)
  const [fmType, setFmType] = useState<string>(p_fmType)

  const handleFrontmatterFieldNameChange = (event: { target: { value: any; }; } | any) => {
    // event.persist()
    console.log(` handleFrontmatterFieldNameChange -> event.target.value = `, event.target?.value)
    console.log(` handleFrontmatterFieldNameChange -> field_index = `, field_index)
    setName(event.target?.value);
    // console.log(` handleFrontmatterFieldNameChange -> setFrontmatterFieldListState = `, JSON.stringify(pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition, null, 4))
    console.log(` handleFrontmatterFieldNameChange -> [pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition] = `, JSON.stringify(pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition, null, 4))
    
    let newArr = [...pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition]; // copying the old datas array
    console.log(` handleFrontmatterFieldNameChange -> newArr = `, newArr)
    console.log(` handleFrontmatterFieldNameChange -> newArr.length = `, newArr.length)
    console.log(` handleFrontmatterFieldNameChange -> newArr[field_index] = `, newArr[field_index])
    
    
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[field_index].name = event.target.value;
    
    // setFrontmatterFieldListHook(newArr)
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      frontmatter_definition: newArr
    })
  };

  const handleFrontmatterFieldTypeChange = (event: TargetedEvent<HTMLSelectElement, Event> | any) => {
    console.log(` handleFrontmatterFieldTypeChange -> event.target = [${event.target}]`)
    console.log(` handleFrontmatterFieldTypeChange -> event.target = `, event.target)
    console.log(` handleFrontmatterFieldTypeChange -> event.currentTarget = `, event.currentTarget)
    console.log(` handleFrontmatterFieldTypeChange -> event.target.value = `, event.target?.value) // there is a compilation error on value, but yet the selected value is indeed retrieved, the project id of the selected project.
    let newFrontmatterFieldTypeValue: FrontMatterFieldType;

    switch (event.target?.value) {
      case fmStringType: {
        console.log(` handleFrontmatterFieldTypeChange -> IN SWITCH on [event.target.value] = [${event.target?.value}], the selected SWITCH OPTION is indeed [fmStringType]`)
        newFrontmatterFieldTypeValue = "fmString"
        //statements; 
        break;
      }
      case fmBooleanType: {
        console.log(` handleFrontmatterFieldTypeChange -> IN SWITCH on [event.target.value] = [${event.target?.value}], the selected SWITCH OPTION is indeed [fmBooleanType]`)
        newFrontmatterFieldTypeValue = "fmBoolean"
        //statements; 
        break;
      }
      case fmNumberType: {
        console.log(` handleFrontmatterFieldTypeChange -> IN SWITCH on [event.target.value] = [${event.target?.value}], the selected SWITCH OPTION is indeed [fmNumberType]`)
        newFrontmatterFieldTypeValue = "fmNumber"
        //statements; 
        break;
      }
      case fmUnSelectedType: {
        console.log(` handleFrontmatterFieldTypeChange -> IN SWITCH on [event.target.value] = [${event.target?.value}], the selected SWITCH OPTION is indeed [fmUnSelectedType]`)
        newFrontmatterFieldTypeValue = "fmUnSelectedType"
        //statements; 
        break;
      }
      default: {
        //statements;
        console.log(` handleFrontmatterFieldTypeChange -> IN SWITCH on [event.target.value] = [${event.target?.value}], the selected SWITCH OPTION is indeed [DEFAULT]`)
        throw new Error(`handleFrontmatterFieldTypeChange -> Cannot determine which frontmatter field type from selected [${event.target?.value}]`)
        //break; 
      }
    }
    setFmType(newFrontmatterFieldTypeValue);
    console.log(` handleFrontmatterFieldTypeChange -> pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition = `, JSON.stringify(pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition, null , 4))
    console.log(` handleFrontmatterFieldTypeChange -> field_index = `, field_index)
    
    let newArr = [...pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[field_index].fmType = newFrontmatterFieldTypeValue;
    
    // setFrontmatterFieldListHook(newArr)
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      frontmatter_definition: newArr
    })
  };


  return (
    <>
      {
        /*
        <div class="w-full">
          <label for="fmFieldName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Field name</label>
          <input type="text" name="fmFieldName" id="fmFieldName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Field Name" required={true} />
        </div>
        */
      }

      <div class="w-full">
        <label for="fmFieldName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Field name</label>
        <TextInput
          type="text"
          name={`fmFieldName_${field_index}`}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Type Field Name"
          required={true}
          id={`fmFieldName_${field_index}`}
          value={name || "Type Field Name"}
          onChange={handleFrontmatterFieldNameChange}
        />
      </div>
      <div>
        <label for={`fmFieldType_select_${field_index}`} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Field Type</label>
        <select
          onChange={handleFrontmatterFieldTypeChange}
          id={`fmFieldType_select_${field_index}`}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
          <option selected={(fmType == fmUnSelectedType)}>Select Field Type</option>
          <option selected={(fmType == fmStringType)} value={fmStringType}>String</option>
          <option selected={(fmType == fmBooleanType)} value={fmBooleanType}>Boolean</option>
          <option selected={(fmType == fmNumberType)} value={fmNumberType}>Number</option>
        </select>
      </div>
    </>
  )
}

export function ContentTypeListCardEditModeOnRedesigned({ setIsEditModeOnHook, showButtons = true, showTitle = true, showGeneratedFields = true }: ContentTypeListCardEditModeOnProps): JSX.Element {
  
  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeListCard] - [pestoContentTypeContext] is null or undefined!`)
  }
  /**
   * frontmatterFieldList : 
   * so that's the list of fields in frontmatter
   * for each field there is a component including one input for the name, and one select for the type chosen among string, boolean, or number (date and image are not supported yet, I start very simple)
   * 
   * its inital value will be set by transforming the FrontMatter Type retrieved from database in the form of a typescript interface...
   */
  let initialFrontmatterFieldInputListArr = []
  for (let index = 0; index < pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition.length; index++) {
    const fmField = pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition[index];
    initialFrontmatterFieldInputListArr.push(<FrontmatterInput field_index={index} name={fmField.name} fmType={fmField.fmType} />)
  }
  console.log(`[ContentTypeListCardEditModeOnRedesigned] - [initialFrontmatterFieldInputListArr] =`, initialFrontmatterFieldInputListArr)
  const [frontmatterFieldInputList, setFrontmatterFieldInputList] = useState<any[]>(initialFrontmatterFieldInputListArr);
  
  /*
  const [frontmatterFieldList, setFrontmatterFieldList] = useState<FrontmatterField[]>([
    ...pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition
  ]);
  */

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
  // Event handlers to update state variables
  const handleNameChange = (event: { target: { value: any; }; } | any) => {
    // event.persist();
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      name: event.target.value
    });
  };
  // const handleDescChange = (event: { target: { value: any; }; }) => {
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
   * here a problem: one handler for the onChange of all of the array of Frontmatter fields? 
   * @param event 
   */
  /*
  const handleFrontmatterDefChange = (event: { target: { value: any; }; }) => {
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      frontmatter_definition: event.targe t.value
    });
  };
  */


  // const handleProjectIdChange = (event: { target: any; }) => {
  const handleProjectIdChange = (event: TargetedEvent<HTMLSelectElement, Event> | any) => {
    // const handleProjectIdChange = (event: { target: { value: any; }; }) => {
    // const handleProjectIdChange = (project_id: string) => {
    console.log(` handleProjectIdChange -> event.target = [${event.target}]`)
    console.log(` handleProjectIdChange -> event.target = `, event.target)
    console.log(` handleProjectIdChange -> event.currentTarget = `, event.currentTarget)
    console.log(` handleProjectIdChange -> event.target.value = `, event.target?.value) // there is a compilation error on value, but yet the selected value is indeed retrieved, the project id of the selected project.
    // console.log(` handleProjectIdChange -> value = `, value)
    pestoContentTypeContext.setContentTypeContextEntity({
      ...pestoContentTypeContext.contentTypeContextEntity,
      // project_id: project_id
      // project_id: event.target.value
      project_id: event.target?.value
    });
  };
  /*
  const [
    updateContentType,
    {
      data: updatedContentType,
      isLoading: updatingContentType,
      // isUninitialized,
      isSuccess
    }
  ] = useUpdateContentTypeMutation();
  */
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
  const [
    updateContentType,
    {
      data: updatedContentType,
      isLoading: updatingContentType,
      /* isUninitialized,*/
      /* isSuccess */
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
    // throw new Error(`[ContentTypeListCardEditModeOnRedesigned] - [isInExistingProjectsIDs] - Not implemented exception`)
    return toReturn;
  }

  /**
   * This method initializes the [project_id]
   * property of a Pesto
   */
  const initContextDependencies = (fetchedPestoProjectListData: PestoProjectApiEntity[]) => {
    if (fetchedPestoProjectListData.length == 0) {
      throw new Error(`[ContentTypeListCardEditModeOnRedesigned] - [initContextDependencies] - there are zero existing project, wo it is impossible to set a default project ID for the Context - [PestoContentType.name] = [${pestoContentTypeContext.contentTypeContextEntity.name}]`)
    }
    const isContextProjectIdAnExistingProjectsID = isInExistingProjectsIDs(`${pestoContentTypeContext.contentTypeContextEntity.project_id}`, fetchedPestoProjectListData)
    if (!isContextProjectIdAnExistingProjectsID) {
      console.log(`[ContentTypeListCardEditModeOnRedesigned] - [initContextDependencies] - restting [project_id] of the context, its value is [${pestoContentTypeContext.contentTypeContextEntity.project_id}], and it will be reset to [${fetchedPestoProjectListData[0]._id}]`)
      pestoContentTypeContext.setContentTypeContextEntity({
        ...pestoContentTypeContext.contentTypeContextEntity,
        project_id: `${fetchedPestoProjectListData[0]._id}`
      })
    }
  }
  useEffect(() => {
    /**
     * 
     */
    initContextDependencies(pestoProjectListData)
  }, [isSuccess]);
    // 
    const showItemsLoadedSuccessToast = () => {
        toast("ContentType has been created", {
            description: `Pesto ContentType Items loaded successfully.`,
            action: {
              label: "Success",
              icon: <BellIcon className="h-5 w-5" />,
              onClick: () => console.log(`Pesto ContentType Items loaded successfully.`),
            },
          })
    }
  return (
    <>

      {isSuccess ? showItemsLoadedSuccessToast() : (<></>)}
      


      <section class="bg-cyan-500 dark:bg-cyan-300  rounded-lg">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          {showTitle?(<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Content Type</h2>):(<></>)}
          <form action="#">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                {showGeneratedFields?(
                  <>
                <div class="flex justify-between items-center mb-5 text-gray-500">
                  <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                    <LuKeyRound className={`mx-2`} />
                    {pestoContentTypeContext.contentTypeContextEntity._id}
                  </span>
                  <span class="text-sm">Created at: {pestoContentTypeContext.contentTypeContextEntity.createdAt}</span>
                </div>
                  </>
                ):(
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
            {
              /**
               *    <!-- 
               *      <button type="submit" class="my-3 mt-8 focus:outline-none text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-900">
               *       Save (Update content type)
               *      </button>
               *    -->
               */
            }

            {showButtons?
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

              //await setContentTypeHook(contentType);
              await setIsEditModeOnHook(false);
              await updateContentType({
                // ...PestoContentTypeContextEntityUtils.convertContextToApiEntity(pestoContentTypeContext.contentTypeContextEntity) // this one stil does not match the expeced type of [updateContentType]
                _id: `${pestoContentTypeContext.contentTypeContextEntity._id}`,
                name: pestoContentTypeContext.contentTypeContextEntity.name,
                description: pestoContentTypeContext.contentTypeContextEntity.description,
                project_id: pestoContentTypeContext.contentTypeContextEntity.project_id,
                frontmatter_definition: PestoContentTypeContextEntityUtils.convertContextToApiEntity(pestoContentTypeContext.contentTypeContextEntity).frontmatter_definition,
                createdAt: pestoContentTypeContext.contentTypeContextEntity.createdAt,
              })

              console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
              console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
              console.log(` # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- # --- `)
              console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - !`)
              // console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseData = [${JSON.stringify(updatedContentTypeResponseData, null, 4)}]`)
              // console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsError = [${JSON.stringify(updatedContentTypeResponseIsError, null, 4)}]`)
              // console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsFetching = [${JSON.stringify(updatedContentTypeResponseIsFetching, null, 4)}]`)
              // console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsLoading = [${JSON.stringify(updatedContentTypeResponseIsLoading, null, 4)}]`)
              // console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsSuccess = [${JSON.stringify(updatedContentTypeResponseIsSuccess, null, 4)}]`)
              // console.log(` REDUX RTK - dans [ContentTypeListCardEditModeOn] - APRES[useUpdateContentTypeMutation] - updatedContentTypeResponseIsUninitialized = [${JSON.stringify(updatedContentTypeResponseIsUninitialized, null, 4)}]`)

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

            {isSuccess && (
              <span>
                {// 
                  `${JSON.stringify(updatedContentType, null, 4)}`
                }
              </span>
            ) || (
                <span></span>
              )}







          </Button>
              
              </>
             ): (
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

















export function ContentTypeListCardEditModeOff({ showTitle = true }: ContentTypeListCardProps): JSX.Element {
  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeListCard/ContentTypeListCardEditModeOff] - [pestoContentTypeContext] is null or undefined!`)
  }
  return (
    <>
      <div class="text-left">
        <div class="px-4 sm:px-0">
          {showTitle?(<h3 class="text-base font-semibold leading-7 text-gray-900">Pesto ContentType Informations</h3>):(<></>)}
          <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">ContentType details</p>
        </div>
        <div class="mt-6 border-t border-gray-100">
          <dl class="divide-y divide-gray-100">
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">ContentType Id</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pestoContentTypeContext.contentTypeContextEntity._id}</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">ContentType Name</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pestoContentTypeContext.contentTypeContextEntity.name}</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">ContentType Creation Date</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pestoContentTypeContext.contentTypeContextEntity.createdAt}</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">ContentType Description</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pestoContentTypeContext.contentTypeContextEntity.description}</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">ContentType Project ID</dt>
              <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pestoContentTypeContext.contentTypeContextEntity.project_id}</dd>
            </div>
            <hr/>
            <div class="px-4 sm:px-0">
              <h4 class="text-base font-semibold leading-7 text-gray-900">ContentType Frontmatter</h4>
            </div>
            {
              pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition.map((fmEntry) =>{
                return (
                  <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt class="text-sm font-medium leading-6 text-gray-900">{fmEntry.name}</dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{fmEntry.fmType}</dd>
                  </div>
                )
              })
            }

            <hr/>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
              <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                  <li class="flex justify-items-start content-start justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div class="flex w-0 flex-1 justify-items-start content-start">
                      <svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                      </svg>
                      <div class="ml-4 flex min-w-0 flex-1 gap-2">
                        <span class="truncate font-medium">resume_back_end_developer.pdf</span>
                        <span class="flex-shrink-0 text-gray-400">2.4mb</span>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Download</a>
                    </div>
                  </li>
                  <li class="flex justify-items-start content-start justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div class="flex w-0 flex-1 justify-items-start content-start">
                      <svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                      </svg>
                      <div class="ml-4 flex min-w-0 flex-1 gap-2">
                        <span class="truncate font-medium">coverletter_back_end_developer.pdf</span>
                        <span class="flex-shrink-0 text-gray-400">4.5mb</span>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Download</a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
/**
 * RENDER project TO PROJECT-CARD
 * @param props
 *  project: PestoContentTypeApiEntity => data to render
 *
 *  callback: FUNCTION  => (optional) parent javascript for buttons
 * @returns PROJECT-CARD + BUTTONS (optional)
 */
export function ContentTypeListCard({isEditModeOn: p_isEditModeOn = false, showButtons = true, showTitle = true, showGeneratedFields = true}: ContentTypeListCardProps): JSX.Element {
  //console.log(props)


  // useEffect(() => {
  //   console.log(` [PestoContentTypeUI] Appel USE EFFECT [dispatch(RequestContentTypeList())]`)
  //   dispatch(RequestContentTypeList())
  // }, [dispatch])
  const [isEditModeOn, setIsEditModeOn] = useState<boolean>(p_isEditModeOn || false);
  
  // const [contentType, setContentType] = useState<PestoContentTypeApiEntity>(props.contentType);
  const pestoContentTypeContext = useContext(PestoContentTypeContext)
  if (!pestoContentTypeContext) {
    throw new Error(`[ContentTypeListCard] - [pestoContentTypeContext] is null or undefined!`)
  }
  
  const [deleteContentType, {
    data: deletedContentType,
    isError: didDeletionThrowError,
    isSuccess: hasSuccessfullyDeletedContentType,
    isLoading: isDeletingContentType,
  }] = useDeleteContentTypeMutation();
  const showDeletionSuccessToast = (pestoContentTypeContext: IPestoContentTypeContext) => {
    const contentTypeName = pestoContentTypeContext.contentTypeContextEntity.name;
    toast(`ContentType [${contentTypeName}] has been deleted.`, {
        description: `Pesto Content Type [${contentTypeName}] deleted successfully.`,
        action: {
          label: "Success",
          icon: <LuSuccessIcon className="h-5 w-5" />,
          onClick: () => console.log(`Pesto Content Type Item deleted successfully.`),
        },
      })
  }
const showDeletionFailureToast = (pestoContentTypeContext: IPestoContentTypeContext) => {
  const contentTypeName = pestoContentTypeContext.contentTypeContextEntity.name;
  toast(`Error deleting the  [${contentTypeName}] content type.`, {
      description: `An error was encountered while trying to delete the  [${contentTypeName}] content type: .`,
      action: {
        label: "Error",
        icon: <LuErrorIcon className="h-5 w-5" />,
        onClick: () => console.log(`An error was encountered while trying to delete the content type.`),
      },
    })
}
  return (
    <>
      {// READONLY MODE
      }
      <Card>
        <CardHeader>
            <CardTitle>ContentType List Card</CardTitle>
            <CardDescription>ContentType Details</CardDescription>
        </CardHeader>
        <CardContent>
        {isEditModeOn && (
           /**
            * <ContentTypeListCardEditModeOn setIsEditModeOnHook={setIsEditModeOn} />
            */
           <ContentTypeListCardEditModeOnRedesigned setIsEditModeOnHook={setIsEditModeOn} showButtons={showButtons} showTitle={showTitle} showGeneratedFields={showGeneratedFields} />
         ) || (
           <ContentTypeListCardEditModeOff />
         )
        }


            {showButtons?
             (
              <>
        <div class="grid grid-cols-2 gap-2 z-0 p-3">
          <Button
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
            {hasSuccessfullyDeletedContentType && showDeletionSuccessToast(pestoContentTypeContext)  || (<></>)}
            {didDeletionThrowError && showDeletionFailureToast(pestoContentTypeContext)  || (<></>)}
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
