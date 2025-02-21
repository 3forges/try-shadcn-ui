/**
 * https://dev.to/madv/usecontext-with-typescript-23ln
 * https://blog.logrocket.com/how-to-use-react-context-typescript/
 * best explanation: https://dmitripavlutin.com/react-context-and-usecontext/#4-updating-the-context , and in that page Ctrl + F (Hi! @OlegFilonchuk)
 */
import { PestoContentTypeApiEntity } from "../../../../api/entities/PestoContentTypeApiEntity";

// import { FrontmatterTsValidator } from "../../ts.compiler/lib/diagnostics"
import { TsToPestoFrontmatterFieldsConverter } from "./TsToPestoFrontmatterFieldsConverter";
import { FrontMatterFieldType, PestoContentTypeContextEntity } from "../ContentTypeContext";

/**
 * ************************************************
 * ************************************************
 * ************************************************
 * Types:
 * 
 * We have 2 TypeScript Types representing a
 * PestoContentType:
 * 
 * -> The first allows to CRUD a Pesto Content Type via the Pesto API
 * -> The second allows to CRUD a Pesto Content Type via the Pesto UI
 * 
 * The only difference betwenn those two, is the [frontmatter_definition]:
 * 
 * We need a conversion Utility to Convert
 * a frontmatter as a string (a TS interface declaration code)
 * to a frontmatter as an array of FrontmatterField
 * ************************************************
 * ************************************************
 * ************************************************
 *
 */


export const fmStringType: FrontMatterFieldType = "fmString"
export const fmBooleanType: FrontMatterFieldType = "fmBoolean"
export const fmNumberType: FrontMatterFieldType = "fmNumber"
export const fmUnSelectedType: FrontMatterFieldType = "fmUnSelectedType"

/**
 * We need a Utility to convert:
 * a {@PestoContentTypeContextEntity } to a {@PestoContentTypeApiEntity }
 * a {@PestoContentTypeApiEntity } to a {@PestoContentTypeContextEntity }
 *
 * Note:
 * - In {@PestoContentTypeApiEntity } the [frontmatter_definition] property is a string, which is expected to
 */
export class PestoContentTypeContextEntityUtils {
  public static fmStringType: FrontMatterFieldType = "fmString"
  public static fmBooleanType: FrontMatterFieldType = "fmBoolean"
  public static fmNumberType: FrontMatterFieldType = "fmNumber"
  public static fmUnSelectedType: FrontMatterFieldType = "fmUnSelectedType"

  /**
   * Converts a {@FrontMatterFieldType } to a string, which is the name of the matching Typescript type. Supported Types are:
   * "fmBoolean" => "boolean"
   * "fmString" => "string"
   * "fmNumber" => "number"
   * "fmBoolean" => "boolean"
   *
   */
  public static convertFmTypeToTsType = (
    fmTypeValue: FrontMatterFieldType
  ): string => {
    let toReturn: string;
    /*
    fmTypeValue = "fmBoolean"
    fmTypeValue = "fmNumber"
    fmTypeValue = "fmString"
    fmTypeValue = "fmUnSelectType"
    */
    switch (fmTypeValue) {
      case "fmBoolean": {
        toReturn = "boolean";
        return toReturn;
        //break;
      }
      case "fmNumber": {
        toReturn = "number";
        return toReturn;
        //break;
      }
      case "fmString": {
        toReturn = "string";
        return toReturn;
        //break;
      }
      case "fmUnSelectedType": {
        throw new Error(
          `convertFmTypeToTs -> Cannot convert to TS type, because the provided field: [${fmTypeValue}],  is "fmUnSelectedType"`
        );
        //break;
      }
      default: {
        //statements;
        throw new Error(
          `convertFmTypeToTs -> Cannot convert to TS type, the provided field [${fmTypeValue}]`
        );
        //break;
      }
    }
  };
  /**
   * Converts a string (which is the name of the matching Typescript type) to a {@FrontMatterFieldType }. Supported Types are:
   *
   * "boolean" => "fmBoolean"
   * "string" => "fmString"
   * "number" => "fmNumber"
   * "boolean" => "fmBoolean"
   *
   */
  public static convertTsTypeToFmType = (
    tsTypeValue: string
  ): FrontMatterFieldType => {

    switch (tsTypeValue) {
      case "boolean": {
        return PestoContentTypeContextEntityUtils.fmBooleanType;
        //break;
      }
      case "number": {
        return PestoContentTypeContextEntityUtils.fmNumberType;
        //break;
      }
      case "string": {
        return PestoContentTypeContextEntityUtils.fmStringType;
        //break;
      }
      default: {
        //statements;
        throw new Error(
          `convertTsTypeToFmType -> Cannot convert to [FrontMatterFieldType], the provided TS type [${tsTypeValue}]. The only supported TypeScript are [boolean, string, number], complex types are not supported (yet) `
        );
        //break;
      }
    }
  };

  /**
   * Converts a {@PestoContentTypeContextEntity } instance, to convert to a {@PestoContentTypeApiEntity } instance.
   * @param context The {@PestoContentTypeContextEntity } instance to convert.
   * @returns the [PestoContentTypeApiEntity] instance, resulting of the conversion.
   * @throws an error, if, in the {@PestoContentTypeContextEntity }.[frontmatter_definition], one of the {@FrontMatterField }'s {@FrontMatterFieldType } is "fmUnSelectedType"
   */
  public static convertContextToApiEntity = (
    context: PestoContentTypeContextEntity
  ): PestoContentTypeApiEntity => {
    let toReturn: PestoContentTypeApiEntity;
    let convertedFrontmatter: string;

    convertedFrontmatter = `
export interface ${context.name.replace(/\s+/g, "_")}_Frontmatter {
`;
    for (let i = 0; i < context.frontmatter_definition.length; i++) {
      let currentField = context.frontmatter_definition[i];
      let currentFieldTsType =
        PestoContentTypeContextEntityUtils.convertFmTypeToTsType(currentField.fmType);
      convertedFrontmatter =
        convertedFrontmatter +
        `  ${currentField.name.replace(/\s+/g, "_").replace(/\-/g, "_")}: ${currentFieldTsType}
`;
    }
    convertedFrontmatter =
      convertedFrontmatter +
      `}
`;
    toReturn = {
      _id: context._id,
      name: context.name,
      project_id: context.project_id,
      frontmatter_definition: convertedFrontmatter,
      description: context.description,
      createdAt: context.createdAt,
      __v: context.__v,
    };
    return toReturn;
  };

  /**
   * 
   * @param contentTypeApiEntity  
   * @throws an error if the frontmatter has typescript compilation errors.
   */
  public static convertApiEntityToContext = (
    contentTypeApiEntity: PestoContentTypeApiEntity
  ): PestoContentTypeContextEntity => {
    const fmConverter = new TsToPestoFrontmatterFieldsConverter(contentTypeApiEntity.frontmatter_definition|| '')

    try {
      fmConverter.validate()
    } catch (error) {
      console.error(`the Pesto Content Type [${contentTypeApiEntity.name}] has a frontmatter which has TypeScript compilation errors, while it should be a valid TypeScript interface.`)
      throw new Error(`the Pesto Content Type [${contentTypeApiEntity.name}] has a frontmatter which has TypeScript compilation errors, while it should be a valid TypeScript interface. The Error is: [${error}]`)
    }

    return { // for now I just return a dummy 
      _id: contentTypeApiEntity._id,
      name: contentTypeApiEntity.name,
      project_id: contentTypeApiEntity.project_id,
      frontmatter_definition: fmConverter.generateFrontmatterFields(),
      description: contentTypeApiEntity.description,
      createdAt: contentTypeApiEntity.createdAt,
      __v: contentTypeApiEntity.__v
    }
  }
}

/**
 * For Tests:
 */
/*
const testCtxt1: PestoContentTypeContextEntity= {
    _id: "3453s5dsf554hdf57ndhgd",
    description: "desc of testCtxt1 ",
    name: "nameOftestCtxt1",
    project_id: "y453d5dwft46xfn8d90d",
    frontmatter_definition: [
        {
            fmType: "fmBoolean",
            name: "includeInJumbo"
        },
        {
            fmType: "fmNumber",
            name: "dress"
        },
        {
            fmType: "fmNumber",
            name: "price"
        },
        {
            fmType: "fmString",
            name: "color"
        },
        {
            fmType: "fmString",
            name: "trademark"
        },
        {
            fmType: "fmBoolean",
            name: "isFromNewClothesCollection"
        }
    ],
    createdAt: "qsdqsdqsd"
}

let result1 = PestoContentTypeContextEntityUtils.convert(testCtxt1)

console.log(`result1 = `, result1)

console.log(`result1.frontmatter_definition = `, result1.frontmatter_definition)

// expected result is:
[LOG]: "result1.frontmatter_definition = ",  "
export interface nameOftestCtxt1_Frontmatter {
  includeInJumbo: boolean
  dress: number
  price: number
  color: string
  trademark: string
  isFromNewClothesCollection: boolean
}
" 
*/


/**
 * ************************************************
 * ************************************************
 * ************************************************
 * END OF TYPES CONVERTING UTILS
 * ************************************************
 * ************************************************
 * ************************************************
 *
 */
