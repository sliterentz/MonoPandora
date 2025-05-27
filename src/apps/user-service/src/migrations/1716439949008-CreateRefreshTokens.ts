import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshTokens1716439949008 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE IF NOT EXISTS "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying COLLATE pg_catalog."default" NOT NULL, "expired_at" timestamp  without time zone NOT NULL DEFAULT, "created_at" timestamp without time zone NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" timestamp without time zone NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, user_id UUID NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"), CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("user_id") REFERENCES users (id))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
