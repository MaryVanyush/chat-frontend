/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Api.js
class Api {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  async addUser(user) {
    const request = fetch(this.apiUrl + "users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    const result = await request;
    const json = await result.json();
    return json;
  }
  async getUser() {
    const request = fetch(this.apiUrl + "users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
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
        "Content-Type": "application/json"
      }
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
;// CONCATENATED MODULE: ./src/js/Users.js
class Users {
  constructor(usersBox) {
    this.usersBox = usersBox;
  }
  addUser(data) {
    const userItems = [...document.querySelectorAll(".user-item")];
    const sender = userItems.filter(item => item.dataset.name);
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
;// CONCATENATED MODULE: ./src/js/Messages.js
class Messages {
  constructor(messagesBox) {
    this.messagesBox = messagesBox;
  }
  addMessage(data) {
    const userItems = [...document.querySelectorAll(".user-item")];
    const sender = userItems.filter(item => item.dataset.name);
    if (!sender[0]) return;
    const message = this.createMessage(data, sender);
    this.messagesBox.appendChild(message);
  }
  createMessage(data, sender) {
    const message = document.createElement("div");
    message.classList = "message";
    const dataMessage = document.createElement("span");
    dataMessage.classList = "data-message";
    const date = this.getDate(data.date);
    const name = sender[0].dataset.name;
    if (name === data.name) {
      message.classList.add("you");
      dataMessage.classList.add("you");
      dataMessage.textContent = "You, " + date;
    } else {
      dataMessage.textContent = data.name + ", " + date;
    }
    const textMessage = document.createElement("div");
    textMessage.classList = "text-message";
    textMessage.textContent = data.message;
    message.appendChild(dataMessage);
    message.appendChild(textMessage);
    return message;
  }
  getDate(dateString) {
    const formattedDate = new Date(dateString).toLocaleString("ru-RU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    }).split(",").join("");
    return formattedDate;
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



const api = new Api("http://localhost:7070/");
const usersBox = document.querySelector(".users-box");
const users = new Users(usersBox);

//___________________________WS_________________________

const runWebSocket = () => {
  const messagesBox = document.querySelector(".messages-box");
  const chat = new Messages(messagesBox);
  const messageInput = document.querySelector(".message-input");
  const userItems = [...document.querySelectorAll(".user-item")];
  const sender = userItems.filter(item => item.dataset.name);
  const senderName = sender[0].dataset.name;
  const ws = new WebSocket("ws://localhost:7070/ws");
  messageInput.addEventListener("keyup", event => {
    event.preventDefault();
    if (event.code !== "Enter") return;
    if (!messageInput.value) return;
    const date = new Date();
    ws.send(JSON.stringify({
      name: senderName,
      date,
      message: messageInput.value
    }));
    messageInput.value = "";
  });
  window.addEventListener("beforeunload", () => {
    api.deleteUser({
      name: senderName
    });
    ws.send(JSON.stringify({
      closed: senderName
    }));
  });
  ws.addEventListener("open", e => {
    ws.send(JSON.stringify({
      senderName
    }));
  });
  ws.addEventListener("close", e => {
    console.log(e);
    console.log("close ws");
  });
  ws.addEventListener("error", e => {
    console.log(e);
    console.log("error ws");
  });
  ws.addEventListener("message", e => {
    const data = JSON.parse(e.data);
    const {
      closed
    } = data;
    const {
      chat: messages
    } = data;
    const {
      senders
    } = data;
    if (messages) {
      messages.forEach(message => {
        chat.addMessage(message);
      });
    } else if (senders) {
      senders.forEach(sender => {
        users.addUser(sender);
      });
    } else if (closed) {
      const userClosed = closed[0].closed;
      const allUsers = [...users.usersBox.querySelectorAll(".user-name")];
      allUsers.forEach(user => {
        if (user.textContent === userClosed) {
          let item = user.closest(".user-item");
          item.remove();
        }
      });
    }
  });
};

//___________________ login___________________

const showModalIncorrectName = () => {
  const modalIncorrectName = document.querySelector(".modal-incorrect-name");
  modalIncorrectName.style.display = "flex";
  const incorrectNameButton = modalIncorrectName.querySelector(".incorrect-name-button");
  const toCloseModal = () => {
    modalIncorrectName.style.display = "none";
    toRegister();
  };
  incorrectNameButton.addEventListener("click", toCloseModal);
};
const toLogin = response => {
  const chatWidget = document.querySelector(".chat-widget");
  const usersList = document.querySelector(".users-list>ul");
  const userItem = document.createElement("li");
  userItem.classList = "user-item";
  userItem.dataset.name = response.name;
  const userImage = document.createElement("div");
  userImage.classList = "user-image";
  const userName = document.createElement("span");
  userName.classList = "user-name";
  userName.classList.add("you");
  userName.textContent = "You";
  userItem.appendChild(userImage);
  userItem.appendChild(userName);
  usersList.appendChild(userItem);
  chatWidget.style.display = "flex";
};
const toRegister = () => {
  const modalRegister = document.querySelector(".modal-register");
  modalRegister.style.display = "flex";
  const registerName = modalRegister.querySelector(".register-name");
  const registerButton = modalRegister.querySelector(".register-button");
  const toSubmit = () => {
    event.preventDefault();
    const name = registerName.value;
    if (name === "") return;
    registerName.value = "";
    api.addUser({
      name
    }).then(response => {
      if (response.status === "name already use") {
        modalRegister.style.display = "none";
        showModalIncorrectName();
      } else {
        modalRegister.style.display = "none";
        toLogin(response);
        api.getUser().then(response => {
          response.forEach(sender => {
            users.addUser(sender);
          });
          runWebSocket();
        });
      }
    });
    registerButton.removeEventListener("click", toSubmit);
  };
  registerButton.addEventListener("click", toSubmit);
};
document.addEventListener("DOMContentLoaded", toRegister);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map