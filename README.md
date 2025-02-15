# Try 

## With vite

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
pnpm add -D tailwindcss postcss autoprefixer

# ---
# There's no more tailwind binary with tailwind 4, so
# I don't run [pnpm dlx tailwind init -p]
# Instead I just manually edited the below files:

cat <<EOF >./tailwindcss.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      // 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ], // <script src="./node_modules/flowbite-react/dist/flowbite.min.js"></script>
    theme: {
      extend: {},
    },
    plugins: [/*require('flowbite/plugin')*/],
  }
EOF

# ---
# I also had to fiw the tailwind directives which
# changed a bit with tailwind 4:
# -
# 
cat <<EOF >./src/index.header.css
@import "tailwindcss";
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
# ---
# I used canary release of shadcn to get
# tailwindcss v4 support, see https://github.com/shadcn-ui/ui/issues/4677#issuecomment-2656785278
# pnpm dlx shadcn@latest init
pnpm dlx shadcn@canary init

```

## Refs

* https://ui.shadcn.com/docs/installation/vite
