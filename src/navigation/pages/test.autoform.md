# Using Autoform for Pesto

I have undertood something very important:
* I try to use autoform, to automatically generate the from to update a Pesto Content Type, particularly the frontmatter definition part.
* So the pattern I first naively followed is such:
  * I retrieve the pesto content type from the rest api
  * The pesto content type has property named `frontmatter_definition`, which is a string, and that string is the code for a typescript interface
  * I use `ts-to-zod` to convert the `frontmatter_definition` typescript interface; into a second string, which happens to be a zod schema.
  * I then tried and _"reify"_ the zod schema, from the string which is the source code of the zod schema, returned by `ts-to-zod`. That is where i had a problem:
    * The problem is that I tried using `ts-morph`, to _"reify"_ the zod schema, with a separate package, <https://www.npmjs.com/package/@pesto-io/zod-reify> : The problem I get there, is that `ts-morph` works on a typescript project source code, and at runtime of the webapp, how can the ts-morph project load the zod npm package? This all seems to me very complicated to do all in browser only, if not merely impossible.

Even if for each pesto content type, the frontmatter definition was stored in database as a string which happens to be the source code of a zod schema, instead of a typescript interface, I would still need to _"reify"_ the zod schema.

All in all, I will try another approach:

* I will convert on api side, the typescript interface, to a JSON Schema, and generate the form, from the JSON Schema.
* ts interface to json schema example: <https://github.com/3forges/poc-frontmatter-schema/blob/46c167a4055bceae79a38f03f4270c9b03310b3a/src/examples/five.ts#L41C27-L41C36>
* The big difference that I will ther have, is that It will be much easier, to "reify", the JSON schema, using `JSON.parse(receivedFromAPI)`
* <https://github.com/rjsf-team/react-jsonschema-form>
* <https://rjsf-team.github.io/react-jsonschema-form/docs/quickstart#form-initialization>

## Ok it works now with JSON Schema Form generation

But now what I have to do, it to do the ShadCN UI integration:

* I found a good example here: <https://github.com/tuanphung2308/next-rjsf-form-builder/tree/main/components/rjsf>
* It's an open issue: <https://github.com/rjsf-team/react-jsonschema-form/issues/4213>
