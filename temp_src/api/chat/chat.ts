interface Chats {
  id?: string;
  userId?: string;
  message?: string;
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
