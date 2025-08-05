// types.ts
export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Category {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface Course {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  price: number;
  branchprice: number;
  duration: number;
  isActive: boolean;
}
