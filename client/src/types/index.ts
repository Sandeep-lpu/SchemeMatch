export type SocialCategory = 'SC' | 'ST' | 'OBC' | 'General' | 'Minority' | 'SafaiKaramchari' | 'DNT' | '';
export type Gender = 'Male' | 'Female' | 'Transgender' | 'Other' | '';
export type LocationType = 'Rural' | 'Urban' | 'Semi-Urban' | '';
export type EnterpriseStage = 'Ideation' | 'NewEnterprise' | 'ExistingExpansion';
export type SectorType = 
  | 'Manufacturing' 
  | 'Services' 
  | 'Trading' 
  | 'ArtisanHandicraft' 
  | 'AgroAllied' 
  | 'StreetVending' 
  | 'Sanitation' 
  | 'Textiles'
  | '';

export type EducationLevel = 
  | 'Below8th' 
  | '8thPass' 
  | '10thPass' 
  | '12thPass' 
  | 'Graduate' 
  | 'PostGraduate' 
  | 'VocationalITI';

export interface UserProfile {
  id?: string;
  fullName: string;
  age: number;
  gender: Gender;
  category: SocialCategory;
  isDifferentlyAbled: boolean;
  disabilityPercentage?: number;
  isSafaiKaramchariDependent?: boolean;
  isMinority?: boolean;
  minorityCommunity?: string;
  locationType: LocationType;
  state: string;
  district?: string;
  annualFamilyIncome: number;
  educationLevel: EducationLevel;
  
  // Business fields
  enterpriseStage: EnterpriseStage;
  sector: SectorType;
  businessName?: string;
  businessDescription?: string;
  requiredLoanAmount: number;
  totalProjectCost: number;
  promoterContributionAvailable: number;
  hasExistingUdyam: boolean;
  hasCasteCertificate: boolean;
  hasBankStatement6Months: boolean;
  hasLandOrRentDeed: boolean;
  hasSkillTrainingCertificate: boolean;
  hasProjectReport: boolean;
  tradeType?: string;
}

export interface Scheme {
  id: string;
  name: string;
  hindiName: string;
  ministry: string;
  apexBody: string;
  categoryTag: string;
  summary: string;
  hindiSummary: string;
  detailedOverview: string;
  targetGroups: string[];
  minLoanAmount: number;
  maxLoanAmount: number;
  subsidyRate: {
    generalUrban?: number;
    generalRural?: number;
    specialUrban?: number;
    specialRural?: number;
    maxSubsidyAmount?: number;
  };
  promoterContributionMinPercent: {
    general: number;
    specialCategory: number;
  };
  interestRatePerAnnum: string;
  interestSubventionPercent?: number;
  moratoriumPeriodMonths: number;
  repaymentTenureYears: number;
  collateralRequirement: string;
  eligibility: {
    allowedCategories: SocialCategory[];
    allowedGenders: Gender[];
    minAge: number;
    maxAge: number;
    incomeCeilingAnnual?: number;
    requiredEducation?: EducationLevel;
    allowedSectors: SectorType[];
    allowedLocations: LocationType[];
    requiresDisability?: boolean;
    requiresSafaiKaramchari?: boolean;
    artisanTradesOnly?: boolean;
  };
  mandatoryDocuments: string[];
  recommendedDocuments: string[];
  officialPortalUrl: string;
  applicationMode: string;
  nodalAgency: string;
  averageProcessingDays: number;
  keyHighlights: string[];
  hindiKeyHighlights: string[];
}

export interface SchemeMatchResult {
  scheme: Scheme;
  matchScore: number;
  isEligible: boolean;
  categoryFit: 'High' | 'Medium' | 'Low' | 'Ineligible';
  financialFit: 'Excellent' | 'Good' | 'Fair' | 'Stretch';
  estimatedSubsidyAmount: number;
  estimatedLoanAmount: number;
  estimatedOwnContribution: number;
  estimatedMonthlyEmi: number;
  reasonsWhyMatched: string[];
  conditionsToFulfill: string[];
  missingDocuments: string[];
  subsidyOptimizationTip?: string;
}

export interface PersonaProfile extends UserProfile {
  id: string;
  avatarEmoji: string;
  headline: string;
  tagline: string;
  story: string;
}

export interface DprRequest {
  businessName: string;
  sector: SectorType;
  tradeType: string;
  locationType: LocationType;
  category: SocialCategory;
  gender: Gender;
  machineryAndEquipmentCost: number;
  workspaceOrCivilCost: number;
  workingCapitalNeeds: number;
  contingencyBuffer: number;
  expectedMonthlyRevenue: number;
  expectedMonthlyOperatingCost: number;
  targetSchemeId?: string;
}

export interface DprFinancialModel {
  summary: {
    businessName: string;
    sector: SectorType;
    tradeType: string;
    category: SocialCategory;
    gender: Gender;
    locationType: LocationType;
    totalProjectCost: number;
    capitalExpenditure: number;
    workingCapital: number;
    promoterContribution: number;
    promoterContributionPercent: number;
    subsidyEligible: number;
    subsidyPercent: number;
    termLoanRequired: number;
    workingCapitalLoanRequired: number;
    totalBankLoan: number;
  };
  repaymentSchedule: {
    interestRatePercent: number;
    tenureYears: number;
    moratoriumMonths: number;
    monthlyEmi: number;
    annualDebtService: number;
  };
  projectionsThreeYears: Array<{
    year: number;
    projectedSales: number;
    costOfMaterials: number;
    directWages: number;
    utilitiesAndRent: number;
    grossProfit: number;
    interestExpense: number;
    depreciation: number;
    netProfitBeforeTax: number;
    taxProvision: number;
    netProfitAfterTax: number;
    dscr: number;
  }>;
  viabilityMetrics: {
    averageDscr: number;
    breakEvenSalesAnnual: number;
    breakEvenPercentage: number;
    paybackPeriodYears: number;
    returnOnInvestmentPercent: number;
    bankViabilityVerdict: 'Highly Bankable' | 'Bankable with Margin Support' | 'Needs Risk Mitigation';
  };
}

export interface DocumentVerificationItem {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  importance: 'Mandatory' | 'Recommended' | 'Bonus';
  status: 'Uploaded' | 'Missing' | 'Verified' | 'ActionNeeded';
  howToGet: string;
  issuingAuthority: string;
  onlinePortalUrl?: string;
  estimatedDaysToAcquire: number;
}

export interface DocumentReadinessReport {
  overallScore: number;
  readinessLevel: 'Bank Ready' | 'Near Ready' | 'Documentation In Progress' | 'Immediate Action Needed';
  verifiedCount: number;
  totalCount: number;
  documents: DocumentVerificationItem[];
  criticalGaps: string[];
  actionPlan: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
  timestamp: string;
  matchedSchemes?: Array<{
    id: string;
    name: string;
    subsidyHighlight: string;
  }>;
  suggestedPrompts?: string[];
  extractedProfileUpdates?: Partial<UserProfile>;
}

export type SupportedLanguage = 'en' | 'hi' | 'te' | 'mr' | 'bn' | 'pa';

export interface EvaluatedPartner {
  id: string;
  name: string;
  type: 'SCA' | 'PSB' | 'RRB' | 'NBFC-MFI' | 'DIC';
  typeFullName: string;
  state: string;
  district: string;
  pincode: string;
  coordinates: { lat: number; lng: number };
  branchName: string;
  nodalOfficer: string;
  phone: string;
  email: string;
  address: string;
  authorizedSchemes: string[];
  supportedLoanTypes: string[];
  minLoanAmount: number;
  maxLoanAmount: number;
  allowedBeneficiaryCategories: string[];
  isCurrentlyRoutingEligible: boolean;
  approvalRate: number;
  avgSanctionDays: number;
  specialFeatures: string[];
  distanceKm: number;
  routingStatus: 'Recommended' | 'Limited' | 'Not eligible';
  statusBadgeColor: 'green' | 'yellow' | 'red';
  statusReason: string;
  verificationChecks: {
    authorizedForScheme: boolean;
    handlesLoanCategory: boolean;
    suitableForCategory: boolean;
    eligibleForRouting: boolean;
  };
  directionsUrl: string;
}

export interface PartnerRoutingResult {
  decisionPipeline: {
    userLocation: string;
    selectedScheme: string;
    loanCategory: string;
    loanAmount: number;
    authorizedPartnersCount: number;
    recommendedPartnersCount: number;
  };
  recommendedPartner: EvaluatedPartner | null;
  allRankedPartners: EvaluatedPartner[];
  evaluatedAt: string;
}
