export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  isPlaying?: boolean;
}

export interface ChatState {
  messages: Message[];
  isRecording: boolean;
  isThinking: boolean;
}