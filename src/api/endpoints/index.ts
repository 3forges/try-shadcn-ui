import {
  createApi,
  fetchBaseQuery,
  // ApiEndpointQuery,
} from "@reduxjs/toolkit/query/react";
import { PestoProjectApiEntity } from "../../api/entities/PestoProjectApiEntity"; /* from "../../features/PestoApi/Projects/pestoProjectSlice"*/

import { PestoContentTypeApiEntity } from "./../entities/PestoContentTypeApiEntity";

const config = {
  PESTO_API_PORT: process.env.PESTO_API_PORT || `3000`,
  PESTO_API_HOST: process.env.PESTO_API_HOST || `localhost`,
  PESTO_API_HTTP_SCHEME: process.env.PESTO_API_HTTP_SCHEME || `http`,
};
// const PESTO_API_PORT = process.env.PESTO_API_PORT || "3000"
const PESTO_API_PORT = config.PESTO_API_PORT;
// const PESTO_API_HOST = process.env.PESTO_API_HOST || "localhost"
const PESTO_API_HOST = config.PESTO_API_HOST;
const PESTO_API_HTTP_SCHEME = config.PESTO_API_HTTP_SCHEME;
const API_BASE_URL = `${PESTO_API_HTTP_SCHEME}://${PESTO_API_HOST}:${PESTO_API_PORT}/`;

export const pestoApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  // global configuration for the api
  /**
   * https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#reducing-subscription-time-with-keepunuseddatafor
   */
  keepUnusedDataFor: 30,
  /**
   * https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#encouraging-re-fetching-with-refetchonmountorargchange
   */
  refetchOnMountOrArgChange: 17,
  /**
   * https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#re-fetching-on-window-focus-with-refetchonfocus
   */
  refetchOnFocus: true,
  /**
   * https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#re-fetching-on-network-reconnection-with-refetchonreconnect
   */
  refetchOnReconnect: true,
  tagTypes: ["PestoProjectApiEntity", "PestoContentTypeApiEntity"],
  endpoints: (build) => ({
    /*************************************
     * -----------------------------------
     * -----------------------------------
     * Pesto Projects
     * -----------------------------------
     * -----------------------------------
     *************************************/
    createNewProject: build.query<
      PestoProjectApiEntity[],
      {
        v_name: string;
        v_git_ssh_uri: string;
        v_description: string;
      }
    >({
      query({ v_name, v_git_ssh_uri, v_description }) {
        console.log(` RTK QUERY - I am the [createNewProject]`);
        return {
          window: null, // Can only be null. Used to disassociate request from any Window.
          url: "pesto-project",
          /* params: {
                limit: 10
              }, */
          method: "POST",
          body: {
            name: `${v_name}`,
            git_ssh_uri: `${v_git_ssh_uri}`,
            description: `${v_description}`,
          },
        };
      },
    }),
    projectList: build.query<PestoProjectApiEntity[], void>({
      query() {
        console.log(` RTK QUERY - I am the [projectList]`);
        return {
          url: "pesto-project",
          params: {
            limit: 10,
          },
          method: "GET",
        };
      },
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 0,
    }),
    projectDetail: build.query<
      PestoProjectApiEntity,
      {
        _id?: string;
        name?: string;
        git_ssh_uri?: string;
        description?: string;
        createdAt?: string;
      }
    >({
      query: ({ _id }) => {
        console.log(" RTK QUERY - I am the [projectDetail] query Fn ", _id);
        return { url: `pesto-project/${_id}` };
      },
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 0,
    }),
    /**
     * Updating a Pesto Project (should be a `PestoContentType`)
     */
    // // - //    updateStudent: build.mutation({
    // // - //        query(stu) {
    // // - //            return {
    // // - //                url: `students/${stu.id}`,
    // // - //                method: 'put',
    // // - //                body: {data: stu.attributes}
    // // - //            };
    // // - //        },
    // // - //        invalidatesTags: ((result, error, stu) =>
    // // - //            [{type: 'student', id: stu.id}, {type: 'student', id: 'LIST'}])
    // // - //    }),

    /**
     * see those ref examples found on github :
     * -> https://github.com/csxiaoyaojianxian/JavaScriptStudy/blob/d1fc42736b41e05139bc1bd8b4c6adf0842dac11/12-%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/03-React/react18/16-redux/03-RTKQ(TODO)/store/studentApi.js#L59C44-L59C44
     */
    updateProject: build.mutation<
      PestoProjectApiEntity,
      {
        _id?: string;
        name?: string;
        git_ssh_uri?: string;
        description?: string;
        createdAt?: string;
      }
    >({
      query: ({ _id, name, git_ssh_uri, description, createdAt }) => {
        console.log(` RTK QUERY - I am the [updateProject]`);
        console.log({
          _id,
          name,
          git_ssh_uri,
          description,
          createdAt,
        });
        return {
          // url: '/posts',
          // url: `pesto-project/${payload._id}`,
          url: `pesto-project/${_id}`,
          method: "PUT",
          body: {
            _id: `${_id}`,
            name: `${name}`,
            git_ssh_uri: `${git_ssh_uri}`,
            description: `${description}`,
            createdAt: `${createdAt}`,
          } /*,
            body: {
              data: {
                _id: `${_id}` ,
                name: `${name}` ,
                git_ssh_uri: `${git_ssh_uri}` ,
                description: `${description}` ,
                createdAt: `${createdAt}` ,
              }
            }*/,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Accept: "application/json; charset=UTF-8",
          },
        };
      },
      /*
        providesTags: (result: { id: any; }[]) =>
        result
          ? [
            ///
              ...result.map((value: { id: any; }, index: number, array: { id: any; }[]) => ({ type: 'PestoProjectApiEntity' as const, value })),
              { type: 'PestoProjectApiEntity', id: 'LIST' },
            ]
          : [{ type: 'PestoProjectApiEntity', id: 'LIST' }],
        */
      invalidatesTags: (
        result,
        error,
        { _id, name, git_ssh_uri, description, createdAt }
      ) => {
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags] Hook `
        );
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [result] = [${JSON.stringify(
            result,
            null,
            4
          )}] `
        );
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [error] = [${JSON.stringify(
            error,
            null,
            4
          )}] `
        );

        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [_id] = [${_id}] `
        );
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [_id] = [${name}] `
        );
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [_id] = [${git_ssh_uri}] `
        );
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [_id] = [${description}] `
        );
        console.log(
          ` RTK QUERY - I am the [updateProject] - [invalidatesTags]  CHECK VALUE OF [_id] = [${createdAt}] `
        );

        return [
          { type: "PestoProjectApiEntity", id: `${_id}` },
          //{type: 'PestoProjectApiEntity', id: `${name}`},
          //{type: 'PestoProjectApiEntity', id: `${git_ssh_uri}`},
          //{type: 'PestoProjectApiEntity', id: `${description}`},
          //{type: 'PestoProjectApiEntity', id: `${createdAt}`},
        ];
      },
      // invalidatesTags: ((result, error, stu) =>
      //   [{type: 'PestoProjectApiEntity', id: `${_id}`}, {type: 'PestoProjectApiEntity', id: 'LIST'}])
      // invalidatesTags: ['PestoProjectApiEntity'],
    }),
    deleteProject: build.mutation<
      PestoProjectApiEntity,
      {
        _id?: string;
        name?: string;
        git_ssh_uri?: string;
        description?: string;
        createdAt?: string;
      }
    >({
      query: ({ _id }) => {
        console.log(
          ` RTK QUERY - I am the [deleteProject] query Fn [/pesto-project/${_id}]`,
          _id
        );
        // return { url: `pesto-project/${_id}` };
        return {
          url: `pesto-project/${_id}`,
          /* params: {
                limit: 10
              }, */
          method: "DELETE",
        };
      },
    }),

    /*************************************
     * -----------------------------------
     * -----------------------------------
     * Pesto Content Types
     * -----------------------------------
     * -----------------------------------
     *************************************/
    createNewContentType: build.mutation<
      PestoContentTypeApiEntity,
      {
        v_name: string;
        v_project_id: string;
        v_frontmatter_definition: string;
        v_description: string;
      }
    >({
      query({ 
        v_name, 
        v_project_id, 
        v_frontmatter_definition, 
        v_description 
      }) {
        console.log(` RTK QUERY - I am the [createNewContentType]. I will create the content type with: `, {
          name: `${v_name}`,
          project_id: `${v_project_id}`,
          frontmatter_definition: `${v_frontmatter_definition}`,
          description: `${v_description}`,
        });
        return {
          window: null, // Can only be null. Used to disassociate request from any Window.
          url: "pesto-content-type",
          /* params: {
                limit: 10
              }, */
          method: "POST",
          body: {
            name: `${v_name}`,
            project_id: `${v_project_id}`,
            frontmatter_definition: `${v_frontmatter_definition}`,
            description: `${v_description}`,
          },
        };
      },
    }),


    contentTypeList: build.query<PestoContentTypeApiEntity[], void>({
      query() {
        console.log(` RTK QUERY - I am the [contentTypeList]`);
        return {
          url: "pesto-content-type",
          params: {
            limit: 10,
          },
          method: "GET",
        };
      },
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 0,
    }),

    contentTypeListByProject: build.query<PestoContentTypeApiEntity[], { 
      v_project_id: string
    }>({
      query({ 
        v_project_id
      }) {
        console.log(` RTK QUERY - I am the [contentTypeListByProject] - requesting [/pesto-content-type/project/${v_project_id}]`);
        return {
          url: `pesto-content-type/project/${v_project_id}`,
          params: {
            limit: 10,
          },
          method: "GET",
        };
      },
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 0,
    }),

    /**
     * the detailed infos of a content type will consist of the project it belongs to.
     */
    contentTypeDetail: build.query<
      PestoContentTypeApiEntity,
      {
        _id?: string;
        name?: string;
        project_id?: string;
        frontmatter_definition?: string;
        description?: string;
        createdAt?: string;
      }
    >({
      query: ({ _id }) => {
        console.log(" RTK QUERY - I am the [contentTypeDetail] query Fn ", _id);
        return { url: `pesto-content-type/${_id}` };
      },
      
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 0,
    }),
    /**
     * Updating a Pesto ContentType (should be a `PestoContentType`)
     */
    // // - //    updateStudent: build.mutation({
    // // - //        query(stu) {
    // // - //            return {
    // // - //                url: `students/${stu.id}`,
    // // - //                method: 'put',
    // // - //                body: {data: stu.attributes}
    // // - //            };
    // // - //        },
    // // - //        invalidatesTags: ((result, error, stu) =>
    // // - //            [{type: 'student', id: stu.id}, {type: 'student', id: 'LIST'}])
    // // - //    }),

    /**
     * see those ref examples found on github :
     * -> https://github.com/csxiaoyaojianxian/JavaScriptStudy/blob/d1fc42736b41e05139bc1bd8b4c6adf0842dac11/12-%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/03-React/react18/16-redux/03-RTKQ(TODO)/store/studentApi.js#L59C44-L59C44
     */
    updateContentType: build.mutation<
      PestoContentTypeApiEntity,
      {
        _id?: string;
        name?: string;
        project_id?: string;
        frontmatter_definition?: string;
        description?: string;
        createdAt?: string;
      }
    >({
      query: ({
        _id,
        name,
        project_id,
        frontmatter_definition,
        description,
        createdAt,
      }) => {
        console.log(` RTK QUERY - I am the [updateContentType]`);
        console.log({
          _id,
          name,
          project_id,
          frontmatter_definition,
          description,
          createdAt,
        });
        return {
          // url: '/posts',
          // url: `pesto-content-type/${payload._id}`,
          url: `pesto-content-type/${_id}`,
          method: "PUT",
          body: {
            _id: `${_id}`,
            name: `${name}`,
            project_id: `${project_id}`,
            frontmatter_definition: `${frontmatter_definition}`,
            description: `${description}`,
            createdAt: `${createdAt}`,
          } /*,
            body: {
              data: {
                _id: `${_id}` ,
                name: `${name}` ,
                git_ssh_uri: `${git_ssh_uri}` ,
                description: `${description}` ,
                createdAt: `${createdAt}` ,
              }
            }*/,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Accept: "application/json; charset=UTF-8",
          },
        };
      },
      /*
        providesTags: (result: { id: any; }[]) =>
        result
          ? [
            ///
              ...result.map((value: { id: any; }, index: number, array: { id: any; }[]) => ({ type: 'PestoContentTypeApiEntity' as const, value })),
              { type: 'PestoContentTypeApiEntity', id: 'LIST' },
            ]
          : [{ type: 'PestoContentTypeApiEntity', id: 'LIST' }],
        */
      invalidatesTags: (
        result,
        error,
        {
          _id,
          name,
          project_id,
          frontmatter_definition,
          description,
          createdAt,
        }
      ) => {
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags] Hook `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [result] = [${JSON.stringify(
            result,
            null,
            4
          )}] `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [error] = [${JSON.stringify(
            error,
            null,
            4
          )}] `
        );

        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [_id] = [${_id}] `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [name] = [${name}] `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [project_id] = [${project_id}] `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [frontmatter_definition] = [${frontmatter_definition}] `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [description] = [${description}] `
        );
        console.log(
          ` RTK QUERY - I am the [updatePestoContentType] - [invalidatesTags]  CHECK VALUE OF [createdAt] = [${createdAt}] `
        );

        return [
          { type: "PestoContentTypeApiEntity", id: `${_id}` },
          //{type: 'PestoContentTypeApiEntity', id: `${name}`},
          //{type: 'PestoContentTypeApiEntity', id: `${git_ssh_uri}`},
          //{type: 'PestoContentTypeApiEntity', id: `${description}`},
          //{type: 'PestoContentTypeApiEntity', id: `${createdAt}`},
        ];
      },
      // invalidatesTags: ((result, error, stu) =>
      //   [{type: 'PestoContentTypeApiEntity', id: `${_id}`}, {type: 'PestoContentTypeApiEntity', id: 'LIST'}])
      // invalidatesTags: ['PestoContentTypeApiEntity'],
    }),
    deleteContentType: build.mutation<
      PestoContentTypeApiEntity,
      {
        _id?: string;
        name?: string;
        git_ssh_uri?: string;
        description?: string;
        createdAt?: string;
      }
    >({
      query: ({ _id }) => {
        console.log(
          ` RTK QUERY - I am the [deleteContentType] query Fn [/pesto-content-type/${_id}]`,
          _id
        );
        // return { url: `pesto-content-type/${_id}` };
        return {
          url: `pesto-content-type/${_id}`,
          /* params: {
                limit: 10
              }, */
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  /**
   * Pesto Projects
   */
  useCreateNewProjectQuery,
  useUpdateProjectMutation,
  useProjectListQuery,
  useDeleteProjectMutation,
  useProjectDetailQuery,
  /**
   * Pesto Content Types
   */
  useCreateNewContentTypeMutation,
  useUpdateContentTypeMutation,
  useContentTypeListQuery,
  useContentTypeListByProjectQuery,
  useDeleteContentTypeMutation,
  useContentTypeDetailQuery,
  //  } = pestoContentTypeApi;
} = pestoApi;
