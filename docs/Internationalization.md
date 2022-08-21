# Internationalization
## Introduction

The [Introduction of ngx-i18nsupport](https://github.com/martinroob/ngx-i18nsupport/blob/master/projects/xliffmerge/README.md#introduction) sums up the problem pretty well

> Angular has a specific way of dealing with internationalization (i18n). It is described in the official documentation Angular Cookbook Internationalization (i18n).
>
> Said in one sentence,
> 
> - markup your strings to translate in your templates with an attribute i18n
> - run the Angular extraction tool (ng-xi18n) to extract the strings in an XML Format called [XLIFF-1.2]
> - copy and then translate the extracted file for every language you plan to support
> - run the ng compiler to generate a special version of your app for the different languages
> 
> But there are some maior gaps in the workflow. That´s where this tool comes into play.
> 
> First, you have to create a complete translation, otherwise, the ng compiler will not generate a version. It is not possible to run with partial translation.
> 
> Second, whenever you change something in your app, you have to regenerate the xliff, but there is no documented way how to merge this with the already existing translated files. There are new translation unit, that you have to merge in, and there are translation units, that do not exist any more.

We're going to use the ngx-i18nsupport-package to solve this issue.

## Prepare Angular-App for i18n
Install Package `@angular/localize` using the angular-cli
```
ng add @angular/localize
```
Add the `i18n`-section to your `angular.json` in your project-section. Add the languages you need and change the source of your translations (the language you use as default in code/html) if required **NOT RECOMMENDED STICK WITH EN IF EVER POSSIBLE**.
Also make sure to set `localize` to `true` for your production-configuration.
```json
{
  ...
  "projects": {
    "yourprojectname": {
      "i18n": {
        "sourceLocale": "en",
        "locales": {
          "de": "src/locale/messages.de.xlf",
          "fr": "src/locale/messages.fr.xlf",
          "it": "src/locale/messages.it.xlf"
        }
      },
      ...
      "architect": {
        "build": {
          ...
          "configurations": {
            "production": {
              "localize": true,
              ...

```

## Install ngx-i18nsupport
Run the following command to install ngx-i18nsupport
```
npm install -g ngx-i18nsupport
```

## Configure xlf-merge
Add the following block the root-section of `package.json` and change it for your needs.
```json
  "xliffmergeOptions": {
    "srcDir": "src/locale",
    "languages": [
      "de",
      "fr",
      "it"
    ],
    "preserveOrder": true,
    "beautifyOutput": true
  }
```
|||
|-|-|
| languages | languages your app needs to support. Make sure it matches the `i18n`-definition your `angular.json`! |
| srcDir | output-dir for translation-files. Make sure it matches the `i18n`-definition your `angular.json`! |
| preserveOrder | Ensures the order of you translation isn't changed (not ordered to abc or whatever). This makes it easier to compare different version of the translation files. |
| beatifyOutput | formats xml nicely |
|||

## Add some translations to your code

Make sure you have actual translations in your app like

```html
<p i18n>Some random pagagraph that needs translation</p>
```
or
```ts
alert($localize `User ${username} doesn't exist!`);
```
## Generate Translation Files
Run the following command to generate translation files. If you changed the `--output-path` make sure to change it accordingly.
```
ng extract-i18n --output-path src/locale
```

Call xliffmerge now to fix the issues mentioned in the introduction
```
xliffmerge
```

> **Recommendation** Add this Command to the `scrips` section in your
> 
> `package.json`
> ```json
> "scripts": {
>   "translate": "ng extract-i18n --output-path src/locale && xliffmerge",
>    "xliffmerge": "xliffmerge",
>   ...
> ```
> You can run `npm run translate` any time you want to upate translations.

## Test your app in a different language

You may want to test how your app looks translated for a specific language.

Add a build-configurations and serve-options to set the localize-language for each language used in your app.

> **HINT** Don't forget to replace _yourprojectname_

`angular.json`
```json
{
  ...
  "projects": {
    "yourprojectname": {
      ...
      "architect": {
        "build": {
          ...
          "configurations": {
            "de": {
              "localize": ["de"]
            },
            "fr": {
              "localize": ["fr"]
            },
            "it": {
              "localize": ["it"]
            }
            ...
          }
        },
        "serve": {
          ...
          "configurations": {
            ...
            "development-de": {
              "browserTarget": "yourprojectname:build:development,de"
            },
            "development-fr": {
              "browserTarget": "yourprojectname:build:development,fr"
            },
            "development-it": {
              "browserTarget": "yourprojectname:build:development,it"
            }
```

Run your app in the desired language

```
ng serve -o --configuration=development-de
```

> **Recommendation** Add a script starting your app in your apps supported langauges simultanialy each language on a different port
> 
> `package.json`
> ```json
> "scripts": {
>    "start": "ng serve -o",
>    "start-de": "ng serve -o --configuration=development-de --port=4201",
>    "start-fr": "ng serve -o --configuration=development-fr --port=4202",
>    "start-it": "ng serve -o --configuration=development-it --port=4203",
>   ...
> ```
> Now you can run your app simultaneously in any language you like
> `npm run start-de`.
> 
> Have Fun! 
> 😄