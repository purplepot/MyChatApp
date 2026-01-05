import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatMessageTime } from "@/lib/utils";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (!selectedUser) {
      unsubscribeFromMessages();
      return;
    }

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-border bg-card shadow-sm">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-background px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((message) => {
            const isSelf = message.senderId === authUser._id;
            const avatarSrc = isSelf
              ? authUser.profilePic || "/avatar.png"
              : selectedUser?.profilePic || "/avatar.png";

            return (
              <div
                key={message._id}
                className={`flex items-end gap-3 ${
                  isSelf ? "justify-end" : "justify-start"
                }`}
              >
                {!isSelf && (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                    <img
                      src={avatarSrc}
                      alt="profile pic"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    isSelf
                      ? "bg-muted text-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="mb-2 max-h-60 w-full rounded-lg object-cover"
                    />
                  )}
                  {message.text && (
                    <p className="leading-relaxed">{message.text}</p>
                  )}
                  <div className="mt-2 text-[11px] text-muted-foreground/80">
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>

                {isSelf && (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                    <img
                      src={avatarSrc}
                      alt="profile pic"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
