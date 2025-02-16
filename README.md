# Try 

## With vite

I am searching the latest release of tailwindcss which has a binary.

That, because obviously, magicui components don't work with the setup of shadcnui with tailwindcss 4.

```bash
pnpm create vite@latest
# then I chose:
# app name to "pesto"
# framework Preact, 
# and Typescript
# and the project was generated under
# the "./pesto/" folder.

# ---
# I move all files back to the root folder 
# of the git repo
cp ./pesto/* .
rm -fr ./pesto/

# ---
# Then I:
# latest 3.* tailwindcss release is https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17
export LATEST_3_RELEASE_OF_TAILWDCSS="3.4.17"
pnpm remove -D tailwindcss postcss autoprefixer
pnpm add -D tailwindcss@${LATEST_3_RELEASE_OF_TAILWDCSS} postcss autoprefixer

pnpm exec tailwindcss init -p
# pnpm dlx tailwindcss init -p

# ---
# There's no more tailwind binary with tailwind 4, so
# I don't run [pnpm dlx tailwind init -p]
# Instead I just manually edited the below files:

cat <<EOF >./tailwindcss.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
    ], 
    theme: {
      extend: {},
    },
    plugins: [],
  }
EOF

# ---
# I also had to add the 
# tailwind directives fit for tailwindcss 3:
# -
# 
cat <<EOF >./src/index.header.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
cp ./src/index.css ./src/index.original.css
rm ./src/index.css
cat ./src/index.header.css | tee -a ./src/index.css
cat ./src/index.original.css | tee -a ./src/index.css

# ---
# I aso fixed a few compilation errors in
# the [tsconfig.app.json], and added the required 
# compiler options, as instructed at https://ui.shadcn.com/docs/installation/vite :
cat <<EOF >./tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    //"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"],
      "@/*": ["./src/*"]
    },

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    // "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

EOF

# ---
# There are also the same compiler options to
# add in the [tsconfig.json]:
# -
# 
cat <<EOF >tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
EOF

pnpm add -D @types/node

cat <<EOF >./vite.config.ts
import path from "path"
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
EOF

# ---
# And then I was good, the build was without 
# warning or errors:

pnpm i 
pnpm dev

```

Then I add shadcn:

```bash
# # ---
# # I used canary release of shadcn to get
# # tailwindcss v4 support, see
# # https://github.com/shadcn-ui/ui/issues/4677#issuecomment-2656785278
# # pnpm dlx shadcn@latest init
# pnpm dlx shadcn@canary init


pnpm dlx shadcn@latest init
```

Then I added a first maficui component:

```bash
pnpm dlx shadcn@latest add "https://magicui.design/r/marquee"
```

After that, I added the `./src/MarqueeDemoVertical.tsx`, but the animation don't work at all, even the design it self does nto seem to work.

## Refs

* <https://ui.shadcn.com/docs/installation/vite>
* <https://magicui.design/docs/components/marquee>
