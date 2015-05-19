/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('lodash');
var Backbone = require('backbone');
var Todos = new (Backbone.Collection.extend({}));

var CHANGE_EVENT = 'all';

var TodoStore = _.extend(Todos, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    return Todos.where({complete: true}).length || false;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return Todos.toJSON();
  },

  updateAll: function(updates) {
    this.forEach(function(todo) {
      todo.set(updates);
    });
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.off(CHANGE_EVENT, callback);
  }
});

AppDispatcher.on({
  TODO_CREATE: function(action) {
    var text = action.text.trim();

    if (text !== '') {
      var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

      TodoStore.add({
        id: id,
        complete: false,
        text: text
      });
    }
  },

  TODO_TOGGLE_COMPLETE_ALL: function() {
    var updates = {complete: true};

    if (TodoStore.areAllComplete()) {
      updates = {complete: false};
    }

    TodoStore.updateAll(updates);
  },

  TODO_UNDO_COMPLETE: function(action) {
    TodoStore.get(action.id).set({complete: false});
  },

  TODO_COMPLETE: function(action) {
    TodoStore.get(action.id).set({complete: true});
  },

  TODO_UPDATE_TEXT: function(action) {
    var text = action.text.trim();
    if (text !== '') {
      TodoStore.get(action.id).set({text: text});
    }
  },

  TODO_DESTROY: function(action) {
    TodoStore.remove({id: action.id});
  },

  TODO_DESTROY_COMPLETED: function(action) {
    TodoStore.remove(TodoStore.where({complete: true}));
  }
});


module.exports = TodoStore;
