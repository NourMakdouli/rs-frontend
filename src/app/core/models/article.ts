import { articleComment } from "./comment";
import { Tag } from "./tag";
import { User } from "./user";

export interface Article {
    _id: string;
    title: string;
    content: string;
    author: User;
    comments: articleComment[];
    likes: string[]; // Array of user IDs who liked the article
    dislikes: string[]; // Array of user IDs who disliked the article
    image: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
    isDraft:boolean;

  }
  