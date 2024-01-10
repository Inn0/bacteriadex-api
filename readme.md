# BacteriaDex API

## Installation

Make sure you have [Node](https://nodejs.org/en/download) installed on your system.
Clone the project and run the following command in the root of the project:

```
npm install
```

## Running the project (development)

To run a local version of the project, run the following command in the root of the project:

```
npm run dev
```

## Building & starting the project

To build/compile the project run the following command in the root of the project:

```
npm run build
```

To start the project after compiling it to valid JavaScript run the following command in the root of the project:

```
npm run start
```

## Endpoints

| Endpoint               | HTTP Method | Parameters | Example                           |
| ---------------------- | ----------- | ---------- | --------------------------------- |
| `/bacteria`            | GET         | range      | `/bacteria?range=0,30`            |
| `/bacteria/name/:name` | GET         | :name      | `/bacteria/name/Escherichia coli` |

## Endpoints still to be implemented

-   [ ] Fetch bacteria by ID (more information)
-   [ ] Search for a bacteria
