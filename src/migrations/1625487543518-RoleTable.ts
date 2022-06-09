import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleTable1625487543518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO role (title) VALUES ('Super Admin');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
