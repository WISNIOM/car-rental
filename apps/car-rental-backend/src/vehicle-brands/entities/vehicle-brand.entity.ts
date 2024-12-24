import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
