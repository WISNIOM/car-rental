import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleBrand } from '../../vehicle-brands/entities/vehicle-brand.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;
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
