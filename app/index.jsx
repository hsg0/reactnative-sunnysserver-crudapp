import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from "axios";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      console.log(response);
      const data = await response.json();
      setTodos(data);

    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    if (text.trim()) {
      try {
        const newTodo = { title: text, description: "example" };
        const response = await fetch("http://localhost:3000/todos/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });
        const data = await response.json();
        setTodos([data, ...todos]);
        setText("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const removeTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        console.error("Failed to delete the todo");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const newTodo = { title: text, description: "example", _id: id };
        const response = await fetch("http://localhost:3000/todos/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
        console.log(updatedTodo);
      } else {
        console.error("Failed to delete the todo");
      }
    } catch (error) {
      console.error(error);
    }
  }
const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeStyles = isDarkMode ? styles.dark : styles.light;

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <View style={styles.switchContainer}>
        <Text style={themeStyles.text}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Add a todo"
          placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
          value={text}
          onChangeText={setText}
        />
        <Pressable style={[styles.addButton, themeStyles.addButton]} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add Todo</Text>
        </Pressable>
      </View>

      <View>
        {todos && todos.map((todo) => (
          <View key={todo.id} style={[styles.todoItem, themeStyles.todoItem]}>
            <Pressable onPress={() => toggleTodo(todo.id)}>
              <Text
                style={[
                  styles.todoText,
                  themeStyles.todoText,
                  todo.completed && styles.completedTodo,
                ]}
              >
                {todo.title}
              </Text>
            </Pressable>
            <Text>{todo.description}</Text>
            <Pressable style={{borderWidth: 1, borderColor: "red"}} onPress={() => updateTodo(todo._id)}>
              <Text style={styles.removeButtonText}>
                Update <MaterialIcons name="update" size={24} color="black" />
              </Text>
            </Pressable>
            <Pressable style={{borderWidth: 1, borderColor: "blue"}} onPress={() => removeTodo(todo._id)}>
              <Text style={styles.removeButtonText}>
                DEL <MaterialCommunityIcons name="delete-forever" size={24} color="red" />
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// (Styles remain the same as in the previous example)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todoText: {
    fontSize: 16,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  removeButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  light: {
    container: {
      backgroundColor: "white",
    },
    input: {
      backgroundColor: "#f9f9f9",
      color: "black",
    },
    addButton: {
      backgroundColor: "blue",
    },
    todoItem: {
      backgroundColor: "#ddd",
    },
    todoText: {
      color: "black",
    },
  },
  dark: {
    container: {
      backgroundColor: "black",
    },
    input: {
      backgroundColor: "#333",
      color: "white",
    },
    addButton: {
      backgroundColor: "blue",
    },
    todoItem: {
      backgroundColor: "#444",
    },
    todoText: {
      color: "white",
    },
  },
});