import { Message } from "./interfaces";

export const mockMessages: Message[] = [
  // Conversation with justin123
  {
    id: 1,
    sender: "ikeafan",
    recipient: "justin123",
    message_body: "Hi Justin, is the white T-shirt still available?",
    sent_datetime: "2025-05-05T10:00:00Z",
  },
  {
    id: 2,
    sender: "justin123",
    recipient: "ikeafan",
    message_body: "Hey! Yep, still got it. Want to meet this weekend?",
    sent_datetime: "2025-05-05T10:05:00Z",
  },
  {
    id: 3,
    sender: "ikeafan",
    recipient: "justin123",
    message_body: "Sure, Saturday afternoon works?",
    sent_datetime: "2025-05-05T10:10:00Z",
  },
  {
    id: 4,
    sender: "justin123",
    recipient: "ikeafan",
    message_body: "Perfect, let’s meet at Pike Place Market?",
    sent_datetime: "2025-05-05T10:15:00Z",
  },

  // Conversation with sneakerhead88
  {
    id: 5,
    sender: "ikeafan",
    recipient: "sneakerhead88",
    message_body: "Hi, I'm interested in the Jordans. Are they size 10?",
    sent_datetime: "2025-05-06T12:00:00Z",
  },
  {
    id: 6,
    sender: "sneakerhead88",
    recipient: "ikeafan",
    message_body: "Yes, size 10. Still in great condition!",
    sent_datetime: "2025-05-06T12:10:00Z",
  },
  {
    id: 7,
    sender: "ikeafan",
    recipient: "sneakerhead88",
    message_body: "Nice, any chance you can do $100?",
    sent_datetime: "2025-05-06T12:12:00Z",
  },
  {
    id: 8,
    sender: "sneakerhead88",
    recipient: "ikeafan",
    message_body: "Let’s call it $105 and it’s yours.",
    sent_datetime: "2025-05-06T12:15:00Z",
  },
  {
    id: 9,
    sender: "ikeafan",
    recipient: "sneakerhead88",
    message_body: "Deal! When and where to meet?",
    sent_datetime: "2025-05-06T12:17:00Z",
  },

  // Conversation with maclover
  {
    id: 10,
    sender: "ikeafan",
    recipient: "maclover",
    message_body: "Hello! Is the MacBook Pro battery still good?",
    sent_datetime: "2025-05-07T09:30:00Z",
  },
  {
    id: 11,
    sender: "maclover",
    recipient: "ikeafan",
    message_body: "Yes, holds charge for 5+ hours. No issues.",
    sent_datetime: "2025-05-07T09:33:00Z",
  },
  {
    id: 12,
    sender: "ikeafan",
    recipient: "maclover",
    message_body: "Great! Can I test it before buying?",
    sent_datetime: "2025-05-07T09:35:00Z",
  },
  {
    id: 13,
    sender: "maclover",
    recipient: "ikeafan",
    message_body: "Of course. Want to meet at a coffee shop?",
    sent_datetime: "2025-05-07T09:37:00Z",
  },
  {
    id: 14,
    sender: "ikeafan",
    recipient: "maclover",
    message_body: "Sounds good. Let’s do Saturday morning?",
    sent_datetime: "2025-05-07T09:40:00Z",
  },
];
