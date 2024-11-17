import {
  Area,
  City,
  State,
} from 'src/app/auth/signup/models/address.structure';

export interface EditAddressPageState {
  states: State[];
  cities: City[];
  areas: Area[];
}
