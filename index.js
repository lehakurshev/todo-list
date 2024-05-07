﻿function createElement(tag, attributes, children) {
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
        { id: 3, text: "Пойти домой", completed: true },
      ],
    };
    self.update = this.update.bind(this);
    self.render = this.render.bind(this);
    self._domNode = this.render();
  }

  onAddInputChange(event) {
    self.state.input = event.target.value;
  }

  onDeleteTask(id) {
    self.state.todos = self.state.todos.filter(todo => todo.id !== id);
    self.update();
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


  update() {
    self._domNode = self.render();
    document.querySelector(".todo-list").remove();
    document.body.append(self._domNode)
  }

  onCheckTask(id) {
    const todo = self.state.todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    self.update();
  }

  onAddTask() {
    const input = document.getElementById("new-todo");
    const text = input.value;

    if (text) {
      self.state.todos.push({ id: self.state.todos.length + 1, text, completed: false });
      input.value = "";
      self.update();
    }
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
          const listItem = this.betterCreateElement("li", { class: todo.completed ? "completed" : "" }, [
            this.betterCreateElement("input", todo.completed ? { type: "checkbox", checked: "" } : { type: "checkbox" }, null, {
              change: () => this.onCheckTask(todo.id),
            }),
            this.betterCreateElement("span", {}, todo.text),
            this.betterCreateElement("button", {}, "🗑️", { click: () => this.onDeleteTask(todo.id) }),
          ]);
          
          if (todo.completed) {
            listItem.querySelector("span").classList.add("completed");
          }
      
          return listItem;
        }),
      ])
    ]);
    
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});



class AddTask extends Component {
  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
  }

  render() {
    return this.betterCreateElement("div", { class: "todo-list" }, [
      this.betterCreateElement("h1", {}, "TODO List"),
      new AddTask(this.onAddTask).getDomNode(),
      this.betterCreateElement("ul", { id: "todos" }, [
        ...self.state.todos.map((todo) => new Task(todo, this.onCheckTask, this.onDeleteTask).getDomNode()),
      ])
    ]);
  }
}


class Task extends Component {
  constructor(todo, onCheckTask, onDeleteTask) {
    super();
    this.todo = todo;
    this.onCheckTask = onCheckTask;
    this.onDeleteTask = onDeleteTask;
  }

  render() {
    const listItem = this.betterCreateElement("li", { class: this.todo.completed ? "completed" : "" }, [
      this.betterCreateElement("input", this.todo.completed ? { type: "checkbox", checked: "" } : { type: "checkbox" }, null, {
        change: () => this.onCheckTask(this.todo.id),
      }),
      this.betterCreateElement("span", {}, this.todo.text),
      this.betterCreateElement("button", {}, "🗑", { click: () => this.onDeleteTask(this.todo.id) }),
    ]);

    if (this.todo.completed) {
      listItem.querySelector("span").classList.add("completed");
    }

    return listItem;
  }
}