# Constitution Checker Frontend Guide

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)

## Introduction

The frontend for this application was built using React, Typescript, Zustand, and Material-UI. The application structure is designed to maintain a clean and organized codebase, with a clear separation of components, state management, styles, and utility functions.

## Project Structure

The project follows a modular structure with a separation of concerns for better maintainability and scalability.

my-frontend-project/
├── public/
├── src/
│   ├── components/
│   ├── compositions/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx

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

### Setup

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