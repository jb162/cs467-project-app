import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image,
  TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUser, User } from '../../shared/api/users'; 

const CURRENT_USER = 'ikeafan'; // Update to current user later

type Thread = {
  id: string;
  name: string;
  message: string;
  date: string;
  pinned: boolean;
  image?: string;
};

type BackendMessage = {
  id: number;
  sender: string;
  recipient: string;
  message_body: string;
  sent_datetime: string;
};

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messageSearch, setMessageSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchMessagesAndUsers() {
      try {
        const response = await fetch(
          'http://backend-api-729553473022.us-central1.run.app/v1/Messages'
        );
        const data: BackendMessage[] = await response.json();

        const userMessages = data.filter(
          (msg) => msg.sender === CURRENT_USER || msg.recipient === CURRENT_USER
        );

        const otherUsernamesSet = new Set<string>();
        userMessages.forEach((msg) => {
          if (msg.sender !== CURRENT_USER) otherUsernamesSet.add(msg.sender);
          if (msg.recipient !== CURRENT_USER) otherUsernamesSet.add(msg.recipient);
        });
        const otherUsernames = Array.from(otherUsernamesSet);

        const userPromises = otherUsernames.map((username) =>
          getUser(username).catch(() => null)
        );
        const usersData = await Promise.all(userPromises);

        const usersMap = new Map<string, User>();
        usersData.forEach((user) => {
          if (user) usersMap.set(user.username, user);
        });

        const groupedThreads: { [key: string]: Thread } = {};

        userMessages.forEach((msg) => {
          const key = [msg.sender, msg.recipient].sort().join('-');
          const otherUser = msg.sender === CURRENT_USER ? msg.recipient : msg.sender;
          const otherUserDetails = usersMap.get(otherUser);
          const userName = otherUserDetails?.username || otherUser;
          // Add image to interface later
          const image = undefined;

          // Show most recent message per thread
          if (
            !groupedThreads[key] ||
            new Date(msg.sent_datetime) > new Date(groupedThreads[key].date)
          ) {
            groupedThreads[key] = {
              id: key,
              name: userName,
              message: msg.message_body,
              date: msg.sent_datetime,
              pinned: false,
              image,
            };
          }
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

  const openModal = (thread: Thread) => {
    setSelectedThread(thread);
    setRenameInput(thread.name);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedThread(null);
    setRenameInput('');
  };

  const handleRename = () => {
    if (selectedThread) {
      setThreads((prev) =>
        prev.map((t) => (t.id === selectedThread.id ? { ...t, name: renameInput } : t))
      );
      closeModal();
    }
  };

  const handleTogglePin = () => {
    if (selectedThread) {
      setThreads((prev) =>
        prev.map((t) => (t.id === selectedThread.id ? { ...t, pinned: !t.pinned } : t))
      );
      closeModal();
    }
  };

  const handleDelete = () => {
    if (selectedThread) {
      setThreads((prev) => prev.filter((t) => t.id !== selectedThread.id));
      closeModal();
    }
  };

  const renderItem = ({ item }: { item: Thread }) => {
    const otherUser = item.id.split('-').find((u) => u !== CURRENT_USER) || 'unknown';

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
            <Text style={styles.message} accessibilityLabel={`Last message: ${item.message}`}>
              {item.message}
            </Text>
            <Text style={styles.date} accessibilityLabel={`Date: ${new Date(item.date).toLocaleDateString()}`}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => openModal(item)}
            accessibilityLabel={`More options for chat with ${item.name}`}
            accessibilityRole="button"
          >
            <MaterialIcons name="more-vert" size={24} color="#fff" />
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
            <FlatList
              data={filteredThreads}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </TouchableWithoutFeedback>

        {modalVisible && (
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeIcon}
                    accessibilityLabel="Close thread management modal"
                    accessibilityRole="button"
                  >
                    <MaterialIcons name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Manage Thread</Text>
                  {selectedThread && (
                    <>
                      <Text style={styles.modalThreadName}>{selectedThread.name}</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={renameInput}
                        onChangeText={setRenameInput}
                        placeholder="New name"
                        accessibilityLabel="Rename thread"
                        accessibilityRole="search"
                      />
                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          onPress={handleRename}
                          accessibilityLabel="Save thread name"
                          accessibilityRole="button"
                        >
                          <Text style={[styles.modalButton, styles.bold]}>Save</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          onPress={handleTogglePin}
                          accessibilityLabel={`${selectedThread.pinned ? 'Unpin' : 'Pin'} this thread`}
                          accessibilityRole="button"
                        >
                          <Text style={styles.modalButton}>
                            {selectedThread.pinned ? 'Unpin' : 'Pin'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleDelete}
                          accessibilityLabel="Delete this thread"
                          accessibilityRole="button"
                        >
                          <Text style={[styles.modalButton, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 10,
  },
  messageSearch: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3a3f47',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
  searchContainer: {
    backgroundColor: '#25292e',
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  pinned: {
    backgroundColor: '#ad5ff5',
  },
  messageAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5229ff',
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  message: {
    color: '#ccc',
    fontSize: 15,
    marginBottom: 2,
  },
  date: {
    color: '#ccc',
    fontSize: 12,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 8,
    padding: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalThreadName: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  modalButton: {
    fontSize: 16,
    color: '#5229ff',
  },
  bold: {
    fontWeight: 'bold',
  },
});
