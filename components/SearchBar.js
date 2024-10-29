// components/SearchBar.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (text) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#555" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search To-Dos..."
        value={query}
        onChangeText={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default SearchBar;
