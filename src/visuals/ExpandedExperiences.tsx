import React from 'react';
import definitions from './expanded-lessons.json';
import ExpandedLab, { ExpandedDefinition } from './ExpandedLabs';
import { expandedAssets } from './expandedAssets';

export const expandedDefinitions = definitions as ExpandedDefinition[];
function experience(lesson: ExpandedDefinition) {
  const assets = expandedAssets[lesson.slug];
  const illustrations = lesson.steps.map((step, i) => ({ source: assets.frames[i], title: `${i + 1} · ${step.title}`, alt: step.alt }));
  const transcript = lesson.steps.map(step => `${step.title}. ${step.caption} ${step.coach}`);
  return {
    title: lesson.title, description: lesson.description,
    Widget: () => <ExpandedLab lesson={lesson} />,
    image: assets.frames[0], video: assets.video, alt: lesson.steps[0].alt,
    transcript, illustrations,
    clips: [{ source: assets.video, title: lesson.title, transcript, chapters: lesson.steps.map((step, i) => ({ title: step.title, seconds: i * 8 })) }],
  };
}
export const EXTRA_EXPERIENCES = Object.fromEntries(expandedDefinitions.flatMap(lesson => lesson.links.map(link => [`${link.track}:${link.id}`, experience(lesson)])));
