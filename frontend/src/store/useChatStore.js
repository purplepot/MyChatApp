import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  newMessageListener: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    const existingListener = get().newMessageListener;
    if (existingListener) {
      socket.off("newMessage", existingListener);
    }

    const messageListener = (newMessage) => {
      set((state) => {
        const activeId = state.selectedUser?._id;
        const involvesActive =
          activeId &&
          (newMessage.senderId === activeId ||
            newMessage.receiverId === activeId);
        if (!involvesActive) return state;
        return { messages: [...state.messages, newMessage] };
      });
    };

    socket.on("newMessage", messageListener);
    set({ newMessageListener: messageListener });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    const { newMessageListener } = get();
    if (newMessageListener) {
      socket?.off("newMessage", newMessageListener);
      set({ newMessageListener: null });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
