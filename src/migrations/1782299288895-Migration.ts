import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782299288895 implements MigrationInterface {
    name = 'Migration1782299288895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branches\` ADD UNIQUE INDEX \`IDX_2b6abc34843ae0c9b09dcedeff\` (\`branch_short_name\`)`);
        await queryRunner.query(`ALTER TABLE \`branches\` ADD UNIQUE INDEX \`IDX_7b48a680eb17f642cc36ff78d8\` (\`branch_code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branches\` DROP INDEX \`IDX_7b48a680eb17f642cc36ff78d8\``);
        await queryRunner.query(`ALTER TABLE \`branches\` DROP INDEX \`IDX_2b6abc34843ae0c9b09dcedeff\``);
    }

}
