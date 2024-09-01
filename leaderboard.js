import { Meteor } from 'meteor/meteor';
import { Template } from "meteor/templating";
import { Mongo } from "meteor/mongo";
import { Session } from "meteor/session";

const POINTS_TO_ADD = {
  scientist: 10,
  actor: 15,
  athlete: 5
};

const Players = new Mongo.Collection("players");

function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }
    , {});
}

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      const foundPlayers = Players.find({}, { sort: { score: -1, name: 1 } });
      const groupByType = groupBy(foundPlayers.fetch(), "type");
      console.log(groupByType);

      return groupByType;
    },
    selectedPlayer: function () {

      const player = Players.findOne(Session.get("selectedPlayer"));
      if (player) {
        Session.set("pointsToAdd", POINTS_TO_ADD[player.type]);
        return player;
      }
      throw new Error("Player not found");


    },
    pointsToAdd() {
      return Session.get("pointsToAdd");
    }
  });

  Template.leaderboard.events({
    'click .inc': function () {
      const pointsToAdd = Session.get("pointsToAdd");
      Players.update(Session.get("selectedPlayer"), { $inc: { score: pointsToAdd } });
    }
  });

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

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Players.remove({});
    if (Players.find().count() === 0) {
      const defaultPlayers = [
        { name: "Ada Lovelace", score: 50, type: "scientist" },
        { name: "Grace Hopper", score: 40, type: "scientist" },
        { name: "Marie Curie", score: 30, type: "scientist" },
        { name: "Carl Friedrich Gauss", score: 20, type: "scientist" },
        { name: "Nikola Tesla", score: 10, type: "scientist" },
        { name: "Albert Einstein", score: 5, type: "scientist" },
        { name: "Isaac Newton", score: 0, type: "scientist" },
        { name: "Galileo Galilei", score: 0, type: "scientist" },


        { name: "Tom Hanks", score: 70, type: "actor" },
        { name: "Robert Downey Jr.", score: 60, type: "actor" },
        { name: "Scarlett Johansson", score: 55, type: "actor" },
        { name: "Leonardo DiCaprio", score: 50, type: "actor" },
        { name: "Meryl Streep", score: 45, type: "actor" },
        { name: "Denzel Washington", score: 40, type: "actor" },
        { name: "Natalie Portman", score: 35, type: "actor" },
        { name: "Tom Cruise", score: 30, type: "actor" },
        { name: "Angelina Jolie", score: 25, type: "actor" },
        { name: "Will Smith", score: 20, type: "actor" },
        { name: "Johnny Depp", score: 15, type: "actor" },
        { name: "Jennifer Lawrence", score: 10, type: "actor" },
        { name: "Brad Pitt", score: 5, type: "actor" },
        { name: "Emma Stone", score: 0, type: "actor" },

        { name: "Usain Bolt", score: 70, type: "athlete" },
        { name: "Simone Biles", score: 65, type: "athlete" },
        { name: "Michael Phelps", score: 60, type: "athlete" },
        { name: "Serena Williams", score: 55, type: "athlete" },
        { name: "Roger Federer", score: 50, type: "athlete" },
        { name: "Lionel Messi", score: 45, type: "athlete" },
        { name: "Cristiano Ronaldo", score: 40, type: "athlete" },
        { name: "LeBron James", score: 35, type: "athlete" },
        { name: "Kevin Durant", score: 30, type: "athlete" },
        { name: "Tom Brady", score: 25, type: "athlete" },
        { name: "Stephen Curry", score: 20, type: "athlete" },
        { name: "Rafael Nadal", score: 15, type: "athlete" },
        { name: "Novak Djokovic", score: 10, type: "athlete" },
        { name: "Kobe Bryant", score: 5, type: "athlete" },
        { name: "Floyd Mayweather", score: 0, type: "athlete"}
      ];

      defaultPlayers.forEach(player => Players.insert(player));
    }
  });
}
