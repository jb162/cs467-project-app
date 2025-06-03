import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import fallbackImage from '../../assets/images/fallback.png';
import ProductCard from '../ProductCard';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useEditAccount } from '../shared/EditAccountContext';
import * as ImagePicker from 'expo-image-picker';
import { getUser, User } from '../../shared/api/users';
import { getListings, Listing } from '../../shared/api/listings';
import { fetchUserProfileImage } from '../../shared/api/images';
import { getListingImages } from '../../shared/api/images';

// Replace with actual user from auth context/session
const CURRENT_USERNAME = 'justin123';

export default function AccountScreen() {
    const router = useRouter();
    const { setFieldValue } = useEditAccount();
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [listingImages, setListingImages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const sellerUsername = CURRENT_USERNAME;

    const maskedPassword = '•'.repeat(8);

      useEffect(() => {
        async function fetchData() {
          try {
            const [fetchedSeller, allListings] = await Promise.all([
              getUser(sellerUsername),
              getListings(),
            ]);

            setUser(fetchedSeller);
            const filtered = allListings.listings.filter((l) => l.seller === sellerUsername);
            setListings(filtered);

            if (fetchedSeller) {
              try {
                const { url } = await fetchUserProfileImage(fetchedSeller.username);
                setProfileImage(url);
              } catch (error) {
                console.warn('Could not load profile image for user:', fetchedSeller.username);
              }
            }

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

    const handleShowPass = () => {
        setShowPassword(prev => !prev);
    }

    // redirects to Product Details view
    const handleProductClick = (item: any) => {
        router.push(`/product/${item.id}`)
    };

    const handleLogout = () => {
      console.log("handleLogout() called")
    }

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setFieldValue('image', result.assets[0].uri);
      }

    };

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    
    if (!user) {
      return (
        <View style={styles.center}>
          <Text>Seller not found.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.accountSummary}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            <Image
              alt=""
              source={{ uri: profileImage ?? 'https://via.placeholder.com/120' }}
              style={styles.image}
              defaultSource={fallbackImage}
              accessibilityLabel={`Image of ${user.full_name || user.username}`}
            />
          </TouchableOpacity>
          <Text style={styles.accountTitle}>Account Information</Text>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Name</Text>
            <View style={styles.accountValueGroup}>
              <Text style={styles.accountValue}>{user.full_name}</Text>
              <TouchableOpacity onPress={() => {
                setFieldValue('name', user.full_name || user.username);
                router.push('/editAccount');
              }}>
                <Ionicons name="chevron-forward" size={16} color="black"/>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Email Address</Text>
            <View style={styles.accountValueGroup}>
              <Text style={styles.accountValue}>{user.email}</Text>
              <TouchableOpacity onPress={() => {
                setFieldValue('email', user.email);
                router.push('/editAccount');
              }}>
                <Ionicons name="chevron-forward" size={16} color="black"/>
              </TouchableOpacity>
            </View>


          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Password</Text>
            <View style={styles.accountValueGroup}>
              <Text style={styles.accountValue}>
                {showPassword ? user.password : maskedPassword}
              </Text>

              <TouchableOpacity onPress={handleShowPass}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={16} color="black"/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setFieldValue('password', user.password);
                router.push('/editAccount')
              }}>
                <Ionicons name="chevron-forward" size={16} color="black"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.listingsSummary}>
          <Text style={styles.listingsTitle}>My Listings ({listings.length})</Text>

          <FlatList
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
            contentContainerStyle={styles.listingsContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 3,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    resizeMode: 'cover',
  },
  accountSummary: {
    marginTop: 6,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 36,
  },
  accountLabel: {
    fontSize: 16,
  },
  accountValueGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  accountValue: {
    fontSize: 16,
    color: 'grey',
  },
  listingsSummary: {
    flex: 1,
    marginTop: 12,
  },
  listingsContainer: {
    paddingBottom: 12,
  },
  listingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  logoutContainer: {
    marginTop: 6,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ad5ff5',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
})
