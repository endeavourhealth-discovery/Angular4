# Angular4

### Migration to 1.0.58 and above (common look & feel)
* Update eds-angular4 entry to the latest version (package.json)
* Delete FrontEnd/src/lessStyles.less
* Delete assets folder
* Remove `"lessStyles.less"` from the styles section of .angular-cli.json
* Add `"../node_modules/eds-angular4/assets/javascript/keycloak.js"` to scripts section of .angular-cli.json
* Remove `<script src="assets/javascript/keycloak.js">` from index.html
* Update styles.css to only include node_modules references
* Remove `assets/scss/index` from scssStyles.css
* Add `@import "~eds-angular4/assets/scss/endeavour";` to scssStyles.css

### Making Changes

To make changes to the common angular code, you will need to perform the following steps.

* Increment the version number at the top of the `package.json` file
* Make your code changes!
* Build using the `npm run build` command
    * This will create a new version of the common tgz file

        **Note:** During development, the contents of this file can simply be unpacked
     into the relevant node_modules folder of your main project to circumvent the
     commit/install process.
* Once development is complete, you should commit:
    * Your code changes!
    * The updated `package.json` file
    * The new `eds-common-js.?.?.?.tgx` file
* In your main project, update the eds-common-js entry in your `package.json` file
* Perform an `npm install` to retrieve your new package

* NOTE: You may need to delete your 'aot' and 'dist' folders in the Angular4 root directory 
for the changes to take effect.

####See individual folders for detailed information on the common components.