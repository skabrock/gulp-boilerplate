# **Gulp Boilerplate v2.0**

## **QUICK START**

Clone repository to your local machine

    git clone git@git.dowell.com.ua:shared/gulp-boilerplate.git

Install global dependencies:

    npm install -g gulp bower

Install packages:

    bower install
    npm install

All your source files located in assets directory by default.

Run to start your application:

    gulp dev

You can see 'build/' directory in the root of your project. Live reload server will automatically redirect you to dev server **http://localhost:3030**

**3030 port by default. If you want to set another port, use:**

    PORT=YOUR_PORT gulp dev

### Commands
make static build

    gulp

run development server with live reload

    gulp dev

clean all generated files

    gulp clean

**Note:**

* Make sure you have gulp version 4. **gulp -v**
* Don't forget use **NODE_ENV=production** for deploy

**Designed in [Dowell](http:dowell.com.ua "Dowell") by [skabr](https://github.com/skabrock)**
