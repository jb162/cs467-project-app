import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={screenOptions}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'chatbubble-sharp' : 'chatbubble-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="post"
                options={{
                    headerTitleAlign: 'center',
                    headerTitle: 'Create Post',
                    tabBarLabel: 'Post',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'add-circle-sharp' : 'add-circle-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}

const screenOptions = {
    headerStyle: {
        backgroundColor: '#25292e',
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    tabBarStyle: {
        backgroundColor: '#25292e',
    },
    tabBarActiveTintColor: '#ad5ff5',
};
