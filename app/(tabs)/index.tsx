import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text, TextInput, 
  FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import { getListings, Listing } from '../../shared/api/listings';
import { getListingImages, ListingImage } from '../../shared/api/images';
import FilterComponent from '../filter';
import { COLORS } from '../shared/colors';

export default function Index() {
  const router = useRouter();
  const [inputTerm, setInputTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Listing[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Listing[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [loading, setLoading] = useState(false);

  // Fetch data from backend
  const fetchListingsWithImages = async () => {
    try {
      setLoading(true);
      const data = await getListings();

      // For each listing, fetch images asynchronously
      const listingsWithImages = await Promise.all(
        data.listings.map(async (listing) => {
          const images: ListingImage[] = await getListingImages(Number(listing.id));
          return { ...listing, images };
        })
      );

      setAllProducts(listingsWithImages);
      updateProductList(listingsWithImages, inputTerm, selectedSort);
    } catch (err) {
      console.error("Failed to fetch listings or images:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListingsWithImages();
  }, []);

  const updateProductList = (products: Listing[], searchTerm: string, sortBy: string) => {
    const term = searchTerm.toLowerCase();

    let updated = products.filter(product =>
      product.title.toLowerCase().includes(term)
    );

    switch (sortBy) {
      case 'newest':
        updated.sort((a, b) =>
          new Date(b.created_datetime!).getTime() - new Date(a.created_datetime!).getTime()
        );
        break;
      case 'oldest':
        updated.sort((a, b) =>
          new Date(a.created_datetime!).getTime() - new Date(b.created_datetime!).getTime()
        );
        break;
      case 'lowToHigh':
        updated.sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        updated.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredProducts(updated);
  };

  const handleSearch = () => {
    updateProductList(allProducts, inputTerm, selectedSort);
  };

  const handleSort = (sortBy: string) => {
    setSelectedSort(sortBy);
    updateProductList(allProducts, inputTerm, sortBy);
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListingsWithImages();
    setTimeout(() => {
      setInputTerm('');
      setSelectedSort('newest')
      updateProductList(allProducts, '', 'newest')
      setRefreshing(false);
    }, 1000);
  };

  // redirects to Product Details view
  const handleProductClick = (item: any) => {
    console.log("Clicked product ID:", item.id);
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
                updateProductList(allProducts, text, selectedSort);
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
