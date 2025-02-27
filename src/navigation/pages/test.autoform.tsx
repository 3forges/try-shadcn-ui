import { JSX } from "preact/jsx-runtime";
import { generate } from "ts-to-zod";

export default function TestAutomform(): JSX.Element {
    return (
        <>
            <h1>Tests</h1>
            <CreateNewContentTypeDialog />
        </>
    )
}


import { Copy, Plus as LuPlus, SaveAll as LuSaveAll } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ContentTypeCard } from "./content-types/card/ContentTypeCard";
import { PestoContentTypeContextProvider } from "./content-types/ContentTypeContext";

export function CreateNewContentTypeDialog({ children }: { children?: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LuPlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add new Content Type</DialogTitle>
                    <DialogDescription>
                        Create a new content type by filling in the below form.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">


                        <div>
                            {TsToZod.convert(`export interface whatever {
                name: string,
                surname?: string,
                date_of_birth: date
            }`)}
                        </div>

                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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