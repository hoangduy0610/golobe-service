import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceLocation1737167147425 implements MigrationInterface {
    name = 'ServiceLocation1737167147425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" ADD "locationId" integer`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_b0f63a8ca6783662eaf77030823" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_b0f63a8ca6783662eaf77030823"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "locationId"`);
    }

}
