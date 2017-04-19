'use strict';
var through = require('through2');
var extend = require('extend');
var gutil = require('gulp-util');
var Px2rem = require('./lib/px2rem');

var PluginError = gutil.PluginError;


module.exports = function (options) {
  var config = {
    baseDpr: 2,             // base device pixel ratio (default: 2)
    remUnit: 75,            // rem unit value (default: 75)
    remPrecision: 6,        // rem value precision (default: 6)
    forcePxComment: 'px',   // force px comment (default: `px`)
    keepComment: 'no',       // no transform value comment (default: `no`)
    filterProperty: [],
    minPixelValue: 1,
    remVersion: true
  };

  extend(config, options);
  function transformFunction(file, encoding, callback) {
    /* istanbul ignore if */
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isBuffer()) {
      var px2remIns = new Px2rem(config);
      var cssText = file.contents.toString('utf8');

      // generate @1x, @2x and @3x version stylesheet
      if (config.threeVersion) {
        for (var dpr = 1; dpr <= 3; dpr++) {
          var newCssText = px2remIns.generateThree(cssText, dpr);
          var vfile = new gutil.File({
            cwd: file.cwd,
            base: file.base,
            path: file.path.replace(/(.debug)?.css$/, dpr + 'x.debug.css'),
            contents: new Buffer(newCssText)
          });
          this.push(vfile);
        }
      }

      // generate rem version stylesheet
      if (config.remVersion) {
        var newCssText = px2remIns.generateRem(cssText);
        var vfile = new gutil.File({
          cwd: file.cwd,
          base: file.base,
          path: file.path,
          contents: new Buffer(newCssText)
        });
        this.push(vfile);
      }
    }

    return callback(); // indicate that the file has been processed
  }

  return through.obj(transformFunction); // return the file stream
};
