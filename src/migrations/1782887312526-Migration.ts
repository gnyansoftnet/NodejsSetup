import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782887312526 implements MigrationInterface {
    name = 'Migration1782887312526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_5b2a6bdb8a2451a83f9448de50\` ON \`user_org_branch_role\` (\`user_id\`, \`org_id\`, \`branch_id\`, \`role_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_5b2a6bdb8a2451a83f9448de50\` ON \`user_org_branch_role\``);
    }

}
