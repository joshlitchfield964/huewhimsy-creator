
import { AgeGroup } from "./types";

/**
 * Enhances a user's prompt with age-specific details and formatting for coloring pages
 */
export function enhancePrompt(prompt: string, ageGroup?: AgeGroup, model?: string): string {
  // Core coloring page attributes - improved for better line definition
  const coreAttributes = "black and white line art, high contrast, crisp clean lines on pure white background, no grayscale, no shading, bold outlines, no color";
  
  // Create specific prompt templates based on age group
  let ageSpecificPrompt = "";
  
  switch(ageGroup) {
    case "toddler":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, designed with extra-large, simple shapes and extra thick outlines, ensuring easy coloring for toddlers aged 1-3 years`;
      break;
    case "preschool":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, featuring bold distinct outlines, minimal intricate details, and engaging, recognizable elements, perfect for preschoolers aged 3-5 years`;
      break;
    case "school":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, with moderate details, clear distinct lines and fun designs, ideal for kids aged 6-12 years to enjoy coloring`;
      break;
    case "teen":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, featuring intricate patterns, detailed elements with clear boundaries, catering to the artistic preferences of teens aged 13-17 years`;
      break;
    case "adult":
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, designed with high-detail elements, intricate patterns with distinct outlines, providing a relaxing and immersive coloring experience for adults`;
      break;
    default:
      // If no age group is selected, use a general template
      ageSpecificPrompt = `${coreAttributes} of ${prompt}, with well-defined borders and easily colorable spaces`;
  }
  
  // Quality specifications for all age groups - enhanced for better line quality
  const qualityDetails = "professional quality coloring book style, printable quality, distinct outlines";
  
  // Combine all parts of the prompt
  let enhancedPrompt = `${ageSpecificPrompt}, ${qualityDetails}`;
  
  // Add model-specific enhancements
  if (model === "rundiffusion:130@100") {
    enhancedPrompt = `${enhancedPrompt}, professional line art illustration with strong defined outlines, detailed linework with excellent edge definition, coloring book style with clear spaces for coloring`;
  } else if (model === "runware:flux-dev@1") {
    enhancedPrompt = `${enhancedPrompt}, professional line art illustration style with bold outlines`;
  } else if (model === "runware:100@1") {
    enhancedPrompt = `${enhancedPrompt}, professional clean line drawing with strong borders`;
  }
  
  return enhancedPrompt.trim();
}
