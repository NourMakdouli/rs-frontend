import { User } from "./user";

export interface articleComment {
  _id: string;
  content: string;
  author: User;
  article: string;
  parentCommentId?: string; // align with DTO's parentCommentId
  replies?: articleComment[]; // or articleComment[] if you're using that name
  likes: string[]; 
  dislikes: string[]; 
  createdAt?: string;
  updatedAt?: string;
}


export interface CreateCommentDto {
  
  articleId: string;
  content: string;
  userId: string;
  parentCommentId?: string;
}
