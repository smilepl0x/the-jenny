// Wrapper around fetch to return json with out a bunch of ugly awaits
export const serviceFetch = async ({ path, method = "GET", body = null }) => {
  console.log(
    "serviceFetch request::",
    path,
    body ? JSON.stringify(body) : null
  );
  try {
    const response = await fetch(
      `http://${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}${path}`,
      {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await response?.json();
    console.log("serviceFetch response:: ", path, json);
    return json || {};
  } catch (e) {
    console.log(e);
  }
};
