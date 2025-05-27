import { User } from "./user.model";

export interface Boat {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  owner?:User;
  ownerFirstName?: string;
  ownerLastName?: string;
  userId?: number;
}
