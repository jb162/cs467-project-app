import React, { useState, useEffect } from 'react';
import { useRouter, withLayoutContext } from 'expo-router';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image,
  TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUser, User } from '../../shared/api/users'; 
import { fetchUserProfileImage } from '@/shared/api/images';
import { COLORS } from '../shared/colors';

const CURRENT_USER = 'ikeafan'; // Update to current user later

type Thread = {
  id: string;
  username: string;
  name: string;
  message: string;
  date: string;
  pinned: boolean;
  image?: string;
};

type BackendMessage = {
  id: number;
  sender: string;
  receiver: string;
  message_body: string;
  sent_datetime: string;
};

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messageSearch, setMessageSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchMessagesAndUsers() {
      try {
        const response = await fetch(
          `https://backend-api-729553473022.us-central1.run.app/v1/Messages?user=${CURRENT_USER}`
        );
        const { messages } = await response.json();
        const data: BackendMessage[] = messages;

        const userMessages = data.filter(
          (msg) => msg.sender === CURRENT_USER || msg.receiver === CURRENT_USER
        );

        const otherUsernamesSet = new Set<string>();
        userMessages.forEach((msg) => {
          if (msg.sender !== CURRENT_USER) otherUsernamesSet.add(msg.sender);
          if (msg.receiver !== CURRENT_USER) otherUsernamesSet.add(msg.receiver);
        });
        const otherUsernames = Array.from(otherUsernamesSet);

        // Fetch user data
        const userPromises = otherUsernames.map((username) =>
          getUser(username).catch(() => null)
        );
        const usersData = await Promise.all(userPromises);

        const usersMap = new Map<string, User>();
        usersData.forEach((user) => {
          if (user) usersMap.set(user.username, user);
        });

        // Build threads without images first
        const groupedThreads: { [key: string]: Thread } = {};
        userMessages.forEach((msg) => {
          const key = [msg.sender, msg.receiver].sort().join('-');
          const otherUser = msg.sender === CURRENT_USER ? msg.receiver : msg.sender;
          const otherUserDetails = usersMap.get(otherUser);
          const userName = otherUserDetails?.full_name || otherUserDetails?.username || otherUser;

          if (
            !groupedThreads[key] ||
            new Date(msg.sent_datetime) > new Date(groupedThreads[key].date)
          ) {
            groupedThreads[key] = {
              id: key,
              username: otherUser,
              name: userName,
              message: msg.message_body,
              date: msg.sent_datetime,
              pinned: false,
              image: undefined, // placeholder, will set below
            };
          }
        });

        // Fetch images for each thread user in parallel
        const threadUsers = Object.values(groupedThreads).map((thread) => thread.username);
        // Fetch images for each thread user in parallel
        const imagePromises = threadUsers.map(async (username) => {
          try {
            const imageData = await fetchUserProfileImage(username);
            console.log(`Fetched image URL for ${username}:`, imageData.url);
            return imageData;
          } catch {
            console.log(`Failed to fetch image for ${username}`);
            return { url: undefined };
          }
        });
        const images = await Promise.all(imagePromises);

        // Assign fetched images to threads
        Object.values(groupedThreads).forEach((thread, idx) => {
          const imageUrl = images[idx].url;
          thread.image = imageUrl || undefined;
        });

        setThreads(Object.values(groupedThreads));
      } catch (error) {
        console.error('Failed to fetch messages or users:', error);
      }
    }

    fetchMessagesAndUsers();
  }, []);

  const filteredThreads = threads
    .filter(
      (t) =>
        t.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
        t.message.toLowerCase().includes(messageSearch.toLowerCase())
    )
    .sort((a, b) =>
      a.pinned === b.pinned
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : a.pinned
        ? -1
        : 1
    );

  const togglePin = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, pinned: !t.pinned } : t))
    );
  };

  const renderItem = ({ item }: { item: Thread }) => {
    const otherUser = item.username || 'unknown';

    return (
      <TouchableOpacity
        onPress={() => router.push(`/messages/${otherUser}?name=${item.name}`)}
        accessibilityLabel={`Open chat with ${item.name}`}
        accessibilityRole="button"
      >
        <View style={[styles.item, item.pinned && styles.pinned]}>
          <View
            style={styles.messageAvatar}
            accessible
            accessibilityLabel={`Avatar of ${item.name}`}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.avatarImage}
                accessibilityLabel={`Profile image of ${item.name}`}
              />
            ) : (
              <Text style={styles.avatarText}>
                {item.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.name} accessibilityLabel={`Name: ${item.name}`}>
              {item.name}
            </Text>
            <Text style={[styles.message, item.pinned && { color: 'white' }]} 
              accessibilityLabel={`Last message: ${item.message}`}>
              {item.message}
            </Text>
            <Text style={styles.date} accessibilityLabel={`Date: ${new Date(item.date).toLocaleDateString()}`}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => togglePin(item.id)}
            style={styles.pinIcon}
            accessibilityLabel={`Toggle pin for ${item.name}`}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="push-pin"
              size={22}
              color={item.pinned ? '#ad5ff5' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search messages..."
          placeholderTextColor="#aaa"
          style={styles.messageSearch}
          value={messageSearch}
          onChangeText={setMessageSearch}
          autoCapitalize="none"
          accessibilityLabel="Search messages"
          accessibilityRole="search"
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {filteredThreads.length === 0 ? (
              <View style={styles.noMessagesContainer}>
                <Text style={styles.noMessagesText}>
                  {messageSearch
                    ? 'No messages match your search.'
                    : 'No messages to display'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredThreads}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  messageSearch: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.border,
    color: 'black',
    borderRadius: 8,
    fontSize: 16,
  },
  searchContainer: {
    paddingTop: 10,
    paddingHorizontal: 4,
    backgroundColor: '#25292e',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  pinned: {
    backgroundColor: '#25292e',
  },
  messageAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ad5ff5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  content: {
    flex: 1,
  },
  name: {
    color: '#ad5ff5',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  message: {
    color: '#000',
    fontSize: 15,
    marginBottom: 2,
  },
  date: {
    color: '#aaa',
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  noMessagesText: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pinIcon: {
    padding: 6,
    color: 'black'
  },
});
