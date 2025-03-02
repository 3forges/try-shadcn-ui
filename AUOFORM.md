I met a little issue about peer dependencies aas I installed autoform:

```bash
$ pnpm add @autoform/react
Progress: resolved 0, reused 1, downloaded 0, added 0
Progress: resolved 44, reused 44, downloaded 0, added 0
Progress: resolved 489, reused 425, downloaded 0, added 0
Progress: resolved 522, reused 455, downloaded 2, added 0
Progress: resolved 529, reused 457, downloaded 7, added 0
Packages: +11
+++++++++++
Progress: resolved 529, reused 457, downloaded 10, added 10, done
 WARN  Issues with peer dependencies found
.
└─┬ cmdk 1.0.0
  └─┬ @radix-ui/react-dialog 1.0.5
    └─┬ react-remove-scroll 2.5.5
      └── ✕ unmet peer @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0": found 19.0.10

dependencies:
+ @autoform/react 3.0.0

Done in 5.7s using pnpm v10.5.2

```