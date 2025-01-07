import { MigrationInterface, QueryRunner } from "typeorm";

export class RelBlog1736235492326 implements MigrationInterface {
    name = 'RelBlog1736235492326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_linked_services_service" ("blogId" integer NOT NULL, "serviceId" integer NOT NULL, CONSTRAINT "PK_3f352e874405105e0e400a6fa0f" PRIMARY KEY ("blogId", "serviceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2105eddc1a3e076e8573914c3a" ON "blog_linked_services_service" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc1e9afd749e61a7eb7dc1e194" ON "blog_linked_services_service" ("serviceId") `);
        await queryRunner.query(`ALTER TABLE "blog_linked_services_service" ADD CONSTRAINT "FK_2105eddc1a3e076e8573914c3a0" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_linked_services_service" ADD CONSTRAINT "FK_cc1e9afd749e61a7eb7dc1e194f" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_linked_services_service" DROP CONSTRAINT "FK_cc1e9afd749e61a7eb7dc1e194f"`);
        await queryRunner.query(`ALTER TABLE "blog_linked_services_service" DROP CONSTRAINT "FK_2105eddc1a3e076e8573914c3a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc1e9afd749e61a7eb7dc1e194"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2105eddc1a3e076e8573914c3a"`);
        await queryRunner.query(`DROP TABLE "blog_linked_services_service"`);
    }

}
