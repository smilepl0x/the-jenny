const onAutocomplete = async (interaction) => {
  try {
    const command = interaction.client.commands.get(interaction.commandName);
    command.autocomplete(interaction);
  } catch (e) {
    console.error(e);
  }
};

export default onAutocomplete;
