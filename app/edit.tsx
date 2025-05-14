import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function EditScreen() {
    const { field, value } = useLocalSearchParams<{ field?: string; value?: string }>();
    const router = useRouter();
    const [inputValue, setInputValue] = useState(value || '');

    const label = {
        name: 'Name',
        email: 'Email Address',
        password: 'Password',
    }[field ?? ''] || 'Field';

    const handleSave = () => {
        console.log(`Saving ${field}:`, inputValue);
        router.back();
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Edit {label}</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{label}</Text>
                        <TextInput
                            secureTextEntry={field === 'password'}
                            keyboardType={field === 'email' ? 'email-address' : 'default'}
                            style={styles.inputControl}
                            value={inputValue}
                            placeholder={`Enter new ${label.toLowerCase()}`}
                            clearButtonMode="while-editing"
                            onChangeText={setInputValue}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.formAction}
                    onPress={handleSave}
                >
                    <View style={styles.btn}>
                        <Text style={styles.btnTxt}>Save</Text>
                    </View>
                </TouchableOpacity>
              </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  form: {
    flex: 1,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
    color: 'grey',
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
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
    color: '#fff'
  },
})
