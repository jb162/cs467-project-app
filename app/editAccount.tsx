import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState } from 'react';
import { useRouter, Stack } from "expo-router";
import { useEditAccount } from "./shared/EditAccountContext";

export default function EditAccount() {
    const router = useRouter();
    const { field, value, clearFieldValue } = useEditAccount();
    const [inputValue, setInputValue] = useState(value || '');

    useEffect(() => () => clearFieldValue(), []);
    useEffect(() => {   // update data with input value
      if (value !== null) setInputValue(value);
    }, [value]);

    if (!field || value === null) {
      return (
        <View style={styles.container}>
          <Text>No field selected to edit.</Text>
        </View>
      );
    }

    const handleSave = () => {
      console.log("handleSave() called");
      clearFieldValue();
      router.back();
    };

    const label = field.charAt(0).toUpperCase() + field.slice(1);

    return (
        <SafeAreaView>
          <Stack.Screen options={{ title: '' }} />
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
                  accessibilityLabel={`Input for ${label}`}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.formAction} onPress={handleSave}>
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
    backgroundColor: '#ad5ff5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ad5ff5',
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
