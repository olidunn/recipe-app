export default {
  fetch() {
    return new Response(`Running on ${navigator.userAgent}!`);
  },
};
