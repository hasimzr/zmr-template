export interface SignUpBannerData {
  signUpBannerIsShow: string;
  signUpBannerBgColor: string;
  signUpBannerTitle: string;
  signUpBannerDescription1: string;
  signUpBannerDescription2: string;
  signUpBannerPrimaryButtonIsShow: string;
  signUpBannerPrimaryButtonText: string;
  signUpBannerPrimaryButtonLink: string;
  signUpBannerSecondaryButtonIsShow: string;
  signUpBannerSecondaryButtonText: string;
  signUpBannerSecondaryButtonLink: string;
}

export const fallbackSignUpBannerData: SignUpBannerData = {
  signUpBannerIsShow: "true",
  signUpBannerBgColor: "#1890ff",
  signUpBannerTitle: "Üye Değil Misiniz?",
  signUpBannerDescription1: "Hemen üye olun, büyük avantajlardan yararlanın.",
  signUpBannerDescription2: "Elektronik dünyasına adım atın!",
  signUpBannerPrimaryButtonIsShow: "true",
  signUpBannerPrimaryButtonText: "Hemen Üye Ol",
  signUpBannerPrimaryButtonLink: "/register",
  signUpBannerSecondaryButtonIsShow: "true",
  signUpBannerSecondaryButtonText: "Ürünleri İncele",
  signUpBannerSecondaryButtonLink: "/products",
};
