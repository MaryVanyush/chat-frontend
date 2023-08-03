export default class Api {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async addUser(user) {
    const request = fetch(this.apiUrl + "users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const result = await request;
    const json = await result.json();
    return json;
  }

  async getUser() {
    const request = fetch(this.apiUrl + "users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await request;
    const json = await result.json();
    return json;
  }

  async deleteUser(user) {
    const query = "users/" + encodeURIComponent(user.name);
    const request = fetch(this.apiUrl + query, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await request;
    if (!result.ok) {
      console.error("error");
      return;
    }
    const json = await result.json();
    const status = json.status;
    console.log(status);
  }
}
