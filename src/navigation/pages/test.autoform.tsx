import { JSX } from "preact/jsx-runtime";
import { generate } from "ts-to-zod";
import z from 'zod';
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
import { useConvertTsToZodMutation, useUpdateContentTypeMutation } from "@/api/endpoints";
import { PestoContentTypeContext } from "./content-types/ContentTypeContext";


/**
 * This component will use autoform, to spin up a form, from
 * a pesto content type:
 * - 
 * 
 * @returns The React Component
 */
export async function UpdatePestoContentTypeCard(): Promise<React.JSX.Element> {
    
    const pestoContentTypeContext = useContext(PestoContentTypeContext)
    const [reifiedSchema, setReifiedSchema] = useState<ZodObjectOrWrapped>(z.object({}));
    const [schemaProvider, setSchemaProvider] = useState<ZodProvider<ZodObjectOrWrapped>>();

    // const schemaProvider = new ZodProvider(zodSchemaOfTheContentType);
    if (!pestoContentTypeContext) {
      throw new Error(`[ContentTypeCard] - [pestoContentTypeContext] is null or undefined!`)
    }
    
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
    await convertTsToZod({
        v_tsInterfaceAsStr: pestoContentTypeContext.contentTypeContextApiEntity.frontmatter_definition
    })
    useEffect(() => {
        if(conversionToZodSuccess) {
            // frontmatterZodSchemaAsStr.data?.schema
            console.log(`The typescript interface frontmatter definition was successfully converted to the following zod schema:  [${tsInterfaceConvertedToZod.schema}]`)
            const zodSchemaParser = new reify.ZodSchemaReifier(
              tsInterfaceConvertedToZod.schema
            );
            setReifiedSchema(zodSchemaParser.reify());
            setSchemaProvider(new ZodProvider(reifiedSchema))
        }
        if(conversionToZodError) {
            console.log(`An Error occured converting ts interface to zod schema // conversionToZodError has just changed its value to: [${conversionToZodError}]`)
        }
        if(convertingToZod) {
            console.log(`convertingToZod (loading conversion to zod) has just changed its value to: [${convertingToZod}]`)
        }
    }, [conversionToZodSuccess, conversionToZodError, convertingToZod])

    
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
        <AutoForm
      schema={schemaProvider}
      onSubmit={(data: any, form: any) => {
        console.log(` autoform submit: [${data}]`);
      }}
      withSubmit
    />
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