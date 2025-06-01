import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ListingImage } from '../shared/api/images';

type Product = {
  id: string;
  images?: ListingImage[];
  title: string;
  price: number;
};

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
};

export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Image
            alt="Product picture on white background."
            resizeMode="cover"
            style={styles.cardImage}
            source={{
              uri: product.images && product.images.length > 0
                ? product.images[0].url
                : "https://placehold.co/160"
            }}
            defaultSource={{ uri: "https://placehold.co/160" } /* placeholder image */}
          />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{product.title}</Text>
            <Text style={styles.cardPrice}>${product.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardBody: {
    padding: 12,
  },
  cardHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  }
})
