import { StyleSheet, SafeAreaView, View, TouchableOpacity, TextInput, FlatList, Image, RefreshControl, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import ProductCard from '../ProductCard';
import FilterComponent from '../filter';


export default function Index() {
  const initialProducts = [
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
      title: '2014 Macbook Pro',
      price: 800,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1714070700737-24acfe6b957c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Classic White T-shirt',
      price: 40,
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1704919266475-aa6302e25209?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Old Nike Air Jordans',
      price: 500,
    },
    {
      id: 6,
      image: 'https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFjJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D',
      title: '2018 Macbook Pro',
      price: 1000,
    },
  ];

  const [allProducts, setAllProducts] = useState(initialProducts);
  const [products, setProducts] = useState(initialProducts);
  const [inputTerm, setInputTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = () => {
    if (inputTerm.trim() === '') {
      setProducts(allProducts);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(inputTerm.toLowerCase())
      );
      setProducts(filtered);
    }
  };

  const handleRefresh = () => {
    // Testing refresh functionality
    console.log('Refreshing...');
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSort = (sortOption) => {
    let sortedProducts = [...products];

    if (sortOption === 'lowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'highToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'alphabetical') {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    }

    setProducts(sortedProducts);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <TouchableOpacity
              accessibilityLabel="search button"
              accessibilityRole="button"
              onPress={handleSearch}
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
              onPress={() => setShowFilter(true)}
            >
              <Ionicons name="filter" size={24} color="black" style={{ marginLeft: 8 }}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {products.length === 0 && (
        <View>
          <Text style={{ textAlign: 'center', paddingTop: 10, }}>No matching items found.</Text>
        </View>
      )}

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

      {showFilter && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,}}>
          <FilterComponent
            onClose={() => setShowFilter(false)}
            onSelectSort={handleSort}
          />
        </View>
      )}
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
