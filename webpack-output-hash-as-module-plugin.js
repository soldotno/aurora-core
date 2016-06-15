/**
 * Dependencies
 */
var fs = require('fs');
var path = require('path');

/**
 * NOTE: This whole thing could (should..) be outsourced to
 * npm or as an aurora-* package in github (separate repo)
 */

/**
 * Create the plugin constructor
 */
function OutputHashAsModulePlugin(options) {
  this.file = path.resolve(__dirname, ((options || {}).file || 'bundle-hash.js'));
}

/**
 * Implement plugin functionality
 * to hook onto webpack build events
 */
OutputHashAsModulePlugin.prototype.apply = function(compiler) {
  /**
   * When the bundle building is done
   * we write the bundle hash to a file
   * that can be required by the server
   */
  compiler.plugin('emit', function(compilation, callback) {
    var content = 'module.exports = \"' + compilation.hash + '\";';
    fs.writeFile(this.file, content, 'utf-8', callback);
  }.bind(this));
};

module.exports = OutputHashAsModulePlugin;
