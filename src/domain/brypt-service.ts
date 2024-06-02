import bcrypt from "bcrypt";

const secretWord = process.env.JWT_SECRET || "test";

export class BryptService {

    static async compareHashes(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);

        } catch (error) {
            throw new Error('Error comparing hashes');
        }
    }

    static async getHash(password: string){

        try {
            return  await bcrypt.hash(password, 10);

        } catch (error) {
            throw new Error('Error comparing hashes');
        }
    }
}