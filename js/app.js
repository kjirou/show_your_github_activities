var $e = {
    widgetMediaUrl: 'http://dev.kjirou.net/show_your_github_activities/w'
};

var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend();

App.Router = Ember.Router.extend({
    root: Ember.Route.extend({
        index: Ember.Route.extend({
            route: '/'
        })
    })
});

App.Widget = Ember.Object.extend({

    username: null,
    width: null,
    minWidth: 100,
    height: null,
    minHeight: 80,

    source: function(){
        var username = this.get('username');
        var width = this.get('width');
        var height = this.get('height');
        var src = '';
        src += '<iframe ';
        src += 'src="' + $e.widgetMediaUrl + '/i.html';
        src += '?u=' + encodeURIComponent(username);
        src += '&w=' + encodeURIComponent(width);
        src += '&h=' + encodeURIComponent(height) + '" ';
        src += 'width="' + width + '" ';
        src += 'height="' + height + '" ';
        src += 'scrolling="no" ';
        src += 'frameborder="0" ';
        src += 'marginwidth="0" ';
        src += 'marginheight="0">';
        src += '</iframe>';
        return src;
    }.property('username', 'width', 'height')
});
App.widget = App.Widget.create();

App.SettingsFormView = Ember.View.extend({
    templateName: 'settings_form',

    username: '',

    minWidthBinding: Ember.Binding.oneWay('App.widget.minWidth'),
    widthInput: '180',
    width: function(){
        return ~~this.get('widthInput');
    }.property('widthInput'),

    minHeightBinding: Ember.Binding.oneWay('App.widget.minHeight'),
    heightInput: '240',
    height: function(){
        return ~~this.get('heightInput');
    }.property('heightInput'),

    submit: function(evt){

        App.WidgetDisplayView.remove();
        App.WidgetSourceDisplayView.remove();

        var username = this.get('username');
        var width = this.get('width');
        var height = this.get('height');

        if (username === '') return false;
        if (width < this.minWidth) width = this.minWidth;
        if (height < this.minHeight) height = this.minHeight;

        App.widget.setProperties({
            username: username,
            width: width,
            height: height
        });

        App.WidgetDisplayView.draw();
        App.WidgetSourceDisplayView.draw();

        return false;
    }
});
App.SettingsFormView.create().appendTo('#settings_form_container');

App.WidgetDisplayView = Ember.View.extend({
    templateName: 'widget_display',

    sourceBinding: Ember.Binding.oneWay('App.widget.source'),

    iframeHtml: function(){
        var source = this.get('source');
        if (source === null) source = '';
        return new Handlebars.SafeString(source);
    }.property('source')
});
App.WidgetDisplayView.reopenClass({
    _instance: null,

    draw: function(){
        this._instance = this.create().appendTo('#widget_display_container');
    },

    remove: function(){
        if (this._instance !== null) {
            this._instance.remove();
            this._instance = null;
        }
    }
});

App.WidgetSourceDisplayView = Ember.View.extend({
    templateName: 'widget_source_display',

    sourceBinding: Ember.Binding.oneWay('App.widget.source'),

    textareaHtml: function(){
        var s = '';
        var source = this.get('source');
        if (source !== null) {
            // FIXME:
            //   I wanted to write into template like "<textarea>{{source}}</textarea>",
            //     but this case, "<script>" marker was included to textarea value
            s = '<textarea class="span10" rows="4" onclick="this.select()">' +
                Handlebars.Utils.escapeExpression(source) + '</textarea>';
        }
        return new Handlebars.SafeString(s);
    }.property('source')
});
App.WidgetSourceDisplayView.reopenClass({
    _instance: null,

    draw: function(){
        this._instance = this.create().appendTo('#widget_source_display_container');
    },

    remove: function(){
        if (this._instance !== null) {
            this._instance.remove();
            this._instance = null;
        }
    }
});

App.ready = function(){
}

App.initialize();
