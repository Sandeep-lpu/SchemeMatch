import partnersData from '../data/channelPartners.json';

export interface PartnerCoordinates {
  lat: number;
  lng: number;
}

export interface ChannelPartnerData {
  id: string;
  name: string;
  type: 'SCA' | 'PSB' | 'RRB' | 'NBFC-MFI' | 'DIC';
  typeFullName: string;
  state: string;
  district: string;
  pincode: string;
  coordinates: PartnerCoordinates;
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
}

export interface PartnerRoutingRequest {
  userLocation: {
    state?: string;
    district?: string;
    address?: string;
    coordinates?: PartnerCoordinates;
  };
  selectedSchemeId: string;
  selectedSchemeName?: string;
  loanCategory: 'Term Loan' | 'Working Capital' | 'Composite Loan' | 'Micro-Credit';
  loanAmount: number;
  userCategory: string;
  gender?: string;
  tradeType?: string;
}

export interface EvaluatedPartner extends ChannelPartnerData {
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

// Default district coordinate centroids
const DISTRICT_COORDINATES: Record<string, PartnerCoordinates> = {
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 }
};

export class GeoSpatialPartnerRouterService {
  private partners: ChannelPartnerData[];

  constructor() {
    this.partners = partnersData as ChannelPartnerData[];
  }

  /**
   * Haversine formula to compute great-circle distance between two GPS coordinates
   */
  private computeDistanceKm(coord1: PartnerCoordinates, coord2: PartnerCoordinates): number {
    const R = 6371; // Earth's mean radius in km
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  public getAllPartners(): ChannelPartnerData[] {
    return this.partners;
  }

  /**
   * Executes the 7-stage intelligent Geo-Spatial Partner Locator & Router pipeline
   */
  public routePartners(req: PartnerRoutingRequest): PartnerRoutingResult {
    const userDistrict = req.userLocation.district || 'Varanasi';
    const userCoords = req.userLocation.coordinates ||
      DISTRICT_COORDINATES[userDistrict] ||
      { lat: 25.3176, lng: 82.9739 };

    const selectedSchemeId = req.selectedSchemeId || 'pmegp-2026';
    const loanCategory = req.loanCategory || 'Term Loan';
    const loanAmount = req.loanAmount || 150000;
    const userCategory = req.userCategory || 'SC';

    // Evaluate each partner against the criteria matrix
    const evaluated: EvaluatedPartner[] = this.partners.map((partner) => {
      // 1. Distance Calculation
      const distanceKm = this.computeDistanceKm(userCoords, partner.coordinates);

      // 2. Scheme Authorization Check
      // Matches exact ID or partial token (e.g. "pmegp", "vishwakarma", "mudra", "stand-up")
      const isSchemeAuthorized = partner.authorizedSchemes.some((s) => {
        const pScheme = s.toLowerCase();
        const reqScheme = selectedSchemeId.toLowerCase();
        return (
          pScheme === reqScheme ||
          pScheme.includes(reqScheme) ||
          reqScheme.includes(pScheme) ||
          (reqScheme.includes('vishwakarma') && pScheme.includes('vishwakarma')) ||
          (reqScheme.includes('pmegp') && pScheme.includes('pmegp')) ||
          (reqScheme.includes('mudra') && pScheme.includes('mudra')) ||
          (reqScheme.includes('stand-up') && pScheme.includes('stand-up'))
        );
      });

      // 3. Loan Category and Bounds Check
      const handlesLoanCategory = partner.supportedLoanTypes.includes(loanCategory);
      const isLoanAmountWithinBounds =
        loanAmount >= partner.minLoanAmount && loanAmount <= partner.maxLoanAmount;

      // 4. Beneficiary Category Alignment
      const isCategoryAllowed =
        !userCategory ||
        userCategory === 'General' ||
        partner.allowedBeneficiaryCategories.includes(userCategory) ||
        partner.allowedBeneficiaryCategories.includes('General') ||
        partner.allowedBeneficiaryCategories.includes('ArtisanHandicraft') ||
        partner.allowedBeneficiaryCategories.includes('Women');

      // 5. Live Routing SLA / Quota Availability
      const isRoutingEligible = partner.isCurrentlyRoutingEligible;

      // Verification checkmarks payload
      const verificationChecks = {
        authorizedForScheme: isSchemeAuthorized,
        handlesLoanCategory: handlesLoanCategory && isLoanAmountWithinBounds,
        suitableForCategory: isCategoryAllowed,
        eligibleForRouting: isRoutingEligible
      };

      // Decision Classification: 🟢 Recommended | 🟡 Limited | 🔴 Not eligible
      let routingStatus: 'Recommended' | 'Limited' | 'Not eligible' = 'Not eligible';
      let statusBadgeColor: 'green' | 'yellow' | 'red' = 'red';
      let statusReason = '';

      if (isSchemeAuthorized && handlesLoanCategory && isLoanAmountWithinBounds && isCategoryAllowed && isRoutingEligible) {
        routingStatus = 'Recommended';
        statusBadgeColor = 'green';
        statusReason = 'Directly authorized, optimal loan ticket size, and designated nodal officer active.';
      } else if (!isSchemeAuthorized) {
        routingStatus = 'Not eligible';
        statusBadgeColor = 'red';
        statusReason = `Branch is not an authorized desk for ${req.selectedSchemeName || selectedSchemeId}.`;
      } else if (!isLoanAmountWithinBounds) {
        routingStatus = 'Not eligible';
        statusBadgeColor = 'red';
        statusReason = `Required loan (₹${loanAmount.toLocaleString('en-IN')}) is outside branch ceiling (₹${partner.minLoanAmount.toLocaleString('en-IN')} - ₹${partner.maxLoanAmount.toLocaleString('en-IN')}).`;
      } else if (!isRoutingEligible) {
        routingStatus = 'Limited';
        statusBadgeColor = 'yellow';
        statusReason = 'Digital SLA routing paused for current intake; requires in-person physical desk walk-in.';
      } else if (!handlesLoanCategory) {
        routingStatus = 'Limited';
        statusBadgeColor = 'yellow';
        statusReason = `Primarily processes ${partner.supportedLoanTypes.join('/')}; ${loanCategory} requires apex committee review.`;
      } else {
        routingStatus = 'Limited';
        statusBadgeColor = 'yellow';
        statusReason = 'Secondary channel partner. Processing turnaround may exceed primary turnaround.';
      }

      // Google Maps direction URL
      const destName = encodeURIComponent(`${partner.name}, ${partner.branchName}`);
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${partner.coordinates.lat},${partner.coordinates.lng}&query=${destName}`;

      return {
        ...partner,
        distanceKm,
        routingStatus,
        statusBadgeColor,
        statusReason,
        verificationChecks,
        directionsUrl
      };
    });

    // Rank partners: Recommended first (sorted by distance ascending), then Limited (by distance), then Not eligible
    const statusPriority = {
      'Recommended': 1,
      'Limited': 2,
      'Not eligible': 3
    };

    evaluated.sort((a, b) => {
      const priorityDiff = statusPriority[a.routingStatus] - statusPriority[b.routingStatus];
      if (priorityDiff !== 0) return priorityDiff;
      return a.distanceKm - b.distanceKm;
    });

    const recommendedPartner = evaluated.find((p) => p.routingStatus === 'Recommended') || null;

    return {
      decisionPipeline: {
        userLocation: `${userDistrict}, ${req.userLocation.state || 'Uttar Pradesh'}`,
        selectedScheme: req.selectedSchemeName || selectedSchemeId,
        loanCategory,
        loanAmount,
        authorizedPartnersCount: evaluated.filter((p) => p.verificationChecks.authorizedForScheme).length,
        recommendedPartnersCount: evaluated.filter((p) => p.routingStatus === 'Recommended').length
      },
      recommendedPartner,
      allRankedPartners: evaluated,
      evaluatedAt: new Date().toISOString()
    };
  }
}
