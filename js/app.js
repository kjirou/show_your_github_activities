var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend();

App.Router = Ember.Router.extend({
    root: Ember.Route.extend({
        index: Ember.Route.extend({
            route: '/'
        })
    })
});







//App.Story = Ember.Object.extend({
//    isCompleted: false,
//    storyPoints: 0,
//    satisfaction: 0,
//    difficulty: 1//,
//});
//App.storiesController = Ember.ArrayController.create({
//    content: [],
//
//    createStory: function(){
//        var story = App.Story.create();
//        this.pushObject(story);
//        return story;
//    }
//});
//
//
//App.StorySlot = Ember.Object.extend({
//
//    /** Working in progress, story | null=Not using this slot */
//    story: null//,
//});
//App.storySlotsController = Ember.ArrayController.create({
//    content: [],
//
//    createStorySlot: function(){
//        var obj = App.StorySlot.create();
//        this.pushObject(obj);
//        return obj;
//    }
//});
//
//
//App.BoardView = Ember.View.extend({
//    classNames: ['board']
//});
//
//App.StoryView = Ember.View.extend({
//    classNames: ['story'],
//
//    isCompleted: undefined,
//
//    pos: [0, 0], // Used for initializing, only
//
//    didInsertElement: function(){
//        var self = this;
//        var pos = this.get('pos');
//        this.$().css({
//            top: pos[0],
//            left: pos[1],
//            zIndex: App.StoryView.ZINDEXES.DEFAULT//,
//        }).draggable({
//            opacity: 0.5,
//            start: function(evt, ui){ return self._onDragStart(evt, ui, self) },
//            drag: function(evt, ui){ return self._onDrag(evt, ui, self) },
//            stop: function(evt, ui){ return self._onDragStop(evt, ui, self) }//,
//        });
//    },
//
//    _onDragStart: function(evt, ui, self){
//        ui.helper.css({
//            zIndex: App.StoryView.ZINDEXES.DRAGGING
//        });
//    },
//
//    _onDrag: function(evt, ui, self){
//    },
//
//    _onDragStop: function(evt, ui, self){
//        ui.helper.css({
//            zIndex: App.StoryView.ZINDEXES.DEFAULT
//        });
//    }//,
//});
//App.StoryView.reopenClass({
//
//    SIZE: [32, 32],
//
//    ZINDEXES: {
//        DRAGGING: 1000,
//        DEFAULT: 1//,
//    },
//
//    createByStory: function(story){
//        var obj = this.create();
//        obj.isCompleted = story.get('isCompleted');
//        story.addObserver('isCompleted', function(){
//            obj.set('isCompleted', this.get('isCompleted'));
//        });
//        return obj;
//    }
//});
//
//
//Ember.View.create({
//    elementId: 'game',
//}).appendTo('#application');
//
//
//App.BoardView.create({
//    elementId: 'master_story_list_board',
//
//    size: [600, 120],
//
//    sizeChanged: Ember.observer(function(){
//        var size = this.get('size');
//        if (this.$() !== undefined) {// It is empty before initializing
//            this.$().css({
//                width: size[0],
//                height: size[1]
//            });
//        }
//    }, 'size'),
//
//    didInsertElement: function(){
//        var size = this.get('size');
//        this.$().css({
//            width: size[0],
//            height: size[1]
//        });
//    }
//}).appendTo('#game');
//
//
//App.BoardView.create({
//    elementId: 'story_board',
//
//    size: [240, 60],
//
//    didInsertElement: function(){
//        var size = this.get('size');
//        this.$().css({
//            width: size[0],
//            height: size[1]
//        });
//    }
//}).appendTo('#game');
//
//App.StorySlotView = App.BoardView.extend({
//
//    classNames: ['story_slot'],
//    pos: [0, 0],
//    size: [80, 60], // Sync to slot count and css
//    story: null,
//
//    didInsertElement: function(){
//        var self = this;
//        var pos = this.get('pos');
//        var size = this.get('size');
//        this.$().css({
//            top: pos[0],
//            left: pos[1],
//            width: size[0],
//            height: size[1]//,
//        }).droppable({
//            accept: '.story',
//            hoverClass: 'hover_draggable_to_story_slot',
//            drop: function (evt, ui) {
//                return self._onDrop(evt, ui, self);
//            }
//        });
//    },
//
//    // drop -> drag stop の順
//    _onDrop: function(evt, ui, self){
//        if (self.get('story') !== null) return false;
//        //var helperView = Ember.View.views[ui.draggable.attr('id')];
//        ui.draggable.css({
//            top: 0,
//            left: 0
//        }).appendTo(self.$());
//    }
//});
//App.StorySlotView.reopenClass({
//    SIZE: [80, 60],
//    createByStorySlot: function(storySlot){
//        var view = this.create();
//        storySlot.addObserver('story', function(){
//            view.set('story', this.get('story'));
//        });
//        return view;
//    }
//});
//
//
//App.BoardView.create({
//    elementId: 'members_board'
//}).appendTo('#game');
//
//App.BoardView.create({
//    elementId: 'recruitment_board'
//}).appendTo('#game');
//
//App.BoardView.create({
//    elementId: 'charts_board'
//}).appendTo('#game');
//
//App.BoardView.create({
//    elementId: 'manager_board'
//}).appendTo('#game');
//
//App.BoardView.create({
//    elementId: 'client_board'
//}).appendTo('#game');

App.initialize();

App.ready = function(){

    //// Stories
    //var storyCount = 5;
    //var storyPosses = $f.squaring(
    //    App.StoryView.SIZE,
    //    Ember.View.views['master_story_list_board'].get('size'),
    //    4
    //);
    //$f.times(storyCount, function(i){
    //    var story = App.storiesController.createStory();
    //    var pos = storyPosses[i];
    //    var view = App.StoryView.createByStory(story);
    //    view.set('pos', pos)
    //    view.appendTo('#master_story_list_board');
    //});

    //// Story slots
    //var storySlotCount = 3;
    //var storySlotPosses = $f.squaring(
    //    App.StorySlotView.SIZE,
    //    Ember.View.views['story_board'].get('size')
    //);
    //$f.times(storySlotCount, function(i){
    //    var storySlot = App.storySlotsController.createStorySlot();
    //    var pos = storySlotPosses[i];
    //    var view = App.StorySlotView.createByStorySlot(storySlot);
    //    view.set('pos', pos);
    //    view.appendTo('#story_board');
    //});
}
