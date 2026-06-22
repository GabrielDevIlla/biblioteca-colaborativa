import { PrismaClient } from "@prisma/client";

class instanciaPrisma {
    static Prisma = new PrismaClient

    static getConnection() {
        if (!this.Prisma) {
            this.Prisma = new PrismaClient()
        }
        return this.Prisma;
    }
}

export default instanciaPrisma;