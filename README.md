# Webpack
Webpack is a **module bundler**, it puts together files for increased performance. It also enforces a style of coding that favors component-based architecture and maintainable code. Primarily, the focus of webpack is to bundle and transpile `.js` files, but it can also bundle, as well as minify, assets or `.css` files. <br />

The optimal folder structure when using webpack is the following: have a `src/` - source folder with all the files needed before the bundling, have a `dist/`- destination folder for all the bundle outputs, and have a `webpack.config.dev.js` file in the root directory or in the `build/` folder.

```bash
src/
   - index.js
   - index.html
dist/
   - bundle.js
build/
   - webpack.config.js
package.json
```

#### Webpack in the terminal
The simplest way to run webpack is to specify an input file and an output file in the terminal
```bash
webpack ./src/index.js ./dist/app.bundle.js
```

You can also minify the files with the `-p` flag.
```bash
webpack ./src/index.js ./dist/app.bundle.js -p
```

...or watch for any file changes with the --watch flag
```bash
webpack ./src/index.js ./dist/app.bundle.js -p --watch
```

#### Webpack config objects
For bigger projects with more complex tasks, it's better to configure a webpack.config object. The configuration file consists of a `module.exports` object which is populated with a bunch of config properties - here's a list:
* `mode` - this is just to tell you which stage of the dev process you're in - either `development` or `production`
* `entry` - location of our main `.js` file (e.g. `./src/index.js`)
* `output` - object with the following properties
   * `filename` - the name of the bundled output file (`./dist/app.bundle.js`)
   * `path`- instead of using the filename to provide an absolute path, you can also set up a path prop to enforce relative paths

```bash
'use strict'

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    compress: true,
    port: 3300,
    open: true
  },
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname,'../dist')
  }
};
```

To bundle things up from the configuration file, you can use the `webpack --config config-file-location`from `package.json` file.
```bash
"scripts": {
   "dev": "webpack --config ./build/webpack.config.dev.js"
}
``` 

### Plugins
By default Webpack only understands Javascript, but you can make it pay attention to and bundle other types of files using plugins and loaders.

#### HTML Webpack Plugin
The old way to use html files with the `bundle.js`file was to include a `script` tag to the html file that links to the bundled file in the `dist/` folder. However, a better way to use html with webpack is to dynamically generate html files and links to the appropriate scripts, all from webpack. For that, an HTML Webpack plugin is used. <br />
To install the [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin), run the following command in the terminal.

```bash
npm install --save-dev html-webpack-plugin
```

Then, we need to tell Webpack how to use the plugin. In the configuration file, we first need to import the plugin with the `require` statement. Aferwards, we instantiate the plugin in the `plugins` array.

```bash
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   plugins: [
     new HTMLWebpackPlugin()
   ]
}
```

By default, the HTML Webpack plugin looks for an `index.html` file in the folder specified in the `output.path` field (hence, in the `dist/` folder). However, if we want to build custom templates and compile them during the building process, we need to add more options to our `HTMLWebpackPlugin` instance. Specifically, we have to specify the following properties:
* `template` - the location of our template (e.g. './src/index.html')
* `filename` - the name of the exported file
* `inject` - whether or not you want other Webpack resources injected to the end of the file - if `true`, the webpack bundle will be automatically injected at the end of the HTML body, without you needing to link to `.js` files from the HTML file.

```bash
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   plugins: [
     new HtmlWebpackPlugin({
        title: 'My custom template',
        template: 'index.html',
        filename: 'index.html',
        inject: true
     })
   ]
}
```

## Loaders
[Loaders](https://webpack.js.org/loaders/) are utilities for Webpack that allow you to bundle static resources (css, assets etc.) beyond Javascript. You specify loader functioning as a set of rules in the `rules` array on the Webpack config objects.

#### CSS loader
To bundle pure CSS use the [CSS Webpack loader](https://webpack.js.org/loaders/css-loader/)
```bash
npm install --save-dev css-loader
```
To include the css loader rules to the config object, paste the following lines into the Webpack config file.

```bash
module.export = {
  module: {
    rules: [
      {
         test: /\.css$/,
         use: 'css-loader'
      }
    ]
  }
}
```

We also need to import the `.css` file into the `index.js`, so the css files can be bundled together with Javascript. <br />
//index.js
```js
import css from './main.css'
```

#### Style loader
Just using `css-loader` means that Webpack will bundle CSS styles together with Javascript, but the browser has no way of applying styles to the DOM elements from Javascript. You need another loader for that - `style-loader`, which basically creates a `<style>` tag in the html file for all the CSS bundled by Webpack.

```bash
npm install --save-dev style-loader
```

You include the `style-loader` in the rule for bundling CSS in the Webpack config file. If you use more than one loader in the same rule, use the array format to add more than one loader to the rule.

```bash
{
   test: /\.css$/,
   use: ['style-loader', 'css-loader']
}
```

#### Sass compiler
If you have `.scss` files that you want to compile to `.css`, you can use the `sass-loader` - [link](https://github.com/webpack-contrib/sass-loader).

```bash
npm install sass-loader node-sass webpack --save-dev
```
You will add the `sass-loader` to the list of loaders used to bundle CSS. Since the loaders are applied to the bundling from the back forward, and you need to use the Sass compiler first, put it at the end of the loader `use` array. Also make sure all the files are changed to `.scss`.

//index.js
```js
import scss from './main.scss';
```

//main.scss
```scss
$cyan = cyan;
body {
  background-color: cyan;
}
```

//webpack.config.dev.js
```bash
  rules: [
  {
    test: '/\.scss$/,
    use: ['style-loader','css-loader','sass-loader']

  }
]
```

#### Extract CSS
If we leave things like we created them before, all the styles we have will be pushed into an inline `style` tag. We may want that, but if our bundled CSS file is big, bundling CSS to a separate file will result in parallel bundling of CSS and Javascript, and thus greater performance performance. You can use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) for bundling CSS into a separate file. The configuration of the plugin is shown below. Compared to settings for inlining CSS used before, we simply replace the `style-loader` with the CSS plugin loader - remember that Webpack applies the loaders from the back forward, so use the CSS plugin loader first - it means it will be applied last, which is what we want.

//webpack.config.js
```bash
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
rules:[{ 
   test: /\.(scss$/,
     use: [
       MiniCssExtractPlugin.loader,
       'css-loader',
       'postcss-loader',
       'sass-loader',
     ],
}],
plugins:[{
   new MiniCssExtractPlugin({
      filename: 'compiled.css', // name of the output file, which will get added to the dist/ folder, as specified before
      chunkFilename: 'main.css' // here we put the name of our compiled scss file
   })
}]

```

### CSS Optimization
Text needed here!

### Webpack Dev Server
It's nice to have a [devServer](https://webpack.js.org/configuration/dev-server/), so you can launch the server and host files in localhost just by setting up a script in your `package.json` file and running it in the terminal.

```bash
npm install --save-dev webpack-dev-server
```

The simplest way to run a dev server with npm is to include the following script to the `package.json` file. 
// package.json
```bash
"dev": "webpack-dev-server --config build/webpack.config.dev.js"
```

We can also set up `devServer` options in the Webpack config file to explicity tell Webpack how and where we want our files served.

```bash
devServer: {
    compress: true,
    port: 3300,
    open: true
  }
```

If you run `npm run dev` now the script above will start the Webpack Dev server using options from the Webpack configuration file. Also, the script will look for any changes in our scripts and re-run if changes are detected. **Importantly**, the dev server makes development easier and faster by automatic reloading, but it should only be used for development - in fact, when the server renders the files, they are all rendered from memory and are not written on the disk. Thus, when we stop the server, we don't have any new files in our `dist/` folder.

### Babel
[Babel](https://babeljs.io/) is a Javascript compiler that will take your ES6 code and output ES5 Javacript that the browser can understand and run.

```bash
npm install --save-dev babel-core babel-loader babel-preset-env
```

Notice we just installed a whole list of packages. To make Babel work with Webpack, you need all three. `babel-core` is the core Babel library, which you obviously need for transpiling. [Babel preset env](https://babeljs.io/docs/en/babel-preset-env/) is a preset that instructs Babel to compile Javscript down to a minimum of ES5. Without `babel-present-env` using Babel is of no use. Another important feature of `babel-preset-env` is that it can also take in browser or runtime versions and determine which plugins and polyfills are needed for that specific environment. Lastly, [Babel loader](https://github.com/babel/babel-loader) is a Webpack loader for Babel, which we need to tell Webpack how to use Babel in our bundling.

Just like we did with CSS/Sass loaders before, we need to add the `babel-loader` to the rules array inside the module object in the Webpack configuration file. This will make Webpack run all `.js` files through Babel.

```bash
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
```

We also need to create a Babel configuration file (`.babelrc`) in the root directory and add some configuration options. The default configuration is `"presets": ["env"]`. However, you can add options to make sure your code will run in specific browsers you want to target.

```bash
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 9"]
      }
    }]
  ]
}
```

### Pug with Webpack
[Pug](https://pugjs.org/api/getting-started.html) is a template engine for Node.js.

```bash
npm install --save-dev pug pug-html-loader raw-loader
```

To use Pug with Webpack we need [pug-html-loader](https://github.com/willyelm/pug-html-loader), as well as [raw-loader](https://github.com/webpack-contrib/raw-loader), that allows Webpack to import files as string, and without which `pug-html-loader` will not work. <br />

We also need to add a new rule to the Webpack config file to run all `.pug` files through the two loaders, and we need to modify the entry point of the HTMLWebpackPlugin so that, instead of the `index.html` file, it now looks for the `index.pug` file.

//webpack.config.dev.js
```bash
module.exports = {
  ...

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
      inject: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['raw-loader','pug-html-loader']
      }
    ]
  }

  ...
};
```

Now you're ready to Pug your life away!

### Production
So far, we've been using Webpack dev server for development. If we want to use it for production, we need to add a script to our `package.json` file.

```bash
"build": "webpack --mode production --config build/webpack.config.dev.js"
```
