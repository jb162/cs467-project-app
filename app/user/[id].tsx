import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUser, User } from '../../shared/api/users';
import { getListings, Listing } from '../../shared/api/listings';
import { getMessagesBetweenUsers } from '../../shared/api/messages';
import { getListingImages } from '../../shared/api/images';

const CURRENT_USER = 'ikeafan'; // Update this later with API

export default function SellerProfile() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const sellerUsername = id as string;

  const [seller, setSeller] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingImages, setListingImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 16 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedSeller, allListings] = await Promise.all([
          getUser(sellerUsername),
          getListings(),
        ]);

        setSeller(fetchedSeller);
        const filtered = allListings.listings.filter((l) => l.seller === sellerUsername);
        setListings(filtered);

        const imageMap: Record<number, string> = {};
        await Promise.all(
          filtered.map(async (listing) => {
            try {
              const images = await getListingImages(Number(listing.id));
              const primaryImage = images.find((img) => img.is_primary) || images[0];
              if (primaryImage) {
                imageMap[Number(listing.id)] = primaryImage.url;
              }
            } catch (error) {
              console.warn(`No images found for listing ${listing.id}`);
            }
          })
        );
        setListingImages(imageMap);
      } catch (error) {
        console.error('Error loading seller profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sellerUsername]);

  const handleMessagePress = () => {
    if (!seller || !seller.full_name) return;

    try {
      const encodedName = encodeURIComponent(seller.full_name);
      router.push(`/messages/${seller.username}?name=${encodedName}`);
    } catch (error) {
      console.error('Error navigating to message screen:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!seller) {
    return (
      <View style={styles.center}>
        <Text>Seller not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        {/* Seller images will need to be added to the image or user API 
        <Image
          source={{ uri: seller.image || 'https://via.placeholder.com/120' }}
          style={styles.image}
          accessibilityLabel={`Image of ${seller.full_name}`}
          accessibilityRole="image"
        />*/}
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{seller.full_name}</Text>
          <Text style={styles.text}>{seller.email}</Text>
          <Text style={styles.joinedDate}>
            Joined:{' '}
            {seller.created_datetime
              ? new Date(seller.created_datetime).toLocaleString('default', {
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={handleMessagePress}
        accessibilityRole="button"
        accessibilityLabel="Send Message"
      >
        <Text style={styles.messageButtonText}>Send Message</Text>
      </TouchableOpacity>

      <Text style={styles.label}>{seller.full_name}'s Listings</Text>

      <FlatList
        contentContainerStyle={styles.productsList}
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Product: ${item.title}, Price: $${item.price}`}
          >
            <Image
              source={{ uri: listingImages[item.id] || 'https://via.placeholder.com/150' }}
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
    },
    rating: {
        fontSize: 16,
        color: '#888',
        marginBottom: 4,
    },
    joinedDate: {
        fontSize: 14,
        color: '#888',
    },
    messageButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ad5ff5',
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        marginBottom: 12,
    },
    messageButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    productsList: {
        marginTop: 20,
        paddingBottom: 20,
    },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    productImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#ccc',
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        margin: 8,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ad5ff5',
        marginBottom: 8,
        marginLeft: 8,
    },
});
