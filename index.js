function createElement(tag, attributes, children) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    self.state = {
      input: "",
      todos: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false },
      ],
    };
  }


  onAddTask() {
    const input = document.getElementById("new-todo");
    const text = input.value;

    if (text) {
      self.state.todos.push({ id: self.state.todos.length + 1, text, completed: false });
      input.value = "";
    }
  }

  onAddInputChange(event) {
    self.state.input = event.target.value;
  }

  betterCreateElement(tag, attributes, children, callbacks) {
    const element = document.createElement(tag);

    if (attributes) {
      Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, attributes[key]);
      });
    }

    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === "string") {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    } else if (typeof children === "string") {
      element.appendChild(document.createTextNode(children));
    } else if (children instanceof HTMLElement) {
      element.appendChild(children);
    }

    if (callbacks) {
      Object.keys(callbacks).forEach((key) => {
        element.addEventListener(key, callbacks[key]);
      });
    }

    return element;
  }

  render() {
    return this.betterCreateElement("div", { class: "todo-list" }, [
      this.betterCreateElement("h1", {}, "TODO List"),
      this.betterCreateElement("div", { class: "add-todo" }, [
        this.betterCreateElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, null, {
          input: this.onAddInputChange,
        }),
        this.betterCreateElement("button", { id: "add-btn" }, "+", {
          click: this.onAddTask,
        }),
      ]),
      this.betterCreateElement("ul", { id: "todos" }, [
        ...self.state.todos.map((todo) => {
          return this.betterCreateElement("li", { class: todo.completed ? "completed" : "" }, [
            this.betterCreateElement("input", { type: "checkbox", checked: todo.completed }),
            this.betterCreateElement("span", {}, todo.text),
          ]);
        }),
      ]),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
