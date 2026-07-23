/**
 * Shared scene vocabulary. The five camera stations and the seven frames are named
 * exactly as the motion system and wireframe name them — no synonyms.
 */

// The camera has stations, not freedom (Motion System Part 4).
export type StationId = 'iso' | 'plan' | 'elevation' | 'section' | 'detail';

// The seven frames of the homepage film (Wireframe F01–F07).
export type FrameId = 'F01' | 'F02' | 'F03' | 'F04' | 'F05' | 'F06' | 'F07';

// The degradation ladder (Motion System Part 13 / ARCHITECTURE Part 3).
//  1 full · 2 reduced · 3 static · 4 minimal
export type Capability = 1 | 2 | 3 | 4;
