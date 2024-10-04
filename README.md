# Giphy Search - Uxcam

A Frontend app for UxCam.

## Highlights

- Bootstraped by vite.
- React w/ TypeScript
- tailwind utility class
- shadcn for ui components
- Maintained code standarization with linting support (eslint, prettier)

## Requirements

- `bun` | `yarn `|`npm` as a package manager.(prefered bun)
- `"node>=16" ` node version >= 16

## Getting Started

- Clone the repo.

  ```console
    git clone git@github.com:sundarshahi/uxCam.git
  ```

- goto project root directory.
  ```console
       cd uxCam
  ```
- Copy the content of `.env.sample` to root of project as `.env.development || .env.production || .env` as per the requirement and change the value of variable
- Install dependencies using
  ```console
     bun install
  ```
  or
  ```console
     npm i
  ```
  or
  ```console
    yarn
  ```
- To start the server as developement
  -you must have `.env.development` or `.env`
  ```console
      bun dev
  ```

## TAILWIND

To learn more about the newest ways to use Tailwind utility class, checkout [the docs](https://tailwindcss.com/docs).

## shadcn

To learn more about the shadcn, checkout [the docs](https://ui.shadcn.com/docs).

## TODO:

- Refactor code to addapt layered architecture.
- checkout [Reference](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)
- more [modularizing react](https://martinfowler.com/articles/modularizing-react-apps.html)

## Environment variables

A sample `.env` file can be found at [.env.sample](.env.sample)

| name               | required |                       description |
| :----------------- | :------: | --------------------------------: |
| VITE_GIPHY_API_KEY |   true   | api key for giphy search endpoint |
