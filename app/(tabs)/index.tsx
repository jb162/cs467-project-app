import { StyleSheet, SafeAreaView, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import ProductCard from '../ProductCard';
import { products } from '../shared/mockProducts';


export default function Index() {
  const router = useRouter();
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

  // redirects to Product Details view
  const handleProductClick = (item: any) => {
    router.push(`/product/${item.id}`)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <TouchableOpacity
              accessibilityLabel="search button"
              accessibilityRole="button"
              onPress={() => {/* placeholder functionality */ }}
            >
              <Ionicons name="search" size={24} color="black" style={{ marginRight: 8 }} />
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
              onPress={() => {/* placeholder functionality */ }}
            >
              <Ionicons name="filter" size={24} color="black" style={{ marginLeft: 8 }} />
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
            onPress={() => handleProductClick(item)}
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
