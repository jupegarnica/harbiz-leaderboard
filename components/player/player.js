import { Template } from "meteor/templating";
import { Session } from "meteor/session";


if (Meteor.isClient) {

    Template.player.helpers({
      selected: function () {
        return Session.equals("selectedPlayer", this._id) ? "selected" : '';
      },

    });

    Template.player.events({
      'click': function () {
        Session.set("selectedPlayer", this._id);
      }
    });
  }
