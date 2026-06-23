import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782211405187 implements MigrationInterface {
    name = 'Migration1782211405187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`created_by\` \`created_by\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`modified_by\` \`modified_by\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`modified_by\` \`modified_by\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`created_by\` \`created_by\` varchar(255) NOT NULL`);
    }

}
