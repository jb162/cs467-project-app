import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getMessagesBetweenUsers, sendMessage } from '../../shared/api/messages';

const CURRENT_USER = 'test_user_1'; // Update to current user later

type Message = {
  id: number;
  text: string;
  myMessage: boolean;
  timestamp: string;
};

export default function MessageThreadScreen() {
  const { id: receiver, name } = useLocalSearchParams(); 
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        title: name,
        headerStyle: { backgroundColor: '#25292e' },
        headerTintColor: '#fff',
      });
    }

    fetchMessages();
  }, [receiver]);

  const fetchMessages = async () => {
    try {
      const backendMessages = await getMessagesBetweenUsers(CURRENT_USER, String(receiver));
      const formattedMessages: Message[] = backendMessages.map((msg) => ({
        id: Number(msg.id),
        text: msg.message_body,
        myMessage: msg.sender === CURRENT_USER,
        timestamp: new Date(msg.sent_datetime).toLocaleString(),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const sent = await sendMessage({
          sender: CURRENT_USER,
          receiver: String(receiver),
          message_body: newMessage,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Number(sent.id),
            text: sent.message_body,
            myMessage: true,
            timestamp: new Date(sent.sent_datetime).toLocaleString(),
          },
        ]);

        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container} accessibilityRole="summary" accessibilityLabel={`Message thread with ${name ?? 'user'}`}>
      <ScrollView style={styles.messagesContainer} accessibilityRole="list" accessible>
        {messages.length === 0 ? (
          <Text style={styles.noMessagesText} accessibilityRole="alert">
            No messages to display
          </Text>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <Text
                style={[styles.senderName, message.myMessage ? styles.mySenderName : styles.otherSenderName]}
                accessibilityRole="text"
              >
                {message.myMessage ? 'You' : name || 'Buyer'}
              </Text>
              <View
                style={[styles.message, message.myMessage ? styles.myMessage : styles.otherMessage]}
                accessibilityRole="text"
                accessibilityLabel={message.text}
              >
                <Text style={styles.text}>{message.text}</Text>
              </View>
              {message.timestamp && (
                <Text
                  style={[
                    styles.timestamp,
                    message.myMessage ? styles.timestampRight : styles.timestampLeft,
                  ]}
                  accessibilityRole="text"
                  accessibilityLabel={`Sent at ${message.timestamp}`}
                >
                  {message.timestamp}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          onFocus={handleFocus}
          accessibilityLabel="Type a new message"
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={styles.sendButton}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          <MaterialIcons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  message: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 0,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#ad5ff5',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#505050',
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: 'left',
    marginLeft: 10,
  },
  timestampRight: {
    textAlign: 'right',
    marginRight: 10,
  },
  senderName: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
    textAlign: 'left',
  },
  mySenderName: {
    textAlign: 'right',
    marginRight: 10,
  },
  otherSenderName: {
    textAlign: 'left',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#25292e',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#505050',
    color: '#fff',
    borderRadius: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#ad5ff5',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  noMessagesText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
