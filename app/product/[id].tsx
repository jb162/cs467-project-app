import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, Platform,
    TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { products } from '../shared/mockProducts';
import fallbackImage from '../../assets/images/fallback.png';
import { getUser, updateFavoriteListings } from '@/shared/api/users';
import Toast from 'react-native-toast-message';


const screenWidth = Dimensions.get('window').width;

export default function ProductDetail() {
    const navigation = useNavigation();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const productId = parseInt(id as string, 10);
    const product = products.find((p) => p.id === productId);
    const [seller, setSeller] = useState<any | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    style={styles.backButton}
                    accessibilityLabel="Go back to home"
                    accessibilityRole="button"
                    hitSlop={10}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleShare}
                        accessibilityLabel="Share this listing"
                        accessibilityRole="button"
                        hitSlop={10}
                    >
                        <Ionicons name="copy-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleFavorite}
                        accessibilityLabel="Favorite this listing"
                        accessibilityRole="button"
                        hitSlop={10}
                    >
                        <Ionicons name="heart-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    if (!product || !product.images || product.images.length === 0) {
        return (
            <View style={styles.center}>
                <Text>Product not found.</Text>
            </View>
        );
    }

    const handleShare = async () => {
        try {
            const url = Linking.createURL(`/products/${productId}`);
            await Clipboard.setStringAsync(url);

            Toast.show({
                type: 'success',
                text1: 'Link copied!',
                text2: 'Paste it anywhere to share.',
            });
        } catch (error) {
            console.error('Clipboard error:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to copy link',
            });
        }
    };


    const handleFavorite = async () => {
        try {
            const username = 'ikeafan'; // Replace with actual logged-in user

            const user = await getUser(username);
            const favorites: string[] = (user.favorite_listings || []).map(String);

            const alreadyFavorited = favorites.includes(productId.toString());
            const updatedFavorites = alreadyFavorited
                ? favorites.filter((id) => id !== productId.toString())
                : [...favorites, productId.toString()];

            await updateFavoriteListings(username, updatedFavorites);

            Toast.show({
                type: 'success',
                text1: alreadyFavorited ? 'Removed from favorites' : 'Added to favorites',
            });
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Could not update favorites' });
            console.error(err);
        }
    };

    const handleSellerInfo = () => {
        if (seller) {
            router.push(`/user/${seller.username}`);
        }
    };

    const goPrev = () => {
        setImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const goNext = () => {
        setImageIndex((prev) => (prev + 1) % product.images.length);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.carouselWrapper} accessible>
                {product.images.length > 1 && (
                    <TouchableOpacity
                        onPress={goPrev}
                        style={styles.carouselArrowLeft}
                        accessibilityLabel="Previous image"
                        accessibilityRole="button"
                        hitSlop={10}
                    >
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => setFullscreen(true)}
                    accessibilityLabel="View fullscreen image"
                    accessibilityRole="button"
                >
                    <Image
                        source={{ uri: product.images[imageIndex] }}
                        style={styles.image}
                        defaultSource={fallbackImage}
                        accessibilityLabel={`Image ${imageIndex + 1} of ${product.title}`}
                    />
                </TouchableOpacity>
                {product.images.length > 1 && (
                    <TouchableOpacity
                        onPress={goNext}
                        style={styles.carouselArrowRight}
                        accessibilityLabel="Next image"
                        accessibilityRole="button"
                        hitSlop={10}
                    >
                        <Ionicons name="chevron-forward" size={28} color="#333" />
                    </TouchableOpacity>
                )}
            </View>

            {product.images.length > 1 && (
                <View style={styles.dotsContainer} accessible accessibilityLabel="Image carousel dots">
                    {product.images.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === imageIndex && styles.activeDot]}
                        />
                    ))}
                </View>
            )}

            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{product.description}</Text>

            <Text style={styles.label}>Details</Text>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailText}>{product.category}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Condition:</Text>
                <Text style={styles.detailText}>{product.condition}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailText}>{product.location}</Text>
            </View>

            <Text style={styles.label}>Seller Info</Text>
            {seller ? (
                <TouchableOpacity onPress={handleSellerInfo} accessibilityLabel="View seller info" accessibilityRole="button">
                    <View style={styles.sellerInfoRow}>
                        <Image source={{ uri: seller.image }} style={styles.sellerImage} defaultSource={fallbackImage} accessibilityLabel={`Image of ${seller.name}`} />
                        <View style={styles.sellerDetailsContainer}>
                            <Text style={styles.sellerName}>{seller.full_name}</Text>
                            <Text style={styles.sellerMeta}>
                                Joined: {new Date(seller.created_datetime).toLocaleString('default', { month: 'short', year: 'numeric' })} | Rating: {seller.rating?.toFixed(1) || 'N/A'}
                            </Text>
                            <Text style={styles.sellerMeta}>{seller.location}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push(`/messages/new?sellerId=${seller.username}`)}
                            accessibilityLabel="Message seller"
                            accessibilityRole="button"
                            style={styles.chatButton}
                        >
                            <Ionicons name="chatbox-ellipses" size={28} color="#ad5ff5" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ) : (
                <Text style={styles.text}>Seller not found.</Text>
            )}

            <Modal visible={fullscreen} transparent={true}>
                <View style={styles.fullscreenContainer}>
                    <TouchableOpacity
                        onPress={() => setFullscreen(false)}
                        style={styles.closeButton}
                        accessibilityLabel="Close fullscreen"
                        accessibilityRole="button"
                        hitSlop={10}
                    >
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>

                    {product.images.length > 1 && (
                        <>
                            <TouchableOpacity
                                onPress={goPrev}
                                style={styles.leftArrow}
                                accessibilityLabel="Previous image"
                                accessibilityRole="button"
                                hitSlop={10}
                            >
                                <Ionicons name="chevron-back" size={32} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={goNext}
                                style={styles.rightArrow}
                                accessibilityLabel="Next image"
                                accessibilityRole="button"
                                hitSlop={10}
                            >
                                <Ionicons name="chevron-forward" size={32} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}

                    <Image
                        source={{ uri: product.images[imageIndex] }}
                        style={styles.fullscreenImage}
                        resizeMode="contain"
                        accessibilityLabel={`Fullscreen image ${imageIndex + 1} of ${product.title}`}
                    />
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        gap: 16,
        marginRight: 12,
    },
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 10,
    },
    carouselArrowLeft: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
        padding: 6,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
    },
    carouselArrowRight: {
        position: 'absolute',
        right: 10,
        zIndex: 1,
        padding: 6,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#1e88e5',
    },
    image: {
        width: screenWidth * 0.85,
        height: 260,
        borderRadius: 10,
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    leftArrow: {
        position: 'absolute',
        left: 20,
        top: '50%',
        transform: [{ translateY: -16 }],
        padding: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 24,
    },
    rightArrow: {
        position: 'absolute',
        right: 20,
        top: '50%',
        transform: [{ translateY: -16 }],
        padding: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 6,
    },
    price: {
        fontSize: 22,
        fontWeight: '500',
        color: '#1e88e5',
        marginBottom: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    text: {
        fontSize: 16,
        color: '#444',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        fontWeight: '500',
        width: 100,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
    },
    sellerInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    sellerImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ccc',
    },
    sellerDetailsContainer: {
        flex: 1,
        marginLeft: 12,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    sellerMeta: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    chatButton: {
        padding: 10,
        borderRadius: 10,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
