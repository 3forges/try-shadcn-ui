import {
  Project,
  PropertySignature,
  TypeChecker,
  TypeFormatFlags,
  SourceFile as tsMorphSourceFile,
} from "ts-morph";
//import * as ts from 'typescript'
// https://www.npmjs.com/package/uuid
// import { v4 as uuidv4 } from 'uuid';
import { v4 as uuidv4 } from "uuid"; // pnpm add --save uuid @types/uuid

import {
  // fmBooleanType,
  // fmNumberType,
  // fmStringType,
  // fmUnSelectedType,
  FrontmatterField,
  // FrontMatterFieldType,
} from "./../ContentTypeContext";
/**
 * To test the thing :
 * https://stackblitz.com/edit/node-typescript-playground-jtmhvv?file=src%2Findex.ts,nodemon.json,src%2FValidator.ts,src%2Fyang-types%2Findex.ts,src%2Fmytypes%2Ftest1.ts,tsconfig.json
 */
/**
 * This class Validates that a Pesto frontmatter definition is a valid TypeScript source code (that there is no complitation error), and that it includes one and only one interface declaration.
 * This class also allows to convert the interface to an array of {@FrontmatterField }s
 */
export class TsToPestoFrontmatterFieldsConverter {
  // import { TsToPestoFrontmatterFieldsConverter } 'ts.morph/lib'
  /**
   * The unique ID of the Code Analysis processed by this {@FrontmatterTsValidator } instance
   */
  private unique_id: string;
  /**
   * The ts-morph API Project instance which
   * will used to compile the typescript code
   */
  private project: Project;
  /**
   * The filename of the file in which the soruce
   * code to process will be saved to.
   */
  private filename: string;
  /**
   * The source file obeject used by the TS compiler API
   */
  private sourceFile: tsMorphSourceFile;
  /**
   * The type checker
   */
  private typeChecker: TypeChecker; //ts.TypeChecker;

  private frontmatterFields: FrontmatterField[];

  constructor(protected tsCodeToValidate: string) {
    // nothing to do there, properties are implicitly initialized
    /**
     * we need a random unique id for each file that is going to be generated, just to put the string source code into it, for later ts compiler api processing.
     */
    this.unique_id = uuidv4();
    // console.log(randomUuid); // '398de222-5bf9-4754-8e3e-011a55307014'

    this.filename = `test_${this.unique_id}.ts`;

    // const code = `const test: number = 1 + 2;`;
    this.project = this.initProject();
    this.sourceFile = this.project.createSourceFile(
      this.filename,
      this.tsCodeToValidate
    );
    // this.project.addSourceFileAtPath(this.filename)
    /**
     * check the program is properly initialized
     */
    console.log(
      `Here is the Node Count of the parsed frontmatter: [${this.project.getTypeChecker()}]`
    );

    this.typeChecker = this.project.getTypeChecker();

    this.frontmatterFields = [];
  }

  /**
   * Initializes the TS Compiler API {@Program } instance which will process Source Code Analysis
   * @returns the TS Compiler API {@Program } instance which will process Source Code Analysis
   */
  private initProject = (): Project => {
    // const sourceFile = ts.createSourceFile(
    //   this.filename,
    //   this.tsCodeToValidate,
    //   ts.ScriptTarget.Latest/*,// ts.ScriptTarget.ES2015,*/
    //   // /*setParentNodes */ true
    // );
    const project = new Project({
      // tsConfigFilePath: "tsconfig.json", //"path/to/tsconfig.json",
      // skipFileDependencyResolution: true,
      skipAddingFilesFromTsConfig: true,
      useInMemoryFileSystem: true, // otherwise the browser throws error "Error: Access to the file system is not supported in the browser. Please use an in-memory file system (specify `useInMemoryFileSystem: true` when creating the project)."
    });
    return project;
  };
  /**
   *
   * @returns true if the provided source code successfully compiles as valid TypeScript code, and if it includes one and only one interface declaration.
   */
  public validate(): boolean {
    const interfaces = this.sourceFile.getInterfaces();
    const isThereOneAndOnlyOneInterface: boolean = interfaces.length == 1;
    console.log(
      `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - isThereOneAndOnlyOneInterface = `,
      isThereOneAndOnlyOneInterface
    );

    if (!isThereOneAndOnlyOneInterface) {
      console.log(
        `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - interfaces.length = `,
        interfaces.length
      );
      throw new Error(
        `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - The frontmatter must have at one and only one interface declaration`
      );
    }
    return true;
  }
  public generateFrontmatterFields(): FrontmatterField[] {
    const interfaces = this.sourceFile.getInterfaces();
    const isThereOneAndOnlyOneInterface: boolean = interfaces.length == 1;
    console.log(
      `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - isThereOneAndOnlyOneInterface = `,
      isThereOneAndOnlyOneInterface
    );

    if (!isThereOneAndOnlyOneInterface) {
      console.log(
        `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - interfaces.length = `,
        interfaces.length
      );
      throw new Error(
        `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - The frontmatter must have at one and only one interface declaration`
      );
    }
    interfaces.forEach((interfaceDeclaration) => {
      console.log(
        `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - LOOP level 1 - interfaceDeclaration.getKindName(): `,
        interfaceDeclaration.getKindName()
      );
      console.log(
        `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - LOOP level 1 - interfaceDeclaration.getName(): `,
        interfaceDeclaration.getName()
      );
      const propertiesSignatures: PropertySignature[] =
        interfaceDeclaration.getProperties();
      propertiesSignatures.forEach((propertySignature) => {
        /// console.log(`[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - LOOP level 2 over interface properties - propertySignature.getFullText(): `, propertySignature.getFullText())
        console.log(
          `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - LOOP level 2 over interface properties - propertySignature.getName(): `,
          propertySignature.getName()
        );
        // console.log(`[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - LOOP level 2 over interface properties - propertySignature.getType(): `, propertySignature.getType())
        console.log(
          `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] - LOOP level 2 over interface properties - propertySignature.getType().getText(): `,
          propertySignature.getType().getText()
        );
        const nameOfheproperty = propertySignature.getName();
        const typeOfheproperty = propertySignature.getType().getText();

        if (typeOfheproperty == "boolean") {
          this.frontmatterFields.push({
            fmType: "fmBoolean",
            name: nameOfheproperty,
          });
        } else if (typeOfheproperty == "number") {
          this.frontmatterFields.push({
            fmType: "fmNumber",
            name: nameOfheproperty,
          });
        } else if (typeOfheproperty == "string") {
          this.frontmatterFields.push({
            fmType: "fmString",
            name: nameOfheproperty,
          });
        } else {
          throw new Error(
            `[TsToPestoFrontmatterFieldsConverter] - [generateFrontmatterFields()] -> Cannot convert interface property [${nameOfheproperty}] to [FrontmatterField], because its type is [${typeOfheproperty}]: only supported TypeScript types are [boolean, string, number] `
          );
        }
      });
    });
    return this.frontmatterFields;
  }
}
