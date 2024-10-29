// components/AddTodo.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
	Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const AddTodo = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const pickImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;

    setDueDate(currentDate);
  };

  const handleAdd = () => {
    if (title.trim() === '') {
      alert('Title is required');
      return;
    }
    onAdd({ title, description, image, dueDate: dueDate.toISOString() });
    setTitle('');
    setDescription('');
    setImage(null);
    setDueDate(new Date());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.heading}>Add New To-Do</Text>
        <View style={{ width: 28 }} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Title *"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <View style={styles.imagePicker}>
        <Button title="Pick an Image" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <View style={styles.datePicker}>
			<TouchableOpacity
          onPress={() => setShowPicker(!showPicker)}
          style={styles.dateButton}
        >
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.dateText}>
            {dueDate ? new Date(dueDate).toDateString() : 'Set Due Date'}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={'spinner'}
            onChange={onChangeDate}
          />
        )}
      </View>
      <View style={styles.buttons}>
        <Button title="Add To-Do" onPress={handleAdd} color="#28a745" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: '#fff',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  datePicker: {
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttons: {
    marginTop: 10,
  },
});

export default AddTodo;
