const axios = require("axios");
const _ = require("lodash");

const USER_ID = "718389146-tusharlock10";
const USER_NAME = USER_ID.split("-")[1];
const URL = `https://api.paladins.guru/v3/profiles/${USER_ID}/matches`;
let MAX_MATCHES = 0;

const maxKillsPerPage = async page => {
  const { data } = await axios.default.get(URL, { params: { page } });

  let maxKills = 0;
  let index = 0;
  let match_id = 0;

  data.matches.data.map((match, i) => {
    match.players.map(player => {
      if (player.name === USER_NAME) {
        index = maxKills < player.kills ? i : index;
        match_id = maxKills < player.kills ? match.match_id : match_id;
        maxKills = maxKills < player.kills ? player.kills : maxKills;
      }
    });
  });

  return { maxKills, match_id };
};

const main = async () => {
  const { data } = await axios.default.get(URL, { params: { page: 0 } });
  MAX_MATCHES = data.matches.cursor.max;

  console.log("MAX : ", MAX_MATCHES);

  let promises = [];

  for (let page = 0; page < MAX_MATCHES + 1; page++) {
    promises.push(maxKillsPerPage(page));
  }

  const ALL_MATCHES = await Promise.all(promises);

  console.table(_.sortBy(ALL_MATCHES, ["maxKills"]).reverse());
};

main();
