import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782887016730 implements MigrationInterface {
    name = 'Migration1782887016730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_org_branch_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`org_id\` int NOT NULL, \`branch_id\` int NOT NULL, \`role_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_76ae46b9aea791325d4e9e19439\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_a42ea5a889e239e620d75378ad0\` FOREIGN KEY (\`org_id\`) REFERENCES \`organisations\`(\`org_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_d78fe734c616c5c787503b0ef17\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`branch_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` ADD CONSTRAINT \`FK_f764a08b5afcc4dc42f404c078b\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`role_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_f764a08b5afcc4dc42f404c078b\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_d78fe734c616c5c787503b0ef17\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_a42ea5a889e239e620d75378ad0\``);
        await queryRunner.query(`ALTER TABLE \`user_org_branch_role\` DROP FOREIGN KEY \`FK_76ae46b9aea791325d4e9e19439\``);
        await queryRunner.query(`DROP TABLE \`user_org_branch_role\``);
    }

}
