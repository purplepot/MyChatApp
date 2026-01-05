import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Select a user first");
      return;
    }

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full border-t border-border bg-card/80 backdrop-blur px-4 py-3">
      {imagePreview && (
        <div className="mb-3 inline-flex items-center gap-3 rounded-md border border-border bg-muted/40 p-2 pr-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute -right-2 -top-2 h-7 w-7 rounded-full"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">Image attached</span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2 py-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-5 w-5" />
          </Button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <Input
            type="text"
            className="border-0 bg-transparent focus-visible:ring-0"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          size="icon"
          className="shrink-0"
          disabled={(!text.trim() && !imagePreview) || !selectedUser}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
export default MessageInput;
