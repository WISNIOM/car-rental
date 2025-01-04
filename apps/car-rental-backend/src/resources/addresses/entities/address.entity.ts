import { AbstractEntity } from '../../../common/entity/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'addresses' })
export class Address extends AbstractEntity {
  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  administrativeArea: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;
}
