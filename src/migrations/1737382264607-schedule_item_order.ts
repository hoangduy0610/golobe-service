import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleItemOrder1737382264607 implements MigrationInterface {
    name = 'ScheduleItemOrder1737382264607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_schedule_item" ADD "order" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_schedule_item" DROP COLUMN "order"`);
    }

}
