export const replyHandler = (reply, condition, additional = {}) => {
  if (condition) {
    return reply.send({ status: 0, ...additional });
  } else {
    return reply.send({ status: 1, ...additional });
  }
};
