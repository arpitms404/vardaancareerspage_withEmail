import { type User, type InsertUser, type JobApplication, type InsertJobApplication } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplications(): Promise<JobApplication[]>;
  getJobApplicationById(id: string): Promise<JobApplication | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobApplications: Map<string, JobApplication>;

  constructor() {
    this.users = new Map();
    this.jobApplications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const id = randomUUID();
    const application: JobApplication = { 
      ...insertApplication, 
      id, 
      coverLetter: insertApplication.coverLetter || null,
      resumeUrl: insertApplication.resumeUrl || null,
      createdAt: new Date() 
    };
    this.jobApplications.set(id, application);
    return application;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getJobApplicationById(id: string): Promise<JobApplication | undefined> {
    return this.jobApplications.get(id);
  }
}

export const storage = new MemStorage();
