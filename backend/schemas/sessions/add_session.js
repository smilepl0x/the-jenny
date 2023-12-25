export const addSessionSchema = {
  schema: {
    body: {
      type: "object",
      additionalProperties: false,
      required: ["channelId", "messageId", "partyMembers", "gameName"],
      properties: {
        channelId: { type: "string" },
        messageId: { type: "string" },
        partyMembers: {
          type: "array",
          items: {
            type: "string",
          },
        },
        gameName: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
        },
      },
    },
  },
};
