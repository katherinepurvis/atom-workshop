//Add a defition for each atom here
//typeName - should match name in thrift definition
//fullName - The human readable name (Don't include "Atom")
//description - A brief description of what they are and when you use them

export const cta = {
  type: "cta",
  fullName: "Call To Action",
  description: "A call to action designed for use in GLabs Hosted Content",
};

export const explainer = {
  type: "explainer",
  fullName: "Explainer Text",
  description: "Provide extra context to any article with an Explainer Text Box",
};

export const recipe = {
  type: "recipe",
  fullName: "Recipe",
  description: "Structured recipes for better website presentation within articles",
};

export const allAtomTypes = [cta, explainer, recipe];

export function getAtomByType(type) {
  return allAtomTypes.filter((atomData) => atomData.type.toLowerCase() === type.toLowerCase())[0]
}
