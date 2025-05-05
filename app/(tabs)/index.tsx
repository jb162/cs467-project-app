import { StyleSheet, SafeAreaView, View, TouchableOpacity, TextInput, FlatList, Image, RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import ProductCard from '../ProductCard';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1714070700737-24acfe6b957c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'White T-shirt',
    price: 20,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1704919266475-aa6302e25209?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Nike Air Jordans',
    price: 120,
  },
  {
    id: 3,
    image: 'https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFjJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D',
    title: '2018 Macbook Pro',
    price: 1000,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1714070700737-24acfe6b957c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'White T-shirt',
    price: 20,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1704919266475-aa6302e25209?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Nike Air Jordans',
    price: 120,
  },
  {
    id: 6,
    image: 'https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFjJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D',
    title: '2018 Macbook Pro',
    price: 1000,
  },
];

export default function Index() {
  const [inputTerm, setInputTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = () => {
    // Testing search functionality
    console.log('Search term:', inputTerm);
  }

  const handleRefresh = () => {
    // Testing refresh functionality
    console.log('Refreshing...');
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <TouchableOpacity
              accessibilityLabel="search button"
              accessibilityRole="button"
              onPress={() => {/* placeholder functionality */}}
            >
              <Ionicons name="search" size={24} color="black" style={{ marginRight: 8 }}/>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Search for sale"
              placeholderTextColor="#888"
              value={inputTerm}
              onChangeText={setInputTerm}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />

            <TouchableOpacity
              accessibilityLabel="filter button"
              accessibilityRole="button"
              onPress={() => {/* placeholder functionality */}}
            >
              <Ionicons name="filter" size={24} color="black" style={{ marginLeft: 8 }}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => { /* placeholder functionality */}}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  searchContainer: {
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 6,
    marginHorizontal: 8,
  }
})
