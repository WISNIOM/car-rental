import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { VehicleBrand } from '../../vehicle-brands/entities/vehicle-brand.entity';
import { AbstractEntity } from '../../abstract/abstract.entity';

@Entity()
export class Vehicle extends AbstractEntity {
  @ManyToOne(() => VehicleBrand)
  @JoinColumn({ name: 'brand' })
  brand: VehicleBrand;
  @Column()
  VIN: string;
  @Column()
  registrationNumber: string;
  @Column()
  customerEmail: string;
  @Column()
  customerAddress: string;
}
