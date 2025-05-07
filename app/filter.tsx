import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';

export default function FilterComponent({ onClose, onSelectSort, selectedSort }) {
    const [selectedOption, setSelectedOption] = useState(selectedSort || null);

    useEffect(() => {
        setSelectedOption(selectedSort || null);
    }, [selectedSort]);

    const options = [
        { label: 'Newest (Default)', value: 'newest'},
        { label: 'Oldest', value: 'oldest'},
        { label: 'Price: Low to High', value: 'lowToHigh' },
        { label: 'Price: High to Low', value: 'highToLow' },
    ];

    const handleOptionSelect = () => {
        if (selectedOption !== null) {
            onSelectSort(selectedOption)
        }
        onClose();
    };

    return (
        <View style={styles.filterContainer}>
            <TouchableOpacity
                onPress={onClose}
                style={styles.filterClose}>
            <Ionicons color="#1d1d1d" name="close" size={24} />
            </TouchableOpacity>
            <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Sort By</Text>
            </View>

            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    onPress={() => setSelectedOption(option.value)}
                    style={styles.radioWrapper}
                >
                    <View style={styles.radio}>
                        <Text style={styles.radioLabel}>{option.label}</Text>
                        <View
                            style={[
                                styles.radioCheck,
                                selectedOption === option.value && styles.radioCheckActive,
                            ]}
                        >
                            <Ionicons
                                color="#fff"
                                name="checkmark"
                                style={selectedOption !== option.value && { display: 'none' }}
                                size={12}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
            <View style={styles.filterActions}>
                <TouchableOpacity style={styles.btn} onPress={onClose}>
                    <Text style={styles.btnTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handleOptionSelect}>
                    <Text style={styles.btnTxt}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    filterClose: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    filterHeader: {
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    filterTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
    },
    radio: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 54,
        paddingRight: 24,
      },
      radioWrapper: {
        paddingLeft: 24,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderColor: '#e8e8e8',
      },
      radioLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222222',
        marginBottom: 2,
      },
      radioCheck: {
        width: 22,
        height: 22,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        borderWidth: 1,
        borderColor: '#999B9A',
      },
      radioCheckActive: {
        borderColor: '#ad5ff5',
        backgroundColor: '#ad5ff5',
      },
      filterActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        padding: 10,
      },
      btn: {
        backgroundColor: '#ad5ff5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
      },
      btnTxt: {
        fontSize: 16,
        color: '#fff',
      }
})
