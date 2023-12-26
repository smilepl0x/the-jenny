// holy shit this is ugly
export const startSessionStringBuilder = ({
  original,
  interaction,
  role,
  game = "",
  numParty = 1,
  maxParty,
  party = [interaction],
}) => {
  return `${
    original
      ? original
      : `${interaction.user} has started a(n) ${
          role ? `<@&${role}>` : game
        } session.`
  }
  \`\`\`Current party (${numParty}${
    maxParty ? `/${maxParty}` : ""
  }):\n\t${party.join(", ")}\`\`\``;
};
