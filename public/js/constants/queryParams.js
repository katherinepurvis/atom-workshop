import {workshopEditableAtomTypes} from '../atomData';

export const searchParams = {
  types: workshopEditableAtomTypes.map(atom => atom.type),
  "page-size": "20",
  q: "",
  searchFields: "data.title,data.label,title,labels,data.body"
};
