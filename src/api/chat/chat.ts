export interface Chats {
  imageUrl: undefined;
  id?: string;
  userId?: string;
  message?: string;
  isImage?: boolean;
  channelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  Employee?: {
    firstName: string;
    email: string;
    phoneNumber: string;
    employmentStatus: "Active" | "Inactive";
    role: "admin" | "employee" | "manager";
    profileImage: string | null;
  };
}

export interface MessageData {
  messageId: string;
  isImage: boolean;
  message: string;
  channel: string;
  channelName: string;
  time: Date;
  author: AuthorDetail;
}

export interface AuthorDetail {
  id: string;
  name: string;
  profileImage: string;
}

export function castChatsToMessageData(
  chat: Chats,
  channelName: string
): MessageData {
  return {
    messageId: chat.id || "",
    isImage: chat.isImage || false,
    message: chat.message || "",
    channel: chat.channelId || "",
    channelName: channelName,
    time: chat.createdAt || new Date(),
    author: {
      id: chat.userId || "",
      name: chat.Employee?.firstName || "Unknown",
      profileImage:
        chat.Employee?.profileImage ||
        "https://cdn.pixabay.com/photo/2025/04/08/10/42/landscape-9521261_960_720.jpg",
    },
  };
}

// export class Chats {
//     id?: string;
//     userId?: string;
//     message?: string;
//     channelId?: string;
//     createdAt?: Date;
//     updatedAt?: Date;
//     Employee?: {
//       firstName: string;
//       email: string;
//       phoneNumber: string;
//       employmentStatus: "Active" | "Inactive";
//       role: "admin" | "employee" | "manager";
//       profileImage: string | null;
//     };

//     constructor(chat: any) {
//       this.id = chat.id;
//       this.userId = chat.userId;
//       this.message = chat.message;
//       this.channelId = chat.channelId;
//       this.createdAt = chat.createdAt;
//       this.updatedAt = chat.updatedAt;
//       this.Employee = {
//         firstName: chat.Employee?.firstName || "",
//         email: chat.Employee?.email || "",
//         phoneNumber: chat.Employee?.phoneNumber || "",
//         employmentStatus: chat.Employee?.employmentStatus || "Inactive",
//         role: chat.Employee?.role || "employee",
//         profileImage: chat.Employee?.profileImage || null,
//       };
//     }
//   }
