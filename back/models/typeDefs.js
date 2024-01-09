import { gql } from "graphql-tag";

const typeDefs = gql`  
  type Query {
    players(leagueCode: String!, teamName: String): [Player]
    team(leagueCode: String!, withPlayersOrCoach: Boolean!, name: String): Team
  }


  type League {
    name: String!
    code: String!
    areaName: String
  }

  type Team {
    name: String!
    leagueCode: String!
    tla: String
    shortName: String
    areaName: String
    address: String
    coach: Coach
    players: [Player]
  }

  type Player {
    name: String!
    teamName: String!
    leagueCode: String!
    position: String
    dateOfBirth: String
    nationality: String
  }

  type Coach {
    name: String!
    teamName: String!
    leagueCode: String!
    position: String
    dateOfBirth: String
    nationality: String
  }

  type Mutation {
    importLeague(leagueCode: String): League
  }
`;



export default typeDefs;