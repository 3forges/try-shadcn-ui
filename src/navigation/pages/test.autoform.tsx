import { JSX } from "preact/jsx-runtime";
//import { generate } from "ts-to-zod";
// import Form from '@rjsf/core';
import TailwindForm from "@/components/rjsf"
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

import z from 'zod';
/**
 * ShadCN UI Components
 */
import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner"
/**
 * following https://autoform.vantezzen.io/docs/react/getting-started
 */
import { AutoForm } from "@/components/ui/autoform"
import { ZodObjectOrWrapped, ZodProvider } from "@autoform/zod";

/**
 * zod-reify
 */
//import { reify } from '@pesto-io/zod-reify'
/**
 * const zodSchemaParser = new reifier.ZodSchemaReifier(
 *   testCase.zodSchemaAsText
 * );
 */

/*
import { Copy, Plus as LuPlus, SaveAll as LuSaveAll } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
*/
// import { ContentTypeCard } from "./content-types/card/ContentTypeCard";
// import { PestoContentTypeContextProvider } from "./content-types/ContentTypeContext";
import React, { useContext, useEffect, useState } from "preact/compat";
import { useContentTypeDetailQuery, useContentTypeListQuery, useConvertTsToJSonSchemaMutation, useConvertTsToZodMutation, useUpdateContentTypeMutation } from "@/api/endpoints";
import { PestoContentTypeContext } from "./content-types/ContentTypeContext";
import { Button } from "react-day-picker";
import { Button as ShadCnBtn } from "@/components/ui/button"

import { PestoContentTypeApiEntity } from "@/api/entities/PestoContentTypeApiEntity";



///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///// QUICK CONTENT TYPE LIST
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

export function QuickPestoContentTypeList(): React.JSX.Element {
  const {
      data: contentTypeList,
      isError: contentTypeListQueryIsError,
      isFetching: contentTypeListQueryIsFetching,
      isLoading: contentTypeListQueryIsLoading,
      isSuccess: contentTypeListQueryIsSuccess,
      // isUninitialized: contentTypeDetailQueryIsUninitialized,
      // requestId: contentTypeDetailQueryRequestId
  } = useContentTypeListQuery();
  
  return (
    <>
<div className="p-2">
            <h2>Quick ContentType List</h2>
            {/* ----------------------PROJECT DETAIL------------------- */}

            {contentTypeListQueryIsLoading ? (
                <Spinner aria-label="Loading..." />
            ) : (``)
            }
            {contentTypeListQueryIsFetching ? (
                <Spinner aria-label="Fetching..." />
            ) : (``)
            }
            {contentTypeListQueryIsError ? (
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

                {contentTypeListQueryIsSuccess && contentTypeList ? (
                  contentTypeList.map((contentTypeEntry: PestoContentTypeApiEntity) => {
                    return (
                      <ShadCnBtn
                      variant={"link"}
                      asChild
                     >
                       <a href={`/tests-autoform-detail/${contentTypeEntry._id}`}>{contentTypeEntry.name}: {contentTypeEntry.description}</a>
                     </ShadCnBtn>
                    )
                  })

                ) : (
                    <span id="badge-dismiss-yellow" class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        The ContentType List API request did not successfully completed yet...
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
    </>
  )
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///// UPDATE CONTENT TYPE CARD
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

export interface UpdatePestoContentTypeCardProps {
  content_type_id_param: string
}
/**
 * This component will use autoform, to spin up a form, from
 * a pesto content type:
 * - 
 * 
 * @returns The React Component
 */
export function UpdatePestoContentTypeCard({ content_type_id_param }: UpdatePestoContentTypeCardProps): React.JSX.Element {
  console.log(`[UpdatePestoContentTypeCard] - content_type_id_param: `, content_type_id_param)
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
    
    const [reifiedSchema, setReifiedSchema] = useState<RJSFSchema>({});



    
    const [
    updateContentType,
    /*
    {
        data: updatedContentType,
        isLoading: updatingContentType,
        // isUninitialized,
        isSuccess: contentTypeUpdateSuccess,
        isError: contentTypeUpdateError
    }
    */
    ] = useUpdateContentTypeMutation();

    /**
     * ***********************************
     */
    const [
        convertTsToJSonSchema,
        {
            data: tsInterfaceConvertedToJSonSchema,
            isLoading: convertingToJSonSchema,
            // isUninitialized,
            isSuccess: conversionToJSonSchemaSuccess,
            isError: conversionToJSonSchemaError
            }
            /*
            */
    ] = useConvertTsToJSonSchemaMutation();
    /**
     * zodSchemaOfTheFrontmatter will 
     * be the Zod Schema of the converted
     */
    /*let frontmatterZodSchemaAsStr = */

    useEffect(() => {
      if (contentTypeDetailQueryIsSuccess) {
        convertTsToJSonSchema({
            v_tsInterfaceAsStr: contentTypeDetail.frontmatter_definition
        })
      } else {
        console.log(` [useEffect] [contentTypeDetailQueryIsSuccess] - contentTypeDetailQueryIsSuccess = [${contentTypeDetailQueryIsSuccess}]`)
      }
    }, [contentTypeDetailQueryIsSuccess])
    useEffect(() => {
        if(contentTypeDetailQueryIsSuccess && conversionToJSonSchemaSuccess) {
            // frontmatterZodSchemaAsStr.data?.schema
            console.log(`The typescript interface frontmatter definition was successfully converted to the following json schema:  [${JSON.stringify(tsInterfaceConvertedToJSonSchema.schema, null, 2)}]`)
            // const newlyReifiedSchema = jsonSchemaToZod(JSON.parse(tsInterfaceConvertedToJSonSchema.schema), { name: "mySchema", module: "esm", type: true });// unfortunately, jsonSchemaToZod also returns a string, not a zod Object.
            let fm_def_json_schema = JSON.parse(JSON.stringify(tsInterfaceConvertedToJSonSchema.schema, null, 2));
            const tsInterfaceName = contentTypeDetail.frontmatter_definition.substring(0, contentTypeDetail.frontmatter_definition.indexOf('{') + 1).replace(`export`, ``).replace(`interface`, ``).replace(`{`, ``).trim();
            fm_def_json_schema = fm_def_json_schema["definitions"][`${tsInterfaceName}`]
            console.log(`tsInterfaceName is :  [${tsInterfaceName}]`)
            console.log(`tsInterfaceName is :  [${tsInterfaceName}]`)
            console.log(`fm_def_json_schema is :  [${JSON.stringify({ fm_def_json_schema: fm_def_json_schema}, null, 2)}]`)
            
            // delete fm_def_json_schema["$ref"]
            const formSchema: RJSFSchema = {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                project_id: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                frontmatter_definition: fm_def_json_schema,
              },
            };
            setReifiedSchema(formSchema);
        } else {
          console.log(` [useEffect] [contentTypeDetailQueryIsSuccess, conversionToJSonSchemaSuccess, conversionToJSonSchemaError, convertingToJSonSchema] : contentTypeDetailQueryIsSuccess=[${contentTypeDetailQueryIsSuccess}], conversionToJSonSchemaSuccess=[${conversionToJSonSchemaSuccess}]`)
        }
        if(conversionToJSonSchemaError) {
            console.log(`An Error occured converting ts interface to zod schema // conversionToJSonSchemaError has just changed its value to: [${conversionToJSonSchemaError}]`)
        }
        if(convertingToJSonSchema) {
            console.log(`convertingToJSonSchema (loading conversion to zod) has just changed its value to: [${convertingToJSonSchema}]`)
        }
    }, [contentTypeDetailQueryIsSuccess, conversionToJSonSchemaSuccess, conversionToJSonSchemaError, convertingToJSonSchema])

    
    let zodSchemaOfTheFrontmatter = z.object({
        name: z.string(),
        items_in_stock: z.number(),
        description: z.string(),
    });
    
    // pestoContentTypeContext.contentTypeContextApiEntity.frontmatter_definition
    let zodSchemaOfTheContentType = z.object({
        _id: z.number(),
        name: z.string(),
        project_id: z.string(),
        frontmatter_definition: zodSchemaOfTheFrontmatter,
        description: z.string(),
        createdAt: z.string(),
    });

    // const schemaProvider = new ZodProvider(zodSchemaOfTheContentType);
    return (
    <>

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
                  <TailwindForm schema={reifiedSchema} validator={validator} />


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

    </>
    )
}

/**
 * Utilities for ts-to-zod usage
 * OK:
 * -> I have done a few tests, and definitely:
 *   + ts-to-zod will return a string, not a zod schema Instance
 *   + ts-to-zod is made to work on local files, which makes it impossible to use in browser directly
 * 
 * So instead, I will have to:
 *   + have an api endpoint in pesto api, that does exactly same as https://github.com/ritz078/transform/blob/c6e0748bad06a31373e2a8324a764e9467646742/pages/api/typescript-to-zod.ts#L17
 *   + and on browser side, I will have to use my zod-reify package, definitely
 *   + note: in the ts-to-zod package, i may find useful source code to resolve dependencies
 * 
 * So, for me to be able to use autoform, i will HAVE, to 
 * make sure zod-reify is able to work in browser
 * 
 */
