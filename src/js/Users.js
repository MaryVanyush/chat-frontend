export default class Users {
  constructor(usersBox) {
    this.usersBox = usersBox;
  }

  addUser(data) {
    const userItems = [...document.querySelectorAll(".user-item")];
    const sender = userItems.filter((item) => item.dataset.name);
    const name = sender[0].dataset.name;
    if (name === data.senderName || name === data.name) return;
    const user = this.createUser(data);
    this.usersBox.appendChild(user);
  }

  createUser(data) {
    const user = document.createElement("li");
    user.classList = "user-item";
    const userImage = document.createElement("div");
    userImage.classList = "user-image";
    const userName = document.createElement("span");
    userName.classList = "user-name";
    if (data.name) {
      userName.textContent = data.name;
    } else {
      userName.textContent = data.senderName;
    }
    user.appendChild(userImage);
    user.appendChild(userName);
    return user;
  }
}
