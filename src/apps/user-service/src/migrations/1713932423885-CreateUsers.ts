import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1713932423885 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullname" character varying COLLATE pg_catalog."default" NOT NULL, "email" character varying COLLATE pg_catalog."default" NOT NULL, "password" character varying COLLATE pg_catalog."default" NOT NULL, "grant" integer NOT NULL, "authConfirmToken" character varying COLLATE pg_catalog."default" NOT NULL, "isVerrified" boolean NOT NULL, "created_at" timestamp without time zone NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" timestamp without time zone NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
