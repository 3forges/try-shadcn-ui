import { JSX } from "preact/jsx-runtime";
import { generate } from "ts-to-zod";
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
import { reify } from '@pesto-io/zod-reify'
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
import { useContentTypeDetailQuery, useContentTypeListQuery, useConvertTsToZodMutation, useUpdateContentTypeMutation } from "@/api/endpoints";
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
    
    const [reifiedSchema, setReifiedSchema] = useState<ZodObjectOrWrapped>(z.object({}));
    const [schemaProvider, setSchemaProvider] = useState<ZodProvider<ZodObjectOrWrapped>>();


    
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
        convertTsToZod,
        {
            data: tsInterfaceConvertedToZod,
            isLoading: convertingToZod,
            // isUninitialized,
            isSuccess: conversionToZodSuccess,
            isError: conversionToZodError
            }
            /*
            */
    ] = useConvertTsToZodMutation();
    /**
     * zodSchemaOfTheFrontmatter will 
     * be the Zod Schema of the converted
     */
    /*let frontmatterZodSchemaAsStr = */

    useEffect(() => {
      if (contentTypeDetailQueryIsSuccess) {
        convertTsToZod({
            v_tsInterfaceAsStr: contentTypeDetail.frontmatter_definition
        })
      } else {
        console.log(` [useEffect] [contentTypeDetailQueryIsSuccess] - contentTypeDetailQueryIsSuccess = [${contentTypeDetailQueryIsSuccess}]`)
      }
    }, [contentTypeDetailQueryIsSuccess])
    useEffect(() => {
        if(contentTypeDetailQueryIsSuccess && conversionToZodSuccess) {
            // frontmatterZodSchemaAsStr.data?.schema
            console.log(`The typescript interface frontmatter definition was successfully converted to the following zod schema:  [${tsInterfaceConvertedToZod.schema}]`)
            const zodSchemaParser = new reify.ZodSchemaReifier(
              tsInterfaceConvertedToZod.schema
            );
            setReifiedSchema(zodSchemaParser.reify());
            setSchemaProvider(new ZodProvider(z.object({
              _id: z.number(),
              name: z.string(),
              project_id: z.string(),
              description: z.string(),
              frontmatter_definition: reifiedSchema
            })))
        } else {
          console.log(` [useEffect] [contentTypeDetailQueryIsSuccess, conversionToZodSuccess, conversionToZodError, convertingToZod] : contentTypeDetailQueryIsSuccess=[${contentTypeDetailQueryIsSuccess}], conversionToZodSuccess=[${conversionToZodSuccess}]`)
        }
        if(conversionToZodError) {
            console.log(`An Error occured converting ts interface to zod schema // conversionToZodError has just changed its value to: [${conversionToZodError}]`)
        }
        if(convertingToZod) {
            console.log(`convertingToZod (loading conversion to zod) has just changed its value to: [${convertingToZod}]`)
        }
    }, [contentTypeDetailQueryIsSuccess, conversionToZodSuccess, conversionToZodError, convertingToZod])

    
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
                  <AutoForm
                  schema={schemaProvider}
                  onSubmit={(data: any, form: any) => {
                    console.log(` autoform submit: [${data}]`);
                  }}
                  withSubmit
                />

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

export class TsToZod {
    public static convert = (tsInterfaceAsText: string): any => {
       /**
        * https://github.com/ritz078/transform/blob/c6e0748bad06a31373e2a8324a764e9467646742/pages/api/typescript-to-zod.ts#L17
        */
       
       // `tmp.interface.${Math.floor(Math.random() * 10000)}.ts`;
       // https://www.dolthub.com/blog/2021-12-15-client-side-storage-with-react/#deciding-to-use-an-outside-library
       // how to avoid having to create a local file with the typescript interface code inside?
      
      
       try {
        const schemaGenerator = generate({
          sourceText: `export interface whatever {
                name: string,
                surname?: string,
                date_of_birth: date
            }`,
          keepComments: false,
          skipParseJSDoc: true
        });
    
        schemaGenerator.transformedSourceText
        console.log(`JBL DEBUG: schemaGenerator.transformedSourceText [${schemaGenerator.transformedSourceText}]`)
        
        schemaGenerator.transformedSourceText
        console.log(`JBL DEBUG: schemaGenerator.transformedSourceText [${schemaGenerator.transformedSourceText}]`)
        
        const schema = schemaGenerator.getZodSchemasFile(`./content/astro.config.ts`);
        console.log(`JBL DEBUG: schemaGenerator.getZodSchemasFile returns [${schema}]`)
        const formattedSchema = schema
          .split(/\r?\n/)
          .slice(1)
          .join("\n");
        console.log(`JBL DEBUG: formattedSchema = [${formattedSchema}]`)
        
        return formattedSchema;
      } catch (e) {
        // throw new Error(`${e.message}`)
        throw new Error(`An error occured `)
      }
    }
}