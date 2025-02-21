# Preact TS + Shadcn UI + Tailwindcss v4

## Spin up

* I followed official docuementation of vite and tailwindcss to spin up a `vite` `preact-ts` project, with tailwindcss v4 setup.

* I then initialized shadcn-ui:

```bash
pnpm dlx shadcn@canary init
```

* I then added a components I would like to use:


But that component causes a problem: it requires using nextjs, which is incompatible with vite.

I then thought about removing in the component, any dependency to nextjs, but i fell into new problems:
* The first problem, is to replace `import Link from 'next/link';`: I was surprised to see that it hard to find a shadcn-ui component that is a simple anchor link, which has a button look.

So facing a potential rabbit hole issue, I then already tried one workaround, trygin to use https://ui.shadcn.com/docs/components/sidebar, instead of https://github.com/salimi-my/shadcn-ui-sidebar:

```bash
# pnpm dlx shadcn@latest add https://raw.githubusercontent.com/salimi-my/shadcn-ui-sidebar/refs/heads/master/public/registry/shadcn-sidebar.json


# ---
# Too bad:
# shadcn ui does not have a remove component command
# -
# 
# pnpm dlx shadcn@canary remove https://raw.githubusercontent.com/salimi-my/shadcn-ui-sidebar/refs/heads/master/public/registry/shadcn-sidebar.json

rm -fr ./src/components/admin-panel/

pnpm dlx shadcn@canary add sidebar 
```
