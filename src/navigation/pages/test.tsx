import { JSX } from "preact/jsx-runtime";

export default function Test(): JSX.Element {
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
import { ContentTypeListCard } from "./content-types/card";
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
                                <ContentTypeListCard
                                    showButtons={true}
                                    showTitle={false}
                                    showGeneratedFields={false}
                                    isEditModeOn={true}
                                />
                            </PestoContentTypeContextProvider>

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
