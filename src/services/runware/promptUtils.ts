
import { AgeGroup } from "./types";

/**
 * Enhances a user's prompt with age-specific details and formatting for coloring pages
 */
export function enhancePrompt(prompt: string, ageGroup?: AgeGroup, model?: string): string {
  // Core coloring page attributes that apply to all age groups
  const coreAttributes = "black and white smooth and clean lineart, high contrast, crisp lines on white background, no grayscale, no shading, no color";
  
  // Create specific prompt templates based on age group
  let ageSpecificPrompt = "";
  
  switch(ageGroup) {
    case "toddler":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, designed with extra-large, simple shapes and thick outlines, ensuring easy coloring for toddlers aged 1-3 years`;
      break;
    case "preschool":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, featuring bold outlines, minimal intricate details, and engaging, recognizable elements, perfect for preschoolers aged 3-5 years`;
      break;
    case "school":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, with moderate details, clear and fun designs, and interactive elements, ideal for kids aged 6-12 years to enjoy coloring`;
      break;
    case "teen":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, featuring intricate patterns, detailed backgrounds, and stylish elements, catering to the artistic preferences of teens aged 13-17 years`;
      break;
    case "adult":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, designed with high-detail elements, intricate patterns, and artistic compositions, providing a relaxing and immersive coloring experience for adults aged 18+`;
      break;
    default:
      // If no age group is selected, use a general template
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, with well-defined borders and easily colorable spaces`;
  }
  
  // Quality specifications for all age groups
  const qualityDetails = "professional quality, printable quality, coloring book style";
  
  // Combine all parts of the prompt
  let enhancedPrompt = `${ageSpecificPrompt}, ${qualityDetails}`;
  
  // Add model-specific enhancements
  if (model === "runware:flux-dev@1") {
    enhancedPrompt = `${enhancedPrompt}, professional line art illustration style`;
  }
  
  return enhancedPrompt.trim();
}
