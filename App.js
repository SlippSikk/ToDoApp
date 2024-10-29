// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import UpdateTodo from './components/UpdateTodo';
import SearchBar from './components/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Menu from './components/Menu'; // Ensure this import exists

export default function App() {
  const [lists, setLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Load lists from AsyncStorage on mount
  useEffect(() => {
    loadLists();
  }, []);

  // Save lists to AsyncStorage whenever they change, after loading
  useEffect(() => {
    if (!isLoading) {
      saveLists(lists);
      const currentList = lists.find((list) => list.id === currentListId);
      setFilteredTodos(currentList ? currentList.todos : []);
    }
  }, [lists, currentListId, isLoading]);

  const saveLists = async (lists) => {
    try {
      const jsonValue = JSON.stringify(lists);
      await AsyncStorage.setItem('@lists', jsonValue);
    } catch (e) {
      console.error('Error saving lists', e);
    }
  };

  const loadLists = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@lists');
      const loadedLists = jsonValue != null ? JSON.parse(jsonValue) : [];
      if (loadedLists.length === 0) {
        const defaultList = { id: Date.now(), name: 'Default List', todos: [] };
        setLists([defaultList]);
        setCurrentListId(defaultList.id);
      } else {
        setLists(loadedLists);
        setCurrentListId(loadedLists[0].id);
      }
    } catch (e) {
      console.error('Error loading lists', e);
      // Optionally, create a default list in case of error
      const defaultList = { id: Date.now(), name: 'Default List', todos: [] };
      setLists([defaultList]);
      setCurrentListId(defaultList.id);
    } finally {
      setIsLoading(false); // Data loading complete
    }
  };

  const handleAddTodo = (todo) => {
    if (!currentListId) {
      Alert.alert('No List Selected', 'Please create or select a list first.');
      return;
    }
    const newTodo = { ...todo, id: Date.now(), completed: false };
    const updatedLists = lists.map((list) => {
      if (list.id === currentListId) {
        return { ...list, todos: [...list.todos, newTodo] };
      }
      return list;
    });
    setLists(updatedLists);
    Alert.alert('Success', 'To-Do item added');
    setIsAddVisible(false);
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
            const updatedLists = lists.map((list) => {
              if (list.id === currentListId) {
                return {
                  ...list,
                  todos: list.todos.filter((todo) => todo.id !== id),
                };
              }
              return list;
            });
            setLists(updatedLists);
            Alert.alert('Deleted', 'To-Do item deleted');
          },
        },
      ]
    );
  };

  const handleToggleComplete = (id) => {
    const updatedLists = lists.map((list) => {
      if (list.id === currentListId) {
        const updatedTodos = list.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        return { ...list, todos: updatedTodos };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const handleUpdate = (todo) => {
    setCurrentTodo(todo);
    setIsUpdateVisible(true);
  };

  const handleSaveUpdate = (updatedTodo) => {
    const updatedLists = lists.map((list) => {
      if (list.id === currentListId) {
        const updatedTodos = list.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
        return { ...list, todos: updatedTodos };
      }
      return list;
    });
    setLists(updatedLists);
    setIsUpdateVisible(false);
    setCurrentTodo(null);
    Alert.alert('Success', 'To-Do item updated');
  };

  const handleCancelUpdate = () => {
    setIsUpdateVisible(false);
    setCurrentTodo(null);
  };

  const handleSearch = (query) => {
    if (!currentListId) return;
    const currentList = lists.find((list) => list.id === currentListId);
    if (!currentList) return;

    if (query.trim() === '') {
      setFilteredTodos(currentList.todos);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = currentList.todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(lowerQuery) ||
          (todo.description && todo.description.toLowerCase().includes(lowerQuery))
      );
      setFilteredTodos(filtered);
    }
  };

  const handleAddList = (listName) => {
    const newList = { id: Date.now(), name: listName, todos: [] };
    setLists([...lists, newList]);
    setCurrentListId(newList.id);
    Alert.alert('Success', 'New list created');
  };

  const handleSelectList = (listId) => {
    setCurrentListId(listId);
    setIsMenuVisible(false);
  };

  const handleDeleteList = (listId) => {
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
    if (currentListId === listId) {
      if (updatedLists.length > 0) {
        setCurrentListId(updatedLists[0].id);
      } else {
        // Create a default list if all lists are deleted
        const defaultList = { id: Date.now(), name: 'Default List', todos: [] };
        setLists([defaultList]);
        setCurrentListId(defaultList.id);
      }
    }
    Alert.alert('Deleted', 'List has been deleted');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {lists.find((list) => list.id === currentListId)?.name}
        </Text>
        <View style={{ width: 28 }} />
      </View>

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
              onAdd={handleAddTodo}
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

      {/* Menu Modal */}
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Menu
          lists={lists}
          currentListId={currentListId}
          onSelectList={handleSelectList}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
          onClose={() => setIsMenuVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
