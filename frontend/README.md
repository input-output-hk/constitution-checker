# Constitution Checker Frontend Guide

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-87.38%25-green.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-78.65%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-86.41%25-green.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-86.66%25-green.svg?style=flat) |

## Table of Contents

- [Constitution Checker Frontend Guide](#constitution-checker-frontend-guide)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Project Structure](#project-structure)
      - [Components](#components)
      - [Compositions](#compositions)
      - [Store](#store)
      - [Styles](#styles)
      - [Utils](#utils)
  - [Setup](#setup)
  - [Running the Application](#running-the-application)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

The frontend for this application was built using React, Typescript, Zustand, and Material-UI. The application structure is designed to maintain a clean and organized codebase, with a clear separation of components, state management, styles, and utility functions.

## Project Structure

The project follows a modular structure with a separation of concerns for better maintainability and scalability.

```plaintext
frontend/
├── public/
├── src/
│   ├── components/
│   ├── compositions/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
```

#### Components
Contains simple, reusable components.

#### Compositions
Contains more complex components composed of multiple simpler components.

#### Store
Contains Zustand store configuration and related code.

#### Styles
Contains MUI global theme styles and theme configuration for the project.

#### Utils
Contains utility functions such as validation helpers and other functions needed for the react form.

## Setup

Clone the repository and install the dependencies:

```bash
git clone https://github.com/input-output-hk/constitution-checker.git
cd frontend
npm install
# or
yarn install
```
## Running the Application
To start the development server, run:
```bash
#then
npm start
# or
yarn start
```
## Contributing
We welcome contributions to improve this project. If you have any suggestions or encounter any issues, please feel free to create a pull request or open an issue on GitHub.

## License

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or [MIT license](LICENSE-MIT)
at your option.

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this crate by you, as defined in the Apache-2.0 license, shall
be dual licensed as above, without any additional terms or conditions.