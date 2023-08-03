export default class Messages {
  constructor(messagesBox) {
    this.messagesBox = messagesBox;
  }

  addMessage(data) {
    const userItems = [...document.querySelectorAll(".user-item")];
    const sender = userItems.filter((item) => item.dataset.name);
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
    const formattedDate = new Date(dateString)
      .toLocaleString("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
      .split(",")
      .join("");
    return formattedDate;
  }
}
