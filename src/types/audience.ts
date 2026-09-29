/**
 * Audience segment profiles and behavioral characteristics.
 */

export interface AudiencePainPoint {
  id: string;
  description: string;
  resonanceScore: number; // 1 - 10
}

export interface AudienceProfile {
  id: string;
  brandId: string;
  name: string;
  roleOrPersona: string;
  demographics: {
    ageRange: string;
    geography: string;
    experienceLevel: string;
  };
  painPoints: AudiencePainPoint[];
  preferredChannels: string[];
  resonanceTopics: string[];
  receptivityScore: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}
