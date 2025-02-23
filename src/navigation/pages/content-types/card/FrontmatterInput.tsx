/**
 * External imports
 */
import { useContext, useState } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
/**
 * Shadcn-ui imported components
 */
import { Input as TextInput } from "@/components/ui/input"
/**
 * Internal imports
 */
import { fmBooleanType, fmNumberType, fmStringType, fmUnSelectedType, PestoContentTypeContextEntityUtils } from "./../utils/ContentTypeContextUtils";
import { FrontMatterFieldType, PestoContentTypeContext } from "./../ContentTypeContext";

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
        throw new Error(`[ContentTypeCard] - [pestoContentTypeContext] is null or undefined!`)
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
        console.log(` handleFrontmatterFieldTypeChange -> pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition = `, JSON.stringify(pestoContentTypeContext.contentTypeContextEntity.frontmatter_definition, null, 4))
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
