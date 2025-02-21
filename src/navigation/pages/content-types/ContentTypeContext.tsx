/**
 * https://dev.to/madv/usecontext-with-typescript-23ln
 * https://blog.logrocket.com/how-to-use-react-context-typescript/
 * best explanation: https://dmitripavlutin.com/react-context-and-usecontext/#4-updating-the-context , and in that page Ctrl + F (Hi! @OlegFilonchuk)
 */
import { createContext, useContext, useState, FC, ReactNode } from "preact/compat";
// import { createContext, useContext, useState, FC, ReactNode } from "react";
import { PestoContentTypeApiEntity } from "../../../api/entities/PestoContentTypeApiEntity";
import { TsToPestoFrontmatterFieldsConverter } from "./utils/TsToPestoFrontmatterFieldsConverter.ts";
import { Dispatch, StateUpdater } from "preact/hooks";

// import { TsToPestoFrontmatterFieldsConverter } from "./TsToPestoFrontmatterFieldsConverter";


export type FrontMatterFieldType =
  | "fmString"
  | "fmNumber"
  | "fmBoolean"
  | "fmUnSelectedType";
export interface FrontmatterField {
  name: string;
  fmType: FrontMatterFieldType;
}

export type PestoContentTypeContextEntity = {
  _id: number;
  name: string;
  project_id: string;
  frontmatter_definition: FrontmatterField[];
  description: string;
  createdAt: string;
  __v?: number;
};





/*
const PestoContentTypeContext = createContext({ // <PestoContentTypeContextEntity>
  contentTypeContextEntity: {
    _id: 0,
    createdAt: ``,
    description: `Type description of the new pesto content type (this is the default pesto content type context api entity)`,
    frontmatter_definition: [],
    name: `Type name of the new pesto content type (this is the default pesto content type context api entity)`,
    project_id: `0`,
    __v: 0
  },
  setContentTypeContextEntity: (entity: PestoContentTypeContextEntity) => {

  }
})
*/

export interface IPestoContentTypeContext {
  contentTypeContextEntity: PestoContentTypeContextEntity
  // setContentTypeContextEntity: Function
  // setContentTypeContextEntity: StateUpdater<PestoContentTypeContextEntity>//(contentTypeContextEntity: PestoContentTypeContextEntity) => {}
  setContentTypeContextEntity: Dispatch<StateUpdater<PestoContentTypeContextEntity>>
}

export const PestoContentTypeContext = createContext<IPestoContentTypeContext|null>(null)


export interface PestoContentTypeContextProviderProps {
  children: ReactNode
  contentTypeApiEntity: PestoContentTypeApiEntity
}
// export function PestoContentTypeContextProvider({children}: any) {
export const PestoContentTypeContextProvider: FC<PestoContentTypeContextProviderProps> = ({ children, contentTypeApiEntity }) => {
  /**
   * We convert the provided 
   * {@PestoContentTypeApiEntity } frontmatter_definition
   * to a 
   * {@PestoContentTypeContextEntity } frontmatter_definition
   * 
   */
  const converter = new TsToPestoFrontmatterFieldsConverter(contentTypeApiEntity.frontmatter_definition)
  const convertedFrontMatterDef:FrontmatterField[] = converter.generateFrontmatterFields();

  /**
   * We have the state of a 
   * {@PestoContentTypeContextEntity }
   * in the context.
   * The context keeps track of 
   * the state of the Web UI
   * components, it does nothing 
   * at all with the database.
   * 
   * Only the "SAVE/UPDATE" btn click events
   * will call redux RTK methods.
   * 
   * Each ContentTypeListCard has its own context,
   * which shares the context between the 2
   * cards:
   * -> edit mode on card
   * -> edit mode off card
   */
  const [contentTypeContextEntity, setContentTypeContextEntity] = useState<PestoContentTypeContextEntity>({
    _id: contentTypeApiEntity._id,
    createdAt: contentTypeApiEntity.createdAt,
    description: contentTypeApiEntity.description,
    frontmatter_definition: [
      ...convertedFrontMatterDef
    ], // converted frontmatter definition
    name: contentTypeApiEntity.name,
    project_id: contentTypeApiEntity.project_id,
    __v: 0
  });

  return (
    <PestoContentTypeContext.Provider value={{ contentTypeContextEntity, setContentTypeContextEntity }}>
      {children}
    </PestoContentTypeContext.Provider>
  )
}

// export default PestoContentTypeContext




/**
 * Now the context things
 */

/*
export type ContentType = {
  copy: PestoContentTypeApiEntity;
  setCopy: (ct: PestoContentTypeApiEntity) => void;
};
export const ContentTypeContext = createContext<ContentType>({
  copy: {}, // set a default value
  setCopy: () => {},
});
export const useContentTypeContext = () => useContext(ContentTypeContext);
*/