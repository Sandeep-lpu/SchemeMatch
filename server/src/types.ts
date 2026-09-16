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
  minorityCommunity?: 'Muslim' | 'Christian' | 'Sikh' | 'Buddhist' | 'Jain' | 'Parsi' | 'None';
  locationType: LocationType;
  state: string;
  district?: string;
  annualFamilyIncome: number; // in INR
  educationLevel: EducationLevel;
  
  // Business attributes
  enterpriseStage: EnterpriseStage;
  sector: SectorType;
  businessName?: string;
  businessDescription?: string;
  requiredLoanAmount: number; // in INR
  totalProjectCost: number; // in INR
  promoterContributionAvailable: number; // in INR
  hasExistingUdyam: boolean;
  hasCasteCertificate: boolean;
  hasBankStatement6Months: boolean;
  hasLandOrRentDeed: boolean;
  hasSkillTrainingCertificate: boolean;
  hasProjectReport: boolean;
  tradeType?: string; // e.g. "Carpenter", "Tailor", "Potter", "Food Cart", etc.
}

export interface Scheme {
  id: string;
  name: string;
  hindiName: string;
  ministry: string;
  apexBody: string; // e.g. "NSFDC", "NSTFDC", "NBCFDC", "NSKFDC", "NDFDC", "KVIC", "SIDBI", "MoHUA"
  categoryTag: string; // e.g. "MoSJE Apex", "Credit & Subsidy", "Street Vendor", "Artisan"
  summary: string;
  hindiSummary: string;
  detailedOverview: string;
  targetGroups: string[]; // ["SC", "Women", "Rural", "Artisan"]
  
  // Financial Parameters
  minLoanAmount: number;
  maxLoanAmount: number;
  subsidyRate: {
    generalUrban?: number;
    generalRural?: number;
    specialUrban?: number; // SC/ST/OBC/Women/PwD in urban
    specialRural?: number; // SC/ST/OBC/Women/PwD in rural
    maxSubsidyAmount?: number;
  };
  promoterContributionMinPercent: {
    general: number;
    specialCategory: number;
  };
  interestRatePerAnnum: string; // e.g. "4% - 6% p.a."
  interestSubventionPercent?: number; // e.g. 5% under VISVAS
  moratoriumPeriodMonths: number;
  repaymentTenureYears: number;
  collateralRequirement: 'Nil / Collateral-Free' | 'CGTMSE Guarantee' | 'Hypothecation of Assets' | 'Standard Bank Norms';
  
  // Eligibility criteria checks
  eligibility: {
    allowedCategories: SocialCategory[];
    allowedGenders: Gender[];
    minAge: number;
    maxAge: number;
    incomeCeilingAnnual?: number; // 0 or null if no ceiling
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
  applicationMode: 'Online Portal' | 'District Industries Centre (DIC)' | 'State Channelizing Agency (SCA)' | 'Bank Branch';
  nodalAgency: string;
  averageProcessingDays: number;
  keyHighlights: string[];
  hindiKeyHighlights: string[];
}

export interface SchemeMatchResult {
  scheme: Scheme;
  matchScore: number; // 0 to 100
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

export interface DprRequest {
  businessName: string;
  sector: SectorType;
  tradeType: string;
  locationType: LocationType;
  category: SocialCategory;
  gender: Gender;
  machineryAndEquipmentCost: number;
  workspaceOrCivilCost: number;
  workingCapitalNeeds: number; // for 2-3 months raw materials/wages
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
    promoterContribution: number; // INR
    promoterContributionPercent: number; // %
    subsidyEligible: number; // INR
    subsidyPercent: number; // %
    termLoanRequired: number; // INR
    workingCapitalLoanRequired: number; // INR
    totalBankLoan: number; // INR
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
    dscr: number; // Debt Service Coverage Ratio
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
  overallScore: number; // 0 - 100%
  readinessLevel: 'Bank Ready' | 'Near Ready' | 'Documentation In Progress' | 'Immediate Action Needed';
  verifiedCount: number;
  totalCount: number;
  documents: DocumentVerificationItem[];
  criticalGaps: string[];
  actionPlan: string[];
}
