import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1625493184882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const superAdminId = (
      await queryRunner.query(`SELECT * FROM role WHERE title = 'Super Admin'`)
    )[0].id;
    await queryRunner.query(`INSERT INTO public."user" 
      (username, password, first_name, last_name, email, "role") VALUES 
      ('super.admin', 
      '$2b$10$brEef.qoBcpcgUSGKuRFbO.SNmtDA9ZDqyW4JvO0LTFW6.YQItV9.', 
      'super', 'admin', 'super.admin@test.com', '${superAdminId}');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
