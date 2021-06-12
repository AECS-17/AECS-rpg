# L'Attaque de l'Énigmatique et Carnivore Sphinge

## Get started

1. Follow the instructions in src/pipoya/README.md to download the assets from
Pipoya.

2. Follow the instructions from the [RPGJS documentation](https://docs.rpgjs.dev/guide/get-started.html#installation) to build and run the MMORPG:

```bash
npm install
npm run dev
```

3. Navigate to [localhost:3000](http://localhost:3000) or using the local IP
   of the machine.

## Editing files

This repository follows the [structure of an RPGJS project](https://docs.rpgjs.dev/guide/structure.html#explanation-of-the-structure). Read the documentation for how to edit files.

Questions are located in `src/modules/main/server/questions.js`, see the documentation in the file for details. When adding new questions, you can dump the list and catch any error) via command line:

```bash
ts-node src/dump-questions.ts
```

This also exercises a bit the API until proper unit tests are written.

## Unit Tests

See [RPGJS documentation](https://docs.rpgjs.dev/guide/unit-test.html)

TODO when RPGJS is more stable...

## Credits and licenses

This game relies on the [RPG-JS](https://github.com/RSamaium/RPG-JS) library by
Samuel Ronce and re-uses some of its files. It is released under the same MIT
license, that you can found in the LICENSE file.

Most of the graphics are taken from [Pipoya](https://pipoya.itch.io), which
is available under the following license:
  - For commercial or personal use.
  - Use and edit freely.
  - Not redistribute or resell this assets.
  - It can be used for game development and other productions.

The `icon.png` file is a [photo from Marie-Lan Nguyen](https://commons.wikimedia.org/wiki/File:Sphinx_CdM_Paris_DeRidder865_n2.jpg), released under the Creative Commons Attribution 2.5 Generic license.
