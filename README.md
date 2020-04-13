# Client services generator

[![npm version](https://badge.fury.io/js/client-services-generator.svg)](https://badge.fury.io/js/client-services-generator)

Axios and Angular REST API client generator from OpenAPI v3 (YAML or JSON) and WADL.
Generated files are compatible with Axios or Angular v8/9, depending on your settings.

## Description

The package generates an TypeScript classes and request callings for Axios (or Angular) from an OpenAPI v3 (or WADL) specification file. The code is generated using Handlebar templates.

# Installation

## Command Line

This option installs package globally and you can run it directly from your terminal.

```bash
npm install client-services-generator -g
```

## NodeJS/Browser

This option installs package only to your project.

```bash
npm install client-services-generator --save-dev
```

# Usage

If you installed package globally, you can run it from your terminal accordingly:

```bash
client-services-generator -s ./apiDocs/openApi.json -t axios -o ./myApp
```

If you installed it only to your project, create this simple script in your package.json:

```json
"scripts": {
    "client-services-generator": "client-services-generator -s ./apiDocs/openApi.json -t axios -o ./myApp",
},
```

Then just run:

```bash
npm run client-services-generator
```

# Options

| Option                    | Description                                           | Default value    | Type             |
| ------------------------- | ----------------------------------------------------- | ---------------- | ---------------- |
| `--version`               | Show version number                                   |                  |                  |
| `-h` / `--help`           | Show help                                             |                  | [boolean]        |
| `-i` / `--interactive` \* | Runs program in interactive mode                      | `false`          | [boolean]        |
| `-s` / `--source` \*      | Path to source file (api documentation)               | `""`             | [string]         |
| `-t` / `--type`           | Output type of services                               | `axios`          | [axios, angular] |
| `-o` / `--output`         | Path to output directory for generated service files. | `(current path)` | [string]         |

\* (One of arguments 'i' or 's' is required.)

# Generated structure

```plain
output-path/services
 ├─ models
 │   ├─ myEnum.ts
 │   ├─ myModel.ts
 │   │  ...
 │   └─ anotherModel.ts
 ├─ requests
 │   ├─ myRequests.ts
 │   │  ...
 │   └─ anotherRequests.ts
 └─ serviceBase.ts
```
