import { Scheme, UserProfile, SchemeMatchResult } from '../types';

export class SchemeMatchingEngine {
  private schemes: Scheme[];

  constructor(schemes: Scheme[]) {
    this.schemes = schemes;
  }

  public matchSchemes(profile: UserProfile): SchemeMatchResult[] {
    const results: SchemeMatchResult[] = this.schemes.map((scheme) => {
      return this.evaluateScheme(profile, scheme);
    });

    // Sort by match score descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  public getSchemeById(id: string): Scheme | undefined {
    return this.schemes.find((s) => s.id === id);
  }

  private evaluateScheme(profile: UserProfile, scheme: Scheme): SchemeMatchResult {
    let score = 0;
    const reasonsWhyMatched: string[] = [];
    const conditionsToFulfill: string[] = [];
    const missingDocuments: string[] = [];
    let isEligible = true;

    // 1. HARD DEMOGRAPHIC CRITERIA
    // Category check
    const hasCategory = Boolean(profile.category);
    const isSpecialCategory = hasCategory && ['SC', 'ST', 'OBC', 'SafaiKaramchari', 'DNT'].includes(profile.category);
    
    // Check if category is allowed, or if category is not yet specified whether the scheme is open/universal
    const isUniversalScheme = scheme.eligibility.allowedCategories.includes('General') || scheme.eligibility.allowedCategories.length >= 4;
    const isCategoryAllowed = !hasCategory ? isUniversalScheme : scheme.eligibility.allowedCategories.includes(profile.category);

    if (!isCategoryAllowed) {
      isEligible = false;
      if (!hasCategory) {
        conditionsToFulfill.push(`Scheme is reserved for ${scheme.eligibility.allowedCategories.join(', ')}. Specify your caste category to verify eligibility.`);
      } else {
        conditionsToFulfill.push(`Scheme is exclusively for ${scheme.eligibility.allowedCategories.join(', ')} categories.`);
      }
    } else {
      score += 25;
      if (hasCategory && scheme.targetGroups.includes(profile.category)) {
        score += 10;
        reasonsWhyMatched.push(`Prioritized beneficiary: Target demographic matches your ${profile.category} category.`);
      } else if (!hasCategory) {
        reasonsWhyMatched.push('Open National Scheme: Available to micro-entrepreneurs across social categories.');
        conditionsToFulfill.push('Caste category not specified in query. Select SC/ST/OBC in Profile to unlock up to 35% MoSJE special subsidies.');
      }
    }

    // Gender check
    const hasGender = Boolean(profile.gender);
    const isGenderAllowed = !hasGender || scheme.eligibility.allowedGenders.includes(profile.gender);
    if (!isGenderAllowed) {
      isEligible = false;
      conditionsToFulfill.push(`Scheme is dedicated exclusively to ${scheme.eligibility.allowedGenders.join('/')} applicants.`);
    } else {
      score += 10;
      if (profile.gender === 'Female' && scheme.targetGroups.includes('Women')) {
        score += 5;
        reasonsWhyMatched.push(`Special gender incentive: Additional subsidy / concessional interest rate applies for Women.`);
      }
    }

    // Safai Karamchari specific
    if (scheme.eligibility.requiresSafaiKaramchari) {
      if (!profile.isSafaiKaramchariDependent && profile.category !== 'SafaiKaramchari') {
        isEligible = false;
        conditionsToFulfill.push('Reserved exclusively for sanitation workers, manual scavengers, and their direct dependents.');
      } else {
        score += 20;
        reasonsWhyMatched.push('Direct beneficiary under NSKFDC rehabilitation initiative with high capital grant.');
      }
    }

    // Differently-Abled (Divyangjan) specific
    if (scheme.eligibility.requiresDisability) {
      if (!profile.isDifferentlyAbled || (profile.disabilityPercentage && profile.disabilityPercentage < 40)) {
        isEligible = false;
        conditionsToFulfill.push('Requires benchmark disability certification (minimum 40% as recognized under UDID).');
      } else {
        score += 20;
        reasonsWhyMatched.push('Dedicated Divyangjan empowerment scheme with concessional 5%-8% credit and assistive provisions.');
      }
    } else if (profile.isDifferentlyAbled && scheme.targetGroups.includes('DifferentlyAbled')) {
      score += 5;
      reasonsWhyMatched.push('PwD applicants receive prioritized task force appraisal and relaxations.');
    }

    // Age bounds
    if (profile.age && (profile.age < scheme.eligibility.minAge || profile.age > scheme.eligibility.maxAge)) {
      isEligible = false;
      conditionsToFulfill.push(`Applicant age must be between ${scheme.eligibility.minAge} and ${scheme.eligibility.maxAge} years (Current age: ${profile.age}).`);
    } else {
      score += 5;
    }

    // Income ceiling check (MoSJE schemes e.g. NSFDC / NBCFDC / VISVAS <= ₹3 Lakh)
    if (scheme.eligibility.incomeCeilingAnnual && scheme.eligibility.incomeCeilingAnnual > 0 && profile.annualFamilyIncome > 0) {
      if (profile.annualFamilyIncome > scheme.eligibility.incomeCeilingAnnual) {
        isEligible = false;
        conditionsToFulfill.push(
          `Annual household income ceiling is ₹${scheme.eligibility.incomeCeilingAnnual.toLocaleString('en-IN')}/year. Current stated income: ₹${profile.annualFamilyIncome.toLocaleString('en-IN')}.`
        );
      } else {
        score += 10;
        reasonsWhyMatched.push(`Income eligibility verified: Family income ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} is within the limit.`);
      }
    } else {
      score += 5;
    }

    // Sector & Trade Check
    const tradeLower = (profile.tradeType || '').toLowerCase();
    const isTailor = tradeLower.includes('tailor') || tradeLower.includes('darzi') || tradeLower.includes('stitching') || tradeLower.includes('garment');

    const isSectorAllowed = !profile.sector || 
      scheme.eligibility.allowedSectors.includes(profile.sector) || 
      (isTailor && (scheme.eligibility.allowedSectors.includes('Textiles') || scheme.eligibility.allowedSectors.includes('Services') || scheme.eligibility.allowedSectors.includes('ArtisanHandicraft')));

    if (!isSectorAllowed) {
      score -= 15;
      conditionsToFulfill.push(`Scheme focuses on ${scheme.eligibility.allowedSectors.join(', ')}. Current sector is ${profile.sector}.`);
    } else {
      score += 15;
      if (profile.sector) {
        reasonsWhyMatched.push(`Sector fit: Project sector (${profile.sector}) is fully eligible.`);
      }
    }

    // Artisan / Traditional Trades check (PM Vishwakarma covers 18 traditional trades including Darzi/Tailor!)
    if (scheme.eligibility.artisanTradesOnly) {
      if (isTailor || profile.sector === 'ArtisanHandicraft' || profile.sector === 'Textiles') {
        score += 20;
        if (isTailor) {
          reasonsWhyMatched.push('Recognized PM Vishwakarma Trade: Darzi / Tailoring is officially recognized with ₹15,000 modern toolkit grant and 5% credit.');
        } else {
          reasonsWhyMatched.push('Artisanal craft verified: Includes ₹15,000 toolkit voucher and 5% interest subvention.');
        }
      } else {
        isEligible = false;
        conditionsToFulfill.push('Applicable strictly to one of the 18 recognized traditional artisan / craft trades.');
      }
    }

    // Location Check (Rural vs Urban)
    const hasLocation = Boolean(profile.locationType);
    if (hasLocation && !scheme.eligibility.allowedLocations.includes(profile.locationType)) {
      isEligible = false;
      conditionsToFulfill.push(`Limited to ${scheme.eligibility.allowedLocations.join(', ')} areas.`);
    } else {
      score += 5;
      if (!hasLocation) {
        conditionsToFulfill.push('Location type not specified: Defaults to urban/semi-urban rates. Specifying Rural can boost PMEGP subsidy to 35%.');
      }
    }

    // 2. FINANCIAL LOAN SIZE FIT
    const effectiveProjectCost = profile.totalProjectCost || (profile.requiredLoanAmount ? Math.round(profile.requiredLoanAmount * 1.15) : 100000);
    const requiredLoan = profile.requiredLoanAmount || Math.round(effectiveProjectCost * 0.9);

    if (requiredLoan >= scheme.minLoanAmount && requiredLoan <= scheme.maxLoanAmount) {
      score += 15;
      reasonsWhyMatched.push(`Capital scale match: Required amount of ₹${requiredLoan.toLocaleString('en-IN')} fits comfortably within scheme limit (₹${scheme.minLoanAmount.toLocaleString('en-IN')} - ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}).`);
    } else if (requiredLoan < scheme.minLoanAmount) {
      score += 5;
      conditionsToFulfill.push(`Your loan need (₹${requiredLoan.toLocaleString('en-IN')}) is below minimum scheme threshold (₹${scheme.minLoanAmount.toLocaleString('en-IN')}). Consider bundling additional tools or working capital.`);
    } else {
      score -= 10;
      conditionsToFulfill.push(`Required loan (₹${requiredLoan.toLocaleString('en-IN')}) exceeds scheme maximum ceiling (₹${scheme.maxLoanAmount.toLocaleString('en-IN')}).`);
    }

    // Promoter margin check
    const requiredMarginPct = isSpecialCategory || profile.gender === 'Female'
      ? scheme.promoterContributionMinPercent.specialCategory
      : scheme.promoterContributionMinPercent.general;
    const requiredMarginAmount = Math.round((effectiveProjectCost * requiredMarginPct) / 100);
    const availableMargin = profile.promoterContributionAvailable ?? Math.round(effectiveProjectCost * 0.05);

    if (availableMargin >= requiredMarginAmount) {
      score += 5;
      reasonsWhyMatched.push(`Margin Money: Available promoter contribution (₹${availableMargin.toLocaleString('en-IN')}) meets or exceeds the required ${requiredMarginPct}%.`);
    } else {
      conditionsToFulfill.push(`Minimum promoter contribution needed is ${requiredMarginPct}% (₹${requiredMarginAmount.toLocaleString('en-IN')}). Available stated: ₹${availableMargin.toLocaleString('en-IN')}.`);
    }

    // Educational qualification checks
    if (scheme.eligibility.requiredEducation === '8thPass') {
      if (profile.totalProjectCost > 1000000 && profile.sector === 'Manufacturing' && profile.educationLevel === 'Below8th') {
        conditionsToFulfill.push('PMEGP guidelines require minimum 8th standard pass certificate for manufacturing projects exceeding ₹10 Lakhs.');
        score -= 10;
      }
    }

    // 3. DOCUMENTATION FIT & GAPS
    if (['SC', 'ST', 'OBC'].includes(profile.category) && !profile.hasCasteCertificate) {
      missingDocuments.push('Caste / Community Certificate');
      conditionsToFulfill.push('Must obtain official Caste Certificate from Tehsildar / State e-District portal.');
    }
    if (!profile.hasExistingUdyam && scheme.id !== 'pm-svanidhi' && scheme.id !== 'pm-vishwakarma') {
      missingDocuments.push('Udyam MSME Registration (Free online in 10 mins)');
    }
    if (!profile.hasProjectReport && requiredLoan > 200000) {
      missingDocuments.push('Detailed Project Report (DPR) - Can generate via SchemeMatch DPR tool');
    }
    if (!profile.hasBankStatement6Months) {
      missingDocuments.push('6 Months Bank Statement / Passbook');
    }

    // Document score adjustments
    if (missingDocuments.length === 0) {
      score += 10;
      reasonsWhyMatched.push('Document readiness: You hold primary required documents for immediate loan appraisal.');
    } else {
      score -= missingDocuments.length * 2;
    }

    // Calculate Subsidy Estimates
    let subsidyPct = 0;
    if (isSpecialCategory || profile.gender === 'Female' || profile.isDifferentlyAbled) {
      subsidyPct = profile.locationType === 'Rural'
        ? (scheme.subsidyRate.specialRural ?? scheme.subsidyRate.generalRural ?? 0)
        : (scheme.subsidyRate.specialUrban ?? scheme.subsidyRate.generalUrban ?? 0);
    } else {
      subsidyPct = profile.locationType === 'Rural'
        ? (scheme.subsidyRate.generalRural ?? 0)
        : (scheme.subsidyRate.generalUrban ?? 0);
    }

    let estimatedSubsidyAmount = Math.round((effectiveProjectCost * subsidyPct) / 100);
    if (scheme.id === 'pm-vishwakarma') {
      // PM Vishwakarma provides ₹15,000 toolkit e-voucher grant + 8% interest subvention
      estimatedSubsidyAmount = Math.max(estimatedSubsidyAmount, 15000);
    }
    if (scheme.subsidyRate.maxSubsidyAmount && estimatedSubsidyAmount > scheme.subsidyRate.maxSubsidyAmount) {
      estimatedSubsidyAmount = scheme.subsidyRate.maxSubsidyAmount;
    }

    // Promoter contribution
    const estimatedOwnContribution = Math.round((profile.totalProjectCost * requiredMarginPct) / 100);

    // Loan amount
    const estimatedLoanAmount = Math.max(0, profile.totalProjectCost - estimatedOwnContribution - estimatedSubsidyAmount);

    // Rough Monthly EMI calculation (assumes 9% p.a. average over scheme tenure)
    const annualRate = 0.085; // 8.5%
    const monthlyRate = annualRate / 12;
    const totalMonths = scheme.repaymentTenureYears * 12;
    let estimatedMonthlyEmi = 0;
    if (estimatedLoanAmount > 0 && totalMonths > 0) {
      estimatedMonthlyEmi = Math.round(
        (estimatedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
    }

    // Subsidy Optimization Tip
    let subsidyOptimizationTip = '';
    if (scheme.id === 'pmegp-2026') {
      if (profile.locationType === 'Urban') {
        subsidyOptimizationTip = `💡 Subsidy Maximizer: Setting up your unit in an adjacent rural gram panchayat increases your government capital grant from 25% (₹${Math.round(effectiveProjectCost * 0.25).toLocaleString('en-IN')}) to 35% (₹${Math.round(effectiveProjectCost * 0.35).toLocaleString('en-IN')}) — an extra ₹${Math.round(effectiveProjectCost * 0.10).toLocaleString('en-IN')} in free grant!`;
      } else {
        subsidyOptimizationTip = '🌟 Maximum Subsidy Active: You are receiving the highest 35% government capital grant for rural marginalized entrepreneurs under PMEGP!';
      }
    } else if (scheme.id === 'visvas-scheme') {
      subsidyOptimizationTip = '💡 Stack Benefit: VISVAS gives you a 5% direct interest refund quarterly. If your bank charges 9%, your net effective interest rate becomes only 4%!';
    } else if (scheme.id === 'stand-up-india') {
      subsidyOptimizationTip = '💡 Credit Guarantee: You are eligible for 85% credit guarantee without any third-party guarantor or personal property collateral under CGFSI.';
    }

    // Clamp score
    const finalScore = Math.max(10, Math.min(99, isEligible ? Math.round(score) : Math.min(score, 45)));

    // Categorization
    let categoryFit: 'High' | 'Medium' | 'Low' | 'Ineligible' = 'Low';
    if (!isEligible) categoryFit = 'Ineligible';
    else if (finalScore >= 80) categoryFit = 'High';
    else if (finalScore >= 60) categoryFit = 'Medium';

    let financialFit: 'Excellent' | 'Good' | 'Fair' | 'Stretch' = 'Good';
    if (requiredLoan >= scheme.minLoanAmount && requiredLoan <= scheme.maxLoanAmount) financialFit = 'Excellent';
    else if (requiredLoan > scheme.maxLoanAmount) financialFit = 'Stretch';

    return {
      scheme,
      matchScore: finalScore,
      isEligible,
      categoryFit,
      financialFit,
      estimatedSubsidyAmount,
      estimatedLoanAmount,
      estimatedOwnContribution,
      estimatedMonthlyEmi,
      reasonsWhyMatched,
      conditionsToFulfill,
      missingDocuments,
      subsidyOptimizationTip: subsidyOptimizationTip || undefined
    };
  }
}
