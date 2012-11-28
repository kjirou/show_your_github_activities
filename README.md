Show Your Github Activities
===========================

This is a tiny web service for generating widget that show your GitHub activities


### Settings
```
$ cd /path/to/project_dir
$ cp index.html.example index.html
$ vim index.html

  ...
  <script src="js/libs/ember-1.0.0-pre.2.min.js"></script>
  <script type="text/javascript">
      var $e = {
          widgetMediaUrl: 'http://yoursitehost.com/w' // Mod this
      };
  </script>
  <script src="js/app.js"></script>
  ...
```
