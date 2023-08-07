import Api from "./Api";
import Users from "./Users";
import Messages from "./Messages";

// const api = new Api("http://localhost:7070/");
const api = new Api("https://chat-gj8s.onrender.com/");
const usersBox = document.querySelector(".users-box");
const users = new Users(usersBox);

//___________________________WS_________________________

const runWebSocket = () => {
  const messagesBox = document.querySelector(".messages-box");
  const chat = new Messages(messagesBox);
  const messageInput = document.querySelector(".message-input");
  const userItems = [...document.querySelectorAll(".user-item")];
  const sender = userItems.filter((item) => item.dataset.name);
  const senderName = sender[0].dataset.name;
  // const ws = new WebSocket("ws://localhost:7070/ws");
  const ws = new WebSocket("wss://chat-gj8s.onrender.com/ws");

  messageInput.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.code !== "Enter") return;
    if (!messageInput.value) return;
    const date = new Date();
    ws.send(
      JSON.stringify({ name: senderName, date, message: messageInput.value }),
    );
    messageInput.value = "";
  });

  window.addEventListener("beforeunload", () => {
    api.deleteUser({ name: senderName });
    ws.send(JSON.stringify({ closed: senderName }));
  });

  ws.addEventListener("open", (e) => {
    ws.send(JSON.stringify({ senderName }));
  });

  ws.addEventListener("close", (e) => {
    console.log(e);
    console.log("close ws");
  });

  ws.addEventListener("error", (e) => {
    console.log(e);
    console.log("error ws");
  });

  ws.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);
    const { closed } = data;
    const { chat: messages } = data;
    const { senders } = data;
    if (messages) {
      messages.forEach((message) => {
        chat.addMessage(message);
      });
    } else if (senders) {
      senders.forEach((sender) => {
        users.addUser(sender);
      });
    } else if (closed) {
      const userClosed = closed[0].closed;
      const allUsers = [...users.usersBox.querySelectorAll(".user-name")];
      allUsers.forEach((user) => {
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
  const incorrectNameButton = modalIncorrectName.querySelector(
    ".incorrect-name-button",
  );
  const toCloseModal = () => {
    modalIncorrectName.style.display = "none";
    toRegister();
  };
  incorrectNameButton.addEventListener("click", toCloseModal);
};

const toLogin = (response) => {
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
    api.addUser({ name }).then((response) => {
      if (response.status === "name already use") {
        modalRegister.style.display = "none";
        showModalIncorrectName();
      } else {
        modalRegister.style.display = "none";
        toLogin(response);
        api.getUser().then((response) => {
          response.forEach((sender) => {
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
