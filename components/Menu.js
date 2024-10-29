// components/Menu.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Menu = ({ lists, currentListId, onSelectList, onAddList, onDeleteList, onClose }) => {
  const [newListName, setNewListName] = useState('');

  const handleAddList = () => {
    if (newListName.trim() === '') {
      Alert.alert('Validation Error', 'List name cannot be empty.');
      return;
    }
    onAddList(newListName.trim());
    setNewListName('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <TouchableOpacity
        style={[
          styles.listItem,
          item.id === currentListId,
        ]}
        onPress={() => onSelectList(item.id)}
      >
        <Ionicons
          name={'checkmark-circle-outline'}
          size={20}
          color={'green'}
        />
        <Text style={styles.listName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteList(item.id)}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  const handleDeleteList = (listId) => {
    // Prevent deletion of the last remaining list
    if (lists.length === 1) {
      Alert.alert('Operation Not Allowed', 'At least one list must exist.');
      return;
    }

    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteList(listId);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Lists</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* List of Lists */}
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />

        {/* Add New List */}
        <View style={styles.addListContainer}>
          <TextInput
            style={styles.input}
            placeholder="New List Name"
            value={newListName}
            onChangeText={setNewListName}
          />
          <Button title="Add List" onPress={handleAddList} color="#28a745" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 20,
    flexGrow: 1,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listName: {
    marginLeft: 10,
    fontSize: 19,
  },
  selectedListItem: {
    backgroundColor: '#e0ffe0',
    borderRadius: 4,
  },
  addListContainer: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default Menu;
