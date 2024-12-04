import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1733324346836 implements MigrationInterface {
    name = 'InitDb1733324346836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ROLE_ADMIN', 'ROLE_USER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'ROLE_USER', "name" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "description" character varying NOT NULL, "featureImage" character varying NOT NULL, "mapMarker" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."service_type_filters_enum" AS ENUM('keyword', 'placePair', 'placeSingular', 'dateRange', 'dateSingle', 'guests')`);
        await queryRunner.query(`CREATE TABLE "service_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "filters" "public"."service_type_filters_enum" array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0a11a8d444eff1346826caed987" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."service_pricerange_enum" AS ENUM('cheap', 'moderate', 'expensive', 'custom')`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "images" text array NOT NULL, "description" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying, "email" character varying, "website" character varying, "mapMarker" character varying, "features" text array NOT NULL, "priceRange" "public"."service_pricerange_enum" NOT NULL DEFAULT 'cheap', "price" character varying, "serviceTypeId" integer NOT NULL, "openingHours" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."plan_visibility_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "visibility" "public"."plan_visibility_enum" NOT NULL DEFAULT 'private', "startDate" TIMESTAMP, "endDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" integer, "locationId" integer, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_schedule" ("id" SERIAL NOT NULL, "day" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "locationId" integer, "planId" integer, CONSTRAINT "PK_b94a564c9bdb6511358e1079afe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_schedule_item" ("id" SERIAL NOT NULL, "startTime" character varying, "endTime" character varying, "reservationCode" character varying, "note" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "scheduleId" integer, "serviceId" integer, CONSTRAINT "PK_0145ff717149fc88be9d4dff449" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_saved_services_service" ("planId" integer NOT NULL, "serviceId" integer NOT NULL, CONSTRAINT "PK_ba014e437870e11c9626258a3c3" PRIMARY KEY ("planId", "serviceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_96679ea5c5bb96e11a58db7645" ON "plan_saved_services_service" ("planId") `);
        await queryRunner.query(`CREATE INDEX "IDX_133d80442154aee59d34fc589e" ON "plan_saved_services_service" ("serviceId") `);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_72b9571152bcfe5e9c60f95cd6e" FOREIGN KEY ("serviceTypeId") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan" ADD CONSTRAINT "FK_7f59efeee4890e46f973efdfe28" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan" ADD CONSTRAINT "FK_0149314f41ac3b535ffbcc38288" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_schedule" ADD CONSTRAINT "FK_44f7f7a4f7109e10eadf94a16a6" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_schedule" ADD CONSTRAINT "FK_fe7980ce429d461ba0e3db45786" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "plan_schedule_item" ADD CONSTRAINT "FK_cb7805e6b8d6ed75fc6312b1e4a" FOREIGN KEY ("scheduleId") REFERENCES "plan_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "plan_schedule_item" ADD CONSTRAINT "FK_17e4f2d4d059a38ab072a50e16a" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_saved_services_service" ADD CONSTRAINT "FK_96679ea5c5bb96e11a58db76459" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "plan_saved_services_service" ADD CONSTRAINT "FK_133d80442154aee59d34fc589ed" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_saved_services_service" DROP CONSTRAINT "FK_133d80442154aee59d34fc589ed"`);
        await queryRunner.query(`ALTER TABLE "plan_saved_services_service" DROP CONSTRAINT "FK_96679ea5c5bb96e11a58db76459"`);
        await queryRunner.query(`ALTER TABLE "plan_schedule_item" DROP CONSTRAINT "FK_17e4f2d4d059a38ab072a50e16a"`);
        await queryRunner.query(`ALTER TABLE "plan_schedule_item" DROP CONSTRAINT "FK_cb7805e6b8d6ed75fc6312b1e4a"`);
        await queryRunner.query(`ALTER TABLE "plan_schedule" DROP CONSTRAINT "FK_fe7980ce429d461ba0e3db45786"`);
        await queryRunner.query(`ALTER TABLE "plan_schedule" DROP CONSTRAINT "FK_44f7f7a4f7109e10eadf94a16a6"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP CONSTRAINT "FK_0149314f41ac3b535ffbcc38288"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP CONSTRAINT "FK_7f59efeee4890e46f973efdfe28"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_72b9571152bcfe5e9c60f95cd6e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_133d80442154aee59d34fc589e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96679ea5c5bb96e11a58db7645"`);
        await queryRunner.query(`DROP TABLE "plan_saved_services_service"`);
        await queryRunner.query(`DROP TABLE "plan_schedule_item"`);
        await queryRunner.query(`DROP TABLE "plan_schedule"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TYPE "public"."plan_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TYPE "public"."service_pricerange_enum"`);
        await queryRunner.query(`DROP TABLE "service_type"`);
        await queryRunner.query(`DROP TYPE "public"."service_type_filters_enum"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
