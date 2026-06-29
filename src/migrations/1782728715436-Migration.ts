import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782728715436 implements MigrationInterface {
    name = 'Migration1782728715436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_23351656ab098559729ac15f50\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8de7df131272545f556f272e5\` ON \`organisations\``);
        await queryRunner.query(`DROP INDEX \`IDX_eec854db969eca86644936bedd\` ON \`organisations\``);
        await queryRunner.query(`DROP INDEX \`IDX_2b6abc34843ae0c9b09dcedeff\` ON \`branches\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b48a680eb17f642cc36ff78d8\` ON \`branches\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_7b48a680eb17f642cc36ff78d8\` ON \`branches\` (\`branch_code\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_2b6abc34843ae0c9b09dcedeff\` ON \`branches\` (\`branch_short_name\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_eec854db969eca86644936bedd\` ON \`organisations\` (\`org_short_name\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d8de7df131272545f556f272e5\` ON \`organisations\` (\`org_code\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_23351656ab098559729ac15f50\` ON \`users\` (\`user_code\`)`);
    }

}
