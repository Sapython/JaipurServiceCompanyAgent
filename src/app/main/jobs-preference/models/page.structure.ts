import { Area } from 'src/app/auth/signup/models/address.structure';

export interface JobsPreferencePageState {
  areaWiseCatlog : Area[];
  selectedCategories: {
    categoryId: string;
    subCategoryId: string;
    areaId : string,
    serviceCatalogue : string
  }[];
  selectedAreas: {
    stateId: string;
    cityId: string;
    areaId: string;
    serviceCatalogue : string;
  }[];
  loadingAreaWiseCatlog: boolean;
}
