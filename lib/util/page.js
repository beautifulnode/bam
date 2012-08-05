// Generated by CoffeeScript 1.3.3
var Page, cc, eco, fs, ghm, renderTemplate, wrench;

fs = require('fs');

ghm = require('github-flavored-markdown');

cc = require('./zeke')();

wrench = require('wrench');

eco = require('eco');

renderTemplate = function(proj, body) {
  var template;
  if (proj == null) {
    proj = '.';
  }
  if (body == null) {
    body = "";
  }
  template = fs.readFileSync("" + proj + "/layout.html", "utf8");
  return eco.render(template, {
    body: body
  });
};

Page = (function() {

  function Page(pathname) {
    var index, page, _i, _len, _ref;
    this.pathname = pathname != null ? pathname : '';
    this.pages = wrench.readdirSyncRecursive('pages');
    if (this.pathname !== '') {
      _ref = this.pages;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        page = _ref[index];
        if ('/' + (page != null ? page.split('.')[0] : void 0) === pathname) {
          this.ext = page.split('.')[1];
        }
      }
    }
  }

  Page.prototype.markdown = function() {
    return ghm.parse(fs.readFileSync("./pages" + this.pathname + ".md").toString());
  };

  Page.prototype.html = function() {
    return fs.readFileSync("./pages" + this.pathname + ".html").toString();
  };

  Page.prototype.coffee = function() {
    return cc.render(fs.readFileSync("./pages" + this.pathname + ".coffee").toString());
  };

  Page.prototype.render = function() {
    var body;
    body = (function() {
      switch (this.ext) {
        case 'coffee':
          return this.coffee();
        case 'md':
          return this.markdown();
        default:
          return this.html();
      }
    }).call(this);
    return renderTemplate('.', body);
  };

  Page.prototype.build = function(body, page, gen) {
    var fullName, name;
    name = page.split('.')[0];
    if (body === 'DIR') {
      return fs.mkdirSync("" + gen + "/" + name);
    } else {
      fullName = [name, 'html'].join('.');
      return fs.writeFileSync("" + gen + "/" + fullName, body, 'utf8');
    }
  };

  Page.prototype.all = function(dest, proj) {
    var body, page, _i, _len, _ref, _ref1, _results;
    this.proj = proj;
    console.log(this.pages);
    _ref = this.pages;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      page = _ref[_i];
      _ref1 = ("/" + page).split('.'), this.pathname = _ref1[0], this.ext = _ref1[1];
      body = this.ext != null ? this.render() : 'DIR';
      _results.push(this.build(body, page, dest));
    }
    return _results;
  };

  return Page;

})();

module.exports = Page;