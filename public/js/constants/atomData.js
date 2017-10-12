//Add a defition for each atom here
//typeName - should match name in thrift definition
//fullName - The human readable name (Don't include "Atom")
//description - A brief description of what they are and when you use them
//editorUri - a lodash template that will be passed gutoolsDomain, atomId, atomType
//createUri - a lodash template that will be passed gutoolsDomain.
//statsUrl - a lodash template that will be passed atomId, atomType


import {PropTypes} from 'react';
import _template from 'lodash/fp/template';
import {logInfo} from '../util/logger';
import { getStore } from '../util/storeAccessor';


export const cta = {
  type: "cta",
  fullName: "Call To Action",
  description: "A call to action designed for use in GLabs Hosted Content",
};

export const recipe = {
  type: "recipe",
  fullName: "Recipe",
  description: "Structured recipes for better website presentation within articles",
};

export const storyQuestions = {
  type: "storyquestions",
  fullName: "Reader Questions",
  description: "Pose further questions to the audience and gather interest",
  statsUrl: _template("https://dashboard.ophan.co.uk/interaction/storyQuestions?days=7&platform=all&atom-id=${atomId}")
};

export const quiz = {
  type: "quiz",
  fullName: "Quiz",
  description: "Questions and Answer format, allowing both knowledge and personality type quizzes",
  editorUri: _template("https://quizzes.${gutoolsDomain}/quiz/${atomId}"),
  createUri: _template("https://quizzes.${gutoolsDomain}")
};

export const media = {
  type: "media",
  fullName: "Video",
  description: "A Guardian produced video, with rich tracking and thumbnail. Generally hosted on YouTube",
  editorUri: _template("https://video.${gutoolsDomain}/videos/${atomId}"),
  createUri: _template("https://video.${gutoolsDomain}/videos/create")
};

export const qa = {
  type: "qanda",
  fullName: "Q & A",
  description: "Provide readers with the answers to their questions"
};

export const guide = {
  type: "guide",
  fullName: "Quick Guide",
  description: "A bullet pointed summary of the story so far to get readers up to speed"
};

export const profile = {
  type: "profile",
  fullName: "Profile",
  description: "Give readers the details on important people or organisations related to a story"
};

export const timeline = {
  type: "timeline",
  fullName: "Timeline",
  description: "A series of key events to help readers navigate an ongoing story"
};

export const allAtomTypes = [cta, recipe, storyQuestions, quiz, media, qa, guide, profile, timeline];
export const workshopEditableAtomTypes = [cta, storyQuestions, recipe, qa, guide, profile, timeline];
export const snippetAtomTypes = [qa, guide, profile, timeline];
export function getNonEditableAtomTypes() {
   return allAtomTypes.filter((atomType) => workshopEditableAtomTypes.indexOf(atomType) === -1);
}

export const editableNonSnippetAtomTypes =
  workshopEditableAtomTypes.filter((atomType) => snippetAtomTypes.indexOf(atomType) === -1);

export function getAtomByType(typeString) {
  return allAtomTypes.find((atomData) => atomData.type.toLowerCase() === typeString.toLowerCase());
}

export function isAtomTypeEditable(typeString) {
  const matchingType = workshopEditableAtomTypes.find((atomData) => atomData.type.toLowerCase() === typeString.toLowerCase());
  return !!matchingType;
}

export function getCreateUrlFromAtomType(atomType) {
  if (isAtomTypeEditable(atomType.type)) {
    return `/create/${atomType.type}`;
  } else if (!atomType.createUri) {
    logInfo(`Create URI requested for type ${atomType.type}, none found`);
    return;
  }

  const store = getStore();
  const state = store.getState();

  return atomType.createUri({
    gutoolsDomain: state.config.atomEditorGutoolsDomain
  });
}

//Keep this together with the data
export const AtomTypePropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
});
