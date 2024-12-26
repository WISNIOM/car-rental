import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../abstract/abstract.entity';

@Entity()
export class VehicleBrand extends AbstractEntity {
  @Column()
  name: string;
}
