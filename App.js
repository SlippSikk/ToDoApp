// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import UpdateTodo from './components/UpdateTodo';
import SearchBar from './components/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from 'react-native';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isAddVisible, setIsAddVisible] = useState(false); // State for AddTodo Modal

  // Load todos from AsyncStorage on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Save todos to AsyncStorage whenever they change
  useEffect(() => {
    saveTodos(todos);
    setFilteredTodos(todos);
  }, [todos]);

  const saveTodos = async (todos) => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('@todos', jsonValue);
    } catch (e) {
      console.error('Error saving todos', e);
    }
  };

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@todos');
      const loadedTodos = jsonValue != null ? JSON.parse(jsonValue) : [];
      setTodos(loadedTodos);
      setFilteredTodos(loadedTodos);
    } catch (e) {
      console.error('Error loading todos', e);
    }
  };

  const handleAdd = (todo) => {
    const newTodo = { ...todo, id: Date.now(), completed: false };
    setTodos([...todos, newTodo]);
    Alert.alert('Success', 'To-Do item added');
    setIsAddVisible(false); // Close the AddTodo Modal
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete To-Do',
      'Are you sure you want to delete this to-do item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
            Alert.alert('Deleted', 'To-Do item deleted');
          },
        },
      ]
    );
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleUpdate = (todo) => {
    setCurrentTodo(todo);
    setIsUpdateVisible(true);
  };

  const handleSaveUpdate = (updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
    setIsUpdateVisible(false);
    setCurrentTodo(null);
    Alert.alert('Success', 'To-Do item updated');
  };

  const handleCancelUpdate = () => {
    setIsUpdateVisible(false);
    setCurrentTodo(null);
  };

  const handleSearch = (query) => {
    if (query.trim() === '') {
      setFilteredTodos(todos);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(lowerQuery) ||
          todo.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredTodos(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <SearchBar onSearch={handleSearch} />
      <TodoList
        todos={filteredTodos}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* AddTodo Modal */}
      <Modal
        visible={isAddVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <AddTodo
              onAdd={handleAdd}
              onCancel={() => setIsAddVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* UpdateTodo Modal */}
      <Modal
        visible={isUpdateVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelUpdate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {currentTodo && (
              <UpdateTodo
                todo={currentTodo}
                onSave={handleSaveUpdate}
                onCancel={handleCancelUpdate}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 20,
    backgroundColor: '#f0f0f0',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#28a745',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
});
