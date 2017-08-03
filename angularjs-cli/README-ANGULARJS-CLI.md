# AngularJS generator

## Prerequisites

1. Install [Node.js](http://nodejs.org)

2. Install these NPM packages globally

    ```bash
    npm install -g bower gulp
    ```
## Generating AngularJS elements

### Generate/reset your app
 - Run the generating tool with `npm run generate:app` or `gulp angular-app`

 - Asks the user a few questions to initialize the application.

 OR 

 - Run  `gulp generate-app` with the parameters:
    *   --title="Some Name"             : App display title
    *   --elements=module1,module2      : (optional)
                                          generate optional modules, [friends,session]
    *   --path=some/path                : (optional)
                                          path to module's components' folder, if none set, default is ./src

### Generate a single AngularJS element
 - Run the generating tool with `npm run generate` or  `gulp generate-angular`

 - Asks the user a few questions to initialize the one of the following elements:
    *   Module
        - Generates module's folders, configuration block, configuration constant, mssages, route's file and styles.
    *   Component
        - Generates component's element and controller, template, stylesheet and unit test.
    *   Resource
        - Generates resource's main class and test, the service js and unit test and the mock service.
    *   Service
        - Generates service's main js and test.
    *   Interceptor
        - Generates interceptor's main js and test.

    OR 
    *   --generate=element     : (optional) element to generate
                                  options ['module', 'component', 'resource', 'service', 'interceptor']

### Generate a single AngularJS element without generate-angular tool

#### Generate a module
 - Run `gulp generate-module`
    *      --name=somename       : sets the module and folder name
    *      --path=some/path      : (optional)
                                    path to module's components' folder, if none set, default is app/modulename/components

 - Generates module's folders, configuration block, configuration constant, mssages, route's file and styles.

#### Generate a component
 - Run `gulp generate-component`
    *      --module=modulename   : component's module's name
    *      --name=someName       : component name in camelCase
    *      --path=some/path      : (optional)
                                    path to module's components' folder, if none set, default is app/modulename/components

 - Generates component's element and controller, template, stylesheet and unit test.


#### Generate a resource
 - Run `gulp generate-resource`
    *      --module=modulename   : resource's module's name
    *      --name=someName       : resource name in camelCase
    *      --path=some/path      : (optional)
                                   path to module's resource' folder, if none set, default is app/modulename/model/resourceName

 - Generates resource's main class and test, the service js and unit test and the mock service.

#### Generate a service
 - Run `gulp generate-service`
    *      --module=modulename   : service's module's name
    *      --name=someName       : service name in camelCase
    *      --path=some/path      : (optional)
                                    path to module's service' folder, if none set, default is app/services

 - Generates service's main js and test.

#### Generate a interceptor
 - Run `gulp generate-interceptor`
    *      --module=modulename   : interceptor's module's name
    *      --name=someName       : interceptor name in camelCase
    *      --path=some/path      : (optional)
                                    path to module's interceptor' folder, if none set, default is app/modulename

 - Generates interceptor's main js and test.

## License

MIT
