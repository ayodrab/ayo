/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Theme = 'motion' | 'facilitation';

export interface BaseComponentProps {
  theme: Theme;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'quote' | 'deliverables';
  title?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  images?: string[];
  video?: string;
  videoPoster?: string;
  vimeo?: string;
  layout?: 'full' | 'side-by-side' | 'inset' | 'two-column';
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'motion' | 'facilitation';
  tags: string[];
  year: string;
  client: string;
  role: string;
  color: string;
  longDescription: string;
  outcome: string;
  deliverables: string[];
  image: string;
  coverVimeo?: string;
  coverVideo?: string;
  hoverVideo?: string;
  thumbnailTimePercent?: number;
  galleryImages?: string[];
  blocks?: ContentBlock[];
}

