const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express());
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DATABASE ERROR : ${e}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertBDObjectIntoResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//GET ALL PLAYERS API;

app.get("/players/", async (request, response) => {
  const allPlayersQuery = `
    SELECT *
    FROM 
    cricket_team;`;

  const getAllPlayersQuery = await db.all(allPlayersQuery);
  response.send(
    getAllPlayersQuery.map((eachPlayer) => {
      return convertBDObjectIntoResponseObject(eachPlayer);
    })
  );
});

//GET ONE PLAYER API;

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const onePlayerQuery = `
    SELECT *
    FROM 
    cricket_team
    WHERE player_id = ${playerId};`;

  const onePlayer = await db.get(onePlayerQuery);
  response.send(convertBDObjectIntoResponseObject(onePlayer));
});

// ADD PLAYER API;
app.post("/players/", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
    INSERT INTO 
    cricket_team( player_id , player_name,jersey_number, role)
    VALUES (${playerId} ,'${playerName}',${jerseyNumber},'${role}');`;

  await db.run(updatePlayerQuery);
  response.send("Player Added to Team");
});

//UPDATE PLAYER API;
app.put("/players/:playerId", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const { playerId } = request.params;

  const changesQuery = `
    UPDATE 
    cricket_team
    SET
    (player_id , player_name, jersey_number ,role)
    VALUES (${playerId},'${playerName}',${jersey_number},'${role}')`;

  await db.run(changesQuery);
  response.send("Player Details Updated");
});

//DELETE PLAYER API;
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
    DELETE 
    FROM cricket_team
    WHERE player_id = ${playerId}`;

  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
