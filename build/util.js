(function() {
  exports.capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  exports.capitalizeClass = function(s) {
    return s.split("::").map(exports.capitalize).join("::");
  };

  exports.regexpEscape = function(s) {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  };

}).call(this);
