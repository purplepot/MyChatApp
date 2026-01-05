import { useEffect } from "react";
import { MessageSquare, Users, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { users, selectedUser, setSelectedUser, getUsers, isUsersLoading } =
    useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const { onlineUsers } = useAuthStore();

  return (
    <div className="h-[calc(100vh-4rem)] px-4 py-6">
      <div className="mx-auto flex h-full w-full gap-4">
        {/* Sidebar */}
        <aside className="w-[20%] shrink-0 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="mb-3 flex items-center pl-4 gap-2 text-sm font-semibold text-foreground">
            <Users className="h-4 w-4 text-primary" />
            People
          </div>

          {isUsersLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-md bg-muted/40 px-3 py-6 text-center text-sm text-muted-foreground">
              No users yet.
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => {
                const isActive = selectedUser?._id === user._id;
                const initials = user.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "?";
                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition hover:bg-accent hover:text-accent-foreground ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="truncate">
                      <div className="truncate font-medium text-foreground">
                        {user.fullName}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {onlineUsers.includes(user._id) ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <div>Offline</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Chat area */}
        <section className="flex min-h-0 flex-1 rounded-lg border border-border bg-card p-4 shadow-sm">
          {selectedUser ? (
            <div className="flex h-full min-h-0 flex-1 flex-col">
              <header className="mb-4 flex items-center gap-3 border-b border-border pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {selectedUser.profilePic ? (
                    <img
                      src={selectedUser.profilePic}
                      alt={selectedUser.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    selectedUser.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "?"
                  )}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {selectedUser.fullName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedUser.email}
                  </div>
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border/70 bg-muted/20">
                <ChatContainer />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/70 bg-muted/20 text-muted-foreground">
              <MessageSquare className="h-10 w-10 text-primary" />
              <p className="text-sm">
                Select a user from the sidebar to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
