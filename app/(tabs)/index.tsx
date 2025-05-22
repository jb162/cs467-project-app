import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text, TextInput, FlatList, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import ProductCard from '../ProductCard';
import { products } from '../shared/mockProducts';
import FilterComponent from '../filter';
import { COLORS } from '../shared/colors';

export default function Index() {
  const router = useRouter();
  const [inputTerm, setInputTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('newest');

  const updateProductList = (searchTerm: string, sortBy: string) => {
    const term = searchTerm.toLowerCase();

    let updated = products.filter(product =>
      product.title.toLowerCase().includes(term)
    );

    switch (sortBy) {
      case 'newest':
        updated = updated.sort(
          (a, b) =>
            new Date(b.createdDatetime).getTime() -
            new Date(a.createdDatetime).getTime()
        );
        break;
      case 'oldest':
        updated = updated.sort(
          (a, b) =>
            new Date(a.createdDatetime).getTime() -
            new Date(b.createdDatetime).getTime()
        );
        break;
      case 'lowToHigh':
        updated = updated.sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        updated = updated.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredProducts(updated);
  };

  const handleSearch = () => {
    updateProductList(inputTerm, selectedSort);
  };

  const handleSort = (sortBy: string) => {
    setSelectedSort(sortBy);
    updateProductList(inputTerm, sortBy);
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setInputTerm('');
      setSelectedSort('newest')
      updateProductList('', 'newest')
      setRefreshing(false);
    }, 1000);
  };

  // redirects to Product Details view
  const handleProductClick = (item: any) => {
    router.push(`/product/${item.id}`)
    setShowFilter(false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
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
              placeholderTextColor={COLORS.textGray}
              value={inputTerm}
              onChangeText={(text) => {
                setInputTerm(text);
                updateProductList(text, selectedSort);
              }}
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
    borderColor: COLORS.border,
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
