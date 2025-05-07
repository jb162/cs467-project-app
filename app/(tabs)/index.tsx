import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text, TextInput, FlatList, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import ProductCard from '../ProductCard';
import { products } from '../shared/mockProducts';
import FilterComponent from '../filter';

export default function Index() {
  const router = useRouter();
  const [inputTerm, setInputTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('newest');

  const handleSearch = () => {
    const term = inputTerm.toLowerCase();
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (sortBy: string) => {
    setSelectedSort(sortBy);
    let sorted
    switch (sortBy) {
      case 'newest':
        sorted = [...filteredProducts].sort(
          (a, b) => new Date(b.createdDatetime).getTime() - new Date(a.createdDatetime).getTime());
        break;
        case 'oldest':
          sorted = [...filteredProducts].sort(
            (a, b) => new Date(a.createdDatetime).getTime() - new Date(b.createdDatetime).getTime());
          break;
      case 'lowToHigh':
        sorted = [...filteredProducts].sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
        break;
      default:
        sorted = [...filteredProducts];
    }
    setFilteredProducts(sorted);
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setInputTerm('');
      setFilteredProducts(products);
      setRefreshing(false);
    }, 1000);
  };

  // redirects to Product Details view
  const handleProductClick = (item: any) => {
    router.push(`/product/${item.id}`)
    setShowFilter(false)
  }

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
              onPress={() => setShowFilter(true)}
            >
              <Ionicons name="filter" size={24} color="black" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {filteredProducts.length === 0 && (
        <View>
          <Text style={styles.fallbackText}>No matching items found.</Text>
        </View>
      )}

      <FlatList
        contentContainerStyle={styles.content}
        data={filteredProducts}
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

      {showFilter && (
        <View>
          <FilterComponent
            onClose={() => setShowFilter(false)}
            onSelectSort={handleSort}
            selectedSort={selectedSort}
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
  },
  fallbackText: {
    textAlign: 'center',
    paddingTop: 10,
  }
})
