import { Mongo } from "meteor/mongo";

const Players = new Mongo.Collection("players");


export function getAvailablePlayers() {
    return Players.find({}, { sort: { score: -1, name: 1 } });
}


export function getPlayerById(playerId) {
    return Players.findOne(playerId);
}

export function updatePlayerScore(selectedPlayer, pointsToAdd) {
    Players.update(selectedPlayer, { $inc: { score: pointsToAdd } });
}

export function addPlayer(player) {
    Players.insert(player);
}

export function countPlayers() {
    return Players.find().count();
}