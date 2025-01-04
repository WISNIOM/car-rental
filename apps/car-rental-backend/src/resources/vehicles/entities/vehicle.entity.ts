import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VehicleBrand } from '../../vehicle-brands/entities/vehicle-brand.entity';
import { AbstractEntity } from '../../../common/entity/abstract.entity';
import { Address } from '../../addresses/entities/address.entity';

@Entity({ name: 'vehicles' })
export class Vehicle extends AbstractEntity {
  @ManyToOne(() => VehicleBrand)
  @JoinColumn({ name: 'brandId' })
  brand: VehicleBrand;
  @Column()
  vehicleIdentificationNumber: string;
  @Column()
  registrationNumber: string;
  @Column()
  clientEmail: string;
  @ManyToOne(() => Address, { cascade: ['insert', 'update', 'remove'], onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientAddressId' })
  clientAddress: Address;
}
