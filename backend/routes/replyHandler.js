export const replyHandler = (reply, condition) => {
  if (condition) {
    return reply.send({ status: "ok" });
  } else {
    return reply.send({ status: "not ok" });
  }
};
