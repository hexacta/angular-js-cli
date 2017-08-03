# angular-js-cli

> AngularJS application generator with a specific tool to generate AngularJS modules, components, resources and services.

## Prerequisites

1. Install [Node.js](http://nodejs.org)

2. Install these NPM packages globally

    ```
    npm install -g bower gulp webdriver-manager
    ```

    >Refer to these [instructions on how to not require sudo](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)

## Running AngularJS cli with Frontend StackWeb

1. `npm init` Init npm package (recommended use defaults)

2. `npm intall` Install npm and bower dependencies and initiate the core AngularJS

3. Follow the steps to generate your first app

4. `npm run dev:mock`


## Generating AngularJS elements with cli

### Generate/reset your app
1. `npm run generate:app` or `gulp angular-app` to run the app generator tool

2. Answer the following questions to initialize the application.

### Generate a single AngularJS element
1. `npm run generate` tu run the element generatior tool

2. Answer the following questions to initialize the one of the following elements:
    *   **Module**: Generates module's folders, configuration block, configuration constant, mssages, route's file and styles.
    *   **Component**: Generates component's element and controller, template, stylesheet and unit test.
    *   **Resource**: Generates resource's main class and test, the service js and unit test and the mock service.
    *   **Service**: Generates service's main js and test.
    *   **Interceptor**: Generates interceptor's main js and test.

More info and commands of the angularjs-cli on [AngularJS-cli README](https://github.com/hexacta/angular-js-cli/angularjs-cli/README-ANGULARJS-CLI.md)

## Fast development commands

### Running in dev mode
 - `npm run dev` serves the project in dev mode.
 - `npm run dev:mock` serves the project in dev and mock mode.
 - Both open the project in a browser and updates the browser when any file changes.

### Linting
 - `npm run analysis` runs code analysis and statistics. This runs eslint and plato.
 - `npm run lint` run code analysis using. This runs eslint.
    Fix simple eslint errors with  `npm run lint:fix`. Be careful that will override the files with the new changes.

### Unit Tests
 - `npm test` run unit tests via karma and jasmine. Run test and open the karma report with `npm run test:report`

### E2E Tests
 - `npm run e2e` runs webdriver and then e2e tests via protractor and jasmine. Run test and open the protractor report with `npm run e2e:report`
 - `npm run e2e:serve` runs webdriver, serves the application in dev mode and runs e2e tests.
 - `npm run e2e:serve:prod` runs webdriver, serves the application in production mode and runs e2e tests.
 - Last two serves the code in mock mode.

### Building the project for production
 - `npm build` builds the optimized project.
 - This create the optimized code for the project and puts it in the build folder.

### Running the optimized (production) code
 - `npm run prod` builds and serves the project in production mode.
 - `npm run prod:mock` builds and serves the project in production and mock mode.
 - Both open the project in a browser and updates the browser when any file changes.

## Exploring AngularJS cli with Frontend StackWeb project
AngularJS cli with Frontend StackWeb starter project

### Structure
The structure also contains a gulpfile.js and a server folder. The server is there just so we can serve the app using node. Feel free to use any server you wish.

	/src
        /app
        /content

### Installing Packages
When you generate the project it should run these commands, but if you notice missing packages, run these again:

 - `npm install`
 - `bower install`

### The Modules
The app has 4 feature modules and depends on a series of external modules and custom but cross-app modules

    app --> [
        app.core --> [
			ngResource,
			ui.bootstrap,
			ui.router,
			blocks.exception,
			blocks.logger,
            blocks.popup,
			blocks.router
		],
        app.layout,
        app.session --> [
            ngMessages,
            blocks.mocks,
            common
        ],
        app.friends --> [
            ui.select,
            ngSanitize,
            common
        ],
        app.widgets
    ]
    appMock --> [
        ngMockE2E,
        app--> [ ... ],
        modelMocks --> [
            blocks.mocks
        ]
    ]

#### core Module
Core modules are ones that are shared throughout the entire application and may be customized for the specific application. Example might be common data services.

This is an aggregator of modules that the application will need. The `core` module takes the blocks, common, and Angular sub-modules as dependencies.

#### friends Module
The `friends` module is an example module containing full functional resources, components, services, routing, configuration, unit-test and e2e testing.

This module comes with the mocked resources inside the `appMock`, under the `modelMocks` module.

#### session Module
The `session` module is a module that can be use to implement de login and password change of the application, contains full functional resources, components, services, routing, configuration, unit-test and e2e testing.

This module comes with the mocked resources inside the `appMock`, under the `modelMocks` module.

#### blocks Modules
Block modules are reusable blocks of code that can be used across projects simply by including them as dependencies.

##### blocks.logger Module
The `blocks.logger` module handles logging across the Angular app.

##### blocks.exception Module
The `blocks.exception` module handles exceptions across the Angular app.

It depends on the `blocks.logger` module, because the implementation logs the exceptions.

##### blocks.router Module
The `blocks.router` module contains a routing helper module that assists in adding routes to the $routeProvider.

##### blocks.popup Module
The `blocks.popup` module contains a popup helper service that assists in registering and displaying alert modals across the application.

It depends on the `ui.bootstrap` module, because the implementation is based on angular-bootstrap modal.

##### blocks.mocks Module
The `blocks.mocks` module contains a mock helper service that assists in registering mocked e2e http backend methods, parsing regEx urls and adding mocks to the mocked application.

#### common Module
Commom module are reusable components (custom and vendor's) that can be used across the app's modules simply by including the dependencies.

#### appMock Module
The `appMock` module provides a decorator for the `app` module with mocked resources and any other http call.

When running the code in mocked mode, the application initiates with `appMock` module instead of `app` module.

##### model.mocks Module
The `model.mocks` has the mocked resources of the application. Each mock contains a list of mocked resources, the url and uri of the resource and the methods that are going to be caught while mocking the application along with the functions that will execute when this happens. 

Any new resource generated should have its mock inside this module.

## Gulp Tasks

### Task Listing

- `gulp help`

    Displays all of the available gulp tasks.

### Code Analysis

- `gulp vet`

    Performs static code analysis on all javascript files. Runs eslint.

- `gulp vet --verbose`

    Displays all files affected and extended information about the code analysis.

- `gulp plato`

    Performs code analysis using plato and eslint on all javascript files. Plato generates a report in the reports folder.

### Testing

- `gulp test`

    Runs all unit tests using karma runner, mocha, chai and sinon with phantomjs. Depends on vet task, for code analysis.

- `gulp autotest`

    Runs a watch to run all unit tests.

### Cleaning Up

- `gulp clean`

    Remove all files from the build and temp folders

- `gulp clean-images`

    Remove all images from the build folder

- `gulp clean-code`

    Remove all javascript and html from the build folder

- `gulp clean-fonts`

    Remove all fonts from the build folder

- `gulp clean-styles`

    Remove all styles from the build folder

### Fonts and Images

- `gulp fonts`

    Copy all fonts from source to the build folder

- `gulp images`

    Copy all images from source to the build folder

### Styles

- `gulp styles`

    Compile sass files to CSS, add vendor prefixes, and copy to a css folder

### Bower Files

- `gulp wiredep`

    Looks up all bower components' main files and JavaScript source code, then adds them to the `index.html`.

    The `.bowerrc` file also runs this as a postinstall task whenever `bower install` is run.

### Serving Development Code

- `gulp serve-dev`

    Serves the development code and launches it in a browser. The goal of building for development is to do it as fast as possible, to keep development moving efficiently. This task serves all code from the source folders and compiles sass to css in a temp css folder.

- `gulp serve-dev --nosync`

    Serves the development code without launching the browser.

### Building Production Code

- `gulp optimize`

    Optimize all javascript and styles, move to a build folder, and inject them into the new index.html

- `gulp build`

    Copies all fonts, copies images and runs `gulp optimize` to build the production code to the build folder.

### Serving Production Code

- `gulp serve-build`

    Serve the optimized code from the build folder and launch it in a browser.

- `gulp serve-build --nosync`

    Serve the optimized code from the build folder and manually launch the browser.

### Bumping Versions

- `gulp bump`

    Bump the minor version using semver.
    --type=patch // default
    --type=minor
    --type=major
    --type=pre
    --ver=1.2.3 // specific version

## License

MIT © [Hexacta](http://www.hexacta.com)

**Generated based in John Papa HotTowel**

>*Opinionated Angular style guide for teams by [@john_papa](//twitter.com/john_papa)*

>More details about the styles and patterns used in this app can be found in  [Angular Style Guide](https://github.com/johnpapa/angularjs-styleguide)
