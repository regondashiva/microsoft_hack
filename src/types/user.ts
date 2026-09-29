/**
 * User and workspace organization contracts.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "strategist" | "lead" | "admin" | "viewer";
}

export interface Workspace {
  id: string;
  name: string;
  activeBrandId: string;
  members: User[];
  createdAt: string;
}
