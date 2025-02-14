export const envFiles = ['local.env', 'staging.env', 'production.env'];

export enum EEnvName {
}

export class Constant {
    public static getEnv(name: EEnvName) {
        switch (name) {
            default:
                return '';
        }
    }
    public static readonly JWT_SECRET = 'c4bc8de0-c8cd-4648-92fd-0b18fa3b5aec';
    public static readonly JWT_EXPIRE = '1000d';
    public static readonly BCRYPT_ROUND = 10;
}