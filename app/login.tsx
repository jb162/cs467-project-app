import { useState } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TextInput, TouchableOpacity } from "react-native";


export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleEmailChange = (email: string) => setForm((prev) => ({...prev, email }));
  const handlePasswordChange = (password: string) => setForm((prev) => ({...prev, password }));

  const handleSignIn = () => {
    /* Placeholder functionality */
    console.log("Email:", form.email);
    console.log("Password:", form.password)
  };

  const handleResetPassword = () => {
    /* Placeholder functionality */
    console.log("Password reset received")
  };

  const handleSignUpRedirect = () => {
    /* Placeholder functionality */
    console.log("Redirect requested")
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{uri: 'https://play-lh.googleusercontent.com/tdLFU-DYgwlSCve40R96Ky9O2CnHsQzrV-EcDwd_omjBTkWot6hDYk4E5Vi3jeTCWw=w480-h960' }}
            alt="Craigslist Logo"
            style={styles.headerImg}
          />
          <Text style={styles.title}>Sign in to Craigslist</Text>
          <Text style={styles.subtitle}>The original online classified.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              accessibilityLabel="Email address"
              accessibilityRole="text"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.inputControl}
              placeholder="email@example.com"
              value={form.email}
              onChangeText={handleEmailChange}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              accessibilityLabel="Password"
              accessibilityRole="text"
              autoCapitalize="none"
              secureTextEntry
              style={styles.inputControl}
              placeholder="*********"
              value={form.password}
              onChangeText={handlePasswordChange}
            />
          </View>

          <TouchableOpacity style={styles.formAction} onPress={handleSignIn}>
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>Sign in</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResetPassword}>
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footer} onPress={handleSignUpRedirect}>
              <Text> Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginVertical: 24,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '300',
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
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
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
  },
})
