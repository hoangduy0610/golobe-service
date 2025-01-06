import { MigrationInterface, QueryRunner } from "typeorm";

export class ForumAndBlog1736149761692 implements MigrationInterface {
    name = 'ForumAndBlog1736149761692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "image" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "serviceId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "forum_interaction" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "postId" integer, "userId" integer, CONSTRAINT "PK_60cd53ecca60dc8d2f9caedc2f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "forum_post" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "replyToId" integer, "userId" integer, CONSTRAINT "PK_35363fad61a4ba1fb0ba562b444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "forum_follow" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "followingId" integer, "followerId" integer, CONSTRAINT "PK_315ab783b7cc6e7ba3033f35310" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_5be56dc061111c8643e5ba1e9d0" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum_interaction" ADD CONSTRAINT "FK_8d61a376b52023a3d447295f556" FOREIGN KEY ("postId") REFERENCES "forum_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum_interaction" ADD CONSTRAINT "FK_6455af1e50b9d4cd70b3adf7f03" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum_post" ADD CONSTRAINT "FK_b7eb420482f651da4b889ede391" FOREIGN KEY ("replyToId") REFERENCES "forum_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum_post" ADD CONSTRAINT "FK_b35873d317eb82b8c3601112010" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum_follow" ADD CONSTRAINT "FK_de387ec9e58fbffc8afe5b7450e" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum_follow" ADD CONSTRAINT "FK_c3c41646983aa110d5eaa28137c" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forum_follow" DROP CONSTRAINT "FK_c3c41646983aa110d5eaa28137c"`);
        await queryRunner.query(`ALTER TABLE "forum_follow" DROP CONSTRAINT "FK_de387ec9e58fbffc8afe5b7450e"`);
        await queryRunner.query(`ALTER TABLE "forum_post" DROP CONSTRAINT "FK_b35873d317eb82b8c3601112010"`);
        await queryRunner.query(`ALTER TABLE "forum_post" DROP CONSTRAINT "FK_b7eb420482f651da4b889ede391"`);
        await queryRunner.query(`ALTER TABLE "forum_interaction" DROP CONSTRAINT "FK_6455af1e50b9d4cd70b3adf7f03"`);
        await queryRunner.query(`ALTER TABLE "forum_interaction" DROP CONSTRAINT "FK_8d61a376b52023a3d447295f556"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_5be56dc061111c8643e5ba1e9d0"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d"`);
        await queryRunner.query(`DROP TABLE "forum_follow"`);
        await queryRunner.query(`DROP TABLE "forum_post"`);
        await queryRunner.query(`DROP TABLE "forum_interaction"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
