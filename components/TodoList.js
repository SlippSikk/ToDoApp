// components/TodoList.js
import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';


const playSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require(`../assets/sounds/complete.wav`)
  );
  await sound.playAsync();

  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync();
    }
  });
};

const playSound2 = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require(`../assets/sounds/uncomplete.wav`)
  );
  await sound.playAsync();

  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync();
    }
  });
};

const TodoList = ({ todos, onToggleComplete, onDelete, onUpdate }) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => {
          onToggleComplete(item.id);

          if (item.completed) {
            playSound2();
          } else {
            playSound();

          }
        }}
        style={styles.itemHeader}
      >
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color="green"
        />
        <Text style={[styles.title, item.completed && styles.completed]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      {item.image ? (
        <TouchableOpacity
          onPress={() => {
            setSelectedImage(item.image);
            setIsImageModalVisible(true);
          }}
        >
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      ) : null}
      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}
      {item.dueDate ? (
        <Text style={styles.dueDate}>
          Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      ) : null}
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => onUpdate(item)}
          style={styles.button}
        >
          <Ionicons name="create-outline" size={20} color="blue" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={styles.button}
        >
          <Ionicons name="trash-outline" size={20} color="red" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImage(null);
  };

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No To-Do items. Add some!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeImageModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeImageModal}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
              <Ionicons name="close-circle" size={36} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Ensure space for FAB
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  image: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  description: {
    marginTop: 10,
    color: '#555',
  },
  dueDate: {
    marginTop: 5,
    color: '#ff6347',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  buttonText: {
    marginLeft: 5,
    color: '#555',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default TodoList;
