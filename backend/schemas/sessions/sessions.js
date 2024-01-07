export const sessionsSchema = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        sl: { type: "string" },
      },
      required: ["sl"],
    },
    response: {
      200: {
        type: "object",
        patternProperties: {
          "^[0-9]+$": {
            type: "object",
            properties: {
              session_id: { type: "string" },
              start_time: { type: "string" },
              channel_id: { type: "string" },
              message_id: { type: "string" },
              partyMembers: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              game_id: { type: "string" },
            },
          },
        },
        properties: {
          status: { type: "integer" },
        },
      },
    },
  },
};
