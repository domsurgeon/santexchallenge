import mongoose from "mongoose";

export const League = mongoose.model("League", {
  name: String,
  code: String,
  areaName: String,
});

export const Team = mongoose.model("Team", {
  name: String,
  tla: String,
  shortName: String,
  areaName: String,
  address: String,
  leagueCode: String,
});

export const Player = mongoose.model("Player", {
  name: String,
  position: String,
  dateOfBirth: Date,
  nationality: String,
  leagueCode: String,
  teamName: String,
});

export const Coach = mongoose.model("Coach", {
  name: String,
  dateOfBirth: Date,
  nationality: String,
  leagueCode: String,
  teamName: String,
});
