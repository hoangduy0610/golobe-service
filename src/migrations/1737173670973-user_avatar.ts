import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAvatar1737173670973 implements MigrationInterface {
    name = 'UserAvatar1737173670973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_b0f63a8ca6783662eaf77030823"`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "locationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_b0f63a8ca6783662eaf77030823" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_b0f63a8ca6783662eaf77030823"`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "locationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_b0f63a8ca6783662eaf77030823" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
