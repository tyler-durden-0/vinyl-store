import { MigrationInterface, QueryRunner } from 'typeorm';

export class vinylCreateInit1647244470830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (let a = 0; a < 50; a++) {
      await queryRunner.query(
        'INSERT INTO vinyl_entity (name,authorName,description,image,price) values ("Life Goes On","Oliver Tree","Awesome music","testImg",50)',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
