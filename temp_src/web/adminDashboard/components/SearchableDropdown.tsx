// components/SearchableDropdown.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

interface Props {
  data: string[];
  placeholder: string;
  selected: string;
  onSelect: (value: string) => void;
}

const SearchableDropdown: React.FC<Props> = ({ data, placeholder, selected, onSelect }) => {
  const [query, setQuery] = useState('');
  const [showList, setShowList] = useState(false);

  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: string) => {
    onSelect(item);
    setQuery(item);
    setShowList(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={query || selected}
        onChangeText={(text) => {
          setQuery(text);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        style={styles.input}
      />

      {showList && filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 999, // important for web
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 5,
  },
  list: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});

export default SearchableDropdown;
