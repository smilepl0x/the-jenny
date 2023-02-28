// holy shit this is ugly
export const startSessionStringBuilder = ({
  original,
  user,
  role,
  game = "",
  numParty = 1,
  maxParty,
  party = [user],
}) => {
  return `${
    original
      ? original
      : `${user} has started a(n) ${role ? `<@&${role}>` : game} session.`
  }\n\`\`\`Current party (${numParty}${
    maxParty ? `/${maxParty}` : ""
  } deep):\n${party.map((member) => `${member.username}`).join(", ")}\`\`\``;
};
