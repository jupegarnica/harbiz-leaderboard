import { Template } from "meteor/templating";
import { groupBy } from '../../services/utils.service';
import { POINTS_TO_ADD } from '../../services/constants.service';
import { getAvailablePlayers, getPlayerById, updatePlayerScore } from '../../services/db.service';

if (Meteor.isClient) {
    Template.leaderboard.helpers({
        players: function () {
            const foundPlayers = getAvailablePlayers();
            const groupByType = groupBy(foundPlayers, "type");
            groupByType.all = foundPlayers;
            return groupByType;
        },
        selectedPlayer: function () {

            const player = getPlayerById(Session.get("selectedPlayer"));
            if (player) {
                Session.set("pointsToAdd", POINTS_TO_ADD[player.type]);
                return player;
            }
            throw new Error("Player not found");


        },
        pointsToAdd() {
            return Session.get("pointsToAdd");
        },
        splitByType() {
            return Session.get("splitByType");
        }
    });

    Template.leaderboard.events({
        'click .inc': function () {
            const pointsToAdd = Session.get("pointsToAdd");
            const selectedPlayer = Session.get("selectedPlayer");
            updatePlayerScore(selectedPlayer, pointsToAdd);
        },
        'input #split': function (event) {

            Session.set("splitByType", event.target.checked);
        }
    });

}