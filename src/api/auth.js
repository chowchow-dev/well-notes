const baseUrl = "https://dummyjson.com";
export default {
  async login() {
    await wait(250);
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "emilys",
        password: "emilyspass",
        expiresInMins: 60 * 60, // optional, defaults to 60
      }),
    });
    const data = await response.json();
    return data;
  },

  async getMe(token) {
    await wait(250);
    const response = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  },
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
