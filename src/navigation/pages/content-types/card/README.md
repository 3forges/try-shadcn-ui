# Design notes

## C.R.U.D. Features

Instead of 2 possibles modes, the CRUD Card needs 3 modes:
* `READ_DELETE`: you can view an existing content type, and there is:
  * one button to update the existing content-type.
  * one button to delete the existing content-type.
* `UPDATE`: You can update an existing  content type
* `CREATE`: You can create a new content type

## autoform

The question is: How do i create a form to edit or create a content type, automatically, with autoform ?

* I retrieve from the API, the typescript interface of the frontmatter fields.
* I then convert the typescritp interface, to a zod schema, using `ts-to-zod`
* I then create a zod schema:

```TypeSCript

const frontmatterAsZod = convertFrontmatterDefTsInterfaceToZod(retrievedtsInterface);

const zodShema = z.object({
    // id: z.uuid(),
    // project_id: z.uuid(),
    id: z.string(),
    project_id: z.string(),
    name: z.string(),
    frontmatter_definition: frontmatterAsZod,
    description: z.string(),
    //creation_date: z.datetime(),
    creation_date: z.date(),
  })
```

And finally with autoform, we can create the form from the above `zodShema` instanciated zod schema!


How to use ts-to-zod:
* the package src is <https://github.com/fabien0102/ts-to-zod>
* example how to use it: 
  * <https://github.com/3forges/pesto-api/issues/10>
  * <https://github.com/ritz078/transform/blob/c6e0748bad06a31373e2a8324a764e9467646742/pages/api/typescript-to-zod.ts#L13> : 
    * there its is an api endpoint:
      * so i will make an api endpoint which can turn a typescript interace into a zod schema? No, if I do so, the webapp will receive the zod schema as a string, and I will have to reify it

[Here](https://github.com/ritz078/transform/blob/c6e0748bad06a31373e2a8324a764e9467646742/pages/api/typescript-to-zod.ts#L17) is how the ts-to-zod creates the zod schema, from the string which is the typescript interface cdoe:

```TypeScript
    const schemaGenerator = generate({
      sourceText: `export interface whatever {
        name: string,
        surname?: string,
        date_of_birth: date
      }`,
      keepComments: keepComments === "true",
      skipParseJSDoc: skipParseJSDoc === "true"
    });
```

see <https://github.com/ritz078/transform/blob/c6e0748bad06a31373e2a8324a764e9467646742/pages/api/typescript-to-zod.ts#L17>
