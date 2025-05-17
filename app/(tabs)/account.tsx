import { FlatList, Image, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { sellers } from '../shared/mockSellers';
import fallbackImage from '../../assets/images/fallback.png';
import { products } from '../shared/mockProducts';
import ProductCard from '../ProductCard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Placeholder testing functionality for mock seller
const seller = sellers[0];

export default function AccountScreen() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const maskedPassword = '•'.repeat(8);

    const handleShowPass = () => {
        setShowPassword(prev => !prev);
    }

    // redirects to Product Details view
    const handleProductClick = (item: any) => {
        router.push(`/product/${item.id}`)
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Image
              alt=""
              source={{ uri: seller.image }}
              style={styles.image}
              defaultSource={fallbackImage}
              accessibilityLabel={`Image of ${seller.name}`}
            />
        </View>

        <View style={styles.accountSummary}>
          <Text style={styles.accountTitle}>Account Information</Text>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Name</Text>
            <View style={styles.accountValueGroup}>
              <Text style={styles.accountValue}>{seller.name}</Text>
              <TouchableOpacity onPress={() => router.push(`/edit?field=name&value=${encodeURIComponent(seller.name)}`)}>
              <Ionicons name="chevron-forward" size={16} color="black"/>
            </TouchableOpacity>
            </View>

          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Email Address</Text>
            <View style={styles.accountValueGroup}>
              <Text style={styles.accountValue}>{seller.email}</Text>
              <TouchableOpacity onPress={() => router.push(`/edit?field=email&value=${encodeURIComponent(seller.email)}`)}>
                <Ionicons name="chevron-forward" size={16} color="black"/>
              </TouchableOpacity>
            </View>


          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Password</Text>
            <View style={styles.accountValueGroup}>
              <Text style={styles.accountValue}>
                {showPassword ? seller.passwordHash : maskedPassword}
              </Text>

              <TouchableOpacity onPress={handleShowPass}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={16} color="black"/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push(`/edit?field=password&value=${encodeURIComponent(seller.passwordHash)}`)}>
                <Ionicons name="chevron-forward" size={16} color="black"/>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        <View style={styles.listingsSummary}>
          <Text style={styles.listingsTitle}>My Listings</Text>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => handleProductClick(item)}
              />
            )}
            contentContainerStyle={styles.listingsContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 9999,
  },
  accountSummary: {
    marginTop: 12,
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
    marginBottom: 16,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 44,
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
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  listingsContainer: {
    paddingBottom: 24,
  },
  listingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
})
