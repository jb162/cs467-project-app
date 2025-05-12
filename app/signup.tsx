import { useState} from "react";
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleNameChange = (name: string) => setForm((prev) => ({...prev, name }));
  const handleEmailChange = (email: string) => setForm((prev) => ({...prev, email }));
  const handlePasswordChange = (password: string) => setForm((prev) => ({...prev, password }));
  const handleConfirmPasswordChange = (confirmPassword: string) => setForm((prev) => ({...prev, confirmPassword }));

  const handleSignUp = () => {
    /* Placeholder functionality */
    console.log("Signup requested");
  };

  const handleSignInRedirect = () => {
    /* Placeholder functionality */
    console.log("Redirect requested")
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel="back button"
            accessibilityRole="button"
            // onPress={}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="black"/>
          </TouchableOpacity>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Fill in the fields below to get started.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              accessibilityLabel="First and Last Name"
              accessibilityRole="text"
              style={styles.inputControl}
              value={form.name}
              placeholder="John Doe"
              clearButtonMode="while-editing"
              onChangeText={handleNameChange}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              accessibilityLabel="Email address"
              accessibilityRole="text"
              style={styles.inputControl}
              placeholder="email@example.com"
              value={form.email}
              clearButtonMode="while-editing"
              onChangeText={handleEmailChange}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              accessibilityLabel="Password"
              accessibilityRole="text"
              style={styles.inputControl}
              value={form.password}
              placeholder="*********"
              secureTextEntry
              clearButtonMode="while-editing"
              onChangeText={handlePasswordChange}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              accessibilityLabel="Confirm Password"
              accessibilityRole="text"
              style={styles.inputControl}
              value={form.confirmPassword}
              placeholder="*********"
              secureTextEntry
              clearButtonMode="while-editing"
              onChangeText={handleConfirmPasswordChange}
            />
          </View>

          <TouchableOpacity style={styles.formAction}
           onPress={handleSignUp}
          >
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>Get Started</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footer} onPress={handleSignInRedirect}>
              <Text> Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
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
  backBtn: {
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
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
  footer: {
    marginTop: 50,
    alignItems: 'center',
    paddingVertical: 24,
  }
})
