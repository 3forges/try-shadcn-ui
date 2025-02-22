import React from "preact/compat";
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react";
import base64 from 'base-64';
import utf8 from 'utf8';

const mdKaTeX = `This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;

/*
export interface CodeNode {
  children: any;
}
*/
export interface CodeProps {
  inline: boolean;
  children: [any];
  className: string;
  node: {
    children: [any];
  };
}
export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = React.useState(mdKaTeX);
  return (
    <>
    <MDEditor
      value={markdown}
      onChange={(val: string | ((prevState: string) => string)) => setMarkdown(val)}
      previewOptions={{
        components: {
          code: ({ inline, children = ["un"], className, ...props }: CodeProps) => {
            let txt: string = 'default txt';
            if (children.length > 0) {
              txt = children[0];
            } else {
              txt = '';
            }
            if (inline) {
              if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                  throwOnError: false,
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return <code>{txt}</code>;
            }
            const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
            if (
              typeof code === 'string' &&
              typeof className === 'string' &&
              /^language-katex/.test(className.toLocaleLowerCase())
            ) {
              const html = katex.renderToString(code, {
                throwOnError: false,
              });
              return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
            }
            return <code className={String(className)}>{children}</code>;
          },
        },
      }}
      />
      <div class="flex p-1">

      <Button variant={"default"} onClick={() => {
                console.log(`Here we base64 encode the markdown multiline text`)

 
                // var text = 'foo © bar 𝌆 baz';
                var markdownAsBytes = utf8.encode(markdown);
                var base64EncodedMarkdown = base64.encode(markdownAsBytes);
                console.log(base64EncodedMarkdown);
                console.log(` And we finally just need to trigger REDUX RTK QUERY TO UPDATE THE EXISTING PESTO CONTENT (We'll also need a "create new pesto content" component)`);
                
                /**
                 *    jbl@pokus2:~/envoy-opa-compose$ export MACHIN='VGhpcyBpcyB0byBkaXNwbGF5IHRoZSAKYCQkYyA9IFxwbVxzcXJ0e2FeMiArIGJeMn0kJGAKIGluIG9uZSBsaW5lCgpgYGBLYVRlWApjID0gXHBtXHNxcnR7YV4yICsgYl4yfQpgYGAK'
                 *    
                 *    echo ${MACHIN} | base64 -d > ./my.utf8.text.file
                 *    jbl@pokus2:~/envoy-opa-compose$ cat ./my.utf8.text.file
                 *    This is to display the
                 *    `$$c = \pm\sqrt{a^2 + b^2}$$`
                 *     in one line
                 *    
                 *    ```KaTeX
                 *    c = \pm\sqrt{a^2 + b^2}
                 *    ```
                 *    
                 */
            }}>
              <SaveIcon className={`p-1`} />
              Save
            </Button>
      </div>
    </>
  );
}