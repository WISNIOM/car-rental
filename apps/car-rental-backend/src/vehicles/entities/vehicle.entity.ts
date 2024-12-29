import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { VehicleBrand } from '../../vehicle-brands/entities/vehicle-brand.entity';
import { AbstractEntity } from '../../common/entity/abstract.entity';

@Entity()
export class Vehicle extends AbstractEntity {
  @ManyToOne(() => VehicleBrand)
  @JoinColumn({ name: 'brand' })
  brand: VehicleBrand;
  @Column()
  vehicleIdentificationNumber: string;
  @Column()
  registrationNumber: string;
  @Column()
  clientEmail: string;
  @Column()
  clientAddress: string;
}
