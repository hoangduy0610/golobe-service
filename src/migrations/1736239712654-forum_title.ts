import { MigrationInterface, QueryRunner } from "typeorm";

export class ForumTitle1736239712654 implements MigrationInterface {
    name = 'ForumTitle1736239712654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forum_post" ADD "title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forum_post" DROP COLUMN "title"`);
    }

}
