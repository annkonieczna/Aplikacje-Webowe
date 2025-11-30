let todoList = document.getElementById("list");

fetch('https://dummyjson.com/todos')
    .then((res) => res.json())
    .then((data) => {
        const todos = data.todos;
        todos.forEach((element) => {
            const todo = document.createElement("div");
            todo.classList.add("list-item")
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox");
            const text = document.createElement("div");
            text.innerHTML = element.todo;
            const userInfo = document.createElement("div");
            userInfo.classList.add("userinfo");
            userInfo.innerHTML = "User ID: " + element.userId;
            if (element.completed) {
                todo.classList.add("list-item-done")
                userInfo.classList.add("userinfo-done")
                checkbox.checked = true;
            }
            text.appendChild(userInfo);
            todo.appendChild(checkbox);
            todo.appendChild(text);
            todoList.appendChild(todo);

            checkbox.addEventListener("click", () => {
                todo.classList.toggle("list-item-done");
                userInfo.classList.toggle("userinfo-done");
            });
        })
    })