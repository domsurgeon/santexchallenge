import { Coach, League, Player, Team } from "./models/League.js";
import dotenv from 'dotenv'

dotenv.config()

const API_URI = process.env.API_URI
const options = {
  headers: {
    "X-Auth-Token": process.env.UR_TOKEN
  }
}

const resolvers = {
  Query: {
    players: async (parent, args) => {
      const {leagueCode, teamName} = args

      if (teamName) {
        const teamPlayers = await Player.find({ leagueCode, teamName })

        if (teamPlayers.length) {
          return teamPlayers
        }
        const coach = await Coach.findOne({ leagueCode, teamName })

        if (coach) {
          return coach
        }
        return { error: err.message || `No Players/Coach Available` }
      }

      const allPlayers = await Player.find({ leagueCode })
      
      return allPlayers
    },
    team: async (parent, args) => {
      const { leagueCode, name, withPlayersOrCoach } = args
      const team = await Team.findOne({ leagueCode, name })

      if (team) {
        if (withPlayersOrCoach) {
          const responseTeam = { ...team }
          const players = await Player.find({ leagueCode, teamName: name })

          if (players.length) {
            responseTeam.players = players
          } else {
            const coach = await Coach.findOne({ leagueCode, teamName: name })
            responseTeam.coach = coach
          }

          return responseTeam
        }

        return team
      }

      return { error: err.message || `No Team Available` }
    },
  },
  Mutation: {
    importLeague: async (parent, args) => {
      const { leagueCode } = args

      const foundLeague = await League.findOne({ code: leagueCode })

      if (!foundLeague) {

        const leagueRequestStr = `${API_URI}/competitions/${leagueCode}`;

        try {
          const leagueAPIResponse = await got(leagueRequestStr, options);
          const leagueAPIData = JSON.parse(leagueAPIResponse.body);

          const teamsRequestStr = `${API_URI}/competitions/${leagueCode}/teams`;

          try {
            const teamAPIResponse = await got(teamsRequestStr, options);
            const teamsAPIData = JSON.parse(teamAPIResponse.body);
            const teamsPromises = []

            for (let teamData of teamsAPIData.teams) {
              const team = new Team({
                name: teamData.name,
                tla: teamData.tla,
                shortName: teamData.shortName,
                areaName: teamData.area.name,
                address: teamData.address,
                leagueCode: leagueAPIData.code,
              })

              const teamRequestStr = `${API_URI}/teams/${teamData.id}`;

              try {
                const teamAPIResponse = await got(teamRequestStr, options);
                const teamAPIData = JSON.parse(teamAPIResponse.body);
                const playersPromises = []

                for (let dataPlayer of teamAPIData.squad) {
                  const { name, dateOfBirth, nationality, position } = dataPlayer
                  const player = new Player({
                    name,
                    dateOfBirth,
                    nationality,
                    leagueCode: leagueAPIData.code,
                    teamName: teamData.name,
                  })
                  playersPromises.push(player.save())
                }

                await Promise.all(playersPromises)

                const { name, dateOfBirth, nationality } = teamData.coach
                const coach = new Coach({
                  name,
                  dateOfBirth,
                  nationality,
                  leagueCode: leagueAPIData.code,
                  teamName: teamData.name,
                })

                await coach.save()

              } catch (err) {
                console.log(teamRequestStr, "err");
                return { error: err.message || `No Available Team` };
              }

              teamsPromises.push(team.save())
            }

            await Promise.all(teamsPromises)

          } catch (err) {
            console.log(teamsRequestStr, "err");
            return { error: err.message || `No Available Teams` };
          }

          const league = new League({
            name: leagueAPIData.name,
            code: leagueAPIData.code,
            areaName: leagueAPIData.area.name
          })

          await league.save()

          return league
        } catch (err) {
          console.log(leagueRequestStr, "err");
          return { error: err.message || `No Available League` };
        }
      }

      return foundLeague
    }
  }
}

export default resolvers;