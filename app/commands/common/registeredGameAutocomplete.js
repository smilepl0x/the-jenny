import { serviceFetch } from "../../utils/serviceFetch.js";

const registeredGameAutocomplete = async (interaction) => {
  // TODO: may need to keep local cache for this at some point
  const { games } = await serviceFetch({ path: "/games" });
  const value = interaction.options.getFocused().toLowerCase();
  const filteredGames = games.filter(
    (game) =>
      game.game_name.toLowerCase().includes(value) ||
      game.aliases.some((alias) => alias.toLowerCase().includes(value))
  );
  await interaction.respond(
    filteredGames.map((filteredGame) => ({
      name: filteredGame.game_name,
      value: filteredGame.game_name,
    }))
  );
};

export default registeredGameAutocomplete;
