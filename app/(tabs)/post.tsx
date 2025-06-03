import { useState } from "react";
import { StyleSheet, ScrollView, View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import fallbackImage from '../../assets/images/fallback.png';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { createListing } from '../../shared/api/listings';
import { uploadImage } from '../../shared/api/images';

const CURRENT_USER = 'ikeafan'; // Update to current user later

export default function PostScreen() {
    const [form, setForm] = useState({
        title: '',
        price: '',
        description: '',
        condition: '',
        location: '',
    });

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
        }

    };

    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleCreateListing = async () => {

        // call uploadImage to handle item image uploading

        try {
            const newListing = await createListing ({
                title: form.title,
                description: form.description,
                price: parseFloat(form.price),
                seller: CURRENT_USER,
                location: form.location,
                item_condition: form.condition,
            });

        } catch (error) {
            console.error("Error creating listing:", error);
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                 <View style={styles.header}>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        <Image
                            source={image ? { uri: image } : fallbackImage}
                            style={styles.imagePreview}
                        />
                        <Text style={styles.imageText}>Tap to upload image</Text>
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Title</Text>
                        <TextInput
                            accessibilityLabel="Title"
                            accessibilityRole="text"
                            autoCapitalize="words"
                            style={styles.inputControl}
                            placeholder="Enter title"
                            value={form.title}
                            onChangeText={(text) => handleChange('title', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Price</Text>
                        <TextInput
                            accessibilityLabel="Price"
                            accessibilityRole="text"
                            style={styles.inputControl}
                            placeholder="Enter price"
                            value={form.price}
                            keyboardType="numeric"
                            onChangeText={(text) => handleChange('price', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            accessibilityLabel="Description"
                            accessibilityRole="text"
                            style={[styles.inputControl, { height: 50, textAlignVertical: 'center', paddingVertical: 16 }]}
                            placeholder="Enter description"
                            value={form.description}
                            multiline
                            onChangeText={(text) => handleChange('description', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Condition</Text>
                        <Picker
                            selectedValue={form.condition}
                            style={styles.inputControlDropdown}
                            onValueChange={(value) => handleChange('condition', value)}
                        >
                            <Picker.Item label="Select condition"/>
                            <Picker.Item label="New" value="New"/>
                            <Picker.Item label="Like New" value="Like New"/>
                            <Picker.Item label="Good" value="Good"/>
                            <Picker.Item label="Fair" value="Fair"/>
                            <Picker.Item label="Bad" value="Bad"/>
                        </Picker>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Location</Text>
                        <TextInput
                            accessibilityLabel="Location"
                            accessibilityRole="text"
                            style={styles.inputControl}
                            placeholder="Enter location"
                            value={form.location}
                            onChangeText={(text) => handleChange('location', text)}
                        />
                    </View>

                    <TouchableOpacity style={styles.formAction} onPress={handleCreateListing}>
                        <View style={styles.btn}>
                            <Text style={styles.btnTxt}>Create post</Text>
                        </View>
                    </TouchableOpacity>
                 </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        // marginVertical: 24,
    },
    form: {
        flex: 1,
        marginBottom: 24,
    },
    imagePicker: {
        alignItems: 'center',
        marginBottom: 12,
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    imageText: {
        color: '#111',
    },
    inputGroup: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputControl: {
        height: 44,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    inputControlDropdown: {
        height: 44,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#fff',
    },
    formAction: {
        marginTop: 4,
        marginBottom: 12,
    },
    btn: {
        backgroundColor: 'purple',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'purple',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnTxt: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    }
});
