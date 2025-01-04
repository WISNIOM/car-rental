import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/entity/abstract.entity';

@Entity({ name: 'vehicle_brands' })
export class VehicleBrand extends AbstractEntity {
  @Column()
  name: string;
}
