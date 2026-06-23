import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781702673344 implements MigrationInterface {
    name = 'Migration1781702673344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role_permissions\` (\`role_permission_id\` int NOT NULL AUTO_INCREMENT, \`can_read\` tinyint NOT NULL DEFAULT 0, \`can_write\` tinyint NOT NULL DEFAULT 0, \`can_update\` tinyint NOT NULL DEFAULT 0, \`can_delete\` tinyint NOT NULL DEFAULT 0, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dFlag\` tinyint NOT NULL DEFAULT 0, \`role_id\` int NULL, \`page_id\` int NULL, PRIMARY KEY (\`role_permission_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permissions\` (\`user_permission_id\` int NOT NULL AUTO_INCREMENT, \`can_read\` tinyint NOT NULL DEFAULT 0, \`can_write\` tinyint NOT NULL DEFAULT 0, \`can_update\` tinyint NOT NULL DEFAULT 0, \`can_delete\` tinyint NOT NULL DEFAULT 0, \`created_by\` varchar(255) NULL, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_by\` varchar(255) NULL, \`modified_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, \`page_id\` int NOT NULL, PRIMARY KEY (\`user_permission_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`organisations\` ADD UNIQUE INDEX \`IDX_eec854db969eca86644936bedd\` (\`org_short_name\`)`);
        await queryRunner.query(`ALTER TABLE \`organisations\` ADD UNIQUE INDEX \`IDX_d8de7df131272545f556f272e5\` (\`org_code\`)`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_178199805b901ccd220ab7740ec\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_becd26d9c4332330de1cfed61a7\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`page_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_3495bd31f1862d02931e8e8d2e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_04a0f8dce7daa00fea9c192112d\` FOREIGN KEY (\`page_id\`) REFERENCES \`pages\`(\`page_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_04a0f8dce7daa00fea9c192112d\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_3495bd31f1862d02931e8e8d2e8\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_becd26d9c4332330de1cfed61a7\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_178199805b901ccd220ab7740ec\``);
        await queryRunner.query(`ALTER TABLE \`organisations\` DROP INDEX \`IDX_d8de7df131272545f556f272e5\``);
        await queryRunner.query(`ALTER TABLE \`organisations\` DROP INDEX \`IDX_eec854db969eca86644936bedd\``);
        await queryRunner.query(`DROP TABLE \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`role_permissions\``);
    }

}
