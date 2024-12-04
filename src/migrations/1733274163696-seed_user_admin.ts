import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';
import { EnumRoles } from "@/enums/EnumRoles";

export class SeedUserAdmin1733274163696 implements MigrationInterface {
    name = 'SeedUserAdmin1733274163696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const password = await bcrypt.hash('root', 12);
        await queryRunner.query(`INSERT INTO "user" ("email", "password", "role", "name") VALUES ('root@localhost.io', '${password}', '${EnumRoles.ROLE_ADMIN}', 'Root Admin System')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE "email" = 'root@localhost.io'`);
    }

}
