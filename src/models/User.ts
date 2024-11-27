import { User } from "@/entities/User.entity";

export class UserModal {
    id: number;
    email: string;
    password: string;
    role: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.role = user.role;
        this.name = user.name;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.deletedAt = user.deletedAt;
    }
}