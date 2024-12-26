import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class VehicleBrand extends AbstractEntity {
  @Column()
  name: string;
}
